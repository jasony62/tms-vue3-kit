import { h, VNode } from 'vue'
import { SchemaIter, RawSchema, SchemaProp } from '../json-schema/model'
import { createField, Field } from './fields'
import { LabelNode, FormNode, components, prepareFieldNode } from './nodes'

function createLabelAndDesc(
  ctx: FormContext,
  field: Field,
  fieldNode: any
): VNode {
  if (field.label) {
    const labelNode = new LabelNode(ctx, field)
    const labelNodes = []
    if (components.label.option.native) {
      labelNodes.push(
        h(
          'span',
          {
            'data-required-field': field.required ? 'true' : 'false',
          },
          field.label
        )
      )
    }
    labelNodes.push(fieldNode)
    if (field.description) {
      labelNodes.push(
        h('small', { class: ['tvu-jdoc__input-desc'] }, field.description)
      )
    }

    return labelNode.createElem(labelNodes)
  } else {
    const descNodes = []
    descNodes.push(fieldNode)
    if (field.description) {
      descNodes.push(
        h('small', { class: ['tvu-jdoc__input-desc'] }, field.description)
      )
    }
    return h('div', { class: ['tvu-jdoc__node'] }, descNodes)
  }
}

function createWrapClass(labelAndDescNodes: VNode): VNode {
  // if (this.fieldWrapClass) {
  //   return h(
  //     'div',
  //     {
  //       class: this.fieldWrapClass,
  //     },
  //     labelAndDescNodes
  //   )
  // }
  return labelAndDescNodes
}
/**
 * @param {object} field
 */
function createFieldWrapNode(ctx: FormContext, field: Field): VNode {
  const node = prepareFieldNode(ctx, field)

  const fieldNode = node.createElem()

  const labelAndDesc = createLabelAndDesc(ctx, field, fieldNode)

  return createWrapClass(labelAndDesc)
}

/**创建叶节点*/
function createLeafNode(ctx: FormContext, prop: any): VNode {
  /**创建和当前属性对应的field*/
  const newField = createField(prop, {}, {})
  // this.setModelValue(newField)
  return createFieldWrapNode(ctx, newField)
}

/**创建嵌套节点*/
function createNestNode(ctx: FormContext, prop: any, children: VNode[]): VNode {
  const newField = createField(prop, {}, {})
  const node = prepareFieldNode(ctx, newField)

  if (prop.attrs.title) {
    let title = h(
      'div',
      {
        class: 'tvu-jdoc__nest-title',
      },
      prop.attrs.title
    )
    children.splice(0, 0, title)
  }

  if (
    newField.type === 'file' &&
    newField.attachment?.length &&
    ctx.onFileDownload
  ) {
    let attachmentVNodes = []
    attachmentVNodes.push(
      h(
        components.a.tag,
        {
          props: { underline: false },
          attrs: { disabled: true },
        },
        '参考模板：'
      )
    )
    newField.attachment.forEach((attach: any) => {
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
      attachmentVNodes.push(element)
    })

    children.push(
      h('div', { class: ['tvu-jdoc__node__attachment'] }, attachmentVNodes)
    )
  }

  const fieldNode = node.createElem(children)

  return fieldNode
  // return h(
  //   'div',
  //   {
  //     class: 'tvu-jdoc__nest',
  //   },
  //   [title, fieldNode]
  // )
}

function getFieldVisible(prop: SchemaProp, doc: any): boolean {
  let ruleSet = prop.dependencies
  if (!ruleSet) return true

  let visible = false
  let matched: { [k: string]: boolean } = {}
  let docVal

  for (const [key, rule] of Object.entries(ruleSet['dependencyRules'])) {
    if (rule.operator === 'or') {
      matched[key] = false
      rule.rules.forEach(({ property, value }) => {
        docVal = doc[property]
        if (
          docVal === value ||
          (Array.isArray(docVal) && docVal.includes(value))
        ) {
          matched[key] = true
        }
      })
    } else if (rule.operator === 'and') {
      matched[key] = true
      rule.rules.forEach(({ property, value }) => {
        docVal = doc[property]
        if (
          !docVal ||
          (docVal !== value &&
            !(Array.isArray(docVal) && docVal.includes(value)))
        ) {
          matched[key] = false
        }
      })
    }
  }

  if (ruleSet.operator === 'or') {
    visible = Object.values(matched).includes(true)
  } else if (ruleSet.operator === 'and') {
    visible = !Object.values(matched).includes(false)
  }

  return visible
}
/**
 * 根据schema的定义初始化表单的model对象
 *
 * @param {Field} field
 */
// function setModelValue(prop: SchemaProp, editDoc: any, value: any) {
//   const ns = prop.fullname.split('.').slice(1)
//   const vmValue = getChild(editDoc, ns)
//   if (!vmValue) {
//     const n = ns.pop()
//     const ret = ns.length > 0 ? initChild(editDoc, ns) : editDoc
//     if (n) ret[n] = field.value
//   }
// }

