// The module 'vscode' contains the VSCode extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Import the Configs, Controllers, and Providers
import {
  EXTENSION_DISPLAY_NAME,
  EXTENSION_ID,
  EXTENSION_NAME,
  ExtensionConfig,
  USER_PUBLISHER,
} from './app/configs';
import { CodeHighlighterController, LogController } from './app/controllers';
import { LogService } from './app/services';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // The code you place here will be executed every time your command is executed
  let resource: vscode.WorkspaceFolder | undefined;

  // Check if there are workspace folders
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    const message = vscode.l10n.t(
      'No workspace folders are open. Please open a workspace folder to use this extension',
    );
    vscode.window.showErrorMessage(message);
    return;
  }

  // Optionally, prompt the user to select a workspace folder if multiple are available
  if (vscode.workspace.workspaceFolders.length === 1) {
    resource = vscode.workspace.workspaceFolders[0];
  } else {
    const placeHolder = vscode.l10n.t(
      'Select a workspace folder to use. This folder will be used to load workspace-specific configuration for the extension',
    );
    const selectedFolder = await vscode.window.showWorkspaceFolderPick({
      placeHolder,
    });

    resource = selectedFolder;
  }

  // -----------------------------------------------------------------
  // Initialize the extension
  // -----------------------------------------------------------------

  // Get the configuration for the extension
  const config = new ExtensionConfig(
    vscode.workspace.getConfiguration(EXTENSION_ID, resource?.uri),
  );

  // Watch for changes in the configuration
  vscode.workspace.onDidChangeConfiguration((event) => {
    const workspaceConfig = vscode.workspace.getConfiguration(
      EXTENSION_ID,
      resource?.uri,
    );

    if (
      event.affectsConfiguration(
        `${EXTENSION_ID}.highlightColor`,
        resource?.uri,
      ) ||
      event.affectsConfiguration(
        `${EXTENSION_ID}.highlightStyle`,
        resource?.uri,
      )
    ) {
      config.update(workspaceConfig);

      // Update the highlighter instance
      codeHighlightController.update(
        config.highlightColor,
        config.highlightStyle,
      );
    }

    if (event.affectsConfiguration(EXTENSION_ID, resource?.uri)) {
      config.update(workspaceConfig);
    }
  });

  // -----------------------------------------------------------------
  // Get version of the extension
  // -----------------------------------------------------------------

  // Get the previous version of the extension
  const previousVersion = context.globalState.get('version');
  // Get the current version of the extension
  const currentVersion = context.extension.packageJSON.version;

  // Check if the extension is running for the first time
  if (!previousVersion) {
    const message = vscode.l10n.t(
      'Welcome to {0} version {1}! The extension is now active',
      [EXTENSION_DISPLAY_NAME, currentVersion],
    );
    vscode.window.showInformationMessage(message);

    // Update the version in the global state
    context.globalState.update('version', currentVersion);
  }

  if (previousVersion && previousVersion !== currentVersion) {
    // Check if the extension has been updated
    const actions: vscode.MessageItem[] = [
      {
        title: vscode.l10n.t('Release Notes'),
      },
      {
        title: vscode.l10n.t('Dismiss'),
      },
    ];

    const message = vscode.l10n.t(
      'New version of {0} is available. Check out the release notes for version {1}',
      [EXTENSION_DISPLAY_NAME, currentVersion],
    );
    vscode.window.showInformationMessage(message, ...actions).then((option) => {
      if (!option) {
        return;
      }

      // Handle the actions
      switch (option?.title) {
        case actions[0].title:
          vscode.env.openExternal(
            vscode.Uri.parse(
              `https://marketplace.visualstudio.com/items/${USER_PUBLISHER}.${EXTENSION_NAME}/changelog`,
            ),
          );
          break;

        default:
          break;
      }
    });

    // Update the version in the global state
    context.globalState.update('version', currentVersion);
  }

  // -----------------------------------------------------------------
  // Register LogService
  // -----------------------------------------------------------------

  // Register the LogService
  const logService = new LogService(config);

  // -----------------------------------------------------------------
  // Register LogController
  // -----------------------------------------------------------------

  // Create a new LogController
  const logController = new LogController(logService);

  const disposableInsertLog = vscode.commands.registerCommand(
    `${EXTENSION_ID}.insertLog`,
    () => {
      if (!config.enable) {
        const message = vscode.l10n.t(
          '{0} is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        );
        vscode.window.showWarningMessage(message);
        return;
      }

      logController.insertTextInActiveEditor();
    },
  );
  const disposableEditLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.editLogs`,
    () => {
      if (!config.enable) {
        const message = vscode.l10n.t(
          '{0} is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        );
        vscode.window.showWarningMessage(message);
        return;
      }

      logController.editLogs();
    },
  );
  const disposableRemoveLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.removeLogs`,
    () => {
      if (!config.enable) {
        const message = vscode.l10n.t(
          '{0} is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        );
        vscode.window.showWarningMessage(message);
        return;
      }

      logController.removeLogs();
    },
  );
  const disposableCommentLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.commentLogs`,
    () => {
      if (!config.enable) {
        const message = vscode.l10n.t(
          '{0} is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        );
        vscode.window.showWarningMessage(message);
        return;
      }

      logController.commentLogs();
    },
  );
  const disposableUncommentLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.uncommentLogs`,
    () => {
      if (!config.enable) {
        const message = vscode.l10n.t(
          '{0} is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        );
        vscode.window.showWarningMessage(message);
        return;
      }

      logController.uncommentLogs();
    },
  );

  // -----------------------------------------------------------------
  // Register CodeHighlightController
  // -----------------------------------------------------------------

  // Register the CodeHighlightController
  const codeHighlightController = new CodeHighlighterController(logService);

  const disposableHighlightLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.highlightLogs`,
    () => {
      if (!config.enable) {
        const message = vscode.l10n.t(
          '{0} is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        );
        vscode.window.showWarningMessage(message);
        return;
      }

      codeHighlightController.highlightLogs();
    },
  );
  const disposableClearHighlights = vscode.commands.registerCommand(
    `${EXTENSION_ID}.clearHighlights`,
    () => {
      if (!config.enable) {
        const message = vscode.l10n.t(
          '{0} is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        );
        vscode.window.showWarningMessage(message);
        return;
      }

      codeHighlightController.clearHighlights();
    },
  );

  context.subscriptions.push(
    disposableInsertLog,
    disposableEditLogs,
    disposableRemoveLogs,
    disposableHighlightLogs,
    disposableClearHighlights,
    disposableCommentLogs,
    disposableUncommentLogs,
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
