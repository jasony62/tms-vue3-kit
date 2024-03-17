import {
  SchemaIter,
  RawSchema,
  SchemaProp,
} from '@/data-aid.js/json-schema/model'
import { createField, Field } from './fields'
import { FieldWrap, prepareFieldNode } from './nodes'
import { DocAsArray } from './model'
import Debug from 'debug'

const debug = Debug('json-doc:build:form:form:former')

function createWrapClass<VNode>(labelAndDescNodes: VNode): VNode {
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
 * 创建字段对应的节点
 * @param ctx
 * @param field
 * @returns
 */
function createFieldWrapNode<VNode>(
  ctx: FormContext<VNode>,
  field: Field
): VNode {
  const fieldNode = prepareFieldNode<VNode>(ctx, field)
  debug(`createFieldWrapNode - 字段【${field.fullname}】完成准备字段节点`)
  const wrapNode = new FieldWrap<VNode>(ctx, fieldNode)
  const labelAndDesc = wrapNode.createElem()
  debug(`createFieldWrapNode - 字段【${field.fullname}】完成包裹节点`)

  return createWrapClass(labelAndDesc)
}

/**根据文档数据生成数组项目的字段*/
function createArrayItemFields<VNode>(
  ctx: FormContext<VNode>,
  parentField: Field,
  prop: SchemaProp
): Field[] {
  debug(
    `createArrayItemFields - 字段【${parentField.fullname}】需要根据文档数据生成数组项目字段`
  )
  // const fieldValue = ctx.editDoc.get(parentField.fullname)
  const fieldValue = ctx.editDoc.get2(parentField.fullname)
  if (Array.isArray(fieldValue) && fieldValue.length) {
    let fields = fieldValue.map((val, index) => {
      // 数组中的项目需要指定索引
      const field = createField(ctx, prop, parentField, index)
      debug(
        `createArrayItemFields - 字段【${parentField.fullname}】根据文档数据生成数组项目字段【${field.fullname}】`
      )
      return field
    })
    debug(
      `createArrayItemFields - 属性【${prop.fullname}】根据文档数据生成了${fields.length}个字段`
    )
    return fields
  }

  return []
}

function createArrayItemNode<VNode>(
  stack: Stack<VNode>,
  field: Field,
  prop: SchemaProp,
  ctx: FormContext<VNode>,
  joint: StackJoint<VNode>
) {
  if (prop.items?.type) {
    let { fullname, items, attrs } = prop
    debug(
      `createArrayItemNode - 属性【${fullname}】需要生成类型为【${items.type}】的子项目字段`
    )
    // 给数组属性的items生成1个模拟属性，用name=[*]表示
    let itemProp = new SchemaProp(`${fullname}`, '[*]', items.type)
    if (items.format) itemProp.attrs.format = items.format
    if (attrs.enum) itemProp.attrs.enum = attrs.enum
    else if (attrs.anyOf) itemProp.attrs.enum = attrs.anyOf // 应该考虑如何优化

    // 需要传递和子属性中哪些是oneOf
    itemProp.isOneOfChildren = prop.isOneOfChildren

    const itemFields = createArrayItemFields(ctx, field, itemProp)
    debug(
      `createArrayItemNode - 属性【${fullname}】生成【${items.type}】类型的数组项目属性，生成【${itemFields.length}】个字段`
    )
    if ('object' === items.type) {
      if (prop.patternChildren) {
        itemProp.patternChildren = prop.patternChildren
        debug(
          `createArrayItemNode - 属性【${fullname}】的子项目属性【${itemProp.fullname}】包含模板【${itemProp.patternChildren.length}】个字段`
        )
      }
      if (prop.isOneOfChildren) itemProp.isOneOfChildren = prop.isOneOfChildren
      // 复合类型，需要根据文档数据生成字段，放入堆栈
      itemFields.forEach((field) => {
        stack.newJoint(field, joint)
        debug(
          `createArrayItemNode - 属性【${fullname}】生成的字段【${field.fullname}】，放入堆栈`
        )
      })
    } else if ('array' === items.type) {
      // 复合类型，需要根据文档数据生成字段，放入堆栈
      itemFields.forEach((field) => {
        stack.newJoint(field, joint)
        debug(
          `createArrayItemNode - 属性【${fullname}】生成的字段【${field.fullname}】，放入堆栈`
        )
      })
    } else {
      // 简单类型，生成节点，放入父字段
      itemFields.forEach((itemField) => {
        const vnode = createFieldWrapNode<VNode>(ctx, itemField)
        stack.addNode({ field: itemField, vnode }, joint)
      })
    }
  }
}

/**
 * 根据文档数据生成可选属性的字段
 */
function createOptionalFields<VNode>(
  ctx: FormContext<VNode>,
  prop: SchemaProp,
  joint: StackJoint<VNode>
): Field[] {
  /*需要根据数据对象的值决定是否生成字段和节点*/
  // const fieldValue = ctx.editDoc.get(joint.field.fullname)
  const fieldValue = ctx.editDoc.get2(joint.field.fullname)
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
      if (joint.childNames.includes(key)) {
        debug(
          `createOptionalFields - 属性【${prop.fullname}】忽略已存在文档数据【${key}】`
        )
        return
      }
      if (!re.test(key)) {
        debug(
          `createOptionalFields - 属性【${prop.fullname}】忽略不匹配文档数据【${key}】`
        )
        return
      }
      keys.push(key)
    })
  } else {
    debug(
      `createOptionalFields - 属性【${prop.fullname}】的父属性【${prop.parentFullname}】的在文档中的值不是对象`
    )
  }
  if (keys.length) {
    debug(
      `createOptionalFields - 属性【${prop.fullname}】需要创建【${keys.length}】个字段`
    )
    let fields = keys.map((key) => {
      const field = createField(ctx, prop, joint.field, -1, key)
      debug(
        `createOptionalFields - 属性【${prop.fullname}】生成字段【${field.fullname}】`
      )
      return field
    })
    debug(
      `createOptionalFields - 属性【${prop.fullname}】根据文档数据生成${fields.length}个字段`
    )
    return fields
  } else {
    debug(
      `createOptionalFields - 属性【${prop.fullname}】无法根据文档数据生成字段\n` +
        JSON.stringify(fieldValue, null, 2)
    )
  }

  return []
}

