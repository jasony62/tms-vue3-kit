import _ from 'lodash'

export class Render {
  /**
   * 按层级创建节点
   *
   * @param {*} createElement
   * @param {*} tags
   * @param {*} options
   * @param {*} children
   */
  static layered(createElement, tags, options, children) {
    if (typeof tags === 'string') tags = tags.split('.')
    if (!Array.isArray(tags)) throw Error('[Render.wrapByTag] 参数(tags)类型错误，需要数组或字符串')
    if (!options) options = {}

    let tag, node
    tag = tags.pop()
    node = createElement(tag, options[tag], children)
    while (tags.length > 0) {
      tag = tags.pop()
      node = createElement(tag, options[tag], [node])
    }
    return node
  }
}

const RE_SEPARATOR = '\\.' // 字段分割符
const RE_OBJECT_FIELD = '[\\w-]+' // 字段名
const RE_ARRAY_INDEX = '\\[\\d+\\]'

export class JsonSchema {
  /**
   * 遍历JSONSchema对象
   *
   * @param {*} schema
   * @param {*} schemaCallback
   * @param {*} schemaPath
   * @param {*} flatted
   */
  static travel(schema, schemaCallback, schemaPath = [], flatted = new Map()) {
    if (schemaPath.length)
      flatted.set(
        schemaPath.join(RE_SEPARATOR),
        typeof schemaCallback === 'function' ? schemaCallback(schema, schemaPath) : schema
      )

    if (schema.$ref) {
      // nothing
    } else if (schema.type === 'object') {
      if (schema.properties && typeof schema.properties === 'object') {
        if (schema.$id) {
          JsonSchema.travel({ $ref: schema.$id }, schemaCallback, [...schemaPath, schema.$id], flatted)
          Object.entries(schema.properties).forEach(([subKey, subSchema]) =>
            JsonSchema.travel(subSchema, schemaCallback, [schema.$id, subKey], flatted)
          )
        } else
          Object.entries(schema.properties).forEach(([subKey, subSchema]) =>
            JsonSchema.travel(subSchema, schemaCallback, [...schemaPath, subKey], flatted)
          )
      } else if (schema.items && typeof schema.items === 'object') {
        if (schema.items.$ref) {
          JsonSchema.travel(schema.items, schemaCallback, [...schemaPath, RE_OBJECT_FIELD, schema.items.$ref], flatted)
        } else {
          JsonSchema.travel(schema.items, schemaCallback, [...schemaPath, RE_OBJECT_FIELD], flatted)
        }
      }
    } else if (schema.type === 'array') {
      if (schema.items && typeof schema.items === 'object') {
        if (schema.items.$ref) {
          JsonSchema.travel(schema.items, schemaCallback, [...schemaPath, RE_ARRAY_INDEX, schema.items.$ref], flatted)
        } else {
          JsonSchema.travel(schema.items, schemaCallback, [...schemaPath, RE_ARRAY_INDEX], flatted)
        }
      }
    }

    return flatted
  }
  /**
   *
   */
  static flattenObject(obj, propPath = [], flatted = new Map()) {
    if (Array.isArray(obj)) {
      if (obj.length) obj.forEach((val, index) => JsonSchema.flattenObject(val, [...propPath, `[${index}]`], flatted))
      else flatted.set(propPath.join('.'), obj)
    } else if (typeof obj === 'object' && obj !== null) {
      if (Object.keys(obj).length)
        Object.entries(obj).forEach(([prop, val]) => JsonSchema.flattenObject(val, [...propPath, prop], flatted))
      else flatted.set(propPath.join('.'), obj)
    } else {
      flatted.set(propPath.join('.'), obj)
    }

    return flatted
  }
  /**
   * 返回根据schema剪裁后的对象
   *
   * 剪裁规则：
   * 1，schema中不包含的数据
   * 2，schema中包含但是值为空的数据，包括：空对象，空数组，undefined，null
   *
   * @param {object} schema
   * @param {object} doc
   *
   */
  static slim(schema, doc) {
    function findSchema(flatSchema, searched, stack = []) {
      // 直接匹配
      if (flatSchema.has(searched)) return flatSchema.get(searched)

      // 正则匹配
      const matched = [...flatSchema.keys()].filter(key => {
        const key2 = key.match('\\.#') ? `${key.split('\\.#')[0]}\\.` : `${key}$`
        const re = new RegExp(`^${key2}`)
        return re.test(searched)
      })
      if (matched.length) {
        // 正则完全匹配
        if (matched.length === 1) {
          if (!matched[0].match(/\.#/)) return flatSchema.get(matched[0])
          else {
            // 如果存在引用进行替换
            const [re, ref] = matched[0].split('\\.#')
            const searched2 = searched.replace(new RegExp(`^${re}`), `#${ref}`)
            return findSchema(flatSchema, searched2, [...stack, searched])
          }
        }
      }

      console.warn('unmatched', searched, stack)

      return null
    }
    const flatSchema = JsonSchema.travel(schema, prop => ({ type: prop.type, value: prop.value }))

    const flatDoc = JsonSchema.flattenObject(doc)

    const flatSlimDoc = new Map()

    flatDoc.forEach((val, key) => {
      const schema = findSchema(flatSchema, key)
      if (schema) {
        if (_.isNumber(val) || _.isBoolean(val) || !_.isEmpty(val)) flatSlimDoc.set(key, val)
        else if (schema.value) flatSlimDoc.set(key, schema.value)
      }
    })

    const slimDoc = {}

    flatSlimDoc.forEach((val, key) => {
      _.set(slimDoc, key.replace('.[', '['), val)
    })

    return slimDoc
  }
}
