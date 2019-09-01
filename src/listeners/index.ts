import * as vscode from "vscode";
import { WorkspaceFilesWatcher, FileRegister, IUpdateEvent } from "workspace-listener";
import { FileType, workspaceManager } from "../workspace-manager";
import { parse } from "./pipe/file-register";
import * as AzogInterface from "azog-interface";

export function listenWorkspaceChanges(): WorkspaceFilesWatcher | undefined {
	const rootPath = vscode.workspace.rootPath;
	if (!rootPath) {
		console.warn('no workspace open');
		return undefined;
	}
	const updateEvent: IUpdateEvent = {
		subscribe(handler) {
			const subscription = vscode.workspace.onDidChangeTextDocument(event => {
				handler(event.document.fileName, event.document.getText());		});
			return {
				close() {
					subscription.dispose();
				}
			}
		}
	}
	const watcher = new WorkspaceFilesWatcher(rootPath, updateEvent);

	watcher.registerFileType(path => {
		const fileInfos = workspaceManager.getFileInfos(path);
		return fileInfos && fileInfos.type === FileType.PIPE;
	}, new FileRegister<AzogInterface.IPipeInterfaceJSON>(content => {
		return parse(content);
	}));

	watcher.init();
	return watcher;
}
