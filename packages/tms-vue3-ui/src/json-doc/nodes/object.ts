import { FieldNode } from './fieldNode'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { h, VNode } from 'vue'
import { components } from '.'
import RandExp from 'randexp'
import Debug from 'debug'

const debug = Debug('json-doc:object')
/**
 * 根据提供的文件对象数据，更新表单中的文件字段数据
 * @param field
 * @param fileData
 * @param ctx
 */
function _setNewFileData(field: Field, fileData: any, ctx: FormContext) {
  field.children?.forEach((cf: Field) => {
    if (typeof fileData[cf.name] !== undefined) {
      ctx.editDoc.set(cf.fullname, fileData[cf.name], false)
    }
  })
  ctx.editDoc.forceRender()
}
/**
 * 选择本地文件并上传
 */
function _pickLocalFile(ctx: FormContext, field: Field, fileUpload: Function) {
  const elInput = document.createElement('input')
  elInput.setAttribute('type', 'file')
  // const { accept, size } = field.scheamProp
  // if (accept) elInput.setAttribute('accept', accept)
  document.body.appendChild(elInput)
  elInput.addEventListener('change', async (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files?.length === 1) {
      const file = target.files[0]
      /**检查文件大小*/
      // if (size && file.size / 1024 / 1024 > size) {
      //   ctx.onMessage(`上传文件大小过大，超过${size}M`)
      //   return
      // }
      /**用表单传递数据*/
      const data = new FormData()
      data.append('file', file)
      fileUpload(field, data).then((fileData: any) => {
        _setNewFileData(field, fileData, ctx)
      })
    }
  })
  elInput.click()
}
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
          /**生成字段名称*/
          let randexp = new RandExp(new RegExp(childProp.name))
          randexp.max = 8
          let newKey = randexp.gen()
          let defVal = field.value
          debug(
            `字段【${field.fullname}】执行【添加${
              childProp.attrs.title ?? childProp.name
            }属性】，随机属性名：${newKey}，默认值：\n${JSON.stringify(
              defVal,
              null,
              2
            )}`
          )
          switch (childProp.attrs.type) {
            case 'string':
              ctx.editDoc.appendAt(field.fullname, defVal, newKey)
              break
            case 'json':
              ctx.editDoc.appendAt(field.fullname, defVal, newKey)
              break
            case 'object':
              ctx.editDoc.appendAt(field.fullname, defVal, newKey)
              break
            case 'array':
              ctx.editDoc.appendAt(field.fullname, defVal, newKey)
              break
          }
        },
      },
      `添加属性-${childProp.attrs.title ?? childProp.name}`
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
        if (!field.children?.length) return
        if (typeof ctx.onFileSelect === 'function') {
          ctx.onFileSelect(field).then((fileData: any) => {
            debug(
              `对象字段【${field.fullname}】选取文件：\n` +
                JSON.stringify(fileData, null, 2)
            )
            _setNewFileData(field, fileData, ctx)
          })
        } else if (typeof ctx.onFileUpload === 'function') {
          /**提供了接收上传本地文件的方法*/
          _pickLocalFile(ctx, field, ctx.onFileUpload)
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
