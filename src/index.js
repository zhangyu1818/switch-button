import styles from "./styles.scss";

const noop = () => {};

class Switch {
  switchValue;
  checkedValue;

  template = (defaultValue, id) => `
        <button type="button" class="${styles.switch}" data-${id}>
            <span class="${styles["switch-inner"]}">${defaultValue}</span>
        </button>`;

  loadingTemplate = `
        <svg viewBox="0 0 1024 1024" class="${
          styles["switch-spin"]
        }" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
        </svg>`;

  constructor(identifier, values, onChange = noop) {
    const switchesEle = document.querySelectorAll(`[data-${identifier}]`);
    this.identifier = identifier;
    [this.switchValue, this.checkedValue] = values;
    this.onChange = onChange;
    switchesEle.forEach(ele => {
      ele.outerHTML = this.template(this.switchValue, identifier);
    });
    this.switchesEle = [...document.querySelectorAll(`[data-${identifier}]`)];
    window.addEventListener("click", this.onClickSwitch);
  }

  onClickSwitch = ({ target }) => {
    const buttonEle = this.findNode(target);
    if (buttonEle && !buttonEle.classList.contains(styles["switch-disable"])) {
      buttonEle.classList.toggle(styles.checked);
      const inner = buttonEle.querySelector("span");
      if (buttonEle.classList.contains(styles.checked)) {
        inner.innerText = this.checkedValue;
        this.onChange(true, buttonEle);
      } else {
        inner.innerText = this.switchValue;
        this.onChange(false, buttonEle);
      }
    }
  };

  setLoading = (ele, state) => {
    if (this.switchesEle.includes(ele)) {
      if (state) {
        ele.classList.add(styles["switch-disable"]);
        const loadingEle = document.createElement("i");
        loadingEle.className = styles["switch-loading-icon"];
        loadingEle.innerHTML = this.loadingTemplate;
        ele.appendChild(loadingEle);
      } else {
        const loadingEle = ele.querySelector(
          `.${styles["switch-loading-icon"]}`
        );
        ele.removeChild(loadingEle);
        ele.classList.remove(styles["switch-disable"]);
      }
    }
  };

  findNode = node => {
    let currentDeep = 0;
    const finder = node => {
      if (++currentDeep > 2) return false;
      if (
        node.nodeName === "BUTTON" &&
        node.classList.contains(styles.switch) &&
        node.dataset[this.identifier] !== undefined
      )
        return node;
      return finder(node.parentNode);
    };
    return finder(node);
  };
  destroy = () => {
    window.removeEventListener("click", this.onClickSwitch);
    this.switchesEle.forEach(ele => (ele.outerHTML = ""));
  };
}

export default Switch;
