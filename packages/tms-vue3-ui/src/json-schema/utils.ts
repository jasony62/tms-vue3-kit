export const Type2Format = {
  string: [
    { value: 'name', label: '姓名' },
    { value: 'email', label: '邮箱' },
    { value: 'mobile', label: '手机' },
    { value: 'dateTime', label: '日期时间' },
  ],
  object: [
    { value: 'file', label: '文件' },
    { value: 'image', label: '图片' },
    { value: 'url', label: '链接' },
    { value: 'score', label: '打分' },
  ],
} as { [k: string]: { value: string; label: string }[] }

export type EnumGroup = {
  id: any
  label: string
  assocEnum: {
    property: string
    value: any
  }
}

export type EnumOption = {
  label: string
  value: any
  group?: any
}

export type EventRule = {
  url: string
  params: string[]
  type: string
}

export type NodeDepRule = {
  property: string
  value: string
}

export type NodeDepRuleSet = {
  dependencyRules: {
    [k: string]: { rules: NodeDepRule[]; operator: string }
  }
  operator: string
}

export type NodeDep = {
  [k: string]: NodeDepRuleSet
}

export type NodeAttrs = {
  type: string
  title?: string
  description?: string
  format?: string
  required?: boolean
  enum?: EnumOption[]
  enumGroups?: EnumGroup[]
  minItems?: number
  maxItems?: number
  default?: any
  attachment?: any
  groupable?: boolean
}

export type SchemaNode = {
  path: string
  name: string
  attrs: NodeAttrs
  items?: { type: string; [k: string]: any }
  dependencies?: NodeDepRuleSet
  eventDependency?: { rule: EventRule }
}

function fieldFullname(field: SchemaNode) {
  let fullname
  fullname = field.path ? field.path + '.' : '' + field.name
  return fullname
}

const node2Prop = (node: SchemaNode, parent: any): any => {
  let { items, dependencies, eventDependency } = node

  let prop: any = {
    ...node.attrs,
  }

  if (items) {
    prop.items = items
  }

  /*子节点的数据集中放到父属性中*/
  if (parent) {
    if (dependencies) {
      if (typeof parent.dependencies === 'undefined') parent.dependencies = {}
      parent.dependencies[node.name] = dependencies
    }
    if (eventDependency) {
      if (typeof parent.eventDependencies === 'undefined')
        parent.eventDependencies = {}
      parent.eventDependencies[node.name] = eventDependency
    }
  }

  return prop
}

/**
 * 遍历对象
 *
 * 将父节点集中记录的dependencies和eventDependencies分散到节点中记录
 */
function walk(
  path: string,
  name: string,
  prop: { [k: string]: any },
  stack: SchemaNode[],
  dependencies: any,
  eventDependencies: any
) {
  // 新节点
  let node: SchemaNode = {
    path,
    name,
    attrs: { type: '' },
  }
  node.dependencies = dependencies?.[name]
  node.eventDependency = eventDependencies?.[name]

  stack.push(node)

  Object.keys(prop).forEach((k) => {
    if (
      /type|title|description|format|enum|enumGroups|default|required/.test(k)
    ) {
      Object.assign(node.attrs, { [k]: prop[k] })
    } else if ('properties' === k) {
      /*对象的子属性*/
      Object.keys(prop.properties).forEach((k) => {
        walk(
          `${path ? path + '.' : ''}${name}`,
          k,
          prop.properties[k],
          stack,
          prop.dependencies,
          prop.eventDependencies
        )
      })
    } else if ('items' === k) {
      node.items = { type: '' }
      /*数组内元素的类型*/
      let { items } = prop
      Object.keys(items).forEach((k2) => {
        if (k2 === 'properties') {
          Object.keys(items.properties).forEach((k3) => {
            walk(
              `${path ? path + '.' : ''}${name}.[]`,
              k3,
              items.properties[k3],
              stack,
              null,
              null
            )
          })
        } else {
          // 需要吗？允许携带不识别的数据？要考虑恢复的问题
          Object.assign(node.items, { [k2]: items[k2] })
        }
      })
    } else if (/dependencies|eventDependencies/.test(k)) {
      // 已经放到了子节点中记录
    } else {
      // 所有的属性都要记录？
      Object.assign(node.attrs, { [k]: prop[k] })
    }
  })
}

export class FlattenJSONSchema {
  nodes: SchemaNode[]
  constructor() {
    this.nodes = []
  }
  // 将对象变为数组
  flatten(root: { [k: string]: any }): FlattenJSONSchema {
    this.nodes.splice(0, this.nodes.length)
    walk('', '$', root, this.nodes, null, null)
    return this
  }
  // 恢复成层级结构
  unflatten() {
    if (this.nodes.length === 0) throw Error('[fields]为空，无法进行数据转换')

    const root = this.nodes[0]
    if (root.name !== '$' && root.path !== '')
      throw Error('[fields]第1个节点不是根节点，无法进行数据转换')

    /*处理根节点*/
    const rootObj = node2Prop(root, null)

    for (let i = 1; i < this.nodes.length; i++) {
      let node = this.nodes[i]

      /**在对象查找或创建父节点。子属性总是在父属性的properties字段中 */
      let { path, name } = node
      let pathsegs = path.split('.')
      let parent = pathsegs.reduce((prev, seg) => {
        // 根节点
        if (seg === '$') {
          return prev
        }
        // 父节点是数组类型，子节点加到父节点的items字段
        if (seg === '[]') {
          if (typeof prev.items === 'undefined') {
            prev.items = {}
          }
          return prev.items
        }
        // 子节点加到父节点的properties字段中
        if (typeof prev.properties === 'undefined') {
          prev.properties = { [seg]: {} }
        } else if (typeof prev.properties[seg] === 'undefined') {
          prev.properties[seg] = {}
        }
        return prev.properties[seg]
      }, rootObj)

      /**在父对象中添加当前属性 */
      let newProp = node2Prop(node, parent)
      /**加入父属性 */
      if (typeof parent.properties === 'undefined') parent.properties = {}
      parent.properties[name] = newProp
    }

    return rootObj
  }

  /**获得属性完成的路径名 */
  fieldFullname(field: SchemaNode) {
    return fieldFullname(field)
  }

  /**指定属性下最后一个子节点的索引 */
  getLastChildIndex(field: SchemaNode): number {
    let lastIndex = -1
    let fullname = this.fieldFullname(field)
    let child
    for (let i = 0; i < this.nodes.length; i++) {
      child = this.nodes[i]
      if (child.path.indexOf(fullname) === 0) {
        lastIndex = i
      }
    }

    return lastIndex
  }
  /**
   * 在指定的属性下添加子属性
   */
  addField(parent: SchemaNode): SchemaNode | boolean {
    let lastIndex = this.getLastChildIndex(parent)
    if (lastIndex !== -1) {
      let newFiled: SchemaNode = {
        path: this.fieldFullname(parent),
        name: 'newKey',
        attrs: { type: 'string' },
      }
      this.nodes.splice(lastIndex + 1, 0, newFiled)
      return newFiled
    }

    return false
  }
  /**
   * 删除指定的属性
   *
   * 根节点不允许删除
   */
  removeField(field: SchemaNode): SchemaNode | boolean {
    let childIndex = this.nodes.indexOf(field)
    if (childIndex <= 0) return false

    let prev = this.nodes[childIndex - 1]
    this.nodes.splice(childIndex, 1)

    return prev
  }
}
