var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const eleToProxy = new WeakMap();
const proxyToRaw = new WeakMap();
const defaultLoadingHTML = `<svg viewBox="0 0 1024 1024" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg>`;
const defaultText = ['', ''];
const createProxy = (obj, handler) => {
    const filtered = { checked: obj.checked, disabled: obj.disabled, loading: obj.loading };
    return new Proxy(filtered, {
        set(target, key, value, receiver) {
            try {
                if (key === 'loading') {
                    handler.setLoading(value);
                }
                else if (key === 'checked') {
                    handler.setChecked(value);
                }
                else if (key === 'disabled') {
                    handler.setDisabled(value);
                }
            }
            catch (_a) {
                console.warn('switch status change error,is switch element still exist?');
            }
            return Reflect.set(target, key, value, receiver);
        },
    });
};
const internalClickEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentTarget } = event;
    const element = currentTarget;
    const proxyValue = eleToProxy.get(element);
    if (proxyValue) {
        const { checked, loading, disabled } = proxyValue;
        if (loading || disabled) {
            return;
        }
        const rawValue = proxyToRaw.get(proxyValue);
        const { onChange } = rawValue !== null && rawValue !== void 0 ? rawValue : {};
        const nextChecked = !checked;
        onChange === null || onChange === void 0 ? void 0 : onChange(nextChecked);
        proxyValue.checked = nextChecked;
    }
});
const extend = (options) => {
    const { prefixCls, role = 'switch', small } = options;
    const classWithPrefix = (className) => prefixCls ? `${prefixCls}-${className}` : className;
    const createSwitch = (element, values) => {
        var _a, _b, _c, _d;
        const buttonEle = element;
        const handleEle = document.createElement('div');
        const textEle = document.createElement('span');
        const loadingEle = document.createElement('span');
        buttonEle.className = classWithPrefix('switch');
        if (small) {
            buttonEle.classList.add(classWithPrefix('switch-small'));
        }
        handleEle.className = classWithPrefix('switch-handle');
        textEle.className = classWithPrefix('switch-inner');
        loadingEle.className = classWithPrefix('switch-loading-icon');
        loadingEle.innerHTML = defaultLoadingHTML;
        buttonEle.append(handleEle, textEle);
        const [uncheckedText, checkedText] = (_a = values === null || values === void 0 ? void 0 : values.text) !== null && _a !== void 0 ? _a : defaultText;
        const setText = (checked) => {
            textEle.innerText = checked ? checkedText : uncheckedText;
        };
        const setLoading = (loading) => {
            buttonEle.classList[loading ? 'add' : 'remove'](classWithPrefix(`switch-loading`));
            if (loading && !handleEle.contains(loadingEle)) {
                handleEle.appendChild(loadingEle);
            }
            else if (!loading && handleEle.contains(loadingEle)) {
                handleEle.removeChild(loadingEle);
            }
        };
        const setDisabled = (disabled) => {
            buttonEle.classList[disabled ? 'add' : 'remove'](classWithPrefix(`switch-disabled`));
        };
        const setChecked = (checked) => {
            buttonEle.classList[checked ? 'add' : 'remove'](classWithPrefix(`switch-checked`));
            setText(checked);
        };
        const defaultValues = {
            onChange: values === null || values === void 0 ? void 0 : values.onChange,
            checked: (_b = values === null || values === void 0 ? void 0 : values.checked) !== null && _b !== void 0 ? _b : false,
            disabled: (_c = values === null || values === void 0 ? void 0 : values.disabled) !== null && _c !== void 0 ? _c : false,
            loading: (_d = values === null || values === void 0 ? void 0 : values.loading) !== null && _d !== void 0 ? _d : false,
        };
        const proxyValues = createProxy(defaultValues, {
            setChecked,
            setDisabled,
            setLoading,
        });
        eleToProxy.set(buttonEle, proxyValues);
        proxyToRaw.set(proxyValues, defaultValues);
        // initial
        buttonEle.setAttribute('role', role);
        setChecked(defaultValues.checked);
        setLoading(defaultValues.loading);
        setDisabled(defaultValues.disabled);
        buttonEle.addEventListener('click', internalClickEvent);
        return proxyValues;
    };
    return createSwitch;
};
const deleteSwitch = (element) => {
    element.innerHTML = '';
    element.className = '';
    element.removeAttribute('role');
    element.removeEventListener('click', internalClickEvent);
    const proxyValues = eleToProxy.get(element);
    if (proxyValues) {
        eleToProxy.delete(element);
        const rawValues = proxyToRaw.get(proxyValues);
        if (rawValues) {
            proxyToRaw.delete(proxyValues);
        }
    }
};
const createSwitch = extend({});
export { extend, deleteSwitch };
export default createSwitch;
