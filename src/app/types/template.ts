/**
 * LogTemplate interface
 * @description Interface for the log template
 * @export
 * @interface LogTemplate
 * @example
 * export interface LogTemplate {
 * }
 *
 * @param {string} language The language of the log template.
 * @param {string} template The template for the log.
 *
 * @returns {LogTemplate} The log template.
 */
export interface LogTemplate {
  language: string;
  template: string;
}
