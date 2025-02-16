import fs from "fs";
import { Scanner } from "./scanner.js";
import { Parser, Visitor } from "./parser.js";
import { Interpreter } from "./evaluator.js";

const args = process.argv.slice(2);

if (args.length < 2) {
	console.error("Usage: ./your_program.sh tokenize <filename>");
	process.exit(1);
}

const command = args[0];

if (
	command !== "tokenize" &&
	command !== "parse" &&
	command !== "evaluate" &&
	command !== "run"
) {
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
	} else if (
		command === "parse" ||
		command === "evaluate" ||
		command === "run"
	) {
		if (command === "parse") {
			const parser = new Parser(tokens);
			const expr = parser.parseEvaluator();
			if (!errors) {
				try {
					const parsed = expr.accept(new Visitor());
					console.log(parsed);
				} catch (error) {
					errors = true;
				}
			}
		}

		if (command === "evaluate") {
			try {
				if (!errors) {
					const parser = new Parser(tokens);
					const expr = parser.parse();
					// console.log(parser);
					const interpret = new Interpreter(expr).interpret();
					// console.log(interpret);
				}
			} catch (error) {
				console.error("Error during evaluation: ", error);
			}
		}

		if (command === "run") {
			try {
				if (!errors) {
					const parser = new Parser(tokens);
					parser.parse();
				}
			} catch (error) {
				console.error("Error during running: ", error);
			}
		}
	}

	if (errors) {
		process.exit(65);
	}
} else {
	console.log("EOF  null");
}
