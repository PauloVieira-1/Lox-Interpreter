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

const invalidTokens = ["$", "#", "@", "%"];
let hasInvalidToken = false 
let lexicalErrors = false

/**
 * 
 * @param {Array} lines 
 */

const CheckErrors = (lines) => {
  let current_line = 1;
  lines.forEach((line) => {
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') {
        let current_token = j + 1;
        let matched = false;
        while (current_token < line.length) {
          if (line[current_token] === `"`) {
            matched = true;
            break;
          }
          current_token++;
        }
        if (!matched) {
          lexicalErrors = true;
          console.error(`[line ${current_line}] Error: Unterminated string.`);
          break; 
        }
      }
    }
    current_line++;
  });
};



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
        result = equalMatch("=", line[current_token + 1]);
        console.log(result ? "LESS_EQUAL <= null" : "LESS < null")
        if (result && current_token < line.length) current_token++;
        break;
      case ">": 
      result = equalMatch("=", line[current_token + 1]);
      console.log(result ? "GREATER_EQUAL >= null" : "GREATER > null")
      if (result && current_token < line.length) current_token++;
      break;

      case `"`: {
        let stringContent = "";
        let start = current_token; 
        current_token++;
        while (current_token < line.length && line[current_token] !== `"`) {
          stringContent += line[current_token];
          current_token++;
        }
        if (current_token < line.length && line[current_token] === `"`) {
          console.log(`STRING "${line.slice(start, current_token + 1)}" ${stringContent}`);
        } else {
          lexicalErrors = true;
          console.error(`[line ${current_line}] Error: Unterminated string.`);
          break;
        }
        break;
      }
        // case line[current_token] >= '0' && line[current_token] <= '9':
        
        // let start = current_token;
        // let number_string = '';
        
        // console.log(line[start])
        // while (start < line.length && line[start] >= '0' && line[start] <= '0') {
        //   number_string += line[start];
        //   start++;
        // }

        // let float = parseFloat(number_string)

        // console.log(`NUMBER ${number_string} ${float}`);
        // break;

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

/// TOKENIZING FILE 
 
if (fileContent.length !== 0) {
  
  let lines = fileContent.split("\n");

  CheckErrors(lines)
  logTokens(lines)

  
  console.log("EOF  null")

  } else {
  console.log("EOF  null");
}

if (hasInvalidToken || lexicalErrors) {
  process.exit(65);
}

