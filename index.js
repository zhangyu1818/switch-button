var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
};

// node_modules/dynamic-stylesheet/dist/index.js
var require_dist = __commonJS({
  "node_modules/dynamic-stylesheet/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.updateCSS = exports.injectCSS = void 0;
    var MARK_KEY = "INJECT_CSS_KEY";
    function getContainer(option) {
      if (option.attachTo) {
        return option.attachTo;
      }
      const head = document.querySelector("head");
      return head || document.body;
    }
    function injectCSS(css, option = {}) {
      const styleNode = document.createElement("style");
      styleNode.innerHTML = css;
      const container = getContainer(option);
      container.appendChild(styleNode);
      return styleNode;
    }
    exports.injectCSS = injectCSS;
    function updateCSS(css, key, option = {}) {
      const container = getContainer(option);
      const existNode = Array.from(container.children).find((node) => node.tagName === "STYLE" && node[MARK_KEY] === key);
      if (existNode) {
        if (existNode.innerHTML !== css) {
          existNode.innerHTML = css;
        }
        return existNode;
      }
      const newNode = injectCSS(css, option);
      newNode[MARK_KEY] = key;
      return newNode;
    }
    exports.updateCSS = updateCSS;
  }
});

// node_modules/wave-effect/dist/wave.js
var require_wave = __commonJS({
  "node_modules/wave-effect/dist/wave.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.clearEffect = void 0;
    var dynamic_stylesheet_1 = require_dist();
    var styleForPseudo;
    var isHiddenElement = (element) => {
      if (false) {
        return false;
      }
      return !element.offsetParent || element.hidden;
    };
    function isNotGrey(color) {
      const match = (color || "").match(/rgba?\((\d*), (\d*), (\d*)(, [\d.]*)?\)/);
      if (match && match[1] && match[2] && match[3]) {
        return !(match[1] === match[2] && match[2] === match[3]);
      }
      return true;
    }
    var isValidColor = (color) => {
      return color && color !== "#ffffff" && color !== `rgb(255,255,255)` && isNotGrey(color) && !/rgba\((?:\d*, ){3}0\)/.test(color) && color !== "transparent";
    };
    var getWaveColor = (element) => {
      return getComputedStyle(element).getPropertyValue("border-color") || getComputedStyle(element).getPropertyValue("background-color");
    };
    var cancelWaveMap = new WeakMap();
    var wave2 = (element, options = {}) => {
      const {waveColor: optionWaveColor, disabledClass = []} = options;
      if (!element) {
        console.warn("wave element is invalidate");
        return;
      }
      let timeoutId;
      const shouldFilter = () => disabledClass.some((name) => element.className.includes(name));
      const triggerWave = (element2, waveColor) => {
        if (!element2 || isHiddenElement(element2) || shouldFilter()) {
          return;
        }
        element2.setAttribute("wave-click-animating", "true");
        if (isValidColor(waveColor)) {
          const cssText = `
        [wave-click-animating='true']::after {
          --wave-shadow-color: ${waveColor};
        }
      `;
          styleForPseudo = dynamic_stylesheet_1.updateCSS(cssText, "wave-animate", {attachTo: document.body});
          element2.addEventListener(`animationend`, onWaveEnd);
        }
      };
      const onWaveEnd = (event) => {
        if (!event || event.animationName !== "fadeEffect") {
          return;
        }
        resetEffect();
      };
      const resetEffect = () => {
        element.setAttribute("wave-click-animating", "false");
        if (styleForPseudo) {
          styleForPseudo.innerHTML = "";
        }
        element.removeEventListener(`animationend`, onWaveEnd);
      };
      const internalOnClick = (event) => {
        const {target} = event;
        if (isHiddenElement(target)) {
          return;
        }
        resetEffect();
        const waveColor = getWaveColor(element);
        timeoutId = window.setTimeout(() => triggerWave(element, optionWaveColor !== null && optionWaveColor !== void 0 ? optionWaveColor : waveColor), 0);
      };
      element.addEventListener("click", internalOnClick, true);
      cancelWaveMap.set(element, () => {
        cancelWaveMap.delete(element);
        window.clearTimeout(timeoutId);
        element.removeEventListener("click", internalOnClick, true);
      });
    };
    var clearEffect2 = (element) => {
      const clear = cancelWaveMap.get(element);
      clear === null || clear === void 0 ? void 0 : clear();
    };
    exports.clearEffect = clearEffect2;
    exports.default = wave2;
  }
});

