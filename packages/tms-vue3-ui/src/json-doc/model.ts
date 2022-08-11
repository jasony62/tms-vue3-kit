import _ from 'lodash'
import Debug from 'debug'
import { SchemaIter, SchemaProp } from '@/json-schema/model'

const debug = Debug('json-doc')
/**
 *
 * @param name 文档字段名称
 */
// function _findSchemaProp(
//   name: string,
//   schemas: Map<string, SchemaProp>
// ): SchemaProp {
//   let schemaProp
//   let schemaNames = schemas.keys()
//   for (let schemaName of schemaNames) {
//     if (name === schemaName || name.replace(/[\d+]/g, '*') === schemaName) {
//       schemaProp = schemas.get(schemaName)
//       break
//     }
//   }

//   if (schemaProp) return schemaProp

//   throw Error(`文档中的字段${name}没有找到匹配的属性定义`)
// }
/**
 * 解析数组
 * @param parent
 */
function* _parseArray(parent: DocProp, schemas: Map<string, SchemaProp>): any {
  let rawArr = parent.value
  for (let i = 0; i < rawArr.length; i++) {
    let value = rawArr[i]
    let prop = new DocProp(parent, i, value)
    yield prop
    if (Array.isArray(value)) {
      yield* _parseArray(prop, schemas)
    } else if (value !== null && typeof value === 'object') {
      yield* _pasrseObj(prop, schemas)
    }
  }
}
/**
 * 解析对象
 * @param parent
 */
function* _pasrseObj(parent: DocProp, schemas: Map<string, SchemaProp>): any {
  let rawObj = parent.value
  if (rawObj === null) return
  let keys = Object.keys(rawObj)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    let value = rawObj[key]
    let prop = new DocProp(parent, key, value)
    yield prop
    if (Array.isArray(value)) {
      yield* _parseArray(prop, schemas)
    } else if (value !== null && typeof value === 'object') {
      // let schemaProp = _findSchemaProp(prop.name, schemas)
      // /**
      //  * json类型的字段不需要向下解析
      //  */
      // if (schemaProp.attrs.type !== 'json') yield* _pasrseObj(prop, schemas)
      yield* _pasrseObj(prop, schemas)
    }
  }
}

/**
 * 根节点默认名称
 */
export const DEFAULT_ROOT_NAME = ''
/**
 * 文档对象迭代器。
 * 不包含根对象
 */
export class DocIter {
  _rawDoc
  _rootName
  _schemas

  constructor(
    rawDoc: any,
    schemas: Map<string, SchemaProp>,
    rootName = DEFAULT_ROOT_NAME
  ) {
    this._rawDoc = rawDoc
    this._schemas = schemas
    this._rootName = rootName
  }

  get rawDoc() {
    return this._rawDoc
  }

