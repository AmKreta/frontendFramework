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
            componentDomRoot:Element | undefined;

            constructor(...args:any[]){
                super(...args);
                if(!Component.template){
                    Component.template = new Template(options.template);
                }
                this.nodeTree = new NodeTree(this);
            }

            mount(){
                this.componentDomRoot = this.nodeTree.create(Component.template);
                return this.componentDomRoot
            }
        }
    }

}
