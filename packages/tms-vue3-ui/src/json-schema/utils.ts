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

export type SchemaPropAttrs = {
  type: string
  title?: string
  description?: string
  format?: string
}

export type SchemaProp = {
  path: string
  name: string
  attrs: SchemaPropAttrs
}

function walk(
  path: string,
  name: string,
  node: { [k: string]: any },
  result: SchemaProp[]
) {
  let prop: SchemaProp = {
    path,
    name,
    attrs: { type: '' },
  }
  result.push(prop)
  Object.keys(node).forEach((k) => {
    if (/type|title|description|format/.test(k)) {
      Object.assign(prop.attrs, { [k]: node[k] })
    } else if ('properties' === k) {
      Object.keys(node.properties).forEach((k) => {
        walk(`${path ? path + '.' : ''}${name}`, k, node.properties[k], result)
      })
    } else if ('items' === k) {
      walk(`${path ? path + '.' : ''}${name}`, '[]', node.items, result)
    } else if ('enum' === k) {
    } else if ('default' === k) {
    } else if ('dependencies' === k) {
      Object.assign(prop.attrs, { [k]: node[k] })
    }
  })
}

export function flatten(root: { [k: string]: any }): SchemaProp[] {
  let result: SchemaProp[] = []
  walk('', '$', root, result)
  return result
}
