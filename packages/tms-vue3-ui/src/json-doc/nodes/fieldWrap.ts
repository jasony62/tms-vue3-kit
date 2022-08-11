import RandExp from 'randexp'
import { h, VNode } from 'vue'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { FieldNode } from './fieldNode'
import { Node, components } from './index'

import Debug from 'debug'

const debug = Debug('json-doc:fieldWrap')

/**用户指定的字段名称*/
const fieldNameVNode = (ctx: FormContext, field: Field) => {
  let inp = h('input', {
    class: ['tvu-input'],
    value: field.name,
    onInput: (event: any) => {
      const newName = event && event.target ? event.target.value : event
      if (field.scheamProp.isPattern) {
        // 如果是正则表达式定义的属性名，检查名称是否符合要求
        if (!new RegExp(field.scheamProp.name).test(newName)) {
          if (inp.el) inp.el.value = field.name
          return
        }
      }
      ctx.editDoc.rename(field.fullname, newName)
    },
  })

  return h(
    'div',
    { name: field.scheamProp.name, class: ['tvu-jdoc__field-name'] },
    [inp]
  )
}

const fieldInsertVNode = (ctx: FormContext, field: Field) => {
  let { fullname } = field
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button'],
      onClick: () => {
        let randexp = new RandExp(new RegExp(field.scheamProp.name))
        randexp.max = 8
        let newKey = randexp.gen()
        debug(`执行【插入属性】，随机属性名：${newKey}`)
        switch (field.scheamProp.attrs.type) {
          case 'string':
            ctx.editDoc.insertAt(fullname, '', newKey)
            break
          case 'json':
            ctx.editDoc.insertAt(fullname, '', newKey)
            break
          case 'object':
            ctx.editDoc.insertAt(fullname, {}, newKey)
            break
          case 'array':
            ctx.editDoc.insertAt(fullname, [], newKey)
            break
          default:
            ctx.editDoc.insertAt(fullname, undefined, newKey)
        }
      },
    },
    '插入属性'
  )
}

const fieldRemoveVNode = (ctx: FormContext, field: Field) => {
  return h(
    components.button.tag,
    {
      name: field.fullname,
      class: ['tvu-button'],
      onClick: () => {
        ctx.editDoc.remove(field.fullname)
      },
    },
    `删除-${field.name}`
  )
}
/**
 * 输入字段的包裹字段，加入字段标题、说明和操作等节点。
 */
export class FieldWrap extends Node {
  fieldNode
  constructor(ctx: FormContext, fieldNode: FieldNode) {
    super(ctx, components.fieldWrap)
    this.fieldNode = fieldNode
  }

  get field() {
    return this.fieldNode.field
  }

  protected children(): VNode[] {
    const children = []
    const { field, ctx } = this

    if (field.label) {
      children.push(
        h(
          components.fieldLabel.tag,
          {
            class: ['tvu-jdoc__field-label'],
          },
          field.label
        )
      )
    }

    if (this.ctx.showFieldFullname === true && field.fullname) {
      children.push(
        h('div', { class: ['tvu-jdoc__field-fullname'] }, field.fullname)
      )
    }
    /**如果属性名称是用户定义的，需要显示给用户，并且允许进行编辑*/
    if (field.scheamProp.isPattern) {
      children.push(fieldNameVNode(ctx, field))
    }

    children.push(this.fieldNode.createElem())

    if (field.description) {
      children.push(
        h(
          components.fieldDescription.tag,
          { class: ['tvu-jdoc__field-desc'] },
          field.description
        )
      )
    }
    /**属性是可扩展属性*/
    if (field.scheamProp.isPattern) {
      let actions = h(
        'div',
        {
          class: ['tvu-jdoc__field-actions'],
        },
        [fieldInsertVNode(ctx, field), fieldRemoveVNode(ctx, field)]
      )
      children.push(actions)
    }

    return children
  }

  createElem(): VNode {
    const { field } = this

    // 获得子节点的内容
    let children = this.children()

    const vnodes = [...children]

    const options = {
      name: field.fullname,
      class: ['tvu-jdoc__field'],
    }
    if (field.required) {
      Object.assign(options, { 'data-required-field': 'true' })
    }
    if (field.scheamProp.isPattern) {
      Object.assign(options, { 'data-optinal-field': 'true' })
    }
    // if (field.visible === false) {
    //   options.class.push('tvu-jdoc__field--hide')
    // }

    this._vnode = h(this.rawArgs.tag, options, vnodes)

    return this._vnode
  }
}
