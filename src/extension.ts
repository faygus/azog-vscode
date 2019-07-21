// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { runExtension } from './run';
import * as azogLanguage from 'vscode-azog-language-features';
import { viewModelInterfaceStates } from './listeners/view-model-interface/states';
import { DataViews } from './view-data';
import { workspaceManager } from './workspace-manager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulationsssss, your extension is now active!');
	vscode.window.showInformationMessage('Azog extension activated');
	context.subscriptions.push(vscode.commands.registerCommand('azog', () => { }));
	runExtension(context);
	const dataViews = new DataViews();
	const fileDefinition = {
		isView(filePath: string) {
			return workspaceManager.pathIsView(filePath);
		}
	};
	const disposables = azogLanguage.LanguageFeatures.activate(dataViews, fileDefinition);
	context.subscriptions.push(disposables);

	/*// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('azog', () => {
		// The code you place here will be executed every time your command is executed
		console.log('run command azog');
		// Display a message box to the user
		vscode.window.showInformationMessage('Azog extension activated');
		runExtension(context);
	});*/
}

// this method is called when your extension is deactivated
export function deactivate() { }
