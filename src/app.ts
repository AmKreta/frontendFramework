import { Component } from "./lib/core/component/compinent";
import { Effect} from "./lib/core/effect/effect";
import { State } from "./lib/core/state/state";

@Component({
    selector:"app-button"
})
class Button{
   @State() 
   accessor click_count = 0;

   @Effect(['click_count'])
   update(){
    console.log('ran');
   }

   render(){
    return `<div id={click_count}>
            <p>{text}</>
            <button> click to increment {click_count} </button>
        </div>`;
   }

}


let c = new Button();

console.log(c);

(window as any).c = c;

