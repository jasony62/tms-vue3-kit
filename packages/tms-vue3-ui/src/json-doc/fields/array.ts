import { SchemaProp } from '@/json-schema/model'
import { Field, ARRAY_KEYWORDS } from './field'

type Item = {
  value: string
  label: string
  group?: string
}

export function parseItems(items?: Item[]): Item[] | undefined {
  return items?.map((item) => {
    let obj: Item = { value: item.value, label: item.label }
    if (item.group) {
      obj.group = item.group
    }
    return obj
  })
}

export class FieldArray extends Field {
  multiple: boolean
  items: any[] = []
  itemGroups?

  constructor(prop: SchemaProp, index = -1) {
    super(prop, index)

    const { attrs } = prop
    this.multiple = attrs.type === 'array'

    for (const keyword of ARRAY_KEYWORDS) {
      if (attrs.hasOwnProperty(keyword)) {
        switch (keyword) {
          case 'enum':
            if (!this.type) {
              this.type = 'select'
            }
            if (attrs?.enumGroups?.length) {
              this.itemGroups = attrs.enumGroups
            }
            this.itemType = 'option'
            this.items = parseItems(attrs[keyword]) ?? []
            break

          case 'oneOf':
            this.type = 'radiogroup'
            this.itemType = 'radio'
            this.value = this.hasOwnProperty('value') ? this.value : ''
            this.items = parseItems(attrs[keyword]) ?? []
            break

          case 'anyOf':
            this.type = 'checkboxgroup'
            this.itemType = 'checkbox'
            this.value = Array.isArray(this.value) ? this.value : []
            this.items = parseItems(attrs[keyword]) ?? []
            break
        }
      }
    }
    if (!this.type) {
      this.type = attrs.type
      this.items = []
    }
  }
}
