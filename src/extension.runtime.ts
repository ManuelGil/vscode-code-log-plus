import {
  commands,
  ExtensionContext,
  env,
  l10n,
  MessageItem,
  Uri,
  WorkspaceFolder,
  window,
  workspace,
} from 'vscode';
import { VSCodeMarketplaceClient } from 'vscode-marketplace-client';

import {
  CommandIds,
  ContextKeys,
  EXTENSION_DISPLAY_NAME,
  EXTENSION_ID,
  EXTENSION_NAME,
  ExtensionConfig,
  REPOSITORY_URL,
  USER_PUBLISHER,
  ViewIds,
} from './app/configs';
import {
  CodeHighlighterController,
  ListLogController,
  LogController,
} from './app/controllers';
import { ListLogProvider } from './app/providers';
import { LogService } from './app/services';

export class ExtensionRuntime {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties

  /**
   * Tracks whether the user has already been warned about the extension being disabled,
   * preventing redundant popup messages.
   *
   * @type {boolean}
   * @private
   * @memberof ExtensionRuntime
   * @example
   * if (!extensionRuntime.isExtensionEnabled()) {
   *   // Warning will only be shown the first time this condition is met
   * }
F   */
  private hasWarningBeenShown = false;

  /**
   * The current configuration instance, loaded based on the selected workspace folder.
   *
   * @type {ExtensionConfig}
   * @private
   * @memberof ExtensionRuntime
   * @example
   * const config = extensionRuntime.extensionConfig;
   * console.log(config.enable);
   */
  private extensionConfig!: ExtensionConfig;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructs a new instance of the extension runtime.
   *
   * @param extensionContext - The context provided by VS Code upon activation.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * export function activate(context: ExtensionContext) {
   *   const extensionRuntime = new ExtensionRuntime(context);
   *   extensionRuntime.initialize().then((initialized) => {
   *     if (initialized) {
   *       extensionRuntime.start();
   *     }
   *   });
   */
  constructor(private readonly extensionContext: ExtensionContext) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * Initializes the extension runtime.
   * Selects the active workspace, loads configuration, and handles version notifications.
   * This must complete successfully before start() is invoked.
   *
   * @returns A promise that resolves to true if initialization succeeded, false otherwise.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * const extensionRuntime = new ExtensionRuntime(context);
   * const initialized = await extensionRuntime.initialize();
   * if (initialized) {
   *   extensionRuntime.start();
   * }
   */
  async initialize(): Promise<boolean> {
    const selectedWorkspace = await this.selectWorkspaceFolder();

    if (!selectedWorkspace) {
      return false;
    }

    this.initializeConfiguration(selectedWorkspace);

    if (!this.isExtensionEnabled()) {
      return false;
    }

    this.startVersionChecks();

    return true;
  }

  /**
   * Starts the extension by registering all commands and providers.
   * This should only be called after successful initialization.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * if (initialized) {
   *   extensionRuntime.start();
   * }
   */
  start(): void {
    this.registerWorkspaceCommands();
    this.registerLogCommands();
    this.registerHighlightCommands();
    const listLogProvider = this.registerListLogCommands();
    if (listLogProvider) {
      this.registerListLogEvents(listLogProvider);
    }
  }

  /**
   * Starts version-related checks without blocking extension activation.
   * Local notifications are fast and run immediately, while the marketplace
   * check runs in the background because it requires a network request.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * extensionRuntime.startVersionChecks();
   */
  private startVersionChecks(): void {
    void this.handleLocalVersionNotifications();
    void this.checkMarketplaceVersion();
  }

  /**
   * Returns the version declared in the extension's package.json.
   * If the version cannot be resolved, a fallback value of '0.0.0' is returned.
   *
   * @returns The current version string.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * const currentVersion = extensionRuntime.getCurrentVersion();
   * console.log(`Current extension version: ${currentVersion}`);
   */
  private getCurrentVersion(): string {
    return this.extensionContext.extension.packageJSON?.version ?? '0.0.0';
  }

  /**
   * Handles version notifications that depend only on local information.
   * This includes first activation messages and update notifications.
   * This method runs synchronously during activation since it does not require any network requests.
   *
   * @returns A promise that resolves when all notifications have been handled.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * await extensionRuntime.handleLocalVersionNotifications();
   */
  private async handleLocalVersionNotifications(): Promise<void> {
    const previousVersion = this.extensionContext.globalState.get<string>(
      ContextKeys.Version,
    );

    const currentVersion = this.getCurrentVersion();

    // Handle first activation of the extension
    if (!previousVersion) {
      const welcomeMessage = l10n.t(
        'Welcome to {0} version {1}! The extension is now active',
        EXTENSION_DISPLAY_NAME,
        currentVersion,
      );

      window.showInformationMessage(welcomeMessage);

      await this.extensionContext.globalState.update(
        ContextKeys.Version,
        currentVersion,
      );

      return;
    }

    // Handle extension update
    if (previousVersion !== currentVersion) {
      const actionReleaseNotes: MessageItem = {
        title: l10n.t('Release Notes'),
      };
      const actionDismiss: MessageItem = { title: l10n.t('Dismiss') };
      const availableActions = [actionReleaseNotes, actionDismiss];

      const updateMessage = l10n.t(
        "The {0} extension has been updated. Check out what's new in version {1}",
        EXTENSION_DISPLAY_NAME,
        currentVersion,
      );

      const userSelection = await window.showInformationMessage(
        updateMessage,
        ...availableActions,
      );

      // Open the changelog in the marketplace if requested by the user
      if (userSelection?.title === actionReleaseNotes.title) {
        const changelogUrl = `${REPOSITORY_URL}/blob/main/CHANGELOG.md`;
        env.openExternal(Uri.parse(changelogUrl));
      }

      // Persist the new version locally
      await this.extensionContext.globalState.update(
        ContextKeys.Version,
        currentVersion,
      );
    }
  }

  /**
   * Checks the VS Code Marketplace for a newer extension version.
   * This operation requires a network request and therefore runs in the background.
   * If a newer version is found, the user is notified with an option to update immediately.
   *
   * @returns A promise that resolves when the check is complete and any notifications have been handled.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * await extensionRuntime.checkMarketplaceVersion();
   */
  private async checkMarketplaceVersion(): Promise<void> {
    const currentVersion = this.getCurrentVersion();

    try {
      const latestVersion = await VSCodeMarketplaceClient.getLatestVersion(
        USER_PUBLISHER,
        EXTENSION_NAME,
      );

      // No action required if the extension is already up to date
      if (latestVersion === currentVersion) {
        return;
      }

      const actionUpdateNow: MessageItem = { title: l10n.t('Update Now') };
      const actionDismiss: MessageItem = { title: l10n.t('Dismiss') };
      const availableActions = [actionUpdateNow, actionDismiss];

      const updateMessage = l10n.t(
        'A new version of {0} is available. Update to version {1} now',
        EXTENSION_DISPLAY_NAME,
        latestVersion,
      );

      const userSelection = await window.showInformationMessage(
        updateMessage,
        ...availableActions,
      );

      // Trigger the VS Code command to install the new version
      if (userSelection?.title === actionUpdateNow.title) {
        await commands.executeCommand(
          'workbench.extensions.action.install.anotherVersion',
          `${USER_PUBLISHER}.${EXTENSION_NAME}`,
        );
      }
    } catch (error) {
      // Marketplace queries may fail due to network issues, so we log it silently
      console.error('Error retrieving extension version:', error);
    }
  }

  /**
   * Selects the workspace folder to use for the extension.
   * VS Code does not guarantee a workspace folder exists during activation,
   * so this method explicitly handles missing workspace scenarios.
   *
   * @returns A promise that resolves to the selected WorkspaceFolder, or undefined if none.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * const selectedFolder = await extensionRuntime.selectWorkspaceFolder();
   * if (selectedFolder) {
   *   console.log(`Selected workspace folder: ${selectedFolder.name}`);
   * } else {
   *   console.log('No workspace folder selected');
   * }
   */
  private async selectWorkspaceFolder(): Promise<WorkspaceFolder | undefined> {
    const availableWorkspaceFolders = workspace.workspaceFolders;

    // Check if there are any workspace folders open
    if (!availableWorkspaceFolders || availableWorkspaceFolders.length === 0) {
      const errorMessage = l10n.t(
        '{0}: No workspace folders are open. Please open a workspace folder to use this extension',
        EXTENSION_DISPLAY_NAME,
      );
      window.showErrorMessage(errorMessage);

      return undefined;
    }

    // Try to load the previously selected workspace folder from global state
    const previousFolderUriString =
      this.extensionContext.globalState.get<string>(
        ContextKeys.SelectedWorkspaceFolder,
      );
    let previousFolder: WorkspaceFolder | undefined;

    // Find the workspace folder by matching URI
    if (previousFolderUriString) {
      previousFolder = availableWorkspaceFolders.find(
        (folder) => folder.uri.toString() === previousFolderUriString,
      );
    }

    // If only one workspace folder is available, use it directly
    if (availableWorkspaceFolders.length === 1) {
      return availableWorkspaceFolders[0];
    }

    // Use the previously selected workspace folder if available
    if (previousFolder) {
      // Notify the user which workspace is being used
      window.showInformationMessage(
        l10n.t('Using workspace folder: {0}', previousFolder.name),
      );

      return previousFolder;
    }

    // Multiple workspace folders are available and no previous selection exists
    const pickerPlaceHolder = l10n.t(
      '{0}: Select a workspace folder to use. This folder will be used to load workspace-specific configuration for the extension',
      EXTENSION_DISPLAY_NAME,
    );
    const selectedFolder = await window.showWorkspaceFolderPick({
      placeHolder: pickerPlaceHolder,
    });

    // Remember the user's selection for future use
    if (selectedFolder) {
      this.extensionContext.globalState.update(
        ContextKeys.SelectedWorkspaceFolder,
        selectedFolder.uri.toString(),
      );
    }

    return selectedFolder;
  }

  /**
   * Initializes configuration and sets up a listener for configuration changes.
   * The listener updates context keys and notifies users when the enable state changes.
   *
   * @param selectedWorkspaceFolder - The workspace folder used to load the configuration.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * const selectedFolder = await extensionRuntime.selectWorkspaceFolder();
   * if (selectedFolder) {
   *   extensionRuntime.initializeConfiguration(selectedFolder);
   * }
   */
  private initializeConfiguration(
    selectedWorkspaceFolder: WorkspaceFolder,
  ): void {
    // Get the configuration for the extension within the selected workspace
    this.extensionConfig = new ExtensionConfig(
      workspace.getConfiguration(EXTENSION_ID, selectedWorkspaceFolder.uri),
    );

    this.extensionConfig.workspaceSelection =
      selectedWorkspaceFolder.uri.fsPath;

    // Watch for changes in the workspace configuration
    workspace.onDidChangeConfiguration((configurationChangeEvent) => {
      const updatedWorkspaceConfig = workspace.getConfiguration(
        EXTENSION_ID,
        selectedWorkspaceFolder.uri,
      );

      if (
        configurationChangeEvent.affectsConfiguration(
          `${EXTENSION_ID}.enable`,
          selectedWorkspaceFolder.uri,
        )
      ) {
        const isExtensionEnabled =
          updatedWorkspaceConfig.get<boolean>('enable');

        this.extensionConfig.update(updatedWorkspaceConfig);

        if (isExtensionEnabled) {
          const enabledMessage = l10n.t(
            'The {0} extension is now enabled and ready to use',
            EXTENSION_DISPLAY_NAME,
          );
          window.showInformationMessage(enabledMessage);
        } else {
          const disabledMessage = l10n.t(
            'The {0} extension is now disabled',
            EXTENSION_DISPLAY_NAME,
          );
          window.showInformationMessage(disabledMessage);
        }
      }

      if (
        configurationChangeEvent.affectsConfiguration(
          EXTENSION_ID,
          selectedWorkspaceFolder.uri,
        )
      ) {
        this.extensionConfig.update(updatedWorkspaceConfig);
      }
    });
  }

  /**
   * Checks if the extension is enabled based on the current configuration.
   * If disabled, shows a warning message to the user (only once).
   *
   * @returns true if the extension is enabled, false otherwise.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * if (extensionRuntime.isExtensionEnabled()) {
   *   // Execute command handler logic
   * } else {
   *   // Command handler will be skipped and a warning will be shown (only on the first check)
   * }
   */
  private isExtensionEnabled(): boolean {
    const isEnabled = this.extensionConfig.enable;

    if (isEnabled) {
      this.hasWarningBeenShown = false;
      return true;
    }

    if (!this.hasWarningBeenShown) {
      window.showErrorMessage(
        l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        ),
      );
      this.hasWarningBeenShown = true;
    }

    return false;
  }

