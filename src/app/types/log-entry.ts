import { Range } from 'vscode';

/**
 * Represents a log entry found in the document.
 */
export interface LogEntry {
  /** The start position of the log entry. */
  start: number;
  /** The end position of the log entry. */
  end: number;
  /** The line number of the log entry. */
  line: number;
  /** A preview snippet of the log message. */
  preview: string;
  /** The full text of the log statement. */
  fullText: string;
  /** The indentation of the log line. */
  indentation: string;
  /** The name of the function containing the log. */
  functionName: string;
  /** The log message content. */
  log: string;
  /** The range of the log entry in the document. */
  range: Range;
  /** Whether the log is commented out. */
  isCommented: boolean;
}
