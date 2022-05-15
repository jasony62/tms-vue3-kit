import { h, VNode } from 'vue'
import { components } from './index'
import { FieldNode } from './fieldNode'
import { Field } from '../fields'
import { FormContext } from '../builder'
import { initChild } from '@/utils'

const itemAddVNode = (ctx: FormContext, field: Field) => {
  let addVNode = h(
    components.button.tag,
    {
      onClick: () => {
        const fieldValue = initChild(ctx.editDoc, field.fullname, [])
        if (Array.isArray(fieldValue)) {
          switch (field.itemSchemaType) {
            case 'string':
              fieldValue.push('')
              break
            case 'object':
              fieldValue.push({})
              break
          }
        }
      },
    },
    '添加'
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNode)
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
/**
 * 数组中的项目是对象
 */
export class ArrayNode extends FieldNode {
  private _children: VNode[]

  constructor(ctx: FormContext, field: Field, children?: VNode[]) {
    super(ctx, field)
    this._children = children ?? []
  }

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
    const { ctx, field } = this
    const fieldValue = this.fieldValue()

    const itemNestVNodes: VNode[] = []

    this._children.forEach((child, index) => {
      let itemVNodes = [] // 数组中1个item的虚节点
      itemVNodes.push(child)
      let itemActionsVNode = h(
        'div',
        { class: ['jdoc__nest__item__actions'] },
        [itemRemoveVNode(fieldValue, index)]
      )
      let itemNestVNode = h('div', { index, class: ['tvu-jdoc__nest__item'] }, [
        itemVNodes,
        itemActionsVNode,
      ])
      itemNestVNodes.push(itemNestVNode)
    })

    return [...itemNestVNodes, itemAddVNode(ctx, field)]
  }
}
