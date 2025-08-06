import { LogTemplate } from '../types';

/**
 * The unique identifier of the extension.
 * @example console.log(EXTENSION_ID);
 */
export const EXTENSION_ID: string = 'codeLogPlus';

/**
 * The repository ID of the extension.
 * @example console.log(EXTENSION_NAME);
 */
export const EXTENSION_NAME: string = 'vscode-code-log-plus';

/**
 * The display name of the extension.
 * @example console.log(EXTENSION_DISPLAY_NAME);
 */
export const EXTENSION_DISPLAY_NAME: string = 'CodeLog+';

/**
 * The publisher of the extension.
 * @example console.log(USER_PUBLISHER);
 */
export const USER_PUBLISHER: string = 'imgildev';

/**
 * The default value for the enable setting.
 * @example console.log(DEFAULT_ENABLE_SETTING);
 */
export const DEFAULT_ENABLE_SETTING: boolean = true;

/**
 * The default value for the language setting.
 * @example console.log(DEFAULT_LANGUAGE_SETTING);
 */
export const DEFAULT_LANGUAGE_SETTING: string = 'javascript';

/**
 * The default value for the log command setting.
 * @example console.log(DEFAULT_LOG_COMMAND_SETTING);
 */
export const DEFAULT_LOG_COMMAND_SETTING: string = '';

/**
 * The default value for the log message wrapped setting.
 * @example console.log(DEFAULT_LOG_MESSAGE_WRAPPED_SETTING);
 */
export const DEFAULT_LOG_MESSAGE_WRAPPED_SETTING: boolean = false;

/**
 * The default value for the border wrap character.
 * @example console.log(DEFAULT_BORDER_WRAP_CHARACTER);
 */
export const DEFAULT_BORDER_WRAP_CHARACTER: string = '-';

/**
 * The default value for the border wrap length.
 * @example console.log(DEFAULT_BORDER_WRAP_LENGTH);
 */
export const DEFAULT_BORDER_WRAP_LENGTH: number = 20;

/**
 * The default value for the log message prefix.
 * @example console.log(DEFAULT_LOG_MESSAGE_PREFIX);
 */
export const DEFAULT_LOG_MESSAGE_PREFIX: string = '🔍';

/**
 * The default value for the accessibility setting.
 * @example console.log(DEFAULT_USE_ACCESSIBLE_LOGS_SETTING);
 */
export const DEFAULT_USE_ACCESSIBLE_LOGS_SETTING: boolean = false;

/**
 * The default value for the message log delimiter.
 * @example console.log(DEFAULT_MESSAGE_LOG_DELIMITER);
 */
export const DEFAULT_MESSAGE_LOG_DELIMITER: string = '~';

/**
 * The default value for the message log suffix.
 * @example console.log(DEFAULT_MESSAGE_LOG_SUFFIX);
 */
export const DEFAULT_MESSAGE_LOG_SUFFIX: string = ':';

/**
 * DEFAULT_SEMICOLON_REQUIRED_SETTING: The default value for the semicolon required setting.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_SEMICOLON_REQUIRED_SETTING);
 */
export const DEFAULT_SEMICOLON_REQUIRED_SETTING: boolean = true;

/**
 * The default value for the add empty line before log setting.
 */
export const DEFAULT_ADD_EMPTY_LINE_BEFORE_LOG_SETTING: boolean = false;

/**
 * The default value for the add empty line after log setting.
 */
export const DEFAULT_ADD_EMPTY_LINE_AFTER_LOG_SETTING: boolean = false;

/**
 * The default value for the use single quotes setting.
 * @example console.log(DEFAULT_USE_SINGLE_QUOTES_SETTING);
 */
export const DEFAULT_USE_SINGLE_QUOTES_SETTING: boolean = false;

/**
 * The default value for the literal open setting.
 * @example console.log(DEFAULT_LITERAL_OPEN_SETTING);
 */
export const DEFAULT_LITERAL_OPEN_SETTING: string = '{';

/**
 * The default value for the literal close setting.
 * @example console.log(DEFAULT_LITERAL_CLOSE_SETTING);
 */
export const DEFAULT_LITERAL_CLOSE_SETTING: string = '}';

/**
 * The default value for the highlight color setting.
 * @example console.log(DEFAULT_HIGHLIGHT_COLOR_SETTING);
 */
export const DEFAULT_HIGHLIGHT_COLOR_SETTING: string = '#FFD700';

/**
 * The default value for the highlight style setting.
 * @example console.log(DEFAULT_HIGHLIGHT_STYLE_SETTING);
 */
export const DEFAULT_HIGHLIGHT_STYLE_SETTING:
  | 'solid'
  | 'double'
  | 'dotted'
  | 'dashed'
  | 'wavy' = 'wavy';

/**
 * The default value for the custom log templates.
 * @example console.log(DEFAULT_CUSTOM_LOG_TEMPLATES);
 */
export const DEFAULT_CUSTOM_LOG_TEMPLATES: LogTemplate[] = [];

/**
 * The default file patterns to include in the extension's file operations.
 * @example console.log(DEFAULT_INCLUDE_PATTERNS);
 */
export const DEFAULT_INCLUDE_PATTERNS: string[] = ['**/*.{js,jsx,ts,tsx}'];

/**
 * The default file patterns to exclude from the extension's file operations.
 * @example console.log(DEFAULT_EXCLUDE_PATTERNS);
 */
export const DEFAULT_EXCLUDE_PATTERNS: string[] = [
  '**/node_modules/**',
  '**/dist/**',
  '**/out/**',
  '**/build/**',
  '**/vendor/**',
];

/**
 * The default maximum recursion depth for file search operations (0 means unlimited).
 * @example console.log(DEFAULT_MAX_SEARCH_RECURSION_DEPTH);
 */
export const DEFAULT_MAX_SEARCH_RECURSION_DEPTH: number = 0;

/**
 * The default value for whether to include hidden files in search operations.
 * @example console.log(DEFAULT_SUPPORTS_HIDDEN_FILES);
 */
export const DEFAULT_SUPPORTS_HIDDEN_FILES: boolean = true;

/**
 * The default value for whether to respect .gitignore settings during file search.
 * @example console.log(DEFAULT_PRESERVE_GITIGNORE_SETTINGS);
 */
export const DEFAULT_PRESERVE_GITIGNORE_SETTINGS: boolean = false;

/**
 * The default value for whether to show the file path in search results.
 * @example console.log(DEFAULT_SHOW_FILE_PATH);
 */
export const DEFAULT_SHOW_FILE_PATH: boolean = true;
