# switch button

[demo](http://sbzy.me/switch-button)

## usage

`npm i -S switch-button`

```html
<button type="button" data-switch></button>
```

```javascript
import SwitchButton from "switch-button";

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
```
