import { SchemaProp } from '@/json-schema/model'
import { Field } from './field'

export class FieldBoolean extends Field {
  constructor(prop: SchemaProp) {
    super(prop)
    this.type = 'checkbox'
  }
}
