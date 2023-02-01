import { FormContext } from '../builder'
import { components, Node } from './index'
/**
 *
 */
export class FormNode<VNode> extends Node<VNode> {
  constructor(
    ctx: FormContext,
    h: (type: string, props?: any, children?: any) => VNode
  ) {
    super(ctx, components.form, h)
  }

  createElem(children: (VNode | string)[] = []): VNode {
    const nodeOptions = {
      ref: '__form',
      class: ['tvu-jdoc__form'],
    }

    this._vnode = this.h(this.rawArgs.tag, nodeOptions, children)

    return this._vnode
  }
}
