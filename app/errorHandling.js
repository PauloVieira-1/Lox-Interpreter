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

	error() {
		console.error(`[line ${this.line}] Error: ${this.message}`);
		process.exit(65);
	}
}

class ParserError {
	constructor(token, message, errorType) {
		this.token = token;
		this.message = message;
		this.errorType = errorType;
	}

	error() {
		console.error(
			`[line ${this.token.line}] Error at '${this.token.lexeme}': ${this
				.message}`
		);
		if (this.errorType === "CompilerError") {
			process.exit(65);
		} else if (this.errorType === "RuntimeError") {
			process.exit(70);
		}
	}
}

class RuntimeError {
	constructor(line, message) {
		this.line = line;
		this.message = message;
	}

	error() {
		console.error(`${this.message}`);
		process.exit(70);
	}
}

export { ErrorFactory };
