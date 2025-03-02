import { WorkspaceConfiguration } from 'vscode';

import { LogTemplate } from '../types';
import {
  DEFAULT_ADD_EMPTY_LINE_AFTER_LOG_SETTING,
  DEFAULT_ADD_EMPTY_LINE_BEFORE_LOG_MESSAGE_SETTING,
  DEFAULT_CUSTOM_LOG_TEMPLATES,
  DEFAULT_ENABLE_SETTING,
  DEFAULT_HIGHLIGHT_COLOR_SETTING,
  DEFAULT_HIGHLIGHT_STYLE_SETTING,
  DEFAULT_LANGUAGE_SETTING,
  DEFAULT_LITERAL_CLOSE_SETTING,
  DEFAULT_LITERAL_OPEN_SETTING,
  DEFAULT_LOG_COMMAND_SETTING,
  DEFAULT_LOG_MESSAGE_PREFIX,
  DEFAULT_LOG_MESSAGE_WRAPPED_SETTING,
  DEFAULT_MESSAGE_LOG_DELIMITER,
  DEFAULT_MESSAGE_LOG_SUFFIX,
  DEFAULT_SEMICOLON_REQUIRED_SETTING,
  DEFAULT_USE_SINGLE_QUOTES_SETTING,
} from './constants.config';

/**
 * The Config class.
 *
 * @class
 * @classdesc The class that represents the configuration of the extension.
 * @export
 * @public
 * @property {WorkspaceConfiguration} config - The workspace configuration
 * @example
 * const config = new Config(workspace.getConfiguration());
 * console.log(config.includeExtensionOnExport);
 * console.log(config.exclude);
 */
export class ExtensionConfig {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties

  /**
   * Enable or disable the extension.
   * @type {boolean}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.enable);
   * @default true
   */
  enable: boolean;

  /**
   * Default language to be used for logging.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.defaultLanguage);
   * @default "javascript"
   */
  defaultLanguage: string;

  /**
   * The command used for logging messages.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.logCommand);
   * @default ""
   */
  logCommand: string;

  /**
   * Determine whether to wrap the log message with additional formatting or markers.
   * @type {boolean}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.isLogMessageWrapped);
   * @default false
   */
  isLogMessageWrapped: boolean;

  /**
   * Prefix added at the beginning of the log message.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.logMessagePrefix);
   * @default "🔍"
   */
  logMessagePrefix: string;

  /**
   * Delimiter to separate different elements inside the log message (e.g., filename, line number, class, function, variable).
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.messageLogDelimiter);
   * @default "~"
   */
  messageLogDelimiter: string;

  /**
   * Suffix added at the end of the log message.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.messageLogSuffix);
   * @default ":"
   */
  messageLogSuffix: string;

  /**
   * Append a semicolon at the end of the log statement if required by the programming language.
   * @type {boolean}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.isSemicolonRequired);
   * @default false
   */
  isSemicolonRequired: boolean;

  /**
   * Insert an empty line before the log message for improved readability.
   * @type {boolean}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.addEmptyLineBeforeLogMessage);
   * @default false
   */
  addEmptyLineBeforeLogMessage: boolean;

  /**
   * Insert an empty line after the log message for improved readability.
   * @type {boolean}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.addEmptyLineAfterLog);
   * @default false
   */
  addEmptyLineAfterLog: boolean;

  /**
   * Use single quotes instead of double quotes in the log message.
   * @type {boolean}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.useSingleQuotes);
   * @default false
   */
  useSingleQuotes: boolean;

  /**
   * The literal open characters for the log message.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.literalOpen);
   * @default "{"
   */
  literalOpen: string;

  /**
   * The literal close characters for the log message.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.literalClose);
   * @default "}"
   */
  literalClose: string;

  /**
   * Highlight color for the log statements.
   * @type {string}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.highlightColor);
   * @default "#FFD700"
   */
  highlightColor: string;

  /**
   * Highlight style for the log statements.
   * @type {'solid' | 'double' | 'dotted' | 'dashed' | 'wavy'}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.highlightStyle);
   * @default "wavy"
   */
  highlightStyle: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';