type FieldVNodePair<VNode> = {
  field: Field
  vnode: VNode
  index?: number // 在父节点中的位置
}

/**
 * 生成可选属性定义的字段和节点
 */
function createOptionalFieldAndNode<VNode>(
  ctx: FormContext<VNode>,
  prop: SchemaProp,
  joint: StackJoint<VNode>
): FieldVNodePair<VNode>[] {
  /**创建和当前属性对应的field*/
  debug(
    `createOptionalFieldNode - 【${joint.field.fullname}】字段下的属性【${prop.fullname}】是正则表达式定义的可选属性，需要根据文档数据生成字段`
  )
  const fields = createOptionalFields(ctx, prop, joint)
  if (fields.length) {
    const pairs = fields.map((field) => {
      let vnode = createFieldWrapNode<VNode>(ctx, field)
      return { field, vnode }
    })
    debug(
      `createOptionalFieldNode - 属性【${prop.fullname}】根据文档数据生成${pairs.length}个字段节点`
    )
    return pairs
  }

  return []
}

/**创建和当前属性定义对应的field和node*/
function createFieldAndNode<VNode>(
  ctx: FormContext<VNode>,
  prop: SchemaProp,
  joint: StackJoint<VNode>
): FieldVNodePair<VNode> {
  const field = createField(ctx, prop, joint.field)
  debug(
    `createFieldAndNode - 属性【${prop.fullname}】生成字段【${field.fullname}】`
  )
  const vnode = createFieldWrapNode<VNode>(ctx, field)
  debug(`createFieldAndNode - 字段【${field.fullname}】，生成节点`)
  /**处理默认值*/
  let snapshot = ctx.editDoc.snapshot()
  // if (!ctx.editDoc.has(field.fullname)) {
  if (!snapshot.has(field.fullname)) {
    debug(
      `createFieldAndNode - 字段【${field.fullname}】在文档中没有值，尝试默认值`
    )
    if (prop.attrs.default) {
      debug(
        `createFieldAndNode - 字段【${field.fullname}】的属性【${prop.fullname}】有默认值，需要更新文档`
      )
      ctx.editDoc.set(field.fullname, prop.attrs.default, false)
    }
  } else {
    debug(`createFieldAndNode - 字段【${field.fullname}】在文档中有值`)
  }

  return { field, vnode }
}

