function addStateChangeSubscriberToPrototype(this:any){
    if(this.constructor.prototype.effectStateChageSubscribers){
        return;
    }
    Object.defineProperty(this.constructor.prototype,'effectStateChageSubscribers',{
        enumerable:false,
        value:new Map()
    });
}

export function Effect(dependencies:string[]){
    return function<T,V extends Array<any>,R>(target:(this:T, ...args:any[])=>R, context:ClassMethodDecoratorContext){
        context.addInitializer(function(this:any){
            addStateChangeSubscriberToPrototype.call(this);
            dependencies.forEach(dependency=>{
                let subscriber = this.effectStateChageSubscribers.get(dependency);
                if(!subscriber){
                    subscriber = new Set();
                    this.effectStateChageSubscribers.set(dependency, subscriber);
                }
                subscriber.add(context.name);
            });
        });

        return function(this:T,...args:V):R{
            return target.call(this, ...args);
        }
    }
}