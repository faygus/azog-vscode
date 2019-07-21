import { FileType, workspaceManager } from "../../workspace-manager";
import { ViewModelInterfaceFile } from "./state-setter";

/**
 * Save the current state of view model interfaces for each view
 */
export class ViewModelInterfaceStates {
	private _map = new Map<number, ViewModelInterfaceFile>();

	getState(id: number): ViewModelInterfaceFile {
		let res = this._map.get(id);
		if (!res) {
			res = new ViewModelInterfaceFile();
			this._map.set(id, res);
		}
		return res;
	}

	getDataProvider(filePath: string): ViewModelInterfaceFile {
		const fileInfos = workspaceManager.getFileInfos(filePath);
		if (fileInfos.type !== FileType.VIEW) {
			throw new Error('can not provide data for a file which is not a view');
		}
		return this.getState(fileInfos.detail.viewId);
	}
}

export const viewModelInterfaceStates = new ViewModelInterfaceStates();
