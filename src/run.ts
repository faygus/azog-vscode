import * as vscode from "vscode";
import { createView } from "./create-view";
import { textEditorEvents } from "./editor-events";
import { readViewFiles } from "./read-view-files";
import { WebViewManager } from "./webview";
import { workspaceManager } from "./workspace-manager";

export function runExtension(context: vscode.ExtensionContext): void {
	const rootPath = vscode.workspace.rootPath;
	if (!rootPath) {
		console.warn('no workspace opened');
	} else {
		workspaceManager.initWorkspace(rootPath);
	}
	const config = vscode.workspace.getConfiguration('azog');
	config.update('extensionActivated', true);

	vscode.commands.registerCommand('newView', () => {
		createView();
	});
	vscode.commands.registerCommand('navigateToViewModelInterface', () => {
		vscode.window.showInformationMessage('navigate to view model interface');
		// TODO
	});
	const webViewManager = new WebViewManager(context);
	listenActiveTextEditorChange(webViewManager);
	listenTextChange(webViewManager);
}

function listenActiveTextEditorChange(webViewManager: WebViewManager): void {
	if (vscode.window.activeTextEditor) {
		processEditor(vscode.window.activeTextEditor, webViewManager);
	}
	textEditorEvents.activeTextEditorChanged$.subscribe(editor => {
		if (!editor) {
			webViewManager.close();
			return;
		}
		if (editor.document.fileName === 'tasks') { // webview selected ?
			return;
		}
		processEditor(editor, webViewManager);
	});
	textEditorEvents.visibleTextEditorsChanged$.subscribe(editors => {
		// console.log('visibleTextEditorsChanged', editors.map(a => path.basename(a.document.fileName)));
		if (webViewManager.associatedDocument) {
			if (editors.map(a => a.document).indexOf(webViewManager.associatedDocument) === -1) {
				// the webview should be close only if the new active editor is not an azog view
				webViewManager.close();
			}
		}
	});
}

function processEditor(editor: vscode.TextEditor, webViewManager: WebViewManager): void {
	processDocument(editor.document, webViewManager);
}

function listenTextChange(webViewManager: WebViewManager) {
	vscode.workspace.onDidChangeTextDocument(event => {
		console.log('text change, process document');
		processDocument(event.document, webViewManager);
	});
}

function processDocument(document: vscode.TextDocument, webViewManager: WebViewManager): void {
	if (!workspaceManager.pathIsView(document.fileName)) {
		webViewManager.close();
		return;
	}
	setTimeout(() => {
		try {
			const data = readViewFiles(document);
			webViewManager.show(document, data);
		} catch (err) {
			console.error('can not show webview', err);
			webViewManager.close();
		}
	}, 10); // wait parsing
}
