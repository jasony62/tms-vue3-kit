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
    const { ctx: vm } = this
    // let { autoComplete, noValidate } = vm
    // const attrOrProps = this.attrOrProps({
    //   autoComplete,
    //   noValidate,
    // })

    const nodeOptions = {
      ref: '__form',
      // onSubmit: (event: any) => {
      //   event.stopPropagation()
      //   vm.submit(event)
      // },
      // onInvalid: vm.invalid,
      class: ['tvu-jdoc__form'],
      // ...attrOrProps,
    }

    this._vnode = h(this.rawArgs.tag, nodeOptions, children)

    return this._vnode
  }
}
