import { ElementProperty } from "./Elementproperty";
import { Node } from "./node";

export class InnerText{
    constructor(
        public content: ElementProperty[],
        public parent?:Node
    ){}
}