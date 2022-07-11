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

/**属性值自动填充位置*/
export enum PropAutofillTarget {
  'value' = 'value',
  'items' = 'items',
}
/**自动填充数据获取策略*/
export enum PropAutofillRunPolicy {
  'onCreate' = 'onCreate',
  'onParamChange' = 'onParamChange',
  'onUser' = 'onUser',
}
/**属性值自动填充*/
export type PropAutofill = {
  url: string
  method: string
  params?: { path?: string; value?: any; name: string }[]
  body?: { path?: string; value?: any; bodyPath: string }[]
  target: PropAutofillTarget
  runPolicy: PropAutofillRunPolicy
  valuePath?: string // 从返回结果中提取属性值的路径
  itemPath?: { path: string; label: string; value: string } // 从返回结果中提取属选项列表值的路径
}

/**
 * 属性是否在文档中存在的规则
 * 指定的所有属性需要等于给定的值
 */
export type ExistIfRule = { [k: string]: { const: string } }
/**
 * 属性是否在文档中存在的规则集
 */
export type ExistIfRuleSet = {
  properties?: ExistIfRule
  allOf?: ExistIfRuleSet[]
  oneOf?: ExistIfRuleSet[]
}

export type SchemaPropAttrs = {
  type: string
  title?: string
  description?: string
  format?: string
  required?: boolean
  enum?: EnumOption[]
  anyOf?: EnumOption[]
  oneOf?: EnumOption[]
  enumGroups?: EnumGroup[]
  minItems?: number
  maxItems?: number
  default?: any
  autofill?: PropAutofill
  value?: any // 要要保留？没有对应的逻辑
  [k: string]: any
}
/**单个属性定义*/
export class SchemaProp {
  path: string
  name: string
  attrs: SchemaPropAttrs
  existIf: ExistIfRuleSet | undefined
  items?: { type: string; [k: string]: any }
  attachment?: any
  isPattern = false //  是否是由正则表达式定义名称的子属性
  patternChildren: SchemaProp[] | undefined

  constructor(path: string, name: string, type?: string) {
    this.path = path
    this.name = name
    this.attrs = { type: type ?? '', required: false }
  }

  get fullname(): string {
    // 数组中项目为简单类型是，属性没有名字
    if (!this.name) return this.path
    if (!this.path) return this.name

    let fullname = this.path + (this.name === '[*]' ? '' : '.') + this.name

    return fullname
  }

  /**如果需要去掉路径中的[*]获得父属性名称*/
  get parentFullname(): string {
    return this.path.replace(/\[\*\]$/, '')
  }

  /**是否是数组中项目*/
  get isArrayItem(): boolean {
    return /\[\*\]$/.test(this.path)
  }
}

export type SchemaItem = {
  type: string
  properties?: any
  format?: string
  formatAttrs?: { [k: string]: any }
  $ref?: any
  enum?: any
}

export type RawSchema = {
  name?: string
  type: string
  title?: string
  description?: string
  properties?: { [k: string]: RawSchema }
  required?: boolean | string[]
  format?: string
  attrs?: any
  items?: SchemaItem
  enumGroups?: unknown[]
  enum?: any
  anyOf?: any
  oneOf?: any
  default?: any
  autofill?: PropAutofill
  attachment?: any
  component?: any
  visible?: any
  $id?: string
  assocs?: string[] // 这个不应该放在Schema里
  minLength?: number
  maxLength?: number
  pattern?: string
  $defs?: { [k: string]: RawSchema }
}

/**依次处理子属性*/
function* _parseChildren(
  properties: { [k: string]: RawSchema },
  parent: SchemaProp,
  requiredSet?: string[],
  isPatternProperty = false
) {
  let keys = Object.keys(properties)
  for (let i = 0, key; i < keys.length; i++) {
    key = keys[i]
    yield* _parseOne(
      key,
      properties[key],
      parent,
      requiredSet?.includes(key),
      isPatternProperty
    )
  }
}

/**处理JSONSchema的1个属性*/
function* _parseOne(
  name: string,
  rawProp: any,
  parent?: SchemaProp,
  mandatory?: boolean,
  isPatternProperty = false
): any {
  let path = ''
  if (parent) {
    path = parent.fullname
    if (parent.attrs.type === 'array') path += '[*]'
  }

  let newProp = new SchemaProp(path, name)

  if (mandatory) newProp.attrs.required = mandatory
  newProp.isPattern = isPatternProperty
  if (isPatternProperty) parent?.patternChildren?.push(newProp)

  let { properties, patternProperties, items, required, existIf } = rawProp

  let keys = Object.keys(rawProp)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    switch (key) {
      case 'properties':
      case 'patternProperties':
      case 'existIf':
      case 'required':
        break
      case 'items':
        newProp.items = { type: items.type }
        Object.keys(items).forEach((key) => {
          if (key === 'properties') return
          Object.assign(newProp.items, { [key]: items[key] })
        })
      case 'attachment':
        newProp.attachment = rawProp.attachment
        break
      case 'type':
      case 'title':
      case 'description':
      case 'format':
      case 'oneOf':
      case 'anyOf':
      case 'enum':
      case 'enumGroups':
      case 'default':
      case 'autofill':
        Object.assign(newProp.attrs, { [key]: rawProp[key] })
        break
      default:
        Object.assign(newProp.attrs, { [key]: rawProp[key] })
    }
  }
  // 如果required是boolean值，作用于当前属性，如果是数组作用于子属性
  if (typeof required === 'boolean') {
    newProp.attrs.required = required
  }
  // 是否包含由正则表达式定义名称的子属性
  if (rawProp.type === 'object' && typeof patternProperties === 'object') {
    newProp.patternChildren = []
  }
  // 属性依赖规则
  if (typeof existIf === 'object') {
    newProp.existIf = existIf
  }

  // 返回当前的属性
  yield newProp

  // 指定哪些子属性为必填
  let requiredSet = Array.isArray(required) ? required : []

  if (rawProp.type === 'object') {
    /*处理对象属性下的子属性*/
    if (typeof properties === 'object') {
      /**属性的子属性*/
      yield* _parseChildren(properties, newProp, requiredSet)
    }
    if (typeof patternProperties === 'object') {
      /**属性的模板子属性*/
      yield* _parseChildren(patternProperties, newProp, requiredSet, true)
    }
  } else if (rawProp.type === 'array') {
    // 处理数组属性下的子属性
    if (typeof items === 'object' && typeof items.properties === 'object') {
      yield* _parseChildren(items.properties, newProp, requiredSet)
    }
  }
}
/**
 * 根节点默认名称
 */
export const DEFAULT_ROOT_NAME = ''

/**
 * JSONSchema对象迭代器
 */
export class SchemaIter {
  private _rawSchema
  private _rootName

  constructor(rawSchema: any, rootName = DEFAULT_ROOT_NAME) {
    this._rawSchema = rawSchema
    this._rootName = rootName
  }

  get rootName() {
    return this._rootName
  }

  /**
   * 迭代访问JSONSchema的属性
   */
  *[Symbol.iterator]() {
    // 从根属性开始遍历
    yield* _parseOne(this._rootName, this._rawSchema)
  }
}
