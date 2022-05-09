import { SchemaProp } from '@/json-schema/model'
import { Field, ARRAY_KEYWORDS } from './field'
import { FieldBoolean } from './boolean'
import { FieldText } from './text'
import { FieldArray } from './array'
import { FieldFile } from './file'
import { FieldObject } from './object'

/**
 * 创建表单字段对象
 *
 * @param prop JSONSchema属性
 * @param index 如果字段是数组中的对象的字段，index为字段所属对象在数组中的索引
 */
function createField(prop: SchemaProp, index = -1): Field {
  let newField
  switch (prop.attrs.type) {
    case 'boolean':
      newField = new FieldBoolean(prop, index)
      break
    case 'array':
      newField = ARRAY_KEYWORDS.some((kw) => prop.hasOwnProperty(kw))
        ? new FieldArray(prop, index)
        : prop.items?.format === 'file'
        ? new FieldFile(prop, index)
        : new FieldObject(prop, index)
      break
    case 'object':
      newField = new FieldObject(prop, index)
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
          newField = new FieldArray(prop, index)
          break
        }
      }
      if (!newField) newField = new FieldText(prop, index)
      break
    default:
      newField = new FieldText(prop, index)
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