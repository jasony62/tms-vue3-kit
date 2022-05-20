import { h, VNode } from 'vue'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { FieldNode } from './fieldNode'
import { Node, components } from './index'

const fieldNameVNode = (field: Field) => {
  return h('div', {}, field.name)
}

const fieldRemoveVNode = (field: Field) => {
  return h(
    components.button.tag,
    {
      name: field.fullname,
      onClick: () => {},
    },
    '删除'
  )
}
/**
 *
 */
export class FieldWrap extends Node {
  fieldNode
  constructor(ctx: FormContext, fieldNode: FieldNode) {
    super(ctx, components.fieldWrap)
    this.fieldNode = fieldNode
  }

  get field() {
    return this.fieldNode.field
  }

  protected children(): VNode[] {
    const children = []
    const { field } = this
    if (field.label) {
      children.push(
        h(
          components.fieldLabel.tag,
          {
            class: ['tvu-jdoc__field-label'],
          },
          field.label
        )
      )
    }
    if (field.scheamProp.isPattern) {
      children.push(fieldNameVNode(field))
    }

    children.push(this.fieldNode.createElem())

    if (field.description) {
      children.push(
        h(
          components.fieldDescription.tag,
          { class: ['tvu-jdoc__field-desc'] },
          field.description
        )
      )
    }

    if (field.scheamProp.isPattern) {
      children.push(fieldRemoveVNode(field))
    }

    return children
  }

  createElem(): VNode {
    const { field } = this

    // 获得子节点的内容
    let children = this.children()

    const vnodes = [...children]

    const options = {
      name: field.fullname,
      class: ['tvu-jdoc__field'],
    }
    if (field.required) {
      Object.assign(options, { 'data-required-field': 'true' })
    }
    if (field.scheamProp.isPattern) {
      Object.assign(options, { 'data-optinal-field': 'true' })
    }
    if (field.visible === false) {
      options.class.push('tvu-jdoc__field--hide')
    }

    this._vnode = h(this.rawArgs.tag, options, vnodes)

    return this._vnode
  }
}
