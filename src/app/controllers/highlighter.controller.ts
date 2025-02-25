import { Range, TextEditor, TextEditorDecorationType, window } from 'vscode';

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
   * @param {string} color - The color
   * @param {string} style - The style
   * @public
   * @memberof CodeHighlighterController
   */
  constructor(color: string, style: string) {
    this.decorationType = window.createTextEditorDecorationType({
      textDecoration: `underline 1.3px ${color} ${style}`,
    });
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

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
  highlight(
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
  clear(editor: TextEditor) {
    editor.setDecorations(this.decorationType, []);
  }
}
