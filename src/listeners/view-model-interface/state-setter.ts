import * as azog from "azog";
import { Subject, Observable } from "rxjs";

export class ViewModelInterfaceFile {
	private _properties = new Map<string, azog.Models.IType>();
	private _changed = new Subject<void>();

	setProperty(name: string, type: azog.Models.IType): void {
		this._properties.set(name, type);
	}

	get properties(): azog.Models.IVariable[] {
		return Array.from(this._properties.entries()).map(a => {
			const res: azog.Models.IVariable = {
				name: a[0],
				type: a[1]
			};
			return res;
		});
	}

	reset(): void {
		this._properties.clear();
	}

	triggerChange(): void {
		this._changed.next();
	}

	get changed(): Observable<void> {
		return this._changed.asObservable();
	}
}
