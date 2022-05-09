import { h, VNode } from 'vue'
import { SchemaIter, RawSchema, SchemaProp } from '@/json-schema/model'
import { createField, Field } from './fields'
import { FieldWrap, FormNode, components, prepareFieldNode } from './nodes'
import { getChild } from '@/utils'

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
  const fieldNode = prepareFieldNode(ctx, field)

  const wrapNode = new FieldWrap(ctx, fieldNode)
  const labelAndDesc = wrapNode.createElem()

  return createWrapClass(labelAndDesc)
}

/**创建字段节点*/
function createFieldNode(ctx: FormContext, prop: any): VNode | VNode[] {
  /**创建和当前属性对应的field*/
  if (prop.isArrayItem) {
    let fieldValue = getChild(ctx.editDoc, prop.parentFullname)
    if (Array.isArray(fieldValue) && fieldValue.length) {
      return fieldValue.map((val, index) => {
        const newField = createField(prop, index)
        return createFieldWrapNode(ctx, newField)
      })
    } else {
      return []
    }
  } else {
    const newField = createField(prop)
    return createFieldWrapNode(ctx, newField)
  }
}

/**创建嵌套节点*/
function createNestNode(
  ctx: FormContext,
  prop: any,
  children: (VNode | VNode[])[]
): VNode {
  const newField = createField(prop)
  const node = prepareFieldNode(ctx, newField, children)

  const wrapNode = new FieldWrap(ctx, node)
  const labelAndDesc = wrapNode.createElem()

  return createWrapClass(labelAndDesc)
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

class Stack {
  nodes: VNode[]
  data: { prop: SchemaProp; children: (VNode | VNode[])[] }[]
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
    if (this.last) this.last.children.push(node)
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

  /**创建属性迭代器*/
  let iter = new SchemaIter(JSON.parse(JSON.stringify(schema)))

  // 用于记录处理过程的中间数据
  let stack = new Stack(nodes, ctx)

  // 依次处理JSONSchema的属性
  let prop: SchemaProp
  for (prop of iter) {
    // 不处理根节点
    if (prop.name === iter.rootName) continue

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
      /**如果数组中的项目是简单类型，创建字段*/
      if (prop.items?.type) {
        if (!['object', 'array'].includes(prop.items?.type)) {
          let itemProp = new SchemaProp(
            `${prop.fullname}[*]`,
            '',
            prop.items?.type
          )
          let itemNode = createFieldNode(ctx, itemProp)
          stack.addNode(prop, itemNode)
        }
      }
    } else {
      // 创建节点，放入堆栈，或结果
      let node = createFieldNode(ctx, prop)
      if (prop.path === iter.rootName) {
        // 顶层属性，直接放入结果中
        if (Array.isArray(node)) nodes.push(...node)
        else nodes.push(node)
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
  onFileUpload?: Function
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
