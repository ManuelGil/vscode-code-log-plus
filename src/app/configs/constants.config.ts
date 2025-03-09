import { LogTemplate } from '../types';

/**
 * EXTENSION_ID: The unique identifier of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_ID);
 *
 * @returns {string} - The unique identifier of the extension
 */
export const EXTENSION_ID: string = 'codeLogPlus';

/**
 * EXTENSION_NAME: The repository ID of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_NAME);
 *
 * @returns {string} - The repository ID of the extension
 */
export const EXTENSION_NAME: string = 'vscode-code-log-plus';

/**
 * EXTENSION_DISPLAY_NAME: The name of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_DISPLAY_NAME);
 *
 * @returns {string} - The name of the extension
 */
export const EXTENSION_DISPLAY_NAME: string = 'CodeLog+';

/**
 * USER_PUBLISHER: The publisher of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(USER_PUBLISHER);
 *
 * @returns {string} - The publisher of the extension
 */
export const USER_PUBLISHER: string = 'imgildev';

/**
 * DEFAULT_ENABLE_SETTING: The default value for the enable setting.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_ENABLE_SETTING);
 *
 * @returns {boolean} - The default value for the enable setting
 */
export const DEFAULT_ENABLE_SETTING: boolean = true;

/**
 * DEFAULT_LANGUAGE_SETTING: The default value for the language setting.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_LANGUAGE_SETTING);
 *
 * @returns {string} - The default value for the language setting
 */
export const DEFAULT_LANGUAGE_SETTING: string = 'javascript';

/**
 * DEFAULT_LOG_COMMAND_SETTING: The default value for the log command setting.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_LOG_COMMAND_SETTING);
 *
 * @returns {string} - The default value for the log command setting
 */
export const DEFAULT_LOG_COMMAND_SETTING: string = '';

/**
 * DEFAULT_LOG_MESSAGE_WRAPPED_SETTING: The default value for the log message wrapped setting.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_LOG_MESSAGE_WRAPPED_SETTING);
 *
 * @returns {boolean} - The default value for the log message wrapped setting
 */
export const DEFAULT_LOG_MESSAGE_WRAPPED_SETTING: boolean = false;

/**
 * DEFAULT_LOG_MESSAGE_PREFIX: The default value for the log message prefix.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_LOG_MESSAGE_PREFIX);
 *
 * @returns {string} - The default value for the log message prefix
 */
export const DEFAULT_LOG_MESSAGE_PREFIX: string = '🔍';

/**
 * DEFAULT_MESSAGE_LOG_DELIMITER: The default value for the message log delimiter.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_MESSAGE_LOG_DELIMITER);
 *
 * @returns {string} - The default value for the message log delimiter
 */
export const DEFAULT_MESSAGE_LOG_DELIMITER: string = '~';

/**
 * DEFAULT_MESSAGE_LOG_SUFFIX: The default value for the message log suffix.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_MESSAGE_LOG_SUFFIX);
 *
 * @returns {string} - The default value for the message log suffix
 */
export const DEFAULT_MESSAGE_LOG_SUFFIX: string = ':';

/**
 * DEFAULT_SEMICOLON_REQUIRED_SETTING: The default value for the semicolon required setting.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_SEMICOLON_REQUIRED_SETTING);
 *
 * @returns {boolean} - The default value for the semicolon required setting
 */
export const DEFAULT_SEMICOLON_REQUIRED_SETTING: boolean = false;

/**
 * DEFAULT_ADD_EMPTY_LINE_BEFORE_LOG_MESSAGE_SETTING: The default value for the add empty line before log message setting.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_ADD_EMPTY_LINE_BEFORE_LOG_MESSAGE_SETTING);
 *
 * @returns {boolean} - The default value for the add empty line before log message setting
 */
export const DEFAULT_ADD_EMPTY_LINE_BEFORE_LOG_MESSAGE_SETTING: boolean = false;

/**
 * DEFAULT_ADD_EMPTY_LINE_AFTER_LOG_SETTING: The default value for the add empty line after log setting.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_ADD_EMPTY_LINE_AFTER_LOG_SETTING);
 *
 * @returns {boolean} - The default value for the add empty line after log setting
 */
export const DEFAULT_ADD_EMPTY_LINE_AFTER_LOG_SETTING: boolean = false;

/**
 * DEFAULT_USE_SINGLE_QUOTES_SETTING: The default value for the use single quotes setting.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_USE_SINGLE_QUOTES_SETTING);
 *
 * @returns {boolean} - The default value for the use single quotes setting
 */
export const DEFAULT_USE_SINGLE_QUOTES_SETTING: boolean = false;

/**
 * DEFAULT_LITERAL_OPEN_SETTING: The default value for the literal open setting.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_LITERAL_OPEN_SETTING);
 *
 * @returns {string} - The default value for the literal open setting
 */
export const DEFAULT_LITERAL_OPEN_SETTING: string = '{';

/**
 * DEFAULT_LITERAL_CLOSE_SETTING: The default value for the literal close setting.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_LITERAL_CLOSE_SETTING);
 *
 * @returns {string} - The default value for the literal close setting
 */
export const DEFAULT_LITERAL_CLOSE_SETTING: string = '}';

/**
 * DEFAULT_HIGHLIGHT_COLOR_SETTING: The default value for the highlight color setting.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_HIGHLIGHT_COLOR_SETTING);
 *
 * @returns {string} - The default value for the highlight color setting
 */
export const DEFAULT_HIGHLIGHT_COLOR_SETTING: string = '#FFD700';

/**
 * DEFAULT_HIGHLIGHT_STYLE_SETTING: The default value for the highlight style setting.
 * @type {'solid' | 'double' | 'dotted' | 'dashed' | 'wavy'}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_HIGHLIGHT_STYLE_SETTING);
 *
 * @returns {string} - The default value for the highlight style setting
 */
export const DEFAULT_HIGHLIGHT_STYLE_SETTING:
  | 'solid'
  | 'double'
  | 'dotted'
  | 'dashed'
  | 'wavy' = 'wavy';

/**
 * DEFAULT_CUSTOM_LOG_TEMPLATES: The default value for the custom log templates setting.
 * @type {string[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_CUSTOM_LOG_TEMPLATES);
 *
 * @returns {string[]} - The default value for the custom log templates setting
 */
export const DEFAULT_CUSTOM_LOG_TEMPLATES: LogTemplate[] = [];
