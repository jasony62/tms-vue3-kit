import { h, VNode } from 'vue'
import { SchemaIter, RawSchema, SchemaProp } from '@/json-schema/model'
import { createField, Field } from './fields'
import { FieldWrap, FormNode, components, prepareFieldNode } from './nodes'
import { getChild } from '@/utils'

const debug = require('debug')('json-doc')

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

/**根据文档数据生成数组项目的字段*/
function createArrayItemFields(ctx: FormContext, prop: SchemaProp): Field[] {
  const fieldValue = getChild(ctx.editDoc, prop.parentFullname)
  if (Array.isArray(fieldValue) && fieldValue.length) {
    let fields = fieldValue.map((val, index) => {
      const field = createField(prop, index)
      return field
    })
    debug(`属性【${prop.fullname}】根据文档数据生成${fields.length}个字段`)
    return fields
  }

  return []
}

/**根据文档数据生成可选属性的字段*/
function createOptionalFields(
  ctx: FormContext,
  prop: SchemaProp,
  pending?: StackField
): Field[] {
  /*需要根据数据对象的值决定是否生成字段和节点*/
  const fieldValue = getChild(ctx.editDoc, prop.parentFullname)
  let keys: string[] = []
  if (typeof fieldValue === 'object') {
    let re: RegExp
    try {
      re = eval(prop.name)
    } catch (e) {
      re = new RegExp(prop.name)
    }
    Object.keys(fieldValue).forEach((key) => {
      // 检查字段是否为properties中定义的字段，是否符合正则表达式
      if (pending?.childNames.includes(key)) {
        debug(`属性【${prop.fullname}】忽略已存在文档数据【${key}】`)
        return
      }
      if (!re.test(key)) {
        debug(`属性【${prop.fullname}】忽略不匹配文档数据【${key}】`)
        return
      }
      keys.push(key)
    })
  }
  if (keys.length) {
    debug(`属性【${prop.fullname}】需要创建【${keys.length}】个字段`)
    let fields = keys.map((key) => {
      const field = createField(prop, -1, key)
      debug(`属性【${prop.fullname}】生成字段【${field.fullname}】`)
      return field
    })
    debug(`属性【${prop.fullname}】根据文档数据生成${fields.length}个字段`)
    return fields
  }

  return []
}

type FieldVNodePair = {
  field: Field
  vnode: VNode
}

/**生成字段和节点*/
function createFieldNode(
  ctx: FormContext,
  prop: SchemaProp,
  pending?: StackField
): FieldVNodePair | FieldVNodePair[] {
  let arrayItemIndex = pending?.field.index ?? -1
  /**创建和当前属性对应的field*/
  if (prop.isPattern) {
    debug(
      `属性【${prop.fullname}】是正则表达式定义的可选属性，需要根据文档数据生成字段`
    )
    const fields = createOptionalFields(ctx, prop, pending)
    if (fields.length) {
      const pairs = fields.map((field) => {
        let vnode = createFieldWrapNode(ctx, field)
        return { field, vnode }
      })
      debug(`属性【${prop.fullname}】根据文档数据生成${pairs.length}个字段节点`)
      return pairs
    }
    return []
  } else {
    const field = createField(prop, arrayItemIndex)
    const vnode = createFieldWrapNode(ctx, field)
    debug(`属性【${prop.fullname}】生成字段【${field.fullname}】，生成节点`)

    return { field, vnode }
  }
}

