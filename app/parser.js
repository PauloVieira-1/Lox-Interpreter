// The visitor design pattern -----> https://refactoring.guru/design-patterns/visitor

import { Token } from "./scanner.js";

class Visitor {
	constructor() {
		this.parenthesize = new Parenthesizer();
	}

	visitUnaryExpression(unary) {
		return this.parenthesize.parenthesize(
			this,
			unary.operator.lexeme,
			unary.right
		);
	}

	visitBinaryExpression(binary) {
		return this.parenthesize.parenthesize(
			this,
			binary.operator.lexeme,
			binary.left,
			binary.right
		);
	}

	visitGroupingExpression(grouping) {
		return this.parenthesize.parenthesize(this, "group", grouping.expression);
	}

	visitLiteralExpression(literal) {
		if (literal.value === null) return "nil";
		return literal.value;
	}
}

class Parenthesizer {
	parenthesize = (visitor, name, ...expressions) => {
		const elements = [];

		for (const exp of expressions) {
			if (!(exp instanceof Token)) {
				elements.push(
					Number.isInteger(exp.value)
						? `${exp.accept(visitor)}` + ".0 "
						: `${exp.accept(visitor)} `
				);
			}
		}

		return `(${name} ${elements.join("").trimEnd()})`;
	};
}

class BinaryExpression {
	/**
     * 
     * @param {*} left 
     * @param {Token} operator 
     * @param {*} right 
     */
	constructor(left, operator, right) {
		this.left = left;
		this.operator = operator;
		this.right = right;
	}
	accept(visitor) {
		return visitor.visitBinaryExpression(this);
	}
}

class UnaryExpression {
	constructor(operator, right) {
		this.operator = operator;
		this.right = right;
	}

	accept(visitor) {
		return visitor.visitUnaryExpression(this);
	}
}

class Grouping {
	constructor(expression) {
		this.expression = expression;
	}

	accept(visitor) {
		return visitor.visitGroupingExpression(this);
	}
}

class Literal {
	constructor(value) {
		this.value = value;
	}

	accept(visitor) {
		return visitor.visitLiteralExpression(this);
	}
}

class Parser {
	/**
	 * 
	 * @param {Array} tokens 
	 */
	constructor(tokens) {
		this.tokens = tokens || [];
		this.current = 0;
	}

	isAtEnd() {
		return this.current >= this.tokens.length;
	}
	next() {
		return this.tokens[this.current];
	}

	advance() {
		if (!this.isAtEnd()) this.current++;
		return this.previous();
	}

	previous() {
		return this.current > 0 ? this.tokens[this.current - 1] : null;
	}

	match(...types) {
		let typesArray = [...types];
		// console.log("Types array: ", typesArray);
		for (let type of typesArray) {
			// console.log("Matching token type: ", type);
			if (this.check(type) == true) {
				this.advance();
				return true;
			}
		}

		return false;
	}

	check(sign) {
		if (this.isAtEnd()) return false;
		// console.log(this.next().type);
		// console.log(sign);
		return this.next().type === sign;
	}

	expression() {
		return this.equality();
	}
	equality() {
		let expr = this.comparison();
		// console.log("Previous token: ", this.previous());
		while (this.match("BANG_EQUAL", "EQUAL_EQUAL")) {
			const operator = this.previous();
			const right = this.comparison();

			expr = new BinaryExpression(expr, operator, right);
		}
		return expr;
	}

	comparison() {
		let expr = this.term();
		while (this.match("LESS_EQUAL", "LESS", "GREATER_EQUAL", "GREATER")) {
			const operator = this.previous();
			const right = this.term();
			expr = new BinaryExpression(expr, operator, right);
		}
		return expr;
	}

	term() {
		let expr = this.factor();
		while (this.match("PLUS", "MINUS")) {
			const operator = this.previous();
			const right = this.factor();
			// console.log(right);
			expr = new BinaryExpression(expr, operator, right);
		}

		return expr;
	}

	factor() {
		let expr = this.unary();
		while (this.match("SLASH", "STAR")) {
			const operator = this.previous();
			const right = this.unary();

			expr = new UnaryExpression(right, operator);
		}

		return expr;
	}

	unary() {
		if (this.match("BANG", "MINUS")) {
			const operator = this.previous();
			const right = this.unary();
			return new UnaryExpression(right, operator);
		}
		return this.primary();
	}

	primary() {
		if (this.match("FALSE")) return new Literal(false);
		if (this.match("TRUE")) return new Literal(true);
		if (this.match("NIL")) return new Literal(null);

		if (this.match("NUMBER", "STRING")) {
			return new Literal(this.previous().literal);
		}

		// console.log("TEST: " + this.match("NUMBER, STRING"));

		if (this.match("LEFT_PAREN")) {
			let expr = expression();
			// consume(RIGHT_PAREN, "Expect ')' after expression.");
			return new Grouping(expr);
		}
		// console.log("pass");
	}

	parse() {
		return this.expression();
	}
}

// function test() {
// let expression = new BinaryExpression(
// 	new Literal(2.0),
// 	new Token("STAR", "+", null, 1),
// 	new Literal(3.0)
// );

// 	let visitor = new Visitor();
// 	console.log(expression.accept(visitor));
// }

// test();

export {
	Parser,
	Visitor,
	Literal,
	BinaryExpression,
	UnaryExpression,
	Grouping
};

// Recursive decennt parser with a top down appraoch

//! PARSING RULES

/*
expression     → equality ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
primary        → NUMBER | STRING | "true" | "false" | "nil"
               | "(" expression ")" ;
*/
