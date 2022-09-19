import { VNode } from 'vue'
import { SchemaIter, RawSchema, SchemaProp } from '@/json-schema/model'
import { createField, Field } from './fields'
import { FieldWrap, prepareFieldNode } from './nodes'
import { DocAsArray } from './model'
import _ from 'lodash'
import Debug from 'debug'

const debug = Debug('json-doc:builder')

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
function createArrayItemFields(
  ctx: FormContext,
  parentField: Field,
  prop: SchemaProp
): Field[] {
  const log = debug.extend('createArrayItemFields')
  log(`字段【${parentField.fullname}】需要根据文档数据生成数组项目字段`)
  const fieldValue = ctx.editDoc.get(parentField.fullname)
  if (Array.isArray(fieldValue) && fieldValue.length) {
    let fields = fieldValue.map((val, index) => {
      // 数组中的项目需要指定索引
      const field = createField(ctx, prop, parentField, index)
      log(
        `字段【${parentField.fullname}】根据文档数据生成数组项目字段【${field.fullname}】`
      )
      return field
    })
    log(`属性【${prop.fullname}】根据文档数据生成了${fields.length}个字段`)
    return fields
  }

  return []
}

function createArrayItemNode(
  stack: Stack,
  field: Field,
  prop: SchemaProp,
  ctx: FormContext,
  joint: StackJoint
) {
  const log = debug.extend('createArrayItemNode')
  if (prop.items?.type) {
    let { fullname, items } = prop
    log(`属性【${fullname}】需要生成类型为【${items.type}】的子项目字段`)
    // 给数组属性的items生成1个模拟属性，用name=[*]表示
    let itemProp = new SchemaProp(`${fullname}`, '[*]', items.type)
    if (items.format) itemProp.attrs.format = items.format

    // 需要传递和子属性中哪些是oneOf
    itemProp.isOneOfChildren = prop.isOneOfChildren

    const itemFields = createArrayItemFields(ctx, field, itemProp)
    log(
      `属性【${fullname}】生成【${items.type}】类型的数组项目属性，生成【${itemFields.length}】个字段`
    )
    if ('object' === items.type) {
      if (prop.patternChildren) {
        itemProp.patternChildren = prop.patternChildren
        log(
          `属性【${fullname}】的子项目属性【${itemProp.fullname}】包含模板【${itemProp.patternChildren.length}】个字段`
        )
      }
      if (prop.isOneOfChildren) itemProp.isOneOfChildren = prop.isOneOfChildren
      // 复合类型，需要根据文档数据生成字段，放入堆栈
      itemFields.forEach((field) => {
        stack.newJoint(field, field.index)
        log(`属性【${fullname}】生成的字段【${field.fullname}】，放入堆栈`)
      })
    } else if ('array' === items.type) {
      // 复合类型，需要根据文档数据生成字段，放入堆栈
      itemFields.forEach((field) => {
        stack.newJoint(field, field.index)
        log(`属性【${fullname}】生成的字段【${field.fullname}】，放入堆栈`)
      })
    } else {
      // 简单类型，生成节点，放入父字段
      itemFields.forEach((itemField) => {
        const vnode = createFieldWrapNode(ctx, itemField)
        stack.addNode({ field: itemField, vnode }, joint)
      })
    }
  }
}

/**
 * 根据文档数据生成可选属性的字段
 */
function createOptionalFields(
  ctx: FormContext,
  prop: SchemaProp,
  joint: StackJoint
): Field[] {
  const log = debug.extend('createOptionalFields')
  /*需要根据数据对象的值决定是否生成字段和节点*/
  const fieldValue = ctx.editDoc.get(joint.field.fullname)
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
        log(`属性【${prop.fullname}】忽略已存在文档数据【${key}】`)
        return
      }
      if (!re.test(key)) {
        log(`属性【${prop.fullname}】忽略不匹配文档数据【${key}】`)
        return
      }
      keys.push(key)
    })
  } else {
    log(
      `属性【${prop.fullname}】的父属性【${prop.parentFullname}】的在文档中的值不是对象`
    )
  }
  if (keys.length) {
    log(`属性【${prop.fullname}】需要创建【${keys.length}】个字段`)
    let fields = keys.map((key) => {
      const field = createField(ctx, prop, joint.field, -1, key)
      log(`属性【${prop.fullname}】生成字段【${field.fullname}】`)
      return field
    })
    log(`属性【${prop.fullname}】根据文档数据生成${fields.length}个字段`)
    return fields
  } else {
    log(
      `属性【${prop.fullname}】无法根据文档数据生成字段\n` +
        JSON.stringify(fieldValue, null, 2)
    )
  }

  return []
}

