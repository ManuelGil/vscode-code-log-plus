import { WorkspaceConfiguration } from 'vscode';

import { LogTemplate } from '../types';
import {
  DEFAULT_ADD_EMPTY_LINE_AFTER_LOG_SETTING,
  DEFAULT_ADD_EMPTY_LINE_BEFORE_LOG_SETTING,
  DEFAULT_BORDER_WRAP_CHARACTER,
  DEFAULT_BORDER_WRAP_LENGTH,
  DEFAULT_CUSTOM_LOG_TEMPLATES,
  DEFAULT_ENABLE_SETTING,
  DEFAULT_EXCLUDE_PATTERNS,
  DEFAULT_HIGHLIGHT_COLOR_SETTING,
  DEFAULT_HIGHLIGHT_STYLE_SETTING,
  DEFAULT_INCLUDE_PATTERNS,
  DEFAULT_LANGUAGE_SETTING,
  DEFAULT_LITERAL_CLOSE_SETTING,
  DEFAULT_LITERAL_OPEN_SETTING,
  DEFAULT_LOG_COMMAND_SETTING,
  DEFAULT_LOG_MESSAGE_PREFIX,
  DEFAULT_LOG_MESSAGE_WRAPPED_SETTING,
  DEFAULT_MAX_SEARCH_RECURSION_DEPTH,
  DEFAULT_MESSAGE_LOG_DELIMITER,
  DEFAULT_MESSAGE_LOG_SUFFIX,
  DEFAULT_PRESERVE_GITIGNORE_SETTINGS,
  DEFAULT_SEMICOLON_REQUIRED_SETTING,
  DEFAULT_SHOW_FILE_PATH,
  DEFAULT_SUPPORTS_HIDDEN_FILES,
  DEFAULT_USE_ACCESSIBLE_LOGS_SETTING,
  DEFAULT_USE_SINGLE_QUOTES_SETTING,
} from './constants.config';

/**
 * The class that represents the configuration of the extension.
 * @example
 * const config = new ExtensionConfig(workspace.getConfiguration());
 */
export class ExtensionConfig {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties

  /**
   * Enable or disable the extension.
   * @example console.log(config.enable);
   */
  enable: boolean;

  /**
   * Default language to be used for logging.
   * @example console.log(config.defaultLanguage);
   */
  defaultLanguage: string;

  /**
   * The command used for logging messages.
   * @example console.log(config.logCommand);
   */
  logCommand: string;

  /**
   * Determine whether to wrap the log message with additional formatting or markers.
   * @example console.log(config.isLogMessageWrapped);
   */
  isLogMessageWrapped: boolean;

  /**
   * Character to be used for drawing the border in log wraps.
   * For example, an underscore (_) or an asterisk (*).
   * @example console.log(config.borderWrapCharacter);
   */
  borderWrapCharacter: string;

  /**
   * Number of times the border character will be repeated to create a border line.
   * For example, 20 to create a 20-character line.
   * @example console.log(config.borderWrapLength);
   */
  borderWrapLength: number;

  /**
   * Prefix added at the beginning of the log message.
   * @example console.log(config.logMessagePrefix);
   */
  logMessagePrefix: string;

  /**
   * Use accessible text alternatives instead of emojis for better screen reader compatibility.
   * @example console.log(config.useAccessibleLogs);
   */
  useAccessibleLogs: boolean;

  /**
   * Delimiter to separate different elements inside the log message (e.g., filename, line number, class, function, variable).
   * @example console.log(config.messageLogDelimiter);
   */
  messageLogDelimiter: string;

  /**
   * Suffix added at the end of the log message.
   * @example console.log(config.messageLogSuffix);
   */
  messageLogSuffix: string;

  /**
   * Append a semicolon at the end of the log statement if required by the programming language.
   * @example console.log(config.isSemicolonRequired);
   */
  isSemicolonRequired: boolean;

  /**
   * Insert an empty line before the log message for improved readability.
   * @example console.log(config.addEmptyLineBeforeLogMessage);
   */
  addEmptyLineBeforeLogMessage: boolean;

  /**
   * Insert an empty line after the log message for improved readability.
   * @example console.log(config.addEmptyLineAfterLog);
   */
  addEmptyLineAfterLog: boolean;

  /**
   * Use single quotes instead of double quotes in the log message.
   * @example console.log(config.useSingleQuotes);
   */
  useSingleQuotes: boolean;

  /**
   * The literal open characters for the log message.
   * @example console.log(config.literalOpen);
   */
  literalOpen: string;

  /**
   * The literal close characters for the log message.
   * @example console.log(config.literalClose);
   */
  literalClose: string;

  /**
   * Highlight color for the log statements.
   * @example console.log(config.highlightColor);
   */
  highlightColor: string;

  /**
   * Highlight style for the log statements.
   * @example console.log(config.highlightStyle);
   */
  highlightStyle: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';

  /**
   * Custom log message templates for different languages. You can define a template per language using available variables (e.g., {{{logCommand}}}, {{{logMessagePrefix}}}, {{{variableName}}}, {{{fileName}}}, {{{lineNumber}}}).
   * @example console.log(config.customLogTemplates);
   */
  customLogTemplates: LogTemplate[];

