import { h, VNode } from 'vue'
import { FormContext } from '../builder'
import { components, Node } from './index'
/**
 *
 */
export class FormNode extends Node {
  constructor(ctx: FormContext) {
    super(ctx, components.form)
  }

  createElem(children: (VNode | string)[] = []): VNode {
    const nodeOptions = {
      ref: '__form',
      class: ['tvu-jdoc__form'],
    }

    this._vnode = h(this.rawArgs.tag, nodeOptions, children)

    return this._vnode
  }
}
