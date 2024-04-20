import { NodeTree } from "../../nodeTree/nodeTree.class";
import { Template } from "../../template/template.class";

interface ComponentOptions{
    selector:string;
    template:string;
};

export function Component(options:ComponentOptions){
    return function<T extends {new(...args:any[]):{}}>(target:T, context:ClassDecoratorContext):T{
        return class Component extends target{
            static template:Template
            nodeTree: NodeTree<this>;

            constructor(...args:any[]){
                super(...args);
                if(!Component.template){
                    Component.template = new Template(options.template);
                }
                this.nodeTree = new NodeTree(Component.template, this);
            }

            mount(){
                const rootElement = this.nodeTree.create();
                return rootElement;
            }
        }
    }

}
