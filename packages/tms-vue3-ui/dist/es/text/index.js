import { createVNode } from "vue";
function install(app) {
  app.component("tms-text", {
    props: {
      lines: {
        type: Number
      },
      linesSm: {
        type: Number
      }
    },
    render() {
      var _a;
      let slots = this.$slots;
      let classes = ["tms-text"];
      if (typeof this.lines === "number" && this.lines > 0)
        classes.push(`tms-text_lines_${this.lines}`);
      if (typeof this.linesSm === "number" && this.linesSm > 0)
        classes.push(`tms-text_lines-sm_${this.linesSm}`);
      return createVNode("div", {
        class: classes
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    }
  });
}
export { install as default };
