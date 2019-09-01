// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { runExtension } from "./run";
import * as azogLanguage from "vscode-azog-language-features";
import * as azogInterface from "azog-interface";
import { workspaceManager } from "./workspace-manager";
import { listenWorkspaceChanges } from "./listeners";
import { IFilesRegistry, FileRegister, BaseFileRegistry } from "workspace-listener";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulationsssss, your extension is now active!');
	vscode.window.showInformationMessage('Azog extension activated');
	context.subscriptions.push(vscode.commands.registerCommand('azog', () => { }));
	runExtension(context);
	const workspaceWatcher = listenWorkspaceChanges();
	if (!workspaceWatcher) return;
	let registry: IFilesRegistry<azogLanguage.ParsingInfos>;
	const documentSelector = (filePath: string) => {
		return workspaceManager.pathIsView(filePath);
	}
	const provider: azogLanguage.IProvider = {
		registerParser(parser) {
			const p = new FileRegister(parser.parse);
			registry = workspaceWatcher.registerFileType(documentSelector, p);
		},
		fileRegistry: {
			views: new BaseFileRegistry<azogLanguage.ParsingInfos>(() => registry.files),
			pipes: new BaseFileRegistry<azogInterface.IPipeInterfaceJSON>(() => []) // TODO
		},
		getFileViewSelector(path: string) {
			return documentSelector(path);
		}
	};
	const disposables = azogLanguage.LanguageFeatures.activate(provider);
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
