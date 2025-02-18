import { ErrorFactory } from "./errorHandling.js";

class Environment {
	constructor() {
		this.bindings = new Map();
	}

	setVariable(variableName, variableValue) {
		this.bindings.set(variableName, variableValue);
	}

	getVariable(variableName) {
		if (variableName in this.bindings.keys()) {
			return this.bindings.get(this.bindings.get(variableName));
		}

		const error = new ErrorFactory();
		error.createRuntimeError(
			null,
			`Unidentified variable name ${variableName}.`
		);
	}
}

export { Environment };
