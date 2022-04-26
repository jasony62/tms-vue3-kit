export const Type2Format = {
  string: [
    { value: 'name', label: '姓名' },
    { value: 'email', label: '邮箱' },
    { value: 'mobile', label: '手机' },
    { value: 'dateTime', label: '日期时间' },
  ],
  object: [
    { value: 'file', label: '文件' },
    { value: 'image', label: '图片' },
    { value: 'url', label: '链接' },
    { value: 'score', label: '打分' },
  ],
}

type EnumOptions = {
  label: string
  value: any
}

export type SchemaFieldAttrs = {
  type: string
  title?: string
  description?: string
  format?: string
  required?: boolean
  enum?: EnumOptions[]
  default?: any
}

export type SchemaField = {
  path: string
  name: string
  attrs: SchemaFieldAttrs
  items?: { type: string; [k: string]: any }
}

function walk(
  path: string,
  name: string,
  node: { [k: string]: any },
  stack: SchemaField[],
  required: string[]
) {
  let field: SchemaField = {
    path,
    name,
    attrs: { type: '' },
  }
  field.attrs.required = required?.includes(name) ?? false

  stack.push(field)

  Object.keys(node).forEach((k) => {
    if (/type|title|description|format|enum|default/.test(k)) {
      Object.assign(field.attrs, { [k]: node[k] })
    } else if ('properties' === k) {
      /*对象的子属性*/
      Object.keys(node.properties).forEach((k) => {
        walk(
          `${path ? path + '.' : ''}${name}`,
          k,
          node.properties[k],
          stack,
          node.required
        )
      })
    } else if ('items' === k) {
      field.items = { type: '' }
      /*数组内元素的类型*/
      let { items } = node
      Object.keys(items).forEach((k2) => {
        if (k2 === 'properties') {
          Object.keys(items.properties).forEach((k3) => {
            walk(
              `${path ? path + '.' : ''}${name}.[]`,
              k3,
              items.properties[k3],
              stack,
              []
            )
          })
        } else {
          Object.assign(field.items, { [k2]: items[k2] })
        }
      })
    } else if ('enum' === k) {
    } else if ('default' === k) {
    } else if ('dependencies' === k) {
      Object.assign(field.attrs, { [k]: node[k] })
    }
  })
}

export class FlattenJSONSchema {
  fields: SchemaField[]
  constructor() {
    this.fields = []
  }

  flatten(root: { [k: string]: any }): FlattenJSONSchema {
    this.fields.splice(0, this.fields.length)
    walk('', '$', root, this.fields, root.required)
    return this
  }

  /**获得属性完成的路径名 */
  fieldFullname(field: SchemaField) {
    let fullname
    fullname = field.path ? field.path + '.' : '' + field.name
    return fullname
  }

  /**指定属性下最后一个子节点的索引 */
  getLastChildIndex(field: SchemaField): number {
    let lastIndex = -1
    let fullname = this.fieldFullname(field)
    let child
    for (let i = 0; i < this.fields.length; i++) {
      child = this.fields[i]
      if (child.path.indexOf(fullname) === 0) {
        lastIndex = i
      }
    }

    return lastIndex
  }
  /**
   * 在指定的属性下添加子属性
   */
  addField(parent: SchemaField): SchemaField | boolean {
    let lastIndex = this.getLastChildIndex(parent)
    if (lastIndex !== -1) {
      let newFiled: SchemaField = {
        path: this.fieldFullname(parent),
        name: 'newKey',
        attrs: { type: 'string' },
      }
      this.fields.splice(lastIndex + 1, 0, newFiled)
      return newFiled
    }

    return false
  }
  /**
   * 删除指定的属性
   *
   * 根节点不允许删除
   */
  removeField(field: SchemaField): SchemaField | boolean {
    let childIndex = this.fields.indexOf(field)
    if (childIndex <= 0) return false

    let prev = this.fields[childIndex - 1]
    this.fields.splice(childIndex, 1)

    return prev
  }
}
