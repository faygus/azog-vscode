import * as vscode from 'vscode';
import { WebViewManager } from './webview';

export function runExtension(context: vscode.ExtensionContext): void {
	const webViewManager = new WebViewManager(context);
	listenActiveTextEditorChange(webViewManager);
	listenTextChange(webViewManager);
}

function listenActiveTextEditorChange(webViewManager: WebViewManager): void {
	if (vscode.window.activeTextEditor) {
		processEditor(vscode.window.activeTextEditor, webViewManager);
	}
	vscode.window.onDidChangeActiveTextEditor(editor => {
		console.log('editor change !');
		if (!editor) {
			return;
		}
		processEditor(editor, webViewManager);
	});
}

function processEditor(editor: vscode.TextEditor, webViewManager: WebViewManager): void {
	processDocument(editor.document, webViewManager);
}

function listenTextChange(webViewManager: WebViewManager) {
	vscode.workspace.onDidChangeTextDocument(event => {
		console.log('text change !');
		processDocument(event.document, webViewManager);
	});
}

function processDocument(document: vscode.TextDocument, webViewManager: WebViewManager): void {
	const content = document.getText();
	try {
		const data = JSON.parse(content);
		webViewManager.show(data);
	} catch (err) {
		console.error('error in document', err);
		webViewManager.close();
	}
}