  /**
   * Glob patterns for files to include in the extension's file operations (e.g., for tree views and search).
   * @example console.log(config.includedFilePatterns);
   */
  includedFilePatterns: string[];

  /**
   * Glob patterns for files to exclude from the extension's file operations.
   */
  excludedFilePatterns: string[];

  /**
   * Maximum recursion depth for file search (0 = unlimited).
   * @example console.log(config.maxSearchRecursionDepth);
   */
  maxSearchRecursionDepth: number;

  /**
   * Whether to include hidden files in search operations.
   * @example console.log(config.supportsHiddenFiles);
   */
  supportsHiddenFiles: boolean;

  /**
   * Whether to respect .gitignore settings during file search.
   * @example console.log(config.preserveGitignoreSettings);
   */
  preserveGitignoreSettings: boolean;

  /**
   * Whether to show the file path in the search results.
   * @example console.log(config.showFilePathInResults);
   */
  showFilePathInResults: boolean;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the Config class.
   *
   * @constructor
   * @param {WorkspaceConfiguration} config - The workspace configuration
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
    // Character used to draw the border in log wraps.
    this.borderWrapCharacter = config.get<string>(
      'borderWrapCharacter',
      DEFAULT_BORDER_WRAP_CHARACTER,
    );
    // Number of times the border character is repeated to create a border line.
    this.borderWrapLength = config.get<number>(
      'borderWrapLength',
      DEFAULT_BORDER_WRAP_LENGTH,
    );
    // Prefix added at the beginning of the log message.
    this.logMessagePrefix = config.get<string>(
      'logMessagePrefix',
      DEFAULT_LOG_MESSAGE_PREFIX,
    );
    // Use accessible text alternatives instead of emojis for better screen reader compatibility
    this.useAccessibleLogs = config.get<boolean>(
      'useAccessibleLogs',
      DEFAULT_USE_ACCESSIBLE_LOGS_SETTING,
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
      DEFAULT_ADD_EMPTY_LINE_BEFORE_LOG_SETTING,
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
    // Glob patterns for files to include in the extension's file operations (e.g., for tree views and search).
    this.includedFilePatterns = config.get<string[]>(
      'files.includedFilePatterns',
      DEFAULT_INCLUDE_PATTERNS,
    );
    // Glob patterns for files to exclude from the extension's file operations.
    this.excludedFilePatterns = config.get<string[]>(
      'files.excludedFilePatterns',
      DEFAULT_EXCLUDE_PATTERNS,
    );
    // Maximum recursion depth for file search (0 = unlimited).
    this.maxSearchRecursionDepth = config.get<number>(
      'files.maxSearchRecursionDepth',
      DEFAULT_MAX_SEARCH_RECURSION_DEPTH,
    );
    // Whether to include hidden files in search operations.
    this.supportsHiddenFiles = config.get<boolean>(
      'files.supportsHiddenFiles',
      DEFAULT_SUPPORTS_HIDDEN_FILES,
    );
    // Whether to respect .gitignore settings during file search.
    this.preserveGitignoreSettings = config.get<boolean>(
      'files.preserveGitignoreSettings',
      DEFAULT_PRESERVE_GITIGNORE_SETTINGS,
    );
    // Whether to show the file path in the search results.
    this.showFilePathInResults = config.get<boolean>(
      'files.includeFilePath',
      DEFAULT_SHOW_FILE_PATH,
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
    // Character used to draw the border in log wraps.
    this.borderWrapCharacter = config.get<string>(
      'borderWrapCharacter',
      this.borderWrapCharacter,
    );
    // Number of times the border character is repeated to create a border line.
    this.borderWrapLength = config.get<number>(
      'borderWrapLength',
      this.borderWrapLength,
    );
    // Prefix added at the beginning of the log message.
    this.logMessagePrefix = config.get<string>(
      'logMessagePrefix',
      this.logMessagePrefix,
    );
    // Use accessible text alternatives instead of emojis for better screen reader compatibility
    this.useAccessibleLogs = config.get<boolean>(
      'useAccessibleLogs',
      this.useAccessibleLogs,
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
    // Glob patterns for files to include in the extension's file operations (e.g., for tree views and search).
    this.includedFilePatterns = config.get<string[]>(
      'files.includedFilePatterns',
      this.includedFilePatterns,
    );
    // Glob patterns for files to exclude from the extension's file operations.
    this.excludedFilePatterns = config.get<string[]>(
      'files.excludedFilePatterns',
      this.excludedFilePatterns,
    );
    // Maximum recursion depth for file search (0 = unlimited).
    this.maxSearchRecursionDepth = config.get<number>(
      'files.maxSearchRecursionDepth',
      this.maxSearchRecursionDepth,
    );
    // Whether to include hidden files in search operations.
    this.supportsHiddenFiles = config.get<boolean>(
      'files.supportsHiddenFiles',
      this.supportsHiddenFiles,
    );
    // Whether to respect .gitignore settings during file search.
    this.preserveGitignoreSettings = config.get<boolean>(
      'files.preserveGitignoreSettings',
      this.preserveGitignoreSettings,
    );
    // Whether to show the file path in the search results.
    this.showFilePathInResults = config.get<boolean>(
      'files.includeFilePath',
      this.showFilePathInResults,
    );
  }
}
