import { Interpreter } from "./evaluator.js";

class statementVisitor extends Interpreter {
	visitPrintStatement(statement) {
		let evaluated = this.evaluate(statement.expression);
		console.log(evaluated.toString());
	}

	visitExpression(expression) {
		return this.evaluate(expression.expression);
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

export { statementVisitor, Print, Expression };
