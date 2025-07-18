import {
  DocumentSymbol,
  Position,
  ProgressLocation,
  Range,
  Selection,
  SymbolKind,
  TextDocument,
  TextEditor,
  commands,
  l10n,
  window,
  workspace,
} from 'vscode';

import { LogService } from '../services';
import { escapeRegExp } from '../helpers';

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

    if (!this.validateEditor(editor)) {
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
  async editLogs(): Promise<void> {
    const editor = window.activeTextEditor;

    if (!this.validateEditor(editor)) {
      return;
    }

    const document = editor.document;
    const code = this.getDocumentText(document);
    if (!code) {
      return;
    }

    const { languageId } = editor.document;

    // Use progress indicator for finding logs in large files
    const logs = await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Searching for log statements...'),
        cancellable: false,
      },
      async () => {
        return this.service.findLogEntries(code, languageId);
      },
    );

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

    // Use progress indicator for editing logs
    await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Updating log statements...'),
        cancellable: false,
      },
      async () => {
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
        return;
      },
    );
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
  async removeLogs(): Promise<void> {
    const editor = window.activeTextEditor;

    if (!this.validateEditor(editor)) {
      return;
    }

    const document = editor.document;
    const code = this.getDocumentText(document);
    if (!code) {
      return;
    }

    const { languageId } = editor.document;

    // Use progress indicator for searching logs in large files
    const logs = await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Searching for log statements...'),
        cancellable: false,
      },
      async () => {
        return this.service.findLogEntries(code, languageId);
      },
    );

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

    // Show progress indicator while removing logs
    await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Removing selected logs...'),
        cancellable: false,
      },
      async () => {
        await editor.edit((editBuilder) => {
          const sorted = selected.sort((a, b) => b.log.line - a.log.line);
          sorted.forEach((item) => {
            const startPos = editor.document.positionAt(item.log.start);
            const endPos = editor.document.positionAt(item.log.end);

            const line = editor.document.lineAt(startPos.line);
            const lineText = line.text.trim();
            const logText = editor.document
              .getText(new Range(startPos, endPos))
              .trim();

            // If the log statement is the only content on the line (ignoring whitespace),
            // delete the entire line including the line break.
            // Also remove a trailing semicolon and whitespace if present.
            if (
              lineText === logText ||
              lineText === logText + ';' ||
              lineText === logText + '; '
            ) {
              editBuilder.delete(line.rangeIncludingLineBreak);
            } else {
              // Otherwise, just delete the log statement itself.
              editBuilder.delete(new Range(startPos, endPos));
              // Remove trailing semicolon if it immediately follows the log statement
              const afterLogPos = editor.document.positionAt(item.log.end);
              const afterLogChar = editor.document.getText(
                new Range(afterLogPos, afterLogPos.translate(0, 1)),
              );
              if (afterLogChar === ';') {
                editBuilder.delete(
                  new Range(afterLogPos, afterLogPos.translate(0, 1)),
                );
              }
            }
          });
        });
      },
    );

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
  async commentLogs(): Promise<void> {
    const editor = window.activeTextEditor;

    if (!this.validateEditor(editor)) {
      return;
    }

    const document = editor.document;
    const code = this.getDocumentText(document);
    if (!code) {
      return;
    }

    const { languageId } = editor.document;

    // Use progress indicator for finding logs
    const logRanges = await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Searching for log statements...'),
        cancellable: false,
      },
      async () => {
        return this.service.findLogEntries(code, languageId);
      },
    );

    if (logRanges.length === 0) {
      window.showInformationMessage(
        l10n.t('No logs found in the active editor'),
      );
      return;
    }

    const commentToken = this.getCommentToken(languageId);

    // Show progress indicator while commenting logs
    await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Commenting log statements...'),
        cancellable: false,
      },
      async () => {
        await editor.edit((editBuilder) => {
          logRanges.forEach((log) => {
            const startPos = document.positionAt(log.start);
            editBuilder.insert(startPos, commentToken);
          });
        });
        return;
      },
    );

    window.showInformationMessage(l10n.t('Selected logs have been commented'));
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
  async uncommentLogs(): Promise<void> {
    const editor = window.activeTextEditor;

    if (!this.validateEditor(editor)) {
      return;
    }

    const document = editor.document;
    const code = this.getDocumentText(document);
    if (!code) {
      return;
    }

    const { languageId } = editor.document;

    // Show progress indicator while searching for commented logs
    const uncommentRanges = await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Searching for commented log statements...'),
        cancellable: false,
      },
      async () => {
        const resolvedCommand = this.service.getLogCommand(languageId);
        const escapedCommand = escapeRegExp(resolvedCommand);
        const commentToken = this.getCommentToken(languageId);

        const commentPattern = new RegExp(
          `(^\\s*)(${escapeRegExp(commentToken)})(\\s*)(${escapedCommand})(\\s*\\()`,
          'gm',
        );

        const ranges: Array<{ start: number; end: number }> = [];

        let match: RegExpExecArray | null;

        while ((match = commentPattern.exec(code))) {
          const start = match.index + match[1].length;
          const end = start + match[2].length + match[3].length;
          ranges.push({ start, end });
        }

        return ranges;
      },
    );

    if (uncommentRanges.length === 0) {
      window.showInformationMessage(
        l10n.t('No commented logs found in the active editor'),
      );
      return;
    }

    // Show progress indicator while uncommenting logs
    await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Uncommenting log statements...'),
        cancellable: false,
      },
      async () => {
        await editor.edit((editBuilder) => {
          uncommentRanges
            .sort((a, b) => b.start - a.start)
            .forEach((range) => {
              const startPos = document.positionAt(range.start);
              const endPos = document.positionAt(range.end);
              editBuilder.delete(new Range(startPos, endPos));
            });
        });
        return;
      },
    );

    window.showInformationMessage(l10n.t('Logs have been uncommented'));
  }

  // Private methods

  /**
   * Validates if the editor is available and active
   * @function validateEditor
   * @private
   * @param {TextEditor | undefined} editor - The editor to validate
   * @returns {boolean} - Whether the editor is valid
   */
  private validateEditor(editor: TextEditor | undefined): editor is TextEditor {
    if (!editor) {
      window.showErrorMessage(l10n.t('No active editor available!'));
      return false;
    }
    return true;
  }

  /**
   * Gets the text from a document with validation
   * @function getDocumentText
   * @private
   * @param {TextDocument} document - The document to get text from
   * @returns {string | null} - The document text or null if invalid
   */
  private getDocumentText(document: TextDocument): string | null {
    if (!document) {
      window.showErrorMessage(l10n.t('No active document available!'));
      return null;
    }

    const text = document.getText();
    if (!text) {
      window.showErrorMessage(l10n.t('The active editor is empty!'));
      return null;
    }

    return text;
  }

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
   * Get the comment token based on the language ID.
   * @function getCommentToken
   * @private
   * @param {string} languageId - The language ID of the document
   * @memberof LogController
   * @example
   * this.getCommentToken(document);
   * @returns {string} - The comment token
   */
  private getCommentToken(languageId: string): string {
    switch (languageId) {
      case 'javascript':
      case 'typescript':
      case 'java':
      case 'csharp':
      case 'cpp':
      case 'go':
      case 'php':
      case 'dart':
      case 'kotlin':
      case 'swift':
      case 'scala':
        return '// ';

      case 'python':
      case 'ruby':
      case 'perl':
      case 'r':
      case 'elixir':
      case 'shellscript':
        return '# ';

      case 'lua':
      case 'haskell':
        return '-- ';

      default:
        return '// ';
    }
  }
}
