import { h, toRaw, VNode } from 'vue'
import { getChild, setChild } from '@/utils'
import { FieldNode } from './field-node'
import { components } from '.'
import { FieldBoolean } from '../fields'
/**
 * text/radiogroup
 */
export class Input extends FieldNode {
  /**
   * 更新field对应的model数据
   */
  updateModel(newValue: any) {
    const { field } = this
    const fieldName = field.fullname
    let updatedValue
    /**设置对象的值*/
    if (field.schemaType === 'json') {
      try {
        let jsonValue = JSON.parse(newValue)
        updatedValue = jsonValue
      } catch (e) {}
    } else if (field instanceof FieldBoolean) {
      updatedValue = !getChild(this.ctx.editDoc, fieldName)
    } else if (typeof newValue === 'string') {
      updatedValue = newValue.trim()
    } else {
      updatedValue = newValue
    }
    /**修改底层数据*/
    setChild(this.ctx.editDoc, fieldName, updatedValue)
  }
  /**
   *
   *
   * @param {*} attrOrProps
   */
  options(attrOrProps: any) {
    const fieldName = this.field.name
    // 有些radio和checkbox是模拟的
    const fieldValue = this.fieldValue()

    let { type } = attrOrProps

    const inpOps: { [k: string]: any } = {
      name: fieldName,
      type,
      value: toRaw(fieldValue),
      class: ['tvu-jdoc__field-input'],
      onInput: (event: any) => {
        const { schema, editDoc } = this.ctx
        const newValue = event && event.target ? event.target.value : event
        this.updateModel(newValue)
      },
    }
    /**设置核选框的值*/
    if (this.field.type === 'checkbox' && typeof fieldValue === 'boolean') {
      inpOps.checked = fieldValue
    }

    return inpOps
  }
  /**
   * 创建radiogroup|checkboxgroup下的子节点
   * @returns 返回子节点
   */
  protected children(): VNode[] {
    const children: VNode[] = []
    if (/radio|checkbox/.test(this.field.type)) this.createItems(children)
    return children
  }
  /**
   * 加入当前节点的子节点
   * radiogroup/checkboxgroup
   */
  private createItems(children: VNode[]) {
    const { field } = this
    const fieldValue = this.fieldValue()

    field.items?.forEach((item) => {
      //TODO 需要处理选项是否可见
      if (field.itemType) {
        let props: { [k: string]: any } = {
          type: field.itemType,
          name: field.name,
          value: item.value,
          label: item.label,
        }
        if (field.type === 'radiogroup') {
          if (fieldValue === item.value) props.checked = true
        } else if (
          field.type === 'checkboxgroup' &&
          Array.isArray(fieldValue)
        ) {
          if (fieldValue.includes(item.value)) props.checked = true
        }
        // radio/checkbox
        let n1 = h(components[field.itemType].tag, props)
        // label
        let n2 = h(components.fieldLabel.tag, null, item.label)
        // wrap
        let n3 = h('div', [n1, n2])
        children.push(n3)
      }
    })
  }
}