/**创建连接节点*/
function createJointNode<VNode>(
  ctx: FormContext<VNode>,
  field: Field,
  children: (VNode | null)[]
): VNode {
  debug(
    `createJointNode - 字段【${field.fullname}】，生成节点，包含【${children.length}】个子节点`
  )
  const node = prepareFieldNode<VNode>(ctx, field, children)

  const wrapNode = new FieldWrap(ctx, node)
  const labelAndDesc = wrapNode.createElem()

  return createWrapClass(labelAndDesc)
}
/**
 * 检查是否所有规则都满足
 * @param rule
 * @param parentField
 * @param doc
 * @returns
 */
function checkPropExistIfProperties(
  rule: any,
  parentField: Field,
  doc: DocAsArray
): boolean {
  let parentVal = doc.get(parentField.fullname)
  if (!parentVal || typeof parentVal !== 'object') return false

  let props = Object.keys(rule)
  return props.every((prop) => {
    let depVal = parentVal[prop]
    /**
     * 依赖的属性为非空值
     */
    if (rule[prop].valid === true)
      return depVal !== null && depVal !== undefined && depVal !== ''
    /**
     * 依赖的属性等于指定值
     */
    return rule[prop].const === depVal
  })
}
/**
 * 每个条件都要满足
 * @param rules
 * @param parentField
 * @param doc
 * @returns
 */
function checkPropExistIfallOf(
  rules: any,
  parentField: Field,
  doc: DocAsArray
): boolean {
  return rules.every((rule: any) => {
    let matched = false
    let { properties, allOf, oneOf } = rule
    if (typeof properties === 'object') {
      matched = checkPropExistIfProperties(properties, parentField, doc)
    } else if (Array.isArray(oneOf) && oneOf.length) {
      matched = checkPropExistIfoneOf(oneOf, parentField, doc)
    } else if (Array.isArray(allOf) && allOf.length) {
      matched = checkPropExistIfallOf(allOf, parentField, doc)
    }
    return matched
  })
}
/**
 * 只要有1条规则满足就可以
 * @param rules
 * @param parentField
 * @param doc
 * @returns
 */
function checkPropExistIfoneOf(
  rules: any,
  parentField: Field,
  doc: DocAsArray
): boolean {
  return rules.some((rule: any) => {
    let matched = false
    let { properties, allOf, oneOf } = rule
    if (typeof properties === 'object') {
      matched = checkPropExistIfProperties(properties, parentField, doc)
    } else if (Array.isArray(oneOf) && oneOf.length) {
      matched = checkPropExistIfoneOf(oneOf, parentField, doc)
    } else if (Array.isArray(allOf) && allOf.length) {
      matched = checkPropExistIfallOf(allOf, parentField, doc)
    }
    return matched
  })
}

/**
 * 检查属性依赖条件
 * @param prop
 * @param parentField
 * @param doc
 * @returns
 */
function checkPropExistIf(
  prop: SchemaProp,
  parentField: Field,
  doc: DocAsArray
): boolean {
  let { existIf } = prop

  // 未指定规则，属性存在
  if (typeof existIf !== 'object') return true

  const { properties, allOf, oneOf } = existIf

  let matched = false

  if (typeof properties === 'object') {
    matched = checkPropExistIfProperties(properties, parentField, doc)
  } else if (Array.isArray(allOf) && allOf.length) {
    matched = checkPropExistIfallOf(allOf, parentField, doc)
  } else if (Array.isArray(oneOf) && oneOf.length) {
    matched = checkPropExistIfoneOf(oneOf, parentField, doc)
  }

  return matched
}

type StackJoint<VNode> = {
  field: Field
  childNames: string[]
  children: (VNode | null)[]
  childrenIndex: number // 子节点的索引位置
  indexInParent: number //连接字段在父字段中的位置。这时节点还没有生成，所以还不能加入的到父连接字段的子节点中。
}

class Stack<VNode> {
  ctx: FormContext<VNode>
  joints: StackJoint<VNode>[] // 等待生成的连接节点
  fieldNames: string[] // 按字段生成VNode的顺序记录字段名称，用于调试

  constructor(ctx: FormContext<VNode>, fieldNames?: string[]) {
    this.ctx = ctx
    this.joints = []
    this.fieldNames = fieldNames ?? []
  }

