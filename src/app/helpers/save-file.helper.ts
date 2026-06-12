/**
 * @fileoverview Safely writes generated file content to disk within the workspace.
 * Handles directory creation, secure path validation, duplicate detection,
 * progress/cancellation UI, and post-creation cache invalidation.
 */

import { isAbsolute, normalize } from 'path';
import {
  FileSystemError,
  l10n,
  ProgressLocation,
  Uri,
  window,
  workspace,
} from 'vscode';

import { EXTENSION_DISPLAY_NAME, ExtensionConfig } from '../configs';
import { showNoWorkspaceFolderError } from './error-message.helper';
import { clearCache } from './find-files.helper';
import { openDocument } from './open-document.helper';
import { getWorkspaceRoot } from './workspace-root.helper';

/**
 * Writes data to a file inside the current workspace.
 * If the file does not exist, it will be created safely.
 *
 * @param directoryPath - Absolute or workspace-relative directory path.
 * @param filename - Name of the file to create.
 * @param fileContent - Text content to write.
 * @param config - Active extension configuration.
 */
export const saveFile = async (
  directoryPath: string,
  filename: string,
  fileContent: string,
  config: ExtensionConfig,
): Promise<void> => {
  const normalizedDirPath = normalize(directoryPath || '.');
  const providedDirectoryUri = isAbsolute(normalizedDirPath)
    ? Uri.file(normalizedDirPath)
    : undefined;

  const activeWorkspaceRoot = getWorkspaceRoot(config, providedDirectoryUri);

  if (!activeWorkspaceRoot) {
    showNoWorkspaceFolderError(EXTENSION_DISPLAY_NAME);
    return;
  }

  const workspaceRootUri = Uri.file(activeWorkspaceRoot);

  /**
   * Build the target directory URI safely.
   *
   * Absolute paths are used directly.
   * Relative paths are resolved against the workspace root.
   */
  const resolvedDirectoryUri = isAbsolute(normalizedDirPath)
    ? providedDirectoryUri!
    : Uri.joinPath(workspaceRootUri, normalizedDirPath);

  /**
   * Security check:
   * Ensure the resolved path stays inside the workspace root.
   * Prevents directory traversal and unintended writes.
   */
  const relativeCheck = workspace.asRelativePath(resolvedDirectoryUri, false);
  if (relativeCheck.startsWith('..')) {
    window.showErrorMessage(l10n.t('Invalid directory path'));
    return;
  }

  const resolvedFileUri = Uri.joinPath(resolvedDirectoryUri, filename);

  let successfullyCreatedFilePath: string | undefined;

  try {
    await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Creating file: {0}', filename),
        cancellable: true,
      },
      async (_progressIndicator, cancellationToken) => {
        try {
          if (cancellationToken.isCancellationRequested) {
            return;
          }

          // Ensure directory exists (safe if already exists)
          if (resolvedDirectoryUri.toString() !== workspaceRootUri.toString()) {
            await workspace.fs.createDirectory(resolvedDirectoryUri);
          }

          // Detect file collision
          let doesFileExist = false;
          try {
            await workspace.fs.stat(resolvedFileUri);
            doesFileExist = true;
          } catch (statError: unknown) {
            if (!(statError instanceof FileSystemError)) {
              throw statError;
            }
          }

          if (cancellationToken.isCancellationRequested) {
            return;
          }

          // Handle existing file
          if (doesFileExist) {
            const openFileLabel = l10n.t('Open File');
            const userChoice = await window.showWarningMessage(
              l10n.t('File already exists: {0}', filename),
              openFileLabel,
            );

            if (userChoice === openFileLabel) {
              await openDocument(resolvedFileUri);
            }
            return;
          }

          // Write file content
          const encodedFileContent = new TextEncoder().encode(fileContent);
          await workspace.fs.writeFile(resolvedFileUri, encodedFileContent);

          if (cancellationToken.isCancellationRequested) {
            return;
          }

          // Open created file
          await openDocument(resolvedFileUri);

          // Mark success; show notification after progress resolves
          successfullyCreatedFilePath = resolvedFileUri.fsPath;

          // Invalidate file discovery cache
          clearCache();
        } catch (innerError: any) {
          // Show a helpful error message including the underlying error if available
          window.showErrorMessage(
            l10n.t(
              'Error creating file: {0}. Please check the path and try again',
              innerError?.message ?? String(innerError),
            ),
          );
        }
      },
    );

    // Show success notification after progress dialog closes
    if (successfullyCreatedFilePath) {
      window.showInformationMessage(
        l10n.t('File created successfully: {0}', successfullyCreatedFilePath),
      );
    }
  } catch (outerError: any) {
    // Catch failures from withProgress or other unexpected issues
    window.showErrorMessage(
      l10n.t(
        'Error creating file: {0}. Please check the path and try again',
        outerError?.message ?? String(outerError),
      ),
    );
  }
};
