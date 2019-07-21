import * as vscode from 'vscode';
import * as path from 'path';

/**
 * handle the webview which shows the azog view
 */
export class WebViewManager {
	public associatedDocument?: vscode.TextDocument;

	private _currentPanel?: vscode.WebviewPanel;

	constructor(private _context: vscode.ExtensionContext) {

	}

	show(document: vscode.TextDocument, data: {}): void {
		console.log('show webview', data);
		this.associatedDocument = document;
		if (!this._currentPanel) {
			this._currentPanel = this.createWebView();
		}
		// Send a message to our webview.
		// You can send any JSON serializable data.
		this._currentPanel.webview.postMessage({ azogApp: data });
	}

	close(): void {
		if (this._currentPanel) {
			this._currentPanel.dispose();
		}
		this.associatedDocument = undefined;
	}

	get isSelected(): boolean {
		return this._currentPanel !== undefined && this._currentPanel.active;
	}

	private createWebView(): vscode.WebviewPanel {
		// workbench.editor.openSideBySideDirection
		const panel = vscode.window.createWebviewPanel(
			'hahahah', // Identifies the type of the webview. Used internally
			'Azog view', // Title of the panel displayed to the user
			// Editor column to show the new webview panel in.
			{
				viewColumn: vscode.ViewColumn.Beside,
				preserveFocus: true
			},
			{
				// Enable scripts in the webview
				enableScripts: true,
				// Only allow the webview to access resources in our extension's media directory
				localResourceRoots: [vscode.Uri.file(path.join(this._context.extensionPath, 'webview-files', 'dist'))]
			}
		);
		const scriptUri = getScriptUri(this._context.extensionPath);
		panel.webview.html = getWebviewContent(scriptUri);
		panel.onDidDispose(
			() => {
				// When the panel is closed, cancel any future updates to the webview content
				this._currentPanel = undefined;
			},
			null,
			this._context.subscriptions
		);
		return panel;
	}
}

function getWebviewContent(scriptUri: vscode.Uri) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Azog view</title>
</head>
<body>
		<script src="${scriptUri}"/>
</body>
</html>`;
}

function getScriptUri(extensionPath: string): vscode.Uri {
	// Get path to resource on disk
	const onDiskPath = vscode.Uri.file(
		path.join(extensionPath, 'webview-files', 'dist', 'bundle.js')
	);
	// And get the special URI to use with the webview
	const scriptSrc = onDiskPath.with({ scheme: 'vscode-resource' });
	return scriptSrc;
}