  /**
   * Custom log message templates for different languages. You can define a template per language using available variables (e.g., {{{logCommand}}}, {{{logMessagePrefix}}}, {{{functionName}}}, {{{variableName}}}, {{{filename}}}, {{{lineNumber}}}).
   * @type {LogTemplate[]}
   * @public
   * @memberof ExtensionConfig
   * @example
   * console.log(config.customLogTemplates);
   * @default
   * ```typescript
   * []
   * ```
   * @default []
   */
  customLogTemplates: LogTemplate[];

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the Config class.
   *
   * @constructor
   * @param {WorkspaceConfiguration} config - The workspace configuration
   * @public
   * @memberof Config
   */
  constructor(readonly config: WorkspaceConfiguration) {
    // Enable or disable the extension.
    this.enable = config.get<boolean>('enable', DEFAULT_ENABLE_SETTING);
    // Default language to be used for logging.
    this.defaultLanguage = config.get<string>(
      'defaultLanguage',
      DEFAULT_LANGUAGE_SETTING,
    );
    // The command used for logging messages.
    this.logCommand = config.get<string>(
      'logCommand',
      DEFAULT_LOG_COMMAND_SETTING,
    );
    // Determine whether to wrap the log message with additional formatting or markers
    this.isLogMessageWrapped = config.get<boolean>(
      'isLogMessageWrapped',
      DEFAULT_LOG_MESSAGE_WRAPPED_SETTING,
    );
    // Prefix added at the beginning of the log message.
    this.logMessagePrefix = config.get<string>(
      'logMessagePrefix',
      DEFAULT_LOG_MESSAGE_PREFIX,
    );
    // Delimiter to separate different elements inside the log message (e.g., filename, line number, class, function, variable).
    this.messageLogDelimiter = config.get<string>(
      'messageLogDelimiter',
      DEFAULT_MESSAGE_LOG_DELIMITER,
    );
    // Suffix added at the end of the log message.
    this.messageLogSuffix = config.get<string>(
      'messageLogSuffix',
      DEFAULT_MESSAGE_LOG_SUFFIX,
    );
    // Append a semicolon at the end of the log statement if required by the programming language.
    this.isSemicolonRequired = config.get<boolean>(
      'isSemicolonRequired',
      DEFAULT_SEMICOLON_REQUIRED_SETTING,
    );
    // Insert an empty line before the log message for improved readability.
    this.addEmptyLineBeforeLogMessage = config.get<boolean>(
      'addEmptyLineBeforeLogMessage',
      DEFAULT_ADD_EMPTY_LINE_BEFORE_LOG_MESSAGE_SETTING,
    );
    // Insert an empty line after the log message for improved readability.
    this.addEmptyLineAfterLog = config.get<boolean>(
      'addEmptyLineAfterLog',
      DEFAULT_ADD_EMPTY_LINE_AFTER_LOG_SETTING,
    );
    // Use single quotes instead of double quotes in the log message.
    this.useSingleQuotes = config.get<boolean>(
      'useSingleQuotes',
      DEFAULT_USE_SINGLE_QUOTES_SETTING,
    );
    // The literal open characters for the log message.
    this.literalOpen = config.get<string>(
      'literalOpen',
      DEFAULT_LITERAL_OPEN_SETTING,
    );
    // The literal close characters for the log message
    this.literalClose = config.get<string>(
      'literalClose',
      DEFAULT_LITERAL_CLOSE_SETTING,
    );
    // Highlight color for the log statements.
    this.highlightColor = config.get<string>(
      'highlightColor',
      DEFAULT_HIGHLIGHT_COLOR_SETTING,
    );
    // Highlight style for the log statements.
    this.highlightStyle = config.get<
      'solid' | 'double' | 'dotted' | 'dashed' | 'wavy'
    >('highlightStyle', DEFAULT_HIGHLIGHT_STYLE_SETTING);
    // Custom log message templates for different languages. You can define a template per language using available variables (e.g., {{{logCommand}}}, {{{logMessagePrefix}}}, {{{variableName}}}, {{{fileName}}}, {{{lineNumber}}}).
    this.customLogTemplates = config.get<LogTemplate[]>(
      'customLogTemplates',
      DEFAULT_CUSTOM_LOG_TEMPLATES,
    );
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * The update method.
   *
   * @function update
   * @param {WorkspaceConfiguration} config - The workspace configuration
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * config.update(workspace.getConfiguration());
   */
  update(config: WorkspaceConfiguration): void {
    // Enable or disable the extension.
    this.enable = config.get<boolean>('enable', this.enable);
    // Default language to be used for logging.
    this.defaultLanguage = config.get<string>(
      'defaultLanguage',
      this.defaultLanguage,
    );
    // The command used for logging messages.
    this.logCommand = config.get<string>('logCommand', this.logCommand);
    // Determine whether to wrap the log message with additional formatting or markers
    this.isLogMessageWrapped = config.get<boolean>(
      'isLogMessageWrapped',
      this.isLogMessageWrapped,
    );
    // Prefix added at the beginning of the log message.
    this.logMessagePrefix = config.get<string>(
      'logMessagePrefix',
      this.logMessagePrefix,
    );
    // Delimiter to separate different elements inside the log message (e.g., filename, line number, class, function, variable).
    this.messageLogDelimiter = config.get<string>(
      'messageLogDelimiter',
      this.messageLogDelimiter,
    );
    // Suffix added at the end of the log message.
    this.messageLogSuffix = config.get<string>(
      'messageLogSuffix',
      this.messageLogSuffix,
    );
    // Append a semicolon at the end of the log statement if required by the programming language.
    this.isSemicolonRequired = config.get<boolean>(
      'isSemicolonRequired',
      this.isSemicolonRequired,
    );
    // Insert an empty line before the log message for improved readability.
    this.addEmptyLineBeforeLogMessage = config.get<boolean>(
      'addEmptyLineBeforeLogMessage',
      this.addEmptyLineBeforeLogMessage,
    );
    // Insert an empty line after the log message for improved readability.
    this.addEmptyLineAfterLog = config.get<boolean>(
      'addEmptyLineAfterLog',
      this.addEmptyLineAfterLog,
    );
    // Use single quotes instead of double quotes in the log message.
    this.useSingleQuotes = config.get<boolean>(
      'useSingleQuotes',
      this.useSingleQuotes,
    );
    // The literal open characters for the log message.
    this.literalOpen = config.get<string>('literalOpen', this.literalOpen);
    // The literal close characters for the log message
    this.literalClose = config.get<string>('literalClose', this.literalClose);
    // Highlight color for the log statements.
    this.highlightColor = config.get<string>(
      'highlightColor',
      this.highlightColor,
    );
    // Highlight style for the log statements.
    this.highlightStyle = config.get<
      'solid' | 'double' | 'dotted' | 'dashed' | 'wavy'
    >('highlightStyle', this.highlightStyle);
    // Custom log message templates for different languages. You can define a template per language using available variables (e.g., {{{logCommand}}}, {{{logMessagePrefix}}}, {{{variableName}}}, {{{fileName}}}, {{{lineNumber}}}).
    this.customLogTemplates = config.get<LogTemplate[]>(
      'customLogTemplates',
      this.customLogTemplates,
    );
  }
}
