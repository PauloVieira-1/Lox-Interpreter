
class Token {

    constructor(type, lexeme, literal, line) {
      this.type = type;
      this.lexeme = lexeme;
      this.literal = literal;
      this.line = line;
    }
  
    toString() {
      return `${this.type} ${this.lexeme} ${this.literal}`;
    }
  
  }

  class Scanner {
      
      constructor(source) {
          this.source = source;
          this.tokens = [];
          this.start = 0;
          this.current = 0;
          this.line = 1;
      }
    

    scanTokens() {
        while(!this.isAtEnd()){
            
            this.start = this.current;
            scanToken();

        }
        tokens.push(new Token(EOF, "", null, line));
        return tokens;
        }

    isAtEnd(){
        return this.current >= this.source.length;
    }

    }