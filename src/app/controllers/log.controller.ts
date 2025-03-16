import {
  DocumentSymbol,
  Position,
  Range,
  SymbolKind,
  TextDocument,
  commands,
  l10n,
  window,
  workspace,
  Selection,
} from 'vscode';

import { LogService } from '../services';

/**
 * The LogController class.
 *
 * @class
 * @classdesc The class that represents the list files controller.
 * @export
 * @public
 * @property {LogService} service - The log service object
 * @example
 * const controller = new LogController(config);
 */
export class LogController {
  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the LogController class
   *
   * @constructor
   * @param {LogService} service - The log service object
   * @public
   * @memberof LogController
   */
  constructor(readonly service: LogService) {}

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
      window.showErrorMessage(l10n.t('No active editor available!'));
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const fileName = document.fileName;
    const lineNumber = selection.end.line;
    const cursorPosition = selection.active;
    const rangeUnderCursor = document.getWordRangeAtPosition(cursorPosition);
    const wordUnderCursor = rangeUnderCursor
      ? document.getText(rangeUnderCursor)
      : null;
    const indent = ' '.repeat(
      document.lineAt(lineNumber).firstNonWhitespaceCharacterIndex,
    );

    const functionName = await this.extractFunctionName(
      document,
      selection.start,
    );
    const variableName =
      document.getText(selection).trim() || wordUnderCursor || 'variable';

    const { languageId } = editor.document;

    const logSnippet = this.service.generateLogSnippet(
      indent,
      workspace.asRelativePath(fileName),
      functionName,
      variableName,
      lineNumber + 1,
      languageId,
    );

    const insertPosition = new Position(lineNumber + 1, 0);
    const nextLineEndPosition = editor.document.lineAt(lineNumber + 1).range
      .end;

