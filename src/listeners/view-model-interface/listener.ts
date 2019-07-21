import * as azog from "azog";
import * as vscode from "vscode";
import { FileType, workspaceManager } from "../../workspace-manager";
import { viewModelInterfaceStates } from "./states";

/**
 * Listen when a view model interface file is edited
 */
export class ViewModelInterfaceFileListener {

	constructor(/*private _webViewManager: WebViewManager*/) {

	}

	listenTextChange() {
		vscode.workspace.onDidChangeTextDocument(event => {
			const fileInfos = workspaceManager.getFileInfos(event.document.fileName);
			if (!(fileInfos.type === FileType.VIEW_MODEL_ITF)) {
				return;
			}
			this.processFile(fileInfos.detail.viewId, fileInfos.content);
		});
	}

	private processFile(id: number, content: string): void {
		const state = viewModelInterfaceStates.getState(id);
		let data: azog.Interfaces.IViewModelInterfaceJSON;
		try {
			data = JSON.parse(content);
		} catch (err) {
			return;
		}
		console.log('view model interface change', data);
		state.reset();
		for (const prop in data.properties) {
			const type = data.properties[prop];
			state.setProperty(prop, type);
		}
		state.triggerChange();
	}
}
