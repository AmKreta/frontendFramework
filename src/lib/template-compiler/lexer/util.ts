export function isText(text:string){
    return (/[0-9a-zA-Z]/).test(text)
}

export function isTextOrInterpolation(text:string){
    return (/[0-9a-zA-Z{'"`]/).test(text)
}

export function getDelimeterForAttributes(text:string){
    switch(text){
        case '"': 
        case "'":
        case "`": return text;
        case '{': return '}';
        default: return '<'; // for plain simple text , either closing or opening tag wil be the delimeter
    }
}