import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { workspaceManager } from './workspace-manager';
import * as AzogLanguage from 'vscode-azog-language-features';
import * as AzogInterface from 'azog-interface';

/**
 * Read the view, view model interface and mock view model files
 */
export function readViewFiles(document: vscode.TextDocument): AzogInterface.IAppJSON {
	const id = AzogLanguage.StaticInterpreter.getIdFromPath(document.fileName);
	if (id === undefined) {
		throw new Error('id undefined');
	}
	const res = getViewData(document.fileName);

	// change id 1 for interpreter
	const view = res.views[id];
	delete res.views[id];
	res.views[1] = view;

	if (res.viewModelInterfaces) {
		const viewModel = res.viewModelInterfaces[id];
		delete res.viewModelInterfaces[id];
		res.viewModelInterfaces[1] = viewModel;
	}

	if (res.mockViewModels) {
		const mock = res.mockViewModels[id];
		delete res.mockViewModels[id];
		res.mockViewModels[1] = mock;
	}

	return res;
}

function getViewData(filePath: string): AzogInterface.IAppJSON {
	const intepretation = AzogLanguage.StaticInterpreter.getInterpretation(filePath);
	if (!intepretation) {
		throw new Error('no interpretation for ' + filePath);
	}
	const id = AzogLanguage.StaticInterpreter.getIdFromPath(filePath);
	const fileName = path.parse(filePath).name;
	const vmMockPath = workspaceManager.getViewModelMockPath(fileName);
	const vmMockContent = fs.readFileSync(vmMockPath, 'utf8');
	let vmMock: any;
	try {
		vmMock = JSON.parse(vmMockContent);
	} catch {
		throw new Error('mock file corrupted');
	}
	const res: AzogInterface.IAppJSON = {
		views: {
			[id]: intepretation.template,
		},
		viewModelInterfaces: {
			[id]: intepretation.viewModel
		},
		mockViewModels: {
			[id]: vmMock
		}
	};
	for (const dependency of intepretation.dependencies.views) {
		const filePath = AzogLanguage.StaticInterpreter.getPathFromId(dependency);
		if (filePath) {
			const data = getViewData(filePath);
			if (data) {
				res.views = {
					...res.views,
					...data.views
				};
				res.viewModelInterfaces = {
					...res.viewModelInterfaces,
					...data.viewModelInterfaces
				};
				res.mockViewModels = {
					...res.mockViewModels,
					...data.mockViewModels
				};
			}
		} else {
			console.warn('no path for id', dependency);
		}
	}
	return res;
}