type FieldVNodePair = {
  field: Field
  vnode: VNode
  index?: number // 在父节点中的位置
}

/**
 * 生成字段和节点
 */
function createOptionalFieldNode(
  ctx: FormContext,
  prop: SchemaProp,
  joint: StackJoint
): FieldVNodePair[] {
  const log = debug.extend('createOptionalFieldNode')
  /**创建和当前属性对应的field*/
  log(
    `【${joint.field.fullname}】字段下的属性【${prop.fullname}】是正则表达式定义的可选属性，需要根据文档数据生成字段`
  )
  const fields = createOptionalFields(ctx, prop, joint)
  if (fields.length) {
    const pairs = fields.map((field) => {
      let vnode = createFieldWrapNode(ctx, field)
      return { field, vnode }
    })
    log(`属性【${prop.fullname}】根据文档数据生成${pairs.length}个字段节点`)
    return pairs
  }

  return []
}

/**创建和当前属性对应的field*/
function createFieldNode(
  ctx: FormContext,
  prop: SchemaProp,
  joint: StackJoint
): FieldVNodePair {
  const field = createField(ctx, prop, joint.field)
  const vnode = createFieldWrapNode(ctx, field)
  const log = debug.extend('createFieldNode')
  log(`属性【${prop.fullname}】生成字段【${field.fullname}】，生成节点`)
  /**处理默认值*/
  if (prop.attrs.default) {
    log(
      `字段【${field.fullname}】的属性【${prop.fullname}】有默认值，需要更新文档`
    )
    ctx.editDoc.set(field.fullname, prop.attrs.default, false)
  }

  return { field, vnode }
}

/**创建连接节点*/
function createJointNode(
  ctx: FormContext,
  field: Field,
  children: VNode[]
): VNode {
  debug.extend('createJointNode')(
    `字段【${field.fullname}】，生成节点，包含【${children.length}】个子节点`
  )
  const node = prepareFieldNode(ctx, field, children)

  const wrapNode = new FieldWrap(ctx, node)
  const labelAndDesc = wrapNode.createElem()

  return createWrapClass(labelAndDesc)
}
/**
 * 检查是否所有规则都满足
 * @param rule
 * @param doc
 * @returns
 */
function checkPropExistIfProperties(rule: any, doc: DocAsArray): boolean {
  let props = Object.keys(rule)
  return props.every((prop) => {
    let docVal = doc.get(prop)
    return rule[prop].const === docVal
  })
}
/**
 * 每个条件都要满足
 * @param rules
 * @param doc
 * @returns
 */
function checkPropExistIfallOf(rules: any, doc: DocAsArray): boolean {
  return rules.every((rule: any) => {
    let matched = false
    let { properties, allOf, oneOf } = rule
    if (typeof properties === 'object') {
      matched = checkPropExistIfProperties(properties, doc)
    } else if (Array.isArray(oneOf) && oneOf.length) {
      matched = checkPropExistIfoneOf(oneOf, doc)
    } else if (Array.isArray(allOf) && allOf.length) {
      matched = checkPropExistIfallOf(allOf, doc)
    }
    return matched
  })
}
/**
 * 只要有1条规则满足就可以
 * @param rules
 * @param doc
 * @returns
 */
function checkPropExistIfoneOf(rules: any, doc: DocAsArray): boolean {
  return rules.some((rule: any) => {
    let matched = false
    let { properties, allOf, oneOf } = rule
    if (typeof properties === 'object') {
      matched = checkPropExistIfProperties(properties, doc)
    } else if (Array.isArray(oneOf) && oneOf.length) {
      matched = checkPropExistIfoneOf(oneOf, doc)
    } else if (Array.isArray(allOf) && allOf.length) {
      matched = checkPropExistIfallOf(allOf, doc)
    }
    return matched
  })
}

