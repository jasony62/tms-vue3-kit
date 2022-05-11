import { SchemaProp } from '@/json-schema/model'
import { Field } from './field'

export class FieldFile extends Field {
  multiple: boolean
  itemSchema

  constructor(prop: SchemaProp, index = -1) {
    super(prop, index)
    this.type = 'file'
    const { attrs, items } = prop
    this.multiple = attrs.type === 'array'
    this.itemSchema = items

    /**设置默认值*/
    if (attrs.type === 'array') {
      this.value = Array.isArray(this.value) ? this.value : []
    } else if (attrs.type === 'object') {
      this.value = this.value ? this.value : {}
    }
  }
}

// export class FieldFile extends Field {
//   type: string
//   multiple: boolean = false
//   limit?: number
//   size?: string

//   constructor(prop: SchemaProp, index = -1) {
//     super(prop, index)
//     this.type = 'file'

//     const { items } = prop
//     if (items?.formatAttrs) {
//       Object.entries(items.formatAttrs).forEach(([key, value]) => {
//         if (key === 'limit') {
//           // let val = value ? parseInt(value) : 1
//           let val = 1
//           if (val > 1) this.multiple = true
//           this.limit = val
//         } else if (key === 'size') {
//           let val = value ? value : '20'
//           this.size = val + ''
//         } else {
//           Object.assign(this, { [key]: value })
//         }
//       })
//     }
//   }
// }
