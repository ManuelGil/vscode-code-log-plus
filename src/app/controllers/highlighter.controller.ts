import {
  l10n,
  Range,
  TextEditor,
  TextEditorDecorationType,
  window,
} from 'vscode';

import { LogService } from '../services';

/**
 * The CodeHighlighterController class.
 *
 * @class
 * @classdesc The class that represents the code highlighter controller.
 * @export
 * @public
 * @property {TextEditorDecorationType} decorationType - The decoration type object
 * @example
 * const controller = new CodeHighlighterController();
 */
export class CodeHighlighterController {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Private properties

  /**
   * The decoration type object.
   *
   * @private
   * @type {TextEditorDecorationType}
   * @memberof CodeHighlighterController
   * @example
   * this.decorationType;
   */
  private decorationType: TextEditorDecorationType;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the CodeHighlighterController class
   *
   * @constructor
   * @public
   * @memberof CodeHighlighterController
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

    this.clear(editor);
  }

  /**
   * The update method.
   * Update the decoration type object.
   *
   * @function update
   * @param {string} color - The color
   * @param {string} style - The style
   * @public
   * @memberof CodeHighlighterController
   */
  update(color: string, style: string) {
    this.decorationType = window.createTextEditorDecorationType({
      textDecoration: `underline ${color} ${style}`,
    });
  }

  // Private methods

  /**
   * The highlight method.
   * Highlight the ranges in the editor.
   *
   * @function highlight
   * @param {TextEditor} editor - The text editor
   * @param {Array<{ start: number; end: number }>} ranges - The ranges
   * @param {string} hoverMessage - The hover message
   * @public
   * @memberof CodeHighlighterController
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
   * The clear method.
   * Clear the decorations in the editor.
   *
   * @function clear
   * @param {TextEditor} editor - The text editor
   * @public
   * @memberof CodeHighlighterController
   */
  private clear(editor: TextEditor) {
    editor.setDecorations(this.decorationType, []);
  }
}
