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
      if (field.schemaProp.isPattern) {
        // 如果是正则表达式定义的属性名，检查名称是否符合要求
        if (!new RegExp(field.schemaProp.name).test(newName)) {
          if (inp.el) inp.el.value = field.name
          return
        }
      }
      ctx.editDoc.rename(field.fullname, newName)
    },
  })

  return h(
    'div',
    { name: field.schemaProp.name, class: ['tvu-jdoc__field-name'] },
    [inp]
  )
}
/**
 * 在前面插入兄弟字段
 * @param ctx
 * @param field
 * @returns
 */
const fieldInsertVNode = (ctx: FormContext, field: Field) => {
  let { fullname } = field
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button'],
      onClick: () => {
        const { name, attrs } = field.schemaProp
        const newKey = Field.initialKey(name)
        const initVal = Field.initialVal(attrs.default, attrs.type)
        debug(`执行【插入属性】，随机属性名：${newKey}`)
        ctx.editDoc.insertAt(fullname, initVal, newKey)
      },
    },
    `插入-${field.label ? field.label : field.shortname}`
  )
}
/**
 * 删除属性操作
 * @param ctx
 * @param field
 * @returns
 */
const fieldRemoveVNode = (ctx: FormContext, field: Field) => {
  return h(
    components.button.tag,
    {
      name: field.fullname,
      class: ['tvu-button'],
      onClick: () => {
        if (field.isOneOf) ctx.oneOfSelected.delete(field.fullname)
        ctx.editDoc.remove(field.fullname)
      },
    },
    `删除-${field.shortname}`
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
  /**
   * 字段包裹节点中包含的节点
   * label
   * fullname?
   * fullname input?
   * field
   * description
   * actions
   * oneOf remove
   *
   * @returns
   */
  protected children(): VNode[] {
    const children = []
    const { field, ctx } = this
    const { fullname } = field

    /**不是根节点，或者未要求隐藏根标题*/
    if (fullname || ctx.hideRootTitle !== true) {
      const toggleNestExpanded = () => {
        if (field.schemaType === 'object') {
          if (ctx.nestExpanded.has(fullname)) ctx.nestExpanded.delete(fullname)
          else ctx.nestExpanded.add(fullname)
          ctx.editDoc.forceRender()
        }
      }

      if (field.label) {
        children.push(
          h(
            components.fieldLabel.tag,
            {
              class: ['tvu-jdoc__field-label'],
              onClick: () => {
                toggleNestExpanded()
              },
            },
            field.label
          )
        )
        if (this.ctx.showFieldFullname === true && fullname) {
          children.push(
            h('div', { class: ['tvu-jdoc__field-fullname'] }, fullname)
          )
        }
      } else if (fullname) {
        children.push(
          h(
            'div',
            {
              class: ['tvu-jdoc__field-fullname'],
              onClick: () => {
                toggleNestExpanded()
              },
            },
            fullname
          )
        )
      }
    }
    /**不是根节点，或者未要求隐藏根说明*/
    if (fullname || ctx.hideRootTitle !== true) {
      if (ctx.hideFieldDescription !== true && field.description) {
        children.push(
          h(
            components.fieldDescription.tag,
            { class: ['tvu-jdoc__field-desc'] },
            field.description
          )
        )
      }
    }
    /**如果属性名称是用户定义的，需要显示给用户，并且允许进行编辑*/
    if (field.schemaProp.isPattern) {
      children.push(fieldNameVNode(ctx, field))
    }

    children.push(this.fieldNode.createElem())

    /**属性是可扩展属性*/
    if (field.schemaProp.isPattern) {
      let actions = h(
        'div',
        {
          class: ['tvu-jdoc__field-actions'],
        },
        [fieldInsertVNode(ctx, field), fieldRemoveVNode(ctx, field)]
      )
      children.push(actions)
    }
    if (field.isOneOf) {
      let actions = h(
        'div',
        {
          class: ['tvu-jdoc__field-actions'],
        },
        [fieldRemoveVNode(ctx, field)]
      )
      children.push(actions)
    }

    return children
  }
  /**
   * 字段包裹节点
   * @returns
   */
  createElem(): VNode {
    const { ctx, field } = this

    // 获得子节点的内容
    let children = this.children()

    const vnodes = [...children]
    const { fullname, schemaType } = field
    const options = {
      name: field.fullname,
      class: ['tvu-jdoc__field'],
      // 'data-schema-type': field.schemaType,
    }
    if (field.required) {
      Object.assign(options, { 'data-required-field': 'true' })
    }
    if (field.schemaProp.isPattern) {
      Object.assign(options, { 'data-optinal-field': 'true' })
    }
    // if (field.visible === false) {
    //   options.class.push('tvu-jdoc__field--hide')
    // }
    // 嵌套节点默认设置为折叠状态
    if (fullname && schemaType === 'object') {
      Object.assign(options, {
        'data-collapsed-field': ctx.nestExpanded.has(fullname)
          ? 'false'
          : 'true',
      })
    }

    // 设置排他属性字段是否出现
    if (field.isOneOf) {
      let selected = false
      if (!ctx.oneOfSelected.has(field.fullname)) {
        let fieldValue = ctx.editDoc.get(field.fullname)
        selected = fieldValue ?? false ? true : false
        if (selected) ctx.oneOfSelected.add(field.fullname)
      } else {
        selected = true
      }
      Object.assign(options, {
        'data-one-of-field-selected': selected,
      })
    }

    this._vnode = h(this.rawArgs.tag, options, vnodes)

    return this._vnode
  }
}
