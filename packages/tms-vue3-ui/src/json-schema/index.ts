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

// export { JSONSchemaBuilder } from 'tms-data-aid/dist/json-schema/builder'

// export { SchemaIter, SchemaProp } from 'tms-data-aid/dist/json-schema/model'
export { SchemaIter, SchemaProp, JSONSchemaBuilder } from 'tms-data-aid'

export default JsonSchema
