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

  // Public properties

  /**
   * The static instance of the CodeHighlighterController class.
   *
   * @static
   * @type {CodeHighlighterController}
   * @memberof CodeHighlighterController
   * @example
   * CodeHighlighterController.instance;
   */
  static instance: CodeHighlighterController;

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
  private constructor(
    public color: string,
    public style: string,
  ) {
    this.decorationType = window.createTextEditorDecorationType({
      textDecoration: `underline ${color} ${style}`,
    });
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * The getInstance method.
   * Get the instance of the CodeHighlighterController class.
   *
   * @function getInstance
   * @param {string} color - The color
   * @param {string} style - The style
   * @public
   * @memberof CodeHighlighterController
   * @example
   * CodeHighlighterController.getInstance(color, style);
   *
   * @returns {CodeHighlighterController} - The code highlighter controller instance
   */
  static getInstance(color: string, style: string) {
    if (!CodeHighlighterController.instance) {
      CodeHighlighterController.instance = new CodeHighlighterController(
        color,
        style,
      );
    }

    return CodeHighlighterController.instance;
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
