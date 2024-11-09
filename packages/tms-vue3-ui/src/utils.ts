// import _ from 'lodash'
import JSONPointer from 'jsonpointer'

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
  static travel(
    schema: any,
    schemaCallback: Function,
    schemaPath: any[] = [],
    flatted = new Map()
  ) {
    if (schemaPath.length)
      flatted.set(
        schemaPath.join(RE_SEPARATOR),
        typeof schemaCallback === 'function'
          ? schemaCallback(schema, schemaPath)
          : schema
      )

    if (schema.$ref) {
      // nothing
    } else if (schema.type === 'object') {
      if (schema.properties && typeof schema.properties === 'object') {
        if (schema.$id) {
          JsonSchema.travel(
            { $ref: schema.$id },
            schemaCallback,
            [...schemaPath, schema.$id],
            flatted
          )
          Object.entries(schema.properties).forEach(([subKey, subSchema]) =>
            JsonSchema.travel(
              subSchema,
              schemaCallback,
              [schema.$id, subKey],
              flatted
            )
          )
        } else
          Object.entries(schema.properties).forEach(([subKey, subSchema]) =>
            JsonSchema.travel(
              subSchema,
              schemaCallback,
              [...schemaPath, subKey],
              flatted
            )
          )
      } else if (schema.items && typeof schema.items === 'object') {
        if (schema.items.$ref) {
          JsonSchema.travel(
            schema.items,
            schemaCallback,
            [...schemaPath, RE_OBJECT_FIELD, schema.items.$ref],
            flatted
          )
        } else {
          JsonSchema.travel(
            schema.items,
            schemaCallback,
            [...schemaPath, RE_OBJECT_FIELD],
            flatted
          )
        }
      }
    } else if (schema.type === 'array') {
      if (schema.items && typeof schema.items === 'object') {
        if (schema.items.$ref) {
          JsonSchema.travel(
            schema.items,
            schemaCallback,
            [...schemaPath, RE_ARRAY_INDEX, schema.items.$ref],
            flatted
          )
        } else {
          JsonSchema.travel(
            schema.items,
            schemaCallback,
            [...schemaPath, RE_ARRAY_INDEX],
            flatted
          )
        }
      }
    }

    return flatted
  }
  /**
   *
   */
  static flattenObject(
    obj: unknown,
    propPath: string[] = [],
    flatted = new Map()
  ) {
    if (Array.isArray(obj)) {
      if (obj.length)
        obj.forEach((val, index) =>
          JsonSchema.flattenObject(val, [...propPath, `[${index}]`], flatted)
        )
      else flatted.set(propPath.join('.'), obj)
    } else if (typeof obj === 'object' && obj !== null) {
      if (Object.keys(obj).length)
        Object.entries(obj).forEach(([prop, val]) =>
          JsonSchema.flattenObject(val, [...propPath, prop], flatted)
        )
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
  static slim(schema: any, doc: any) {
    function findSchema(
      flatSchema: any,
      searched: any,
      stack: string[] = []
    ): any {
      // 直接匹配
      if (flatSchema.has(searched)) return flatSchema.get(searched)

      // 正则匹配
      const matched = [...flatSchema.keys()].filter((key) => {
        const key2 = key.match('\\.#')
          ? `${key.split('\\.#')[0]}\\.`
          : `${key}$`
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

    const flatSchema = JsonSchema.travel(
      schema,
      (prop: { type: any; value: any }) => ({
        type: prop.type,
        value: prop.value,
      })
    )

    const flatDoc = JsonSchema.flattenObject(doc)

    const flatSlimDoc = new Map()

    flatDoc.forEach((val, key) => {
      const schema = findSchema(flatSchema, key)
      if (schema) {
        if (
          typeof val === 'number' ||
          typeof val === 'boolean' ||
          !(
            val == null ||
            val === undefined ||
            val === '' ||
            (Array.isArray(val) && val.length === 0)
          )
        )
          flatSlimDoc.set(key, val)
        else if (schema.value) flatSlimDoc.set(key, schema.value)
      }
    })

    const slimDoc = {}

    flatSlimDoc.forEach((val, key) => {
      // _.set(slimDoc, key.replace('.[', '['), val)
      JSONPointer.set(
        slimDoc,
        key.replace(/\.\[(\d+)\]/, '/$1').replace('.', '/'),
        val
      )
    })

    return slimDoc
  }
}

export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function formatVal(val: string | number) {
  return Number(val) < 10 ? '0' + val : '' + val
}

export function getNowTime() {
  const nowtime = new Date()
  const year = nowtime.getFullYear()
  const month = formatVal(nowtime.getMonth() + 1)
  const date = formatVal(nowtime.getDate())
  const hour = formatVal(nowtime.getHours())
  const minute = formatVal(nowtime.getMinutes())
  const seconds = formatVal(nowtime.getSeconds())

  return `${year}-${month}-${date} ${hour}:${minute}:${seconds}`
}
