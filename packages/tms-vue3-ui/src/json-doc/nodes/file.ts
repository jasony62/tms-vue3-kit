import { h, VNode } from 'vue'
import { components } from './index'
import { FieldNode } from './field-node'
import { Field } from '../fields'
import { FormContext } from '../builder'
import { getChild, initChild } from '@/utils'
/**
 * 添加文件信息输入框
 * @param ctx
 * @param field
 * @returns
 */
const itemAddVNode = (ctx: FormContext, field: Field) => {
  let addVNode = h(
    components.button.tag,
    {
      onClick: () => {
        const fieldValue = initChild(ctx.editDoc, field.fullname, [])
        if (Array.isArray(fieldValue)) {
          fieldValue.push({})
        }
      },
    },
    '添加'
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNode)
}
/**
 * 执行文件上传操作
 * @param ctx
 * @param field
 * @param fileUpload
 * @returns
 */
const itemUploadVNode = (
  ctx: FormContext,
  field: Field,
  fileUpload: Function
) => {
  let addVNode = h(
    components.button.tag,
    {
      onClick: () => {
        let fieldValue = getChild(ctx.editDoc, field.fullname)
        /**只能在数组中添加文件*/
        if ((fieldValue ?? true) || Array.isArray(fieldValue)) {
          let fullname = field.fullname
          let data = 'base64' // 文件base64的值。这里需要实现通过input获得上传文件信息。
          fileUpload({ fullname, data }).then((fileData: any) => {
            // 设置初始值和添加项目必须在dom循环中完成，不能在promise外面初始化
            fieldValue ??= initChild(ctx.editDoc, field.fullname, [])
            fieldValue.push(fileData)
          })
        }
      },
    },
    '上传文件'
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNode)
}

const itemRemoveVNode = (fieldValue: any[], index: number) => {
  return h(
    components.button.tag,
    {
      onClick: () => {
        // 删除数组中的内容
        fieldValue.splice(index, 1)
      },
    },
    '删除'
  )
}
/**
 * 数组中的项目是对象
 */
export class FileNode extends FieldNode {
  private _children: (VNode | VNode[])[]

  constructor(ctx: FormContext, field: Field, children?: (VNode | VNode[])[]) {
    super(ctx, field)
    this._children = children ?? []
  }

  options() {
    const { field } = this
    const options = {
      type: field.type,
      name: field.name,
      class: ['tvu-jdoc__nest'],
    }

    return options
  }

  protected children(): VNode[] {
    const { ctx, field } = this
    const fieldValue = this.fieldValue()

    /**生成数组中已有项目的节点*/
    const itemNestVNodes: VNode[] = []
    /**children是个二维数组，第1维是字段，第2纬是数组的项目*/
    if (Array.isArray(this._children) && this._children.length) {
      let fieldNum = this._children.length
      let itemNum = Array.isArray(this._children[0])
        ? this._children[0].length
        : 0

      for (let i = 0; i < itemNum; i++) {
        let itemVNodes = [] // 数组中1个item的虚节点
        for (let j = 0; j < fieldNum; j++) {
          let fieldVNodes = this._children[j] // 一类字段的虚节点
          if (Array.isArray(fieldVNodes)) itemVNodes.push(fieldVNodes[i])
        }
        /**数组的一个项目*/
        // 针对一个项目的操作
        let itemActionsVNode = h(
          'div',
          { class: ['jdoc__nest__item__actions'] },
          [itemRemoveVNode(fieldValue, i)]
        )
        let itemNestVNode = h('div', { class: ['tvu-jdoc__nest__item'] }, [
          itemVNodes,
          itemActionsVNode,
        ])
        itemNestVNodes.push(itemNestVNode)
      }
    }
    /**是否支持上传文件*/
    let newItemVNode
    if (typeof ctx.onFileUpload === 'function') {
      newItemVNode = itemUploadVNode(ctx, field, ctx.onFileUpload)
    } else {
      newItemVNode = itemAddVNode(ctx, field)
    }

    const children = [...itemNestVNodes, newItemVNode]

    return children
  }
}
