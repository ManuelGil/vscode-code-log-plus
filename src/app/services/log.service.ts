import * as mustache from 'mustache';

import { ExtensionConfig } from '../configs';
import { escapeRegExp } from '../helpers';
import {
  defaultLogCommand,
  defaultTemplates,
  LogTemplate,
  supportedLanguages,
} from '../types';

/**
 * Service for handling log generation and parsing logic.
 */
export class LogService {
  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Creates an instance of LogService.
   * @param config - The extension's configuration.
   */
  constructor(readonly config: ExtensionConfig) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * Generates a log snippet based on a template and context.
   * @param indent - The indentation string for the log.
   * @param fileName - The name of the file where the log is being inserted.
   * @param functionName - The name of the containing function.
   * @param variableName - The name of the variable to log.
   * @param lineNumber - The line number for the log.
   * @param languageId - The language identifier of the document.
   * @returns The formatted log snippet.
   */
  generateLogSnippet(
    indent: string,
    fileName: string,
    functionName: string,
    variableName: string,
    lineNumber: number,
    languageId: string,
  ): string {
    const {
      defaultLanguage,
      isLogMessageWrapped,
      borderWrapCharacter,
      borderWrapLength,
      addEmptyLineBeforeLogMessage,
      addEmptyLineAfterLog,
    } = this.config;

    // Determine effective language: if not supported, use default from config.
    const language = supportedLanguages.includes(languageId)
      ? languageId
      : defaultLanguage;

    // Get the log snippet template (custom or default) for the effective language.
    const template = this.getLogSnippetTemplate(language);
    if (!template) {
      return '';
    }

    // Build the context for rendering the template.
    const renderContext = this.buildRenderContext({
      indent,
      fileName,
      functionName,
      variableName,
      lineNumber,
      language, // use the effective language
    });

    // Render the snippet using Mustache.
    let snippet = mustache.render(template, renderContext);

    // Wrap the content if configured.
    snippet = this.wrapContent(
      snippet,
      renderContext.indent,
      renderContext.logCommand,
      renderContext.quote,
      renderContext.logMessagePrefix,
      renderContext.messageLogDelimiter,
      isLogMessageWrapped,
      borderWrapCharacter,
      borderWrapLength,
      addEmptyLineBeforeLogMessage,
      addEmptyLineAfterLog,
    );

    // Remove the semicolon at the end of each line if not required.
    if (!this.config.isSemicolonRequired) {
      snippet = snippet.replace(/;$/gm, '');
    }

    return snippet;
  }

  /**
   * Finds all log entries in the given code for a specific language.
   * @param code - The source code to search within.
   * @param languageId - The language identifier to determine the log command.
   * @returns An array of log entry objects.
   */
  findLogEntries(
    code: string,
    languageId: string,
  ): Array<{
    start: number;
    end: number;
    line: number;
    preview: string;
    fullText: string;
  }> {
    const resolvedCommand = this.getLogCommand(languageId);
    const escapedCommand = escapeRegExp(resolvedCommand);
    const logPattern = new RegExp(`${escapedCommand}\\s*\\(`, 'g');

    const logRanges: Array<{
      start: number;
      end: number;
      line: number;
      preview: string;
      fullText: string;
    }> = [];

    let match: RegExpExecArray | null;

    while ((match = logPattern.exec(code))) {
      const start = match.index;
      const end = this.findClosingParenthesis(code, start);
      const line = code.slice(0, start).split('\n').length;
      const preview = code.slice(start, start + 25).trim() + '...';
      const fullText = code.slice(start, end).trim();

      logRanges.push({ start, end, line, preview, fullText });
    }

    return logRanges;
  }

  /**
   * Retrieves the log command for a given language.
   * @param languageId - The language identifier.
   * @returns The log command (e.g., 'console.log').
   */
  getLogCommand(languageId: string): string {
    const { logCommand } = this.config;
    return (
      logCommand ||
      defaultLogCommand[languageId] ||
      defaultLogCommand.javascript
    );
  }

  /**
   * Gets the log snippet template for a given language.
   * @param language - The language identifier.
   * @returns The template string or null if not found.
   */
  private getLogSnippetTemplate(language: string): string | null {
    const { customLogTemplates } = this.config;

    // Use the effective language when searching for a template.
    const templateConfig = this.getTemplateForLanguage(
      language,
      customLogTemplates,
    );
    if (!templateConfig || !templateConfig.template) {
      return null;
    }

    return templateConfig.template.endsWith('\n')
      ? templateConfig.template
      : templateConfig.template + '\n';
  }

