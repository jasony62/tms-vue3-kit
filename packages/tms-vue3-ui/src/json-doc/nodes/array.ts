import { components, prepareFieldNode } from './index'
import { FieldNode } from './field-node'
import { h, VNode } from 'vue'
import { SchemaProp } from '../../json-schema/model'
import { createField } from '../fields'

const itemAddVNode = (fieldValue: any[]) => {
  return h(
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
}
const itemRemoveVNode = (fieldValue: any[], index: number) => {
  return h(
    components.button.tag,
    {
      onClick: () => {
        // 删除数组中的内容
        fieldValue.splice(index, 1)
      },
    },
    '删除'
  )
}

export class ArrayNode extends FieldNode {
  options() {
    const { field } = this
    const options = {
      type: field.type,
      name: field.name,
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
            const wrap = h('div', { class: ['tvu-jdoc__node__item-wrap'] }, [
              node.createElem(),
              itemRemoveVNode(fieldValue, index),
            ])
            itemVNodes.push(wrap)
          })
          break
      }
    }

    /**数组内容容器*/
    const items = h('div', { class: ['tvu-jdoc__node__items'] }, itemVNodes)

    return [items, itemAddVNode(fieldValue)]
  }
}
