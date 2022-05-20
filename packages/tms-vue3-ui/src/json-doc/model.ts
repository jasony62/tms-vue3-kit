import _ from 'lodash'
const debug = require('debug')('json-doc')

/**
 * 解析数组
 * @param parent
 */
function* _parseArray(parent: DocProp): any {
  let rawArr = parent.value
  for (let i = 0; i < rawArr.length; i++) {
    let value = rawArr[i]
    let prop = new DocProp(parent, i, value)
    yield prop
    if (Array.isArray(value)) {
      yield* _parseArray(prop)
    } else if (typeof value === 'object') {
      yield* _pasrseObj(prop)
    }
  }
}
/**
 * 解析对象
 * @param parent
 */
function* _pasrseObj(parent: DocProp): any {
  let rawObj = parent.value
  let keys = Object.keys(rawObj)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    let value = rawObj[key]
    let prop = new DocProp(parent, key, value)
    yield prop
    if (Array.isArray(value)) {
      yield* _parseArray(prop)
    } else if (typeof value === 'object') {
      yield* _pasrseObj(prop)
    }
  }
}

/**
 * 根节点默认名称
 */
export const DEFAULT_ROOT_NAME = ''
/**
 * 文档对象迭代器。
 */
export class DocIter {
  _rawDoc
  _rootName

  constructor(rawDoc: any, rootName = DEFAULT_ROOT_NAME) {
    this._rawDoc = rawDoc
    this._rootName = rootName
  }
  /**
   * 迭代文档中的数据
   */
  *[Symbol.iterator]() {
    let prop = new DocProp(undefined, this._rootName, this._rawDoc)
    yield* _pasrseObj(prop)
  }
}

class DocProp {
  _initialKey: string | number
  _value: any
  _parent?: DocProp
  _children: DocProp[]

  constructor(
    parent: DocProp | undefined,
    keyOrIndex: string | number,
    value: any
  ) {
    this._parent = parent
    this._value = value
    this._initialKey = keyOrIndex
    /**加入到父属性中*/
    this._children = []
    if (parent) {
      if (
        typeof keyOrIndex === 'number' &&
        keyOrIndex < parent._children.length
      ) {
        parent._children.splice(keyOrIndex, 0, this)
      } else {
        parent._children.push(this)
      }
    }
  }

  set key(val: string | number) {
    this._initialKey = val
  }

  get key() {
    let { _initialKey } = this
    if (typeof _initialKey === 'number') {
      let index = this._parent ? this._parent._children.indexOf(this) : -1
      if (index === -1) {
        throw Error(
          `error ${this._initialKey}/${this._parent?._children.length}/${this._value}`
        )
      }
      return index
    }

    return this._initialKey
  }

  get name(): string {
    let { _parent, key } = this
    if (_parent?.name) {
      return _parent.name + (typeof key === 'number' ? `[${key}]` : `.${key}`)
    } else {
      if (typeof key === 'string') return key
      else throw Error('')
    }
  }

  get value() {
    return this._value
  }

  set value(val: any) {
    this._value = val
  }

  removeChild(key: string | number) {
    if (typeof key === 'number') {
      let child = this._children[key]
      if (child._children.length) {
        console.log('ccccc', child)
        throw Error(`要删除的属性【${child.name}】包含子属性，不允许删除`)
      }

      this._children.splice(key, 1)
      this.value.splice(key, 1)
    } else if (typeof key === 'string') {
      let child = this._children.find((c) => c.key === key)
      if (child) {
        if (child._children.length) {
          console.log('dddd', child)
          throw Error(`要删除的属性【${child.name}】包含子属性，不允许删除`)
        }
        this._children.splice(this._children.indexOf(child), 1)
        delete this.value[key]
      }
    }
  }

  toJSON() {
    let { name, value } = this
    let children = this._children.length
    return { name, value, children }
  }
}

function nameToRegExp(name: string): string {
  return name.replace('.', '\\.').replace('[', '\\[').replace(']', '\\]')
}

/**
 * 将文档转换为数组表示
 */
export class DocAsArray {
  _properties: DocProp[]
  renderCounter: any // 用于出发渲染

  constructor(rawDoc: any = {}, rootName = DEFAULT_ROOT_NAME) {
    let iter = new DocIter(rawDoc, rootName)
    let props = Array.from(iter)
    this._properties = props ?? []
    this.renderCounter = { value: 0 }
  }
  /**
   *
   * @param name
   * @returns
   */
  private findByName(name: string): {
    index: number
    prop: DocProp | undefined
  } {
    let index = -1,
      prop
    for (let i = 0; i < this._properties.length; i++) {
      if (this._properties[i].name === name) {
        index = i
        prop = this._properties[i]
        break
      }
    }
    return { index, prop }
  }
  /**
   * 成对象
   */
  build(): any {
    let obj = {}
    this._properties.forEach((prop) => {
      _.set(obj, prop.name, prop.value)
    })
    return obj
  }

