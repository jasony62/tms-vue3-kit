# Handlebars / textRender / jsonRender — 模板渲染

`tms-data-aid` 在 Handlebars 之上封装了两类渲染能力：

- **`textRender(template, data, options?)`** — 文本模板
- **`jsonRender(templateJson, data, options?)`** — JSON 对象模板（递归遍历，按路径替换值）

并预置了大量 Helper，覆盖字符串、数组、比较、数学、对象、正则等常见场景。

## 导出

```ts
import {
  Handlebars,    // 已注册大量 Helper 的 handlebars 实例
  textRender,    // 文本模板渲染
  jsonRender,    // JSON 模板渲染
  setDelimiters, // 设置自定义分隔符
} from 'tms-data-aid'
```

## textRender — 文本模板

```ts
const out = await textRender('Hello {{name}}!', { name: 'world' })
// => 'Hello world!'
```

### 选项

```ts
type RewriteOptions = {
  delimiters?: [string, string]  // 自定义分隔符，如 ['<%', '%>']
  reserveDelimiters?: boolean    // 渲染完成后是否保留自定义分隔符（默认 false，会 reset）
}
```

### 自定义分隔符

```ts
await textRender('Hello <%name%>!', { name: 'world' }, {
  delimiters: ['<%', '%>'],
})
```

### JSON 字符串模板 → 对象

当模板**整体**形如 `{{ ... }}` 或 `{{{ ... }}}` 且内容为 JSON 字符串时，返回值会被解析为对象：

```ts
await textRender('{{{JSONstringify payload}}}', {
  payload: { a: 1, b: 2 },
})
// => { a: 1, b: 2 }
```

## jsonRender — JSON 对象模板

将任意 JSON 对象作为"模板"，递归遍历：

- 字符串中如果含有 `{{ expr }}` 片段，会被渲染
- 对象 / 数组 结构保持不变

```ts
const tpl = {
  greeting: 'Hello {{name}}',
  items:    [{ id: '{{index}}', name: 'item {{index}}' }],
  raw:      '{{JSONLiteral obj}}',   // 作为原生值（不转义）
}

const out = await jsonRender(tpl, {
  name: 'world',
  index: 1,
  obj:  { x: 1, y: 2 },
})

// => {
//      greeting: 'Hello world',
//      items: [ { id: '1', name: 'item 1' } ],
//      raw:   { x: 1, y: 2 },
//    }
```

### 批量数据

当上下文为数组时，对每条数据分别应用模板，返回数组：

```ts
await jsonRender({ id: '{{i}}', name: '{{n}}' }, [
  { i: 1, n: 'a' },
  { i: 2, n: 'b' },
])
// => [ { id: '1', name: 'a' }, { id: '2', name: 'b' } ]
```

## Helper 总览

### 字符串 `helpers/string.ts`

| Helper | 示例 | 输出 |
| --- | --- | --- |
| `append str suffix` | `{{append "foo" ".html"}}` | `foo.html` |
| `camelcase` | `{{camelcase "foo bar baz"}}` | `fooBarBaz` |
| `capitalize` / `capitalizeAll` | `{{capitalize "hello world"}}` | `Hello world` |
| `chop` | `{{chop "-abc-"}}` | `abc` |
| `dashcase` | `{{dashcase "a b_c"}}` | `a-b-c` |
| `dotcase` | `{{dotcase "a-b c"}}` | `a.b.c` |
| `downcase` / `lowercase` | `{{lowercase "FOO"}}` | `foo` |
| `ellipsis str len` | `{{ellipsis "hello world", 7}}` | `hello w…` |
| `hyphenate` | `{{hyphenate "foo bar"}}` | `foo-bar` |
| `isString` | `{{isString "abc"}}` | `true` |
| `occurrences str sub` | `{{occurrences "ababa" "a"}}` | `3` |
| `pascalcase` | `{{pascalcase "foo bar"}}` | `FooBar` |
| `pathcase` | `{{pathcase "a-b c"}}` | `a/b/c` |
| `plusify` / `replace` / `replaceFirst` | `{{replace "a b a" "a" "z"}}` | `z b z` |
| `prepend str prefix` | `{{prepend "bar" "foo-"}}` | `foo-bar` |
| `reverse` | `{{reverse "abc"}}` | `cba` |
| `split str ch` | `{{split "a,b,c" ","}}` | `["a","b","c"]` |
| `startsWith prefix str` (block) | `{{#startsWith "H" "Hello"}}yes{{else}}no{{/startsWith}}` | `yes` |
| `titleize` | `{{titleize "hello world"}}` | `Hello World` |
| `trim` / `trimLeft` / `trimRight` | — | — |
| `truncate str len [suffix]` | `{{truncate "12345" 3}}` | `123` |
| `truncateWords str n` | `{{truncateWords "a b c" 2}}` | `a b…` |
| `uppercase` / `upcase` | — | — |
| `raw` (block) | `{{{{#raw}}}}{{x}}{{{{/raw}}}}` | 保留原始 `{{x}}` |

