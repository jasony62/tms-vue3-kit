//@ts-nocheck
import { App } from 'vue'
export default function install(app: App) {
  app.component('tms-text', {
    props: {
      lines: { type: Number },
      linesSm: { type: Number },
    },
    render() {
      let slots = this.$slots
      let classes = ['tms-text']
      if (typeof this.lines === 'number' && this.lines > 0)
        classes.push(`tms-text_lines_${this.lines}`)
      if (typeof this.linesSm === 'number' && this.linesSm > 0)
        classes.push(`tms-text_lines-sm_${this.linesSm}`)
      return <div {...{ class: classes }}>{slots.default?.()}</div>
    },
  })
}