  /**
   * 新的连接字段
   */
  newJoint(field: Field, parent: StackJoint<VNode> | null): StackJoint<VNode> {
    const joint = {
      field,
      childNames: [],
      children: [],
      childrenIndex: -1,
      indexInParent: -1,
    }
    if (parent) {
      parent.childrenIndex++
      joint.indexInParent = parent.childrenIndex
      parent.childNames.push(field.name)
      parent.children.push(null)
    }

    this.joints.push(joint)

    return joint
  }

  pop() {
    return this.joints.pop()
  }
  /**
   * 从stack中查找属性所有的父字段
   * 父节点是展开状态时，才会被找到
   */
  propParent(
    childProp: SchemaProp,
    ctx: FormContext<VNode>
  ): StackJoint<VNode>[] {
    const topJoints = []
    // 倒序查找？终止条件是什么？
    for (let joint of this.joints) {
      let { field } = joint // 上层节点的字段对象
      let isParent = false
      if (field.schemaProp.isPattern) {
        // 可选属性
        if (field.schemaProp.fullname === childProp.path) {
          // 父节点展开时才处理子节点
          if (!ctx.nestExpanded || ctx.nestExpanded.has(field.fullname))
            isParent = true
        }
      } else if (childProp.isArrayItem) {
        if (field.schemaProp.fullname === childProp.path) {
          // 父节点展开时才处理子节点
          if (!ctx.nestExpanded || ctx.nestExpanded.has(field.fullname))
            isParent = true
        }
      } else {
        if (childProp.path === field.fullname) {
          // 父节点展开时才处理子节点
          if (
            field.fullname === '' ||
            !ctx.nestExpanded ||
            ctx.nestExpanded.has(field.fullname)
          )
            isParent = true
        } else if (childProp.path === field.schemaProp.fullname) {
          // 父节点展开时才处理子节点
          if (
            field.fullname === '' ||
            !ctx.nestExpanded ||
            ctx.nestExpanded.has(field.fullname)
          )
            isParent = true
        }
      }

      if (isParent) {
        topJoints.push(joint)
        let msg = `属性【${childProp.fullname}】是`
        msg += field.fullname
          ? `字段【${field.fullname}】字段属性【${field.schemaProp.fullname}】`
          : '根字段'
        msg += `的子属性`
        debug(`stack.propParent - ${msg}`)
      }
    }

    return topJoints
  }

  /**字段只会有1个或没有父字段*/
  fieldParent(field: Field): StackJoint<VNode> | undefined {
    for (let i = 0; i < this.joints.length; i++) {
      let joint = this.joints[i]
      if (field.isChildOf(joint.field)) {
        debug(
          `fieldParent - 字段【${field.fullname}】是【${joint.field.fullname}】的子字段`
        )
        return joint
      }
    }
  }

  /**
   * 将创建的节点放入堆栈中的父字段
   *
   * @param atHeader 是为了解决一个属性有多个字段的情况。这多个字段是逆序加入的到父节点中的。父节点中用childrenIndex记录。有漏洞？
   */
  addNode(
    pair: FieldVNodePair<VNode>,
    parent: StackJoint<VNode>,
    atHeader = false
  ) {
    if (!parent) return
    if (typeof pair.index === 'number') {
      /**连接节点指定在父节点中的位置*/
      if (pair.index >= parent.childNames.length) {
        throw Error(
          `字段【${pair.field.fullname}】在父节点中的位置【${pair.index}】超出父节点范围【childNameslengthe=${parent.childNames.length}】`
        )
      }
      if (parent.childNames[pair.index] !== pair.field.name) {
        throw Error(
          `字段【${pair.field.fullname}】在父节点中的位置【${
            pair.index
          }】已经存在其它节点名称【${parent.childNames[pair.index]}】`
        )
      }
      if (pair.index >= parent.children.length) {
        throw Error(
          `字段【${pair.field.fullname}】在父节点中的位置【${pair.index}】超出父节点范围【children.length=${parent.childNames.length}】`
        )
      }
      if (parent.children[pair.index] !== null) {
        throw Error(
          `字段【${pair.field.fullname}】在父节点中的位置【${pair.index}】已经存在其它节点`
        )
      }
      parent.children[pair.index] = pair.vnode
      debug(
        `addNode - 字段【${parent.field.fullname}】在位置【${pair.index}】，更新子节点【${pair.field.fullname}】`
      )
    } else {
      parent.childNames.push(pair.field.name)
      parent.children.push(pair.vnode)
      parent.childrenIndex++
      debug(
        `addNode - 字段【${parent.field.fullname}】在尾部，添加子节点【${pair.field.fullname}】`
      )
    }

    this.fieldNames.push(pair.field.fullname)
  }

