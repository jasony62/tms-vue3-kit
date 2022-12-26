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
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        const { name, attrs } = field.schemaProp
        const newKey = Field.initialKey(name)
        const initVal = Field.initialVal(attrs.default, attrs.type)
        debug(`执行【插入属性】，随机属性名：${newKey}`)
        ctx.editDoc.insertAt(fullname, initVal, newKey)
      },
    },
    '插入'
  )
}
/**
 * 删除属性或亲和属性组操作
 * @param ctx
 * @param field
 * @returns
 */
const fieldRemoveVNode = (ctx: FormContext, field: Field) => {
  const label =
    (field.isOneOf ? '替换' : '删除') +
    (field.schemaProp.isOneOfInclusiveGroup
      ? `-${field.schemaProp.isOneOfInclusiveGroup}`
      : '')

  return h(
    components.button.tag,
    {
      name: field.fullname,
      class: ['tvu-button', 'tvu-button--red'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        if (field.isOneOf) {
          if (field.schemaProp.isOneOfInclusiveGroup) {
            const gname = Field.isOneOfInclusiveGroupName(field)
            /**删除同亲和组的字段*/
            const fieldNames: any[] = fieldNamesInGroup(field, ctx)
            fieldNames.forEach((name) => {
              ctx.oneOfSelected.delete(name)
              ctx.editDoc.remove(name, false)
            })
            // 删除组名称
            ctx.oneOfSelectedInGroups.delete(gname)
          } else {
            ctx.oneOfSelected.delete(field.fullname)
            ctx.editDoc.remove(field.fullname, false)
          }
          ctx.editDoc.forceRender()
        } else {
          ctx.editDoc.remove(field.fullname)
        }
      },
    },
    label
  )
}
/**
 * 后移属性操作
 * @param ctx
 * @param field
 * @returns
 */
const fieldMoveDownVNode = (ctx: FormContext, field: Field) => {
  return h(
    components.button.tag,
    {
      name: field.fullname,
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        ctx.editDoc.moveDown(field.fullname)
      },
    },
    `后移`
  )
}
/**
 * 前移属性操作
 * @param ctx
 * @param field
 * @returns
 */
