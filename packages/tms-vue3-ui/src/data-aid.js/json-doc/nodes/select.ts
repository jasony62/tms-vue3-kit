import { Node } from './node'
import { Input } from './input'
import { components } from '.'

export class Select<VNode> extends Input<VNode> {
  /**
   *
   */
  options(attrsOrProps: any): any {
    const { field } = this
    const fieldValue = this.fieldValue()

    let opts: any = {
      name: field.fullname,
      class: ['tvu-jdoc__field-input tvu-input'],
      value: fieldValue,
      onChange: (event: any) => {
        const newValue = event && event.target ? event.target.value : event
        this.updateModel(newValue)
      },
    }
    if (field.schemaProp.attrs.readonly === true) {
      opts.disabled = true
    }

    return opts
  }
  /**
   * select中的option节点
   */
  protected children(): VNode[] {
    const children: VNode[] = []
    const { field } = this
    // 非必填时添加空选项
    if (!field.required) {
      if (field.choiceType) {
        const node = new Node<VNode>(
          this.ctx,
          components[field.choiceType],
          this.h
        )
        node.attrOrProps = () => {
          return { value: '' }
        }
        children.push(node.createElem())
      }
    }
    field.choices?.forEach((choice) => {
      /**关联的可见性*/
      if (field.choiceVisible) {
        let choiceVG = choice.group + choice.value
        if (field.choiceVisible[choiceVG] === false) return
      }
      if (field.choiceType) {
        const node = new Node<VNode>(
          this.ctx,
          components[field.choiceType],
          this.h
        )
        node.attrOrProps = () => {
          return { value: choice.value }
        }
        children.push(node.createElem([choice.label]))
      }
    })

    return children
  }
}
