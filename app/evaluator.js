function isFloat(n) {
	let val = parseFloat(n);
	return !isNaN(val) && isFinite(val);
}

function isString(r, l) {
	return typeof r === 'string' && typeof l === 'string';
}

function isTruthy(t) {
	if (t == null) return false;
	if (t === false) return t;
	return true;
}

function checkNumberOperands(operator, right, left) {
    if (typeof right !== 'number' || typeof left !== 'number') {
        throw new RuntimeError(null, "Operands must be numbers.");
    }
}

function evaluate(val, visitor) {
//! Same as creating new visiotr instance?
    try {
        const result = val.accept(visitor);
        return result
    } catch (error) {
		console.error(error)
        return val
    }
}

class RuntimeError extends Error {
    constructor(line, message) {
        super(`[line ${line}] ${message}`);
    }
}

class Visitor {
	visitLiteralExpression(literal) {
		if (literal.value === null) return "nil";
        if (isFloat(literal.value)) return Number(literal.value);
		return literal.value;
	}

	visitUnaryExpression(unary) {
		const operator = unary.operator.lexeme;
		const right = evaluate(unary.right, this);

		switch (operator) {
			case "-":
				return -Number(right);
			case "!":
				// console.log(unary)
				return !(isTruthy(unary.right.value));
		}
	}

	visitBinaryExpression(binary) {
		const left = Number(evaluate(binary.left, this));
		const right = Number(evaluate(binary.right, this));
		const operator = binary.operator.lexeme;
		// console.log(left, right)

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
				if (isFloat(evaluate(binary.left, this)) && isFloat(evaluate(binary.right, this))) {
					return left + right;
				} else if (isString(binary.left.value, binary.right.value)) {
					return binary.left.value + binary.right.value;
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
	}

	interpret() {
		return this.expression?.accept(new Visitor());
	}
}

export { Interpreter };
