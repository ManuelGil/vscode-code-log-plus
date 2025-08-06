// The module 'vscode' contains the VSCode extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { VSCodeMarketplaceClient } from 'vscode-marketplace-client';

// Import the Configs, Controllers, and Providers
import {
  EXTENSION_DISPLAY_NAME,
  EXTENSION_ID,
  EXTENSION_NAME,
  ExtensionConfig,
  USER_PUBLISHER,
} from './app/configs';
import {
  CodeHighlighterController,
  ListLogController,
  LogController,
} from './app/controllers';
import { LogService } from './app/services';
import { ListLogProvider } from './app/providers';

/**
 * Helper function to check if the extension is enabled
 * @param config The extension configuration
 * @returns True if the extension is enabled, false otherwise
 */
let warningShown = false;

function isExtensionEnabled(config: ExtensionConfig): boolean {
  if (!config.enable) {
    if (!warningShown) {
      const message = vscode.l10n.t(
        'The {0} extension is disabled in settings. Enable it to use its features',
        EXTENSION_DISPLAY_NAME,
      );
      vscode.window.showWarningMessage(message);
      warningShown = true;
    }
    return false;
  }

  warningShown = false;
  return true;
}

/**
 * This method is called when the extension is activated.
 * It sets up the extension, registers commands, and initializes services.
 * @param context The extension context provided by VSCode.
 */
