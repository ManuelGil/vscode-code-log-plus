import {
  Range,
  TextEditor,
  TextEditorDecorationType,
  l10n,
  window,
} from 'vscode';

import { LogService } from '../services';

/**
 * The class that represents the code highlighter controller.
 * @example const controller = new CodeHighlighterController(logService);
 */
export class CodeHighlighterController {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Private properties

  /**
   * The decoration type object.
   */
  private decorationType: TextEditorDecorationType;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the CodeHighlighterController class.
   */
  constructor(readonly service: LogService) {
    const { highlightColor, highlightStyle } = this.service.config;

    this.decorationType = window.createTextEditorDecorationType({
      textDecoration: `underline ${highlightColor} ${highlightStyle}`,
    });
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * Highlight the log statements in the active editor.
   * @example controller.highlightLogs();
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

    const { languageId } = editor.document;

    const logRanges = this.service.findLogEntries(code, languageId);

    this.highlight(
      editor,
      logRanges,
      l10n.t(
        'You can remove the log statements by using the command: "Remove Logs"',
      ),
    );
  }

  /**
   * Remove the highlights from the active editor.
   * @example controller.clearHighlights();
   */
  clearHighlights() {
    const editor = window.activeTextEditor;

    if (!editor) {
      const message = l10n.t('No active editor available!');
      window.showErrorMessage(message);
      return;
    }

    this.clear(editor);
  }

  /**
   * Update the decoration type object.
   * @param {string} color - The color
   * @param {string} style - The style
   */
  update(color: string, style: string) {
    this.decorationType = window.createTextEditorDecorationType({
      textDecoration: `underline ${color} ${style}`,
    });
  }

  // Private methods

  /**
   * Highlight the ranges in the editor.
   * @param {TextEditor} editor - The text editor
   * @param {Array<{ start: number; end: number }>} ranges - The ranges
   * @param {string} hoverMessage - The hover message
   */
  private highlight(
    editor: TextEditor,
    ranges: Array<{ start: number; end: number }>,
    hoverMessage: string,
  ) {
    const decorations = ranges.map((range) => {
      const startPos = editor.document.positionAt(range.start);
      const endPos = editor.document.positionAt(range.end);
      return { range: new Range(startPos, endPos), hoverMessage };
    });

    editor.setDecorations(this.decorationType, decorations);
  }

  /**
   * Clear the decorations in the editor.
   * @param {TextEditor} editor - The text editor
   */
  private clear(editor: TextEditor) {
    editor.setDecorations(this.decorationType, []);
  }
}
