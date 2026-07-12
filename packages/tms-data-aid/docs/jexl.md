# Jexl — JSON Expression Language

在 [jexl](https://github.com/TomFrost/jexl) 基础上补充了大量常用 transform / function / binary operator，便于在 JSON 数据上进行计算、筛选、变换。

## 导出

```ts
import { Jexl } from 'tms-data-aid'

Jexl.eval('1 + 2').then(console.log)     // 3
Jexl.evalSync('users | length')          // 同步版本（若可用）
```

## 语法速览

- 字面量：`1`, `true`, `"str"`, `[1,2,3]`, `{a:1, b:2}`
- 属性访问：`user.name`, `user["address"]`
- 数组索引：`arr[0]`, `arr[0:5]`（切片）
- 比较：`== != > >= < <=`
- 逻辑：`&& || !`
- 条件：`if (cond) a else b`
- Transform：`value | transform(arg, ...)`
- Function：`fn(arg, ...)`
- 自定义二元算符：通过 `addBinaryOp` 扩展

## 内置 Transforms

| Transform | 说明 | 示例 |
| --- | --- | --- |
| `keys` | 返回对象 key 数组 | `{a:1,b:2} \| keys` → `["a","b"]` |
| `values` | 返回对象 value 数组 | — |
| `length` | 长度（null/undefined 为 0） | `arr \| length` |
| `parseInt` | 字符串 → 数字（可作用于数组） | `"42" \| parseInt` |
| `parseFloat` | 同上（浮点） | — |
| `JSONParse` | 将 JSON 字符串解析为对象 | `"\{\"a\":1\}" \| JSONParse` |
| `sum` / `max` / `min` / `avg` / `reduce` | 数组聚合 | `[1,2,3] \| sum` → `6` |
| `toFix(n)` | 保留 n 位小数（返回字符串形式数字） | `3.1415 \| toFix(2)` → `"3.14"` |
| `pluck(prop)` | 对象数组按属性抽取 | `users \| pluck("name")` |
| `dict(keyName)` | 数组转字典 | `[{k:"a",v:1}] \| dict("k")` → `{"a":{...}}` |
| `merge(obj)` | 深度合并（有子则合并，无则赋值） | `state \| merge({x:1})` |
| `querySearch` | `?a=1&b=2` → 对象 | `"?a=1&b=2" \| querySearch` |
| `replace(re, replacement, flags?)` | 正则替换 | `"foo" \| replace("o", "0")` |

## 内置 Functions

| Function | 说明 |
| --- | --- |
| `padRightToLength(arr, maxLen, padChar)` | 数组右填充到 `maxLen`，填充值为 `padChar` |
| `arrayLength(arr)` | 数组长度（null/undefined → 0） |
| `push(arr, ...items)` | 在数组末尾追加元素，返回数组 |
| `arrayAutoFill(arr, name, defaultValue)` | 遍历数组：当 `row[name]` 为空时用"上一个有效值"或 `defaultValue` 填充；遇到非空值则更新"上一个有效值" |
| `arrayAutoMerge(arr, name)` | 反向：相邻重复时删除后继字段，用于"稀疏展示" |

## 自定义 Binary Operator

| Operator | 优先级 | 含义 |
| --- | --- | --- |
| `nin` | `1` | `item nin arr` — 不在数组中 |

示例：

```
"admin" nin users.roles
```

## 示例

```ts
const ctx = {
  users: [
    { name: 'Alice', age: 20, role: 'admin' },
    { name: 'Bob',   age: 17, role: 'user'  },
    { name: 'Carol', age: 30, role: 'user'  },
  ],
  search: '?name=alice&role=admin',
}

Jexl.eval('users | pluck("name")', ctx)
// ['Alice','Bob','Carol']

Jexl.eval('users | pluck("age") | sum', ctx)
// 67

Jexl.eval('users | dict("name")', ctx)
// { Alice: {...}, Bob: {...}, Carol: {...} }

Jexl.eval('search | querySearch', ctx)
// { name: 'alice', role: 'admin' }

Jexl.eval('"hello" | replace("l", "L")', ctx)
// "heLLo"
```

## 自定义 Transform / Function

```ts
import { Jexl } from 'tms-data-aid'

Jexl.addTransform('upper', (v: string) => v.toUpperCase())
Jexl.addFunction('hello', (name: string) => `Hello, ${name}`)
Jexl.addBinaryOp('like', 5, (a: string, b: string) =>
  new RegExp(b, 'i').test(a),
)

Jexl.eval('name | upper', { name: 'Alice' })       // 'ALICE'
Jexl.eval('hello(name)',   { name: 'Alice' })       // 'Hello, Alice'
Jexl.eval('"Alice" like "^a"')                       // true
```
