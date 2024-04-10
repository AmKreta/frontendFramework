import { AttributeValue } from "./AttributeValue";
import { InnerText } from "./innerText";

export class Node{
    ref?:HTMLElement;

    constructor(
        public tagName:string,
        public attributes:{name:string, value:AttributeValue}[],
        public parent:Node | null,
        public children:(InnerText | Node)[]
    ){}

}