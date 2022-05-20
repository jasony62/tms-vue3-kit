import { FieldNode } from './fieldNode'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { h, VNode } from 'vue'
import { components } from '.'

const itemAddVNode = (ctx: FormContext, field: Field) => {
  let addVNode = h(
    components.button.tag,
    {
      name: field.fullname,
      onClick: () => {
        // const fieldValue = ctx.editDoc.get(field.fullname, {})
      },
    },
    '添加'
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNode)
}

export class ObjectNode extends FieldNode {
  private _children

  constructor(ctx: FormContext, field: Field, children?: VNode[]) {
    super(ctx, field)
    this._children = children
  }

  options() {
    const { field } = this
    const options = {
      name: field.fullname,
      type: field.type,
      class: ['tvu-jdoc__nest'],
    }

    return options
  }
  /**
   * 如果对象中包含可选属性，需要提供添加删除属性，修改属性名称的操作。
   */
  protected children(): VNode[] {
    const { ctx, field } = this
    const hasPattern = field.scheamProp.hasPattern
    const vnodes = this._children ? [...this._children] : []

    if (hasPattern) {
      vnodes.push(itemAddVNode(ctx, field))
    }

    return vnodes
  }
}
