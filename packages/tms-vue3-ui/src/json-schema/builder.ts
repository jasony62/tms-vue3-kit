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
  let { items, existIf } = prop

  let rawProp: any = {
    ...prop.attrs,
  }

  if (items) {
    rawProp.items = items
  }

  if (existIf) {
    rawProp.existIf = existIf
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
      if (!name) {
        alert('键值不允许为空')
        throw Error('键值不允许为空')
      }
      if (prop.isPattern && !/\^.+\$/.test(name)) {
        alert('正则表达式类型的键值必须以"^"开头,"$"结尾')
        throw Error('正则表达式类型的键值格式不正确')
      }
      // 将数组类型分为两次查找
      let pathsegs = path.replace(/\[\*\]/g, '.[*]').split('.')
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
        // 分开处理properties和patternProperties
        if (/\^.+\$/.test(seg)) {
          if (typeof prev.patternProperties === 'undefined') {
            prev.patternProperties = { [seg]: {} }
          } else if (typeof prev.patternProperties[seg] === 'undefined') {
            prev.patternProperties[seg] = {}
          }
          return prev.patternProperties[seg]
        } else {
          // 子节点加到父节点的properties字段中
          if (typeof prev.properties === 'undefined') {
            prev.properties = { [seg]: {} }
          } else if (typeof prev.properties[seg] === 'undefined') {
            prev.properties[seg] = {}
          }
          return prev.properties[seg]
        }
      }, rootObj)

      /**在父对象中添加当前属性 */
      let newProp = propToRaw(prop, parent)
      /**加入父属性 */
      if (typeof prop.isPattern === 'boolean' && prop.isPattern === true) {
        if (typeof parent.patternProperties === 'undefined')
          parent.patternProperties = {}
        parent.patternProperties[name] = newProp
      } else {
        if (typeof parent.properties === 'undefined') parent.properties = {}
        parent.properties[name] = newProp
      }
    }

    return rootObj
  }
  /**
   * 返回指定节点的父节点
   */
  getParent(prop: SchemaProp): SchemaProp | undefined {
    return this.props.find((other) => {
      return (
        other.fullname === prop.path ||
        other.fullname === prop.path.replace(/\[\*\]$/, '')
      )
    })
  }
  /**
   * 当前节点在全局数组中的位置
   */
  getIndex(prop: SchemaProp): number {
    return this.props.findIndex((other) => other.fullname === prop.fullname)
  }
  /**
   * 指定属性下最后一个子节点的索引
   */
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
   * 是否可以在属性前添加属性
   * @param prop
   * @returns
   */
  canInsert(prop: SchemaProp): boolean {
    if (prop === this.props[0]) return false
    return true
  }
  /**
   * 属性是否可以向前移动位置
   * @param prop
   */
  canMoveUp(prop: SchemaProp): boolean {
    // 有子节点不允许移动
    let lastChildIndex = this.getLastChildIndex(prop)
    if (lastChildIndex !== -1) return false
    // 当前节点在全局数组中的位置
    const index = this.getIndex(prop)
    if (index === -1) {
      // 没有找到
      return false
    }
    // 当前节点的父节点。
    const parent = this.getParent(prop)
    if (!parent) {
      // 没有父属性，不允许移动
      return false
    }
    const parentIndex = this.getIndex(parent)
    if (parentIndex === -1) return false

    if (index === parentIndex + 1) {
      // 已经是第一个节点，不允许上移
      return false
    }

    return true
  }
  /**
   * 属性是否可以向后移动
   */
  canMoveDown(prop: SchemaProp): boolean {
    // 有子节点不允许移动
    let lastChildIndex = this.getLastChildIndex(prop)
    if (lastChildIndex !== -1) return false
    // 当前节点的父节点。
    const parent = this.getParent(prop)
    if (!parent) {
      // 没有父属性，不允许移动
      return false
    }
    const lastIndex = this.getLastChildIndex(parent)
    if (lastIndex === -1) return false

    // 当前节点在全局数组中的位置
    const index = this.getIndex(prop)
    if (index === -1) {
      // 没有找到
      return false
    }
    if (index === lastIndex) {
      // 已经是最后一个节点，不允许上移
      return false
    }
    return true
  }
  /**
   * 属性是否允许删除
   */
  canRemove(prop: SchemaProp): boolean {
    if (prop === this.props[0]) return false
    let lastChildIndex = this.getLastChildIndex(prop)
    if (lastChildIndex !== -1) return false

    return true
  }
  /**
   * 在指定的属性下添加子属性
   */
  addProp(parent: SchemaProp, type: string): SchemaProp {
    // 节点所在路径
    let path = parent.fullname
    if (parent.attrs.type === 'array') path += '[*]'

    let newProp = new SchemaProp(path, 'newKey', 'string')
    newProp.isPattern = type === 'patternProperties' ? true : false

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
   * 在指定属性前添加属性
   * @param sibling
   */
  insertProp(sibling: SchemaProp): SchemaProp | undefined {
    if (!this.canInsert(sibling)) return undefined

    const index = this.getIndex(sibling)

    let newProp = new SchemaProp(sibling.path, 'newKey', 'string')
    newProp.isPattern = sibling.isPattern

    this.props.splice(index, 0, newProp)

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
  /**
   * 向前移动属性位置
   * @param prop
   */
  moveUp(prop: SchemaProp) {
    if (!this.canMoveUp(prop)) return false
    const index = this.getIndex(prop)

    // 移动位置
    const { props } = this
    props.splice(index, 1)
    props.splice(index - 1, 0, prop)

    return true
  }
  /**
   * 向后移动属性位置
   * @param prop
   * @returns
   */
  moveDown(prop: SchemaProp) {
    if (!this.canMoveDown(prop)) return false

    // 当前节点在全局数组中的位置
    const index = this.getIndex(prop)

    // 移动位置
    const { props } = this
    props.splice(index, 1)
    props.splice(index + 1, 0, prop)

    return true
  }
}
