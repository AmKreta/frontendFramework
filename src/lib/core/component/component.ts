import { Lexer } from "../../template-compiler/lexer/lexer";
import { TOKEN_TYPE } from "../../template-compiler/tokens/tokens";

interface ComponentOptions{
    selector:string;
    template:string;
}

export function Component(options:ComponentOptions){
    return function<T extends {new(...args:any[]):{}}>(target:T, context:ClassDecoratorContext):T{
        let lexer = new Lexer(options.template);
        for(let i=lexer.getNextToken();i?.type!=TOKEN_TYPE.END_OF_FILE;i=lexer.getNextToken()){
            console.log(i);
        }

        return target;
    }
}