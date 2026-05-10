import * as vscode from 'vscode';

import { ExtensionRuntime } from './extension.runtime';

export async function activate(context: vscode.ExtensionContext) {
  try {
    const runtime = new ExtensionRuntime(context);

    const initialized = await runtime.initialize();

    if (initialized) {
      runtime.start();
    }
  } catch (error) {
    console.error('Fatal error during extension activation:', error);
    vscode.window.showErrorMessage(
      vscode.l10n.t('Failed to activate extension: {0}', String(error)),
    );
  }
}

/**
 * This method is called when the extension is deactivated.
 * It cleans up any resources that the extension allocated.
 */
export function deactivate() {
  // Currently no cleanup needed
}
