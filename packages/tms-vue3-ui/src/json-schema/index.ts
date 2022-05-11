import { App } from 'vue'
import { BuildinComponents } from './buildinComp'
import JsonSchema from './Editor.vue'

/**
 * 全局注册
 * @param app
 */
JsonSchema.install = (app: App) => {
  Object.entries(BuildinComponents).forEach(([name, comp]) => {
    app.component(name, comp)
  })
  app.component('tms-json-schema', JsonSchema)
}

export default JsonSchema
