import { SchemaProp } from '../../json-schema/model.js'
import { Field } from './field.js'

export class FieldBoolean extends Field {
  constructor(prop: SchemaProp, index = -1, name = '') {
    super(prop, index, name)
    this.type = 'checkbox'
  }
}
