import { h, VNode } from 'vue'
import { components } from './index'
import { FieldNode } from './fieldNode'
import { Field } from '../fields'
import { FormContext } from '../builder'

const itemAddVNode = (ctx: FormContext, field: Field) => {
  let addVNode = h(
    components.button.tag,
    {
      name: field.fullname,
      class: ['tvu-button'],
      onClick: () => {
        const fieldValue = ctx.editDoc.init(field.fullname, [])
        if (Array.isArray(fieldValue)) {
          switch (field.itemSchemaType) {
            case 'string':
              ctx.editDoc.appendAt(field.fullname, '')
              break
            case 'object':
              ctx.editDoc.appendAt(field.fullname, {})
              break
            case 'array':
              ctx.editDoc.appendAt(field.fullname, [])
              break
            default:
              ctx.editDoc.appendAt(field.fullname, undefined)
          }
        }
      },
    },
    '添加数组项目'
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNode)
}

const itemInsertVNode = (ctx: FormContext, field: Field, index: number) => {
  let fullname = `${field.fullname}[${index}]`
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button'],
      onClick: () => {
        switch (field.itemSchemaType) {
          case 'string':
            ctx.editDoc.insertAt(fullname, '')
            break
          case 'object':
            ctx.editDoc.insertAt(fullname, {})
            break
          case 'array':
            ctx.editDoc.insertAt(fullname, [])
            break
          default:
            ctx.editDoc.insertAt(fullname, undefined)
        }
      },
    },
    '插入属性'
  )
}

const itemRemoveVNode = (ctx: FormContext, field: Field, index: number) => {
  let fullname = `${field.fullname}[${index}]`
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button'],
      onClick: () => {
        ctx.editDoc.remove(fullname)
      },
    },
    '删除属性'
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
        [itemInsertVNode(ctx, field, index), itemRemoveVNode(ctx, field, index)]
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
