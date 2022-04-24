import { createVNode, mergeProps, resolveComponent } from "vue";
function index(app) {
  app.component("tms-card", {
    props: {
      thumb: {
        type: [String, Boolean]
      },
      title: {
        type: String
      },
      desc: {
        type: String
      },
      gap: {
        type: Number,
        default: 2
      },
      gapMain: {
        type: Number,
        default: 2
      },
      gapContent: {
        type: Number,
        default: 2
      },
      backColor: {
        type: String,
        default: "#ffffff"
      },
      descColor: {
        type: String,
        default: "#666666"
      },
      url: {
        type: String
      },
      to: {
        type: Object
      }
    },
    render() {
      const slots = this.$slots;
      const props = this.$props;
      const {
        title,
        desc,
        backColor,
        descColor,
        to,
        url
      } = props;
      const thumb = props.thumb === "" ? null : props.thumb;
      const that = this;
      function onClick() {
        if (url)
          location.href = url;
        else if (to && that.$parent && that.$parent.$router)
          that.$parent.$router.push(to);
      }
      return createVNode("div", mergeProps({
        "class": "tms-card",
        "onClick": onClick
      }, {
        style: {
          backgroundColor: backColor
        }
      }), [createVNode(resolveComponent("tms-flex"), {
        direction: "column",
        gap: this.gap
      }, {
        default: () => {
          var _a;
          return [slots.header ? createVNode("header", null, [slots.header()]) : "", createVNode("main", null, [createVNode(resolveComponent("tms-flex"), {
            elasticItems: [1],
            gap: this.gapMain
          }, {
            default: () => [thumb === false ? "" : createVNode("div", {
              "class": "tms-card__thumb"
            }, [slots.thumb ? slots.thumb() : createVNode("img", {
              "src": thumb
            }, null)]), createVNode("div", {
              "class": "tms-card__content"
            }, [createVNode(resolveComponent("tms-flex"), {
              direction: "column",
              elasticItems: [1],
              gap: this.gapContent
            }, {
              default: () => {
                var _a2;
                return [createVNode("div", {
                  "class": "tms-card__title"
                }, [slots.title ? slots.title() : title]), createVNode("div", mergeProps({
                  "class": "tms-card__desc"
                }, {
                  style: {
                    color: descColor
                  }
                }), [slots.desc ? slots.desc() : desc]), slots.bottom ? createVNode("div", {
                  "class": "tms-card__bottom"
                }, [(_a2 = slots.bottom) == null ? void 0 : _a2.call(slots)]) : ""];
              }
            })])]
          })]), slots.footer ? createVNode("footer", null, [(_a = slots.footer) == null ? void 0 : _a.call(slots)]) : ""];
        }
      })]);
    }
  });
}
export { index as default };
