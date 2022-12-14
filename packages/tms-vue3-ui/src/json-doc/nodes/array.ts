import { h, VNode } from 'vue'
import { components } from './index'
import { FieldNode } from './fieldNode'
import { Field } from '../fields'
import { FormContext } from '../builder'
import Debug from 'debug'

const debug = Debug('json-doc:nodes:array')

/**
 * 执行粘贴操作
 * 如果黏贴的数据是对象，作为数组的项目进行追加
 * 如果黏贴的数据是数组，那么数组中的项目作为依次被添加
 * @param ctx
 * @param field
 * @returns
 */
const itemPasteVNode = (ctx: FormContext, field: Field) => {
  const { shortname, fullname } = field
  let pasteVNode = h(
    components.button.tag,
    {
      class: ['tvu-button', 'tvu-button--green'],
      onClick: async () => {
        const log = debug.extend('onPaste')
        function setDocData(clipData: any) {
          if (Array.isArray(clipData) && clipData.length) {
            clipData.forEach((item) => ctx.editDoc.appendAt(fullname, item))
          } else ctx.editDoc.appendAt(fullname, clipData)
        }
        try {
          let clipData
          if (typeof ctx.onPaste === 'function') {
            /**调用方提供数据*/
            log(`字段【${fullname}】调用外部方法执行粘贴数据操作`)
            clipData = await ctx.onPaste(field)
          } else {
            /**从粘贴板中获取数据，添加到文档中*/
            log(`字段【${fullname}】调用内部方法执行粘贴数据操作`)
            const clipText = await navigator.clipboard.readText()
            clipData = JSON.parse(clipText)
          }
          setDocData(clipData)
        } catch (e: any) {
          if (e) ctx.onMessage(`粘贴【${fullname}】失败：` + e.message)
        }
      },
    },
    // `粘贴-${shortname}`
    '粘贴数组'
  )

  return pasteVNode
}
/**
 * 给数组添加子项目
 * @param ctx
 * @param field
 * @returns
 */
const itemAddVNode = (ctx: FormContext, field: Field) => {
  const { fullname, shortname, schemaProp } = field
  let addVNode = h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--green'],
      onClick: () => {
        /**保证当前字段的值是数组*/
        let fieldValue = ctx.editDoc.get(fullname)
        if (fieldValue === undefined || fieldValue === null) {
          ctx.editDoc.set(fullname, [], false)
          fieldValue = ctx.editDoc.get(fullname)
        }
        if (!Array.isArray(fieldValue))
          throw Error(`字段【${fullname}】的值不是数组，不能添加子项目`)

        const { items } = schemaProp
        if (items) {
          const initVal = Field.initialVal(undefined, items.type)
          ctx.editDoc.appendAt(fullname, initVal)
        }
      },
    },
    // `添加-${field.label ? field.label : shortname}`
    '添加项目'
  )
  return addVNode
}
/**
 * 子项目字段添加兄弟字段
 * @param ctx
 * @param field
 * @param index
 * @returns
 */
const itemInsertVNode = (ctx: FormContext, field: Field, index: number) => {
  let fullname = `${field.fullname}[${index}]`
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--green'],
      onClick: () => {
        const { items } = field.schemaProp
        if (items) {
          const initVal = Field.initialVal(undefined, items.type)
          ctx.editDoc.insertAt(fullname, initVal)
        }
      },
    },
    // `插入-${field.label ? field.label : field.shortname}`
    '插入项目'
  )
}

const itemRemoveVNode = (ctx: FormContext, field: Field, index: number) => {
  let fullname = `${field.fullname}[${index}]`
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--green'],
      onClick: () => {
        ctx.editDoc.remove(fullname)
      },
    },
    '删除'
    // `删除-${field.shortname}[${index}]`
  )
}

const itemMoveUpVNode = (ctx: FormContext, field: Field, index: number) => {
  let fullname = `${field.fullname}[${index}]`
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--green'],
      onClick: () => {
        ctx.editDoc.moveUp(fullname)
      },
    },
    '前移'
  )
}

const itemMoveDownVNode = (ctx: FormContext, field: Field, index: number) => {
  let fullname = `${field.fullname}[${index}]`
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--green'],
      onClick: () => {
        ctx.editDoc.moveDown(fullname)
      },
    },
    '后移'
  )
}
/**
 * 执行清除属性操作
 * @param ctx
 * @param field
 * @returns
 */
const propRemoveVNode = (ctx: FormContext, field: Field) => {
  let pasteVNode = h(
    components.button.tag,
    {
      class: ['tvu-button', 'tvu-button--green'],
      onClick: async () => {
        ctx.editDoc.remove(field.fullname)
      },
      title: field.fullname,
    },
    // `清除-${
    //   field.label ? field.label : field.shortname ? field.shortname : '全部'
    // }`
    '清空'
  )

  return pasteVNode
}
/**
 * 数组中的项目是对象
 */
export class ArrayNode extends FieldNode {
  private _children: (VNode | null)[]

  constructor(ctx: FormContext, field: Field, children?: (VNode | null)[]) {
    super(ctx, field)
    this._children = children ?? []
  }

  options() {
    const { field } = this
    const options = {
      type: field.type,
      name: field.fullname,
      class: ['tvu-jdoc__nest', 'tvu-jdoc__nest--depth'],
    }

    return options
  }

  protected children(): VNode[] {
    const { ctx, field } = this

    const itemNestVNodes: VNode[] = []

    this._children.forEach((child, index) => {
      let itemVNodes = [] // 数组中1个item的虚节点
      itemVNodes.push(child)

      const itemVNodeOptons = {
        index,
        class: ['tvu-jdoc__nest__item'],
      }

      let actions = [
        itemInsertVNode(ctx, field, index),
        itemRemoveVNode(ctx, field, index),
      ]
      if (this._children.length > 1) {
        if (index > 0) actions.push(itemMoveUpVNode(ctx, field, index))
        if (index < this._children.length - 1)
          actions.push(itemMoveDownVNode(ctx, field, index))
      }
      let itemActionsVNode = h(
        'div',
        { class: ['tvu-jdoc__nest__item__actions'] },
        actions
      )

      let itemNestVNode = h('div', itemVNodeOptons, [
        itemVNodes,
        itemActionsVNode,
      ])
      itemNestVNodes.push(itemNestVNode)
    })

    /**字段范围的操作*/
    // if (ctx.activeFieldName === field.fullname) {
    const fieldActionVNodes = []
    if (ctx.enablePaste === true) {
      debug(`对象字段【${field.fullname}】需要支持黏贴操作`)
      let pasteVNode = itemPasteVNode(ctx, field)
      fieldActionVNodes.push(pasteVNode)
    }
    fieldActionVNodes.push(itemAddVNode(ctx, field))
    if (this._children.length)
      fieldActionVNodes.push(propRemoveVNode(ctx, field))

    return [
      ...itemNestVNodes,
      h('div', { class: ['tvu-jdoc__nest__actions'] }, fieldActionVNodes),
    ]
    // } else {
    //   return itemNestVNodes
    // }
  }
}
