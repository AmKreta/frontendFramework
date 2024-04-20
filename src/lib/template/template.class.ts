import { Lexer } from "../template-compiler/lexer/lexer";
import { Node } from "../template-compiler/node/node";
import { Parser } from "../template-compiler/parser/parser";

export class Template{
    ast:Node;

    constructor(source :string){
        let lexer = new Lexer(source);
        let parser = new Parser(lexer);
        this.ast = parser.parse();
    }

};