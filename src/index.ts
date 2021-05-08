interface ExtendOptions {
  prefixCls?: string
  role?: string
  small?: boolean
}

export interface SwitchValues {
  disabled: boolean
  loading: boolean
  checked: boolean
  text?: [string, string]
  onChange?: (checked: boolean) => void
}

type ProxySwitchValues = Omit<SwitchValues, 'onChange'>
type SwitchValuesWithFlag = SwitchValues & { delete?: boolean }
interface InternalChangeHandler {
  setLoading: (loading: boolean) => void
  setDisabled: (disabled: boolean) => void
  setChecked: (checked: boolean) => void
}

const eleToProxy = new WeakMap<HTMLElement, ProxySwitchValues>()
const proxyToRaw = new WeakMap<ProxySwitchValues, SwitchValuesWithFlag>()

const defaultLoadingHTML = `<svg viewBox="0 0 1024 1024" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg>`
const defaultText = ['', '']

const createProxy = (obj: SwitchValuesWithFlag, handler: InternalChangeHandler) => {
  const filtered = { checked: obj.checked, disabled: obj.disabled, loading: obj.loading }
  return new Proxy(filtered, {
    set(target, key, value, receiver) {
      if (obj.delete) {
        return Reflect.set(target, key, value, receiver)
      }
      if (key === 'loading') {
        handler.setLoading(value)
      } else if (key === 'checked') {
        handler.setChecked(value)
      } else if (key === 'disabled') {
        handler.setDisabled(value)
      }
      return Reflect.set(target, key, value, receiver)
    },
  })
}

const internalClickEvent = async (event: MouseEvent) => {
  const { currentTarget } = event
  const element = currentTarget as HTMLElement
  const proxyValue = eleToProxy.get(element)
  if (proxyValue) {
    const { checked, loading, disabled } = proxyValue
    if (loading || disabled) {
      return
    }
    const rawValue = proxyToRaw.get(proxyValue)
    const { onChange } = rawValue ?? {}

    const nextChecked = !checked
    onChange?.(nextChecked)
    proxyValue.checked = nextChecked
  }
}

const extend = (options: ExtendOptions) => {
  const { prefixCls, role = 'switch', small } = options

  const classWithPrefix = (className: string) =>
    prefixCls ? `${prefixCls}-${className}` : className

  const createSwitch = <T extends HTMLElement>(element: T, values?: Partial<SwitchValues>) => {
    const buttonEle = element
    const handleEle = document.createElement('div')
    const textEle = document.createElement('span')
    const loadingEle = document.createElement('span')

    buttonEle.className = classWithPrefix('switch')
    if (small) {
      buttonEle.classList.add(classWithPrefix('switch-small'))
    }
    handleEle.className = classWithPrefix('switch-handle')
    textEle.className = classWithPrefix('switch-inner')
    loadingEle.className = classWithPrefix('switch-loading-icon')

    loadingEle.innerHTML = defaultLoadingHTML

    buttonEle.append(handleEle, textEle)

    const [uncheckedText, checkedText] = values?.text ?? defaultText

    const setText = (checked: boolean) => {
      textEle.innerText = checked ? checkedText : uncheckedText
    }

    const setLoading = (loading: boolean) => {
      buttonEle.classList[loading ? 'add' : 'remove'](classWithPrefix(`switch-loading`))
      if (loading && !handleEle.contains(loadingEle)) {
        handleEle.appendChild(loadingEle)
      } else if (!loading && handleEle.contains(loadingEle)) {
        handleEle.removeChild(loadingEle)
      }
    }

    const setDisabled = (disabled: boolean) => {
      buttonEle.classList[disabled ? 'add' : 'remove'](classWithPrefix(`switch-disabled`))
    }

    const setChecked = (checked: boolean) => {
      buttonEle.classList[checked ? 'add' : 'remove'](classWithPrefix(`switch-checked`))
      setText(checked)
    }

    const defaultValues: SwitchValues = {
      onChange: values?.onChange,
      checked: values?.checked ?? false,
      disabled: values?.disabled ?? false,
      loading: values?.loading ?? false,
    }

    const proxyValues = createProxy(defaultValues, {
      setChecked,
      setDisabled,
      setLoading,
    })

    eleToProxy.set(buttonEle, proxyValues)
    proxyToRaw.set(proxyValues, defaultValues)

    // initial
    buttonEle.setAttribute('role', role)
    setChecked(defaultValues.checked)
    setLoading(defaultValues.loading)
    setDisabled(defaultValues.disabled)

    buttonEle.addEventListener('click', internalClickEvent)

    return proxyValues
  }
  return createSwitch
}

const deleteSwitch = <T extends HTMLElement>(element: HTMLElement) => {
  element.innerHTML = ''
  element.className = ''
  element.removeAttribute('role')
  element.removeEventListener('click', internalClickEvent)

  const proxyValues = eleToProxy.get(element)
  if (proxyValues) {
    eleToProxy.delete(element)
    const rawValues = proxyToRaw.get(proxyValues)
    if (rawValues) {
      rawValues.delete = true
      proxyToRaw.delete(proxyValues)
    }
  }
}

const createSwitch = extend({})

export { extend, deleteSwitch }

export default createSwitch
