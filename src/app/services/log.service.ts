import * as mustache from 'mustache';
import { ExtensionConfig } from '../configs';

/**
 * The LogCommandMap interface.
 * Represents the log command map.
 * @interface LogCommandMap
 * @example
 * const logCommandMap: LogCommandMap = {
 *  javascript: 'console.log',
 *  typescript: 'console.log',
 *  java: 'System.out.println',
 *  csharp: 'Console.WriteLine',
 *  php: 'echo',
 *  dart: 'print',
 *  python: 'print',
 *  cpp: 'std::cout',
 *  ruby: 'puts',
 *  go: 'fmt.Println',
 * };
 */
interface LogCommandMap {
  [language: string]: string;
}

/**
 * The LogTemplate interface.
 * Represents the log template.
 * @interface LogTemplate
 * @example
 * const logTemplate: LogTemplate = {
 *  language: 'javascript',
 *  template: '{{{indent}}}{{{logCommand}}}({{{variableName}}});',
 * };
 */
interface LogTemplate {
  language: string;
  template: string;
}

/**
 * The LogService class.
 *
 * @class
 * @classdesc The class that represents the log service.
 * @export
 * @public
 * @example
 * const logService = new LogService(config);
 */
export class LogService {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Private properties

  /**
   * The default log command for the log snippets.
   * @private
   * @type {Array<{ language: string; command: string }>}
   * @memberof LogController
   * @example
   * this.defaultLogCommand;
   */
  private defaultLogCommand: LogCommandMap = {
    javascript: 'console.log',
    typescript: 'console.log',
    java: 'System.out.println',
    csharp: 'Console.WriteLine',
    php: 'echo',
    dart: 'print',
    python: 'print',
    cpp: 'std::cout',
    ruby: 'puts',
    go: 'fmt.Println',
  };

  /**
   * The default templates for the log snippets.
   *
   * @private
   * @type {Array<{ language: string; template: string }>}
   * @memberof LogController
   * @example
   * this.defaultTemplates;
   */
  private defaultTemplates: LogTemplate[] = [
    {
      language: 'javascript',
      template:
        '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}, {{{variableName}}});\n',
    },
    {
      language: 'typescript',
      template:
        '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}, {{{variableName}}});\n',
    },
    {
      language: 'java',
      template:
        '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} + {{{variableName}}});\n',
    },
    {
      language: 'csharp',
      template:
        '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} + {{{variableName}}});\n',
    },
    {
      language: 'php',
      template:
        '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} . {{{variableName}}});\n',
    },
    {
      language: 'dart',
      template:
        '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} + {{{variableName}}});\n',
    },
    {
      language: 'python',
      template:
        '{{{indent}}}{{{logCommand}}}(f{{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{literalOpen}}}{{{variableName}}}{{{literalClose}}}{{{messageLogSuffix}}}{{{quote}}});\n',
    },
    {
      language: 'cpp',
      template:
        '{{{indent}}}{{{logCommand}}} << {{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} << {{{variableName}}} << std::endl;\n',
    },
    {
      language: 'ruby',
      template:
        '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}#{{{literalOpen}}}{{{variableName}}}{{{literalClose}}}{{{messageLogSuffix}}}{{{quote}}});\n',
    },
    {
      language: 'go',
      template:
        '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}, {{{variableName}}})\n',
    },
  ];

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the LogService class
   *
   * @constructor
   * @param {ExtensionConfig} config - The configuration object
   * @public
   * @memberof LogService
   * @example
   * this.logService = new LogService(config);
   *
   * @returns {LogService} - The log service
   */
  constructor(readonly config: ExtensionConfig) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * The generateLogSnippet method.
   * Generate a log snippet for the specified file and variable.
   * @function generateLogSnippet
   * @public
   * @memberof LogService
   * @example
   * this.logService.generateLogSnippet(indent, fileName, variableName, lineNumber);
   *
   * @param {string} indent - The indentation string
   * @param {string} fileName - The name of the file
   * @param {string} variableName - The name of the variable
   * @param {number} lineNumber - The line number
   *
   * @returns {string} - The log snippet
   */
  generateLogSnippet(
    indent: string,
    fileName: string,
    functionName: string,
    variableName: string,
    lineNumber: number,
  ): string {
    const template = this.getLogSnippetTemplate();
    if (!template) {
      return '';
    }

    const renderContext = this.buildRenderContext({
      indent,
      fileName,
      functionName,
      variableName,
      lineNumber,
    });

    let snippet = mustache.render(template, renderContext);

    snippet = this.wrapContent(
      snippet,
      renderContext.indent,
      renderContext.logCommand,
      renderContext.quote,
      renderContext.logMessagePrefix,
      renderContext.messageLogDelimiter,
      this.config.isLogMessageWrapped,
      this.config.addEmptyLineBeforeLogMessage,
      this.config.addEmptyLineAfterLog,
    );

    if (!this.config.isSemicolonRequired) {
      snippet = snippet.replace(/;$/gm, '');
    }

    return snippet;
  }

