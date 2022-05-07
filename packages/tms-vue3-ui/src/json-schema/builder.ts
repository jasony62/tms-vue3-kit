import { SchemaIter, RawSchema, SchemaProp, DEFAULT_ROOT_NAME } from './model'

export { SchemaProp }

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

const propToRaw = (prop: SchemaProp, parent: any): any => {
  let { items, dependencies, eventDependency } = prop

  let rawProp: any = {
    ...prop.attrs,
  }

  if (items) {
    rawProp.items = items
  }

  /*子节点的数据集中放到父属性中*/
  if (parent) {
    if (dependencies) {
      if (typeof parent.dependencies === 'undefined') parent.dependencies = {}
      parent.dependencies[prop.name] = dependencies
    }
    if (eventDependency) {
      if (typeof parent.eventDependencies === 'undefined')
        parent.eventDependencies = {}
      parent.eventDependencies[prop.name] = eventDependency
    }
  }

  return rawProp
}
/**
 *
 */
export class JSONSchemaBuilder {
  props: SchemaProp[]

  private _rootName

  constructor(rootName = DEFAULT_ROOT_NAME) {
    this.props = []
    this._rootName = rootName
  }

  get rootName() {
    return this._rootName
  }

  /**将对象变为数组*/
  flatten(root: RawSchema): JSONSchemaBuilder {
    const iter = new SchemaIter(root, this.rootName)
    this.props = Array.from(iter)
    return this
  }

  // 恢复成层级结构
  unflatten() {
    if (this.props.length === 0) throw Error('[props]为空，无法进行数据转换')

    const root = this.props[0]
    if (root.name !== this.rootName && root.path !== '')
      throw Error('[props]第1个节点不是根节点，无法进行数据转换')

    // 处理根节点/
    const rootObj = propToRaw(root, null)

    for (let i = 1; i < this.props.length; i++) {
      let prop = this.props[i]

      /**
       * 在对象查找或创建父节点。子属性总是在父属性的properties字段中
       */
      let { path, name } = prop
      // 将数组类型分为两次查找
      let pathsegs = path.replace('[*]', '.[*]').split('.')
      let parent = pathsegs.reduce((prev, seg) => {
        // 跳过根节点
        if (seg === this.rootName) {
          return prev
        }
        // 父节点是数组类型，子节点加到父节点的items字段
        if (seg === '[*]') {
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
      let newProp = propToRaw(prop, parent)
      /**加入父属性 */
      if (typeof parent.properties === 'undefined') parent.properties = {}
      parent.properties[name] = newProp
    }

    return rootObj
  }

  /**指定属性下最后一个子节点的索引 */
  getLastChildIndex(prop: SchemaProp): number {
    let lastIndex = -1
    let child
    for (let i = 0; i < this.props.length; i++) {
      child = this.props[i]
      if (child.path.indexOf(prop.fullname) === 0) {
        lastIndex = i
      }
    }

    return lastIndex
  }
  /**
   * 在指定的属性下添加子属性
   */
  addProp(parent: SchemaProp): SchemaProp {
    // 节点所在路径
    let path = parent.fullname
    if (parent.attrs.type === 'array') path += '[*]'

    let newProp = new SchemaProp(path, 'newKey', 'string')

    /**将新节点加入到适当位置*/
    let lastIndex = this.getLastChildIndex(parent)
    if (lastIndex !== -1) {
      // 作为最后1个子节点
      this.props.splice(lastIndex + 1, 0, newProp)
    } else {
      // 父节点下的第1个节点
      let parentIndex = this.props.indexOf(parent)
      this.props.splice(parentIndex + 1, 0, newProp)
    }

    return newProp
  }
  /**
   * 删除指定的属性
   *
   * 根节点不允许删除
   */
  removeProp(prop: SchemaProp): SchemaProp | boolean {
    let childIndex = this.props.indexOf(prop)
    if (childIndex <= 0) return false

    let prev = this.props[childIndex - 1]
    this.props.splice(childIndex, 1)

    return prev
  }
}