const fieldMoveUpVNode = (ctx: FormContext, field: Field) => {
  return h(
    components.button.tag,
    {
      name: field.fullname,
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        ctx.editDoc.moveUp(field.fullname)
      },
    },
    `前移`
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
        if (['object', 'array'].includes(field.schemaType)) {
          if (ctx.nestExpanded?.has(fullname)) ctx.nestExpanded.delete(fullname)
          else {
            ctx.nestExpanded?.add(fullname)
            // 如果字段只有1个子字段，且子字段是对象类型，自动展开
            const expandSubField = (f: Field) => {
              if (f.children?.length === 1) {
                let childField = f.children[0]
                if (childField.schemaType === 'object') {
                  if (!ctx.nestExpanded?.has(childField.fullname)) {
                    ctx.nestExpanded?.add(childField.fullname)
                    expandSubField(childField)
                  }
                }
              }
            }
            expandSubField(field)
          }
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
            h('div', [
              field.label,
              h(
                'span',
                { class: ['tvu-jdoc__field-label__field-name'] },
                `(${field.name})`
              ),
            ])
          )
        )
        if (this.ctx.showFieldFullname === true && fullname) {
          children.push(
            h(
              'div',
              { class: ['tvu-jdoc__field-fullname'] },
              h('dev', fullname)
            )
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
            h('div', fullname)
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
    if (
      field.schemaProp.isPattern &&
      ctx.activePatternFieldName === field.fullname
    ) {
      const actionVNodes = [
        fieldInsertVNode(ctx, field),
        fieldRemoveVNode(ctx, field),
        fieldMoveUpVNode(ctx, field),
        fieldMoveDownVNode(ctx, field),
      ]

      let actions = h(
        'div',
        {
          class: ['tvu-jdoc__field-actions'],
        },
        actionVNodes
      )
      children.push(actions)
    }
    /**属性是oneOf*/
    if (field.isOneOf) {
      if (field.schemaProp.isOneOfInclusiveGroup) {
        const fieldNames: any[] = fieldNamesInGroup(field, ctx)
        // 同组节点的最后一个节点中添加删除组操作
        if (fieldNames.indexOf(field.fullname) === fieldNames.length - 1) {
          let actions = h(
            'div',
            {
              class: ['tvu-jdoc__field-actions'],
            },
            [fieldRemoveVNode(ctx, field)]
          )
          children.push(actions)
        }
      } else {
        let actions = h(
          'div',
          {
            class: ['tvu-jdoc__field-actions'],
          },
          [fieldRemoveVNode(ctx, field)]
        )
        children.push(actions)
      }
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
    const options: any = {
      name: field.fullname,
      class: ['tvu-jdoc__field'],
    }
    // 是否需要切换激活节点
    if (['object'].includes(schemaType) || field.schemaProp.isPattern) {
      options.onClick = (evt: any) => {
        let requireRender = false
        if (field.schemaProp.isPattern) {
          if (ctx.activePatternFieldName !== field.fullname) {
            ctx.activePatternFieldName = field.fullname
            requireRender = true
          }
        }
        if (['object'].includes(schemaType)) {
          evt.stopPropagation()
          if (ctx.activeFieldName !== field.fullname) {
            ctx.activeFieldName = field.fullname
            // 如果模板属性的父节点不是激活状态，模板属性也不是激活状态
            if (ctx.activePatternFieldName) {
              if (ctx.activePatternFieldName.indexOf(field.fullname) === -1) {
                ctx.activePatternFieldName = undefined
              }
            }
            requireRender = true
          }
        }
        if (requireRender) ctx.editDoc.forceRender()
      }
    }
    // active字段
    if (ctx.activeFieldName === field.fullname) {
      options.class.push('tvu-jdoc__field--active')
    }
    if (ctx.activePatternFieldName === field.fullname) {
      options.class.push('tvu-jdoc__pattern-field--active')
    }
    // 必填字段
    if (field.required) {
      Object.assign(options, { 'data-required-field': 'true' })
    }
    // 可选属性
    if (field.schemaProp.isPattern) {
      Object.assign(options, { 'data-optinal-field': 'true' })
    }
    // 嵌套节点默认设置为折叠状态
    if (fullname) {
      if (['object', 'array'].includes(schemaType)) {
        Object.assign(options, {
          'data-collapsed-field': ctx.nestExpanded?.has(fullname)
            ? 'false'
            : 'true',
        })
      } else {
        Object.assign(options, {
          'data-leaf-field': schemaType,
        })
      }
    }

    // 设置排他属性字段是否出现
    if (field.isOneOf) {
      let selected = false
      let ingroup = Field.isOneOfInclusiveGroupName(field)
      if (!ctx.oneOfSelected.has(field.fullname)) {
        // 没有记录在选中集合中，检查是否已经在文档中
        // selected = ctx.editDoc.has(field.fullname)
        let snapshot = ctx.editDoc.snapshot()
        selected = snapshot.has(field.fullname)
        if (selected) {
          // 获得oneOf亲和组名称
          ctx.oneOfSelected.set(field.fullname, { ingroup })
          ctx.oneOfSelectedInGroups.add(ingroup)
        }
      } else {
        selected = true
      }
      if (selected) {
        const groupIndex = Array.from(
          ctx.oneOfSelectedInGroups.values()
        ).indexOf(ingroup)
        Object.assign(options, {
          'data-one-of-field-selected': `ingroup-${groupIndex % 3}`,
        })
      } else {
        Object.assign(options, {
          'data-one-of-field-selected': false,
        })
      }
    }

    this._vnode = h(this.rawArgs.tag, options, vnodes)

    return this._vnode
  }
}
/**
 * 获得字段同oneOf组的属性
 * @param field
 * @param ctx
 * @returns
 */
function fieldNamesInGroup(field: Field, ctx: FormContext) {
  const groupName = Field.isOneOfInclusiveGroupName(field)
  const fieldNames: any[] = []
  ctx.oneOfSelected.forEach(({ ingroup }, fieldName) => {
    if (ingroup === groupName) fieldNames.push(fieldName)
  })
  return fieldNames
}
