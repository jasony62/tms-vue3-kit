import { FieldNode } from './fieldNode'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { h, VNode } from 'vue'
import { components } from '.'
import Debug from 'debug'
import { SchemaProp } from '@/json-schema/model'

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
const selectOneOfVNode = (ctx: FormContext, field: Field): VNode[] => {
  // 每个互斥组生成一个select控件
  const egSelects: VNode[] = []

  field.schemaProp.isOneOfChildren.forEach(
    (eg: Map<string, SchemaProp[]>, egName: string) => {
      // 检查是否已经有被选中使用的定义
      let egChildren: SchemaProp[] = []
      eg.forEach((props: SchemaProp[]) => {
        egChildren.push(...props)
      })
      let hasSelected = egChildren.some((childProp) => {
        let fullname =
          (field.fullname ? field.fullname + '.' : '') + childProp.name
        return ctx.oneOfSelected?.has(fullname)
      })
      if (hasSelected) return
      // 一个互斥组中的选项
      const options: VNode[] = []
      const labels: string[] = []
      eg.forEach((props: SchemaProp[], igName: string) => {
        let label =
          props.length === 1
            ? props[0].attrs.title
              ? props[0].attrs.title
              : igName
            : igName
        let vnode = h('option', { value: igName }, label)
        labels.push(label)
        options.push(vnode)
      })
      options?.splice(
        0,
        0,
        h(
          'option',
          { value: '' },
          `--选择【${egName ? egName : labels.join('/')}】输入方式--`
        )
      )
      const vnSelect = h(
        'select',
        {
          value: '',
          class: ['tvu-input', 'tvu-jdoc__one-of-select'],
          onChange: (event: any) => {
            const selectedGroupName = event.target ? event.target.value : event
            if (selectedGroupName === '') return
            /**清除已选字段的选中状态*/
            eg.forEach((props: SchemaProp[], egName: string) => {
              if (egName !== selectedGroupName) return
              props.forEach((child) => {
                let childFullname = `${
                  field.fullname ? field.fullname + '.' : ''
                }${child.name}`
                let childField = ctx.fields?.get(childFullname)
                if (childField) {
                  let ingroup = Field.isOneOfInclusiveGroupName(childField)
                  ctx.oneOfSelected?.set(childFullname, { ingroup })
                } else {
                  /**
                   * 如果是模板属性，需要重新生成字段
                   */
                  const { name, attrs } = child
                  const newKey = Field.initialKey(name)
                  const initVal = Field.initialVal(attrs.default, attrs.type)
                  debug(
                    `字段【${childFullname}】执行【添加${
                      attrs.title ?? name
                    }属性】，随机属性名：${newKey}，初始值：${JSON.stringify(
                      initVal
                    )}`
                  )
                  ctx.editDoc.appendAt(field.fullname, initVal, newKey)
                }
              })
            })
            ctx.editDoc.forceRender()
          },
        },
        options
      )
      egSelects.push(vnSelect)
    }
  )

  return egSelects
}
/**
 * 添加模板子属性操作
 * @param ctx
 * @param field
 * @param patternChildren 支持添加的属性定义
 * @returns
 */
const propAddVNode = (
  ctx: FormContext,
  field: Field,
  patternChildren: SchemaProp[]
) => {
  /**给每个模板属性创建一个添加字段操作*/
  let addVNodes = patternChildren.map((childProp) =>
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
      title: field.fullname,
    },
    `粘贴-${
      field.label ? field.label : field.shortname ? field.shortname : '全部'
    }`
  )

  return pasteVNode
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
      class: ['tvu-button'],
      onClick: async () => {
        ctx.editDoc.remove(field.fullname)
      },
      title: field.fullname,
    },
    `清除-${
      field.label ? field.label : field.shortname ? field.shortname : '全部'
    }`
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

  constructor(ctx: FormContext, field: Field, children?: (VNode | null)[]) {
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
    let vnodes = []
    if (this._children) {
      this._children.forEach((c) => {
        if (c) vnodes.push(c)
      })
    }

    const { schemaProp } = field
    const { patternChildren, isOneOfChildren } = schemaProp
    debug(
      `对象字段【${field.fullname}】【${schemaProp.fullname}】需要处理子节点`
    )

    /**提取所有的oneOf属性便于后续处理*/
    const flattenIsOneOfChildren: SchemaProp[] = []
    isOneOfChildren.forEach((eg: Map<string, SchemaProp[]>) => {
      eg.forEach((props: SchemaProp[]) => {
        flattenIsOneOfChildren.push(...props)
      })
    })

    /**添加模板属性操作*/
    if (patternChildren?.length) {
      let availablePatternChildren
      if (flattenIsOneOfChildren.length) {
        availablePatternChildren = patternChildren.filter(
          (childProp) => !flattenIsOneOfChildren.includes(childProp)
        )
      } else {
        availablePatternChildren = patternChildren
      }
      if (availablePatternChildren && availablePatternChildren.length) {
        vnodes.push(propAddVNode(ctx, field, availablePatternChildren))
      }
    }
    /**选择oneOf属性操作*/
    if (flattenIsOneOfChildren.length) {
      vnodes.push(...selectOneOfVNode(ctx, field))
    }

    /**如果开放paste操作，添加按钮*/
    const actionVNodes = []
    if (ctx.enablePaste === true) {
      // 只有值为空时才允许粘贴操作
      const val = ctx.editDoc.get(field.fullname)
      if (!val || Object.keys(val).length === 0) {
        debug(`对象字段【${field.fullname}】需要支持黏贴操作`)
        let pasteVNode = propPasteVNode(ctx, field)
        actionVNodes.push(pasteVNode)
      }
    }

    /**如果对象的格式是对象，添加选取文件操作*/
    if (field.schemaProp.attrs.format === 'file') {
      debug(
        `对象字段【${field.fullname}】【format=file】，需要支持选取文件操作`
      )
      let pickFileVNode = itemPickVNode(ctx, field)
      actionVNodes.push(pickFileVNode)
    }

    /*清除属性。根属性不允许清除。*/
    if (field.shortname) actionVNodes.push(propRemoveVNode(ctx, field))

    if (actionVNodes.length) {
      vnodes.push(
        h('div', { class: ['tvu-jdoc__nest__actions'] }, actionVNodes)
      )
    }

    return vnodes
  }
}
