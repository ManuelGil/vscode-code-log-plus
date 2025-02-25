import * as mustache from 'mustache';
import { ExtensionConfig } from '../configs';

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
  private defaultLogCommand = [
    { language: 'javascript', command: 'console.log' },
    { language: 'typescript', command: 'console.log' },
    { language: 'java', command: 'System.out.println' },
    { language: 'csharp', command: 'Console.WriteLine' },
    { language: 'php', command: 'echo' },
    { language: 'dart', command: 'print' },
    { language: 'python', command: 'print' },
    { language: 'cpp', command: 'std::cout' },
    { language: 'ruby', command: 'puts' },
    { language: 'go', command: 'fmt.Println' },
  ];

  /**
   * The default templates for the log snippets.
   *
   * @private
   * @type {Array<{ language: string; template: string }>}
   * @memberof LogController
   * @example
   * this.defaultTemplates;
   */
  private defaultTemplates = [
    {
      language: 'javascript',
      template:
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{variableName}}{{messageLogSuffix}}{{{quote}}}, {{variableName}});',
    },
    {
      language: 'typescript',
      template:
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{variableName}}{{messageLogSuffix}}{{{quote}}}, {{variableName}});',
    },
    {
      language: 'java',
      template:
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{variableName}}{{messageLogSuffix}}{{{quote}}} + {{variableName}});',
    },
    {
      language: 'csharp',
      template:
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{variableName}}{{messageLogSuffix}}{{{quote}}} + {{variableName}});',
    },
    {
      language: 'php',
      template:
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{variableName}}{{messageLogSuffix}}{{{quote}}} . {{variableName}});',
    },
    {
      language: 'dart',
      template:
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{variableName}}{{messageLogSuffix}}{{{quote}}} + {{variableName}});',
    },
    {
      language: 'python',
      template:
        '{{indent}}{{logCommand}}(f{{quote}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{{literalOpen}}}{{variableName}}{{{literalClose}}}{{messageLogSuffix}}{{quote}});',
    },
    {
      language: 'cpp',
      template:
        '{{indent}}{{logCommand}} << {{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{variableName}}{{messageLogSuffix}}{{{quote}}} << {{variableName}} << std::endl;',
    },
    {
      language: 'ruby',
      template:
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}#{{{literalOpen}}}{{variableName}}{{{literalClose}}}{{messageLogSuffix}}{{{quote}}});',
    },
    {
      language: 'go',
      template:
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}}{{{fileName}}}:{{lineNumber}}{{messageLogDelimiter}}{{variableName}}{{messageLogSuffix}}{{{quote}}}, {{variableName}})',
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
  public generateLogSnippet(
    indent: string,
    fileName: string,
    variableName: string,
    lineNumber: number,
  ): string {
    const {
      defaultLanguage,
      logCommand,
      isLogMessageWrapped,
      logMessagePrefix,
      messageLogDelimiter,
      messageLogSuffix,
      isSemicolonRequired,
      addEmptyLineBeforeLogMessage,
      addEmptyLineAfterLog,
      useSingleQuotes,
      literalOpen,
      literalClose,
      customLogTemplates,
    } = this.config;

    const defaultLogCommand = this.defaultLogCommand.find(
      (command) => command.language === defaultLanguage,
    );

    const template = customLogTemplates.find(
      (template) => template.language === defaultLanguage,
    );

    const defaultTemplate = this.defaultTemplates.find(
      (template) => template.language === defaultLanguage,
    );

    if (!template && !defaultTemplate) {
      return '';
    }

    let content = '';

    content =
      template?.template ||
      defaultTemplate?.template ||
      '{{indent}}{{logCommand}}({{variableName}});';

    if (isLogMessageWrapped) {
      const logMessageFormat =
        '{{indent}}{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{messageLogDelimiter}} ---------------------------- {{messageLogDelimiter}}{{{quote}}});';
      content = `${logMessageFormat}\n${content}\n${logMessageFormat}`;
    }

    if (!isSemicolonRequired) {
      content = content.replace(';', '');
    }

    if (addEmptyLineBeforeLogMessage) {
      content = `\n${content}`;
    }

    if (addEmptyLineAfterLog) {
      content = `${content}\n`;
    }

    content = `${content}\n`;

    const snippet = mustache.render(content, {
      indent,
      logCommand: logCommand || defaultLogCommand?.command || 'console.log',
      quote: useSingleQuotes ? "'" : '"',
      logMessagePrefix,
      messageLogDelimiter: messageLogDelimiter
        ? ` ${messageLogDelimiter} `
        : '',
      fileName,
      lineNumber,
      variableName,
      messageLogSuffix,
      literalOpen,
      literalClose,
    });

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

    const defaultLogCommand = this.defaultLogCommand.find(
      (command) => command.language === defaultLanguage,
    );

    const resolvedCommand =
      logCommand || defaultLogCommand?.command || 'console.log';

    const logRanges: Array<{
      start: number;
      end: number;
      line: number;
      preview: string;
      fullText: string;
    }> = [];
    const logPattern = new RegExp(
      resolvedCommand.replace(/\./g, '\\.') + '\\s*\\(',
      'g',
    );

    let match: RegExpExecArray | null;
    while ((match = logPattern.exec(code))) {
      const start = match.index;
      const end = code.indexOf(')', start) + 1;
      const line = code.slice(0, start).split('\n').length;
      const preview = code
        .slice(start, start + 25)
        .concat('...')
        .trim();
      const fullText = code.slice(start, end).trim();

      logRanges.push({ start, end, line, preview, fullText });
    }

    return logRanges;
  }
}
