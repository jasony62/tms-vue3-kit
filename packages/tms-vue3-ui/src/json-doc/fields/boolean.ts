import { SchemaProp } from '@/json-schema/model'
import { Field } from './field'

export class FieldBoolean extends Field {
  constructor(prop: SchemaProp, index = -1) {
    super(prop, index)
    this.type = 'checkbox'
  }
}