  /**
   * Registers the command that lets users switch the active workspace folder.
   *
   * This command is important for multi-root workspaces where users may want to change which folder the extension operates on.
   * The command updates the global state with the new selection and reloads the configuration accordingly.
   * It also provides user feedback about the workspace change.
   *
   * @memberof ExtensionRuntime
   *
   * @example
   * // The command can be invoked from the command palette or programmatically
   * await commands.executeCommand('myExtension.changeWorkspace');
   */
  private registerWorkspaceCommands(): void {
    // Register a command to change the selected workspace folder
    const disposableChangeWorkspace = commands.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ChangeWorkspace}`,
      async () => {
        const pickerPlaceHolder = l10n.t('Select a workspace folder to use');
        const selectedFolder = await window.showWorkspaceFolderPick({
          placeHolder: pickerPlaceHolder,
        });

        if (selectedFolder) {
          this.extensionContext.globalState.update(
            ContextKeys.SelectedWorkspaceFolder,
            selectedFolder.uri.toString(),
          );

          // Update configuration for the new workspace folder
          const updatedWorkspaceConfig = workspace.getConfiguration(
            EXTENSION_ID,
            selectedFolder.uri,
          );
          this.extensionConfig.update(updatedWorkspaceConfig);

          this.extensionConfig.workspaceSelection = selectedFolder.uri.fsPath;

          window.showInformationMessage(
            l10n.t('Switched to workspace folder: {0}', selectedFolder.name),
          );
        }
      },
    );

    this.extensionContext.subscriptions.push(disposableChangeWorkspace);
  }

  private registerLogCommands(): void {
    if (!this.extensionConfig) {
      return;
    }

    const logService = new LogService(this.extensionConfig);
    const logController = new LogController(logService);

    const logCommands = [
      {
        id: CommandIds.InsertLog,
        handler: () => logController.insertTextInActiveEditor(),
      },
      { id: CommandIds.EditLogs, handler: () => logController.editLogs() },
      { id: CommandIds.RemoveLogs, handler: () => logController.removeLogs() },
      {
        id: CommandIds.CommentLogs,
        handler: () => logController.commentLogs(),
      },
      {
        id: CommandIds.UncommentLogs,
        handler: () => logController.uncommentLogs(),
      },
    ];

    logCommands.forEach(({ id, handler }) => {
      const disposable = commands.registerCommand(
        `${EXTENSION_ID}.${id}`,
        () => {
          if (!this.isExtensionEnabled()) {
            return;
          }

          handler();
        },
      );

      this.extensionContext.subscriptions.push(disposable);
    });
  }

  private registerHighlightCommands(): void {
    if (!this.extensionConfig) {
      return;
    }

    const logService = new LogService(this.extensionConfig);
    const codeHighlightController = new CodeHighlighterController(logService);

    const highlightCommands = [
      {
        id: CommandIds.HighlightLogs,
        handler: () => codeHighlightController.highlightLogs(),
      },
      {
        id: CommandIds.ClearHighlights,
        handler: () => codeHighlightController.clearHighlights(),
      },
    ];

    highlightCommands.forEach(({ id, handler }) => {
      const disposable = commands.registerCommand(
        `${EXTENSION_ID}.${id}`,
        () => {
          if (!this.isExtensionEnabled()) {
            return;
          }

          handler();
        },
      );

      this.extensionContext.subscriptions.push(disposable);
    });
  }

  private registerListLogCommands(): ListLogProvider | undefined {
    if (!this.extensionConfig) {
      return undefined;
    }

    const logService = new LogService(this.extensionConfig);
    const listLogController = new ListLogController(this.extensionConfig);
    const listLogProvider = new ListLogProvider(listLogController, logService);

    const listLogTreeView = window.createTreeView(
      `${EXTENSION_ID}.${ViewIds.ListLogView}`,
      {
        treeDataProvider: listLogProvider,
        showCollapseAll: true,
      },
    );

    const listLogCommands: Array<{
      id: CommandIds;
      handler: (...args: any[]) => void;
    }> = [
      {
        id: CommandIds.ListLogViewRefreshList,
        handler: () => listLogProvider.refresh(),
      },
      {
        id: CommandIds.ListLogViewOpenFile,
        handler: (uri: Uri) => listLogController.openFile(uri),
      },
      {
        id: CommandIds.ListLogViewGotoLine,
        handler: (uri: Uri, line: number) =>
          listLogController.gotoLine(uri, line),
      },
      {
        id: CommandIds.ListLogViewRevealFile,
        handler: (uri: Uri) => listLogController.revealFile(uri),
      },
      {
        id: CommandIds.ListLogViewCopyPath,
        handler: (uri: Uri) => listLogController.copyPath(uri),
      },
      {
        id: CommandIds.ListLogViewOpenContainingFolder,
        handler: (uri: Uri) => listLogController.openContainingFolder(uri),
      },
      {
        id: CommandIds.ListLogViewGotoLineFromNode,
        handler: (uri: Uri) => listLogController.gotoLineFromNode(uri),
      },
      {
        id: CommandIds.ListLogViewCopyLogText,
        handler: (uri: Uri) => listLogController.copyLogText(uri),
      },
    ];

    listLogCommands.forEach(({ id, handler }) => {
      const disposable = commands.registerCommand(
        `${EXTENSION_ID}.${id}`,
        (...args: any[]) => {
          if (!this.isExtensionEnabled()) {
            return;
          }

          handler(...args);
        },
      );

      this.extensionContext.subscriptions.push(disposable);
    });

    this.extensionContext.subscriptions.push(listLogTreeView, listLogProvider);

    return listLogProvider;
  }

  private registerListLogEvents(listLogProvider: ListLogProvider): void {
    let refreshTimeout: ReturnType<typeof setTimeout> | undefined;

    const scheduleRefresh = () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(() => {
        listLogProvider.refresh();
      }, 250);
    };

    const onSaveDisposable = workspace.onDidSaveTextDocument(() => {
      scheduleRefresh();
    });

    const refreshTimerDisposable = {
      dispose: () => refreshTimeout && clearTimeout(refreshTimeout),
    };

    this.extensionContext.subscriptions.push(
      onSaveDisposable,
      refreshTimerDisposable,
    );
  }
}