/**
 * 检查属性依赖条件
 * @param prop
 * @param doc
 * @returns
 */
function checkPropExistIf(prop: SchemaProp, doc: DocAsArray): boolean {
  let { existIf } = prop

  // 未指定规则，属性存在
  if (typeof existIf !== 'object') return true

  const { properties, allOf, oneOf } = existIf

  let matched = false

  if (typeof properties === 'object') {
    matched = checkPropExistIfProperties(properties, doc)
  } else if (Array.isArray(allOf) && allOf.length) {
    matched = checkPropExistIfallOf(allOf, doc)
  } else if (Array.isArray(oneOf) && oneOf.length) {
    matched = checkPropExistIfoneOf(oneOf, doc)
  }

  return matched

  // let ruleSet = prop.dependencies
  // if (!ruleSet) return true

  // let visible = false
  // let matched: { [k: string]: boolean } = {}
  // let docVal

  // for (const [key, rule] of Object.entries(ruleSet['dependencyRules'])) {
  //   if (rule.operator === 'or') {
  //     matched[key] = false
  //     rule.rules.forEach(({ property, value }) => {
  //       docVal = doc[property]
  //       if (
  //         docVal === value ||
  //         (Array.isArray(docVal) && docVal.includes(value))
  //       ) {
  //         matched[key] = true
  //       }
  //     })
  //   } else if (rule.operator === 'and') {
  //     matched[key] = true
  //     rule.rules.forEach(({ property, value }) => {
  //       docVal = doc[property]
  //       if (
  //         !docVal ||
  //         (docVal !== value &&
  //           !(Array.isArray(docVal) && docVal.includes(value)))
  //       ) {
  //         matched[key] = false
  //       }
  //     })
  //   }
  // }

  // if (ruleSet.operator === 'or') {
  //   visible = Object.values(matched).includes(true)
  // } else if (ruleSet.operator === 'and') {
  //   visible = !Object.values(matched).includes(false)
  // }

  // return visible
}

type StackJoint = {
  field: Field
  childNames: string[]
  children: VNode[]
  childrenIndex: number
  indexInParent: number //连接字段在父字段中的位置。这时节点还没有生成，所以还不能加入的到父连接字段的子节点中。
}

class Stack {
  ctx: FormContext
  joints: StackJoint[] // 等待生成的连接节点
  fieldNames: string[] // 按字段生成VNode的顺序记录字段名称，用于调试

  constructor(ctx: FormContext, fieldNames?: string[]) {
    this.ctx = ctx
    this.joints = []
    this.fieldNames = fieldNames ?? []
  }

  /**
   * 新的连接字段
   */
  newJoint(field: Field, indexInParent: number): StackJoint {
    const joint = {
      field,
      childNames: [],
      children: [],
      childrenIndex: -1,
      indexInParent,
    }
    this.joints.push(joint)
    return joint
  }

  pop() {
    return this.joints.pop()
  }