  /**堆栈中的所有字段生成节点*/
  shrink(): VNode {
    debug('shrink - 执行堆栈收缩，生成连接字段节点')
    let joint, rootVNode
    while (this.joints.length && (joint = this.joints.pop())) {
      let { field, children } = joint
      let vnode = createJointNode<VNode>(this.ctx, field, children)
      let parent = this.fieldParent(field)
      if (parent) {
        this.addNode({ field, vnode, index: joint.indexInParent }, parent, true)
        continue
      }
      rootVNode = vnode
    }
    if (!rootVNode) throw Error('执行shrink操作没有获得根VNode')

    return rootVNode
  }

  get length() {
    return this.joints.length
  }
}
/**
 * 创建表单中的根节点
 * 根节点是对象
 *
 * @param ctx
 * @param fieldNames
 * @returns
 */
export function build<VNode>(
  ctx: FormContext<VNode>,
  fieldNames?: string[]
): VNode {
  console.time('json-doc:build:form')
  const { schema, editDoc } = ctx

  /**生成文档的快照，提升查询消息*/
  editDoc.snapshot(true)

  /**创建属性迭代器*/
  let iter = new SchemaIter(JSON.parse(JSON.stringify(schema)))

  // 用于记录处理过程的中间数据
  let stack = new Stack<VNode>(ctx, fieldNames)

  // 依次处理JSONSchema的属性
  for (let prop of iter) {
    /**处理根节点*/
    if (prop.name === iter.rootName) {
      const rootField = createField(ctx, prop)
      debug(`----属性【${prop.fullname}】生成根字段，放入堆栈----`)
      if (prop.attrs.type === 'object') {
        stack.newJoint(rootField, null)
      } else if (prop.attrs.type === 'array') {
        debug('根节点类型是数组，生成items节点')
        const joint = stack.newJoint(rootField, null)
        debug(
          `属性【${prop.fullname}】生成字段【${rootField.fullname}】放入堆栈，生成连接节点`
        )
        createArrayItemNode<VNode>(stack, rootField, prop, ctx, joint)
      }
      continue
    }

    debug(`----属性【${prop.fullname}】开始处理----`)

    // 当前属性的父字段。如果父属性是可选属性，可能有多个父字段。
    const parentJoints = stack.propParent(prop, ctx)
    if (parentJoints.length === 0) {
      debug(`属性【${prop.fullname}】的父字段不存在，跳过`)
      continue
    }
    debug(`属性【${prop.fullname}】有${parentJoints.length}个父字段`)

    if (prop.attrs.type === 'object') {
      // 对象，连接节点
      if (prop.isPattern) {
        // 属性是动态的，需要根据文档数据生成字段
        parentJoints.forEach((joint) => {
          if (false === checkPropExistIf(prop, joint.field, editDoc)) return
          let fields = createOptionalFields(ctx, prop, joint)
          debug(`属性【${prop.fullname}】生成${fields.length}个字段`)
          fields.forEach((field) => {
            stack.newJoint(field, joint)
            debug(
              `属性【${prop.fullname}】生成字段【${field.fullname}】放入堆栈`
            )
          })
        })
      } else {
        parentJoints.forEach((joint) => {
          if (false === checkPropExistIf(prop, joint.field, editDoc)) return
          const field = createField(ctx, prop, joint.field)
          // 创建连接节点，等待加入子节点
          stack.newJoint(field, joint)
          debug(`属性【${prop.fullname}】生成字段【${field.fullname}】放入堆栈`)
        })
      }
    } else if (prop.attrs.type === 'array') {
      const createArrayNodeAndItems = (
        field: Field,
        parentJoint: StackJoint<VNode>
      ) => {
        const joint = stack.newJoint(field, parentJoint)
        debug(
          `属性【${prop.fullname}】生成字段【${field.fullname}】放入堆栈；生成连接节点，在父节点中的位置【${joint.indexInParent}】`
        )
        // 因为数组属性中item没有独立属性定义，因此和父属性同时处理
        createArrayItemNode<VNode>(stack, field, prop, ctx, joint)
      }
      // 数组，连接节点
      if (prop.isPattern) {
        parentJoints.forEach((parentJoint) => {
          if (false === checkPropExistIf(prop, parentJoint.field, editDoc))
            return
          let fields = createOptionalFields(ctx, prop, parentJoint)
          debug(`属性【${prop.fullname}】生成${fields.length}个可选字段`)
          fields.forEach((field) => {
            createArrayNodeAndItems(field, parentJoint)
          })
        })
      } else {
        parentJoints.forEach((parentJoint) => {
          if (false === checkPropExistIf(prop, parentJoint.field, editDoc))
            return
          if (prop.attrs.anyOf) {
            console.log('ssssss')
            let pair = createFieldAndNode<VNode>(ctx, prop, parentJoint)
            // 在父节点中按顺序添加
            stack.addNode(pair, parentJoint)
          } else {
            const field = createField(ctx, prop, parentJoint.field)
            createArrayNodeAndItems(field, parentJoint)
          }
        })
      }
    } else {
      // 简单类型，叶节点，生成用户输入字段，生成字段节点，放入父连接字段
      if (prop.isPattern) {
        parentJoints.forEach((joint) => {
          if (false === checkPropExistIf(prop, joint.field, editDoc)) return
          let pairs = createOptionalFieldAndNode<VNode>(ctx, prop, joint)
          debug(`属性【${prop.fullname}】生成${pairs.length}个可选字段`)
          // 在父节点中按顺序添加
          pairs.forEach((p) => stack.addNode(p, joint))
        })
      } else {
        parentJoints.forEach((joint) => {
          if (false === checkPropExistIf(prop, joint.field, editDoc)) return
          let pair = createFieldAndNode<VNode>(ctx, prop, joint)
          // 在父节点中按顺序添加
          stack.addNode(pair, joint)
        })
      }
    }
  }

  let rootVNode = stack.shrink()

  console.timeEnd('json-doc:build:form')

  return rootVNode
}

