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
 *
 */
export abstract class Field {
  value?: any
  // disabled: boolean
  // assocs
  //this.name = schema.name ? schema.name : pathname
  type: string = ''
  private _prop: SchemaProp
  private _required: boolean
  private _visible: boolean
  items?: FieldItem[]
  itemType?: string
  itemVisible?: any
  component?: any

  constructor(prop: SchemaProp) {
    let { attrs } = prop
    /**设置默认值*/
    let { type, default: defVal, value } = attrs
    if (type === 'array') {
      this.value = defVal !== undefined ? [...defVal] : value ? value : []
    } else {
      this.value = defVal ? defVal : value ? value : ''
    }
    // this.component = schema.component
    // this.disabled = attrs.readonly || false
    // this.assocs = schema.assocs
    // if (attrs.type === 'json') {
    //   if (this.value === '') this.value = {}
    //   this.value = JSON.stringify(this.value)
    // }
    this._prop = prop
    this._required = prop.attrs.required ?? false
    this._visible = false
  }

  get name() {
    return this._prop.name
  }

  get fullname() {
    return this._prop.fullname
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

  get dependencies() {
    return this._prop.dependencies
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
}