  /**
   * The findLogEntries method.
   * Find the log ranges in the specified code.
   * @function findLogEntries
   * @public
   * @memberof LogService
   * @example
   * this.logService.findLogEntries(code);
   *
   * @param {string} code - The code to search for logs
   *
   * @returns {Array<{ start: number; end: number; line: number; preview: string; fullText: string }>} - The log ranges
   */
  findLogEntries(code: string): Array<{
    start: number;
    end: number;
    line: number;
    preview: string;
    fullText: string;
  }> {
    const { defaultLanguage, logCommand } = this.config;
    const defaultLogCmd =
      this.defaultLogCommand[
        defaultLanguage as keyof typeof this.defaultLogCommand
      ];
    const resolvedCommand = logCommand || defaultLogCmd || 'console.log';
    const escapedCommand = this.escapeRegExp(resolvedCommand);
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

  // Private methods

  /**
   * The getLogSnippetTemplate method.
   * Get the log snippet template.
   * @function getLogSnippetTemplate
   * @private
   * @memberof LogService
   * @example
   * this.getLogSnippetTemplate();
   *
   * @returns {string | null} - The log snippet template
   */
  private getLogSnippetTemplate(): string | null {
    const { defaultLanguage, customLogTemplates } = this.config;
    const templateConfig = this.getTemplateForLanguage(
      defaultLanguage,
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
   * The buildRenderContext method.
   * Build the render context for the log snippet.
   * @function buildRenderContext
   * @private
   * @memberof LogService
   * @example
   * this.buildRenderContext(params);
   *
   * @param {Object} params - The parameters object
   * @param {string} params.indent - The indentation string
   * @param {string} params.fileName - The name of the file
   * @param {string} params.functionName - The name of the function
   * @param {string} params.variableName - The name of the variable
   * @param {number} params.lineNumber - The line number
   *
   * @returns {Object} - The render context
   */
  private buildRenderContext(params: {
    indent: string;
    fileName: string;
    functionName: string;
    variableName: string;
    lineNumber: number;
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
      defaultLanguage,
      useSingleQuotes,
      logMessagePrefix,
      messageLogDelimiter,
      messageLogSuffix,
      literalOpen,
      literalClose,
    } = this.config;

    const defaultLogCmd =
      this.defaultLogCommand[
        defaultLanguage as keyof typeof this.defaultLogCommand
      ];

    return {
      indent: params.indent,
      logCommand: logCommand || defaultLogCmd || 'console.log',
      quote: useSingleQuotes ? "'" : '"',
      logMessagePrefix,
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
   * The wrapContent method.
   * Wrap the log content with the specified border.
   * @function wrapContent
   * @private
   * @memberof LogService
   * @example
   * this.wrapContent(
   *  content,
   *  indent,
   *  logCommand,
   *  quote,
   *  logMessagePrefix,
   *  messageLogDelimiter,
   *  isWrapped,
   *  addEmptyBefore,
   *  addEmptyAfter,
   * );
   *
   * @param {string} content - The content to wrap
   * @param {string} indent - The indentation string
   * @param {string} logCommand - The log command
   * @param {string} quote - The quote character
   * @param {string} logMessagePrefix - The log message prefix
   * @param {string} messageLogDelimiter - The message log delimiter
   * @param {boolean} isWrapped - Whether the content is wrapped
   * @param {boolean} addEmptyBefore - Whether to add an empty line before the content
   * @param {boolean} addEmptyAfter - Whether to add an empty line after the content
   *
   * @returns {string} - The wrapped content
   */
  private wrapContent(
    content: string,
    indent: string,
    logCommand: string,
    quote: string,
    logMessagePrefix: string,
    messageLogDelimiter: string,
    isWrapped: boolean,
    addEmptyBefore: boolean,
    addEmptyAfter: boolean,
  ): string {
    if (isWrapped) {
      const border = `${indent}${logCommand}(${quote}${logMessagePrefix}${messageLogDelimiter}----------------------------${messageLogDelimiter}${quote});`;
      content = `${border}\n${content}\n${border}`;
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
   * The escapeRegExp method.
   * Escape the regular expression special characters.
   * @function escapeRegExp
   * @private
   * @memberof LogService
   * @example
   * this.escapeRegExp(str);
   *
   * @param {string} str - The string to escape
   *
   * @returns {string} - The escaped string
   */
  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * The findClosingParenthesis method.
   * Find the closing parenthesis in the code.
   * @function findClosingParenthesis
   * @private
   * @memberof LogService
   * @example
   * this.findClosingParenthesis(code, startIndex);
   *
   * @param {string} code - The code to search
   * @param {number} startIndex - The start index
   *
   * @returns {number} - The closing parenthesis index
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
   * The getTemplateForLanguage method.
   * Get the template for the specified language.
   * @function getTemplateForLanguage
   * @private
   * @memberof LogService
   * @example
   * this.getTemplateForLanguage(language, customLogTemplates);
   *
   * @param {string} language - The language to search for
   * @param {LogTemplate[]} customLogTemplates - The custom log templates
   *
   * @returns {LogTemplate | null} - The log template
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
    const defaultTemplate = this.defaultTemplates.find(
      (template) => template.language === language,
    );
    return defaultTemplate || null;
  }
}
