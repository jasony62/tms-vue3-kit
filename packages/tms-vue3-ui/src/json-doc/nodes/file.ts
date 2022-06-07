import { h, VNode } from 'vue'
import { components } from './index'
import { FieldNode } from './fieldNode'
import { Field } from '../fields'
import { FormContext } from '../builder'
/**
 * 选择本地文件并上传
 */
const uploadLocalFile = (
  ctx: FormContext,
  field: Field,
  fieldValue: any[],
  fileUpload: Function
) => {
  let fullname = field.fullname
  const elInput = document.createElement('input')
  elInput.setAttribute('type', 'file')
  const { accept, size, limit } = field.scheamProp.items?.formatAttrs
  if (limit && fieldValue?.length >= limit) {
    ctx.onMessage(`限制上传${limit}文件`)
    return
  }
  if (accept) {
    elInput.setAttribute('accept', accept)
  }
  document.body.appendChild(elInput)
  elInput.addEventListener('change', async (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files) {
      const file = target.files[0]
      if (size && file.size / 1024 / 1024 > size) {
        ctx.onMessage(`上传文件大小过大，超过${size}M`)
        return
      }
      let data = await getFileBase64(file)
      fileUpload({ fullname, data, field }).then((fileData: any) => {
        // 设置初始值和添加项目必须在dom循环中完成，不能在promise外面初始化
        fieldValue ??= ctx.editDoc.init(field.fullname, [])
        // fieldValue.push(fileData)
      })
    }
  })
  elInput.click()
}

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
      class: ['tvu-button'],
      onClick: () => {
        const fieldValue = ctx.editDoc.init(field.fullname, [])
        // if (Array.isArray(fieldValue)) {
        //   fieldValue.push({})
        // }
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
const itemUploadVNode = (ctx: FormContext, field: Field) => {
  let addVNode = h(
    components.button.tag,
    {
      class: ['tvu-button'],
      onClick: () => {
        let fieldValue = ctx.editDoc.get(field.fullname)
        /**只能在数组中添加文件*/
        if ((fieldValue ?? true) || Array.isArray(fieldValue)) {
          if (typeof ctx.onFileSelect === 'function') {
            ctx.onFileSelect(field.fullname, field).then((fileData: any) => {
              // 设置初始值和添加项目必须在dom循环中完成，不能在promise外面初始化
              fieldValue ??= ctx.editDoc.init(field.fullname, [])
              fieldValue.push(fileData)
            })
          } else if (typeof ctx.onFileUpload === 'function') {
            /**提供了接收上传本地文件的方法*/
            uploadLocalFile(ctx, field, fieldValue, ctx.onFileUpload)
          }
        }
      },
    },
    '上传文件'
  )

  return h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNode)
}

const getFileBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const itemRemoveVNode = (fieldValue: any[], index: number) => {
  return h(
    components.button.tag,
    {
      class: ['tvu-button'],
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

  constructor(ctx: FormContext, field: Field, children?: VNode[]) {
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

    this._children.forEach((child, index) => {
      let itemVNodes = [] // 数组中1个item的虚节点
      itemVNodes.push(child)
      let itemActionsVNode = h(
        'div',
        { class: ['jdoc__nest__item__actions'] },
        [itemRemoveVNode(fieldValue, index)]
      )
      let itemNestVNode = h('div', { index, class: ['tvu-jdoc__nest__item'] }, [
        itemVNodes,
        itemActionsVNode,
      ])
      itemNestVNodes.push(itemNestVNode)
    })

    /**是否支持上传文件*/
    let newItemVNode
    if (
      typeof ctx.onFileUpload === 'function' ||
      typeof ctx.onFileSelect === 'function'
    ) {
      newItemVNode = itemUploadVNode(ctx, field)
    } else {
      newItemVNode = itemAddVNode(ctx, field)
    }
    /**模板文件节点*/
    let attaWrap
    if (field.attachment?.length && typeof ctx.onFileDownload === 'function') {
      let attaVNodes = []
      attaVNodes.push(h(components.fieldLabel.tag, {}, '参考模板：'))
      field.attachment.forEach((attach: any) => {
        let element = h(
          components.a.tag,
          {
            url: attach.url,
            name: attach.name,
            onClick: (event: any) => {
              if (event.target.nodeType !== 1) return
              let ele =
                event.target.nodeName.toLowerCase() !== 'a'
                  ? event.target.parentNode
                  : event.target
              let url = ele.getAttribute('url')
              let name = ele.getAttribute('name')
              ctx.onFileDownload?.(name, url)
            },
          },
          attach.name
        )
        attaVNodes.push(element)
      })
      attaWrap = h('div', { class: ['tvu-jdoc__nest__attachment'] }, attaVNodes)
    }

    const children = [...itemNestVNodes, newItemVNode]

    if (attaWrap) children.push(attaWrap)

    return children
  }
}
