# json-schema — JSON Schema 操作工具

`tms-data-aid` 的 `json-schema` 模块提供了 `JSONSchemaBuilder`、`SchemaIter` 等用于构造、遍历和操作 JSON Schema 的工具。

## 导出

```ts
import {
  JSONSchemaBuilder,      // 构造/操作 JSON Schema
  SchemaIter,             // 迭代器
  SchemaProp,             // 属性对象
  RawSchema,              // Schema 数据类型
  DEFAULT_ROOT_NAME,      // 根节点默认名
} from 'tms-data-aid'
```

## JSONSchemaBuilder — Schema 构造器

`JSONSchemaBuilder` 以数组形式在内部维护 Schema 的属性节点，提供增/删/改/查/排序等操作。

### 构造

```ts
const builder = new JSONSchemaBuilder(rootName = '')
```

### flatten / unflatten — 将 Schema 对象转为数组 / 转回对象

```ts
const schema = {
  type: 'object',
  title: 'User',
  properties: {
    name: { type: 'string', title: '姓名' },
    age:  { type: 'number', title: '年龄' },
  },
}

builder.flatten(schema)
console.log(builder.props.map((p) => p.fullname))
// [ '', 'name', 'age' ]

// 转回 JSON 对象
const obj = builder.unflatten()
// { type: 'object', title: 'User', properties: { name: {...}, age: {...} } }
```

### 获取属性

| 方法 | 说明 |
| --- | --- |
| `builder.get(fullname)` | 按完整路径返回匹配的 `SchemaProp` |
| `builder.getParent(prop)` | 返回父属性 |
| `builder.getIndex(prop)` | 返回属性在数组中的索引 |
| `builder.getEndIndex(prop)` | 返回该属性最后一个后代的索引（或 -1） |
| `builder.getPrevSiblingIndex(prop)` | 返回前一个兄弟属性的索引 |
| `builder.getNextSiblingIndex(prop)` | 返回后一个兄弟属性的索引 |

### 新增属性

| 方法 | 说明 |
| --- | --- |
| `builder.addProp(parent, type?)` | 在 `parent` 对象下添加一个子属性；若父属性为数组则子项的 `path = parent.fullname + '[*]'`；`type` 可选值 `"properties"`（默认）或 `"patternProperties"` |
| `builder.addJSONSchema(parent, rawSchema)` | 将一个完整的 Schema 作为 `parent` 的子定义注入 |
| `builder.addPropBefore(sibling)` | 在 `sibling` 之前插入兄弟属性 |
| `builder.addPropAfter(sibling)` | 在 `sibling` 之后插入兄弟属性 |

### 删除 / 移动

| 方法 | 说明 |
| --- | --- |
| `builder.removeProp(prop)` | 删除属性（不允许删除根节点） |
| `builder.moveUp(prop)` | 向前移动一个属性位置（与兄弟交换） |
| `builder.moveDown(prop)` | 向后移动一个属性位置 |

### 判断

| 方法 | 说明 |
| --- | --- |
| `builder.canAddBefore(prop)` | 是否可以在之前添加兄弟 |
| `builder.canAddAfter(prop)` | 是否可以在之后添加兄弟 |
| `builder.canMoveUp(prop)` | 是否可以向前移动 |
| `builder.canMoveDown(prop)` | 是否可以向后移动 |
| `builder.canRemove(prop)` | 是否可以删除（非根节点且无后代） |
| `builder.canAddJSONSchema(prop)` | 是否可以在该属性下插入一个完整的子 Schema（必须是 object 或数组子项为 object，且没有后代） |

### 完整示例

```ts
import { JSONSchemaBuilder } from 'tms-data-aid'

const rawSchema = {
  type: 'object',
  title: '订单',
  properties: {
    id:    { type: 'string', title: '编号' },
    total: { type: 'number', title: '总金额' },
  },
}

const builder = new JSONSchemaBuilder()
builder.flatten(rawSchema)

const idProp = builder.get('id')
builder.addPropAfter(idProp)     // 在 id 后插入一个新属性
builder.moveDown(builder.get('total')) // 向后移动
// ...
const result = builder.unflatten()
console.log(result)
```

## SchemaProp — 属性节点

`SchemaProp` 是迭代器遍历 Schema 后产生的节点对象，包含属性自身的数据、父子关系、以及一些类型判断。

### 关键字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `attrs` | `SchemaPropAttrs` | 属性自身的定义，如 `{ type, title, description, required, enum, ... }` |
| `items` | `object` | 当属性为 `array` 时，数组项的定义 |
| `lookup` | `any` | 外部查询规则 |
| `attachment` | `any` | 附加信息 |
| `existIf` | `ExistIfRuleSet` | 属性存在条件 |
| `isPattern` | `boolean` | 是否是 `patternProperties` 定义的子属性 |
| `children` | `SchemaProp[]` | 子属性 |
| `path` | `string` | 父节点完整路径（根据父节点动态计算） |
| `name` | `string` | 属性在父节点中的 name |
| `fullname` | `string` | 完整名称，形如 `""`, `"name"`, `"user.addresses[*].city"` |
| `fullRegExp` | `RegExp` | 与文档属性匹配的正则，例如 `items` 为普通类型时 `arr[0]` 也能匹配 |

### 判断与展示

| getter | 说明 |
| --- | --- |
| `prop.isArrayItem` | 父节点是否为数组（路径以 `[*]` 结尾） |
| `prop.isSingleValue` | 非 `pattern` 且非 `array` 类型 → 单值 |
| `prop.isFullSingleValue` | 沿父节点链全部为单值 |
| `prop.isLeaf` | 是否是叶子（非 object 类型；或数组但子项非 object / 非 array） |
| `prop.title` | 展示标题（或回退到 `name`） |
| `prop.fullTitle` | 完整标题路径，如 `"user.addresses[*].city"` |

### readableValue — 以人类可读形式展示值

```ts
// 对于 enum / oneOf / anyOf 自动转换为 label
prop.readableValue('F', { F: '女', M: '男' })  // '女'
prop.readableValue('F')                        // 从 attrs.enum 中查找
```

## SchemaIter — 迭代器

```ts
for (const prop of new SchemaIter(rawSchema)) {
  console.log(prop.fullname, prop.attrs.type)
}
```

遍历时会自动展开 `properties`、`patternProperties`、`array.items` 等嵌套结构，每个节点对应一个 `SchemaProp`。

## 存在条件 existIf

在 Schema 中可以声明属性存在的条件，`json-doc` 会在渲染时根据此规则剔除属性。

```ts
{
  "type": "object",
  "properties": {
    "age": { "type": "number", "title": "年龄" },
    "guardian": {
      "type": "string",
      "title": "监护人",
      "existIf": {
        "properties": { "age": { "const": null } },
      },
    },
  },
}
```

支持的规则：

```ts
{
  properties: { age: { const: 18 } },   // age 等于 18
  properties: { age: { valid: true } }, // age 不为 null/undefined/''
  allOf: [ ... ],
  oneOf: [ ... ],
}
```

## `Type2Format` — 常用格式映射

定义了 string 类型常用的格式列表，供 UI 展示时使用：

| type | formats |
| --- | --- |
| `string` | `name`, `email`, `mobile`, `dateTime`, `longtext`, `password`, `idcard`, `handlebars`, `markdown`, `xml`, `yaml` |
| `object` | `file`, `image`, `url`, `score` |
