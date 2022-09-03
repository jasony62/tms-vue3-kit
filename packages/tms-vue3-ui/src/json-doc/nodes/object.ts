import { FieldNode } from './fieldNode'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { h, VNode } from 'vue'
import { components } from '.'
import RandExp from 'randexp'
import Debug from 'debug'

const debug = Debug('json-doc:nodes:object')

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
  // const { accept, size } = field.schemaProp
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
 * 选择使用的oneOf（排他）属性
 * @param ctx
 * @param field
 */
const selectOneOfVNode = (ctx: FormContext, field: Field) => {
  const options = field.schemaProp.isOneOfChildren?.map((child) => {
    return h(
      'option',
      { value: child.name },
      `${child.attrs.title || child.name}`
    )
  })

  options?.splice(
    0,
    0,
    h('option', { selected: true }, '--选择oneOf属性定义--')
  )

  return h(
    'select',
    {
      class: ['tvu-input', 'tvu-jdoc__one-of-select'],
      onChange: (event: any) => {
        const propName = event && event.target ? event.target.value : event
        if (propName) {
          /**清除已选字段的选中状态*/
          field.schemaProp.isOneOfChildren?.forEach((child) => {
            let childFullname = `${field.fullname ? field.fullname + '.' : ''}${
              child.name
            }`
            let childField = ctx.fields?.get(childFullname)
            if (childField) {
              propName === childField.name
                ? ctx.oneOfSelected.add(childFullname)
                : ctx.oneOfSelected.delete(childFullname)
            }
          })
          ctx.editDoc.forceRender()
        }
      },
    },
    options
  )
}
/**
 * 添加模板子属性操作
 * @param ctx
 * @param field
 * @returns
 */
const propAddVNode = (ctx: FormContext, field: Field) => {
  /**给每个模板属性创建一个添加字段操作*/
  let addVNodes = field.schemaProp.patternChildren?.map((childProp) =>
    h(
      components.button.tag,
      {
        name: childProp.fullname,
        title: childProp.name,
        class: ['tvu-button'],
        onClick: () => {
          /**生成字段名称和初始值*/
          const { fullname } = field
          const { name, attrs } = childProp
          const newKey = Field.initialKey(name)
          const initVal = Field.initialVal(attrs.default, attrs.type)
          debug(
            `字段【${fullname}】执行【添加${
              attrs.title ?? name
            }属性】，随机属性名：${newKey}，初始值：${JSON.stringify(initVal)}`
          )
          ctx.editDoc.appendAt(fullname, initVal, newKey)
        },
      },
      `添加-${childProp.attrs.title ?? childProp.name}`
    )
  )
  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNodes)
}
/**
 * 执行粘贴操作
 * @param ctx
 * @param field
 * @returns
 */
const propPasteVNode = (ctx: FormContext, field: Field) => {
  let pasteVNode = h(
    components.button.tag,
    {
      class: ['tvu-button'],
      onClick: async () => {
        if (typeof ctx.onPaste === 'function') {
          ctx.onPaste(field).then((clipData: any) => {
            ctx.editDoc.set(field.fullname, clipData)
          })
        } else {
          /**从粘贴板中获取数据，添加到文档中*/
          const clipText = await navigator.clipboard.readText()
          try {
            let clipData = JSON.parse(clipText)
            if (clipData ?? false) ctx.editDoc.set(field.fullname, clipData)
          } catch (e: any) {
            ctx.onMessage(
              `粘贴内容填充字段【${field.fullname}】失败：` + e.message
            )
          }
        }
      },
    },
    `黏贴${field.shortname ? '-' + field.shortname : '全部'}`
  )

  return pasteVNode
}

/**
 * 执行选取文件操作
 * @param ctx
 * @param field
 * @returns
 */
const itemPickVNode = (ctx: FormContext, field: Field) => {
  let pickVNode = h(
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
  return pickVNode
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

    const { schemaProp } = field
    const { patternChildren, isOneOfChildren } = schemaProp
    /**添加模板属性操作*/
    if (patternChildren?.length) {
      vnodes.push(propAddVNode(ctx, field))
    }
    /**选择oneOf属性操作*/
    if (Array.isArray(isOneOfChildren) && isOneOfChildren.length) {
      let hasSelected = isOneOfChildren.some((childProp) => {
        let fullname =
          (field.fullname ? field.fullname + '.' : '') + childProp.name
        return ctx.oneOfSelected.has(fullname)
      })
      if (!hasSelected) vnodes.push(selectOneOfVNode(ctx, field))
    }

    /**如果开放paste操作，添加按钮*/
    const actionVNodes = []
    if (ctx.enablePaste === true) {
      debug(`对象字段【${field.fullname}】需要支持黏贴操作`)
      let pasteVNode = propPasteVNode(ctx, field)
      actionVNodes.push(pasteVNode)
    }
    /**如果对象的格式是对象，添加选取文件操作*/
    if (field.schemaProp.attrs.format === 'file') {
      debug(
        `对象字段【${field.fullname}】【format=file】，需要支持选取文件操作`
      )
      let pickFileVNode = itemPickVNode(ctx, field)
      actionVNodes.push(pickFileVNode)
    }
    if (actionVNodes.length) {
      vnodes.push(
        h('div', { class: ['tvu-jdoc__nest__actions'] }, actionVNodes)
      )
    }

    return vnodes
  }
}