  /**
   * 迭代文档中的数据
   */
  *[Symbol.iterator]() {
    let prop = new DocProp(undefined, this._rootName, this._rawDoc)
    yield prop
    yield* _pasrseObj(prop, this._schemas)
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
    value: any,
    propIndex?: number
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
        if (typeof propIndex === 'number')
          parent._children.splice(propIndex, 0, this)
        else parent._children.push(this)
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
        throw Error(`要删除的属性【${child.name}】包含子属性，不允许删除`)
      }
      this._value.splice(key, 1)
      this._children.splice(key, 1)
    } else if (typeof key === 'string') {
      let child = this._children.find((c) => c.key === key)
      if (child) {
        if (child._children.length) {
          throw Error(`要删除的属性【${child.name}】包含子属性，不允许删除`)
        }
        delete this._value[key]
        this._children.splice(this._children.indexOf(child), 1)
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
  _rawDoc
  _rawSchema
  _properties: DocProp[] // 文档的属性
  _schemas = new Map<string, SchemaProp>()
  renderCounter: any // 用于出发渲染

  constructor(rawDoc: any = {}, schema: any, rootName = DEFAULT_ROOT_NAME) {
    this._rawDoc = rawDoc
    this._rawSchema = schema

    let iterSchema = new SchemaIter(JSON.parse(JSON.stringify(schema)))
    for (let prop of iterSchema) this._schemas.set(prop.fullname, prop)

    let iter = new DocIter(rawDoc, this._schemas, rootName)
    let props = Array.from(iter)
    this._properties = props ?? []

    this.renderCounter = { value: 0 }
  }

  get rawDoc() {
    return this._rawDoc
  }

  get properties() {
    return this._properties
  }

  /**
   *
   */
  forceRender() {
    this.renderCounter.value++
  }
  /**
   *
   * @param name
   * @returns
   */
  findByName(name: string): {
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
   * 构造对象
   */
  build(): any {
    let obj = {}
    this._properties.forEach((prop, index) => {
      if (index === 0) return
      let val = this.get(prop.name)
      _.set(obj, prop.name, val)
    })
    return obj
  }
  /**
   * 给属性追加子属性
   *
   * @param name 属性的名称
   * @param value 子属性的值
   * @param key 子属性的名称
   */
  appendAt(name: string, value: any, key?: string, needRender = true) {
    let newProp
    let { index: parentIndex, prop: parent } = this.findByName(name)
    if (parent === undefined) {
      let msg = `指定的属性【${key}】的父属性【${name}】不存在，添加默认值`
      debug(msg)
      if (typeof key === 'string') this.set(name, {}, false)
      else this.set(name, [], false)
      let indexAndProp = this.findByName(name)
      parentIndex = indexAndProp.index
      parent = indexAndProp.prop
      if (parent === undefined)
        throw Error(
          `指定的属性【${key}】的父属性【${name}】不存在，添加默认值失败`
        )
    }

    debug(
      `属性【${key ?? true}】的父文档属性【${name}】存储位置【${parentIndex}】`
    )

    if (typeof key === 'string') {
      /**对象添加子属性*/
      // 子属性名匹配规则
      let re = name
        ? new RegExp(`^${nameToRegExp(name)}\\.(\\w+)(\\.|$)`)
        : new RegExp(`^\\w+(\\.|$)`)
      let lastChildIndex = parentIndex + 1
      while (lastChildIndex < this._properties.length) {
        let next = this._properties[lastChildIndex]
        if (!re.test(next.name)) {
          break
        }
        lastChildIndex++
      }
      newProp = new DocProp(parent, key, value)
      this._properties.splice(lastChildIndex, 0, newProp)
      debug(
        `属性【${name}】在【${lastChildIndex}】添加子字段【${newProp.name}】`
      )
    } else if ((key ?? true) || typeof key === 'number') {
      /**数组添加项目*/
      let index = parent._children.length
      newProp = new DocProp(parent, index, value)
      this._properties.push(newProp)
      debug(`属性【${name}】在位置添加子属性【${newProp.name}】`)
    }
    // 需要添加子字段。插入的位置需要控制吗？
    if (newProp && typeof value === 'object' && Object.keys(value).length) {
      let iter = new DocIter(value, this._rawSchema, newProp.name)
      Array.from(iter).forEach((child) => this._properties.push(child))
    }

    if (needRender) this.renderCounter.value++
  }
  /**
   * 给属性添加兄弟属性
   * @param name
   * @param value
   * @param key
   */
  insertAt(name: string, value: any, key?: string, needRender = true) {
    let { prop } = this.findByName(name)
    if (prop === undefined) throw Error(`指定的兄弟属性【${name}】不存在`)

    let parent = prop._parent
    if (!parent) throw Error(`指定的兄弟属性【${name}】不存在父属性`)

    let siblings = parent._children
    let index = siblings.indexOf(prop)
    let newProp
    if (Array.isArray(parent.value)) {
      newProp = new DocProp(parent, index, value)
    } else if (typeof parent.value === 'object' && typeof key === 'string') {
      newProp = new DocProp(parent, key, value, index)
    } else {
      throw Error(
        `指定的兄弟属性【${name}】的父属性的值不是对象或数组，无法插入新属性`
      )
    }

    this._properties.push(newProp)

    // 需要添加子字段。插入的位置需要控制吗？
    if (newProp && typeof value === 'object' && Object.keys(value).length) {
      let iter = new DocIter(value, this._rawSchema, newProp.name)
      Array.from(iter).forEach((child) => this._properties.push(child))
    }

    if (needRender) this.renderCounter.value++
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
   * 返回指定字段的值。如果指定的属性有子属性，使用子属性的值构造属性的值。
   * @param name
   * @returns
   */
  get(name: string): any {
    let { prop } = this.findByName(name)
    if (prop?._children.length) {
      if (Array.isArray(prop.value)) {
        return prop._children.map((child) => child.value)
      } else if (typeof prop.value === 'object') {
        return prop._children.reduce(
          (val, child) => Object.assign(val, { [child.key]: child.value }),
          {}
        )
      }
    }
    return prop?.value
  }
  /**
   *
   * @param name
   * @param value
   * @returns
   */
  set(name: string, value: any, needRender = true, isJsonType = false) {
    let { prop } = this.findByName(name)
    if (prop === undefined) {
      this.appendAt('', value, name)
    } else {
      prop.value = value
      /**
       * 如果是json类型字段，删除子节点
       * 应该在生成文档迭代器时应该根据schema定义解决这个问题
       */
      let i = prop._children.length - 1
      while (i >= 0) {
        let child = prop._children[i]
        this.remove(child.name, false)
        i--
      }
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
