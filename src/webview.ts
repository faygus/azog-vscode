import * as vscode from 'vscode';
import * as path from 'path';

export class WebViewManager {
	private _currentPanel?: vscode.WebviewPanel;

	constructor(private _context: vscode.ExtensionContext) {

	}

	show(data: {}): void {
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
	}

	private createWebView(): vscode.WebviewPanel {
		const panel = vscode.window.createWebviewPanel(
			'hahahah', // Identifies the type of the webview. Used internally
			'Azog view', // Title of the panel displayed to the user
			vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
			{
				// Enable scripts in the webview
				enableScripts: true,
				// Only allow the webview to access resources in our extension's media directory
				localResourceRoots: [vscode.Uri.file(path.join(this._context.extensionPath, 'webview-files', 'dist'))]
			}
		);
		panel.title = 'Coding Cat';
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
    <title>Cat Coding</title>
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
	console.log('script uri', scriptSrc);
	return scriptSrc;
}
