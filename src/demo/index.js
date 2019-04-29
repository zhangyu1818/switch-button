import Switch from "../index";

const switches = new Switch("switch", ["off", "on"], (checked, ele) => {
  console.log("element=>", ele);
  console.log(`checked=>${checked}`);
  switches.setLoading(ele, true);
  setTimeout(() => {
    switches.setLoading(ele, false);
  }, 5000);
});
new Switch("switch1", ["关", "开"], (checked, ele) => {
  console.log("element=>", ele);
  console.log(`checked=>${checked}`);
});
new Switch("switch2", ["×", "✓"], (checked, ele) => {
  console.log("element=>", ele);
  console.log(`checked=>${checked}`);
});
