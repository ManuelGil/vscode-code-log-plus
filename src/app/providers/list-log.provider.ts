import {
  Event,
  EventEmitter,
  ProviderResult,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
  workspace,
} from 'vscode';

import { EXTENSION_ID } from '../configs';
import { ListLogController } from '../controllers';
import { escapeRegExp } from '../helpers';
import { NodeModel } from '../models';
import { LogService } from '../services';

/**
 * The ListLogProvider class
 *
 * @class
 * @classdesc The class that represents the list of files provider.
 * @export
 * @public
 * @implements {TreeDataProvider<NodeModel>}
 * @property {EventEmitter<NodeModel | undefined | null | void>} _onDidChangeTreeData - The onDidChangeTreeData event emitter
 * @property {Event<NodeModel | undefined | null | void>} onDidChangeTreeData - The onDidChangeTreeData event
 * @property {ListLogController} controller - The list of files controller
 * @example
 * const provider = new ListLogProvider();
 *
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
 */
export class ListLogProvider implements TreeDataProvider<NodeModel> {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Private properties
  /**
   * The onDidChangeTreeData event emitter.
   * @type {EventEmitter<NodeModel | undefined | null | void>}
   * @private
   * @memberof ListLogProvider
   * @example
   * this._onDidChangeTreeData = new EventEmitter<Node | undefined | null | void>();
   * this.onDidChangeTreeData = this._onDidChangeTreeData.event;
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#EventEmitter
   */
  private _onDidChangeTreeData: EventEmitter<
    NodeModel | undefined | null | void
  >;

  /**
   * Indicates whether the provider has been disposed.
   * @type {boolean}
   * @private
   * @memberof ListLogProvider
   * @example
   * this._isDisposed = false;
   */
  private _isDisposed = false;

  /**
   * The cached nodes.
   * @type {NodeModel[] | undefined}
   * @private
   * @memberof ListLogProvider
   * @example
   * this._cachedNodes = undefined;
   */
  private _cachedNodes: NodeModel[] | undefined = undefined;

  /**
   * The cache promise.
   * @type {Promise<NodeModel[] | undefined> | undefined}
   * @private
   * @memberof ListLogProvider
   * @example
   * this._cachePromise = undefined;
   */
  private _cachePromise: Promise<NodeModel[] | undefined> | undefined =
    undefined;

  /**
   * Version token to invalidate in-flight cache loads on refresh.
   */
  private _version = 0;

