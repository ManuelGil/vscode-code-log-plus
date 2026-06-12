/**
 * @fileoverview Resolves the effective workspace root path for all file operations
 * in the extension. Acts as the single source of truth for determining where
 * generated files should be placed.
 */

import { basename } from 'path';
import { Uri, workspace } from 'vscode';

import { ExtensionConfig } from '../configs';

/**
 * Returns the workspace root path used as the base for all file operations.
 *
 * Resolution order:
 * 1. `projectHint` - optional contextual override for navigation workflows.
 * 2. `targetUri` - direct workspace folder derived from the target URI.
 * 3. `config.workspaceSelection` - user-selected folder stored in configuration.
 * 4. First VS Code workspace folder - fallback for single-folder workspaces
 *    or when no explicit selection has been made.
 * 5. `undefined` - when no workspace is open.
 *
 * @param config - The active extension configuration instance.
 * @returns Absolute filesystem path to the workspace root,
 *   or `undefined` if no workspace is available.
 */
export const getWorkspaceRoot = (
  config: ExtensionConfig,
  targetUri?: Uri,
  projectHint?: string,
): string | undefined => {
  const projectWorkspaceRoot = resolveProjectWorkspaceRoot(projectHint);
  if (projectWorkspaceRoot) {
    return projectWorkspaceRoot;
  }

  if (targetUri) {
    const targetWorkspaceFolder = workspace.getWorkspaceFolder(targetUri);
    if (targetWorkspaceFolder) {
      return targetWorkspaceFolder.uri.fsPath;
    }
  }

  if (config.workspaceSelection) {
    return config.workspaceSelection;
  }

  return workspace.workspaceFolders?.[0]?.uri.fsPath;
};

const resolveProjectWorkspaceRoot = (
  projectHint?: string,
): string | undefined => {
  const normalizedHint =
    typeof projectHint === 'string' ? projectHint.trim() : '';

  if (!normalizedHint) {
    return undefined;
  }

  const folders = workspace.workspaceFolders;

  if (!folders || folders.length === 0) {
    return undefined;
  }

  const nameMatch = folders.find((folder) => folder.name === normalizedHint);

  if (nameMatch) {
    return nameMatch.uri.fsPath;
  }

  const pathMatch = folders.find(
    (folder) => basename(folder.uri.fsPath) === normalizedHint,
  );

  if (pathMatch) {
    return pathMatch.uri.fsPath;
  }

  return undefined;
};
