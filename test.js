import createSwitch, { deleteSwitch, extend } from './index';
describe('switch test', () => {
    let btn;
    beforeEach(() => {
        btn = document.createElement('button');
        document.body.appendChild(btn);
    });
    afterEach(() => {
        document.body.removeChild(btn);
    });
    test('create switch without error', () => {
        expect(() => createSwitch(btn)).not.toThrowError();
        expect(btn.classList.contains('switch')).toBeTruthy();
    });
    test('switch should support default value', () => {
        const defaultValues = {
            disabled: true,
            loading: true,
            checked: true,
        };
        const handle = createSwitch(btn, defaultValues);
        expect(handle).toEqual(defaultValues);
        expect(btn.classList.contains('switch-disabled')).toBeTruthy();
        expect(btn.classList.contains('switch-loading')).toBeTruthy();
        expect(btn.classList.contains('switch-checked')).toBeTruthy();
    });
    test('handle should be reactive', () => {
        const handle = createSwitch(btn);
        handle.checked = true;
        expect(btn.classList.contains('switch-checked')).toBeTruthy();
        handle.loading = true;
        expect(btn.classList.contains('switch-loading')).toBeTruthy();
        handle.disabled = true;
        expect(btn.classList.contains('switch-disabled')).toBeTruthy();
        handle.checked = false;
        expect(btn.classList.contains('switch-checked')).toBeFalsy();
        handle.loading = false;
        expect(btn.classList.contains('switch-loading')).toBeFalsy();
        handle.disabled = false;
        expect(btn.classList.contains('switch-disabled')).toBeFalsy();
    });
    test('switch should be clickable', () => {
        createSwitch(btn);
        btn.click();
        expect(btn.classList.contains('switch-checked')).toBeTruthy();
    });
    test('switch should call onChange when click', () => {
        const onChange = jest.fn();
        createSwitch(btn, {
            onChange,
        });
        btn.click();
        expect(onChange).toBeCalledWith(true);
        btn.click();
        expect(onChange).toBeCalledWith(false);
        expect(onChange).toBeCalledTimes(2);
    });
    test("switch can't click while loading or disabled", () => {
        const onChange = jest.fn();
        createSwitch(btn, {
            loading: true,
            disabled: true,
            onChange,
        });
        btn.click();
        expect(onChange).toBeCalledTimes(0);
    });
    test('switch can be delete', () => {
        createSwitch(btn);
        expect(() => deleteSwitch(btn)).not.toThrowError();
        expect(btn.innerHTML === '').toBeTruthy();
    });
    test("onChange shouldn't trigger after switch delete", () => {
        const onChange = jest.fn();
        createSwitch(btn, {
            onChange,
        });
        deleteSwitch(btn);
        btn.click();
        expect(onChange).toBeCalledTimes(0);
    });
    test("handle shouldn't take effect after switch delete", () => {
        const handle = createSwitch(btn);
        deleteSwitch(btn);
        handle.checked = true;
        expect(btn.classList.contains('switch-checked')).toBeFalsy();
    });
    test('switch with prefixCls', () => {
        extend({ prefixCls: 'ui' })(btn, { checked: true });
        expect(btn.classList.contains('ui-switch')).toBeTruthy();
        expect(btn.classList.contains('ui-switch-checked')).toBeTruthy();
        btn.click();
        expect(btn.classList.contains('ui-switch-checked')).toBeFalsy();
    });
    test('switch with custom role', () => {
        extend({ prefixCls: 'ui', role: 'switch button role' })(btn);
        expect(btn.getAttribute('role')).toEqual('switch button role');
    });
    test('switch has small size', () => {
        extend({ small: true })(btn);
        expect(btn.classList.contains('switch-small')).toBeTruthy();
    });
});
