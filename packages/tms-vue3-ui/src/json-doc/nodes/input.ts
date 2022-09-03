import { h, toRaw, VNode } from 'vue'
import { FieldNode } from './fieldNode'
import { components } from '.'
import { Field } from '../fields'
import Debug from 'debug'

const debug = Debug('json-doc:nodes:input')
/**
 * text/json/radiogroup
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
    switch (field.schemaType) {
      case 'boolean':
        updatedValue = !this.ctx.editDoc.get(fieldName)
        /**修改底层数据*/
        this.ctx.editDoc.set(fieldName, updatedValue)
        break
      case 'json':
        try {
          let newJson = JSON.parse(newValue)
          updatedValue = newJson
          this.ctx.editDoc.set(fieldName, updatedValue)
        } catch (e) {
          // 不更新文档
        }
        break
      default:
        updatedValue = newValue.trim()
        /**修改底层数据*/
        this.ctx.editDoc.set(fieldName, updatedValue)
    }
  }
  /**
   *
   *
   * @param {*} attrOrProps
   */
  options(attrOrProps: any) {
    let { ctx, field } = this
    const fieldName = field.fullname
    const fieldValue = this.fieldValue()
    debug(
      `字段【${fieldName}】的值为：\n${JSON.stringify(fieldValue, null, 2)}`
    )
    let { type } = attrOrProps

    const onInput = (event: any) => {
      const newValue = event && event.target ? event.target.value : event
      this.updateModel(newValue)
    }

    const inpOps: { [k: string]: any } = {
      name: fieldName,
      type,
      value: toRaw(fieldValue),
      class: ['tvu-jdoc__field-input tvu-input'],
    }
    inpOps.onInput = onInput
    if (typeof ctx.onNodeFocus === 'function')
      inpOps.onFocus = () => {
        if (ctx.onNodeFocus) ctx.onNodeFocus(field)
      }
    if (typeof ctx.onNodeBlur === 'function')
      inpOps.onBlur = () => {
        if (ctx.onNodeBlur) ctx.onNodeBlur(field)
      }
    if (field.schemaProp.attrs.readonly === true) {
      inpOps.readonly = true
    }
    /**设置核选框的值*/
    if (field.type === 'checkbox' && typeof fieldValue === 'boolean') {
      inpOps.checked = fieldValue
    } else if (field.type === 'text') {
      inpOps.placeholder = `请输入: ${fieldName}`
    }

    return inpOps
  }
  /**获得外部时*/
  protected autofillValue(field: Field, val: any): void {
    if (this._vnode?.el) {
      let { el } = this._vnode
      el.value = val
      // 不需要触发渲染
      this.ctx.editDoc.set(field.fullname, val, false)
    }
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
          name: field.fullname,
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
