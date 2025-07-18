/**
 * Escapes special characters in a string for use in a regular expression.
 * Useful for sanitizing user input or creating dynamic regex patterns.
 *
 * @param {string} string - The string to escape
 * @example
 * escapeRegExp('foo.bar?baz*');
 *
 * @returns {string} - The escaped string
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
