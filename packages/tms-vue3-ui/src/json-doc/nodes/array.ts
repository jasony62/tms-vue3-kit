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
 * 如果黏贴的数据是数组，那么数组终端项目作为依次被添加
 * @param ctx
 * @param field
 * @returns
 */
const itemPasteVNode = (ctx: FormContext, field: Field) => {
  const { shortname, fullname } = field
  let pasteVNode = h(
    components.button.tag,
    {
      class: ['tvu-button'],
      onClick: async () => {
        const log = debug.extend('onPaste')
        function setDocData(clipData: any) {
          if (Array.isArray(clipData) && clipData.length) {
            clipData.forEach((item) => ctx.editDoc.appendAt(fullname, item))
          } else ctx.editDoc.appendAt(fullname, clipData)
        }
        if (typeof ctx.onPaste === 'function') {
          /**调用方提供数据*/
          log(`字段【${fullname}】调用外部方法执行粘贴数据操作`)
          ctx.onPaste(field).then((clipData: any) => {
            if (clipData ?? false) setDocData(clipData)
          })
        } else {
          /**从粘贴板中获取数据，添加到文档中*/
          log(`字段【${fullname}】调用内部方法执行粘贴数据操作`)
          const clipText = await navigator.clipboard.readText()
          try {
            let clipData = JSON.parse(clipText)
            setDocData(clipData)
          } catch (e: any) {
            ctx.onMessage(`粘贴内容填充字段【${fullname}】失败：` + e.message)
          }
        }
      },
    },
    `黏贴${shortname ? '-' + shortname : ''}`
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
      class: ['tvu-button'],
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
    `添加${shortname ? '-' + shortname : ''}`
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
      class: ['tvu-button'],
      onClick: () => {
        const { items } = field.schemaProp
        if (items) {
          const initVal = Field.initialVal(undefined, items.type)
          ctx.editDoc.insertAt(fullname, initVal)
        }
      },
    },
    '插入'
  )
}

const itemRemoveVNode = (ctx: FormContext, field: Field, index: number) => {
  let fullname = `${field.fullname}[${index}]`
  return h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button'],
      onClick: () => {
        ctx.editDoc.remove(fullname)
      },
    },
    `删除-${field.shortname}[${index}]`
  )
}
/**
 * 数组中的项目是对象
 */
export class ArrayNode extends FieldNode {
  private _children: VNode[]

  constructor(ctx: FormContext, field: Field, children?: VNode[]) {
    super(ctx, field)
    this._children = children ?? []
  }

  options() {
    const { field } = this
    const options = {
      type: field.type,
      name: field.fullname,
      class: ['tvu-jdoc__nest'],
    }

    return options
  }

  protected children(): VNode[] {
    const { ctx, field } = this

    const itemNestVNodes: VNode[] = []

    this._children.forEach((child, index) => {
      let itemVNodes = [] // 数组中1个item的虚节点
      itemVNodes.push(child)
      let itemActionsVNode = h(
        'div',
        { class: ['tvu-jdoc__nest__item__actions'] },
        [itemInsertVNode(ctx, field, index), itemRemoveVNode(ctx, field, index)]
      )
      let itemNestVNode = h('div', { index, class: ['tvu-jdoc__nest__item'] }, [
        itemVNodes,
        itemActionsVNode,
      ])
      itemNestVNodes.push(itemNestVNode)
    })

    /**字段范围的操作*/
    const fieldActionVNodes = []
    if (ctx.enablePaste === true) {
      debug(`对象字段【${field.fullname}】需要支持黏贴操作`)
      let pasteVNode = itemPasteVNode(ctx, field)
      fieldActionVNodes.push(pasteVNode)
    }
    fieldActionVNodes.push(itemAddVNode(ctx, field))

    return [
      ...itemNestVNodes,
      h('div', { class: ['tvu-jdoc__nest__actions'] }, fieldActionVNodes),
    ]
  }
}
