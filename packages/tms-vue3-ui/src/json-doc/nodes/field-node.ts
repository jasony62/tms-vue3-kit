import { h, nextTick, VNode } from 'vue'
import { getChild } from '@/utils'
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
  // 如果schema中指定了组件类型，直接使用
  const customComponent = field.component
    ? { tag: field.component, option: {} }
    : undefined
  // field对应的组件类型，指定or预制，有items的变成group组件
  const args = field.component
    ? customComponent
    : field.items && field.type !== 'select'
    ? components[`${field.type}group`] || defaultGroup
    : components[field.type] || defaultInput

  return args
}

/**
 * 表单中的模型属性节点包含value
 */
export abstract class FieldNode extends Node {
  field: Field

  constructor(ctx: FormContext, field: Field) {
    super(ctx, getRawCreateArgs(field))
    this.field = field
    this.assocEnum()
    /**
     * 通过API自动更新数据
     * 每次有数据更新都会调用，这样对性能有影响，是否可以缓存数据？
     */
    nextTick(() => {
      this.outerValue()
    })
  }
  /**
   * 获得当前字段在数据对象中的值，或默认值
   */
  fieldValue() {
    const { field } = this
    const fieldName = field.fullname
    let fieldValue = getChild(this.ctx.editDoc, fieldName)
    fieldValue ??= field.value

    return fieldValue
  }
  /**
   * 根据依赖关系获得可用的选项
   */
  private assocEnum() {
    const { field } = this
    const doc = this.ctx.editDoc
    const oKey = field.fullname
    if (field.enumGroups?.length && field.items?.length) {
      field.itemVisible = {}
      /**依次执行匹配规则*/
      field.enumGroups.forEach((enumGroup) => {
        let { assocEnum } = enumGroup
        if (!assocEnum?.property || !assocEnum?.value) return

        if (doc[assocEnum.property] !== assocEnum.value) {
          field.items?.forEach((oOption) => {
            if (oOption.group === enumGroup.id) {
              let id = oOption.group + oOption.value
              field.itemVisible[id] = false
              /**选项不可见处理数据对象的值*/
              if (field.schemaType === 'string') {
                if (doc[oKey] === oOption.value) {
                  doc[oKey] = doc[oKey] ? doc[oKey] : ''
                }
              } else {
                if (
                  doc[oKey] &&
                  doc[oKey].includes(oOption.value)
                  // id === false
                ) {
                  let index = doc[oKey].indexOf(oOption.value)
                  doc[oKey].splice(index)
                }
              }
            }
          })
        } else {
          field.items?.forEach((oOption) => {
            if (oOption.group === enumGroup.id) {
              let id = oOption.group + oOption.value
              field.itemVisible[id] = true
            }
          })
        }
      })
    }
  }
  /**
   * 动态获取字段的值
   */
  private outerValue() {
    const { editDoc, onAxios } = this.ctx
    const { field } = this
    if (!field.scheamProp.eventDependency) return
    /**构造查询参数*/
    const { rule } = field.scheamProp.eventDependency
    let postData = rule.params.reduce((c: any, p) => {
      c[p] = { feature: 'start', keyword: editDoc[p] }
      return c
    }, {})

    /**获取数据*/
    const fieldName = field.name
    onAxios?.()
      .post(rule.url, { filter: postData })
      .then((rst: any) => {
        const data = rst.data.result.docs ?? rst.data.result
        if (rule.type === 'v1') {
          /**返回的是值*/
          editDoc[fieldName] = Array.isArray(data)
            ? data?.[0][fieldName]
            : data[fieldName]
        } else if (rule.type === 'v2') {
          /**返回的是选项*/
          let arr: any = []
          if (Array.isArray(data)) {
            data.forEach((item: any) => {
              let value = item[fieldName]
              arr.push({ label: value, value: value })
            })
            if (data.length === 1) {
              editDoc[fieldName] = arr[0].value
            }
          }
          field.items = arr
        }
      })
      .catch(() => {
        // setErrorMessage('数据解析错误')
      })
  }

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
    const node = h(this.rawArgs.tag, nodeOptions, children)

    return node
  }
}
