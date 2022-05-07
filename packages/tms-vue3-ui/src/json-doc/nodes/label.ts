import { h, VNode } from 'vue'
import { FormContext } from '../builder'
import { Node, components } from './index'
/**
 *
 */
export class LabelNode extends Node {
  field: any

  constructor(ctx: FormContext, field: any) {
    super(ctx, components.label)
    this.field = field
  }

  createElem(children: (VNode | string)[] = []): VNode {
    const { field } = this

    const options = {
      name: field.name,
      class: ['tvu-jdoc__node tvu-jdoc__node--label'],
    }

    if (field.visible === false) {
      options.class.push('tvu-jdoc__node--hide')
    }

    const element = h(this.rawArgs.tag, options, children)

    return element
  }
}
