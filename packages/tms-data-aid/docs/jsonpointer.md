# JSONPointer — 字段路径访问

基于 [jsonpointer](https://github.com/manuelstofer/json-pointer)（RFC 6901），提供两种风格：

- **`JSONPointer`**：RFC 6901 路径，如 `/foo/0/bar`
- **`JSONPointerLodash`**：lodash 风格，如 `user.addresses[0].city`

## 导出

```ts
import { JSONPointer, JSONPointerLodash } from 'tms-data-aid'
```

## JSONPointer（RFC 6901）

```ts
const data = {
  user: { name: 'Alice' },
  tags: ['admin', 'user'],
}

// 读取
JSONPointer.get(data, '/user/name')        // 'Alice'
JSONPointer.get(data, '/tags/0')           // 'admin'
JSONPointer.get(data, '/not/exist')        // undefined

// 写入
JSONPointer.set(data, '/user/age', 20)     // data.user.age = 20
JSONPointer.set(data, '/tags/-', 'dev')    // tags.push('dev')

// 编译（避免重复解析路径）
const p = JSONPointer.compile('/user/name')
p.get(data)  // 'Alice'
p.set(data, 'Bob')

// 删除
JSONPointer.remove(data, '/tags/0')
```

## JSONPointerLodash（lodash 风格路径）

目前仅暴露 `set`：

```ts
JSONPointerLodash.set(data, 'user.addresses[0].city', 'Beijing')
// 等价于 es-toolkit 的 set(data, 'user.addresses[0].city', 'Beijing')
```

> 底层使用 `es-toolkit/compat` 的 `set` 实现，因此路径支持：
> - `a.b.c`
> - `a[0].b`
> - `a.0.b`
> - `a["b"].c`

## 何时使用哪种？

| 场景 | 推荐 |
| --- | --- |
| 与 OpenAPI / JSON Patch 等标准对接 | `JSONPointer` |
| 前端动态字段名、代码中常见的 JS 路径表达 | `JSONPointerLodash.set()` |

## 示例：配合 DocAsArray

```ts
import { DocAsArray, JSONPointerLodash } from 'tms-data-aid'

const doc = new DocAsArray({ user: { name: 'Alice' } })

JSONPointerLodash.set(doc.rawDoc, 'user.age', 20)
doc.set('user.age', 20) // 与上面等价
```
