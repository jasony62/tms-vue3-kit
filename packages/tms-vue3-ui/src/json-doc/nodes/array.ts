import { h, VNode } from 'vue'
import { components } from './index'
import { FieldNode } from './field-node'
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
  private _children: (VNode | VNode[])[]

  constructor(ctx: FormContext, field: Field, children?: (VNode | VNode[])[]) {
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

    /**生成数组中已有项目的节点*/
    const itemNestVNodes: VNode[] = []
    /**children是个二维数组，第1维是字段，第2纬是数组的项目*/
    if (Array.isArray(this._children) && this._children.length) {
      let fieldNum = this._children.length
      let itemNum = Array.isArray(this._children[0])
        ? this._children[0].length
        : 0

      for (let i = 0; i < itemNum; i++) {
        let itemVNodes = [] // 数组中1个item的虚节点
        for (let j = 0; j < fieldNum; j++) {
          let fieldVNodes = this._children[j] // 一类字段的虚节点
          if (Array.isArray(fieldVNodes)) itemVNodes.push(fieldVNodes[i])
        }
        /**数组的一个项目*/
        // 针对一个项目的操作
        let itemActionsVNode = h(
          'div',
          { class: ['jdoc__nest__item__actions'] },
          [itemRemoveVNode(fieldValue, i)]
        )
        let itemNestVNode = h('div', { class: ['tvu-jdoc__nest__item'] }, [
          itemVNodes,
          itemActionsVNode,
        ])
        itemNestVNodes.push(itemNestVNode)
      }
    }

    const children = [...itemNestVNodes, itemAddVNode(ctx, field)]

    return children
  }
}
