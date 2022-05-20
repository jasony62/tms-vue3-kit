import { VNode } from 'vue'
import { Node } from './node'
import { Input } from './input'
import { components } from '.'

export class Select extends Input {
  /**
   *
   */
  options(attrsOrProps: any): any {
    const { field } = this
    const fieldName = field.name
    const fieldValue = this.fieldValue()

    let opts = {
      name: field.fullname,
      class: ['tvu-jdoc__field-input'],
      value: fieldValue,
      onChange: (event: any) => {
        const newValue = event && event.target ? event.target.value : event
        this.updateModel(newValue)
      },
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
      if (field.itemType) {
        const node = new Node(this.ctx, components[field.itemType])
        node.attrOrProps = () => {
          return { value: '' }
        }
        children.push(node.createElem())
      }
    }
    field.items?.forEach((item) => {
      /**关联的可见性*/
      if (field.itemVisible) {
        let optionVG = item.group + item.value
        if (field.itemVisible[optionVG] === false) return
      }
      if (field.itemType) {
        const node = new Node(this.ctx, components[field.itemType])
        node.attrOrProps = () => {
          return { value: item.value }
        }
        children.push(node.createElem([item.label]))
      }
    })

    return children
  }
}
