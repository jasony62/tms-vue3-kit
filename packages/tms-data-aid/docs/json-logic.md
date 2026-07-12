# JsonLogic — 基于 JSON 的规则引擎

在 [json-logic-js](https://github.com/jwadhams/json-logic-js) 之上增加了少量常用自定义操作符，适合在"规则 / 表单校验 / 字段可见性"等场景中使用。

## 导出

```ts
import { JsonLogic } from 'tms-data-aid'

JsonLogic.apply(rule, data)
```

## 基本用法

```ts
const rule = { if: [ { '>': [{ var: 'age' }, 18] }, 'adult', 'minor' ] }

JsonLogic.apply(rule, { age: 20 })  // 'adult'
```

常用运算符（来自 `json-logic-js` 原生）：

- 比较：`==`, `===`, `!=`, `!==`, `>`, `>=`, `<`, `<=`
- 逻辑：`and`, `or`, `!`
- 算术：`+`, `-`, `*`, `/`, `%`
- 字符串：`cat`, `substr`
- 数组：`in`, `map`, `reduce`, `filter`, `all`, `some`, `merge`
- 三元：`if`
- 变量：`{ var: 'path.to.key' }` 或 `{ var: ['path.to.key', 'default'] }`

完整语法参考：[json-logic-js docs](http://jsonlogic.com/)

## 自定义操作符

### `isValidUrl` — URL 校验

```ts
JsonLogic.apply(
  { isValidUrl: 'https://example.com/a?x=1' },
  null,
)  // true
```

### `stringMatch` — 正则匹配

```ts
JsonLogic.apply(
  { stringMatch: ['Hello TMS-DATA-AID', 'tms-data-aid', 'i'] },
  null,
)  // true (忽略大小写)
```

参数：`{ stringMatch: [input, pattern, flags?] }`

### `arange` — 生成连续整数数组

```ts
JsonLogic.apply({ arange: [0, 5] },    null)  // [0,1,2,3,4]
JsonLogic.apply({ arange: [3, 20, 5] }, null) // [3, 8, 13, 18]
```

## 示例：表单校验

```ts
const form = {
  email: 'a@b.com',
  url:   'https://example.com',
  age:   20,
}

const rule = {
  and: [
    { '!=': [{ var: 'email' }, ''] },
    { isValidUrl: [{ var: 'url' }] },
    { '>=': [{ var: 'age' }, 18] },
    { stringMatch: [{ var: 'email' }, '@', ''] },
  ],
}

JsonLogic.apply(rule, form)  // true
```

## 注册自己的操作符

```ts
import { JsonLogic } from 'tms-data-aid'

JsonLogic.add_operation('between', (value, [a, b]) => value >= a && value <= b)

JsonLogic.apply({ between: [{ var: 'x' }, [0, 10]] }, { x: 7 }) // true
```
