import { l10n, window } from 'vscode';

/**
 * Shows a standardized error when no workspace folder is available.
 */
export const showNoWorkspaceFolderError = (extensionName: string): void => {
  window.showErrorMessage(
    l10n.t(
      '{0}: No workspace folders are open. Please open a workspace folder to use this extension',
      extensionName,
    ),
  );
};
