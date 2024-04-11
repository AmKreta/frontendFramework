export function State(){
    return function<T,V>(
        accessor:{get:(this:T)=>V, set:(this:T, v:V)=>void}, 
        context:ClassAccessorDecoratorContext<T,V>
    ){
        context.addInitializer(function(this:any){
            if(!this.__proto__.states){
                this.__proto__.states = new Set();
            }
            this.__proto__.states.add(context.name);
        });

        return {
            get(this:T){
                return accessor.get.call(this);
            },
            set(this:T, val:V){
                accessor.set.call(this, val);
                let effectSubscribers:any = (this as any).effectStateChageSubscribers.get(context.name);
                effectSubscribers?.forEach((name:any)=>{
                    (this as any)[name]();
                });
                let propertySubscribers = (this as any).propertyChangeSubscribers.get(context.name);
                propertySubscribers?.forEach((subscriber:any)=>{
                    subscriber();
                })
            }
        };
    }
}