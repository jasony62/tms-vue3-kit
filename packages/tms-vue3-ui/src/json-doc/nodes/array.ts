import { h, VNode } from 'vue'
import { SchemaProp } from '@/json-schema/model'
import { components, prepareFieldNode } from './index'
import { FieldNode } from './field-node'
import { createField, Field } from '../fields'

const itemAddVNode = (field: Field, fieldValue: any[]) => {
  return h(
    components.button.tag,
    {
      onClick: () => {
        if (Array.isArray(fieldValue)) {
          switch (field.itemSchemaType) {
            case 'string':
              fieldValue.push('')
              break
            case 'object':
              console.log('field.prop.items', field.scheamProp.items)
              break
          }
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
      name: field.name,
      type: field.type,
      class: ['tvu-jdoc__nest'],
    }

    return options
  }

  protected children(): VNode[] {
    const { ctx, field } = this
    const fieldValue = this.fieldValue()

    /**生成数组中已有项目的节点*/
    const itemVNodes: VNode[] = []

    if (Array.isArray(fieldValue) && fieldValue.length) {
      switch (field.itemSchemaType) {
        case 'string':
          fieldValue.forEach((v, index) => {
            // 数组下的子属性
            let itemProp = new SchemaProp(`${field.fullname}[*]`, '', 'string')
            let itemField = createField(itemProp, index)
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

    const children = [items, itemAddVNode(field, fieldValue)]

    return children
  }
}

export class ArrayObjectNode extends FieldNode {
  options() {
    const { field } = this
    const options = {
      type: field.type,
      name: field.name,
      class: ['tvu-jdoc__nest'],
    }

    return options
  }

  protected children(): VNode[] {
    const { field } = this
    const fieldValue = this.fieldValue()

    /**生成数组中已有项目的节点*/
    const itemVNodes: VNode[] = []
    if (Array.isArray(fieldValue) && fieldValue.length) {
      // 有数据时才会生成子节点
    }

    /**数组内容容器*/
    const items = h('div', { class: ['tvu-jdoc__node__items'] }, itemVNodes)

    const children = [items, itemAddVNode(field, fieldValue)]

    return children
  }
}