  appendAt(name: string, value: any, keyOrIndex?: string | number) {
    if (!name) {
      /**添加根属性，没有父属性*/
      if (typeof keyOrIndex === 'string') {
        this._properties.push(new DocProp(undefined, keyOrIndex, value))
      } else {
        throw Error(`文档根属性不允许指定为数字类型【${keyOrIndex}】`)
      }
    } else {
      let { index: parentIndex, prop: parent } = this.findByName(name)
      if (parent === undefined) throw Error(`指定的父属性【${name}】不存在`)

      debug(`属性【${name}】存储位置【${parentIndex}】`)

      if (typeof keyOrIndex === 'string') {
        /**对象添加子属性*/
        let re = new RegExp(`^${nameToRegExp(name)}\\.(\\w+)$`)
        let lastChildIndex = parentIndex + 1
        while (lastChildIndex < this._properties.length) {
          let next = this._properties[lastChildIndex]
          if (!re.test(next.name)) {
            break
          }
          lastChildIndex++
        }
        let prop = new DocProp(parent, keyOrIndex, value)
        parent.value[keyOrIndex] = value
        this._properties.splice(lastChildIndex, 0, prop)
        debug(
          `属性【${name}】在【${lastChildIndex}】添加子字段【${prop.name}】`
        )
      } else if ((keyOrIndex ?? true) || typeof keyOrIndex === 'number') {
        /**数组添加项目*/
        keyOrIndex ??= parent._children.length
        if (keyOrIndex < 0 || keyOrIndex > parent._children.length) {
          throw Error(`指定位置【${keyOrIndex}】超出数组【${name}】范围`)
        }
        // let re = new RegExp(`^${nameToRegExp(name)}\\[(\\d+)\\]$`)
        // let lastChildIndex = parentIndex + 1
        // while (lastChildIndex < this._properties.length) {
        //   let next = this._properties[lastChildIndex]
        //   if (!re.test(next.name)) break
        //   lastChildIndex++
        // }
        let prop = new DocProp(parent, keyOrIndex, value)
        parent.value.push(value)
        this._properties.push(prop)
        debug(`属性【${name}】在位置添加子属性【${prop.name}】`)
      }
    }

    this.renderCounter.value++
  }
  /**
   * 删除指定属性
   * @param name 指定的属性
   * @returns
   */
  remove(name: string, needRender = true) {
    let { index, prop } = this.findByName(name)

    if (prop === undefined) return undefined

    let { _parent, key } = prop

    /**需要先删除子属性，再删除属性*/
    let i = prop._children.length - 1
    while (i >= 0) {
      let child = prop._children[i]
      this.remove(child.name, false)
      i--
    }

    // 删除属性
    if (_parent && key !== undefined) _parent.removeChild(key)
    this._properties.splice(index, 1)

    // 触发重新渲染
    if (needRender) this.renderCounter.value++
  }
  /**
   * 返回指定字段的值
   * @param name
   * @returns
   */
  get(name: string): any {
    let { prop } = this.findByName(name)
    return prop?.value
  }
  /**
   *
   * @param name
   * @param value
   * @returns
   */
  set(name: string, value: any, needRender = true) {
    let { prop } = this.findByName(name)

    if (prop === undefined) {
      this.appendAt('', value, name)
    } else {
      prop.value = value
    }

    if (needRender) this.renderCounter.value++
  }
  /**
   *
   * @param name
   * @param defaultValue
   * @returns
   */
  init(name: string, defaultValue: any): any {
    let val = this.get(name)
    if (val !== undefined) return val
    this.appendAt('', defaultValue, name)
    return defaultValue
  }
  /**
   * 修改属性名称
   * @param oldFullname
   * @param newKey
   * @param needRender
   */
  rename(oldFullname: string, newKey: string, needRender = true) {
    let { prop } = this.findByName(oldFullname)
    if (!prop) throw Error(`指定的属性【${oldFullname}】不存在`)
    let parent = prop._parent
    if (parent) {
      delete parent.value[prop.key]
      parent.value[newKey] = prop.value
    }
    prop.key = newKey

    if (needRender) this.renderCounter.value++
  }
}
