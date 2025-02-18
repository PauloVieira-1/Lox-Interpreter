import { ErrorFactory } from "./errorHandling.js";
import { Environment } from "./Environment.js";

function isFloat(n) {
	let val = parseFloat(n);
	return !isNaN(val);
}

function isString(r, l) {
	return typeof r === "string" || typeof l === "string";
}

function isTruthy(t) {
	if (t == null) return false;
	if (t === false) return t;
	return true;
}

function isDecimal(n) {
	return !isNaN(n) && n.includes(".");
}

function checkNumberOperands(right, left) {
	if (typeof right !== "number" || typeof left !== "number") {
		const error = new ErrorFactory();
		error.createRuntimeError(null, "Operands must be numbers.").error();
	}
}

function checkNumberOperand(right) {
	if (typeof right !== "number") {
		const error = new ErrorFactory();
		error.createRuntimeError(null, "Operand must be a number.").error();
	}
}

function checkStringOperand(s) {
	if (typeof s !== "string") {
		const error = new ErrorFactory();
		error
			.createRuntimeError(null, "Operand must be two numbers or two strings.")
			.error();
	}
}

function evaluate(val, visitor) {
	try {
		const result = val?.accept(visitor);
		return result;
	} catch (error) {
		console.error(error);
		return val;
	}
}

class Visitor {
	visitLiteralExpression(literal) {
		if (literal.value === null) return "nil";

		if (isFloat(literal.value)) {
			try {
				if (isDecimal(literal.value)) {
					return Number(literal.value);
				}
			} catch (error) {
				return literal.value;
			}
		}
		return literal.value;
	}

	visitUnaryExpression(unary) {
		const operator = unary.operator.lexeme;
		const right = evaluate(unary.right, this);

		switch (operator) {
			case "-":
				checkNumberOperand(right);
				return -Number(right);
			case "!":
				return !isTruthy(unary.right.value);
		}
	}

	visitBinaryExpression(binary) {
		const left = Number(evaluate(binary.left, this));
		const leftEval = evaluate(binary.left, this);
		const right = Number(evaluate(binary.right, this));
		const rightEval = evaluate(binary.right, this);
		const operator = binary.operator.lexeme;
		
		switch (operator) {
			case "-":
				checkNumberOperands(rightEval, leftEval);
				return left - right;
			case "*":
				checkNumberOperands(rightEval, leftEval);
				return left * right;
			case "/":
				checkNumberOperands(rightEval, leftEval);
				return left / right;
			case "<":
				checkNumberOperands(rightEval, leftEval);
				return left < right;
			case ">":
				checkNumberOperands(rightEval, leftEval);
				return left > right;
			case ">=":
				checkNumberOperands(rightEval, leftEval);
				return left >= right;
			case "<=":
				checkNumberOperands(rightEval, leftEval);
				return left <= right;
			case "!=":
				return left !== right;
			case "==":
				return leftEval === rightEval;
			case "+":
				if (isFloat(leftEval) && isFloat(rightEval)) {
					return left + right;
				} else if (isString(leftEval, rightEval)) {
					checkStringOperand(rightEval);
					checkStringOperand(leftEval);
					return leftEval + rightEval;
				}
				break;
		}
	}

	visitGroupingExpression(grouping) {
		return grouping.expression.accept(this);
	}
}

class Interpreter {
	constructor(expression) {
		this.expression = expression;
		this.hasError = false;
		this.environment = new Environment();
	}

	evaluate(expression) {
		return expression.accept(new Visitor());
	}

	interpret() {
		try {
			return this.expression.accept(new Visitor());
		} catch (error) {
			this.hasError = true;
		}
	}
}

export { Interpreter };
