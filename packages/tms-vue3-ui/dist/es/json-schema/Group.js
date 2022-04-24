import { resolveComponent, openBlock, createElementBlock, createVNode, withCtx, createTextVNode, toDisplayString, Fragment, renderList, createBlock, createElementVNode } from "vue";
import { _ as _export_sfc } from "./index2.js";
const _sfc_main = {
  data() {
    return {
      timer: ""
    };
  },
  props: {
    properties: Object,
    dependencyRules: Object,
    tabName: String
  },
  methods: {
    onAddRule(tabName) {
      this.$set(this.dependencyRules[tabName]["rules"], this.dependencyRules[tabName]["rules"].length, { property: "", value: null });
    },
    onDelRule(rule, tabName) {
      console.log("rulerulerule", rule);
      let index = this.dependencyRules[tabName].rules.indexOf(rule);
      this.dependencyRules[tabName].rules.splice(index, 1);
    }
  }
};
const _hoisted_1 = { id: "app" };
const _hoisted_2 = /* @__PURE__ */ createTextVNode("\u5220\u9664");
const _hoisted_3 = /* @__PURE__ */ createTextVNode("\u6EE1\u8DB3\u5168\u90E8\u6761\u4EF6");
const _hoisted_4 = /* @__PURE__ */ createTextVNode("\u6EE1\u8DB3\u4EFB\u610F\u6761\u4EF6");
const _hoisted_5 = {
  slot: "footer",
  class: "dialog-footer"
};
const _hoisted_6 = /* @__PURE__ */ createTextVNode("\u6DFB\u52A0\u89C4\u5219");
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_tvu_option = resolveComponent("tvu-option");
  const _component_tvu_select = resolveComponent("tvu-select");
  const _component_tvu_form_item = resolveComponent("tvu-form-item");
  const _component_tvu_input = resolveComponent("tvu-input");
  const _component_tvu_button = resolveComponent("tvu-button");
  const _component_tvu_form = resolveComponent("tvu-form");
  const _component_tvu_radio = resolveComponent("tvu-radio");
  const _component_tvu_radio_group = resolveComponent("tvu-radio-group");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode(_component_tvu_form_item, { label: "\u4F9D\u8D56\u89C4\u5219" }, {
      default: withCtx(() => [
        createTextVNode(toDisplayString($props.tabName) + " ", 1),
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.dependencyRules[$props.tabName]["rules"], (rule, index) => {
          return openBlock(), createBlock(_component_tvu_form, {
            inline: true,
            key: index,
            size: "medium"
          }, {
            default: withCtx(() => [
              createVNode(_component_tvu_form_item, { label: "\u5C5E\u6027" }, {
                default: withCtx(() => [
                  createVNode(_component_tvu_select, {
                    modelValue: rule.property,
                    "onUpdate:modelValue": ($event) => rule.property = $event,
                    filterable: "",
                    placeholder: "\u8BF7\u9009\u62E9"
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList($props.properties, (prop, key) => {
                        return openBlock(), createBlock(_component_tvu_option, {
                          key,
                          label: key,
                          value: key
                        }, null, 8, ["label", "value"]);
                      }), 128))
                    ]),
                    _: 2
                  }, 1032, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 2
              }, 1024),
              createVNode(_component_tvu_form_item, { label: "\u53D6\u503C" }, {
                default: withCtx(() => [
                  createVNode(_component_tvu_input, {
                    modelValue: rule.value,
                    "onUpdate:modelValue": ($event) => rule.value = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 2
              }, 1024),
              createVNode(_component_tvu_button, {
                onClick: ($event) => $options.onDelRule(rule, $props.tabName)
              }, {
                default: withCtx(() => [
                  _hoisted_2
                ]),
                _: 2
              }, 1032, ["onClick"])
            ]),
            _: 2
          }, 1024);
        }), 128))
      ]),
      _: 1
    }),
    createVNode(_component_tvu_form_item, null, {
      default: withCtx(() => [
        createVNode(_component_tvu_radio_group, {
          modelValue: $props.dependencyRules[$props.tabName]["operator"],
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $props.dependencyRules[$props.tabName]["operator"] = $event)
        }, {
          default: withCtx(() => [
            createVNode(_component_tvu_radio, { label: "and" }, {
              default: withCtx(() => [
                _hoisted_3
              ]),
              _: 1
            }),
            createVNode(_component_tvu_radio, { label: "or" }, {
              default: withCtx(() => [
                _hoisted_4
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _: 1
    }),
    createElementVNode("span", _hoisted_5, [
      createVNode(_component_tvu_button, {
        size: "small",
        onClick: _cache[1] || (_cache[1] = ($event) => $options.onAddRule($props.tabName))
      }, {
        default: withCtx(() => [
          _hoisted_6
        ]),
        _: 1
      })
    ])
  ]);
}
var Group = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Group as default };
