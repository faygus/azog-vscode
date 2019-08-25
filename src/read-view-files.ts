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
	const viewFileNameWithExtension = path.basename(document.fileName);
	const viewId = path.parse(viewFileNameWithExtension).name;
	const vmMockPath = workspaceManager.getViewModelMockPath(viewId);
	const vmMockContent = fs.readFileSync(vmMockPath, 'utf8');
	let vmMock: any;
	try {
		vmMock = JSON.parse(vmMockContent);
	} catch {
		throw new Error('mock file corrupted');
	}
	try {
		const intepretation = AzogLanguage.InterpretationProvider.data.get(document.fileName);
		// const parsingData = azogLanguage.ParsingDataProvider.parsingResults.get(document);
		if (!intepretation) {
			throw new Error('no interpretation for this view');
		}
		if (!intepretation.template) {
			throw new Error('no template interpretation for this view');
		}
		if (!intepretation.viewModelInterface) {
			throw new Error('no view model interface interpretation for this view');
		}
		return {
			views: {
				1: intepretation.template, // the id must be 1,
				2: { // TODO
					type: 'labelWF',
					value: {
						text: 'hey girl :))))',
						style: {
							color: 0,
							size: 0
						}
					}
				}
			},
			viewModelInterfaces: {
				1: intepretation.viewModelInterface,
				2: { // TODO
					properties: {}
				}
			},
			mockViewModels: {
				1: vmMock,
				2: {}, // TODO
			}
		};
	} catch (err) {
		console.log('error when parsing view :', err.message);
		throw new Error(err);
	}
}
