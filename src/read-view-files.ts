import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { workspaceManager } from './workspace-manager';
import * as azogLanguage from 'vscode-azog-language-features';

/**
 * Read the view, view model interface and mock view model files
 */
export function readViewFiles(document: vscode.TextDocument): {} {
	console.log('readViewFiles');
	const viewFileNameWithExtension = path.basename(document.fileName);
	const viewId = path.parse(viewFileNameWithExtension).name;
	const vmMockPath = workspaceManager.getViewModelMockPath(viewId);
	const vmItfPath = workspaceManager.getViewModelInterfacePath(viewId);
	const vmItfContent = fs.readFileSync(vmItfPath, 'utf8');
	const vmMockContent = fs.readFileSync(vmMockPath, 'utf8');

	const vmItf = JSON.parse(vmItfContent);
	const vmMock = JSON.parse(vmMockContent);
	try {
		const parsingData = azogLanguage.ParsingDataProvider.parsingResults.get(document);
		if (!parsingData) {
			throw new Error('no parsing data for this view');
		}
		const view = parsingData.azogConversion;
		if (!view) {
			throw new Error('not possible to convert to azog view');
		}
		console.log('view', view);
		return {
			views: {
				1: view // the id must be 1
			},
			viewModelInterfaces: {
				[viewId]: vmItf
			},
			mockViewModels: {
				[viewId]: vmMock
			}
		};
	} catch (err) {
		console.log('error when parsing view :', err.message);
		throw new Error(err);
	}
}
