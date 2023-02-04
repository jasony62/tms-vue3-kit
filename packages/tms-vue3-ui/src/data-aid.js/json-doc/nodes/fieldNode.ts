import _ from 'lodash'
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
    field.choices && field.type !== 'select'
      ? components[`${field.type}group`] || defaultGroup
      : components[field.type] || defaultInput

  return args
}

/**
 * 表单中的模型属性节点包含value
 */
export abstract class FieldNode<VNode> extends Node<VNode> {
  _field: Field

  constructor(ctx: FormContext<VNode>, field: Field) {
    super(ctx, getRawCreateArgs(field))
    this._field = field
    this._assocEnum()
    /**
     * 通过API自动更新数据
     * 每次有数据更新都会调用，这样对性能有影响，是否可以缓存数据？
     */
    // nextTick(() => {
    //   this._autofileValue()
    // })
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
    let fieldValue
    // fieldValue = this.ctx.editDoc.get(fieldName)
    fieldValue = this.ctx.editDoc.get2(fieldName)
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
    if (field.enumGroups?.length && field.choices?.length) {
      field.choiceVisible = {}
      /**依次执行匹配规则*/
      field.enumGroups.forEach((enumGroup) => {
        let { assocEnum } = enumGroup // 分组依赖的选项
        if (!assocEnum?.property || !assocEnum?.value) return
        // 在文档中检查，依赖的属性值是否和指定的值一致
        if (doc.get(assocEnum.property) !== assocEnum.value) {
          // 分组条件不满足，将分组下的选项设置为不可见
          field.choices?.forEach((oChoice) => {
            if (oChoice.group === enumGroup.id) {
              let id = oChoice.group + oChoice.value
              if (field.choiceVisible) field.choiceVisible[id] = false
              /**选项不可见，清除数据对象中对应的值*/
              let docVal = doc.get(key)
              if (field.schemaType === 'string') {
                // 字段是字符串
                if (docVal === oChoice.value) doc.set(key, '')
              } else {
                // 字段是数组
                if (Array.isArray(docVal) && docVal.includes(oChoice.value)) {
                  let index = docVal.indexOf(oChoice.value)
                  docVal.splice(index, 1)
                }
              }
            }
          })
        } else {
          // 分组条件成立，将分组下的选项设置为可见
          field.choices?.forEach((oOption) => {
            if (oOption.group === enumGroup.id) {
              let id = oOption.group + oOption.value
              if (field.choiceVisible) field.choiceVisible[id] = true
            }
          })
        }
      })
    }
  }

  private _autofileValue() {
    const { editDoc, autofillRequest } = this.ctx

    if (typeof autofillRequest !== 'function') {
      return
    }

    const { field } = this

    // 没有指定自动填充数据规则
    if (!field.schemaProp.attrs.autofill) return

    // 如果字段是等待渲染的状态，该次渲染就不需要再次通过api获取的数据
    if (field.waitingRender) {
      field.waitingRender = false
      return
    }

    const rule = field.schemaProp.attrs.autofill

    /**只在创建时调用1次*/
    if (rule.runPolicy === 'onCreate' && field.autofilled === true) {
      return
    }

    const handleResult = (rst: any) => {
      if (rule.target === 'value' && typeof rule.valuePath === 'string') {
        /**返回的是值*/
        let val = _.get(rst, rule.valuePath)
        this.autofillValue(field, val)
      } else if (rule.target === 'items' && typeof rule.itemPath === 'object') {
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
        if (!_.isEqual(field.choices, arr)) {
          field.choices = arr
          if (arr.length === 1) {
            // 选项唯一时自动赋值
            this.autofillValue(field, arr[0].value)
          }
          // 标记字段等待渲染，避免重复调用接口
          field.waitingRender = true
          this.ctx.editDoc.forceRender()
        }
      }
    }

    /**从外部获取数据*/
    let url = rule.url
    if (Array.isArray(rule.params) && rule.params.length) {
      let urlParams = rule.params.reduce((c: string, p, index) => {
        let { name, path, value } = p
        let pair
        if (path) pair = `${name}=${editDoc.get(path) ?? ''}`
        else if (value) pair = `${name}=${value}`
        else pair = ''

        return index === 0 ? pair : `${c}&${pair}`
      }, '')
      url += '?' + urlParams
    }

    const http = autofillRequest()

    if (/get/i.test(rule.method)) {
      // GET请求比较url是否相等，判断是否需要重复获取数据
      if (url === field.autofillURL) return
      http
        .get(url)
        .then(handleResult)
        .catch(() => {
          this.ctx.onMessage('通过接口获取自动填充数据失败')
        })
    } else if (/post/i.test(rule.method)) {
      /**构造查询参数*/
      let body
      if (Array.isArray(rule.body) && rule.body.length) {
        body = rule.body.reduce((c: any, p) => {
          let { bodyPath, path, value } = p
          if (path) _.set(c, bodyPath, editDoc.get(path))
          else if (value) _.set(c, bodyPath, value)
          return c
        }, {})
      }
      /**如果依赖的参数没有发生变化，就不进行调用*/
      if (field.autofillBody) {
        if (_.isEqual(field.autofillBody, body)) {
          return
        }
      }
      // 记录调用状态
      field.autofillBody = body

      http
        .post(rule.url, body)
        .then(handleResult)
        .catch(() => {
          this.ctx.onMessage('通过接口获取自动填充数据失败')
        })
    }
    // 记录接口调用状态
    field.autofillURL = url
    field.autofilled = true
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
    this._vnode = this.ctx.h(this.rawArgs.tag, nodeOptions, children)

    if (field.type === 'password') {
      function toggleClass() {
        const inputEle = document.querySelector('.tvu-jdoc__password > input')
        const spanEle = document.querySelector('.tvu-jdoc__password > span')
        if (inputEle?.getAttribute('type') === 'password') {
          inputEle?.setAttribute('type', 'text')
          if (spanEle) spanEle.className = 'tvu-jdoc__password--open'
        } else {
          inputEle?.setAttribute('type', 'password')
          if (spanEle) spanEle.className = 'tvu-jdoc__password--close'
        }
      }
      let spanVnode = this.ctx.h('span', {
        class: 'tvu-jdoc__password--close',
        onClick: toggleClass,
      })

      this._vnode = this.ctx.h('div', { class: 'tvu-jdoc__password' }, [
        this._vnode,
        spanVnode,
      ])
    }

    return this._vnode
  }
}
