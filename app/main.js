import fs from "fs";
import { Scanner } from "./scanner.js";
const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
} 

const command = args[0];

if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

console.error("Logs from your program will appear here!");

const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
  let lines = fileContent.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (let s = 0; s < lines[i].length; s++) {
      switch(lines[i][s]) {
        case "(":
          console.log("LEFT_PAREN ( null");
          break
        case ")":
          console.log("RIGHT_PAREN ) null")
          break;
      }
    }
  }
  console.log("EOF  null")
} else {
  console.log("EOF  null");
}


function run(source) {
  const scanner = new Scanner(source); 
  const tokens = scanner.scanTokens(); 

  for (const token of tokens) {
    console.log(token);
  }
}

run(fileContent);

// Error Handling 

// class Lox {

//   static hadError = false;
//   static error(line, message) { // create seoerte class later 
//     report(line, "", message);
//   }
  
//   static report(line, where, message) {
//     console.error(`[line ${line}] Error${where}: ${message}`);
//     hadError = true;
//   }

//   if (hadError) {
//     process.exit(65);
//     hadError = false; /// Good practice to seperate code that generates errors and code that report them, hence why not in scanner 

// }  

// }

// export { Lox }
