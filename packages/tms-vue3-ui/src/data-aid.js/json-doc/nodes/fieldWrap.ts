import { FormContext } from '../builder'
import { Field } from '../fields'
import { FieldNode } from './fieldNode'
import { Node, components } from './index'

import Debug from 'debug'

const debug = Debug('json-doc:fieldWrap')

/**
 * 用户指定的字段名称
 */
const fieldNameVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  let inp = ctx.h('input', {
    class: ['tvu-input'],
    value: field.name,
    onInput: (event: any) => {
      const newName = event && event.target ? event.target.value : event
      if (field.schemaProp.isPattern) {
        // 如果是正则表达式定义的属性名，检查名称是否符合要求
        if (!new RegExp(field.schemaProp.name).test(newName)) {
          //@ts-ignore
          if (inp.el) inp.el.value = field.name
          return
        }
      }
      ctx.editDoc.rename(field.fullname, newName)
    },
  })

  return ctx.h(
    'div',
    { name: field.schemaProp.name, class: ['tvu-jdoc__field-name'] },
    [inp]
  )
}
/**
 * 执行查询操作
 * @param ctx
 * @param field
 * @returns
 */
const fieldLookupVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  let { fullname } = field
  return ctx.h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: async (evt: any) => {
        if (typeof ctx.onLookup === 'function') {
          try {
            let fieldVal = ctx.editDoc.get(fullname)
            let lookupData = await ctx.onLookup(field, fieldVal)
            ctx.editDoc.set(fullname, lookupData)
          } catch (e: any) {
            ctx.onMessage(
              `查询${fullname ? '【' + fullname + '】' : ''}失败，原因：` +
                e.message
            )
          }
        }
      },
    },
    '查询'
  )
}
/**
 * 在前面插入兄弟字段
 * @param ctx
 * @param field
 * @returns
 */
const fieldInsertVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  let { fullname } = field
  return ctx.h(
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
const fieldRemoveVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  return ctx.h(
    components.button.tag,
    {
      name: field.fullname,
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        ctx.editDoc.remove(field.fullname)
      },
    },
    '删除'
  )
}
/**
 * 更改亲和属性组操作
 * @param ctx
 * @param field
 * @returns
 */
const fieldReplaceVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  // 按钮标题
  const label =
    '替换' +
    (field.schemaProp.isOneOfInclusiveGroup
      ? `-${field.schemaProp.isOneOfInclusiveGroup}`
      : '')
  return ctx.h(
    components.button.tag,
    {
      name: field.fullname,
      class: ['tvu-button', 'tvu-button--red'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        if (field.schemaProp.isOneOfInclusiveGroup) {
          const gname = Field.isOneOfInclusiveGroupName(field)
          /**删除同亲和组的字段*/
          const fieldNames: any[] = fieldNamesInGroup(field, ctx)
          fieldNames.forEach((name) => {
            ctx.oneOfSelected?.delete(name)
            ctx.editDoc.remove(name, false)
          })
          // 删除组名称
          ctx.oneOfSelectedInGroups?.delete(gname)
        } else {
          ctx.oneOfSelected?.delete(field.fullname)
          ctx.editDoc.remove(field.fullname, false)
        }
        ctx.editDoc.forceRender()
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
const fieldMoveDownVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  return ctx.h(
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
const fieldMoveUpVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  return ctx.h(
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
export class FieldWrap<VNode> extends Node<VNode> {
  fieldNode
  constructor(ctx: FormContext<VNode>, fieldNode: FieldNode<VNode>) {
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
            /**
             * 如果字段只有1个子字段，且子字段是对象或数组类型，且不是模板属性，自动展开
             */
            if (
              field.schemaType === 'object' &&
              field.schemaProp.children?.length === 1
            ) {
              let soleChildProp = field.schemaProp.children[0]
              if (['object', 'array'].includes(soleChildProp.attrs.type)) {
                if (soleChildProp.isPattern === false) {
                  /**
                   * 展开对象时，自动展开对象下的唯一固定名称复合类型属性
                   */
                  let soleChildKey = soleChildProp.name
                  let soleChildFullname = field.fullname + '.' + soleChildKey
                  if (!ctx.nestExpanded?.has(soleChildFullname))
                    ctx.nestExpanded?.add(soleChildFullname)
                } else {
                  /**
                   * 展开对象时，自动展开对象下的模板名称复合类型属性
                   */
                  let fieldVal = ctx.editDoc.get(field.fullname)
                  if (
                    fieldVal &&
                    typeof fieldVal === 'object' &&
                    Object.keys(fieldVal).length === 1
                  ) {
                    let soleChildKey = Object.keys(fieldVal)[0]
                    let soleChildFullname = field.fullname + '.' + soleChildKey
                    if (!ctx.nestExpanded?.has(soleChildFullname))
                      ctx.nestExpanded?.add(soleChildFullname)
                  }
                }
              }
            }
          }
          ctx.editDoc.forceRender()
        }
      }

      if (field.label) {
        children.push(
          ctx.h(
            components.fieldLabel.tag,
            {
              class: ['tvu-jdoc__field-label'],
              onClick: () => {
                toggleNestExpanded()
              },
            },
            ctx.h('div', [
              field.label,
              ctx.h(
                'span',
                { class: ['tvu-jdoc__field-label__field-name'] },
                `(${field.name})`
              ),
            ])
          )
        )
        if (this.ctx.showFieldFullname === true && fullname) {
          children.push(
            ctx.h(
              'div',
              { class: ['tvu-jdoc__field-fullname'] },
              ctx.h('dev', fullname)
            )
          )
        }
      } else if (fullname) {
        children.push(
          ctx.h(
            'div',
            {
              class: ['tvu-jdoc__field-fullname'],
              onClick: () => {
                toggleNestExpanded()
              },
            },
            ctx.h('div', fullname)
          )
        )
      }
    }
    /**不是根节点，或者未要求隐藏根说明*/
    if (fullname || ctx.hideRootTitle !== true) {
      if (ctx.hideFieldDescription !== true && field.description) {
        children.push(
          ctx.h(
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
      let actions = ctx.h(
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
        // 同亲和组节点的最后一个节点中添加删除组操作
        if (fieldNames.indexOf(field.fullname) === fieldNames.length - 1) {
          let actions = ctx.h(
            'div',
            {
              class: ['tvu-jdoc__field-actions'],
            },
            [fieldReplaceVNode(ctx, field)]
          )
          children.push(actions)
        }
      } else {
        let actions = ctx.h(
          'div',
          {
            class: ['tvu-jdoc__field-actions'],
          },
          [fieldReplaceVNode(ctx, field)]
        )
        children.push(actions)
      }
    }
    /**操作需要lookup操作 */
    if (typeof ctx.onLookup === 'function' && field.schemaProp.lookup) {
      let actions = ctx.h(
        'div',
        {
          class: ['tvu-jdoc__field-actions'],
        },
        [fieldLookupVNode(ctx, field)]
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
      if ('object' === schemaType) {
        Object.assign(options, {
          'data-collapsed-field': ctx.nestExpanded?.has(fullname)
            ? 'false'
            : 'true',
        })
      } else if ('array' === schemaType && !field.schemaProp.attrs.anyOf) {
        // 数字字段如果指定了anyOf，会把所有选项以核选框的方式列出来，因此，没有子节点
        Object.assign(options, {
          'data-collapsed-field': ctx.nestExpanded?.has(fullname)
            ? 'false'
            : 'true',
        })
      } else {
        Object.assign(options, {
          'data-leaf-field':
            schemaType === 'array' ? field.schemaProp.items?.type : schemaType,
        })
      }
    }

    // 设置排他属性字段是否出现
    if (field.isOneOf) {
      let selected = false
      let ingroup = Field.isOneOfInclusiveGroupName(field)
      if (ctx.oneOfSelected?.has(field.fullname)) {
        selected = true
      } else {
        // 没有记录在选中集合中，检查是否已经在文档中
        // selected = ctx.editDoc.has(field.fullname)
        let snapshot = ctx.editDoc.snapshot()
        selected = snapshot.has(field.fullname)
        if (selected) {
          // 获得oneOf亲和组名称
          ctx.oneOfSelected?.set(field.fullname, { ingroup })
          ctx.oneOfSelectedInGroups?.add(ingroup)
        }
      }
      if (selected && ctx.oneOfSelectedInGroups) {
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

    this._vnode = ctx.h(this.rawArgs.tag, options, vnodes)

    return this._vnode
  }
}
/**
 * 获得字段同oneOf组的属性
 * @param field
 * @param ctx
 * @returns
 */
function fieldNamesInGroup<VNode>(field: Field, ctx: FormContext<VNode>) {
  const groupName = Field.isOneOfInclusiveGroupName(field)
  const fieldNames: any[] = []
  ctx.oneOfSelected?.forEach(({ ingroup }, fieldName) => {
    if (ingroup === groupName) fieldNames.push(fieldName)
  })
  return fieldNames
}
