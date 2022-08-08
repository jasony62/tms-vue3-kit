import { FieldNode } from './fieldNode'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { h, VNode } from 'vue'
import { components } from '.'
import RandExp from 'randexp'
import Debug from 'debug'

const debug = Debug('json-doc:object')

/**
 * 添加子属性操作
 * @param ctx
 * @param field
 * @returns
 */
const itemAddVNode = (ctx: FormContext, field: Field) => {
  let addVNodes = field.scheamProp.patternChildren?.map((childProp) =>
    h(
      components.button.tag,
      {
        name: childProp.fullname,
        class: ['tvu-button'],
        onClick: () => {
          let randexp = new RandExp(new RegExp(childProp.name))
          randexp.max = 8
          let newKey = randexp.gen()
          debug(
            `字段【${field.fullname}】执行【添加${
              childProp.attrs.title ?? childProp.name
            }属性】，随机属性名：${newKey}`
          )
          switch (childProp.attrs.type) {
            case 'string':
              ctx.editDoc.appendAt(field.fullname, '', newKey)
              break
            case 'json':
              ctx.editDoc.appendAt(field.fullname, '', newKey)
              break
            case 'object':
              ctx.editDoc.appendAt(field.fullname, {}, newKey)
              break
            case 'array':
              ctx.editDoc.appendAt(field.fullname, [], newKey)
              break
          }
        },
      },
      `添加-${childProp.attrs.title ?? childProp.name}`
    )
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNodes)
}

/**
 * 执行选取文件操作
 * @param ctx
 * @param field
 * @returns
 */
const itemPickVNode = (ctx: FormContext, field: Field) => {
  let addVNode = h(
    components.button.tag,
    {
      class: ['tvu-button'],
      onClick: () => {
        if (field.children?.length && typeof ctx.onFileSelect === 'function') {
          ctx.onFileSelect(field.fullname, field).then((fileData: any) => {
            debug(
              `对象字段【${field.fullname}】选取文件：\n` +
                JSON.stringify(fileData, null, 2)
            )
            // 设置初始值和添加项目必须在dom循环中完成，不能在promise外面初始化
            field.children?.forEach((cf: Field) => {
              if (typeof fileData[cf.name] !== undefined) {
                ctx.editDoc.set(cf.fullname, fileData[cf.name], false)
              }
            })
            ctx.editDoc.forceRender()
          })
        }
      },
    },
    '选取文件'
  )

  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNode)
}

export class ObjectNode extends FieldNode {
  private _children

  constructor(ctx: FormContext, field: Field, children?: VNode[]) {
    super(ctx, field)
    this._children = children
    debug(
      `字段【${field.fullname}】构造节点对象，包含【${children?.length}】个子节点`
    )
  }

  options() {
    const { field } = this
    const { fullname, type, depth } = field
    const options = {
      name: fullname,
      type,
      class: ['tvu-jdoc__nest'],
    }

    if (depth) {
      options.class.push(`tvu-jdoc__nest--depth`)
    }

    return options
  }
  /**
   * 如果对象中包含可选属性，需要提供添加删除属性，修改属性名称的操作。
   * 如果对象的格式是文件，需要支持选取文件操作
   */
  protected children(): VNode[] {
    const { ctx, field } = this
    const vnodes = this._children ? [...this._children] : []

    if (field.scheamProp.patternChildren?.length) {
      vnodes.push(itemAddVNode(ctx, field))
    }

    /**如果对象的格式是对象，添加选取文件操作*/
    if (field.scheamProp.attrs.format === 'file') {
      debug(
        `对象字段【${field.fullname}】【format=file】，需要支持选取文件操作`
      )
      let pickFileVNode = itemPickVNode(ctx, field)
      vnodes.push(pickFileVNode)
    }

    return vnodes
  }
}
