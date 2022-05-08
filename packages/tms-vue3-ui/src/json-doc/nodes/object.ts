import { FieldNode } from './field-node'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { VNode } from 'vue'

export class ObjectNode extends FieldNode {
  private _children

  constructor(ctx: FormContext, field: Field, children?: (VNode | VNode[])[]) {
    super(ctx, field)
    this._children = children
  }

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
    const children: VNode[] = []

    this._children?.forEach((c) => {
      // 应该不会出现这种情况
      if (Array.isArray(c)) return
      children.push(c)
    })

    return children
  }
}
