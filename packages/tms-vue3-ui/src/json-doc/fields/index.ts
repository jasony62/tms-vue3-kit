import { Field, ARRAY_KEYWORDS } from './field'
import { FieldBoolean } from './boolean'
import { FieldText } from './text'
import { FieldArray } from './array'
import { FieldFile } from './file'
import { FieldObject } from './object'
import { RawSchema, SchemaProp } from '../../json-schema/model'

/**
 * 创建表单字段对象
 *
 * @param prop JSONSchema属性
 * @param refs
 * @param value 初始值
 */
function createField(
  prop: SchemaProp,
  refs?: { [k: string]: RawSchema },
  value?: any
): Field {
  let newField
  switch (prop.attrs.type) {
    case 'boolean':
      newField = new FieldBoolean(prop)
      break
    case 'array':
      newField = ARRAY_KEYWORDS.some((kw) => prop.hasOwnProperty(kw))
        ? new FieldArray(prop)
        : prop.items?.format === 'file'
        ? new FieldFile(prop, value)
        : new FieldObject(prop, refs)
      break
    case 'object':
      newField = new FieldObject(prop, refs)
      break
    case 'integer':
    case 'number':
    case 'string':
      for (const keyword of ARRAY_KEYWORDS) {
        if (prop.attrs.hasOwnProperty(keyword)) {
          prop.items = {
            type: prop.attrs.type,
            enum: prop.attrs[keyword],
          }
          newField = new FieldArray(prop)
          break
        }
      }
      if (!newField) newField = new FieldText(prop)
      break
    default:
      newField = new FieldText(prop)
  }

  return newField
}

export {
  createField,
  Field,
  ARRAY_KEYWORDS,
  FieldBoolean,
  FieldText,
  FieldArray,
  FieldFile,
  FieldObject,
}
