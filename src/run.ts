import * as vscode from 'vscode';
import { createView } from './create-view';
import { textEditorEvents } from './editor-events';
import { readViewFiles } from './read-view-files';
import { WebViewManager } from './webview';
import { workspaceManager } from './workspace-manager';
import { ViewModelInterfaceFileListener } from './listeners/view-model-interface/listener';
import { PipeFileListener } from './listeners/pipe/listener';

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
	const viewModelItfListener = new ViewModelInterfaceFileListener();
	viewModelItfListener.listenTextChange();
	const pipeFileListener = new PipeFileListener();
	pipeFileListener.listenTextChange();
	listenActiveTextEditorChange(webViewManager);
	listenTextChange(webViewManager);
}

function listenActiveTextEditorChange(webViewManager: WebViewManager): void {
	if (vscode.window.activeTextEditor) {
		processEditor(vscode.window.activeTextEditor, webViewManager);
	}
	textEditorEvents.activeTextEditorChanged$.subscribe(editor => {
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
	if (!workspaceManager.pathIsView(document.fileName)) {
		webViewManager.close();
		return;
	}
	setTimeout(() => {
		try {
			const data = readViewFiles(document);
			webViewManager.show(document, data);
		} catch (err) {
			webViewManager.close();
		}
	}, 10); // wait parsing
}
