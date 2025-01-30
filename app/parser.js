// The visitor design pattern -----> https://refactoring.guru/design-patterns/visitor

import { Token } from "./scanner.js";

class Visitor {
	visitUnaryExpression(unary) {
		return parenthesize(unary.operator.lexeme, [unary.right]);
	}

	visitBinaryExpression(binary) {
		return parenthesize(binary.operator.lexeme, [binary.left, binary.right]);
	}

	visitGroupingExpression(grouping) {
		return parenthesize("group", [grouping.expression]);
	}
}

function parenthesize(name, ...expressions) {
	let str = "";
	console.log(expressions);
	str += name;
	for (let exp of expressions) {
		// str += exp + " ";
		console.log(exp);
		exp.accept(new Visitor());
	}
	console.log(`(${str.trim()})`);
}

// class TreePrinter {
// 	constructor(expression) {
// 		this.expression = expression;
// 	}

// 	print() {
// 		return this.expression.accept(this);
// 	}
// }

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

class Parser {
	constructor(expressions) {
		this.expressions = expressions;
	}
	parse() {
		let visitor = new Visitor();
		return visitor.visitUnaryExpression();
	}
}

function test() {
	let expression = new BinaryExpression(
		new UnaryExpression(
			new Token("PLUS", "+", null, 1),
			new Token("NUMBER", "2", 2.0, 1)
		),
		new Token("STAR", "*", null, 1),
		new Grouping(new Token("NUMBER", "3", 3.0, 1))
	);

	let visitor = new Visitor();
	expression.accept(visitor);
}

test();

export { BinaryExpression, UnaryExpression, Grouping };
