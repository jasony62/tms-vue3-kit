import { FieldNode } from './fieldNode'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { VNode } from 'vue'

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
    return this._children ?? []
  }
}
