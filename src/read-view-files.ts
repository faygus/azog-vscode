import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { workspaceManager } from './workspace-manager';

/**
 * Read the view, view model interface and mock view model files
 */
export function readViewFiles(document: vscode.TextDocument) {
	const viewFileNameWithExtension = path.basename(document.fileName);
	const viewId = path.parse(viewFileNameWithExtension).name;
	const vmMockPath = workspaceManager.getViewModeMockPath(viewId);
	const vmItfPath = workspaceManager.getViewModelInterfacePath(viewId);
	const vmItfContent = fs.readFileSync(vmItfPath, 'utf8');
	const vmMockContent = fs.readFileSync(vmMockPath, 'utf8');

	const vmItf = JSON.parse(vmItfContent);
	const vmMock = JSON.parse(vmMockContent);
	const view = JSON.parse(document.getText());
	return {
		views: {
			[viewId]: view
		},
		viewModelInterfaces: {
			[viewId]: vmItf
		},
		mockViewModels: {
			[viewId]: vmMock
		}
	}
}
