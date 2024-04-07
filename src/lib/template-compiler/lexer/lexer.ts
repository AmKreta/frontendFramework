import { TOKEN_TYPE, Token, TokenFactory } from "../tokens/tokens";
import { getDelimeterForAttributes, isTextOrInterpolation } from "./util";

export class Lexer{
    currentPosition = 0;
    prevToken = new Token(TOKEN_TYPE.START_OF_FILE);
    
    constructor(private source:string){}

    advance(jump=1){
        this.currentPosition+=jump;
    }

    skipWhitespace(){
        while(this.source[this.currentPosition]===' '){
            this.advance();
        }
    }

    skipNextLine(){
        while(this.source[this.currentPosition]==='\n'){
            this.advance();
        }
    }

    skipSkipable(){
        this.skipNextLine();
        this.skipWhitespace();
    }

    getNextToken(){
        if(this.currentPosition >= this.source.length){
            return TokenFactory.createFromType(TOKEN_TYPE.END_OF_FILE);
        }
        this.skipSkipable();
        switch(this.source[this.currentPosition]){
            case '<':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.TAG_OPEN);
            case '>':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.TAG_CLOSE);
            case '/':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.TAG_CLOSE_SLASH);
            case '=':
                this.advance();
                return this.prevToken = TokenFactory.createFromType(TOKEN_TYPE.ASSIGNMENT);
            default:
                if(isTextOrInterpolation(this.source[this.currentPosition])){
                    switch(this.prevToken.type){
                        case TOKEN_TYPE.TAG_OPEN:
                        case TOKEN_TYPE.TAG_CLOSE_SLASH:
                            return this.prevToken = TokenFactory.createFromTypeAndValue(TOKEN_TYPE.TAG_NAME, this.readTagName());
                        case TOKEN_TYPE.TAG_CLOSE:
                            return this.prevToken = TokenFactory.createFromTypeAndValue(TOKEN_TYPE.INNER_TEXT, this.readInnerText());
                        case TOKEN_TYPE.TAG_NAME:
                        case TOKEN_TYPE.ATTRIBUTE_VALUE:
                            return this.prevToken = TokenFactory.createFromTypeAndValue(TOKEN_TYPE.ATTRIBUTE_NAME, this.readAttributeName());
                        case TOKEN_TYPE.ASSIGNMENT:
                            return this.prevToken = TokenFactory.createFromTypeAndValue(TOKEN_TYPE.ATTRIBUTE_VALUE, this.readAttributeValue());
                        
                    }
                }
        }
    }

    readTagName(){
        let jump = this.currentPosition;
        while(jump < this.source.length && isTextOrInterpolation(this.source[jump])){
            jump++;
        }
        let res = this.source.substring(this.currentPosition, jump);
        this.advance(jump-this.currentPosition);
        return res;
    }

    readAttributeName(){
        let jump = this.currentPosition;
        if(!/[a-zA-Z]/.test(this.source[this.currentPosition])){
            throw "attribute name should start with digit only";
        }
        while(jump < this.source.length && /[a-zA-Z0-9-_]/.test(this.source[jump])){
            jump++;
        }
        this.skipSkipable();
        if(this.source[jump]!=="="){
            throw "attribute names can only contain letter, no., -, _";
        }
        let res = this.source.substring(this.currentPosition, jump);
        this.advance(jump-this.currentPosition);
        return res;
    }

    readAttributeValue(){
        if(["'",'"','`','{'].includes(this.source[this.currentPosition])){
            let delimeter = getDelimeterForAttributes(this.source[this.currentPosition]);
            this.advance();
            let jump = this.currentPosition;
            while(jump < this.source.length && this.source[jump]!=delimeter){
                jump++;
            }
            let res = this.source.substring(this.currentPosition, jump);
            this.advance(jump-this.currentPosition);
            this.advance(); // jumping off closing quote / interpolation
            return res;
        }
        throw "atrribute name should be interpolation or in quotes or backtick";
    }

    readInnerText(){
        this.skipSkipable();
        let jump = this.currentPosition;
        let delimeter = '<';
        while(jump < this.source.length && this.source[jump]!=delimeter){
            jump++;
        }
        let res = this.source.substring(this.currentPosition, jump);
        this.advance(jump-this.currentPosition);
        return res;
    }
}

//hello