  /**
   * Builds the context object used for rendering the Mustache template.
   * @param params - The parameters needed to build the context.
   * @returns The context object for template rendering.
   */
  private buildRenderContext(params: {
    indent: string;
    fileName: string;
    functionName: string;
    variableName: string;
    lineNumber: number;
    language: string;
  }): {
    indent: string;
    logCommand: string;
    quote: string;
    logMessagePrefix: string;
    messageLogDelimiter: string;
    fileName: string;
    lineNumber: number;
    functionName: string;
    variableName: string;
    messageLogSuffix: string;
    literalOpen: string;
    literalClose: string;
  } {
    const {
      logCommand,
      useSingleQuotes,
      logMessagePrefix,
      messageLogDelimiter,
      messageLogSuffix,
      literalOpen,
      literalClose,
      useAccessibleLogs,
    } = this.config;

    const defaultLogCmd = defaultLogCommand[params.language];

    // Convert emoji prefixes to accessible alternatives when needed
    let accessiblePrefix = logMessagePrefix;
    if (useAccessibleLogs) {
      // Map common emoji prefixes to text alternatives
      const emojiToText: Record<string, string> = {
        '🔍': '[DEBUG]',
        '⚠️': '[WARNING]',
        '❌': '[ERROR]',
        '✅': '[SUCCESS]',
        '📝': '[INFO]',
        '🚀': '[LAUNCH]',
        '💡': '[TIP]',
        '🛑': '[STOP]',
        '⭐': '[IMPORTANT]',
        '🔄': '[UPDATE]',
        '🔒': '[SECURE]',
        '📊': '[DATA]',
      };

      // Replace emoji with text equivalent if it exists, otherwise use the original
      accessiblePrefix = emojiToText[logMessagePrefix] || logMessagePrefix;
    }

    return {
      indent: params.indent,
      logCommand: logCommand || defaultLogCmd || 'console.log',
      quote: useSingleQuotes ? "'" : '"',
      logMessagePrefix: accessiblePrefix,
      messageLogDelimiter: messageLogDelimiter
        ? ` ${messageLogDelimiter} `
        : '',
      fileName: params.fileName,
      lineNumber: params.lineNumber,
      functionName: params.functionName,
      variableName: params.variableName,
      messageLogSuffix,
      literalOpen,
      literalClose,
    };
  }

  /**
   * Wraps the log content with a border and adds empty lines if configured.
   * @returns The wrapped content string.
   */
  private wrapContent(
    content: string,
    indent: string,
    logCommand: string,
    quote: string,
    logMessagePrefix: string,
    messageLogDelimiter: string,
    isWrapped: boolean,
    borderCharacter: string,
    borderLength: number,
    addEmptyBefore: boolean,
    addEmptyAfter: boolean,
  ): string {
    if (isWrapped) {
      const border = `${indent}${logCommand}(${quote}${logMessagePrefix}${messageLogDelimiter}${borderCharacter.repeat(borderLength)}${messageLogDelimiter}${quote});`;
      content = `${border}\n${content}${border}\n`;
    }

    if (addEmptyBefore) {
      content = `\n${content}`;
    }

    if (addEmptyAfter) {
      content = `${content}\n`;
    }

    return content;
  }

  /**
   * Finds the index of the closing parenthesis for a log statement.
   * @param code - The source code to search.
   * @param startIndex - The starting index of the opening parenthesis.
   * @returns The index of the character after the closing parenthesis.
   */
  private findClosingParenthesis(code: string, startIndex: number): number {
    let openCount = 0;
    for (let i = startIndex; i < code.length; i++) {
      if (code[i] === '(') {
        openCount++;
      } else if (code[i] === ')') {
        openCount--;
        if (openCount === 0) {
          return i + 1;
        }
      }
    }
    return code.length;
  }

  /**
   * Retrieves the template for a given language, checking custom templates first.
   * @param language - The language identifier.
   * @param customLogTemplates - Optional array of custom log templates.
   * @returns The matching log template or null.
   */
  private getTemplateForLanguage(
    language: string,
    customLogTemplates?: LogTemplate[],
  ): LogTemplate | null {
    if (customLogTemplates) {
      const custom = customLogTemplates.find(
        (template) => template.language === language,
      );
      if (custom) {
        return custom;
      }
    }
    const defaultTemplate = defaultTemplates.find(
      (template) => template.language === language,
    );
    return defaultTemplate || null;
  }
}
