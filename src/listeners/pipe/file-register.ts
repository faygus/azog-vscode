import { FileRegister } from "workspace-listener";
import * as azog from "azog";

export function parse(content: string): azog.Models.IPipeInterface | undefined {
	let data: azog.Interfaces.IPipeInterfaceJSON;
	try {
		data = JSON.parse(content);
	} catch (err) {
		return undefined;
	}
	return data;
}
