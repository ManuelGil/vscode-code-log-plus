import {
  commands,
  DocumentSymbol,
  l10n,
  Position,
  ProgressLocation,
  Range,
  Selection,
  SymbolKind,
  TextDocument,
  TextEditor,
  window,
  workspace,
} from 'vscode';

import { LogService } from '../services';
import { LogEntry } from '../types';

type LogScope = 'selection' | 'function' | 'file';
type RawLog = Pick<LogEntry, 'start' | 'end' | 'line' | 'preview' | 'fullText'>;

/**
 * Controller for handling log-related commands.
 */
export class LogController {
  /**
   * Creates an instance of LogController.
   * @param service - The log service for generating and finding logs.
   */
  constructor(readonly service: LogService) {}

  /**
   * Inserts a log message at the current cursor position in the active editor.
   */
  async insertTextInActiveEditor(): Promise<void> {
    const editor = window.activeTextEditor;
    if (!this.validateEditor(editor)) {
      return;
    }

    const document = editor.document;

    // Support multiple selections (multi-cursor). Build insertion snippets
    // for each selection and apply them in descending line order to avoid
    // offset issues when inserting multiple times.
    const selections = editor.selections;
    const insertions: Array<{
      lineNumber: number;
      snippet: string;
    }> = [];

    for (const sel of selections) {
      const lineNumber = sel.end.line;
      const cursorPosition = sel.active;
      const rangeUnderCursor = document.getWordRangeAtPosition(cursorPosition);
      const wordUnderCursor = rangeUnderCursor
        ? document.getText(rangeUnderCursor)
        : '';
      const indent = ' '.repeat(
        document.lineAt(lineNumber).firstNonWhitespaceCharacterIndex,
      );

      const functionName = await this.extractFunctionName(document, sel.start);
      const variableName =
        document.getText(sel).trim() || wordUnderCursor || 'variable';

      const logSnippet = this.service.generateLogSnippet(
        indent,
        workspace.asRelativePath(document.fileName),
        functionName,
        variableName,
        lineNumber + 1,
        document.languageId,
      );

      insertions.push({ lineNumber, snippet: logSnippet });
    }

    // Sort descending by line so that inserts do not affect positions of earlier ones.
    insertions.sort((a, b) => b.lineNumber - a.lineNumber);

    await editor.edit((editBuilder) => {
      for (const ins of insertions) {
        const insertPosition = new Position(ins.lineNumber + 1, 0);
        editBuilder.insert(insertPosition, ins.snippet);
      }
    });

    // After edit, move selections to the end of the newly inserted snippets.
    const newSelections = insertions.map((ins) => {
      const line = editor.document.lineAt(ins.lineNumber + 1);
      const pos = new Position(ins.lineNumber + 1, line.range.end.character);
      return new Selection(pos, pos);
    });

    if (newSelections.length > 0) {
      editor.selections = newSelections;
    }
  }

