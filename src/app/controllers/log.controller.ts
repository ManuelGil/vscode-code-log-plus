import { Position, Range, l10n, window, workspace } from 'vscode';

import { ExtensionConfig } from '../configs';
import { LogService } from '../services';
import { CodeHighlighterController } from './highlighter.controller';

/**
 * The LogController class.
 *
 * @class
 * @classdesc The class that represents the list files controller.
 * @export
 * @public
 * @property {ExtensionConfig} config - The configuration object
 * @example
 * const controller = new LogController(config);
 */
export class LogController {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Private properties
  /**
   * The log service.
   *
   * @private
   * @type {LogService}
   * @memberof LogController
   * @example
   * this.logService;
   */
  private logService: LogService;

  /**
   * The highlighter controller.
   *
   * @private
   * @type {CodeHighlighterController}
   * @memberof LogController
   * @example
   * this.highlighter;
   */
  private highlighter: CodeHighlighterController;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the LogController class
   *
   * @constructor
   * @param {ExtensionConfig} config - The configuration object
   * @public
   * @memberof LogController
   */
  constructor(readonly config: ExtensionConfig) {
    this.logService = new LogService(config);
    this.highlighter = new CodeHighlighterController();
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * The exportToActiveTextEditor method.
   * Generate a file tree in the selected folder and insert it into the active editor.
   * @function exportToActiveTextEditor
   * @public
   * @async
   * @memberof LogController
   * @example
   * controller.exportToActiveTextEditor(folderPath);
   *
   * @returns {Promise<void>} - The promise with no return value
   */
  async insertTextInActiveEditor(): Promise<void> {
    const editor = window.activeTextEditor;

    if (!editor) {
      const message = l10n.t('No active editor available!');
      window.showErrorMessage(message);
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const fileName = document.fileName;
    const lineNumber = selection.end.line;
    const indent = ' '.repeat(
      document.lineAt(lineNumber).firstNonWhitespaceCharacterIndex,
    );

    const variableName = document.getText(selection).trim() || 'variable';

    const logSnippet = this.logService.generateLogSnippet(
      indent,
      workspace.asRelativePath(fileName),
      variableName,
      lineNumber + 1,
    );

    const insertPosition = new Position(lineNumber + 1, 0);
    await editor.edit((editBuilder) => {
      return editBuilder.insert(insertPosition, logSnippet);
    });
  }

  /**
   * The removeLogs method.
   * Remove the log statements in the active editor.
   * @function removeLogs
   * @public
   * @async
   * @memberof LogController
   * @example
   * controller.removeLogs();
   * @returns {Promise<void>} - The promise with no return value
   */
  async removeLogs() {
    const editor = window.activeTextEditor;

    if (!editor) {
      const message = l10n.t('No active editor available!');
      window.showErrorMessage(message);
      return;
    }

    const documentText = editor.document.getText();
    const logs = this.logService.findLogEntries(documentText);

    if (logs.length === 0) {
      const message = l10n.t('No logs found for removal');
      window.showInformationMessage(message);
      return;
    }

    const picks = logs.map((log) => ({
      label: `Line ${log.line}: ${log.preview}`,
      description: log.fullText,
      line: log.line,
    }));

    const placeHolder = l10n.t('Select logs to remove');
    const selected = await window.showQuickPick(picks, {
      canPickMany: true,
      placeHolder,
    });

    if (!selected || selected.length === 0) {
      const message = l10n.t('No logs selected for removal');
      window.showInformationMessage(message);
      return;
    }

    await editor.edit((editBuilder) => {
      const sorted = selected.sort((a, b) => b.line - a.line);
      sorted.forEach((log) => {
        const start = editor.document.lineAt(log.line - 1).range.start;
        const end = editor.document.lineAt(log.line - 1).range.end;
        const range = new Range(start, end);
        editBuilder.delete(range);
      });
    });

    const message = l10n.t('Selected logs have been removed');
    window.showInformationMessage(message);
  }

  /**
   * The highlightLogs method.
   * Highlight the log statements in the active editor.
   * @function highlightLogs
   * @public
   * @async
   * @memberof LogController
   * @example
   * controller.highlightLogs();
   * @returns {Promise<void>} - The promise with no return value
   */
  async highlightLogs() {
    const editor = window.activeTextEditor;

    if (!editor) {
      const message = l10n.t('No active editor available!');
      window.showErrorMessage(message);
      return;
    }

    const document = editor.document;
    const code = document.getText();
    const logRanges = this.logService.findLogEntries(code);

    this.highlighter.highlight(
      editor,
      logRanges,
      l10n.t(
        'You can remove the log statements by using the command: "Remove Logs"',
      ),
    );
  }

  /**
   * The clearHighlights method.
   * Remove the highlights from the active editor.
   * @function removeHighlights
   * @public
   * @memberof LogController
   * @example
   * controller.clearHighlights();
   */
  clearHighlights() {
    const editor = window.activeTextEditor;

    if (!editor) {
      const message = l10n.t('No active editor available!');
      window.showErrorMessage(message);
      return;
    }

    this.highlighter.clear(editor);
  }

  /**
   * The commentLogs method.
   * Comment the log statements in the active editor.
   * @function commentLogs
   * @public
   * @async
   * @memberof LogController
   * @example
   * controller.commentLogs();
   * @returns {Promise<void>} - The promise with no return value
   */
  async commentLogs() {
    const editor = window.activeTextEditor;

    if (!editor) {
      const message = l10n.t('No active editor available!');
      window.showErrorMessage(message);
      return;
    }

    const document = editor.document;
    const code = document.getText();
    const logRanges = this.logService.findLogEntries(code);

    if (logRanges.length === 0) {
      const message = l10n.t('No logs found in the active editor');
      window.showInformationMessage(message);
      return;
    }

    await editor.edit((editBuilder) => {
      logRanges.forEach((log) => {
        const start = document.positionAt(log.start);
        editBuilder.insert(start, '// ');
      });
    });

    const message = l10n.t('Selected logs have been commented');
    window.showInformationMessage(message);
  }

  async uncommentLogs() {
    const editor = window.activeTextEditor;

    if (!editor) {
      const message = l10n.t('No active editor available!');
      window.showErrorMessage(message);
      return;
    }

    const document = editor.document;
    const code = document.getText();
    const logRanges = this.logService.findLogEntries(code);

    if (logRanges.length === 0) {
      const message = l10n.t('No logs found in the active editor');
      window.showInformationMessage(message);
      return;
    }

    await editor.edit((editBuilder) => {
      logRanges.forEach((log) => {
        const start = document.positionAt(log.start - 3);
        const end = document.lineAt(log.line - 1).range.end;
        const range = new Range(start, end);
        const line = document.getText(range);
        if (line.startsWith('// ')) {
          editBuilder.delete(range.with(start, start.translate(0, 3)));
        }
      });
    });

    const message = l10n.t('Selected logs have been uncommented');
    window.showInformationMessage(message);
  }
}
