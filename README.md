# switch-button 
![npm-version](https://img.shields.io/npm/v/switch-button.svg)
[![codecov](https://codecov.io/gh/zhangyu1818/switch-button/branch/main/graph/badge.svg?token=XMOY7SVSJ4)](https://codecov.io/gh/zhangyu1818/switch-button)

Ant Design style and reactivity switch button, it can use anywhere, no framework limit.

[preview](https://zhangyu1818.github.io/switch-button/)

## installation

```bash
yarn add switch-button
```

```bash
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
the switch button is reactivity, if you change the status value, the view will automatically change.

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

