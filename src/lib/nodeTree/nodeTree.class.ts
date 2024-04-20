import { InnerText } from "../template-compiler/node/innerText";
import { Node } from "../template-compiler/node/node";
import { Attribute } from "../template-compiler/node/types";
import { Template } from "../template/template.class";

export class NodeTree<T extends {}>{
    constructor(
        private template: Template,
        private componentClassContext: T
    ) { }

    create(){
        return this.createNodeTree(this.template.ast);
    }

    private getInterpolatedValue(attributeValue:string){
        const func = new Function(`return ${attributeValue}`);
        return func.call(this.componentClassContext);
    }

    private addPropertyStateChangeSubscriber(){
        if((this.componentClassContext as any).__proto__.propertyChangeSubscribers){
            return;
        }
        (this.componentClassContext as any).__proto__.propertyChangeSubscribers = new Map();
    }

    private createNodeTree(elementTree:Node){
        const element:Element = document.createElement(elementTree.tagName as string);
        elementTree.ref = element;
        elementTree.attributes.forEach((attribute:Attribute) => {
            if(attribute.value.dependsOn?.length){
                if(attribute.name.startsWith('on')){
                    let attributeName = attribute.name.substring(2);
                    let handler = this.getInterpolatedValue(attribute.value.value);
                    let bindedHandler = handler.bind(this.componentClassContext);
                    element.addEventListener(attributeName, bindedHandler);
                }
                else{
                    if(attribute.value.dependsOn){
                        element.setAttribute(attribute.name, this.getInterpolatedValue(attribute.value.value));
                        attribute.value.dependsOn.forEach(state=>{
                            this.subscribeToStateChange(state, ()=>{
                                element.setAttribute(attribute.name, this.getInterpolatedValue(attribute.value.value));
                            })
                        });
                    }
                    element.setAttribute(attribute.name, attribute.value.dependsOn 
                        ?this.getInterpolatedValue(attribute.value.value)
                        :attribute.value.value);
                }
            }
            else{
                element.setAttribute(attribute.name, attribute.value.value);
            }
        });
        elementTree.children.forEach(child=>{
            if(child instanceof InnerText){
                child.content.forEach(childFragment=>{
                    if(childFragment.dependsOn?.length){
                        let textNode = document.createTextNode(this.getInterpolatedValue(childFragment.value));
                        element.appendChild(textNode);
                        childFragment.dependsOn.forEach(dependency=>{
                            this.subscribeToStateChange(dependency, ()=>{
                                textNode.nodeValue = this.getInterpolatedValue(childFragment.value);
                            });
                        });
                    }
                    else{
                        let textNode = document.createTextNode(childFragment.value);
                        element.appendChild(textNode);
                    }
                })
            }
            else{
                element.appendChild(this.createNodeTree(child));
            }
        })
        return element;
    }


    private subscribeToStateChange(dependency:string, handler:Function){
        this.addPropertyStateChangeSubscriber();
        let subscriber = (this.componentClassContext as any).propertyChangeSubscribers.get(dependency);
        if(!subscriber){
            subscriber = new Set();
            (this.componentClassContext as any).propertyChangeSubscribers.set(dependency, subscriber);
        }
        subscriber.add(handler);
    }
}