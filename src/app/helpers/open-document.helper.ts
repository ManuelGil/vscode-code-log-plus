import { TextEditor, Uri, window, workspace } from 'vscode';

/**
 * Opens a document resource and shows it in the editor.
 *
 * @remarks
 * Accepts either a filesystem path or a `Uri` and dispatches to the
 * matching VS Code overload so the helper remains the single entry point
 * for document opening across the extension.
 *
 * @param resource - File resource represented as VS Code Uri or absolute path.
 * @returns A promise that resolves with the active text editor showing the opened document.
 *
 * @example
 * await openDocument(Uri.file('/tmp/example.md'));
 */
export const openDocument = async (
  resource: Uri | string,
): Promise<TextEditor> => {
  const document = await workspace.openTextDocument(
    resource instanceof Uri ? resource : Uri.file(resource),
  );

  return window.showTextDocument(document);
};