/**创建嵌套节点*/
function createNestNode(
  ctx: FormContext,
  field: Field,
  children: VNode[]
): VNode {
  const node = prepareFieldNode(ctx, field, children)

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

type StackField = {
  field: Field
  childNames: string[]
  children: VNode[]
}

class Stack {
  nodes: VNode[]
  pendings: StackField[] // 等待处理的字段
  ctx: FormContext

  constructor(nodes: VNode[], ctx: FormContext) {
    this.nodes = nodes
    this.pendings = []
    this.ctx = ctx
  }

  push(field: Field) {
    const pending = { field, childNames: [], children: [] }
    this.pendings.push(pending)
    return pending
  }

  pop() {
    return this.pendings.pop()
  }

  /**获得属性所有的父字段*/
  propParent(childProp: SchemaProp): StackField[] {
    const topPendings = []
    for (let i = this.pendings.length - 1; i >= 0; i--) {
      let pending = this.pendings[i]
      let { field } = pending
      let isParent = false
      if (field.scheamProp.isPattern || childProp.isArrayItem) {
        // 可选属性
        isParent = field.scheamProp.fullname === childProp.path
      } else {
        if (childProp.path === field.fullname) {
          isParent = true
        } else if (childProp.path === field.scheamProp.fullname) {
          isParent = true
        }
      }

      if (isParent) topPendings.push(pending)

      debug(
        `属性【${childProp.fullname}】${isParent ? '' : '不'}是【${
          field.fullname
        }】【${field.scheamProp.fullname}】的子属性`
      )
    }

    return topPendings
  }

  /**字段只会有1个或没有父字段*/
  fieldParent(field: Field): StackField | undefined {
    for (let i = 0; i < this.pendings.length; i++) {
      let pending = this.pendings[i]
      if (field.isChildOf(pending.field)) {
        debug(
          `字段【${field.fullname}】是【${pending.field.fullname}】的子字段`
        )
        return pending
      }
    }
  }

  /**将创建的节点放入堆栈中的父字段*/
  addNode(pair: FieldVNodePair, parent: StackField) {
    if (parent) {
      pair.field.path = parent.field.fullname
      debug(
        `字段【${parent.field.fullname}】添加子节点【${pair.field.fullname}】`
      )
      parent.childNames.push(pair.field.name)
      parent.children.push(pair.vnode)
    }
  }

  /**堆栈中的所有字段生成节点*/
  shrink() {
    debug('执行堆栈收缩')
    let pending
    while ((pending = this.pendings.pop())) {
      let { field, children } = pending
      let vnode = createNestNode(this.ctx, field, children)
      if (this.length === 0) {
        this.nodes.push(vnode)
      } else {
        let parent = this.fieldParent(field)
        if (parent) {
          this.addNode({ field, vnode }, parent)
        } else {
          debug(`字段【${field.fullname}】【${field.path}】没有找到父字段`)
        }
      }
    }
  }

  get length() {
    return this.pendings.length
  }
}

export function build(ctx: FormContext): VNode[] {
  const nodes: VNode[] = [] // 表单节点
  const { schema, editDoc } = ctx

  /**创建属性迭代器*/
  let iter = new SchemaIter(JSON.parse(JSON.stringify(schema)))

  // 用于记录处理过程的中间数据
  let stack = new Stack(nodes, ctx)

  // 依次处理JSONSchema的属性
  let prop: SchemaProp
  for (prop of iter) {
    // 不需要处理根节点
    if (prop.name === iter.rootName) continue
    debug(`属性【${prop.fullname}】开始处理`)

    // 当前属性的父字段。如果是父属性是可选属性，可能有多个父字段
    let parentFields: StackField[]
    if (prop.path === iter.rootName) {
      // 顶层属性不会有父字段
      parentFields = []
    } else {
      // 如果是子属性，检查其依赖的父属性是否存在，若不存在，跳过
      parentFields = stack.propParent(prop)
      if (parentFields.length === 0) {
        debug(`属性【${prop.fullname}】父字段不存在，跳过`)
        continue
      }
    }

    // 需要处理题目是否可见
    if (false === getFieldVisible(prop, editDoc)) {
      // 子字段也不能显示
      // 将对应数据对象的值清空
      continue
    }

    // 新的顶层数据，收缩堆栈数据
    if (parentFields.length === 0) stack.shrink()

    if (prop.attrs.type === 'object') {
      if (prop.isPattern) {
        // 根据数据生成实属性。一个模式可能生成多个实属性。
        if (parentFields.length) {
          parentFields.forEach((pending) => {
            let fields = createOptionalFields(ctx, prop, pending)
            debug(`属性【${prop.fullname}:object】创建${fields.length}个字段`)
            if (fields.length) {
              fields.forEach((field) => {
                stack.push(field)
                debug(
                  `属性【${prop.fullname}:object】字段【${field.fullname}】放入堆栈`
                )
              })
            }
          })
        } else {
          // 顶层节点是可选属性
        }
      } else {
        // 创建嵌套节点，将当前节点入栈，等待子节点生成完
        if (parentFields.length) {
          parentFields.forEach((pending) => {
            const newField = createField(prop)
            newField.path = pending.field.fullname
            stack.push(newField)
            debug(`属性【${prop.fullname}:object】生成字段放入堆栈`)
          })
        } else {
          const newField = createField(prop)
          stack.push(newField)
          debug(`属性【${prop.fullname}:object】生成字段放入堆栈`)
        }
      }
    } else if (prop.attrs.type === 'array') {
      // 创建嵌套节点，将当前节点入栈，等待子节点生成完
      const newField = createField(prop)
      const pending = stack.push(newField)
      debug(
        `属性【${prop.fullname}:array】生成字段【${newField.fullname}】放入堆栈`
      )
      /**如果数组中的项目是简单类型，生成字段*/
      if (prop.items?.type) {
        let { fullname, items } = prop
        debug(`属性【${fullname}:array】生成数组项目【${items.type}】属性`)
        let itemProp = new SchemaProp(`${fullname}[*]`, '', items.type)
        const fields = createArrayItemFields(ctx, itemProp)
        if (['object', 'array'].includes(items.type)) {
          // 根据文档数据生成字段，放入堆栈
          fields.forEach((field) => {
            stack.push(field)
          })
        } else {
          // 简单类型，生成节点，放入父字段
          fields.forEach((field) => {
            const vnode = createFieldWrapNode(ctx, field)
            stack.addNode({ field, vnode }, pending)
          })
        }
      }
    } else {
      // 简单类型，用户输入字段，生成节点放入父字段或顶层节点
      if (parentFields.length) {
        // 有几个父字段，就生成几个字段节点
        parentFields.forEach((pending) => {
          let pair = createFieldNode(ctx, prop, pending)
          debug(`属性【${prop.fullname}】生成的节点放入堆栈`)
          if (Array.isArray(pair)) {
            // 如果是可选属性有可能创建多个字段
            pair.forEach((p) => stack.addNode(p, pending))
          } else {
            stack.addNode(pair, pending)
          }
        })
      } else {
        // 顶层属性，生成节点，放入最终结果
        let pair = createFieldNode(ctx, prop)
        debug(`属性【${prop.fullname}】生成顶层节点，放入最终结果`)
        if (Array.isArray(pair)) nodes.push(...pair.map((p) => p.vnode))
        else nodes.push(pair.vnode)
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
  onMessage: Function
  onAxios?: Function
  onFileUpload?: Function
  onFileSelect?: Function
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
