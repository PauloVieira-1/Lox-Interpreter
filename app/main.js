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

	const scanner = new Scanner(lines.join("\n"));
	const tokens = scanner.scanTokens();

	let errors = scanner.hasError;

	if (command === "tokenize") {
		tokens.forEach(token => console.log(token.toString()));
	} else if (command === "parse" || command === "evaluate") {
		const parser = new Parser(tokens);
		const expr = parser.parse();

		// if (command === "parse") {
		try {
			if (!errors) {
				const parsed = expr.accept(new Visitor());
				// console.log(parsed);
			}
		} catch (error) {
			errors = true;
			console.error("Error during parsing: ", error);
		}
		// }
		if (command === "evaluate") {
			try {
				if (!errors) {
					const interpret = new Interpreter(expr).interpret();
					console.log(interpret);
				}
			} catch (error) {
				errors = true;
				console.error("Error during evaluation: ", error);
			}
		}
	}

	if (errors) {
		process.exit(65);
	}
} else {
	console.log("EOF  null");
}
