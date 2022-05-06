import { SchemaProp } from '../../json-schema/model'
import { Field } from './field'

export class FieldFile extends Field {
  type: string
  multiple: boolean = false
  limit?: number
  size?: string

  constructor(prop: SchemaProp, value: any) {
    super(prop)
    this.type = 'file'

    /**设置默认值*/
    this.value = Array.isArray(value)
      ? value
      : Array.isArray(this.value)
      ? this.value
      : []

    const { items } = prop
    if (items?.formatAttrs) {
      Object.entries(items.formatAttrs).forEach(([key, value]) => {
        if (key === 'limit') {
          // let val = value ? parseInt(value) : 1
          let val = 1
          if (val > 1) this.multiple = true
          this.limit = val
        } else if (key === 'size') {
          let val = value ? value : '20'
          this.size = val + ''
        } else {
          Object.assign(this, { [key]: value })
        }
      })
    }
  }
}
