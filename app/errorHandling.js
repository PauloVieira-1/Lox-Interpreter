class ErrorFactory {
	createLoxError(line, message, char) {
		return new LoxError(line, message, char);
	}

	createParserError(token, message, errorType) {
		return new ParserError(token, message, errorType);
	}

	createRuntimeError(line, message) {
		return new RuntimeError(line, message);
	}
}

class LoxError {
	constructor(line, message) {
		this.line = line;
		this.message = message;
	}

	/**
	 * Print the error message and exit with code 65
	 * @returns {undefined}
	 */
	error() {
		console.error(`[line ${this.line}] Error: ${this.message}`);
		// process.exit(65);
	}
}

// compiler error ??
class ParserError {
	constructor(token, message) {
		this.token = token;
		this.message = message;
	}

	error() {
		console.error(
			`[line ${this.token.line}] Error at '${this.token.lexeme}': ${this
				.message}`
		);
		process.exit(65);
	}
}

class RuntimeError {
	constructor(line, message) {
		this.line = line;
		this.message = message;
	}

	error() {
		if (this.line === null) {
			console.error(`${this.message}`);
			process.exit(70);
		}

		if (this.line !== null) {
			console.error(`[line ${this.line}] ${this.message}`);
			process.exit(70);
		}
	}
}

export { ErrorFactory };