  // Public properties
  /**
   * The onDidChangeTreeData event.
   * @type {Event<NodeModel | undefined | null | void>}
   * @public
   * @memberof ListLogProvider
   * @example
   * readonly onDidChangeTreeData: Event<Node | undefined | null | void>;
   * this.onDidChangeTreeData = this._onDidChangeTreeData.event;
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#Event
   */
  readonly onDidChangeTreeData: Event<NodeModel | undefined | null | void>;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ListLogProvider class
   *
   * @constructor
   * @public
   * @memberof ListLogProvider
   */
  constructor(
    readonly controller: ListLogController,
    readonly service: LogService,
  ) {
    this._onDidChangeTreeData = new EventEmitter<
      NodeModel | undefined | null | void
    >();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Returns the tree item for the supplied element.
   *
   * @function getTreeItem
   * @param {NodeModel} element - The element
   * @public
   * @memberof ListLogProvider
   * @example
   * const treeItem = provider.getTreeItem(element);
   *
   * @returns {TreeItem | Thenable<TreeItem>} - The tree item
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
   */
  getTreeItem(element: NodeModel): TreeItem | Thenable<TreeItem> {
    return element;
  }

  /**
   * Returns the children for the supplied element.
   *
   * @function getChildren
   * @param {NodeModel} [element] - The element
   * @public
   * @memberof ListLogProvider
   * @example
   * const children = provider.getChildren(element);
   *
   * @returns {ProviderResult<NodeModel[]>} - The children
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
   */
  getChildren(element?: NodeModel): ProviderResult<NodeModel[]> {
    if (this._isDisposed) {
      return [];
    }

    if (element) {
      return element.children;
    }

    if (this._cachedNodes) {
      return this._cachedNodes;
    }

    if (this._cachePromise) {
      return this._cachePromise;
    }

    const versionAtStart = this._version;
    this._cachePromise = this.getListLogs().then((nodes) => {
      // Ignore if disposed or a newer refresh occurred meanwhile
      if (this._isDisposed || versionAtStart !== this._version) {
        return this._cachedNodes ?? [];
      }
      this._cachedNodes = nodes;
      this._cachePromise = undefined;
      return nodes;
    });

    return this._cachePromise;
  }

  /**
   * Refreshes the tree data by firing the event.
   *
   * @function refresh
   * @public
   * @memberof ListLogProvider
   * @example
   * provider.refresh();
   *
   * @returns {void} - No return value
   */
  refresh(): void {
    if (this._isDisposed) {
      return;
    }

    this._version++;
    this._cachedNodes = undefined;
    this._cachePromise = undefined;
    this._onDidChangeTreeData.fire();
  }

  /**
   * Disposes the provider.
   *
   * @function dispose
   * @public
   * @memberof ListLogProvider
   * @example
   * provider.dispose();
   *
   * @returns {void} - No return value
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }

    this._isDisposed = true;
    this._cachedNodes = undefined;
    this._cachePromise = undefined;
    this._onDidChangeTreeData.dispose();
  }

  // Private methods
  /**
   * Gets the list of files.
   *
   * @function getListFiles
   * @private
   * @memberof ListLogProvider
   * @example
   * const files = provider.getListFiles();
   *
   * @returns {Promise<NodeModel[]>} - The list of files
   */
  private async getListLogs(): Promise<NodeModel[]> {
    const { defaultLanguage } = this.controller.config;
    const files = await this.controller.getFiles();

    if (!files) {
      return [];
    }

    const resolvedCommand = this.service.getLogCommand(defaultLanguage);
    const escapedCommand = escapeRegExp(resolvedCommand);
    const logPattern = new RegExp(`${escapedCommand}\\s*\\(`);

    const { default: pLimit } = await import('p-limit');
    const limit = pLimit(2);

    await Promise.all(
      files.map((file) =>
        limit(async () => {
          if (!file.resourceUri) {
            return file.setChildren([]);
          }

          try {
            const document = await workspace.openTextDocument(file.resourceUri);

            const children: NodeModel[] = [];

            for (let i = 0; i < document.lineCount; i++) {
              const text = document.lineAt(i).text;

              if (logPattern.test(text)) {
                const lineNumber = i + 1; // Display is 1-based
                const child = new NodeModel(
                  text.trim(),
                  new ThemeIcon('debug-breakpoint-log'),
                  {
                    command: `${EXTENSION_ID}.listLogView.gotoLine`,
                    title: text.trim(),
                    arguments: [file.resourceUri, i],
                  },
                  file.resourceUri,
                  'log',
                );
                child.description = `Ln ${lineNumber}`;
                child.tooltip = `${workspace.asRelativePath(
                  file.resourceUri,
                )}:${lineNumber}\n${text.trim()}`;
                child.line = i;
                children.push(child);
              }
            }

            file.setChildren(children);
            // Attach quick context and counts to file node
            const count = children.length;
            file.description =
              count > 0 ? `${count} log${count === 1 ? '' : 's'}` : undefined;
            file.tooltip = `${file.resourceUri.fsPath}${
              count > 0 ? `\n${count} log${count === 1 ? '' : 's'}` : ''
            }`;
          } catch (error) {
            console.error(
              `Error reading file ${file.resourceUri?.fsPath}:`,
              error instanceof Error ? error.message : String(error),
            );

            file.setChildren([]);
          }
        }),
      ),
    );

    return files.filter((file) => file.children?.length);
  }
}