// src/index.ts
var import_wave_effect = __toModule(require_wave());
var eleToProxy = new WeakMap();
var proxyToRaw = new WeakMap();
var defaultLoadingHTML = `<svg viewBox="0 0 1024 1024" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg>`;
var defaultText = ["", ""];
var createProxy = (obj, handler) => {
  const filtered = {checked: obj.checked, disabled: obj.disabled, loading: obj.loading};
  return new Proxy(filtered, {
    set(target, key, value, receiver) {
      if (obj.delete) {
        return Reflect.set(target, key, value, receiver);
      }
      if (key === "loading") {
        handler.setLoading(value);
      } else if (key === "checked") {
        handler.setChecked(value);
      } else if (key === "disabled") {
        handler.setDisabled(value);
      }
      return Reflect.set(target, key, value, receiver);
    }
  });
};
var internalClickEvent = async (event) => {
  const {currentTarget} = event;
  const element = currentTarget;
  const proxyValue = eleToProxy.get(element);
  if (proxyValue) {
    const {checked, loading, disabled} = proxyValue;
    if (loading || disabled) {
      return;
    }
    const rawValue = proxyToRaw.get(proxyValue);
    const {onChange} = rawValue ?? {};
    const nextChecked = !checked;
    onChange?.(nextChecked);
    proxyValue.checked = nextChecked;
  }
};
var extend = (options) => {
  const {prefixCls, role = "switch", small} = options;
  const classWithPrefix = (className) => prefixCls ? `${prefixCls}-${className}` : className;
  const createSwitch2 = (element, values) => {
    const buttonEle = element;
    buttonEle.innerHTML = "";
    const handleEle = document.createElement("div");
    const textEle = document.createElement("span");
    const loadingEle = document.createElement("span");
    buttonEle.classList.add(classWithPrefix("switch"));
    if (small) {
      buttonEle.classList.add(classWithPrefix("switch-small"));
    }
    handleEle.className = classWithPrefix("switch-handle");
    textEle.className = classWithPrefix("switch-inner");
    loadingEle.className = classWithPrefix("switch-loading-icon");
    loadingEle.innerHTML = defaultLoadingHTML;
    buttonEle.append(handleEle, textEle);
    const [uncheckedText, checkedText] = values?.text ?? defaultText;
    const setText = (checked) => {
      textEle.innerText = checked ? checkedText : uncheckedText;
    };
    const setLoading = (loading) => {
      buttonEle.classList[loading ? "add" : "remove"](classWithPrefix(`switch-loading`));
      if (loading && !handleEle.contains(loadingEle)) {
        handleEle.appendChild(loadingEle);
      } else if (!loading && handleEle.contains(loadingEle)) {
        handleEle.removeChild(loadingEle);
      }
    };
    const setDisabled = (disabled) => {
      buttonEle.classList[disabled ? "add" : "remove"](classWithPrefix(`switch-disabled`));
    };
    const setChecked = (checked) => {
      buttonEle.classList[checked ? "add" : "remove"](classWithPrefix(`switch-checked`));
      setText(checked);
    };
    const defaultValues = {
      onChange: values?.onChange,
      checked: values?.checked ?? false,
      disabled: values?.disabled ?? false,
      loading: values?.loading ?? false
    };
    const proxyValues = createProxy(defaultValues, {
      setChecked,
      setDisabled,
      setLoading
    });
    eleToProxy.set(buttonEle, proxyValues);
    proxyToRaw.set(proxyValues, defaultValues);
    buttonEle.setAttribute("role", role);
    setChecked(defaultValues.checked);
    setLoading(defaultValues.loading);
    setDisabled(defaultValues.disabled);
    buttonEle.addEventListener("click", internalClickEvent);
    (0, import_wave_effect.default)(buttonEle, {
      disabledClass: ["loading", "disabled"]
    });
    return proxyValues;
  };
  return createSwitch2;
};
var deleteSwitch = (element) => {
  (0, import_wave_effect.clearEffect)(element);
  element.innerHTML = "";
  element.className = "";
  element.removeAttribute("role");
  element.removeEventListener("click", internalClickEvent);
  const proxyValues = eleToProxy.get(element);
  if (proxyValues) {
    eleToProxy.delete(element);
    const rawValues = proxyToRaw.get(proxyValues);
    if (rawValues) {
      rawValues.delete = true;
      proxyToRaw.delete(proxyValues);
    }
  }
};
var createSwitch = extend({});
var src_default = createSwitch;
export {
  src_default as default,
  deleteSwitch,
  extend
};
