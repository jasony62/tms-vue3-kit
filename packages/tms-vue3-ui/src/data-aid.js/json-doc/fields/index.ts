import { SchemaProp } from '@/data-aid.js/json-schema/model'
import { Field, ARRAY_KEYWORDS } from './field'
import { FieldBoolean } from './boolean'
import { FieldText } from './text'
import { FieldArray } from './array'
import { FieldObject } from './object'
import { FormContext } from '../builder'

/**
 * 根据属性定义创建表单字段对象
 *
 * @param prop JSONSchema属性
 * @param index 如果字段是数组中的对象的字段，index为字段所属对象在数组中的索引
 */
function createField<VNode>(
  ctx: FormContext<VNode>,
  prop: SchemaProp,
  parentField?: Field,
  index = -1,
  name = ''
): Field {
  let newField: Field | undefined

  switch (prop.attrs.type) {
    case 'boolean':
      newField = new FieldBoolean(prop, index, name)
      break
    case 'array':
      // anyOf时生成核选框组，enum下拉框方式
      // newField = ARRAY_KEYWORDS.some((kw) => prop.attrs.hasOwnProperty(kw))
      newField = prop.attrs.hasOwnProperty('anyOf')
        ? new FieldArray(prop, index, name)
        : new FieldObject(prop, index, name)
      break
    case 'object':
      newField = new FieldObject(prop, index, name)
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
          newField = new FieldArray(prop, index, name)
          break
        }
      }
      if (!newField) newField = new FieldText(prop, index, name)
      break
    default:
      newField = new FieldText(prop, index, name)
  }

  /**有父字段，可能需要调整名称*/
  if (parentField) {
    newField.path = parentField.fullname
    // 新字段是数组中的项目
    if (prop.name === '[*]') newField.path += '[*]'
  }

  /**
   * 不重复创建field，因为计算fullname较为复杂，所以先创建对象再查找，可以优化
   */
  if (ctx.fields) {
    let exist = ctx.fields.get(newField.fullname)
    if (exist) {
      newField = exist
    } else {
      /**
       * 加入父字段
       */
      if (parentField && ['object', 'array'].includes(parentField.type))
        parentField.children?.push(newField)
      ctx.fields.set(newField.fullname, newField)
    }
  }

  if (!newField) throw Error(`根据属性【${prop.fullname}】创建字段失败`)

  return newField
}

export {
  createField,
  Field,
  ARRAY_KEYWORDS,
  FieldBoolean,
  FieldText,
  FieldArray,
  FieldObject,
}
