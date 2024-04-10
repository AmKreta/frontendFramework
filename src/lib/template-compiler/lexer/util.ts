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

export function buildInnerText(input:string){
        let output = [];
        let startIndex = 0;
        let inInterpolation = false;
    
        for (let i = 0; i < input.length; i++) {
            if (input[i] === '{' && input[i + 1] === '{') {
                i++; // Skip the next '{' to avoid it being considered as interpolation
                continue;
            }
    
            if (input[i] === '{' && input[i - 1] !== '{') {
                if (i > startIndex) {
                    output.push({ value: input.substring(startIndex, i), isInterpolation: false });
                }
                inInterpolation = true;
                startIndex = i + 1;
            } else if (input[i] === '}' && input[i - 1] !== '}') {
                if (inInterpolation) {
                    let key = input.substring(startIndex, i);
                    output.push({ value: key, isInterpolation: true });
                    inInterpolation = false;
                    startIndex = i + 1;
                }
            }
        }
    
        if (startIndex < input.length) {
            output.push({ value: input.substring(startIndex), isInterpolation: false });
        }
    
        return output;
}