import {
  DocumentSymbol,
  Position,
  Range,
  SymbolKind,
  commands,
  l10n,
  window,
  workspace,
} from 'vscode';

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

  // Public properties

  /**
   * The highlighter controller.
   *
   * @private
   * @type {CodeHighlighterController}
   * @memberof LogController
   * @example
   * this.highlighter;
   */
  public highlighter: CodeHighlighterController;

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
    const { highlightColor, highlightStyle } = config;

    this.logService = new LogService(config);
    this.highlighter = CodeHighlighterController.getInstance(
      highlightColor,
      highlightStyle,
    );
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

    const symbols = (await commands.executeCommand(
      'vscode.executeDocumentSymbolProvider',
      document.uri,
    )) as DocumentSymbol[];

    let functionName = '';

    if (symbols && symbols.length > 0) {
      const funcSymbol = this.findFunctionSymbol(symbols, selection.start);
      if (funcSymbol) {
        const name = funcSymbol.name.trim();
        if (name && name !== '') {
          functionName = name;
        }
      }
    }

    const regex = /\b(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\(.*?\)\s*=>)/;
    const match = regex.exec(document.lineAt(lineNumber).text);

    functionName = match ? match[1] : functionName;

    const variableName = document.getText(selection).trim() || 'variable';

    const logSnippet = this.logService.generateLogSnippet(
      indent,
      workspace.asRelativePath(fileName),
      functionName,
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

  /**
   * The uncommentLogs method.
   * Uncomment the log statements in the active editor.
   * @function uncommentLogs
   * @public
   * @async
   * @memberof LogController
   * @example
   * controller.uncommentLogs();
   * @returns {Promise<void>} - The promise with no return value
   */
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

  // Private methods

  /**
   * The findFunctionSymbol method.
   * Find the function symbol that contains the specified line number.
   * @function findFunctionSymbol
   * @private
   * @param {DocumentSymbol[]} symbols - The list of document symbols
   * @param {number} lineNumber - The line number
   * @memberof LogController
   * @example
   * this.findFunctionSymbol(symbols, lineNumber);
   * @returns {DocumentSymbol | undefined} - The function symbol
   */
  private findFunctionSymbol(
    symbols: DocumentSymbol[],
    position: Position,
  ): DocumentSymbol | undefined {
    for (const symbol of symbols) {
      if (symbol.range.contains(position)) {
        if (
          symbol.kind === SymbolKind.Function ||
          symbol.kind === SymbolKind.Method
        ) {
          return symbol;
        }
        if (symbol.children && symbol.children.length > 0) {
          const result = this.findFunctionSymbol(symbol.children, position);
          if (result) {
            return result;
          }
        }
      }
    }
    return undefined;
  }
}
