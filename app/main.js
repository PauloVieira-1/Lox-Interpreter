import fs from "fs";
import { Scanner } from "./scanner.js";
import { Parser, Visitor } from "./parser.js";
import { Interpreter } from "./evaluator.js";

const args = process.argv.slice(2);

if (args.length < 2) {
	console.error("Usage: ./your_program tokenize <filename>");
	process.exit(1);
}

const command = args[0];

if (command !== "tokenize" && command !== "parse" && command !== "evaluate") {
	console.error(`Usage: Unknown command: ${command}`);
	process.exit(1);
}

const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
	let lines = fileContent.split("\n");

	// Scanner Implementation
	const scanner = new Scanner(lines.join("\n"));
	const tokens = scanner.scanTokens();
	let errors = scanner.hasError;

	// Parser Implementation
	const parser = new Parser(tokens);
	const expr = parser.parse();
	if (parser.hasError) errors = true;

	const parsed = expr.accept(new Visitor());

	// Evaluator Implementation

	const evaluated = new Interpreter(expr).interpret();

	if (command === "tokenize") {
		tokens.forEach(token => console.log(token.toString()));
	} else if (command === "parse") {
		if (!errors) {
			console.log(parsed);
		}
	} else if (command === "evaluate") {
		// console.log(expr);
		if (!errors) {
			console.log(evaluated);
		}
	}

	if (errors) {
		process.exit(65);
	}
} else {
	console.log("EOF  null");
}
