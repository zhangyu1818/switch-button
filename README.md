# switch-button

Ant Design style switch button, it can use everywhere, no framework limit.

## installation

```shell
    yarn add switch-button
    // or
    npm install switch-button
```

## usage

```javascript
/**
 * HTML
 *  <button></button>
 */
import createSwitch,{ deleteSwitch } from 'switch-button'
import 'switch-button/dist/index.css'

const ele = document.querySelector('button')

const switchBtn = createSwitch(ele, {
  onChange: (checked) => {
    console.log('checked', checked)
  },
})

// change status will update view
switchBtn.checked = true
switchBtn.loading = true
switchBtn.disabled = true

// delete switch button
deleteSwitch(ele)
```

## advanced

**custom text**

```javascript
const switchBtn = createSwitch(ele, {
  text: ['off', 'on'],
})
```

**default value**

```javascript
const switchBtn = createSwitch(ele, {
  loading:true,
  checked:true
})
```

**extend**

```javascript
import { extend } from 'switch-button'

const createSwitch = extend({ 
  // all class name will start with this => 'ui-switch','ui-switch-checked' ...
  prefixCls: 'ui',  
  // button role
  role: 'switch button', 
  // create small size switch button
  small: true 
})
```