let _uid = 0
/**
 * 创建编辑器（一套schema的节点应该只创建一次，否则会多次render）
 */
class Builder<VNode> {
  _uid: number
  ctx: any
  fieldNames
  constructor(ctx: FormContext<VNode>, fieldNames?: string[]) {
    this._uid = ++_uid
    if (!ctx.fields) ctx.fields = new Map<string, Field>()
    if (!ctx.nestExpanded) ctx.nestExpanded = new Set<string>()
    this.ctx = ctx
    this.fieldNames = fieldNames
  }

  /**根据schema生成表单 */
  createForm() {
    const { ctx } = this

    // const formNode = new FormNode(ctx)

    const formSubNode = build(ctx, this.fieldNames)

    // return formNode.createElem(formSubNode)
    return formSubNode
  }

  render() {
    const topNodes = []
    topNodes.push(this.createForm())
    return topNodes
  }
}

// 因为编辑器会嵌套，每个编辑器对应不同vm
let mapBuilders = new Map()

export type FormContext<VNode> = {
  h: (type: string, props?: any, children?: any) => VNode
  editDoc: DocAsArray
  schema: RawSchema
  onMessage: Function
  fields?: Map<string, Field> // 保存表单中的field对象，避免每一次渲染都重新生成
  oneOfSelected?: Map<string, { ingroup?: string }> // 保存选中的oneOf字段
  oneOfSelectedInGroups?: Set<string> // 保存选中的oneOf字段组名称
  oneOfSelectedDefault?: Set<string> // 保存打开的过的默认字段
  nestExpanded?: Set<string> // 保存展开状态的嵌套节点
  enablePaste?: boolean
  autofillRequest?: Function
  onPaste?: Function
  onLookup?: Function
  onFileUpload?: Function
  onFileSelect?: Function
  onFileDownload?: Function
  hideRootTitle?: Boolean
  hideRootDescription?: Boolean
  hideFieldDescription?: Boolean
  showFieldFullname?: Boolean
  onNodeFocus?: (field: Field) => void
  onNodeBlur?: (field: Field) => void
  activeFieldName?: string // 用户最近点击的字段
  activePatternFieldName?: string // 用户最近点击的字段
}

/**
 * 渲染函数
 *
 * @param {*} ctx
 * @param {*} fieldNames
 */
export default function <VNode>(
  ctx: FormContext<VNode>,
  fieldNames?: string[]
) {
  let builder = mapBuilders.get(ctx)
  if (!builder) {
    builder = new Builder<VNode>(ctx, fieldNames)
    mapBuilders.set(ctx, builder)
  }

  return builder.render()
}
