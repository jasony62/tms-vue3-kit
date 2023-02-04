import { FormContext } from '../builder'
import { components, Node } from './index'
/**
 *
 */
export class FormNode<VNode> extends Node<VNode> {
  constructor(ctx: FormContext<VNode>) {
    super(ctx, components.form)
  }

  createElem(children: (VNode | string)[] = []): VNode {
    const nodeOptions = {
      ref: '__form',
      class: ['tvu-jdoc__form'],
    }

    this._vnode = this.ctx.h(this.rawArgs.tag, nodeOptions, children)

    return this._vnode
  }
}
