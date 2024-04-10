export function Bootstrap(component:any){
    let c = new component();
    let root = c.mount();
    document.body.appendChild(root);
}