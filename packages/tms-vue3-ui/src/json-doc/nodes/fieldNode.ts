import { h, nextTick, VNode } from 'vue'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { components, Node } from './index'

const option = { native: true }
const defaultInput = { tag: 'input', option }
const defaultGroup = { tag: 'div', option }

/**
 * 获得创建节点的原始参数
 *
 * @param {Object} field
 */
function getRawCreateArgs(field: Field) {
  // field对应的组件类型，指定or预制，有items的变成group组件
  const args =
    field.items && field.type !== 'select'
      ? components[`${field.type}group`] || defaultGroup
      : components[field.type] || defaultInput

  return args
}

/**
 * 表单中的模型属性节点包含value
 */
export abstract class FieldNode extends Node {
  _field: Field

  constructor(ctx: FormContext, field: Field) {
    super(ctx, getRawCreateArgs(field))
    this._field = field
    this._assocEnum()
    /**
     * 通过API自动更新数据
     * 每次有数据更新都会调用，这样对性能有影响，是否可以缓存数据？
     */
    nextTick(() => {
      this._autofileValue()
    })
  }

  get field() {
    return this._field
  }

  /**
   * 获得当前字段在数据对象中的值，或默认值
   */
  fieldValue() {
    const { field } = this
    const fieldName = field.fullname
    let fieldValue = this.ctx.editDoc.get(fieldName)
    fieldValue ??= field.value

    return fieldValue
  }
  /**
   * 根据依赖关系获得可用的选项
   */
  private _assocEnum() {
    const { field, ctx } = this
    const doc = ctx.editDoc
    const key = field.fullname
    // 指定了选型分组
    if (field.enumGroups?.length && field.items?.length) {
      field.itemVisible = {}
      /**依次执行匹配规则*/
      field.enumGroups.forEach((enumGroup) => {
        let { assocEnum } = enumGroup // 分组依赖的选项
        if (!assocEnum?.property || !assocEnum?.value) return
        // 在文档中检查，依赖的属性值是否和指定的值一致
        if (doc.get(assocEnum.property) !== assocEnum.value) {
          // 分组条件不满足，将分组下的选项设置为不可见
          field.items?.forEach((oOption) => {
            if (oOption.group === enumGroup.id) {
              let id = oOption.group + oOption.value
              if (field.itemVisible) field.itemVisible[id] = false
              /**选项不可见，清除数据对象中对应的值*/
              let docVal = doc.get(key)
              if (field.schemaType === 'string') {
                // 字段是字符串
                if (docVal === oOption.value) doc.set(key, '')
              } else {
                // 字段是数组
                if (Array.isArray(docVal) && docVal.includes(oOption.value)) {
                  let index = docVal.indexOf(oOption.value)
                  docVal.splice(index, 1)
                }
              }
            }
          })
        } else {
          // 分组条件成立，将分组下的选项设置为可见
          field.items?.forEach((oOption) => {
            if (oOption.group === enumGroup.id) {
              let id = oOption.group + oOption.value
              if (field.itemVisible) field.itemVisible[id] = true
            }
          })
        }
      })
    }
  }
  /**
   * 从外部数据源获取字段的值
   */
  // private _autofileValue() {
  //   const { editDoc, onAutofill } = this.ctx
  //   const { field } = this
  //   if (!field.scheamProp.eventDependency) return
  //   /**构造查询参数*/
  //   const { rule } = field.scheamProp.eventDependency
  //   let postData = rule.params.reduce((c: any, p) => {
  //     c[p] = { feature: 'start', keyword: editDoc.get(p) }
  //     return c
  //   }, {})
  //   /**获取数据*/
  //   const fieldName = field.name
  //   onAutofill?.()
  //     .post(rule.url, { filter: postData })
  //     .then((rst: any) => {
  //       const data = rst.data.result.docs ?? rst.data.result
  //       if (rule.type === 'v1') {
  //         /**返回的是值*/
  //         let val = Array.isArray(data) ? data?.[0][fieldName] : data[fieldName]
  //         this.autofillValue(field, val)
  //       } else if (rule.type === 'v2') {
  //         /**返回的是选项*/
  //         let arr: any = []
  //         if (Array.isArray(data)) {
  //           data.forEach((item: any) => {
  //             let value = item[fieldName]
  //             arr.push({ label: value, value: value })
  //           })
  //         }
  //         field.items = arr
  //         if (arr.length === 1) {
  //           // 选项唯一时自动赋值
  //           this.autofillValue(field, arr[0].value)
  //         }
  //       }
  //     })
  //     .catch(() => {
  //       this.ctx.onMessage('数据解析错误')
  //     })
  // }

  private _autofileValue() {
    const { editDoc, onAutofill } = this.ctx
    const { field } = this
    if (!field.scheamProp.attrs.autofill) return
    /**构造查询参数*/
    const rule = field.scheamProp.attrs.autofill
    let postData = rule.params.reduce((c: any, p) => {
      c[p] = { feature: 'start', keyword: editDoc.get(p) }
      return c
    }, {})
    /**获取数据*/
    const fieldName = field.name
    onAutofill?.()
      .post(rule.url, { filter: postData })
      .then((rst: any) => {
        console.log('xxxxx', rst)
        const data = rst.data.result.docs ?? rst.data.result
        if (rule.target === 'value') {
          /**返回的是值*/
          let val = Array.isArray(data) ? data?.[0][fieldName] : data[fieldName]
          this.autofillValue(field, val)
        } else if (rule.target === 'items') {
          /**返回的是选项*/
          let arr: any = []
          if (Array.isArray(data)) {
            data.forEach((item: any) => {
              let value = item[fieldName]
              arr.push({ label: value, value: value })
            })
          }
          field.items = arr
          if (arr.length === 1) {
            // 选项唯一时自动赋值
            this.autofillValue(field, arr[0].value)
          }
        }
      })
      .catch(() => {
        this.ctx.onMessage('数据解析错误')
      })
  }

  /**获得外部值时进行回调*/
  protected autofillValue(field: Field, val: any): void {}

  /**提供渲染函数的参数*/
  abstract options(attrsOrProps: any): any

  /**
   * 当前节点的子节点数组
   */
  protected children(): VNode[] {
    return []
  }

  /**
   * 创建field对应的vnode
   *
   * 这是1个模板方法
   */
  createElem(): VNode {
    const { field } = this

    // TODO 这里有问题，不是所有的值都需要
    const attrOrProps = this.attrOrProps(field, field)

    // 需要提供给node
    const nodeOptions = this.options(attrOrProps)

    // 获得子节点的内容
    let children = this.children()

    // 生成节点
    this._vnode = h(this.rawArgs.tag, nodeOptions, children)

    return this._vnode
  }
}