### 数组 `helpers/array.ts`

| Helper | 示例 |
| --- | --- |
| `after arr n` / `before arr n` | `{{after [1,2,3] 1}}` → `[2,3]` |
| `arrayify v` | `{{arrayify "foo"}}` → `["foo"]` |
| `eachIndex arr` (block) | 遍历数组，子上下文中有 `item` / `index` |
| `forEach arr` (block) | 暴露 `isFirst` / `isLast` / `index` / `total` |
| `filter arr value [property=…]` (block) | 过滤后渲染 |
| `first arr [n]` / `last arr [n]` | — |
| `itemAt arr idx` | `{{itemAt [1,2,3] 1}}` → `2` |
| `join arr [sep]` | `{{join [1,2,3] "-"}}` → `1-2-3` |
| `length x` / `equalsLength v n` | — |
| `map arr fn` / `pluck arr prop` | `{{pluck users "email"}}` |
| `reverse` (对数组) | — |
| `some arr fn` (block) | 数组存在元素满足 fn 时渲染 |
| `sort` / `sortBy arr prop` | — |
| `withAfter` / `withBefore` / `withFirst` / `withLast` / `withSort` / `withGroup` | (block) 以切片/排序后的数组为上下文渲染 |
| `unique arr` | `{{unique [1,2,1,3]}}` → `[1,2,3]` |

### 比较 `helpers/comparison.ts`

| Helper | 示例 |
| --- | --- |
| `and a b ...` (block) | 全部 truthy 才渲染 |
| `compare a op b` (block) | `{{#compare a ">" b}}yes{{/compare}}`，支持 `== === != !== < > <= >= typeof` |
| `contains collection value [startIndex]` (block) | — |
| `default a b ...` | 返回第一个非空值 |
| `eq / gt / gte / lt / lte / isnt` | `{{#eq a b}}yes{{/eq}}` |
| `isFalsey / isTruthy` | — |
| `ifEven / ifOdd` (block) | — |
| `ifNth a b` (block) | `b % a === 0` 时渲染 |
| `neither a b` / `not a` / `or a b ...` | — |
| `unlessEq / unlessGt / unlessLt / unlessGteq / unlessLteq` | 相反条件的 block helper |

### 数字 `helpers/number.ts`

提供数字格式化 / 解析 / 千分位等 Helper，例如：

```handlebars
{{formatNumber 1234.5}}
{{toFixed 3.1415 2}}
{{parseInt "42"}}
```

### 数学 `helpers/math.ts`

```handlebars
{{add 1 2}}      {{sub 5 2}}
{{multiply 3 4}} {{divide 10 2}}
{{ceil 2.1}}     {{floor 2.9}}    {{round 2.5}}
{{abs -3}}       {{mod 10 3}}     {{pow 2 10}}
{{min 3 1 2}}    {{max 3 1 2}}
{{avg [1 2 3]}}  {{sum [1 2 3]}}
```

### 对象 `helpers/object.ts`

```handlebars
{{keys obj}}        {{values obj}}
{{has obj "field"}} {{get obj "nested.field"}}
{{isEmpty obj}}     {{size obj}}
```

### 正则 `helpers/regex.ts`

```handlebars
{{test "abc123" "^[a-z]+\\d+$"}}
{{match "foo bar baz" "\\w+"}}
{{replace "hello" "l+" "L"}}
```

## 特殊 Helper

### `JSONLiteral`

将值序列化后，在 `jsonRender` 会被反序列化为原值。适用于需要在 JSON 模板中嵌入"原始对象"的场景：

```handlebars
{{JSONLiteral payload}}
```

## 直接使用 Handlebars

`Handlebars` 是已注册全部 Helper 的实例，可自由使用：

```ts
import { Handlebars } from 'tms-data-aid'

Handlebars.registerHelper('myHelper', (v) => ...)
const tpl = Handlebars.compile('{{myHelper x}}')
tpl({ x: 1 })
```

## setDelimiters — 临时自定义分隔符

```ts
import { Handlebars, setDelimiters } from 'tms-data-aid'

// 使用后记得恢复
setDelimiters(Handlebars, ['<%', '%>'])
// ... 编译模板 ...
// resetDelimiters(Handlebars) // 在 textRender/jsonRender 的 reserveDelimiters=false 时自动处理
```
