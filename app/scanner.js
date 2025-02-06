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

class LoxError {
	constructor(line, message, char) {
		this.line = line;
		this.message = message;
		this.char = char;
	}

	error() {
		console.error(`[line ${this.line}] Error: ${this.message}`);
	}

	invalidChar() {
		console.error(
			`[line ${this.line}] Error: Unexpected character: ${this.char}`
		);
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
		this.tokens.push(new Token("EOF", "", null, this.line));
		return this.tokens;
	}

	scanToken() {
		let c = this.advance();
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
			case `"`:
				this.string();
				break;
			case "|":
				break;
			case "/":
				if (this.equalMatch("/")) {
					while (this.nextChar() !== "\n") this.advance();
					if (this.nextChar() === "\n") this.current++;
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
					new LoxError(this.line, "Unexpected character.", c).invalidChar();
					this.hasError = true;
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
		// console.log(this.current);
		return this.source[this.current + 1];
	}

	string() {
		while (this.nextChar() != `"` && this.nextChar() != "\n") {
			if (this.isAtEnd()) {
				break;
			}
			this.advance();
			// console.log(this.current);
		}

		if (this.nextChar() !== `"`) {
			new LoxError(this.line, "Unterminated string.", null).error();
			this.hasError = true;
		} else {
			let string = this.source.substring(this.start + 1, this.current + 1);
			this.addToken("STRING", `"${string}"`, string);
		}

		this.advance();
		this.advance();
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
}

export { Scanner, Token, LoxError, keywords };
