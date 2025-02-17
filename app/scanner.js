import { ErrorFactory } from "./errorHandling.js";

const keywords = new Map([
	["and", "AND"],
	["class", "CLASS"],
	["else", "ELSE"],
	["false", "FALSE"],
	["for", "FOR"],
	["fun", "FUN"],
	["if", "IF"],
	["nil", "NIL"],
	["or", "OR"],
	["print", "PRINT"],
	["return", "RETURN"],
	["super", "SUPER"],
	["this", "THIS"],
	["true", "TRUE"],
	["var", "VAR"],
	["while", "WHILE"]
]);

class Token {
	constructor(type, lexeme, literal, line) {
		this.type = type;
		this.lexeme = lexeme;
		this.literal = literal;
		this.line = line;
	}

	toString() {
		return `${this.type} ${this.lexeme} ${this.literal}`;
	}
}

class Scanner {
	constructor(source) {
		this.source = source;
		this.tokens = [];
		this.start = 0;
		this.current = 0;
		this.line = 1;
		this.hasError = false;
	}

	isAtEnd() {
		return this.current >= this.source.length;
	}

	scanTokens() {
		while (!this.isAtEnd()) {
			this.start = this.current;
			this.scanToken();
		}
		this.addToken("EOF", "", null);
		return this.tokens;
	}

	scanToken() {
		let c = this.advance();
		// console.log(c);
		switch (c) {
			case "(":
				this.addToken("LEFT_PAREN", c);
				break;
			case ")":
				this.addToken("RIGHT_PAREN", c);
				break;
			case "{":
				this.addToken("LEFT_BRACE", c);
				break;
			case "}":
				this.addToken("RIGHT_BRACE", c);
				break;
			case ",":
				this.addToken("COMMA", c);
				break;
			case ".":
				this.addToken("DOT", c);
				break;
			case "-":
				this.addToken("MINUS", c);
				break;
			case "+":
				this.addToken("PLUS", c);
				break;
			case ";":
				this.addToken("SEMICOLON", c);
				break;
			case "*":
				this.addToken("STAR", c);
				break;
			case "\n":
				this.line++;
				break;
			case " ":
				break;
			case "\t":
				break;
			case `"`:
				this.string();
				break;
			case "|":
				break;
			case "/":
				if (this.equalMatch("/")) {
					while (this.nextChar() !== "\n" && !this.isAtEnd()) {
						this.advance();
					}
					if (this.nextChar() == "\n") this.advance();
				} else {
					this.addToken("SLASH", c);
				}
				break;
			case "!":
				if (this.equalMatch("=")) {
					this.addToken("BANG_EQUAL", "!=");
				} else {
					this.addToken("BANG", "!");
				}
				break;
			case "=":
				if (this.equalMatch("=")) {
					this.addToken("EQUAL_EQUAL", "==");
				} else {
					this.addToken("EQUAL", "=");
				}
				break;
			case "<":
				if (this.equalMatch("=")) {
					this.addToken("LESS_EQUAL", "<=");
				} else {
					this.addToken("LESS", "<");
				}
				break;
			case ">":
				if (this.equalMatch("=")) {
					this.addToken("GREATER_EQUAL", ">=");
				} else {
					this.addToken("GREATER", ">");
				}
				break;
			default:
				if (this.isDigit(c)) {
					this.digit();
				} else if (this.isAlpha(c)) {
					this.identifier();
				} else {
					const error = new ErrorFactory();
					error.createLoxError(this.line, `Unexpected character: ${c}`).error();
				}
		}
	}

	addToken(type, lexeme, literal = null) {
		let toAdd = new Token(type, lexeme, literal, this.line);
		this.tokens.push(toAdd);
	}

	advance() {
		if (!this.isAtEnd()) {
			return this.source[this.current++];
		}
	}

	equalMatch(expected) {
		if (this.isAtEnd()) return false;
		if (this.source[this.current] != expected) return false;
		this.advance();
		return true;
	}

	nextChar() {
		if (this.isAtEnd()) return null;
		return this.source[this.current + 1];
	}

	string() {
		while (!this.isAtEnd() && this.source[this.current] !== `"`) {
			if (this.source[this.current] === "\n") this.line++;
			this.advance();
		}

		if (this.isAtEnd()) {
			const error = new ErrorFactory();
			error.createLoxError(this.line, "Unterminated string.").error();
			return;
		}

		this.advance();

		const value = this.source.substring(this.start + 1, this.current - 1);
		this.addToken("STRING", `"${value}"`, value);
	}

	isDigit(c) {
		return c >= "0" && c <= "9";
	}
	digit() {
		while (this.isDigit(this.source[this.current])) {
			this.advance();
		}

		if (this.source[this.current] === ".") {
			let start_decimal = this.current + 1;

			while (
				start_decimal < this.source.length &&
				this.isDigit(this.source[start_decimal])
			) {
				start_decimal++;
			}
			this.current = start_decimal;
		}

		const lexeme = this.source.substring(this.start, this.current);
		const numberValue = parseFloat(lexeme);
		const value = Number.isInteger(numberValue)
			? numberValue.toFixed(1)
			: numberValue;
		if (!isNaN(numberValue)) {
			this.addToken("NUMBER", lexeme, value);
		}
	}

	identifier() {
		while (this.isAlphaNumeric(this.source[this.current])) {
			this.advance();
		}

		const text = this.source.substring(this.start, this.current);

		let reserved_word = keywords.get(text);
		if (reserved_word) {
			this.addToken(reserved_word, text);
		} else {
			this.addToken("IDENTIFIER", text);
		}
	}

	isAlpha(c) {
		return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
	}

	isAlphaNumeric(c) {
		return this.isAlpha(c) || this.isDigit(c);
	}

	isEmptyString() {
		return this.source[this.current] == "";
	}
}

export { Scanner, Token, keywords };
