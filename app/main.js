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

/**
 * 
 * @param {Array} token 
 */
const logTokens = (lines) => {
  
lines.forEach(line => {
    
  for (let current_token = 0; current_token < line.length; current_token++) {
    
    let result;
    switch(line[current_token]) {
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
        result = equalMatch("=", line[current_token + 1]);
        console.log(result ? "BANG_EQUAL != null" : "BANG ! null")
        if (result && current_token < line.length) current_token++;
        break;
      case "=":
        result = equalMatch("=", line[current_token + 1]);
        console.log(result ? "EQUAL_EQUAL == null" : "EQUAL = null")
        if (result && current_token < line.length) current_token++;
        break;
      case "<":
        // console.log(line[current_token + 1])
        result = equalMatch("=", line[current_token + 1]);
        console.log(result ? "LESS_EQUAL <= null" : "LESS < null")
        if (result && current_token < line.length) current_token++;
        break;

      case ">": 
      result = equalMatch("=", line[current_token + 1]);
      console.log(result ? "GREATER_EQUAL >= null" : "GREATER > null")
      if (result && current_token < line.length) current_token++;
      break;

    }
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
  return  nextPlace === token;
}







/// TOKENIZING FILE 

const invalidTokens = ["$", "#", "@", "%"];
let hasInvalidToken = false 
 
if (fileContent.length !== 0) {
  
  let lines = fileContent.split("\n");

  CheckErrors(lines)
  logTokens(lines)
  

  console.log("EOF  null")

  } else {
  console.log("EOF  null");
}

if (hasInvalidToken) {
  process.exit(65);
}
