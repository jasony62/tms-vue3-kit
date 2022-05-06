import { h, toRaw, VNode } from 'vue'
import { initChild, setChild } from '../../utils'
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
    // 去掉开头的$
    const path = fieldName.split('.').slice(1)
    const name = path.pop()
    if (name) {
      let updatedValue
      // 获得底层数据对象
      const formModel =
        path.length > 0 ? initChild(this.ctx.editDoc, path) : this.ctx.editDoc
      /**设置对象的值*/
      if (field.schemaType === 'json') {
        try {
          let jsonValue = JSON.parse(newValue)
          updatedValue = jsonValue
        } catch (e) {}
      } else if (field instanceof FieldBoolean) {
        updatedValue = !formModel[name]
      } else {
        if (typeof newValue === 'string') updatedValue = newValue.trim()
        else updatedValue = newValue
      }
      setChild(this.ctx.editDoc, fieldName.split('.').slice(1), updatedValue)
    }
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
      class: ['tvu-jdoc__input'],
      onInput: (event: any) => {
        // const { schema, fields, editDoc, onAxios, setErrorMessage } = this.ctx
        const { schema, editDoc } = this.ctx
        const newValue = event && event.target ? event.target.value : event
        this.updateModel(newValue)
        // this.vm.$emit('input', editDoc)
        // if (this.field.assocs) {
        //   for (let i = 0; i < this.field.assocs.length; i++) {
        //     let oDep, oRule
        //     oDep = this.field.assocs[i]
        //     oRule = schema.eventDependencies[oDep].rule
        //     editDoc[oDep] = ''
        //     let postData = {}
        //     oRule.params.forEach((param) => {
        //       postData[param] = {
        //         feature: 'start',
        //         keyword: editDoc[param],
        //       }
        //     })
        //     onAxios()
        //       .post(oRule.url, { filter: postData })
        //       .then((rst) => {
        //         const data = rst.data.result.docs || rst.data.result
        //         if (oRule.type === 'v1') {
        //           editDoc[oDep] = data[0][oDep] || data[oDep]
        //         } else if (oRule.type === 'v2') {
        //           let arr = []
        //           data.forEach((item) => {
        //             let value = item[oDep]
        //             arr.push({ label: value, value: value })
        //           })
        //           fields[oDep].items = arr
        //           if (data.length === 1) {
        //             editDoc[oDep] = arr[0].value
        //           }
        //         }
        //       })
        //       .catch(() => {
        //         setErrorMessage('数据解析错误')
        //       })
        //   }
        // }
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
  children(): VNode[] {
    const children: VNode[] = []
    if (/radio|checkbox/.test(this.field.type)) this.createItems(children)
    return children
  }
  /**
   * 加入当前节点的子节点
   * radiogroup/checkboxgroup
   */
  createItems(children: VNode[]) {
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
        let n2 = h(components.label.tag, null, item.label)
        // wrap
        let n3 = h('div', [n1, n2])
        children.push(n3)
      }
    })
  }
}
