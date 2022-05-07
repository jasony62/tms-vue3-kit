import { App, h } from 'vue'

function addStyleClass(obj: any, prop: any, styleClass: any) {
  if (undefined === obj[prop]) {
    obj[prop] = [styleClass]
  } else if (Array.isArray(obj[prop])) {
    if (!obj[prop].includes(styleClass)) obj[prop].push(styleClass)
  } else if (typeof obj[prop] === 'object') {
    obj[prop][styleClass] = true
  } else if (typeof obj[prop] === 'string') {
    let regx = new RegExp(styleClass)
    if (!regx.test(obj[prop])) obj[prop] += ` ${styleClass}`
  }
  return obj
}

export default function install(app: App) {
  app.component('tms-flex', {
    props: {
      direction: { type: String, default: 'row' },
      alignItems: { type: String },
      elasticItems: { type: Array },
      gap: { type: Number, default: 2 },
    },
    render() {
      let classes = ['tms-flex']
      classes.push(
        this.direction === 'column'
          ? 'tms-flex_column'
          : this.direction === 'row-reverse'
          ? 'tms-flex_row-reverse'
          : 'tms-flex_row'
      )
      classes.push(`tms-flex_gap_${this.gap}`)
      const alignItems = this.alignItems
        ? this.alignItems
        : this.direction === 'column'
        ? 'stretch'
        : 'flex-start'

      const vnodes = this.$slots.default?.()
      if (vnodes?.length) {
        vnodes.forEach((vnode: any, index: number) => {
          if (
            typeof vnode.type === 'string' ||
            typeof vnode.type === 'object'
          ) {
            vnode.props ??= {}
            addStyleClass(vnode.props, 'class', 'tms-flex__item')
            if (
              this.elasticItems &&
              this.elasticItems.length &&
              this.elasticItems.includes(index)
            ) {
              addStyleClass(vnode.props, 'class', 'tms-flex__item_elastic')
            }
          } else if (typeof vnode.type === 'symbol') {
            /*子对象被fragment包裹的情况，例如：<div v-for=""></div>*/
            if (typeof vnode.children.forEach === 'function') {
              vnode.children.forEach((child: any, index: number) => {
                child.props ??= {}
                addStyleClass(child.props, 'class', 'tms-flex__item')
                if (
                  this.elasticItems &&
                  this.elasticItems.length &&
                  this.elasticItems.includes(index)
                ) {
                  addStyleClass(child.props, 'class', 'tms-flex__item_elastic')
                }
              })
            } else {
              console.warn(`不支持的vnode.children类型`, vnode.children)
            }
          } else {
            console.warn(`不支持的vnode.type=${vnode.type}`, vnode)
          }
        })
      }
      return h('div', { class: classes, style: { alignItems } }, vnodes)
    },
  })
}
