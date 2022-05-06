import { components, prepareFieldNode } from './index'
import { FieldNode } from './field-node'
import { h, VNode } from 'vue'
import { SchemaProp } from '../../json-schema/model'
import { createField } from '../fields'

export class ArrayNode extends FieldNode {
  options() {
    const { field } = this
    // const { schema } = field
    const options = {
      type: field.type,
      name: field.name,
      // value: fieldValue,
      class: ['tvu-jdoc__nest'],
    }

    return options
  }

  children(): VNode[] {
    const { ctx, field } = this
    const fieldValue = this.fieldValue()

    /**生成数组中已有项目的节点*/
    const itemVNodes: VNode[] = []
    if (Array.isArray(fieldValue) && fieldValue.length) {
      switch (field.itemSchemaType) {
        case 'string':
          fieldValue.forEach((v, index) => {
            let itemProp = new SchemaProp(
              field.fullname,
              `[${index}]`,
              'string'
            )
            let itemField = createField(itemProp)
            const node = prepareFieldNode(ctx, itemField)
            itemVNodes.push(node.createElem())
          })
          break
      }
    }

    /**数组内容容器*/
    const items = h('dev', { class: ['tvu-jdoc__node__items'] }, itemVNodes)

    /**添加内部操作*/
    const add = h(
      components.button.tag,
      {
        onClick: () => {
          if (Array.isArray(fieldValue)) {
            fieldValue.push('')
          }
        },
      },
      '添加'
    )

    return [items, add]
  }
}
