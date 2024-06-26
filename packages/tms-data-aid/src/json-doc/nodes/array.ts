import { components } from './common.js'
import { FieldNode } from './fieldNode.js'
import { Field } from '../fields/index.js'
import { FormContext } from '../builder.js'
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
const itemPasteVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  const { shortname, fullname } = field
  let pasteVNode = ctx.h(
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
    '粘贴'
  )

  return pasteVNode
}
/**
 * 给数组添加子项目
 * @param ctx
 * @param field
 * @returns
 */
const itemAddVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  const { fullname, shortname, schemaProp } = field
  let addVNode = ctx.h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--green'],
      onClick: () => {
        /**
         * 保证当前字段的值是数组
         */
        let fieldValue = ctx.editDoc.get(fullname)
        if (fieldValue === undefined || fieldValue === null) {
          ctx.editDoc.set(fullname, [], false)
          fieldValue = ctx.editDoc.get(fullname)
        }
        if (!Array.isArray(fieldValue))
          throw Error(`字段【${fullname}】的值不是数组，不能添加子项目`)

        const { items } = schemaProp
        if (items) {
          if (items.type === 'object') {
            /**
             * 如果数组项目是对象，添加后自动展开
             */
            let newChildFullname = field.fullname + `[${fieldValue.length}]`
            ctx.nestExpanded?.add(newChildFullname)
          }
          const initVal = Field.initialVal(undefined, items.type)
          ctx.editDoc.appendAt(fullname, initVal)
        }
      },
    },
    '添加'
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
const itemInsertVNode = <VNode>(
  ctx: FormContext<VNode>,
  field: Field,
  index: number
) => {
  let fullname = `${field.fullname}[${index}]`
  return ctx.h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        ctx.activeFieldName = field.fullname + `[${index + 1}]`
        const { items } = field.schemaProp
        if (items) {
          if (items.type === 'object') {
            /**
             * 如果数组项目是对象，添加后自动展开
             */
            ctx.nestExpanded?.add(fullname)
          }
          const initVal = Field.initialVal(undefined, items.type)
          ctx.editDoc.insertAt(fullname, initVal)
        }
      },
    },
    '插入'
  )
}

const itemRemoveVNode = <VNode>(
  ctx: FormContext<VNode>,
  field: Field,
  index: number
) => {
  let fullname = `${field.fullname}[${index}]`
  return ctx.h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        ctx.editDoc.remove(fullname)
      },
    },
    '删除'
  )
}

const itemMoveUpVNode = <VNode>(
  ctx: FormContext<VNode>,
  field: Field,
  index: number
) => {
  let fullname = `${field.fullname}[${index}]`
  return ctx.h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        ctx.activeFieldName = field.fullname + `[${index - 1}]`
        ctx.editDoc.moveUp(fullname)
      },
    },
    '前移'
  )
}

const itemMoveDownVNode = <VNode>(
  ctx: FormContext<VNode>,
  field: Field,
  index: number
) => {
  let fullname = `${field.fullname}[${index}]`
  return ctx.h(
    components.button.tag,
    {
      name: fullname,
      class: ['tvu-button', 'tvu-button--yellow'],
      onClick: (evt: any) => {
        evt.stopPropagation()
        ctx.activeFieldName = field.fullname + `[${index + 1}]`
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
const propRemoveVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  let pasteVNode = ctx.h(
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
export class ArrayNode<VNode> extends FieldNode<VNode> {
  private _children: (VNode | null)[]

  constructor(
    ctx: FormContext<VNode>,
    field: Field,
    children?: (VNode | null)[]
  ) {
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
  /**
   * 生成子节点
   * @returns
   */
  protected children(): VNode[] {
    const { ctx, field } = this

    // 节点未展开时，不生成子节点
    if (!ctx.nestExpanded?.has(field.fullname)) return []

    const itemNestVNodes: VNode[] = []

    /*每个子项目生成1个包裹元素，包含对这个元素的可用操作*/
    this._children.forEach((child, index) => {
      let itemVNodes = [] // 数组中1个item的虚节点
      itemVNodes.push(child)

      const itemVNodeOptons = {
        index,
        class: ['tvu-jdoc__nest__item'],
        onClick: (evt: any) => {
          evt.stopPropagation()
          if (ctx.activeFieldName !== field.fullname + `[${index}]`) {
            ctx.activeFieldName = field.fullname + `[${index}]`
            ctx.editDoc.forceRender()
          }
        },
      }
      /*如果子项目是激活状态，生成子项目的可用操作*/
      if (field.children && field.children.length > index) {
        let childField = field.children[index]
        if (
          ctx.activeFieldName === field.fullname + `[${index}]` ||
          ctx.activeFieldName === childField.fullname
        ) {
          let actions = [
            itemInsertVNode(ctx, field, index),
            itemRemoveVNode(ctx, field, index),
          ]
          if (this._children.length > 1) {
            if (index > 0) actions.push(itemMoveUpVNode(ctx, field, index))
            if (index < this._children.length - 1)
              actions.push(itemMoveDownVNode(ctx, field, index))
          }
          let itemActionsVNode = ctx.h(
            'div',
            { class: ['tvu-jdoc__nest__item__actions'] },
            actions
          )
          itemVNodes.push(itemActionsVNode)
        }
      }

      let itemNestVNode = this.ctx.h('div', itemVNodeOptons, [itemVNodes])
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
    if (this._children.length)
      fieldActionVNodes.push(propRemoveVNode(ctx, field))

    return [
      ...itemNestVNodes,
      this.ctx.h(
        'div',
        { class: ['tvu-jdoc__nest__actions'] },
        fieldActionVNodes
      ),
    ]
  }
}
