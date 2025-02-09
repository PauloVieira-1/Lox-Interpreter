function isFloat(n) {
	let val = parseFloat(n);
	return !isNaN(val);
}

function isString(r, l) {
	return typeof r === 'string' || typeof l === 'string';
}

function isTruthy(t) {
	if (t == null) return false;
	if (t === false) return t;
	return true;
}

function isDecimal(n) {
    return !isNaN(n) && n.includes('.');
}

function checkNumberOperands(right, left) {
    if (typeof right !== 'number' || typeof left !== 'number') {
        new RuntimeError(null, "Operands must be numbers.").error();
		process.exit(70)
	}
}

function checkNumberOperand(right) {
	console.log(right)
	if (typeof right !== 'number' || typeof right !== 'boolean') {
		new RuntimeError(null, "Operand must be a number.").error();
		process.exit(70)
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

class RuntimeError {
    constructor(line, message) {
		this.line = line;
		this.message = message;
    }

	error() {
		console.error(`${this.message}`);
	}
}

class Visitor {
	visitLiteralExpression(literal) {

		if (literal.value === null) return "nil";
		
		if (isFloat(literal.value)){
			try {
				if (isDecimal(literal.value)){
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
				return -Number(right)
			case "!" :
				checkNumberOperand(right);
				return !(isTruthy(unary.right.value));
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
                checkNumberOperands(right, left);
				return left - right;
			case "*":
                checkNumberOperands(right, left);
				return left * right;
			case "/":
                checkNumberOperands(right, left);
				return left / right;
			case "<":
                checkNumberOperands(right, left);
				return left < right;
			case ">":
                checkNumberOperands(right, left);
				return left > right;
			case ">=":
				checkNumberOperands(right, left);
				return left >= right;
			case "<=":
				checkNumberOperands(right, left);
				return left <= right;
			case "!=":
				return left !== right;
			case "==":
				return leftEval === rightEval ;
			case "+":
					if (isFloat(leftEval) && isFloat(rightEval)) {
						return left + right;
					} else if (isString(leftEval, rightEval)) {
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
	}

	interpret() {
		return this.expression?.accept(new Visitor());
	}
}

export { Interpreter };
