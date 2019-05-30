import * as vscode from 'vscode';
import * as path from 'path';
import { WebViewManager } from './webview';
import { createView } from './create-view';
import { TextEditorEvents } from './editor-events';

export function runExtension(context: vscode.ExtensionContext): void {
	const config = vscode.workspace.getConfiguration('azog');
	config.update('extensionActivated', true);

	vscode.commands.registerCommand('newView', () => {
		createView();
	});
	// prompt a message to the user
	/*vscode.window.showInputBox({
		placeHolder: 'i like tennis',
		prompt: 'write what you want'
	});*/
	const webViewManager = new WebViewManager(context);
	listenActiveTextEditorChange(webViewManager);
	listenTextChange(webViewManager);
}

function listenActiveTextEditorChange(webViewManager: WebViewManager): void {
	if (vscode.window.activeTextEditor) {
		processEditor(vscode.window.activeTextEditor, webViewManager);
	}
	const textEditorEvents = new TextEditorEvents();
	textEditorEvents.activeTextEditorChanged$.subscribe(editor => {
		/*if (editor) {
			console.log('activeTextEditorChanged', path.basename(editor.document.fileName));
		} else {
			console.log('activeTextEditorChanged : no editor');
		}*/
		if (!editor) {
			if (webViewManager.isSelected && webViewManager.associatedDocument) {
				const documents = vscode.window.visibleTextEditors.map(a => a.document);
				if (documents.indexOf(webViewManager.associatedDocument) >= 0) {
					// editor is undefined when the user selects the webview. So we can not close
					// webview everytime the editor is undefined
					return;
				}
			}
			webViewManager.close();
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
		processDocument(event.document, webViewManager);
	});
}

function processDocument(document: vscode.TextDocument, webViewManager: WebViewManager): void {
	const fileName = path.basename(document.fileName);
	const content = document.getText();
	try {
		const data = JSON.parse(content);
		webViewManager.show(document, data);
	} catch (err) {
		console.log('close 3');
		webViewManager.close();
	}
}
