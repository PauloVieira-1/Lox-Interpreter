import fs from "fs";




/// Opening File ///
const args = process.argv.slice(2); 

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
} 

const command = args[0];

if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

const filename = args[1];
const fileContent = fs.readFileSync(filename, "utf8");

/// END ///

/**
 * 
 * @param {Array} lines 
 */

const CheckErrors = (lines) => {
  let current_line = 1
  
  lines.forEach(line => {
    for (let j = 0; j < line.length; j++) {
      if (invalidTokens.includes(line[j])) {
        console.error(`[line ${current_line}] Error: Unexpected character: ${line[j]}`);
        hasInvalidToken = true
      }
    }
    current_line++;
  });
  
}


/**v
 * 
 * @param {Array} token 
 */
const logTokens = (lines) => {
  
lines.forEach(line => {
  for (let j = 0; j < line.length; j++) {
    console.log(line[j]);
  }
})


}

/**
 * 
 * @param {String} token 
 * @param {String} nextPlace 
 * @returns {Boolean}
 */
const equalMatch = (token, nextPlace) => {
  console.log(token, nextPlace);
  return  nextPlace === token;
}


const invalidTokens = ["$", "#", "@", "%"];
let hasInvalidToken = false 
 
if (fileContent.length !== 0) {
  
  let lines = fileContent.split("\n");

  /// CHECK ERRORS
  CheckErrors(lines)
  
  for (let i = 0; i < lines.length; i++) {
    for (let s = 0; s < lines[i].length; s++) {

      switch(lines[i][s]) {
        case "(":
          console.log("LEFT_PAREN ( null");
          break;
        case ")":
          console.log("RIGHT_PAREN ) null")
          break;
        case "{":
          console.log("LEFT_BRACE { null")
          break;
        case "}":
          console.log("RIGHT_BRACE } null")
          break;
        case ",":
          console.log("COMMA , null")
          break;
        case ".":
          console.log("DOT . null")
          break;
        case "-":
          console.log("MINUS - null")
          break;
        case "+":
          console.log("PLUS + null")
          break;
        case ";":
          console.log("SEMICOLON ; null")
          break;
        case "*":
          console.log("STAR * null")
          break;
        case "/":
          console.log("SLASH / null")
          break;
        case "!":
          console.log(equalMatch("=", lines[i][s + 1]) ? "BANG_EQUAL" : "EQUAL")
        case "=":
          console.log(equalMatch("=", lines[i][s + 1]) ? "EQUAL_EQUAL" : "EQUAL")
        case "<":
          console.log(equalMatch("=", lines[i][s + 1]) ? "LESS_EQUAL" : "LESS")
        case ">": 
        console.log(equalMatch("=", lines[i][s + 1]) ? "GREATER_EQUAL" : "GREATER")
      }
    }
  
  }

  console.log("EOF  null")

  } else {
  console.log("EOF  null");
}

if (hasInvalidToken) {
  process.exit(65);
}
