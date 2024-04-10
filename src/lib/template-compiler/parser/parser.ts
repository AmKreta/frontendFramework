import { Lexer } from "../lexer/lexer";
import { AttributeValue } from "../node/AttributeValue";
import { InnerText } from "../node/innerText";
import { Node } from "../node/node";
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
        let attributes:{name:string, value:AttributeValue}[] = [];
        while(this.currrentToken.type!=TOKEN_TYPE.TAG_CLOSE){
            const name = this.currrentToken.value! as string;
            this.eat(TOKEN_MAP[TOKEN_TYPE.ATTRIBUTE_NAME], true);
            this.eat(TOKEN_MAP[TOKEN_TYPE.ASSIGNMENT]);
            const value = this.currrentToken.value! as AttributeValue;
            this.eat(TOKEN_MAP[TOKEN_TYPE.ATTRIBUTE_VALUE], true);
            attributes.push({name, value});
        }
        return attributes;
    }

    parseInnerText(parent:Node){
        let innerText = this.currrentToken.value as InnerText;
        this.eat(TOKEN_MAP[TOKEN_TYPE.INNER_TEXT], true);
        innerText.parent = parent;
        return innerText;
    }

    parseInnerHTML(parent:Node){
        return this.parseTags(parent);
    }

    parseChildren(parent:Node){
        let children:(Node | InnerText)[] = [];
        while(!(this.currrentToken.type===TOKEN_TYPE.TAG_OPEN && this.lexer.peek()==='/')){
            if(this.currrentToken.type===TOKEN_TYPE.INNER_TEXT){
                children.push(this.parseInnerText(parent));
            }
            else{
                children.push(this.parseInnerHTML(parent));
            }
        }
        return children;
    }

    parseTags(parent:Node|null = null):Node{
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_OPEN]);
        const tagName = this.currrentToken.value!;
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_NAME], true);

        const attributes = this.parseAttributes();
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_CLOSE]);
        const node = new Node(
            tagName as string,
            attributes,
            parent,
            []
        )
        const children = this.parseChildren(node);
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_OPEN]);
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_CLOSE_SLASH])
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_NAME], true);
        this.eat(TOKEN_MAP[TOKEN_TYPE.TAG_CLOSE]);
        node.children = children;
        return node;
    }

    parse(){
        const node = this.parseTags();
        return node;
    }
};