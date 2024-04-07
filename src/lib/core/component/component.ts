import { Lexer } from "../../template-compiler/lexer/lexer";
import { Parser } from "../../template-compiler/parser/parser";
import { TOKEN_TYPE } from "../../template-compiler/tokens/tokens";

interface ComponentOptions{
    selector:string;
    template:string;
}

export function Component(options:ComponentOptions){
    return function<T extends {new(...args:any[]):{}}>(target:T, context:ClassDecoratorContext):T{
        let lexer = new Lexer(options.template);
        let parser = new Parser(lexer);
        const ast = parser.parse();
        console.log(ast);
        return target;
    }
}