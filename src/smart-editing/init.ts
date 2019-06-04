import * as vscode from 'vscode';
import { updateDiagnostics } from './diagnostic';
import { registerCompletionItemProvider } from './completion-item';

export function initSmartEditing(): void {
	registerCompletionItemProvider();
	const collection = vscode.languages.createDiagnosticCollection('test');
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}
	const disposable = vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDiagnostics(editor.document, collection);
		}
	});
}