class Stack {
  nodes: VNode[]
  data: { prop: SchemaProp; children: VNode[] }[]
  ctx: FormContext

  constructor(nodes: VNode[], ctx: FormContext) {
    this.nodes = nodes
    this.data = []
    this.ctx = ctx
  }

  push(prop: SchemaProp) {
    this.data.push({ prop, children: [] })
  }

  pop() {
    return this.data.pop()
  }

  /**将创建的节点放入堆栈中的父字段*/
  addNode(prop: SchemaProp, node: VNode | VNode[]) {
    if (this.last)
      if (Array.isArray(node)) this.last.children.push(...node)
      else this.last.children.push(node)
  }

  /**如果子节点都准备完毕就出栈*/
  update(path: string) {
    if (this.last) {
      let lastProp = this.last.prop
      if (lastProp.attrs.type === 'object') {
        if (path !== lastProp.fullname) {
          this.shrink()
        }
      } else if (lastProp.attrs.type === 'array') {
        if (path !== lastProp.fullname + '[*]') {
          this.shrink()
        }
      }
    }
  }

  shrink() {
    let pending
    while ((pending = this.data.pop())) {
      let { prop, children } = pending
      let node = createNestNode(this.ctx, prop, children)
      if (this.length === 0) {
        this.nodes.push(node)
      } else {
        this.addNode(prop, node)
      }
    }
  }

  get length() {
    return this.data.length
  }

  // 以后一个元素
  get last() {
    return this.length > 0 ? this.data[this.length - 1] : undefined
  }
}

export function build(ctx: FormContext): VNode[] {
  const nodes: VNode[] = []
  const { schema, editDoc } = ctx
  /***/
  let iter = new SchemaIter(JSON.parse(JSON.stringify(schema)))

  // 用于记录处理过程的中间数据
  let stack = new Stack(nodes, ctx)

  // 依次处理JSONSchema的属性
  let prop: SchemaProp
  for (prop of iter) {
    // 不处理根节点
    if (prop.path === '') continue
    // 需要处理题目是否可见
    if (false === getFieldVisible(prop, editDoc)) {
      // 子字段也不能显示
      // 将对应数据对象的值清空
      continue
    }

    // 更新堆栈数据，如果需要将数据出栈
    stack.update(prop.path)

    if (prop.attrs.type === 'object') {
      // 创建嵌套节点，将当前节点入栈，等待子节点生成完
      stack.push(prop)
    } else if (prop.attrs.type === 'array') {
      // 创建嵌套节点，将当前节点入栈，等待子节点生成完
      stack.push(prop)
    } else {
      // 创建节点，放入堆栈，或结果
      let node = createLeafNode(ctx, prop)
      if (prop.path === '$') {
        // 根属性的子属性，直接放入结果中
        nodes.push(node)
      } else {
        stack.addNode(prop, node)
      }
    }
  }
  stack.shrink()

  if (stack.length > 0) throw Error('生成表单失败，有未解析的数据')

  return nodes
}

let _uid = 0
/**
 * 创建编辑器（一套schema的节点应该只创建一次，否则会多次render）
 */
class Builder {
  _uid: number
  ctx: any

  constructor(ctx: FormContext) {
    this._uid = ++_uid
    this.ctx = ctx
  }

  /**根据schema生成表单 */
  createForm() {
    const { ctx } = this

    const formNode = new FormNode(ctx)

    const formSubNode = build(ctx)

    return formNode.createElem(formSubNode)
  }

  render() {
    const { ctx } = this
    const { schema } = ctx

    const topNodes = []
    if (schema.title) {
      topNodes.push(
        h(components.title.tag, { class: ['tvu-jdoc__title'] }, schema.title)
      )
    }

    if (schema.description) {
      topNodes.push(
        h(
          components.description.tag,
          { class: ['tvu-jdoc__description'] },
          schema.description
        )
      )
    }

    // if (ctx.error) {
    //   const errorNodes = []
    //   if (components.error.option.native) {
    //     errorNodes.push(ctx.error)
    //   }
    //   const errorNode = new Node(ctx, h, components.error)
    //   topNodes.push(errorNode.createElem(errorNodes))
    // }

    topNodes.push(this.createForm())

    return topNodes
  }
}

// 因为编辑器会嵌套，每个编辑器对应不同vm
let mapBuilders = new Map()

export type FormContext = {
  editDoc: any
  schema: RawSchema
  onAxios?: Function
  onFileDownload?: Function
}

/**
 * 渲染函数
 *
 * @param {*} ctx
 * @param {*} createElement
 */
export default function (ctx: FormContext) {
  let builder = mapBuilders.get(ctx)
  if (!builder) {
    builder = new Builder(ctx)
    mapBuilders.set(ctx, builder)
  }
  return builder.render()
}
