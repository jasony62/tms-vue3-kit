import { h, VNode, nextTick } from 'vue'
import { components } from './index'
import { FieldNode } from './fieldNode'
import { Field } from '../fields'
import { FormContext } from '../builder'

const itemAddVNode = (ctx: FormContext, field: Field) => {
  let addVNode = h(
    components.button.tag,
    {
      name: field.fullname,
      onClick: () => {
        const fieldValue = ctx.editDoc.init(field.fullname, [])
        if (Array.isArray(fieldValue)) {
          switch (field.itemSchemaType) {
            case 'string':
              ctx.editDoc.appendAt(field.fullname, '')
              break
            case 'object':
              ctx.editDoc.appendAt(field.fullname, { time: '2003' })
              break
          }
        }
      },
    },
    '添加'
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNode)
}

const itemRemoveVNode = (ctx: FormContext, field: Field, index: number) => {
  let fullname = `${field.fullname}[${index}]`
  return h(
    components.button.tag,
    {
      name: fullname,
      onClick: () => {
        ctx.editDoc.remove(fullname)
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
      name: field.fullname,
      class: ['tvu-jdoc__nest'],
    }

    return options
  }

  protected children(): VNode[] {
    const { ctx, field } = this

    const itemNestVNodes: VNode[] = []

    this._children.forEach((child, index) => {
      let itemVNodes = [] // 数组中1个item的虚节点
      itemVNodes.push(child)
      let itemActionsVNode = h(
        'div',
        { class: ['jdoc__nest__item__actions'] },
        [itemRemoveVNode(ctx, field, index)]
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
