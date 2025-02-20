import { Interpreter } from "./evaluator.js";

class statementVisitor extends Interpreter {
	visitPrintStatement(statement) {
		let evaluated = this.evaluate(statement.expression);
		console.log(evaluated.toString());
	}

	visitExpression(expression) {
		return this.evaluate(expression.expression);
	}

	visitVariable(variable) {
		let evaluated = this.evaluate(variable.variable);
		this.environment.setVariable(variable.name, evaluated);
		console.log(this.environment.bindings);
	}
}

class Print {
	constructor(expression) {
		this.expression = expression;
	}
	accept(visitor) {
		return visitor.visitPrintStatement(this);
	}
}

class Expression {
	constructor(expression) {
		this.expression = expression;
	}
	accept(visitor) {
		return visitor.visitExpression(this);
	}
}

class Variable {
	constructor(name, variable) {
		this.name = name;
		this.variable = variable;
	}

	accept(visitor) {
		return visitor.visitVariable(this);
	}
}

export { statementVisitor, Print, Expression, Variable };