    await editor.edit((editBuilder) => {
      return editBuilder.insert(insertPosition, logSnippet);
    });
    editor.selection = new Selection(nextLineEndPosition, nextLineEndPosition);
  }

  /**
   * The editLogs method.
   * Edit the log statements in the active editor.
   * @function editLogs
   * @public
   * @async
   * @memberof LogController
   * @example
   * controller.editLogs();
   * @returns {Promise<void>} - The promise with no return value
   */
  async editLogs() {
    const editor = window.activeTextEditor;

    if (!editor) {
      window.showErrorMessage(l10n.t('No active editor available!'));
      return;
    }

    const documentText = editor.document.getText();

    const { languageId } = editor.document;

    const logs = this.service.findLogEntries(documentText, languageId);
    if (logs.length === 0) {
      window.showInformationMessage(
        l10n.t('No logs found in the active editor'),
      );
      return;
    }

    const picks = logs.map((log) => ({
      label: `Line ${log.line}: ${log.preview}`,
      description: log.fullText,
      log,
    }));

    const placeholder = l10n.t('Selected logs have been commented');
    const selected = await window.showQuickPick(picks, {
      canPickMany: true,
      placeHolder: placeholder,
    });
    if (!selected || selected.length === 0) {
      window.showInformationMessage(
        l10n.t('Selected logs have been uncommented'),
      );
      return;
    }

    const newLogCommand = await window.showInputBox({
      prompt: l10n.t('Enter new log command'),
      placeHolder: 'e.g. console.error',
    });
    if (!newLogCommand) {
      window.showInformationMessage(l10n.t('No new log command provided'));
      return;
    }

    await editor.edit((editBuilder) => {
      const sorted = selected.sort((a, b) => b.log.start - a.log.start);
      sorted.forEach((item) => {
        const startPos = editor.document.positionAt(item.log.start);
        const endPos = editor.document.positionAt(item.log.end);
        const range = new Range(startPos, endPos);
        const logText = editor.document.getText(range);
        const updatedLogText = logText.replace(
          /^(\s*)([a-zA-Z0-9_.]+)(\s*\()/gm,
          `$1${newLogCommand}$3`,
        );
        editBuilder.replace(range, updatedLogText);
      });
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
      window.showErrorMessage(l10n.t('No active editor available!'));
      return;
    }

    const documentText = editor.document.getText();

    const { languageId } = editor.document;

    const logs = this.service.findLogEntries(documentText, languageId);
    if (logs.length === 0) {
      window.showInformationMessage(l10n.t('No logs found for removal'));
      return;
    }

    const picks = logs.map((log) => ({
      label: `Line ${log.line}: ${log.preview}`,
      description: log.fullText,
      log,
    }));

    const placeHolder = l10n.t('Select logs to remove');
    const selected = await window.showQuickPick(picks, {
      canPickMany: true,
      placeHolder,
    });
    if (!selected || selected.length === 0) {
      window.showInformationMessage(l10n.t('No logs selected for removal'));
      return;
    }

    await editor.edit((editBuilder) => {
      const sorted = selected.sort((a, b) => b.log.line - a.log.line);
      sorted.forEach((item) => {
        const startPos = editor.document.positionAt(item.log.start);
        let endPos = editor.document.positionAt(item.log.end);

        const nextCharRange = new Range(endPos, endPos.translate(0, 1));
        const nextChar = editor.document.getText(nextCharRange);
        if (nextChar === ';') {
          endPos = endPos.translate(0, 1);
        }

        const range = new Range(startPos, endPos);
        editBuilder.delete(range);
      });
    });

    window.showInformationMessage(l10n.t('Selected logs have been removed'));
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

    const { languageId } = editor.document;

    const logRanges = this.service.findLogEntries(code, languageId);
    if (logRanges.length === 0) {
      window.showInformationMessage(
        l10n.t('No logs found in the active editor'),
      );
      return;
    }
    const commentToken = this.getCommentToken(document);

    await editor.edit((editBuilder) => {
      logRanges.forEach((log) => {
        const startPos = document.positionAt(log.start);
        editBuilder.insert(startPos, commentToken);
      });
    });
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
      window.showErrorMessage(l10n.t('No active editor available!'));
      return;
    }

    const document = editor.document;
    const code = document.getText();

    const { languageId } = editor.document;

    const logRanges = this.service.findLogEntries(code, languageId);

    if (logRanges.length === 0) {
      window.showInformationMessage(
        l10n.t('No logs found in the active editor'),
      );
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
  }

  // Private methods

  /**
   * The extractFunctionName method.
   * Extract the function name from the document at the specified position.
   * @function extractFunctionName
   * @private
   * @async
   * @param {TextDocument} document - The text document
   * @param {Position} position - The position
   * @memberof LogController
   * @example
   * this.extractFunctionName(document, position);
   * @returns {Promise<string>} - The function
   */
  private async extractFunctionName(
    document: TextDocument,
    position: Position,
  ): Promise<string> {
    let functionName = '';
    const symbols = (await commands.executeCommand(
      'vscode.executeDocumentSymbolProvider',
      document.uri,
    )) as DocumentSymbol[];
    if (symbols && symbols.length > 0) {
      const funcSymbol = this.findFunctionSymbol(symbols, position);
      if (funcSymbol) {
        functionName = funcSymbol.name.trim();
      }
    }
    if (!functionName) {
      const regex =
        /\b(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\(.*?\)\s*=>)/;
      const lineText = document.lineAt(position.line).text;
      const match = regex.exec(lineText);
      if (match) {
        functionName = match[1];
      }
    }
    return functionName;
  }

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

  /**
   * The getCommentToken method.
   * Get the comment token based on the language of the document.
   * @function getCommentToken
   * @private
   * @param {TextDocument} document - The text document
   * @memberof LogController
   * @example
   * this.getCommentToken(document);
   * @returns {string} - The comment token
   */
  private getCommentToken(document: TextDocument): string {
    const lang = document.languageId;
    switch (lang) {
      case 'javascript':
      case 'typescript':
      case 'java':
      case 'csharp':
      case 'cpp':
      case 'go':
        return '// ';
      case 'python':
      case 'ruby':
        return '# ';
      case 'php':
        return '// ';
      default:
        return '// ';
    }
  }
}
