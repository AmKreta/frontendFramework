import { Lexer } from "../lexer/lexer";
import { TOKEN_MAP, TOKEN_TYPE } from "../tokens/tokens";

export class Parser{
    private currrentToken;

    constructor(private lexer:Lexer){
        this.currrentToken = this.lexer.getNextToken()!;
    }

    eat(token:TOKEN_TYPE, checkByType?:boolean){
        if(checkByType // tokens like innerText, tagName have different value, need to be compare by type
            ? token!==this.currrentToken.type 
            : token!==this.currrentToken.value
        ){
            throw `expected ${token} got [${this.currrentToken.type}, ${this.currrentToken.value}]`;
        }
        this.currrentToken = this.lexer.getNextToken()!;
    }

    parseAttributes(){
        let attributes = [];
        while(this.currrentToken.type!=TOKEN_TYPE.TAG_CLOSE){
            const name = this.currrentToken.value!;
            this.eat(TOKEN_MAP[TOKEN_TYPE.ATTRIBUTE_NAME], true);
            this.eat(TOKEN_MAP[TOKEN_TYPE.ASSIGNMENT]);
            const value = this.currrentToken.value!;
            this.eat(TOKEN_MAP[TOKEN_TYPE.ATTRIBUTE_VALUE], true);
            attributes.push({name, value});
        }
        return attributes;
    }

    parseInnerText(){
        let innerText = this.currrentToken.value;
        this.eat(TOKEN_MAP[TOKEN_TYPE.INNER_TEXT], true);
        return innerText;
    }

    parseInnerHTML(){
        return this.parseTags();
    }

    parseChildren(){
        let children:any = [];
        while(!(this.currrentToken.type===TOKEN_TYPE.TAG_OPEN && this.lexer.peek()==='/')){
            if(this.currrentToken.type===TOKEN_TYPE.INNER_TEXT){
                children.push(this.parseInnerText());
            }
            else{
                children.push(this.parseInnerHTML());
            }
        }
        return children;
    }

    parseTags(){
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_OPEN]);
        const tagName = this.currrentToken.value!;
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_NAME], true);

        const attributes = this.parseAttributes();
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_CLOSE]);

        const children = this.parseChildren();
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_OPEN]);
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_CLOSE_SLASH])
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_NAME], true);
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_CLOSE]);

        const node = {
            tagName,
            attributes,
            children
        }

        return node;

    }

    parse(){
        const node = this.parseTags();
        return node;
    }
};