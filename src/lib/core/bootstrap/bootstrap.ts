export function Bootstrap(component:any){
    let c = new component();
    let root = c.mount();
    console.log(c);
    document.body.appendChild(root);
}