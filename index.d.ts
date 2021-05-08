interface ExtendOptions {
    prefixCls?: string;
    role?: string;
    small?: boolean;
}
export interface SwitchValues {
    disabled: boolean;
    loading: boolean;
    checked: boolean;
    text?: [string, string];
    onChange?: (checked: boolean) => void;
}
declare const extend: (options: ExtendOptions) => <T extends HTMLElement>(element: T, values?: Partial<SwitchValues> | undefined) => {
    checked: boolean;
    disabled: boolean;
    loading: boolean;
};
declare const deleteSwitch: <T extends HTMLElement>(element: HTMLElement) => void;
declare const createSwitch: <T extends HTMLElement>(element: T, values?: Partial<SwitchValues> | undefined) => {
    checked: boolean;
    disabled: boolean;
    loading: boolean;
};
export { extend, deleteSwitch };
export default createSwitch;
