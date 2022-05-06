import { RawSchema, SchemaProp } from '../../json-schema/model'
import { Field } from './field'

export class FieldObject extends Field {
  multiple: boolean
  itemSchema
  // 子字段
  children: Field[] = []

  constructor(prop: SchemaProp, refs?: { [k: string]: RawSchema }) {
    super(prop)
    const { attrs, items } = prop
    this.multiple = attrs.type === 'array'
    this.type = attrs.type
    if (items?.$ref) {
      if (refs?.[items.$ref]) {
        this.itemSchema = refs[items.$ref]
      }
    } else {
      this.itemSchema = items
    }
    /**设置默认值*/
    if (attrs.type === 'array') {
      this.value = Array.isArray(this.value) ? this.value : []
    } else if (attrs.type === 'object') {
      this.value = this.value ? this.value : {}
    }
  }
}
