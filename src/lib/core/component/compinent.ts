interface ComponentOptions{
    selector:string;
}

export function Component(options:ComponentOptions){
    return function<T extends {new(...args:any[]):{}}>(target:T, context:ClassDecoratorContext):T{
        return target;
    }
}