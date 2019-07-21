import * as azog from "azog";

export class PipeInterfacesStates {
	pipes = new Map<number, azog.Models.IPipeInterface>();

	setPipe(id: number, pipe: azog.Models.IPipeInterface): void {
		this.pipes.set(id, pipe);
	}
}

export const pipeInterfacesStates = new PipeInterfacesStates();