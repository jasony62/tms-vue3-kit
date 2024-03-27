import { FieldNode } from './fieldNode'
import { FormContext } from '../builder'
import { Field } from '../fields'
import { components } from '.'
import { SchemaProp } from '@/data-aid.js/json-schema/model'

import Debug from 'debug'

const debug = Debug('json-doc:nodes:object')

/**
 * 根据提供的文件对象数据，更新表单中的文件字段数据
 * @param field
 * @param fileData
 * @param ctx
 */
function _setNewFileData<VNode>(
  field: Field,
  fileData: any,
  ctx: FormContext<VNode>
) {
  field.children?.forEach((cf: Field) => {
    if (typeof fileData[cf.name] !== 'undefined') {
      ctx.editDoc.set(cf.fullname, fileData[cf.name], false)
    }
  })
  ctx.editDoc.forceRender()
}
/**
 * 选择本地文件并上传
 */
function _pickLocalFile<VNode>(
  ctx: FormContext<VNode>,
  field: Field,
  fileUpload: Function
) {
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
const selectOneOfVNode = <VNode>(
  ctx: FormContext<VNode>,
  field: Field
): VNode[] => {
  // 每个互斥组生成一个select控件
  const egSelects: VNode[] = []

  field.schemaProp.isOneOfChildren.forEach(
    (eg: Map<string, SchemaProp[]>, egName: string) => {
      /**
       * 检查是否已经有被选中使用的定义，如果有就不用生成选择列表
       */
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
      /**
       *
       * @param props
       */
      let selectIsOneOf = (props: SchemaProp[]) => {
        let lastChildFullname = ''
        props.forEach((child) => {
          let childFullname = `${field.fullname ? field.fullname + '.' : ''}${
            child.name
          }`
          let childField = ctx.fields?.get(childFullname)
          if (childField) {
            // 获得亲和组名称
            let ingroup = Field.isOneOfInclusiveGroupName(childField)
            ctx.oneOfSelected?.set(childFullname, { ingroup })
            ctx.oneOfSelectedInGroups?.add(ingroup)
            lastChildFullname = childFullname
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
            lastChildFullname = `${
              field.fullname ? field.fullname + '.' : ''
            }${newKey}`
          }
        })
        /**
         * 只有1个属性，且属性的类型是对象或数组，设置为展开
         */
        if (
          props.length === 1 &&
          ['object', 'array'].includes(props[0].attrs.type)
        ) {
          ctx.nestExpanded?.add(lastChildFullname)
        }
      }
      /**
       * 如果互斥组中的属性存在默认选项，且选项没有生成过节点，就生成
       * 亲和组中任意一个是默认选项，整个亲和组就作为默认选项
       */
      let hasDefault = false
      for (let [, props] of eg) {
        let defaultProp = props.find((p) => p.isOneOfDefault === true)
        if (defaultProp) {
          let fullname = `${field.fullname}.${defaultProp.name}`
          if (!ctx.oneOfSelectedDefault?.has(fullname)) {
            selectIsOneOf(props)
            ctx.oneOfSelectedDefault?.add(fullname)
            hasDefault = true
            break
          }
        }
      }
      if (hasDefault) {
        ctx.editDoc.forceRender()
        return
      }
      /**
       * 准备生成排他属性下拉列表
       * 如果只有1个属性，使用属性的标题作为lable，属性的名称作为值
       * 如果是亲和组，使用组名称作为标题和值
       */
      const options: VNode[] = []
      const labels: string[] = []
      eg.forEach((props: SchemaProp[], igName: string) => {
        let label =
          props.length === 1
            ? props[0].attrs.title
              ? props[0].attrs.title
              : igName
            : igName
        let vnode = ctx.h('option', { value: igName }, label)
        labels.push(label)
        options.push(vnode)
      })
      options?.splice(
        0,
        0,
        ctx.h(
          'option',
          { value: '' },
          `--选择【${egName ? egName : labels.join('/')}】输入方式--`
        )
      )
      /**
       * 生成选项列表
       * 规则1：
       * 固定名称的isOneOf属性不论是否选择都会先创建字段，选择的目的是为了让这些字段的节点可见
       * 模板名称的isOneOf属性不会事先生成，要在文档中添加数据，文档中有数据了就会生成节点并且可见
       * 规则2：
       * 选择的属性只有1个，切属性的类型是对象或数组，那么选中后，设置为展开状态
       *
       */
      const vnSelect = ctx.h(
        'select',
        {
          value: '',
          class: ['tvu-input', 'tvu-jdoc__one-of-select'],
          onChange: (event: any) => {
            const selectedGroupName = event.target ? event.target.value : event
            if (selectedGroupName === '') return
            eg.forEach((props: SchemaProp[], egName: string) => {
              if (egName !== selectedGroupName) return
              selectIsOneOf(props)
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
const propAddVNode = <VNode>(
  ctx: FormContext<VNode>,
  field: Field,
  patternChildren: SchemaProp[]
) => {
  /**给每个模板属性创建一个添加字段操作*/
  let addVNodes = patternChildren.map((childProp) => {
    const label =
      patternChildren.length === 1
        ? '添加'
        : `添加-${childProp.attrs.title ?? childProp.name}`

    return ctx.h(
      components.button.tag,
      {
        name: childProp.fullname,
        title: childProp.name,
        class: ['tvu-button', 'tvu-button--green'],
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
      label
    )
  })
  return ctx.h('div', { class: ['tvu-jdoc__nest__actions'] }, addVNodes)
}
/**
 * 执行粘贴操作
 * @param ctx
 * @param field
 * @returns
 */
const propPasteVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  const { fullname } = field
  let pasteVNode = ctx.h(
    components.button.tag,
    {
      class: ['tvu-button'],
      onClick: async () => {
        try {
          let clipData
          if (typeof ctx.onPaste === 'function') {
            clipData = await ctx.onPaste(field)
          } else {
            /**从粘贴板中获取数据，添加到文档中*/
            const clipText = await navigator.clipboard.readText()
            clipData = JSON.parse(clipText)
          }
          ctx.editDoc.set(fullname, clipData)
        } catch (e: any) {
          if (e)
            ctx.onMessage(
              `粘贴【${fullname ? fullname : '全部'}】失败：` + e.message
            )
        }
      },
      title: fullname,
    },
    '粘贴'
  )

  return pasteVNode
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
      class: ['tvu-button'],
      onClick: async () => {
        ctx.editDoc.remove(field.fullname)
      },
      title: field.fullname,
    },
    '清空'
  )

  return pasteVNode
}

/**
 * 执行选取文件操作
 * @param ctx
 * @param field
 * @returns
 */
const itemPickVNode = <VNode>(ctx: FormContext<VNode>, field: Field) => {
  let pickVNode = ctx.h(
    components.button.tag,
    {
      class: ['tvu-button'],
      onClick: () => {
        if (!field.children?.length) return
        if (typeof ctx.onFileSelect === 'function') {
          const fieldVal = ctx.editDoc.get(field.fullname)
          ctx.onFileSelect(field, fieldVal).then((fileData: any) => {
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

export class ObjectNode<VNode> extends FieldNode<VNode> {
  private _children

  constructor(
    ctx: FormContext<VNode>,
    field: Field,
    children?: (VNode | null)[]
  ) {
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
   * 子字段节点
   * 如果对象中包含可选属性，需要提供添加删除属性，修改属性名称的操作。
   * 粘贴和清空（删除属性）操作
   * 如果对象的格式是文件，需要支持选取文件操作
   */
  protected children(): VNode[] {
    const { ctx, field } = this

    /* 节点未展开时，不生成子节点 */
    if (field.fullname !== '' && !ctx.nestExpanded?.has(field.fullname))
      return []
    /**
     * 子字段节点
     */
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

    /**
     * 根字段，字段或子字段为激活状态时，或者字段为展开状态时，需要支持的操作
     */
    if (
      field.fullname === '' ||
      // ctx.activeFieldName === field.fullname
      ctx.activeFieldName?.indexOf(field.fullname) === 0 ||
      ctx.nestExpanded?.has(field.fullname)
    ) {
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
        vnodes.push(...selectOneOfVNode<VNode>(ctx, field))
      }

      const actionVNodes = [] // 对象需要支持的整体操作
      /**如果开放paste操作，添加按钮*/
      if (ctx.enablePaste === true) {
        // 只有值为空时才允许粘贴操作
        //const val = ctx.editDoc.get(field.fullname)
        //if (!val || Object.keys(val).length === 0) {
        debug(`对象字段【${field.fullname}】需要支持黏贴操作`)
        let pasteVNode = propPasteVNode(ctx, field)
        actionVNodes.push(pasteVNode)
        //}
      }

      /**如果对象的格式是对象，添加选取文件操作*/
      if (field.schemaProp.attrs.format === 'file') {
        debug(
          `对象字段【${field.fullname}】【format=file】，需要支持选取文件操作`
        )
        let pickFileVNode = itemPickVNode(ctx, field)
        actionVNodes.push(pickFileVNode)
      }

      /* 清除属性。根属性不允许清除。*/
      if (field.shortname) actionVNodes.push(propRemoveVNode(ctx, field))

      if (actionVNodes.length) {
        vnodes.push(
          ctx.h('div', { class: ['tvu-jdoc__nest__actions'] }, actionVNodes)
        )
      }
    }

    return vnodes
  }
}
