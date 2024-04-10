import { Lexer } from "../../template-compiler/lexer/lexer";
import { InnerText } from "../../template-compiler/node/innerText";
import { Node } from "../../template-compiler/node/node";
import { Attribute } from "../../template-compiler/node/types";
import { Parser } from "../../template-compiler/parser/parser";

interface ComponentOptions{
    selector:string;
    template:string;
};

export interface ComponentInterface{
    elementTree : any;
    mount:Function;
};

export function Component(options:ComponentOptions){
    return function<T extends {new(...args:any[]):{}}>(target:T, context:ClassDecoratorContext):T{
        let lexer = new Lexer(options.template);
        let parser = new Parser(lexer);
        const ast:Node = parser.parse();
        return class extends target{
            elementTree = ast;

            mount(){
                return this.createElement(this.elementTree);
            }

            getInterpolatedValue(attributeValue:string){
                const func = new Function(`return ${attributeValue}`);
                return func.call(this);
            }

            createElement(elementTree:Node){
                const element:HTMLElement = document.createElement(elementTree.tagName as string);
                elementTree.attributes.forEach((attribute:Attribute) => {
                    if(attribute.value.dependsOn?.length){
                        (element as any)[attribute.name] = this.getInterpolatedValue(attribute.value.value);
                    }
                    else{
                        (element as any)[attribute.name] = attribute.value.value;
                    }
                    document.body.appendChild(element);
                });
                elementTree.children.forEach(child=>{
                    if(child instanceof InnerText){
                        child.content.forEach(childFragment=>{
                            if(childFragment.dependsOn?.length){
                                let textNode = document.createTextNode(this.getInterpolatedValue(childFragment.value));
                                element.appendChild(textNode);
                            }
                            else{
                                let textNode = document.createTextNode(childFragment.value);
                                element.appendChild(textNode);
                            }
                        })
                    }
                    else{
                        document.body.appendChild(this.createElement(child));
                    }
                })
                return element;
            }
        }
    }
}
