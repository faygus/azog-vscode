import * as azogLanguage from 'vscode-azog-language-features';
import * as azog from "azog";
import { viewModelInterfaceStates } from './listeners/view-model-interface/states';
import { ViewModelInterfaceFile } from './listeners/view-model-interface/state-setter';
import { pipeInterfacesStates } from './listeners/pipe/state';

/**
 * exposed to the plugin in charge of the view files
 */
export class DataViews extends azogLanguage.DataSource.DataProviders {
	private _map = new Map<string, azogLanguage.DataSource.IDataProvider>();

	getDataProvider(filePath: string): azogLanguage.DataSource.IDataProvider {
		let res = this._map.get(filePath);
		if (res) return res;
		const vm = viewModelInterfaceStates.getDataProvider(filePath);
		res = new DataView(vm);
		this._map.set(filePath, res);
		return res;
	}
}

class DataView extends azogLanguage.DataSource.DataProvider {
	constructor(private _viewModelInterfaceFile: ViewModelInterfaceFile) {
		super();
		_viewModelInterfaceFile.changed.subscribe(() => {
			this.triggerChange();
		});
	}

	get properties(): azog.Models.IVariable[] {
		return this._viewModelInterfaceFile.properties;
	}

	get pipes(): azog.Models.IPipeInterface[] {
		return Array.from(pipeInterfacesStates.pipes.values());
	}
}