export async function activate(context: vscode.ExtensionContext) {
  // The code you place here will be executed every time your command is executed
  let resource: vscode.WorkspaceFolder | undefined;

  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    // Check if there are workspace folders
    const message = vscode.l10n.t(
      'No workspace folders are open. Please open a workspace folder to use this extension',
    );
    vscode.window.showErrorMessage(message);
    return;
  }

  // Try to load previously selected workspace folder from global state
  const previousFolderUri = context.globalState.get<string>(
    'selectedWorkspaceFolder',
  );
  let previousFolder: vscode.WorkspaceFolder | undefined;

  if (previousFolderUri) {
    // Find the workspace folder by URI
    previousFolder = vscode.workspace.workspaceFolders.find(
      (folder) => folder.uri.toString() === previousFolderUri,
    );
  }

  if (vscode.workspace.workspaceFolders.length === 1) {
    // Determine the workspace folder to use
    // Only one workspace folder available
    resource = vscode.workspace.workspaceFolders[0];
  } else if (previousFolder) {
    // Use previously selected workspace folder if available
    resource = previousFolder;

    // Notify the user which workspace is being used
    vscode.window.showInformationMessage(
      vscode.l10n.t('Using workspace folder: {0}', [resource.name]),
    );
  } else {
    // Multiple workspace folders and no previous selection
    const placeHolder = vscode.l10n.t(
      'Select a workspace folder to use. This folder will be used to load workspace-specific configuration for the extension',
    );
    const selectedFolder = await vscode.window.showWorkspaceFolderPick({
      placeHolder,
    });

    resource = selectedFolder;

    // Remember the selection for future use
    if (resource) {
      context.globalState.update(
        'selectedWorkspaceFolder',
        resource.uri.toString(),
      );
    }
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

    if (event.affectsConfiguration(`${EXTENSION_ID}.enable`, resource?.uri)) {
      const isEnabled = workspaceConfig.get<boolean>('enable');

      config.update(workspaceConfig);

      if (isEnabled) {
        const message = vscode.l10n.t(
          'The {0} extension is now enabled and ready to use',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showInformationMessage(message);
      } else {
        const message = vscode.l10n.t('The {0} extension is now disabled', [
          EXTENSION_DISPLAY_NAME,
        ]);
        vscode.window.showInformationMessage(message);
      }
    }

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

  if (!previousVersion) {
    // Check if the extension is running for the first time
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
      "The {0} extension has been updated. Check out what's new in version {1}",
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
  // Check for updates
  // -----------------------------------------------------------------

  // Check for updates to the extension
  try {
    // Retrieve the latest version
    VSCodeMarketplaceClient.getLatestVersion(USER_PUBLISHER, EXTENSION_NAME)
      .then((latestVersion: string) => {
        // Check if the latest version is different from the current version
        if (latestVersion > currentVersion) {
          const actions: vscode.MessageItem[] = [
            {
              title: vscode.l10n.t('Update'),
            },
            {
              title: vscode.l10n.t('Dismiss'),
            },
          ];

          const message = vscode.l10n.t(
            'A new version of {0} is available. Update to version {1} now',
            [EXTENSION_DISPLAY_NAME, latestVersion],
          );
          vscode.window
            .showInformationMessage(message, ...actions)
            .then((option) => {
              if (!option) {
                return;
              }

              // Handle the actions
              switch (option?.title) {
                case actions[0].title:
                  vscode.env.openExternal(
                    vscode.Uri.parse(
                      `https://marketplace.visualstudio.com/items?itemName=${USER_PUBLISHER}.${EXTENSION_NAME}`,
                    ),
                  );
                  break;
              }
            });
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error('Error checking for updates:', error.message);
        } else {
          console.error(
            'An unknown error occurred while checking for updates:',
            error,
          );
        }
        const message = vscode.l10n.t(
          'Failed to check for new version of the extension',
        );
        vscode.window.showErrorMessage(message);
      });
  } catch (error) {
    // Only log fatal errors that occur during the update check process
    console.error('Fatal error while checking for extension updates:', error);
  }

  // -----------------------------------------------------------------
  // Register commands
  // -----------------------------------------------------------------

  // Register a command to change the selected workspace folder
  const disposableChangeWorkspace = vscode.commands.registerCommand(
    `${EXTENSION_ID}.changeWorkspace`,
    async () => {
      const placeHolder = vscode.l10n.t('Select a workspace folder to use');
      const selectedFolder = await vscode.window.showWorkspaceFolderPick({
        placeHolder,
      });

      if (selectedFolder) {
        resource = selectedFolder;
        context.globalState.update(
          'selectedWorkspaceFolder',
          resource.uri.toString(),
        );

        // Update configuration for the new workspace folder
        const workspaceConfig = vscode.workspace.getConfiguration(
          EXTENSION_ID,
          resource?.uri,
        );
        config.update(workspaceConfig);

        vscode.window.showInformationMessage(
          vscode.l10n.t('Switched to workspace folder: {0}', [resource.name]),
        );
      }
    },
  );

  context.subscriptions.push(disposableChangeWorkspace);

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
      if (!isExtensionEnabled(config)) {
        return;
      }

      logController.insertTextInActiveEditor();
    },
  );
  const disposableEditLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.editLogs`,
    () => {
      if (!isExtensionEnabled(config)) {
        return;
      }

      logController.editLogs();
    },
  );
  const disposableRemoveLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.removeLogs`,
    () => {
      if (!isExtensionEnabled(config)) {
        return;
      }

      logController.removeLogs();
    },
  );
  const disposableCommentLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.commentLogs`,
    () => {
      if (!isExtensionEnabled(config)) {
        return;
      }

      logController.commentLogs();
    },
  );
  const disposableUncommentLogs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.uncommentLogs`,
    () => {
      if (!isExtensionEnabled(config)) {
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
      if (!isExtensionEnabled(config)) {
        return;
      }

      codeHighlightController.highlightLogs();
    },
  );
  const disposableClearHighlights = vscode.commands.registerCommand(
    `${EXTENSION_ID}.clearHighlights`,
    () => {
      if (!isExtensionEnabled(config)) {
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

  // -----------------------------------------------------------------
  // Register ListLogProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListLogController
  const listLogController = new ListLogController(config);

  // Create a new ListLogProvider
  const listLogProvider = new ListLogProvider(listLogController, logService);

  // Register the list provider
  const listLogTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listLogView`,
    {
      treeDataProvider: listLogProvider,
      showCollapseAll: true,
    },
  );

  const disposableRefreshList = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listLogView.refreshList`,
    () => {
      if (!isExtensionEnabled(config)) {
        return;
      }

      listLogProvider.refresh();
    },
  );

  const disposableOpenFile = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listLogView.openFile`,
    (uri) => {
      if (!isExtensionEnabled(config)) {
        return;
      }

      listLogController.openFile(uri);
    },
  );

  const disposableGotoLine = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listLogView.gotoLine`,
    (uri, line) => {
      if (!isExtensionEnabled(config)) {
        return;
      }

      listLogController.gotoLine(uri, line);
    },
  );

  context.subscriptions.push(
    listLogTreeView,
    disposableRefreshList,
    disposableOpenFile,
    disposableGotoLine,
  );

  // -----------------------------------------------------------------
  // Register ListLogProvider and ListMethodsProvider events
  // -----------------------------------------------------------------

  vscode.workspace.onDidSaveTextDocument(() => {
    listLogProvider.refresh();
  });
}

/**
 * This method is called when the extension is deactivated.
 * It cleans up any resources that the extension allocated.
 */
export function deactivate() {
  // Currently no cleanup needed
}
