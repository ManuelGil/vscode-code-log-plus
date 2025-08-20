import FastGlob from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import ignore from 'ignore';
import { join, relative } from 'path';
import {
  commands,
  env,
  l10n,
  Position,
  Range,
  Selection,
  TextEditorRevealType,
  ThemeIcon,
  Uri,
  window,
  workspace,
} from 'vscode';

import { EXTENSION_ID, ExtensionConfig } from '../configs';
import { NodeModel } from '../models';

/**
 * Manages the list of log files in the workspace.
 * It provides methods to retrieve files, open them, and navigate to specific lines.
 */
export class ListLogController {
  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ListLogController class.
   * @param {ExtensionConfig} config - The configuration object.
   */
  constructor(readonly config: ExtensionConfig) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Returns a list of files in the workspace as plain file objects.
   * Shows an error message if no workspace is open or the operation is cancelled.
   * @returns {Promise<NodeModel[] | void>} A promise that resolves to an array of file info objects or void if cancelled.
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
      showFilePathInResults,
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

        if (filename && showFilePathInResults) {
          const folder = path.split('/').slice(0, -1).join('/');

          filename += folder ? ` (${folder})` : ' (root)';
        }

        // Use resourceUri-based icon (native file icon) and attach helpful tooltip/context
        const node = new NodeModel(
          filename ?? 'Untitled',
          undefined,
          {
            command: `${EXTENSION_ID}.listLogView.openFile`,
            title: 'Open Preview',
            arguments: [file],
          },
          file,
          'file',
        );
        node.id = file.fsPath;
        node.tooltip = file.fsPath;
        nodes.push(node);
      }

      return nodes;
    }

    return [];
  }

  /**
   * Opens the specified file in the VSCode editor.
   * @param {Uri} uri - File Uri to open.
   */
  openFile(uri: Uri) {
    workspace.openTextDocument(uri).then((filename) => {
      window.showTextDocument(filename);
    });
  }

  /**
   * Opens the specified file and moves the cursor to the given line.
   * @param {Uri} uri - File Uri to open.
   * @param {number} line - Line number to navigate to.
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
   * Reveals the given resource in the VS Code Explorer.
   * Accepts either a Uri or a NodeModel.
   * @param target - Uri or NodeModel representing the file to reveal.
   */
  async revealFile(target: Uri | NodeModel): Promise<void> {
    const uri = this.resolveUri(target);

    if (!uri) {
      window.showErrorMessage(l10n.t('No file to reveal'));
      return;
    }

    await commands.executeCommand('revealInExplorer', uri);
  }

  /**
   * Opens the containing folder for the given resource in the OS file explorer.
   * Accepts either a Uri or a NodeModel.
   * @param target - Uri or NodeModel representing the file.
   */
  async openContainingFolder(target: Uri | NodeModel): Promise<void> {
    const uri = this.resolveUri(target);

    if (!uri) {
      window.showErrorMessage(l10n.t('No file to reveal in OS'));
      return;
    }

    await commands.executeCommand('revealFileInOS', uri);
  }

  /**
   * Copies the absolute path of the given resource to the clipboard.
   * Accepts either a Uri or a NodeModel.
   * @param target - Uri or NodeModel representing the file.
   */
  async copyPath(target: Uri | NodeModel): Promise<void> {
    const uri = this.resolveUri(target);

    if (!uri) {
      window.showErrorMessage(l10n.t('No file path to copy'));
      return;
    }

    await env.clipboard.writeText(uri.fsPath);

    window.showInformationMessage(l10n.t('Path copied to clipboard'));
  }

  /**
   * Opens a file and navigates to the line stored on the provided NodeModel.
   * If a Uri is passed, attempts to open the file without navigation.
   * @param target - NodeModel with line metadata or a Uri.
   */
  async gotoLineFromNode(target: NodeModel | Uri): Promise<void> {
    const { uri, line } = this.resolveUriAndLine(target) ?? {};

    if (!uri) {
      window.showErrorMessage(l10n.t('No file to navigate'));
      return;
    }

    if (typeof line === 'number') {
      this.gotoLine(uri, line);
    } else {
      this.openFile(uri);
    }
  }

  /**
   * Copies the text of the log line represented by the given NodeModel to the clipboard.
   * If only a Uri is provided or no line is available, shows an informational message.
   * @param target - NodeModel with line metadata or a Uri.
   */
  async copyLogText(target: NodeModel | Uri): Promise<void> {
    const data = this.resolveUriAndLine(target);

    if (!data?.uri) {
      window.showErrorMessage(l10n.t('No file to copy from'));
      return;
    }

    if (typeof data.line !== 'number') {
      window.showInformationMessage(l10n.t('No line information available'));
      return;
    }

    try {
      const document = await workspace.openTextDocument(data.uri);
      const lineText = document.lineAt(data.line).text.trimEnd();

      await env.clipboard.writeText(lineText);

      window.showInformationMessage(l10n.t('Log text copied to clipboard'));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : l10n.t('Unknown error while copying log text');
      window.showErrorMessage(message);
    }
  }

  /**
   * Resolves a Uri from a Uri or NodeModel.
   */
  private resolveUri(target: Uri | NodeModel): Uri | undefined {
    if (target instanceof Uri) {
      return target;
    }

    return target?.resourceUri;
  }

  /**
   * Resolves Uri and optional line number from a Uri or NodeModel.
   */
  private resolveUriAndLine(
    target: Uri | NodeModel,
  ): { uri: Uri; line?: number } | undefined {
    if (target instanceof Uri) {
      return { uri: target };
    }

    if (target?.resourceUri) {
      return { uri: target.resourceUri, line: target.line };
    }

    return undefined;
  }

  /**
   * Searches for files in a directory matching specified patterns with optimized performance.
   * @param {string} baseDir - Absolute path to the base directory to search in.
   * @param {string[]} includeFilePatterns - Glob patterns for files to include (e.g. ['**\/*.ts']).
   * @param {string[]} excludedPatterns - Glob patterns for files or directories to exclude.
   * @param {boolean} disableRecursive - When true, limits search to the immediate directory.
   * @param {number} deep - Maximum depth for recursive search (0 = unlimited).
   * @param {boolean} includeDotfiles - When true, includes files and directories starting with a dot.
   * @param {boolean} enableGitignoreDetection - When true, respects rules in .gitignore files.
   * @returns {Promise<Uri[]>} Array of VS Code Uri objects for matched files.
   * @example const tsFiles = await this.findFiles('/path/to/dir', ['**\/*.ts'], ['**\/node_modules/**']);
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
