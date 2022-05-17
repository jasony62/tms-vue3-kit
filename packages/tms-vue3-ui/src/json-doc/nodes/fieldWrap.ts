import { h, VNode } from 'vue'
import { FormContext } from '../builder'
import { FieldNode } from './fieldNode'
import { Node, components } from './index'
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

    return children
  }

  createElem(): VNode {
    const { field } = this

    const options = {
      name: field.name,
      'data-required-field': field.required ? 'true' : 'false',
      class: ['tvu-jdoc__field'],
    }

    if (field.visible === false) {
      options.class.push('tvu-jdoc__field--hide')
    }

    // 获得子节点的内容
    let children = this.children()

    const element = h(this.rawArgs.tag, options, children)

    return element
  }
}
