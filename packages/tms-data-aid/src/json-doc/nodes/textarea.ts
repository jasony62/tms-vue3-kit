import { Input } from './input.js'

export class Textarea<VNode> extends Input<VNode> {
  /**
   *
   * @param {*} attrOrProps
   */
  options(attrOrProps: any) {
    const nodeOptions = super.options(attrOrProps)
    // if (this.rawArgs.option.native) {
    const fieldValue = this.fieldValue()
    // nodeOptions.domProps.innerHTML = fieldValue
    if (typeof fieldValue === 'string') {
      nodeOptions.value = fieldValue
    } else {
      nodeOptions.value = JSON.stringify(fieldValue, null, 2)
    }
    // }

    return nodeOptions
  }
}
