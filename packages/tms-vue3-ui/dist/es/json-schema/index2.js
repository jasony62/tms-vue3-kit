var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { resolveComponent, openBlock, createElementBlock, createVNode, withCtx, createBlock, Fragment, renderList, createCommentVNode, resolveDynamicComponent, normalizeProps, guardReactiveProps, renderSlot, createElementVNode, toDisplayString, h, createTextVNode } from "vue";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {
  name: "file",
  props: ["accept", "size", "limit"],
  defaultFormatAttrs() {
    return { accept: "", size: null, limit: null };
  },
  data() {
    let { accept: fileAccept, size: fileSize, limit: fileLimit } = this;
    return {
      fileAccept,
      fileSize,
      fileLimit
    };
  },
  watch: {
    fileAccept: function(newValue) {
      this.$emit("update:accept", newValue);
    },
    fileSize: function(newValue) {
      this.$emit("update:size", newValue);
    },
    fileLimit: function(newValue) {
      this.$emit("update:limit", parseInt(newValue));
    }
  }
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_tvu_input = resolveComponent("tvu-input");
  const _component_tvu_form_item = resolveComponent("tvu-form-item");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_tvu_form_item, { label: "\u6587\u4EF6\u7C7B\u578B" }, {
      default: withCtx(() => [
        createVNode(_component_tvu_input, {
          modelValue: $data.fileAccept,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.fileAccept = $event),
          placeholder: "\u6807\u51C6\u683C\u5F0F\uFF0C\u5982'png,jpeg'"
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    createVNode(_component_tvu_form_item, { label: "\u6587\u4EF6\u6700\u5927" }, {
      default: withCtx(() => [
        createVNode(_component_tvu_input, {
          modelValue: $data.fileSize,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.fileSize = $event),
          modelModifiers: { number: true },
          placeholder: "\u8BF7\u8F93\u5165\u6570\u5B57\uFF0C\u9ED8\u8BA4\u4EE5MB\u4E3A\u5355\u4F4D"
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    }),
    createVNode(_component_tvu_form_item, { label: "\u6587\u4EF6\u4E2A\u6570" }, {
      default: withCtx(() => [
        createVNode(_component_tvu_input, {
          modelValue: $data.fileLimit,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.fileLimit = $event),
          modelModifiers: { number: true },
          placeholder: "\u8BF7\u8F93\u5165\u6570\u5B57\uFF0C0\u65E0\u610F\u4E49"
        }, null, 8, ["modelValue"])
      ]),
      _: 1
    })
  ]);
}
var File = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const Group = () => import("./Group.js");
const DlgComponent$2 = {
  props: {
    properties: { type: Object }
  },
  components: {
    "tab-component": Group
  },
  data() {
    return {
      visible: true,
      property: "file",
      rules: [],
      dependencyRules: {},
      operator: "and",
      editableTabsValue: "1",
      editableTabs: [],
      tabIndex: 0,
      activeTag: "",
      newTabName: ""
    };
  },
  methods: {
    addTab() {
      const newTabName = ++this.tabIndex + "";
      this.newTabName = newTabName;
      this.editableTabs.push({
        title: "group",
        name: newTabName
      });
      this.editableTabsValue = newTabName;
      this.$set(this.dependencyRules, newTabName, {
        rules: [],
        operator: "and"
      });
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      delete this.dependencyRules[targetName];
    },
    onCancel() {
      this.$emit("cancel");
    },
    onClose() {
      this.$emit("close");
    },
    showAsDialog(schema, property, config) {
      let { dependencyRules, operator } = config || {};
      this.properties = schema.properties;
      this.property = property;
      if (dependencyRules && typeof dependencyRules === "object") {
        this.tabIndex = Object.keys(dependencyRules).length;
        Object.keys(dependencyRules).forEach((item, i) => {
          console.log("showAsDialog", dependencyRules[item], item, i);
          this.$set(this.dependencyRules, i + 1 + "", dependencyRules[item]);
          this.editableTabs.push({
            title: "group",
            name: i + 1 + ""
          });
        });
        this.editableTabsValue = "1";
      }
      this.operator = /and|or/.test(operator) ? operator : "and";
      this.$mount();
      document.body.appendChild(this.$el);
      return new Promise((resolve) => {
        this.$once("close", () => {
          this.visible = false;
          document.body.removeChild(this.$el);
          resolve({
            property: this.property,
            dependencyRules: this.dependencyRules,
            operator: this.operator
          });
        });
        this.$once("cancel", () => {
          this.visible = false;
          document.body.removeChild(this.$el);
          resolve(false);
        });
      });
    }
  }
};
function showAsDialog(schema, property, dependencyRules) {
  let dialog = new Vue(DlgComponent$2);
  return dialog.showAsDialog(schema, property, dependencyRules);
}
const DlgComponent$1 = {
  data() {
    return {
      visible: true,
      activeL0Pane: "group",
      activeName: "",
      enumGroups: [],
      enums: [],
      property: "",
      enumShowKeys: [],
      enumShowValues: []
    };
  },
  methods: {
    addTab() {
      let id = `g${new Date().getTime()}`;
      this.enumGroups.push({
        id,
        label: "\u65B0\u5206\u7EC4",
        assocEnum: { property: "", value: "" }
      });
      this.activeName = this.enumGroups.length - 1 + "";
      this.enumShowValue = "";
    },
    shiftTab(vm) {
      let enumShowValues = this.enumShowKeys.filter((item) => {
        if (item.key) {
          return item.key === this.enumGroups[vm.index].assocEnum.property;
        }
      });
      this.enumShowValues = enumShowValues[0] ? enumShowValues[0].schema.enum : [];
    },
    removeTab(targetName) {
      let id = this.enumGroups[targetName].id;
      let targetIndex = this.enums.findIndex((item) => {
        return item.group === id;
      });
      if (targetIndex >= 0) {
        this.enums[targetIndex].group = "";
      }
      this.enumGroups.splice(targetName, 1);
      this.activeName = this.enumGroups.length - 1 + "";
    },
    onSelectProperty(key) {
      if (key) {
        let enumShowValues = this.enumShowKeys.filter((item) => {
          if (item.key) {
            return item.key === key;
          }
        });
        this.enumShowValues = enumShowValues[0].schema.enum;
        this.enumGroups[this.activeName].assocEnum.value = "";
      }
    },
    onClearGroup(index) {
      this.enums[index].group = "";
    },
    onCancel() {
      this.$emit("cancel");
    },
    onClose() {
      this.$emit("close");
    },
    initEnumShow(allProperties) {
      let enumShowKeys = allProperties.filter((item) => {
        return item.key !== this.property && typeof item.schema.enum === "object" && item.schema.type === "string";
      });
      enumShowKeys.unshift({ key: "", label: "\u65E0" });
      this.enumShowKeys = enumShowKeys;
      let enumShowValues = this.enumShowKeys.filter((item) => {
        if (item.key && this.enumGroups[0]) {
          return item.key === this.enumGroups[0].assocEnum.property;
        }
      });
      this.enumShowValues = enumShowValues[0] ? enumShowValues[0].schema.enum : [];
    },
    showAsEnumDialog(schema, property, allProperties) {
      const clone_schema = JSON.parse(JSON.stringify(schema));
      this.enumGroups = clone_schema.enumGroups;
      this.enums = clone_schema.enum;
      this.property = property;
      this.initEnumShow(allProperties);
      this.$mount();
      document.body.appendChild(this.$el);
      return new Promise((resolve) => {
        this.$once("close", () => {
          this.visible = false;
          document.body.removeChild(this.$el);
          resolve({
            enumGroups: this.enumGroups,
            enum: this.enums
          });
        });
        this.$once("cancel", () => {
          this.visible = false;
          document.body.removeChild(this.$el);
          resolve(false);
        });
      });
    }
  }
};
function showAsEnumDialog(schema, key, allProperties) {
  let dialog = new Vue(DlgComponent$1);
  return dialog.showAsEnumDialog(schema, key, allProperties);
}
const DlgComponent = {
  props: {
    properties: { type: Object }
  },
  data() {
    return {
      visible: true,
      property: "file",
      rule: {},
      options: [
        {
          value: "v1",
          label: "\u4F5C\u4E3A\u586B\u5165\u503C"
        },
        {
          value: "v2",
          label: "\u4F5C\u4E3A\u53EF\u9009\u9879"
        }
      ]
    };
  },
  computed: {
    signleProperties() {
      let result = {};
      for (let [key, value] of Object.entries(this.properties)) {
        if (value.type === "string" && value.hasOwnProperty("enum")) {
          result[key] = value;
        }
      }
      return result;
    }
  },
  methods: {
    onCancel() {
      this.$emit("cancel");
    },
    onClose() {
      this.$emit("close");
    },
    showAsEventDialog(schema, property, config) {
      let { rule } = config || {};
      this.properties = schema.properties;
      this.property = property;
      if (rule && typeof rule === "object")
        for (let property2 in rule) {
          this.$set(this.rule, property2, rule[property2]);
        }
      this.$mount();
      document.body.appendChild(this.$el);
      return new Promise((resolve) => {
        this.$once("close", () => {
          this.visible = false;
          document.body.removeChild(this.$el);
          resolve({
            property: this.property,
            rule: this.rule
          });
        });
        this.$once("cancel", () => {
          this.visible = false;
          document.body.removeChild(this.$el);
          resolve(false);
        });
      });
    }
  }
};
function showAsEventDialog(schema, property, rule) {
  let dialog = new Vue(DlgComponent);
  return dialog.showAsEventDialog(schema, property, rule);
}
class SchemaWrap {
  constructor(key, schema, parent) {
    this.key = key;
    this.label = key;
    this.schema = schema;
    this.parent = parent;
  }
  appendChild(child) {
    this.children.push(child);
    this.schema.type === "object" ? Vue.set(this.schema.properties, child.key, child.schema) : Vue.set(this.schema, child.key, child.schema);
    child.parent = this;
  }
}
SchemaWrap.build = function(key, schema, parent) {
  let wrap = new SchemaWrap(key, schema, parent);
  switch (schema.type) {
    case "object":
      if (typeof schema.properties === "object") {
        wrap.children = Object.entries(schema.properties).map(([k, s]) => {
          return SchemaWrap.build(k, s, wrap);
        });
      }
      break;
    case "array":
      if (typeof schema.items === "object") {
        wrap.children = Object.entries(schema).filter(([k]) => k === "items").map(([k, s]) => SchemaWrap.build(k, s, wrap));
      }
      break;
  }
  return wrap;
};
class FormData {
  constructor() {
    this.reset();
  }
  reset() {
    this.key = "";
    this.schema = {
      title: "",
      type: "string",
      description: "",
      required: false,
      groupable: false,
      properties: {}
    };
    this.node = null;
  }
}
const Type2Format = {
  string: [
    { value: "name", label: "\u59D3\u540D" },
    { value: "email", label: "\u90AE\u7BB1" },
    { value: "mobile", label: "\u624B\u673A" },
    { value: "dateTime", label: "\u65E5\u671F\u65F6\u95F4" }
  ],
  object: [
    { value: "file", label: "\u6587\u4EF6" },
    { value: "image", label: "\u56FE\u7247" },
    { value: "url", label: "\u94FE\u63A5" },
    { value: "score", label: "\u6253\u5206" }
  ]
};
const Format2Comp = {
  file: File
};
const components = {
  tabs: {
    render() {
      var _a, _b;
      return h("div", {}, (_b = (_a = this.$slots).default) == null ? void 0 : _b.call(_a));
    }
  },
  tabPane: {
    render() {
      var _a, _b;
      return h("div", {}, (_b = (_a = this.$slots).default) == null ? void 0 : _b.call(_a));
    }
  },
  tree: {
    render() {
      var _a, _b;
      return h("div", {}, (_b = (_a = this.$slots).default) == null ? void 0 : _b.call(_a));
    }
  }
};
const _sfc_main = {
  name: "tms-json-schema",
  components: {
    "tvu-tabs": __spreadValues({}, components.tabs),
    "tvu-tab-pane": __spreadValues({}, components.tabPane),
    "tvu-tree": __spreadValues({}, components.tree)
  },
  props: { schema: Object, extendSchema: Function, onUpload: Function },
  data() {
    return {
      activeL0Pane: "properties",
      activeL1Pane: "dependencies",
      form: new FormData(),
      data: [],
      isParentArray: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      jsonString: ""
    };
  },
  computed: {
    compFormatAttrs() {
      const format = this.form.schema.format;
      switch (format) {
        case "file":
          return File;
      }
      return null;
    },
    formats() {
      const type = this.form.schema.type;
      return Type2Format[type] ? [{ value: void 0, label: "\u65E0" }].concat(Type2Format[type]) : null;
    }
  },
  watch: {
    schema: {
      handler: function(val) {
        this.jsonString = typeof val === "object" ? JSON.stringify(val) : "{}";
      },
      deep: true,
      immediate: true
    },
    "form.schema.format": {
      handler: function(val) {
        if (Format2Comp[val] && typeof Format2Comp[val].defaultFormatAttrs === "function") {
          if (!this.form.schema.formatAttrs) {
            this.form.schema.formatAttrs = Format2Comp[val].defaultFormatAttrs();
          }
        }
      },
      immediate: true
    },
    "form.schema.type": {
      handler: function() {
        if (this.form.schema.default) {
          return this.form.schema.default;
        }
        this.form.schema.default = this.form.schema.type === "array" ? [] : "";
      },
      immediate: true
    }
  },
  methods: {
    onRemoveFile(file) {
      let files = this.form.schema.attachment;
      files.splice(files.indexOf(files.find((ele) => ele.name === file.name)), 1);
    },
    onUploadFile({ file }) {
      if (!this.form.schema.attachment) {
        this.form.schema.attachment = [];
      }
      this.onUpload(file).then((result) => {
        this.form.schema.attachment.push(result);
      });
    },
    onChangeHasEnum(bHasEnum) {
      if (bHasEnum) {
        this.form.schema.enum = [
          { label: "\u9009\u98791", value: "a" },
          { label: "\u9009\u98792", value: "b" }
        ];
        this.form.schema.enumGroups = [];
      } else {
        delete this.form.schema.enum;
        delete this.form.schema.enumGroups;
      }
    },
    onAddOption() {
      this.form.schema.enum.push({
        label: "\u65B0\u9009\u9879",
        value: "newKey"
      });
    },
    onDelOption(v, i) {
      this.form.schema.enum.splice(i, 1);
    },
    onSetValue(v, i) {
      let item = this.form.schema.enum[i];
      item["value"] = v;
      this.form.schema.enum.i = item;
    },
    onSetLabel(v, i) {
      let item = this.form.schema.enum[i];
      item["label"] = v;
      this.form.schema.enum.i.item;
    },
    onDragNode(draggingNode, dropNode) {
      let children = dropNode.data.parent.children;
      let { properties } = this.schema;
      let newProperties = {};
      children.map((d) => {
        newProperties[d.key] = properties[d.key];
      });
      dropNode.data.parent.schema.properties = newProperties;
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        return type === "prev" || type === "next";
      } else {
        return false;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.level === 2;
    },
    onNodeClick(schemaWrap, node) {
      const { key, schema } = schemaWrap;
      schema.required = !!schema.required;
      schema.groupable = !!schema.groupable;
      if (!schema.dependencies || typeof schema.dependencies !== "object")
        schema.dependencies = {};
      if (!schema.enumGroups && schema.enum) {
        schema.enumGroups = [];
      }
      if (!schema.eventDependencies || typeof schema.eventDependencies !== "object")
        schema.eventDependencies = {};
      this.form.key = key;
      this.form.schema = schema;
      this.form.node = node;
      this.form.hasEnum = Array.isArray(schema.enum) ? true : false;
      if (this.extendSchema)
        this.extendSchema(this, schema);
    },
    onChangeKey() {
      const schemaWrap = this.form.node.data;
      if (this.form.key !== schemaWrap.key) {
        const newKey = this.form.key;
        if (schemaWrap.parent && schemaWrap.parent.schema.properties) {
          delete schemaWrap.parent.schema.properties[schemaWrap.key];
          schemaWrap.parent.schema.properties[newKey] = schemaWrap.schema;
        }
        schemaWrap.label = schemaWrap.key = newKey;
      }
    },
    onAppendNode() {
      const data = this.form.node.data;
      const { schema, children } = data;
      let newChild;
      if (!Array.isArray(children)) {
        data.children = [];
      }
      if (schema.type === "object") {
        if (typeof schema.properties !== "object" || Array.isArray(schema.properties)) {
          schema.properties = {};
        }
        newChild = new SchemaWrap("newKey", {
          type: "string"
        });
      } else if (schema.type === "array") {
        if (schema.items)
          return;
        newChild = new SchemaWrap("items", { type: "object" });
      }
      if (this.extendSchema)
        this.extendSchema(this, schema);
      data.appendChild(newChild);
    },
    onRemoveNode() {
      const { parent, data } = this.form.node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.key === data.key);
      children.splice(index, 1);
      const properties = parent.data.schema.properties;
      properties && this.$delete(properties, data.key);
      this.form.reset();
    },
    onAddDependency() {
      let dependencies = this.form.schema.dependencies;
      showAsDialog(this.form.schema).then((result) => {
        if (result) {
          let { property, dependencyRules, operator } = result;
          dependencies[property] = {
            dependencyRules,
            operator
          };
        }
      });
    },
    onSetDependency(propName) {
      let dependencies = this.form.schema.dependencies;
      showAsDialog(this.form.schema, propName, dependencies[propName]).then((result) => {
        if (result) {
          let { property, dependencyRules, operator } = result;
          dependencies[property] = {
            dependencyRules,
            operator
          };
        }
      });
    },
    onDelDependency(propName) {
      delete this.form.schema.dependencies[propName];
    },
    onEditEnumDependency() {
      let allProperties = this.form.node.data.parent.children;
      showAsEnumDialog(this.form.schema, this.form.key, allProperties).then((result) => {
        if (result) {
          let { enumGroups } = result;
          this.form.schema.enumGroups = enumGroups;
          this.form.schema.enum = result.enum;
        }
      });
    },
    onAddEventDependency() {
      let eventDependencies = this.form.schema.eventDependencies;
      showAsEventDialog(this.form.schema).then((result) => {
        if (result) {
          let { property, rule } = result;
          eventDependencies[property] = { rule };
        }
      });
    },
    onSetEventDependency(propName) {
      let eventDependencies = this.form.schema.eventDependencies;
      showAsEventDialog(this.form.schema, propName, eventDependencies[propName]).then((result) => {
        if (result) {
          let { property, rule } = result;
          eventDependencies[property] = { rule };
        }
      });
    },
    onDelEventDependency(propName) {
      delete this.form.schema.eventDependencies[propName];
    }
  },
  mounted() {
    const root = SchemaWrap.build("root", this.schema);
    this.data = [root];
  },
  setFormatAttrsComp(format, comp) {
    Format2Comp[format] = comp;
  }
};
const _hoisted_1 = /* @__PURE__ */ createTextVNode("\u5220\u9664");
const _hoisted_2 = /* @__PURE__ */ createTextVNode("\u65B0\u589E\u9009\u9879");
const _hoisted_3 = /* @__PURE__ */ createTextVNode("\u4E0A\u4F20\u6587\u4EF6");
const _hoisted_4 = /* @__PURE__ */ createTextVNode("\u5220\u9664");
const _hoisted_5 = /* @__PURE__ */ createTextVNode("\u6DFB\u52A0\u5C5E\u6027");
const _hoisted_6 = /* @__PURE__ */ createTextVNode("\xA0 ");
const _hoisted_7 = /* @__PURE__ */ createTextVNode("\u4FEE\u6539");
const _hoisted_8 = /* @__PURE__ */ createTextVNode("\u5220\u9664");
const _hoisted_9 = /* @__PURE__ */ createTextVNode("\u6DFB\u52A0");
const _hoisted_10 = /* @__PURE__ */ createTextVNode(" \u7F16\u8F91\u9009\u9879\u4F9D\u8D56");
const _hoisted_11 = /* @__PURE__ */ createTextVNode("\u4FEE\u6539");
const _hoisted_12 = /* @__PURE__ */ createTextVNode("\u5220\u9664");
const _hoisted_13 = /* @__PURE__ */ createTextVNode("\u6DFB\u52A0");
const _hoisted_14 = { style: { "flex": "1" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_tvu_tree = resolveComponent("tvu-tree");
  const _component_tvu_input = resolveComponent("tvu-input");
  const _component_tvu_form_item = resolveComponent("tvu-form-item");
  const _component_tvu_option = resolveComponent("tvu-option");
  const _component_tvu_select = resolveComponent("tvu-select");
  const _component_tvu_switch = resolveComponent("tvu-switch");
  const _component_tvu_checkbox = resolveComponent("tvu-checkbox");
  const _component_tvu_checkbox_group = resolveComponent("tvu-checkbox-group");
  const _component_tvu_button = resolveComponent("tvu-button");
  const _component_tms_flex = resolveComponent("tms-flex");
  const _component_tvu_input_number = resolveComponent("tvu-input-number");
  const _component_tvu_upload = resolveComponent("tvu-upload");
  const _component_tvu_form = resolveComponent("tvu-form");
  const _component_tvu_tab_pane = resolveComponent("tvu-tab-pane");
  const _component_tvu_tabs = resolveComponent("tvu-tabs");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_tvu_tabs, null, {
      default: withCtx(() => [
        createVNode(_component_tvu_tab_pane, {
          label: "\u5C5E\u6027",
          name: "properties"
        }, {
          default: withCtx(() => [
            createVNode(_component_tms_flex, null, {
              default: withCtx(() => [
                createVNode(_component_tvu_tree, {
                  data: $data.data,
                  props: $data.defaultProps,
                  "default-expand-all": "",
                  "expand-on-click-node": false,
                  onNodeClick: $options.onNodeClick,
                  draggable: "",
                  "allow-drag": $options.allowDrag,
                  "allow-drop": $options.allowDrop,
                  onNodeDrop: $options.onDragNode
                }, null, 8, ["data", "props", "onNodeClick", "allow-drag", "allow-drop", "onNodeDrop"]),
                createVNode(_component_tvu_form, {
                  "label-width": "80px",
                  model: $data.form,
                  disabled: !$data.form.node
                }, {
                  default: withCtx(() => [
                    createVNode(_component_tvu_form_item, { label: "\u952E\u503C" }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_input, {
                          modelValue: $data.form.key,
                          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.key = $event),
                          onChange: $options.onChangeKey
                        }, null, 8, ["modelValue", "onChange"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_tvu_form_item, { label: "\u7C7B\u578B" }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_select, {
                          modelValue: $data.form.schema.type,
                          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.schema.type = $event),
                          placeholder: "\u8BF7\u9009\u62E9\u7C7B\u578B"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_tvu_option, {
                              label: "integer",
                              value: "integer"
                            }),
                            createVNode(_component_tvu_option, {
                              label: "number",
                              value: "number"
                            }),
                            createVNode(_component_tvu_option, {
                              label: "string",
                              value: "string"
                            }),
                            createVNode(_component_tvu_option, {
                              label: "object",
                              value: "object"
                            }),
                            createVNode(_component_tvu_option, {
                              label: "array",
                              value: "array"
                            }),
                            createVNode(_component_tvu_option, {
                              label: "boolean",
                              value: "boolean"
                            }),
                            createVNode(_component_tvu_option, {
                              label: "json",
                              value: "json"
                            }),
                            createVNode(_component_tvu_option, {
                              label: "null",
                              value: "null"
                            })
                          ]),
                          _: 1
                        }, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    $options.formats ? (openBlock(), createBlock(_component_tvu_form_item, {
                      key: 0,
                      label: "\u683C\u5F0F"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_select, {
                          modelValue: $data.form.schema.format,
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.form.schema.format = $event),
                          placeholder: "\u8BF7\u9009\u62E9\u683C\u5F0F"
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createElementBlock(Fragment, null, renderList($options.formats, (format) => {
                              return openBlock(), createBlock(_component_tvu_option, {
                                key: format.value,
                                label: format.label,
                                value: format.value
                              }, null, 8, ["label", "value"]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(_component_tvu_form_item, { label: "\u6807\u9898" }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_input, {
                          modelValue: $data.form.schema.title,
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.schema.title = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_tvu_form_item, { label: "\u63CF\u8FF0" }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_input, {
                          type: "textarea",
                          modelValue: $data.form.schema.description,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.schema.description = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_tvu_form_item, { label: "\u5FC5\u586B" }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_switch, {
                          modelValue: $data.form.schema.required,
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.form.schema.required = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_tvu_form_item, { label: "\u53EF\u5426\u5206\u7EC4" }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_switch, {
                          modelValue: $data.form.schema.groupable,
                          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.schema.groupable = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_tvu_form_item, { label: "\u9ED8\u8BA4\u503C" }, {
                      default: withCtx(() => [
                        $data.form.schema.type === "array" ? (openBlock(), createBlock(_component_tvu_checkbox_group, {
                          key: 0,
                          modelValue: $data.form.schema.default,
                          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.form.schema.default = $event)
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createElementBlock(Fragment, null, renderList($data.form.schema.enum, (v, i) => {
                              return openBlock(), createBlock(_component_tvu_checkbox, {
                                key: i,
                                label: v.value
                              }, null, 8, ["label"]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["modelValue"])) : (openBlock(), createBlock(_component_tvu_input, {
                          key: 1,
                          modelValue: $data.form.schema.default,
                          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.form.schema.default = $event)
                        }, null, 8, ["modelValue"]))
                      ]),
                      _: 1
                    }),
                    createVNode(_component_tvu_form_item, { label: "\u8BBE\u7F6E\u8303\u56F4" }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_switch, {
                          modelValue: $data.form.hasEnum,
                          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.form.hasEnum = $event),
                          onChange: $options.onChangeHasEnum
                        }, null, 8, ["modelValue", "onChange"])
                      ]),
                      _: 1
                    }),
                    $data.form.hasEnum ? (openBlock(), createBlock(_component_tvu_form_item, {
                      key: 1,
                      label: "\u9009\u62E9\u8303\u56F4"
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createElementBlock(Fragment, null, renderList($data.form.schema.enum, (v, i) => {
                          return openBlock(), createBlock(_component_tms_flex, { key: i }, {
                            default: withCtx(() => [
                              createVNode(_component_tvu_input, {
                                size: "mini",
                                modelValue: v.value,
                                "onUpdate:modelValue": ($event) => v.value = $event,
                                onInput: ($event) => $options.onSetValue(v.value, i),
                                disabled: v.disabled
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput", "disabled"]),
                              createVNode(_component_tvu_input, {
                                size: "mini",
                                modelValue: v.label,
                                "onUpdate:modelValue": ($event) => v.label = $event,
                                onInput: ($event) => $options.onSetLabel(v.label, i)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "onInput"]),
                              createVNode(_component_tvu_button, {
                                size: "mini",
                                type: "text",
                                onClick: ($event) => $options.onDelOption(v, i)
                              }, {
                                default: withCtx(() => [
                                  _hoisted_1
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128)),
                        createVNode(_component_tvu_button, {
                          size: "mini",
                          type: "primary",
                          onClick: $options.onAddOption
                        }, {
                          default: withCtx(() => [
                            _hoisted_2
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    $data.form.schema.type === "array" && $data.form.hasEnum ? (openBlock(), createBlock(_component_tvu_form_item, {
                      key: 2,
                      label: "\u81F3\u5C11\u9009"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_input_number, {
                          modelValue: $data.form.schema.minItems,
                          "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.form.schema.minItems = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    $data.form.schema.type === "array" && $data.form.hasEnum ? (openBlock(), createBlock(_component_tvu_form_item, {
                      key: 3,
                      label: "\u6700\u591A\u9009"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_input_number, {
                          modelValue: $data.form.schema.maxItems,
                          "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.form.schema.maxItems = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    $data.form.schema.type === "array" && $data.form.schema.items ? (openBlock(), createBlock(_component_tvu_form_item, {
                      key: 4,
                      label: "\u4E0A\u4F20\u6A21\u677F"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_upload, {
                          action: "#",
                          multiple: "",
                          "file-list": $data.form.schema.attachment,
                          "http-request": $options.onUploadFile,
                          "on-remove": $options.onRemoveFile
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_tvu_button, null, {
                              default: withCtx(() => [
                                _hoisted_3
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["file-list", "http-request", "on-remove"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    (openBlock(), createBlock(resolveDynamicComponent($options.compFormatAttrs), normalizeProps(guardReactiveProps($data.form.schema.formatAttrs)), null, 16)),
                    renderSlot(_ctx.$slots, "extKeywords", {
                      schema: $data.form.schema
                    }),
                    createVNode(_component_tvu_form_item, null, {
                      default: withCtx(() => [
                        createVNode(_component_tvu_button, {
                          size: "mini",
                          onClick: $options.onRemoveNode
                        }, {
                          default: withCtx(() => [
                            _hoisted_4
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        $data.form.schema.type === "object" || $data.form.schema.type === "array" ? (openBlock(), createBlock(_component_tvu_button, {
                          key: 0,
                          size: "mini",
                          onClick: $options.onAppendNode
                        }, {
                          default: withCtx(() => [
                            _hoisted_5
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 3
                }, 8, ["model", "disabled"]),
                createElementVNode("div", null, [
                  createVNode(_component_tvu_tabs, {
                    "tab-position": "left",
                    modelValue: $data.activeL1Pane,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.activeL1Pane = $event)
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_tvu_tab_pane, {
                        label: "\u5C5E\u6027\u4F9D\u8D56",
                        name: "dependencies"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_tms_flex, { direction: "column" }, {
                            default: withCtx(() => [
                              (openBlock(true), createElementBlock(Fragment, null, renderList($data.form.schema.dependencies, (config, p) => {
                                return openBlock(), createBlock(_component_tms_flex, {
                                  key: p,
                                  direction: "column"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_tms_flex, null, {
                                      default: withCtx(() => [
                                        createElementVNode("span", null, toDisplayString(p), 1),
                                        createVNode(_component_tms_flex, { direction: "column" }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createElementBlock(Fragment, null, renderList(config.dependencyRules, (group, index) => {
                                              return openBlock(), createBlock(_component_tms_flex, { key: index }, {
                                                default: withCtx(() => [
                                                  (openBlock(true), createElementBlock(Fragment, null, renderList(group.rules, (rule, index2) => {
                                                    return openBlock(), createElementBlock("div", { key: index2 }, [
                                                      createElementVNode("span", null, toDisplayString(rule.property), 1),
                                                      _hoisted_6,
                                                      createElementVNode("span", null, toDisplayString(rule.value), 1)
                                                    ]);
                                                  }), 128)),
                                                  createElementVNode("span", null, toDisplayString(group.operator), 1)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128)),
                                            createElementVNode("div", null, [
                                              createElementVNode("span", null, toDisplayString(config.operator), 1)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createElementVNode("div", null, [
                                      createVNode(_component_tvu_button, {
                                        size: "mini",
                                        onClick: ($event) => $options.onSetDependency(p)
                                      }, {
                                        default: withCtx(() => [
                                          _hoisted_7
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"]),
                                      createVNode(_component_tvu_button, {
                                        size: "mini",
                                        onClick: ($event) => $options.onDelDependency(p)
                                      }, {
                                        default: withCtx(() => [
                                          _hoisted_8
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"])
                                    ])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128)),
                              createElementVNode("div", null, [
                                createVNode(_component_tvu_button, {
                                  size: "mini",
                                  type: "default",
                                  onClick: $options.onAddDependency
                                }, {
                                  default: withCtx(() => [
                                    _hoisted_9
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_tvu_tab_pane, {
                        label: "\u9009\u9879\u4F9D\u8D56",
                        name: "enumDependencies"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList($data.form.schema.enumGroups, (g) => {
                            return openBlock(), createBlock(_component_tms_flex, {
                              key: g.id
                            }, {
                              default: withCtx(() => [
                                createElementVNode("span", null, toDisplayString(g.label), 1),
                                createElementVNode("span", null, toDisplayString(g.assocEnum.property), 1),
                                createElementVNode("span", null, toDisplayString(g.assocEnum.value), 1)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128)),
                          (openBlock(true), createElementBlock(Fragment, null, renderList($data.form.schema.enum, (v, i) => {
                            return openBlock(), createElementBlock("div", { key: i }, [
                              (openBlock(true), createElementBlock(Fragment, null, renderList($data.form.schema.enumGroups, (g) => {
                                return openBlock(), createElementBlock("div", {
                                  key: g.id
                                }, [
                                  g.id === v.group ? (openBlock(), createBlock(_component_tms_flex, { key: 0 }, {
                                    default: withCtx(() => [
                                      createElementVNode("span", null, toDisplayString(v.label), 1),
                                      createElementVNode("span", null, toDisplayString(g.label), 1)
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true)
                                ]);
                              }), 128))
                            ]);
                          }), 128)),
                          createElementVNode("div", null, [
                            createVNode(_component_tvu_button, {
                              size: "mini",
                              type: "default",
                              disabled: !$data.form.schema.enum,
                              onClick: $options.onEditEnumDependency
                            }, {
                              default: withCtx(() => [
                                _hoisted_10
                              ]),
                              _: 1
                            }, 8, ["disabled", "onClick"])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_tvu_tab_pane, {
                        label: "\u4E8B\u4EF6\u4F9D\u8D56",
                        name: "eventDependencies"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_tms_flex, { direction: "column" }, {
                            default: withCtx(() => [
                              (openBlock(true), createElementBlock(Fragment, null, renderList($data.form.schema.eventDependencies, (config, p) => {
                                return openBlock(), createBlock(_component_tms_flex, {
                                  key: p,
                                  direction: "column"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_tms_flex, null, {
                                      default: withCtx(() => [
                                        createElementVNode("span", null, toDisplayString(p), 1),
                                        createVNode(_component_tms_flex, { direction: "column" }, {
                                          default: withCtx(() => [
                                            createElementVNode("span", null, toDisplayString(config.rule.url), 1),
                                            createVNode(_component_tms_flex, null, {
                                              default: withCtx(() => [
                                                (openBlock(true), createElementBlock(Fragment, null, renderList(config.rule.params, (value, key) => {
                                                  return openBlock(), createElementBlock("span", { key }, toDisplayString(value), 1);
                                                }), 128))
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createElementVNode("span", null, toDisplayString(config.rule.type), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createElementVNode("div", null, [
                                      createVNode(_component_tvu_button, {
                                        size: "mini",
                                        onClick: ($event) => $options.onSetEventDependency(p)
                                      }, {
                                        default: withCtx(() => [
                                          _hoisted_11
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"]),
                                      createVNode(_component_tvu_button, {
                                        size: "mini",
                                        onClick: ($event) => $options.onDelEventDependency(p)
                                      }, {
                                        default: withCtx(() => [
                                          _hoisted_12
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"])
                                    ])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128)),
                              createElementVNode("div", null, [
                                createVNode(_component_tvu_button, {
                                  size: "mini",
                                  type: "default",
                                  onClick: $options.onAddEventDependency
                                }, {
                                  default: withCtx(() => [
                                    _hoisted_13
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ])
              ]),
              _: 3
            })
          ]),
          _: 3
        }),
        createVNode(_component_tvu_tab_pane, {
          label: "\u9884\u89C8",
          name: "preview"
        }, {
          default: withCtx(() => [
            createElementVNode("div", _hoisted_14, toDisplayString($data.jsonString), 1)
          ]),
          _: 1
        })
      ]),
      _: 3
    })
  ]);
}
var JsonSchema = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { JsonSchema as J, _export_sfc as _ };