  /**
   * 获得属性所有的父字段
   * 从stack中查找
   */
  propParent(childProp: SchemaProp): StackJoint[] {
    const topJoints = []
    // 倒序查找？终止条件是什么？
    // for (let i = this.joints.length - 1; i >= 0; i--) {
    // let joint = this.joints[i]
    for (let joint of this.joints) {
      let { field } = joint // 上层节点的字段对象
      let isParent = false
      if (field.schemaProp.isPattern) {
        // 可选属性
        isParent = field.schemaProp.fullname === childProp.path
      } else if (childProp.isArrayItem) {
        isParent = field.schemaProp.fullname === childProp.path
      } else {
        if (childProp.path === field.fullname) {
          isParent = true
        } else if (childProp.path === field.schemaProp.fullname) {
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
        debug.extend('propParent')(msg)
      }
    }

    return topJoints
  }

  /**字段只会有1个或没有父字段*/
  fieldParent(field: Field): StackJoint | undefined {
    for (let i = 0; i < this.joints.length; i++) {
      let joint = this.joints[i]
      if (field.isChildOf(joint.field)) {
        debug.extend('fieldParent')(
          `字段【${field.fullname}】是【${joint.field.fullname}】的子字段`
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
  addNode(pair: FieldVNodePair, parent: StackJoint, atHeader = false) {
    if (!parent) return
    const log = debug.extend('addNode')
    if (typeof pair.index === 'number') {
      /**指定了节点的添加位置*/
      // _.set(parent.childNames, pair.index, pair.field.name)
      // _.set(parent.children, pair.index, pair.vnode)
      // 用splice方法不能保证顺序，当start>length时，在结尾追加
      parent.childNames.splice(pair.index, 0, pair.field.name)
      parent.children.splice(pair.index, 0, pair.vnode)
      // this.fieldNames.splice(pair.index, 0, pair.field.fullname)
      log(
        `字段【${parent.field.fullname}】在位置【${pair.index}】，添加子节点【${pair.field.fullname}】`
      )
    } else if (atHeader) {
      if (parent.childrenIndex === -1) {
        parent.childrenIndex = parent.children.length
      }
      parent.childNames.splice(parent.childrenIndex, 0, pair.field.name)
      parent.children.splice(parent.childrenIndex, 0, pair.vnode)
      // this.fieldNames.splice(0, 0, pair.field.fullname)
      log(
        `字段【${parent.field.fullname}】在头部，添加子节点【${pair.field.fullname}】`
      )
    } else {
      parent.childNames.push(pair.field.name)
      parent.children.push(pair.vnode)
      log(
        `字段【${parent.field.fullname}】在尾部，添加子节点【${pair.field.fullname}】`
      )
    }
    this.fieldNames.push(pair.field.fullname)
  }

  /**堆栈中的所有字段生成节点*/
  shrink(): VNode {
    debug.extend('shrink')('执行堆栈收缩，生成连接字段节点')
    let joint, rootVNode
    while (this.joints.length && (joint = this.joints.pop())) {
      let { field, children } = joint
      let vnode = createJointNode(this.ctx, field, children)
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
export function build(ctx: FormContext, fieldNames?: string[]): VNode {
  const { schema, editDoc } = ctx

  /**创建属性迭代器*/
  let iter = new SchemaIter(JSON.parse(JSON.stringify(schema)))

  // 用于记录处理过程的中间数据
  let stack = new Stack(ctx, fieldNames)

  // 依次处理JSONSchema的属性
  let prop: SchemaProp
  for (prop of iter) {
    /**处理根节点*/
    if (prop.name === iter.rootName) {
      const rootField = createField(ctx, prop)
      debug(`----属性【${prop.fullname}】生成根字段，放入堆栈----`)
      if (prop.attrs.type === 'object') {
        stack.newJoint(rootField, -1)
      } else if (prop.attrs.type === 'array') {
        debug('根节点类型是数组，生成items节点')
        const joint = stack.newJoint(rootField, -1)
        debug(
          `属性【${prop.fullname}】生成字段【${rootField.fullname}】放入堆栈，生成连接节点`
        )
        createArrayItemNode(stack, rootField, prop, ctx, joint)
      }
      continue
    }

    debug(`----属性【${prop.fullname}】开始处理----`)

    // 当前属性的父字段。如果父属性是可选属性，可能有多个父字段。
    const parentJoints = stack.propParent(prop)
    if (parentJoints.length === 0) {
      debug(`属性【${prop.fullname}】的父字段不存在，跳过`)
      continue
    } else {
      debug(`属性【${prop.fullname}】有${parentJoints.length}个父字段`)
    }

    // 需要处理题目是否可见
    if (false === checkPropExistIf(prop, editDoc)) {
      // 子字段也不能显示
      // 将对应数据对象的值清空
      continue
    }

    if (prop.attrs.type === 'object') {
      // 对象，连接节点
      if (prop.isPattern) {
        // 属性是动态的，需要根据文档数据生成字段
        parentJoints.forEach((joint) => {
          let fields = createOptionalFields(ctx, prop, joint)
          debug(`属性【${prop.fullname}】生成${fields.length}个字段`)
          fields.forEach((field) => {
            stack.newJoint(field, joint.children.length)
            debug(
              `属性【${prop.fullname}】生成字段【${field.fullname}】放入堆栈`
            )
          })
        })
      } else {
        parentJoints.forEach((joint) => {
          const field = createField(ctx, prop, joint.field)
          stack.newJoint(field, joint.children.length)
          debug(`属性【${prop.fullname}】生成字段【${field.fullname}】放入堆栈`)
        })
      }
    } else if (prop.attrs.type === 'array') {
      // 数组，连接节点
      if (prop.isPattern) {
        parentJoints.forEach((parentJoint) => {
          let fields = createOptionalFields(ctx, prop, parentJoint)
          debug(`属性【${prop.fullname}】生成${fields.length}个可选字段`)
          fields.forEach((field) => {
            const joint = stack.newJoint(field, parentJoint.children.length)
            debug(
              `属性【${prop.fullname}】的字段【${field.fullname}】，生成连接节点并放入堆栈，在父节点中的位置【${joint.indexInParent}】`
            )
            // 因为数组属性中item没有独立属性定义，因此和父属性同时处理
            createArrayItemNode(stack, field, prop, ctx, joint)
          })
        })
      } else {
        parentJoints.forEach((parentJoint) => {
          const field = createField(ctx, prop, parentJoint.field)
          const joint = stack.newJoint(field, parentJoint.children.length)
          debug(
            `属性【${prop.fullname}】生成字段【${field.fullname}】放入堆栈；生成连接节点，在父节点中的位置【${joint.indexInParent}】`
          )
          createArrayItemNode(stack, field, prop, ctx, joint)
        })
      }
    } else {
      // 简单类型，叶节点，生成用户输入字段，生成字段节点，放入父连接字段
      if (prop.isPattern) {
        parentJoints.forEach((joint) => {
          let pairs = createOptionalFieldNode(ctx, prop, joint)
          debug(`属性【${prop.fullname}】生成${pairs.length}个可选字段`)
          pairs.forEach((p) => stack.addNode(p, joint))
        })
      } else {
        parentJoints.forEach((joint) => {
          let pair = createFieldNode(ctx, prop, joint)
          stack.addNode(pair, joint)
        })
      }
    }
  }

  let rootVNode = stack.shrink()

  return rootVNode
}

let _uid = 0
/**
 * 创建编辑器（一套schema的节点应该只创建一次，否则会多次render）
 */
class Builder {
  _uid: number
  ctx: any
  fieldNames

  constructor(ctx: FormContext, fieldNames?: string[]) {
    this._uid = ++_uid
    if (!ctx.fields) ctx.fields = new Map<string, Field>()
    if (!ctx.oneOfSelected) ctx.oneOfSelected = new Set<string>()
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

export type FormContext = {
  editDoc: DocAsArray
  schema: RawSchema
  onMessage: Function
  fields?: Map<string, Field> // 保存表单中的field对象，避免每一次渲染都重新生成
  oneOfSelected?: Set<string> // 保存选中的oneOf字段
  nestExpanded?: Set<string> // 保存展开状态的嵌套节点
  enablePaste?: boolean
  autofillRequest?: Function
  onPaste?: Function
  onFileUpload?: Function
  onFileSelect?: Function
  onFileDownload?: Function
  hideRootTitle?: Boolean
  hideRootDescription?: Boolean
  hideFieldDescription?: Boolean
  showFieldFullname?: Boolean
  onNodeFocus?: (field: Field) => void
  onNodeBlur?: (field: Field) => void
}

/**
 * 渲染函数
 *
 * @param {*} ctx
 * @param {*} fieldNames
 */
export default function (ctx: FormContext, fieldNames?: string[]) {
  let builder = mapBuilders.get(ctx)
  if (!builder) {
    builder = new Builder(ctx, fieldNames)
    mapBuilders.set(ctx, builder)
  }
  return builder.render()
}
