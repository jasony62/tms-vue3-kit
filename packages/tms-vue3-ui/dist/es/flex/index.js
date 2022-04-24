import { h } from "vue";
function addStyleClass(obj, prop, styleClass) {
  if (obj[prop] === void 0) {
    obj[prop] = [styleClass];
  } else if (Array.isArray(obj[prop])) {
    if (!obj[prop].includes(styleClass))
      obj[prop].push(styleClass);
  } else if (typeof obj[prop] === "object") {
    obj[prop][styleClass] = true;
  } else if (typeof obj[prop] === "string") {
    let regx = new RegExp(styleClass);
    if (!regx.test(obj[prop]))
      obj[prop] += ` ${styleClass}`;
  }
  return obj;
}
function install(app) {
  app.component("tms-flex", {
    props: {
      direction: { type: String, default: "row" },
      alignItems: { type: String },
      elasticItems: { type: Array },
      gap: { type: Number, default: 2 }
    },
    render() {
      var _a, _b;
      let classes = ["tms-flex"];
      classes.push(this.direction === "column" ? "tms-flex_column" : this.direction === "row-reverse" ? "tms-flex_row-reverse" : "tms-flex_row");
      classes.push(`tms-flex_gap_${this.gap}`);
      const alignItems = this.alignItems ? this.alignItems : this.direction === "column" ? "stretch" : "flex-start";
      let items = (_b = (_a = this.$slots).default) == null ? void 0 : _b.call(_a);
      if (items && items.length) {
        let items2 = items.map((item, index) => {
          addStyleClass(item, "class", "tms-flex__item");
          if (this.elasticItems && this.elasticItems.length && this.elasticItems.includes(index)) {
            addStyleClass(item, "class", "tms-flex__item_elastic");
          }
          return h(item, { class: item.class });
        });
        return h("div", { class: classes, style: { alignItems } }, items2);
      } else {
        return h("div", { class: classes, style: { alignItems } }, items);
      }
    }
  });
}
export { install as default };
