export enum TOKEN_TYPE{
    START_OF_FILE = 'START_OF_FILE',
    END_OF_FILE = 'END_OF_FILE',
    ATTRIBUTE_NAME = 'ATTRIBUTE_NAME',
    ATTRIBUTE_VALUE = 'ATTRIBUTE_VALUE',
    INNER_TEXT = 'INNER_TEXT',
    TAG_NAME = 'TAG_NAME',
    TAG_OPEN = 'TAG_OPEN',
    TAG_CLOSE ='TAG_CLOSE',
    TAG_CLOSE_SLASH='TAG_CLOSE_SLASH',
    ASSIGNMENT = "ASSIGNMENT"
}

export class Token{
    constructor(
        public type:TOKEN_TYPE,
        public value?: string,
        public dynamic?: boolean,
        public dynamicType?:'jsInterpolation' | 'templateInterpolation',
        public dependsUpon?:string[],
    ){}
}

export const TOKEN_MAP:any = {
    START_OF_FILE : 'START_OF_FILE',
    END_OF_FILE : 'END_OF_FILE',
    ATTRIBUTE_NAME : 'ATTRIBUTE_NAME',
    ATTRIBUTE_VALUE : 'ATTRIBUTE_VALUE',
    INNER_TEXT : 'INNER_TEXT',
    TAG_NAME : 'TAG_NAME',
    TAG_OPEN : '<',
    TAG_CLOSE : '>',
    TAG_CLOSE_SLASH : '/',
    ASSIGNMENT : "="
}

export class TokenFactory{

    static createFromType(token:TOKEN_TYPE){
        return new Token(token, TOKEN_MAP[token]);
    }

    static createFromTypeAndValue(token:TOKEN_TYPE, value:string, dynamic?:boolean, dynamicType?:'jsInterpolation' | 'templateInterpolation',  dependsUpon?:string[]){
        return new Token(token, value, dynamic, dynamicType, dependsUpon);
    }
}