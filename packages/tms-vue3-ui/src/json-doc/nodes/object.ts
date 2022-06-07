import { FieldNode } from './fieldNode'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { h, VNode } from 'vue'
import { components } from '.'
import RandExp from 'randexp'
import Debug from 'debug'

const debug = Debug('json-doc')

/**
 * 添加子属性操作
 * @param ctx
 * @param field
 * @returns
 */
const itemAddVNode = (ctx: FormContext, field: Field) => {
  let addVNodes = field.scheamProp.patternChildren?.map((childProp) =>
    h(
      components.button.tag,
      {
        name: childProp.fullname,
        class: ['tvu-button'],
        onClick: () => {
          let randexp = new RandExp(new RegExp(childProp.name))
          randexp.max = 8
          let newKey = randexp.gen()
          switch (childProp.attrs.type) {
            case 'string':
              ctx.editDoc.appendAt(field.fullname, '', newKey)
              break
            case 'object':
              ctx.editDoc.appendAt(field.fullname, {}, newKey)
              break
            case 'array':
              ctx.editDoc.appendAt(field.fullname, [], newKey)
              break
          }
        },
      },
      `添加-${childProp.attrs.title ?? childProp.name}`
    )
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNodes)
}

export class ObjectNode extends FieldNode {
  private _children

  constructor(ctx: FormContext, field: Field, children?: VNode[]) {
    super(ctx, field)
    this._children = children
    debug(
      `字段【${field.fullname}】构造节点对象，包含【${children?.length}】个子节点`
    )
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
    const vnodes = this._children ? [...this._children] : []

    if (field.scheamProp.patternChildren?.length) {
      vnodes.push(itemAddVNode(ctx, field))
    }

    return vnodes
  }
}
