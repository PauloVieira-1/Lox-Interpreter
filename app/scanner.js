// import { Lox } from "./main.js";

// const TokenType = {

//     LEFT_PAREN: 'LEFT_PAREN',
//     RIGHT_PAREN: 'RIGHT_PAREN',
//     LEFT_BRACE: 'LEFT_BRACE',
//     RIGHT_BRACE: 'RIGHT_BRACE',
//     COMMA: 'COMMA',
//     DOT: 'DOT',
//     MINUS: 'MINUS',
//     PLUS: 'PLUS',
//     SEMICOLON: 'SEMICOLON',
//     SLASH: 'SLASH',
//     STAR: 'STAR',
  
//     // One or two character tokens.
//     BANG: 'BANG',
//     BANG_EQUAL: 'BANG_EQUAL',
//     EQUAL: 'EQUAL',
//     EQUAL_EQUAL: 'EQUAL_EQUAL',
//     GREATER: 'GREATER',
//     GREATER_EQUAL: 'GREATER_EQUAL',
//     LESS: 'LESS',
//     LESS_EQUAL: 'LESS_EQUAL',
  
//     // Literals.
//     IDENTIFIER: 'IDENTIFIER',
//     STRING: 'STRING',
//     NUMBER: 'NUMBER',
  
//     // Keywords.
//     AND: 'AND',
//     CLASS: 'CLASS',
//     ELSE: 'ELSE',
//     FALSE: 'FALSE',
//     FUN: 'FUN',
//     FOR: 'FOR',
//     IF: 'IF',
//     NIL: 'NIL',
//     OR: 'OR',
//     PRINT: 'PRINT',
//     RETURN: 'RETURN',
//     SUPER: 'SUPER', 
//     THIS: 'THIS',
//     TRUE: 'TRUE',
//     VAR: 'VAR',
//     WHILE: 'WHILE',
  
//     EOF: 'EOF'
//   };
  

//   // The reason we use a Map here is to look up whether a
//   // given string is a keyword in constant time. If we used
//   // an array or an object, the lookup time would be linear
//   // because we would have to iterate over the elements of
//   // the array or object.
  
//   const keywords = new Map([
//     ["and", TokenType.AND],
//     ["class", TokenType.CLASS],
//     ["else", TokenType.ELSE],
//     ["false", TokenType.FALSE],
//     ["for", TokenType.FOR],
//     ["fun", TokenType.FUN],
//     ["if", TokenType.IF],
//     ["nil", TokenType.NIL],
//     ["or", TokenType.OR],
//     ["print", TokenType.PRINT],
//     ["return", TokenType.RETURN],
//     ["super", TokenType.SUPER],
//     ["this", TokenType.THIS],
//     ["true", TokenType.TRUE],
//     ["var", TokenType.VAR],
//     ["while", TokenType.WHILE],
//   ]);
  
// class Token {

//     constructor(type, lexeme, literal, line) {
//       this.type = type;
//       this.lexeme = lexeme;
//       this.literal = literal;
//       this.line = line;
//     }
  
//     toString() {
//       return `${this.type} ${this.lexeme} ${this.literal}`;
//     }
  
//   }

//   class Scanner {
      
//       constructor(source) {
//           this.source = source;
//           this.tokens = [];
//           this.start = 0;
//           this.current = 0;
//           this.line = 1;
//       }
    

//     scanTokens() {
//         while(!this.isAtEnd()){
            
//             this.start = this.current;
//             scanToken();

//         }
//         tokens.push(new Token(EOF, "", null, line));
//         return tokens;
//         }

//     isAtEnd(){
//         return this.current >= this.source.length;
//     }

//     /**
//      * Scans the next token in the source.
//      */
//     scanToken() {
//         let c = this.advance();
//         switch (c) {
//           case '(': addToken(TokenType.LEFT_PAREN); break;
//           case ')': addToken(TokenType.RIGHT_PAREN); break;
//           case '{': addToken(TokenType.LEFT_BRACE); break;
//           case '}': addToken(TokenType.RIGHT_BRACE); break;
//           case ',': addToken(TokenType.COMMA); break;
//           case '.': addToken(TokenType.DOT); break;
//           case '-': addToken(TokenType.MINUS); break;
//           case '+': addToken(TokenType.PLUS); break;
//           case '*': addToken(TokenType.STAR); break; 
//           case ';': addToken(TokenType.SEMICOLON); break;
//           case '=': addToken(match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);break;
//           case '!': addToken(match('=') ? TokenType.BANG_EQUAL : TokenType.BANG); break;
//           case '<': addToken(match('=') ? TokenType.LESS_EQUAL : TokenType.LESS); break;
//           case '>': addToken(match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER); break;
//           case '/':
        
//           if (match('/')) {
//           while (peek() != '\n' && !this.isAtEnd()) this.advance();
//         } else {
//           addToken(SLASH);
//         }
//         break;

//         case ' ':
//             case '\r':
//             case '\t':
//               // Ignore whitespace.
//               break;
      
//             case '\n':
//               this.line++;
//               break;
      
//             case '"': this.string(); break; 
//             case 'o':
//                 if (match('r')) addToken(OR);
//                 break;

//             default:
//                 if (this.isDigit(c)) {
//                           this.number();
//                         } else if (this.isAlpha(c)) {
//                           this.identifier();
//                         }
//                          else {
//                           Lox.error(this.line, "Unexpected character.");
//                         }
//                         break;
//         }
//       }

//       isAlpha(c) {
//         return (c >= 'a' && c <= 'z') ||
//           (c >= 'A' && c <= 'Z') ||
//           c == '_';
//       }

//       identifier() {
//         while (isAlphaNumeric(peek())) advance();
      
//         let text = this.source.substring(this.start, this.current);
//         let type = keywords.get(text);
//         if (type == null) type = IDENTIFIER;

//             addToken(IDENTIFIER);
//       }
//       advance() {
//         this.current++;
//         return this.source.charAt(this.current - 1);
//       }

//       addToken(type) {
//         let text = this.source.substring(this.start, this.current);
//         tokens.push(new Token(type, text, null, this.line));
//       }

//       match(expected) {
//         if (isAtEnd()) return false;
//         if (this.source.charAt(this.current) != expected) return false;
//         this.current++;
//         return true;
//       }

//       peek() {  
//         if (isAtEnd()) return '\0';
//         return this.source.charAt(this.current);
//       } 

//       string() {
//         while (peek() != '"' && !isAtEnd()) {
//           if (peek() == '\n') line++;
//           advance();
//         }
      
//         if (isAtEnd()) {
//           Lox.error(line, "Unterminated string.");
//           return;
//         }
      
//         advance();
      
//         let value = this.source.substring(this.start + 1, this.current - 1);
//         addToken(STRING, value);
//       }

//       number() {
//         while (isDigit(peek())) advance();
      
//         if (peek() == '.' && isDigit(peekNext())) {
//           advance();
//           while (isDigit(peek())) advance();
//         }
      
//         addToken(NUMBER, parseFloat(this.source.substring(this.start, this.current)));
//       }

//       peekNext() {
//         if (this.current + 1 >= this.source.length) return '\0';
//         return this.source.charAt(this.current + 1);
//       }

//       isDigit(c) {
//         return c >= '0' && c <= '9';
//       }

//     }

//     export { Scanner } 