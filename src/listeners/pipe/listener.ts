import * as azog from "azog";
import * as vscode from "vscode";
import { FileType, workspaceManager } from "../../workspace-manager";
import { pipeInterfacesStates } from "./state";

/**
 * Listen when a pipe file is edited
 */
export class PipeFileListener {

	constructor() {

	}

	listenTextChange() {
		vscode.workspace.onDidChangeTextDocument(event => {
			const fileInfos = workspaceManager.getFileInfos(event.document.fileName);
			if (!(fileInfos.type === FileType.PIPE)) {
				return;
			}
			this.processFile(fileInfos.detail.id, fileInfos.content);
		});
	}

	private processFile(id: number, content: string): void {
		let data: azog.Interfaces.IPipeInterfaceJSON;
		try {
			data = JSON.parse(content);
		} catch (err) {
			return;
		}
		console.log('pipe change', data);
		pipeInterfacesStates.setPipe(id, data);
	}
}
