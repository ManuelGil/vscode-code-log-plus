import * as FastGlob from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import * as ignore from 'ignore';
import { join, relative } from 'path';
import {
  Position,
  Range,
  Selection,
  TextEditorRevealType,
  ThemeIcon,
  Uri,
  l10n,
  window,
  workspace,
} from 'vscode';

import { EXTENSION_ID, ExtensionConfig } from '../configs';
import { NodeModel } from '../models';

/**
 * ListLogController is responsible for managing the list of log files in the workspace.
 * It provides methods to retrieve files, open them, and navigate to specific lines.
 * This controller interacts with the workspace and uses the LogService for log operations.
 *
 * @class ListLogController
 */
export class ListLogController {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /**
   * The static config property.
   *
   * @static
   * @property
   * @public
   * @type {ExtensionConfig}
   * @memberof ListLogController
   */
  static config: ExtensionConfig;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ListLogController class
   *
   * @constructor
   * @param {ExtensionConfig} config - The configuration object
   * @public
   * @memberof ListLogController
   */
  constructor(readonly config: ExtensionConfig) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Returns a list of files in the workspace as plain file objects.
   * Shows an error message if no workspace is open or operation is cancelled.
   * @returns Promise resolving to an array of file info objects or void if cancelled.
   */
  async getFiles(): Promise<NodeModel[] | void> {
    // Get the files in the folder
    let folders: string[] = [];
    let files: Uri[] = [];

    if (!workspace.workspaceFolders) {
      const message = l10n.t('Operation cancelled!');
      window.showErrorMessage(message);
      return;
    }

    folders = workspace.workspaceFolders.map((folder) => folder.uri.fsPath);

    const {
      includedFilePatterns,
      excludedFilePatterns,
      maxSearchRecursionDepth,
      supportsHiddenFiles,
      preserveGitignoreSettings,
      includeFilePath,
    } = this.config;

    const fileExtensionPattern = Array.isArray(includedFilePatterns)
      ? includedFilePatterns
      : [includedFilePatterns];
    const fileExclusionPatterns = Array.isArray(excludedFilePatterns)
      ? excludedFilePatterns
      : [excludedFilePatterns];

    for (const folder of folders) {
      const result = await this.findFiles(
        folder,
        fileExtensionPattern,
        fileExclusionPatterns,
        false, // disable recursive search
        maxSearchRecursionDepth,
        supportsHiddenFiles,
        preserveGitignoreSettings,
      );

      files.push(...result);
    }

    if (files.length !== 0) {
      const nodes: NodeModel[] = [];

      files.sort((a, b) => a.path.localeCompare(b.path));

      for (const file of files) {
        const path = workspace.asRelativePath(file.fsPath);
        let filename = path.split('/').pop();

        if (filename && includeFilePath) {
          const folder = path.split('/').slice(0, -1).join('/');

          filename += folder ? ` (${folder})` : ' (root)';
        }

        nodes.push(
          new NodeModel(
            filename ?? 'Untitled',
            new ThemeIcon('file'),
            {
              command: `${EXTENSION_ID}.listLogView.openFile`,
              title: 'Open Preview',
              arguments: [file],
            },
            file,
            file.fsPath,
          ),
        );
      }

      return nodes;
    }

    return [];
  }

  /**
   * Opens the specified file in the VSCode editor.
   * @param uri File Uri to open.
   */
  openFile(uri: Uri) {
    workspace.openTextDocument(uri).then((filename) => {
      window.showTextDocument(filename);
    });
  }

  /**
   * Opens the specified file and moves the cursor to the given line.
   * @param uri File Uri to open.
   * @param line Line number to navigate to.
   */
  gotoLine(uri: Uri, line: number) {
    workspace.openTextDocument(uri).then((document) => {
      window.showTextDocument(document).then((editor) => {
        const pos = new Position(line, 0);
        editor.revealRange(
          new Range(pos, pos),
          TextEditorRevealType.InCenterIfOutsideViewport,
        );
        editor.selection = new Selection(pos, pos);
      });
    });
  }

  /**
   * Searches for files in a directory matching specified patterns with optimized performance
   *
   * @param {string} baseDir - Absolute path to the base directory to search in
   * @param {string[]} includeFilePatterns - Glob patterns for files to include (e.g. ['**\/*.ts'])
   * @param {string[]} excludedPatterns - Glob patterns for files or directories to exclude
   * @param {boolean} disableRecursive - When true, limits search to the immediate directory
   * @param {number} deep - Maximum depth for recursive search (0 = unlimited)
   * @param {boolean} includeDotfiles - When true, includes files and directories starting with a dot
   * @param {boolean} enableGitignoreDetection - When true, respects rules in .gitignore files
   * @returns {Promise<Uri[]>} Array of VS Code Uri objects for matched files
   * @throws {Error} If the directory access fails or pattern matching encounters errors
   * @private
   * @async
   * @memberof FilesController
   * @example
   * // Example usage:
   * // const tsFiles = await this.findFiles('/path/to/dir', ['**\/*.ts'], ['**\/node_modules/**']);
   */
  private async findFiles(
    baseDir: string,
    includeFilePatterns: string[],
    excludedPatterns: string[] = [],
    disableRecursive: boolean = false,
    deep: number = 0,
    includeDotfiles: boolean = false,
    enableGitignoreDetection: boolean = false,
  ): Promise<Uri[]> {
    try {
      // Check if any include patterns were provided
      if (!includeFilePatterns.length) {
        return [];
      }

      // If we need to respect .gitignore, we need to load it
      let gitignore;
      if (enableGitignoreDetection) {
        const gitignorePath = join(baseDir, '.gitignore');
        // Load .gitignore if it exists
        if (existsSync(gitignorePath)) {
          gitignore = ignore().add(readFileSync(gitignorePath, 'utf8'));
        }
      }

      // Configure fast-glob options with optimizations for large projects
      const options = {
        cwd: baseDir, // Set the base directory for searching
        absolute: true, // Return absolute paths for files found
        onlyFiles: true, // Match only files, not directories
        dot: includeDotfiles, // Include the files and directories starting with a dot
        deep: disableRecursive ? 1 : deep === 0 ? undefined : deep, // Set the recursion depth
        ignore: excludedPatterns, // Set the patterns to ignore files and directories
        followSymbolicLinks: false, // Don't follow symlinks for better performance
        cache: true, // Enable cache for better performance in large projects
        stats: false, // Don't return stats objects for better performance
        throwErrorOnBrokenSymbolicLink: false, // Don't throw on broken symlinks
        objectMode: false, // Use string mode for better performance
      };

      // Use fast-glob to find matching files
      let foundFilePaths = await FastGlob(includeFilePatterns, options);

      // Apply gitignore filtering if needed
      if (gitignore) {
        foundFilePaths = foundFilePaths.filter(
          (filePath: string) => !gitignore.ignores(relative(baseDir, filePath)),
        );
      }

      // Convert file paths to VS Code Uri objects
      return foundFilePaths
        .sort()
        .map((filePath: string) => Uri.file(filePath));
    } catch (error) {
      const errorDetails =
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : { message: String(error) };

      const message = l10n.t('Error finding files: {0}', [
        errorDetails.message,
      ]);
      window.showErrorMessage(message);

      return [];
    }
  }
}
