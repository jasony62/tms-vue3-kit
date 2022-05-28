import _ from 'lodash'
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

  private _autofileValue() {
    const { editDoc, onAutofill } = this.ctx
    const { field } = this

    // 没有指定自动填充数据规则
    if (!field.scheamProp.attrs.autofill) return

    // 如果字段是等待渲染的状态，该次渲染就不需要再次通过api获取的数据
    if (field.waitingRender) {
      field.waitingRender = false
      return
    }

    const rule = field.scheamProp.attrs.autofill

    /**只在创建时调用1次*/
    if (rule.runPolicy === 'onCreate' && field.autofilled === true) {
      return
    }

    /**构造查询参数*/
    const params = rule.params.reduce((c: any, p) => {
      c[p] = { feature: 'start', keyword: editDoc.get(p) }
      return c
    }, {})
    /**如果依赖的参数没有发生变化，就不进行调用*/
    if (field.autofillParams) {
      if (_.isEqual(field.autofillParams, params)) {
        return
      }
    }
    field.autofillParams = params
    field.autofilled = true

    /**从外部获取数据*/
    onAutofill?.()
      .post(rule.url, { filter: params })
      .then((rst: any) => {
        if (rule.target === 'value' && typeof rule.valuePath === 'string') {
          /**返回的是值*/
          let val = _.get(rst, rule.valuePath)
          this.autofillValue(field, val)
        } else if (
          rule.target === 'items' &&
          typeof rule.itemPath === 'object'
        ) {
          /**返回的是选项*/
          const data = _.get(rst, rule.itemPath.path)
          let arr: any = []
          if (Array.isArray(data) && data.length) {
            let labelPath = rule.itemPath.label
            let valuePath = rule.itemPath.value
            data.forEach((item: any) => {
              arr.push({
                label: _.get(item, labelPath),
                value: _.get(item, valuePath),
              })
            })
          }
          // 只有数据发生变化才触发渲染
          if (!_.isEqual(field.items, arr)) {
            field.items = arr
            if (arr.length === 1) {
              // 选项唯一时自动赋值
              this.autofillValue(field, arr[0].value)
            }
            // 标记字段等待渲染，避免重复调用接口
            field.waitingRender = true
            this.ctx.editDoc.forceRender()
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
