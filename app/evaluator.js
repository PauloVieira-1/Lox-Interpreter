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

function checkNumberOperands(operator, right, left) {
    if (typeof right !== 'number' || typeof left !== 'number') {
        throw new RuntimeError(null, "Operands must be numbers.");
    }
}


class Visitor {
	visitLiteralExpression(literal) {
		if (literal.value === null) return "nil";
        if (isFloat(literal.value)) return Number(literal.value);
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
                checkNumberOperands(operator, right, left);
				return left - right;
			case "*":
                checkNumberOperands(operator, right, left);
				return left * right;
			case "/":
                checkNumberOperands(operator, right, left);
				return left / right;
			case "<":
                checkNumberOperands(operator, right, left);
				return left < right;
			case ">":
                checkNumberOperands(operator, right, left);
				return left > right;
			case "+":
				if (isFloat(binary.left.value) && isFloat(binary.right.value)) {
                    // console.log(typeof left, typeof right)
					return left + right;
				} else if (isString(binary.left.value, binary.right.value)) {
					return binary.left.value + binary.right.value;
				}
				break;
		}
	}
}

class RuntimeError extends Error {
    constructor(line, message) {
        super(`[line ${line}] ${message}`);
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
