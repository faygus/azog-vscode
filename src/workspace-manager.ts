import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

export const WORKSPACE_FOLDERS = {
	views: 'views',
	viewModelsInterfaces: 'view-models.itf',
	viewModelsMock: 'view-models.mock',
};

export class WorkspaceManager {

	private _rootPath?: string;

	/**
 	* create the folder structure
 	* - views : contains the views
 	* - view-models.itf : contains the interfaces of the view-models
 	* - view-models.mock : contains the mock values for each view-models
 	*/
	initWorkspace(rootPath: string): void {
		this._rootPath = rootPath;
		const folderNames = [
			WORKSPACE_FOLDERS.views,
			WORKSPACE_FOLDERS.viewModelsInterfaces,
			WORKSPACE_FOLDERS.viewModelsMock
		];
		for (const folderName of folderNames) {
			const dir = path.join(rootPath, folderName);
			createFolderIfNotExist(dir);
		}
	}

	pathIsView(filePath: string): boolean {
		const dirName = path.basename(path.dirname(filePath));
		return dirName === WORKSPACE_FOLDERS.views;
	}

	getViewModelInterfacePath(viewId: string): string {
		return path.join(this._rootPath!, WORKSPACE_FOLDERS.viewModelsInterfaces, viewId);
	}

	getViewModeMockPath(viewId: string): string {
		return path.join(this._rootPath!, WORKSPACE_FOLDERS.viewModelsMock, viewId);
	}
}

function createFolderIfNotExist(dir: string): void {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

function writeAzogFile(): void {
	// const rootPath = context.extensionPath;
	const rootPath = vscode.workspace.rootPath;
	if (!rootPath) {
		console.error('no workspace opened');
		return;
	}
	const filePath = path.join(rootPath, '.azog');
	const fileContent = 'i am the file content';
	fs.writeFile(filePath, fileContent, err => {
		if (err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});
}

export const workspaceManager = new WorkspaceManager();
