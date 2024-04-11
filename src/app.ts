import { Bootstrap } from "./lib/core/bootstrap/bootstrap";
import { Component } from "./lib/core/component/component";
import { Effect} from "./lib/core/effect/effect";
import { State } from "./lib/core/state/state";

@Component({
    selector:"app-button",
    template:`<div id={click_count}>
        <span>inner HTML</span>
        <div>
            <p>{text}</p>
            <button onclick={logValue}> click to increment click_count {click_count}</button>
        </div>
        <div style="margin-top:16px;">twice_click_count is getting calculated in a effect {twiceClickCount}</div>
    </div>`
})
class Button{
   @State() 
   accessor click_count = 0;

   @State()
   accessor twiceClickCount = 0;

   @State()
   accessor text = "this is a text";

   @Effect(['click_count'])
   update(){
    this.twiceClickCount = this.click_count*2;
   }

   logValue(e:MouseEvent){
    console.log(this.click_count);
    this.click_count++;
   }
}

Bootstrap(Button);

