enum ATTRIBUTE_VALUE_TYPE{
    STATIC,
    STRING_INTERPOLATION,
    TEMPLATE_INTERPOLATION
};

interface ATTRIBUTE{
    key:string;
    value:{
        type: ATTRIBUTE_VALUE_TYPE;
        dependsOn?:string[]
    }
};

export class Node{
    ref?:HTMLElement;

    constructor(
        private type:string,
        private attributes:ATTRIBUTE[],
        private parent:Node,
        private children:Node[]
    ){}

}