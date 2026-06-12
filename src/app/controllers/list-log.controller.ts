import {
  commands,
  env,
  l10n,
  Position,
  Range,
  Selection,
  TextEditorRevealType,
  Uri,
  window,
  workspace,
} from 'vscode';

import { EXTENSION_ID, ExtensionConfig } from '../configs';
import { NodeModel } from '../models';
import { findFiles, getBaseName, getDirName, openDocument } from '../helpers';

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
      const result = await findFiles({
        baseDirectoryPath: folder,
        includeFilePatterns: fileExtensionPattern,
        excludedPatterns: fileExclusionPatterns,
        disableRecursive: false,
        maxRecursionDepth: maxSearchRecursionDepth,
        includeDotfiles: supportsHiddenFiles,
        enableGitignoreDetection: preserveGitignoreSettings,
      });

      files.push(...result);
    }

    if (files.length !== 0) {
      const nodes: NodeModel[] = [];

      files.sort((a, b) => a.path.localeCompare(b.path));

      for (const file of files) {
        const path = workspace.asRelativePath(file.fsPath);
        let filename = getBaseName(path);

        if (filename && showFilePathInResults) {
          const folder = getDirName(path);

          filename += folder && folder !== '.' ? ` (${folder})` : ' (root)';
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
  async openFile(uri: Uri) {
    try {
      await openDocument(uri);
    } catch {
      // Ignore failures to open; caller will handle if needed
    }
  }

  /**
   * Opens the specified file and moves the cursor to the given line.
   * @param {Uri} uri - File Uri to open.
   * @param {number} line - Line number to navigate to.
   */
  async gotoLine(uri: Uri, line: number) {
    try {
      const editor = await openDocument(uri);
      const pos = new Position(line, 0);
      editor.revealRange(
        new Range(pos, pos),
        TextEditorRevealType.InCenterIfOutsideViewport,
      );
      editor.selection = new Selection(pos, pos);
    } catch {
      // Ignore failures to open/navigate
    }
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
}
