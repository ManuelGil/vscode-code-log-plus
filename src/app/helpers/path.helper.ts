/*
 * Lightweight path helpers that operate on normalized string paths (forward slashes).
 * These avoid Node's 'path' module to comply with extension sandbox constraints.
 */

import { toPosixPath } from './path-format.helper';

/**
 * Normalize a path to use forward slashes.
 *
 * @param {string} input - The input path, which may contain backslashes.
 * @returns {string} The normalized path using only forward slashes.
 */
export function normalizePath(input: string): string {
  return toPosixPath(input);
}

/**
 * Return the last segment of the provided path (the basename).
 *
 * The function operates on normalized POSIX-like paths (forward slashes).
 *
 * @param {string} input - The input path.
 * @returns {string} The basename of the path or an empty string if the path is empty.
 */
export function getBaseName(input: string): string {
  const normalizedPath = normalizePath(input).replace(/\/+$/, '');
  if (normalizedPath === '') {
    return '';
  }
  const indexOfLastSeparator = normalizedPath.lastIndexOf('/');
  return indexOfLastSeparator === -1
    ? normalizedPath
    : normalizedPath.slice(indexOfLastSeparator + 1);
}

/**
 * Return the directory name of the provided path.
 *
 * Returns '.' when the input has no parent directory (root of a relative path).
 *
 * @param {string} input - The input path.
 * @returns {string} The directory path or '.' when no parent directory exists.
 */
export function getDirName(input: string): string {
  const normalizedPath = normalizePath(input).replace(/\/+$/, '');
  if (normalizedPath === '') {
    return '.';
  }
  const indexOfLastSeparator = normalizedPath.lastIndexOf('/');
  if (indexOfLastSeparator === -1) {
    return '.';
  }
  const dir = normalizedPath.slice(0, indexOfLastSeparator);
  return dir === '' ? '.' : dir;
}
