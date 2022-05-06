import { deepClone } from '../utils'
import { components } from './index'
import { FieldNode } from './field-node'

// 使用插槽会导致render，所以将插槽的render作为属性值传递
function createSlotRender(field: any) {
  return function slotRender(createElement: Function, props: any) {
    if (!field.itemSchema || typeof field.itemSchema !== 'object') {
      return createElement('div', [
        `[JsonDoc:ObjectNode]: 没有指定渲染对象的schema`,
      ])
    }
    const itemSchema = deepClone(field.itemSchema)
    return createElement(components.jsondoc.tag, {
      props: {
        schema: itemSchema,
        doc: props.line,
        requireButtons: false,
        oneWay: false,
      },
    })
  }
}

export class ObjectNode extends FieldNode {
  options() {
    const fieldValue = this.fieldValue()
    const { field } = this
    // const { schema } = field
    const options = {
      type: field.type,
      name: field.name,
      value: fieldValue,
      class: ['tvu-jdoc__nest'],
      // slotRender: createSlotRender(field),
    }
    // options.on = {
    //   add: cbAdd => {
    //     if (schema.type === 'array') cbAdd({})
    //     else if (schema.type === 'object') cbAdd({}, schema.name + (Object.keys(fieldValue).length + 1))
    //   }
    // }

    return options
  }
}
