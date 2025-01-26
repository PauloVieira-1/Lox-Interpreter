import fs from "fs";

const keywords = new Map([
  ["and", "AND"],
  ["class", "CLASS"],
  ["else", "ELSE"],
  ["false", "FALSE"],
  ["for", "FOR"],
  ["fun", "FUN"],
  ["if", "IF"],
  ["nil", "NIL"],
  ["or", "OR"],
  ["print", "PRINT"],
  ["return", "RETURN"],
  ["super", "SUPER"],
  ["this", "THIS"],
  ["true", "TRUE"],
  ["var", "VAR"],
  ["while", "WHILE"]
]);


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
 * @param {Array} token 
 */
const logTokens = (lines) => {
let current_line = 1
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
        result = equalMatch("/", line[current_token + 1]);
        if (!result) console.log("SLASH / null")
        if (result && current_token < line.length) current_token += line.length - current_token
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
      case `"`:
        let start = current_token + 1;
        let string = '';

        while (start < line.length && line[start] !== `"`) {
          if (line[start] === "\n") break;
          string += line[start];
          start++;
        }
        
        if (start < line.length && line[start] === `"`) {
          current_token = start;
          console.log(`STRING "${string}" ${string}`);
        } else {
          console.error(`[line ${current_line}] Error: Unterminated string.`);
          hasInvalidToken = true
        }
        break;
      default:
        if (isDigit(line[current_token])){
          
          let start_number = current_token;

          while (current_token < line.length && isDigit(line[current_token])) {
            current_token++;
          }

          if (current_token < line.length && line[current_token] === '.') {
            let start_decimal = current_token + 1;

            while (start_decimal < line.length && isDigit(line[start_decimal])) {
              start_decimal++;
            }
            current_token = start_decimal;
          }

          let numberString = line.substring(start_number, current_token);
          let floatNumber = parseFloat(numberString);
          console.log("NUMBER "+numberString+" "+(Number.isInteger(floatNumber)?floatNumber+".0":floatNumber));
          current_token--;
        } else if (isAlpha(line[current_token])) {
            let start = current_token;
            while (start < line.length && isAlphaNumeric(line[current_token])) {
              start++;
            }
          
            let text = line.substring(current_token, start);
          
            if (keywords.get(text) != null) {
              let reserved_word = keywords.get(text);
              console.log(`IDENTIFIER ${reserved_word} null`);
            } else {
              console.log(`IDENTIFIER ${text} null`);
            }

            current_token = start - 1;
        }
    
        break;
    }

  } 
  current_line++;
})
}

/**
 * @param {String} token 
 * @param {String} nextPlace 
 * @returns {Boolean}
 */
const equalMatch = (token, nextPlace) => {
  return  nextPlace === token;
}
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
        hasInvalidToken = true;
    }
  }
  current_line++;

});
  
}
const isDigit = (c) => {
  return c >= '0' && c <= '9';
}
const isAlpha = (c) => {
  return (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    c == '_';
}
const isAlphaNumeric = (c) => {
  return isAlpha(c) || isDigit(c);
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
