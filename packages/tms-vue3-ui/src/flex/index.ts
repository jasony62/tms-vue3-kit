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
      let items = this.$slots.default?.()
      if (items && items.length) {
        let items2 = items.map((item: any, index: any) => {
          addStyleClass(item, 'class', 'tms-flex__item')
          if (
            this.elasticItems &&
            this.elasticItems.length &&
            this.elasticItems.includes(index)
          ) {
            addStyleClass(item, 'class', 'tms-flex__item_elastic')
          }
          return h(item, { class: item.class })
        })
        return h('div', { class: classes, style: { alignItems } }, items2)
      } else {
        return h('div', { class: classes, style: { alignItems } }, items)
      }
    },
  })
}
