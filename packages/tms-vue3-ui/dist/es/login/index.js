var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { defineComponent, ref, reactive, onMounted, nextTick, openBlock, createElementBlock, Fragment, createElementVNode, normalizeClass, unref, renderList, withDirectives, vModelDynamic, vModelText, createCommentVNode, toDisplayString, createApp } from "vue";
const _hoisted_1 = ["placeholder", "type", "onUpdate:modelValue"];
const _hoisted_2 = {
  key: 0,
  class: "tvu-login__captcha"
};
const _hoisted_3 = ["placeholder"];
const _hoisted_4 = {
  key: 1,
  class: "tvu-login__button"
};
const _hoisted_5 = {
  key: 2,
  class: "tvu-login__tip"
};
const _hoisted_6 = {
  key: 0,
  class: "tvu-login__modal"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  props: {
    schema: Array,
    loginTip: Object,
    fnCaptcha: Function,
    fnToken: Function,
    onSuccess: { type: Function, default: () => {
    } },
    onFail: { type: Function, default: () => {
    } },
    asDialog: { type: Boolean, default: false },
    onClose: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const el = ref(null);
    const elCaptcha = ref(null);
    let { schema, loginTip, fnToken, fnCaptcha, onSuccess, onFail, asDialog, onClose } = props;
    const loginData = reactive({});
    const otherInputs = ref([]);
    const captchaInput = ref();
    if (schema && schema.length)
      schema.forEach((item) => {
        if (item.type === "code") {
          captchaInput.value = item;
        } else {
          otherInputs.value.push(item);
        }
      });
    const refresh = () => {
      if (elCaptcha.value && typeof fnCaptcha === "function") {
        fnCaptcha().then((response) => {
          let { code, result } = response;
          if (code !== 0) {
            result = '<div style="background:#f5f5f5;color:red;text-align:center;font-size:14px;line-height:44px;">\u83B7\u53D6\u9519\u8BEF</div>';
          }
          elCaptcha.value.innerHTML = result;
        });
      }
    };
    const login = () => {
      if (typeof fnToken === "function") {
        fnToken(loginData).then((response) => {
          let { code, result, msg } = response;
          if (code !== 0) {
            refresh();
            return onFail(response);
          }
          onSuccess(result.access_token);
        });
      }
    };
    const close = () => {
      var _a, _b;
      if (typeof onClose === "function") {
        onClose();
      } else {
        (_b = (_a = el.value.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.removeChild(el.value.parentElement);
      }
    };
    onMounted(() => {
      nextTick(() => refresh());
    });
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("div", {
          ref_key: "el",
          ref: el,
          class: normalizeClass(["tvu-login__form", { "tvu-login__form--modal": unref(asDialog) }])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(otherInputs.value, (item, index) => {
            return openBlock(), createElementBlock("div", {
              class: "tvu-login__input",
              key: index
            }, [
              withDirectives(createElementVNode("input", {
                placeholder: item.placeholder,
                type: item.type,
                "onUpdate:modelValue": ($event) => unref(loginData)[item.key] = $event,
                required: ""
              }, null, 8, _hoisted_1), [
                [vModelDynamic, unref(loginData)[item.key]]
              ])
            ]);
          }), 128)),
          captchaInput.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
            withDirectives(createElementVNode("input", {
              placeholder: captchaInput.value.placeholder,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(loginData)[captchaInput.value.key] = $event),
              required: ""
            }, null, 8, _hoisted_3), [
              [vModelText, unref(loginData)[captchaInput.value.key]]
            ]),
            createElementVNode("div", {
              ref_key: "elCaptcha",
              ref: elCaptcha,
              style: { width: "150px", height: "44px" }
            }, null, 512),
            createElementVNode("button", { onClick: refresh }, "\u5237\u65B0")
          ])) : createCommentVNode("", true),
          createElementVNode("div", { class: "tvu-login__button" }, [
            createElementVNode("button", { onClick: login }, "\u767B\u5F55")
          ]),
          unref(asDialog) ? (openBlock(), createElementBlock("div", _hoisted_4, [
            createElementVNode("button", { onClick: close }, "\u5173\u95ED")
          ])) : createCommentVNode("", true),
          unref(loginTip) ? (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString((_a = unref(loginTip)) == null ? void 0 : _a.text), 1)) : createCommentVNode("", true)
        ], 2),
        unref(asDialog) ? (openBlock(), createElementBlock("div", _hoisted_6)) : createCommentVNode("", true)
      ], 64);
    };
  }
});
function showAsDialog(options) {
  const root = document.createElement("div");
  document.body.appendChild(root);
  let app = createApp(_sfc_main, __spreadProps(__spreadValues({
    asDialog: true
  }, options), {
    onClose: () => {
      app.unmount();
    }
  }));
  app.mount(root);
}
function install(app) {
  app.component("tms-login", _sfc_main);
}
_sfc_main.install = install;
_sfc_main.open = showAsDialog;
export { _sfc_main as default };
