import fs from "fs";
import { Scanner, Token } from "./scanner.js";
import { Parser, Visitor, Literal, BinaryExpression } from "./parser.js";

const args = process.argv.slice(2);

if (args.length < 2) {
	console.error("Usage: ./your_program tokenize <filename>");
	process.exit(1);
}

const command = args[0];

if (command !== "tokenize" && command !== "parse") {
	console.error(`Usage: Unknown command: ${command}`);
	process.exit(1);
}

const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
	let lines = fileContent.split("\n");

	const scanner = new Scanner(lines.join("\n"));
	const tokens = scanner.scanTokens();
	const errors = false;

	if (command === "tokenize") {
		tokens.forEach(token => console.log(token.toString()));
		// console.log(tokens);
	} else if (command === "parse") {
		const parser = new Parser(tokens);
		try {
			const expr = parser.parse();
			const parsed = expr.accept(new Visitor());
			errors = parser.hasError || scanner.hasError ? true : false;
			console.log(parsed);
		} catch (error) {
			// console.error("Error during parsing: ", error);
		}
	}

	if (errors) {
		process.exit(65);
	}
} else {
	console.log("EOF  null");
}
