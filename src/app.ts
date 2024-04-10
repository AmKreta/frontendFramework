import { Component } from "./lib/core/component/component";
import { Effect} from "./lib/core/effect/effect";
import { State } from "./lib/core/state/state";

@Component({
    selector:"app-button",
    template:`<div id={click_count}>
        inner HTML
        <div>
            <p>{text}</p>
            <button onclick="{logValue}"> click to increment {click_count} </button>
        </div>
    </div>`
})
class Button{
   @State() 
   accessor click_count = 0;

   @Effect(['click_count'])
   update(){
    console.log('ran');
   }

   logValue(e:MouseEvent){
    console.log('')
   }
}


let c = new Button();

console.log(c);

(window as any).c = c;

