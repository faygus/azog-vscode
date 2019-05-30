import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

export function writeAzogFile(): void {
	// const rootPath = context.extensionPath;
	const rootPath = vscode.workspace.rootPath;
	if (!rootPath) {
		console.error('no workspace opened');
		return;
	}
	const filePath = path.join(rootPath, 'azog');
	const fileContent = 'i am the file content';
	fs.writeFile(filePath, fileContent, err => {
		if (err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});
}
