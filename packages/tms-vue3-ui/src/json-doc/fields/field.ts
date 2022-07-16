import { SchemaProp, SchemaPropAttrs } from '@/json-schema/model'

export const ARRAY_KEYWORDS: (keyof SchemaPropAttrs)[] = [
  'anyOf',
  'oneOf',
  'enum',
]
/**
 * 输入字段的可选项
 */
type FieldItem = {
  label: string
  value: string
  group: string
}
/**
 * 编辑文档中的字段，与表单中的一个输入项对应。
 */
export abstract class Field {
  value?: any
  type: string = '' // 字段的类型
  _index: number // 如果字段是数组中的对象，index代表字段所属对象在数组中的饿索引
  _name: string // 固定属性的名称或可选属性的实际名称
  _path: string // 父节点有可能是动态的
  private _prop: SchemaProp
  private _required: boolean
  private _visible: boolean
  items?: FieldItem[] // 字段的可选项。应该改个名字，避免和schema中的items混淆。
  itemType?: string
  itemVisible?: { [k: string]: boolean } // 记录字段的选项是否可见
  /**自动填充相关*/
  waitingRender: boolean = false // 是否在等待渲染
  autofillURL: string = '' // 当前值对应的自动填充参数，为了避免不必要接口调用
  autofillBody: any // 当前值对应的自动填充参数，为了避免不必要接口调用
  autofilled: boolean = false // 是否已经进行过填充

  constructor(prop: SchemaProp, index = -1, name = '') {
    let { attrs } = prop
    /**设置默认值*/
    let { type, default: defVal, value } = attrs
    if (type === 'array') {
      this.value = defVal !== undefined ? [...defVal] : value ? value : []
    } else {
      this.value = defVal ? defVal : value ? value : ''
    }
    this._prop = prop
    this._required = prop.attrs.required ?? false
    this._visible = false
    this._index = index
    this._name = name || prop.name
    this._path = prop.path
  }

  get index() {
    return this._index
  }

  get name() {
    return this._name
  }

  set path(val) {
    this._path = val
  }

  get path() {
    return this._path
  }

  // 字段的名字与文档一致。如果属性是可选属性，字段的名字和是属性名字并不相等。
  get fullname() {
    if (this.index !== -1) {
      // 数组中的项目
      let path = this.path.replace(/\[\*\]$/, `[${this._index}]`)
      return this.name && this.name !== '[*]' ? `${path}.${this.name}` : path
    } else {
      if (!this.name) return this.path
      let fullname = (this.path ? this.path + '.' : '') + this.name
      return fullname
    }
  }
  /**字段在文档对象中的深度*/
  get depth() {
    return this.fullname.split(/\.|\[\d+\]/).length
  }

  get label() {
    return this._prop.attrs.title ?? ''
  }

  get description() {
    return this._prop.attrs.description ?? ''
  }

  get schemaType() {
    return this._prop.attrs.type
  }

  get itemSchemaType() {
    return this._prop.items?.type
  }

  get schemaRequired() {
    return this._prop.attrs.required ?? false
  }

  get required() {
    return this._required
  }

  set required(val: boolean) {
    this._required = val
  }

  get visible() {
    return this._visible
  }

  set visible(val) {
    this._visible = val
  }

  get scheamProp() {
    return this._prop
  }

  get enumGroups() {
    return this._prop.attrs.enumGroups
  }

  get attachment() {
    return this._prop.attachment
  }

  isChildOf(parent: Field): boolean {
    if (
      parent.fullname === this.path ||
      parent.fullname + '[*]' === this.path
    ) {
      return true
    }
    return false
  }
}
