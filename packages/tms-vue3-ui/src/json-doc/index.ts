import { App } from 'vue'
import JsonDoc from './Editor.vue'

JsonDoc.install = (app: App) => {
  app.component('tms-json-doc', JsonDoc)
}

export { createField, Field, DocIter, DocAsArray } from 'tms-data-aid'

export default JsonDoc
