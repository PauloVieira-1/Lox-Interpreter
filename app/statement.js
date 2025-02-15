import { Interpreter } from "./evaluator.js";

class statementVisitor extends Interpreter {
	visitPrintStatement(statement) {
		let evaluated = this.evaluate(statement.expression);
		console.log(evaluated.toString());
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
	accept(visitor) {
		return visitor.visitExpression(this);
	}
}

export { statementVisitor, Print, Expression };