  /**
   * Allows the user to edit a log statement from a list of logs in the active editor.
   */
  async editLogs(): Promise<void> {
    const selectedLogs = await this.findAndSelectLogs(true);
    if (!selectedLogs || selectedLogs.length === 0) {
      return;
    }

    const editor = window.activeTextEditor!;
    const newLogCommand = await window.showInputBox({
      prompt: l10n.t('Enter new log command'),
      placeHolder: 'e.g. console.error',
    });
    if (!newLogCommand) {
      window.showInformationMessage(l10n.t('No new log command provided'));
      return;
    }

    await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Updating log statements...'),
        cancellable: false,
      },
      async () => {
        await editor.edit((editBuilder) => {
          const sorted = selectedLogs.sort((a, b) => b.start - a.start);
          sorted.forEach((item) => {
            const startPos = editor.document.positionAt(item.start);
            const endPos = editor.document.positionAt(item.end);
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
   * Removes selected log statements from the active editor.
   */
  async removeLogs(): Promise<void> {
    const editor = window.activeTextEditor;
    if (!this.validateEditor(editor)) {
      return;
    }

    const scope = await this.pickLogScope();
    if (!scope) {
      return;
    }

    const selectedLogs = await this.findAndSelectLogs(true, scope);
    if (!selectedLogs || selectedLogs.length === 0) {
      return;
    }

    const activeEditor = window.activeTextEditor!;
    await activeEditor.edit((editBuilder) => {
      for (const log of selectedLogs) {
        const line = activeEditor.document.lineAt(log.range.start.line);
        const range =
          line.lineNumber < activeEditor.document.lineCount - 1
            ? line.rangeIncludingLineBreak
            : line.range;

        editBuilder.delete(range);
      }
    });
  }

  /**
   * Comments out selected log statements in the active editor.
   */
  async commentLogs(): Promise<void> {
    const editor = window.activeTextEditor;
    if (!this.validateEditor(editor)) {
      return;
    }

    const scope = await this.pickLogScope();
    if (!scope) {
      return;
    }

    const selectedLogs = await this.findAndSelectLogs(true, scope);
    if (!selectedLogs || selectedLogs.length === 0) {
      return;
    }

    const activeEditor = window.activeTextEditor!;
    const commentToken = this.getCommentToken(activeEditor.document.languageId);

    await activeEditor.edit((editBuilder) => {
      for (const log of selectedLogs) {
        if (!log.isCommented) {
          editBuilder.insert(log.range.start, commentToken);
        }
      }
    });
  }

  /**
   * Uncomments selected log statements in the active editor.
   */
  async uncommentLogs(): Promise<void> {
    const editor = window.activeTextEditor;
    if (!this.validateEditor(editor)) {
      return;
    }

    const scope = await this.pickLogScope();
    if (!scope) {
      return;
    }

    const selectedLogs = await this.findAndSelectLogs(true, scope);
    if (!selectedLogs || selectedLogs.length === 0) {
      return;
    }

    const activeEditor = window.activeTextEditor!;
    const commentToken = this.getCommentToken(activeEditor.document.languageId);

    await activeEditor.edit((editBuilder) => {
      for (const log of selectedLogs) {
        if (log.isCommented) {
          const line = activeEditor.document.lineAt(log.range.start.line);
          const lineText = line.text;
          const indentMatch = lineText.match(/^(\s*)/);
          const indent = indentMatch ? indentMatch[1] : '';
          const commentIndex = lineText.indexOf(commentToken, indent.length);
          if (commentIndex === indent.length) {
            const start = new Position(line.lineNumber, commentIndex);
            const end = new Position(
              line.lineNumber,
              commentIndex + commentToken.length,
            );
            editBuilder.delete(new Range(start, end));
          }
        }
      }
    });
  }

  // Private methods

  /**
   * Validates if the editor is available and active.
   * @param editor - The editor to validate.
   * @returns True if the editor is valid, false otherwise.
   */
  private validateEditor(editor: TextEditor | undefined): editor is TextEditor {
    if (!editor) {
      window.showErrorMessage(l10n.t('No active editor available!'));
      return false;
    }
    return true;
  }

  /**
   * Gets the entire text from a document.
   * @param document - The document to get text from.
   * @returns The document text or null if empty.
   */
  private getDocumentText(document: TextDocument): string | null {
    const text = document.getText();
    if (!text) {
      window.showInformationMessage(l10n.t('The active editor is empty!'));
      return null;
    }
    return text;
  }

  /**
   * Gets the document symbols for the active document.
   * @param document - The text document.
   * @returns The document symbols.
   */
  private async getDocumentSymbols(
    document: TextDocument,
  ): Promise<DocumentSymbol[]> {
    const symbols = (await commands.executeCommand(
      'vscode.executeDocumentSymbolProvider',
      document.uri,
    )) as DocumentSymbol[] | undefined;

    return symbols ?? [];
  }

  /**
   * Extracts the name of the function containing the given position.
   * @param document - The text document.
   * @param position - The position in the document.
   * @returns The function name or an empty string.
   */
  private async extractFunctionName(
    document: TextDocument,
    position: Position,
  ): Promise<string> {
    const symbols = (await commands.executeCommand(
      'vscode.executeDocumentSymbolProvider',
      document.uri,
    )) as DocumentSymbol[] | undefined;

    if (symbols) {
      const funcSymbol = this.findFunctionSymbol(symbols, position);
      if (funcSymbol) {
        return funcSymbol.name.trim();
      }
    }

    const lineText = document.lineAt(position.line).text;
    const regex =
      /\b(?:const|let|var)\s+([\w$]+)\s*=\s*(?:async\s*)?(?:function\*?|\(.*\))\s*=>/;
    const match = regex.exec(lineText);
    return match ? match[1] : '';
  }

  /**
   * Finds the function symbol that contains the specified position.
   * @param symbols - The list of document symbols.
   * @param position - The position in the document.
   * @returns The function symbol or undefined.
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
        const result = this.findFunctionSymbol(symbol.children, position);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  /**
   * Finds and allows the user to select log entries in the active editor.
   * @param canPickMany - Whether the user can select multiple logs.
   * @param scope - Optional scope to limit log selection.
   * @returns The selected log entries or null.
   */
  private async findAndSelectLogs(
    canPickMany: boolean,
    scope?: LogScope,
  ): Promise<LogEntry[] | null> {
    const editor = window.activeTextEditor;
    if (!this.validateEditor(editor)) {
      return null;
    }

    const document = editor.document;
    const code = this.getDocumentText(document);
    if (!code) {
      return null;
    }

    type RawLog = {
      start: number;
      end: number;
      line: number;
      preview: string;
      fullText: string;
    };

    const rawLogs = (await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Searching for log statements...'),
        cancellable: false,
      },
      () =>
        Promise.resolve(this.service.findLogEntries(code, document.languageId)),
    )) as RawLog[];

    if (!rawLogs || rawLogs.length === 0) {
      window.showInformationMessage(
        l10n.t('No logs found in the active editor'),
      );
      return null;
    }

    let logsToProcess = rawLogs;
    const symbols =
      scope === 'function' ? await this.getDocumentSymbols(document) : [];

    if (scope) {
      const scopeRange = this.getScopeRange(editor, scope, symbols);

      if (scope === 'selection' && !scopeRange) {
        window.showInformationMessage(
          l10n.t('No active selection available'),
        );
        return null;
      }

      if (scopeRange) {
        const scopeStart = document.offsetAt(scopeRange.start);
        const scopeEnd = document.offsetAt(scopeRange.end);

        logsToProcess = rawLogs.filter(
          (log) => log.start >= scopeStart && log.end <= scopeEnd,
        );

        if (!logsToProcess.length) {
          window.showInformationMessage(
            l10n.t('No logs found in the selected scope'),
          );

          return null;
        }
      }
    }

    const logs: LogEntry[] = await Promise.all(
      logsToProcess.map(async (rawLog) => {
        const range = new Range(
          document.positionAt(rawLog.start),
          document.positionAt(rawLog.end),
        );
        const lineText = document.lineAt(range.start.line).text;
        const indentation = lineText.substring(0, range.start.character);
        const commentToken = this.getCommentToken(document.languageId);
        const isCommented = lineText.trim().startsWith(commentToken.trim());
        const functionName = await this.extractFunctionName(
          document,
          range.start,
        );
        const match = /,\s*([^)]*)\s*\)/.exec(rawLog.fullText);
        const log = match ? match[1].trim() : rawLog.preview;

        return {
          ...rawLog,
          range,
          indentation,
          isCommented,
          functionName,
          log,
        };
      }),
    );

    const picks = logs.map((log) => ({
      label: `Line ${log.line}: ${log.preview}`,
      description: log.functionName ? l10n.t('in {0}', log.functionName) : '',
      log,
    }));

    const placeHolder = canPickMany
      ? l10n.t('Select logs to process')
      : l10n.t('Select a log to process');

    const selectedPicks = await window.showQuickPick(picks, {
      placeHolder,
      canPickMany,
    });

    if (!selectedPicks) {
      return null;
    }

    return Array.isArray(selectedPicks)
      ? selectedPicks.map((p) => p.log)
      : [selectedPicks.log];
  }

  /**
   * Prompts for the log scope to use.
   * @returns The selected scope or null if cancelled.
   */
  private async pickLogScope(): Promise<LogScope | null> {
    const selectedScope = await window.showQuickPick(
      [
        { label: l10n.t('Selection'), value: 'selection' as const },
        { label: l10n.t('Function'), value: 'function' as const },
        { label: l10n.t('File'), value: 'file' as const },
      ],
      {
        placeHolder: l10n.t('Select log scope'),
        canPickMany: false,
      },
    );

    return selectedScope?.value ?? null;
  }

  /**
   * Gets the range for the selected scope.
   * @param editor - The active editor.
   * @param scope - The selected scope.
   * @returns The range for the scope, or undefined when it falls back to the full file.
   */
  private getScopeRange(
    editor: TextEditor,
    scope: LogScope,
    symbols: DocumentSymbol[] = [],
  ): Range | undefined {
    switch (scope) {
      case 'selection':
        return editor.selection.isEmpty ? undefined : editor.selection;

      case 'function': {
        const symbol =
          this.findFunctionSymbol(symbols, editor.selection.active) ??
          this.findFunctionSymbol(symbols, editor.selection.start);

        return symbol?.range;
      }

      default:
        return undefined;
    }
  }

  /**
   * Gets the comment token for a given language ID.
   * @param languageId - The language ID.
   * @returns The comment token.
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
