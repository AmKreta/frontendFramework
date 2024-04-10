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

export function appendThis(input:string) {
    let modifiedVars = new Set<string>();
    const result = input.replace(/(^|[^A-Za-z0-9_$'])\b([A-Za-z$_][A-Za-z0-9$_]*)(?!')\b/g, (match, prefix, varName) => {
        if (!['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'].includes(varName)) {
            modifiedVars.add(varName);
            return prefix + 'this.' + varName;
        }
        return match;
    });
    return { output: result, modifiedVars: Array.from(modifiedVars) };
}