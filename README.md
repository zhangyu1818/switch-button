# switch button

a group of simple switch button

[demo](http://sbzy.me/switch-button)

## usage

`npm i -S switch-button`

*html*
```html
<button data-switch></button>
<!--default checked-->
<button data-switch data-checked></button>
<!--attach data-->
<button data-switch data-id="5cc560"></button>
```
*js*
```javascript
import SwitchButton from "switch-button"; // or use script tag

// find elements attribute has "data-switch"
const switches = new SwitchButton("switch", ["off", "on"], (checked, ele) => {
  // callback first param is button checked state
  // second param is button element
  console.log("element=>", ele);
  console.log(`checked=>${checked}`);
  
  // loading
  
  switches.setLoading(ele, true);
  setTimeout(() => {
    switches.setLoading(ele, false);
  }, 5000);
});

// toggle
const btn = document.querySelector('[data-id="5cc560"]');
switches.toggle(btn)

// destroy
switches.destroy();
```
