function isFloat(n) {
	let val = parseFloat(n);
	return !isNaN(val);
}

function isString(r, l) {
	return r instanceof String && l instanceof String;
}

function isTruthy(t) {
	if (t === null) return false;
	if (t instanceof Boolean) return t;
}

class Visitor {
	visitLiteralExpression(literal) {
		if (literal.value === null) return "nil";
		return literal.value;
	}

	visitUnaryExpression(unary) {
		const operator = unary.operator;
		const right = Number(unary.right.value);

		switch (operator) {
			case "-":
				return -right;
			case "!":
				return isTruthy(unary.right.value);
		}
	}

	visitBinaryExpression(binary) {
		const left = Number(binary.left.value);
		const right = Number(binary.right.value);
		const operator = binary.operator.lexeme;

		switch (operator) {
			case "-":
				return left - right;
			case "*":
				return left * right;
			case "/":
				return left / right;
			case "<":
				return left < right;
			case ">":
				return left > right;
			case "+":
				if (isFloat(binary.left.value) && isFloat(binary.right.value)) {
					return left + right;
				} else if (isString(binary.left.value, binary.right.value)) {
					return binary.left.value + binary.right.value;
				}
				break;
		}
	}
}

class Interpreter {
	constructor(expression) {
		this.expression = expression;
	}

	interpret() {
		return this.expression?.accept(new Visitor());
	}
}

export { Interpreter };
