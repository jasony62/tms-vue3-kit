# json-doc — 基于 Schema 的文档对象管理

`tms-data-aid` 的 `json-doc` 模块提供将 **JSON 文档对象**（任意嵌套的 object / array）转化为**扁平的属性数组**的能力，便于按"字段"进行操作（追加、删除、排序、重命名等），并可基于 `JSON Schema` 过滤或重新导出文档。

## 导出

```ts
import {
  JSONDocBuilder,        // 用于生成表单渲染节点的构建器（配合 FormContext）
  build,                 // 核心：基于 Schema + 文档生成 VNode 结构
  DocIter,               // 文档对象迭代器
  DocProp,               // 单个属性节点
  DocAsArray,            // 文档 → 属性数组 的操作对象
  DocAsArrayBuildOptions,// build() 方法的参数类型
  createField,           // 创建 Field 对象（配合 json-doc builder 使用）
  Field,                 // 字段类型
} from 'tms-data-aid'
```

## DocAsArray — 文档属性数组

`DocAsArray` 将嵌套对象扁平化，使其可以通过"字段路径"进行操作。

### 构造

```ts
import { DocAsArray } from 'tms-data-aid'

const data = {
  name: 'Alice',
  age: 18,
  address: { city: 'Beijing', zip: '100000' },
  phones: ['110', '119'],
}
const doc = new DocAsArray(data)

// 访问原数据
console.log(doc.rawDoc)     // 原始对象引用
console.log(doc.properties) // 扁平化的 DocProp[]
```

### 读取 / 检查

```ts
doc.get('name')                      // 'Alice'
doc.get('address.city')              // 'Beijing'
doc.get('phones')                    // ['110', '119']
doc.get('phones[0]')                 // '110'

doc.has('address.zip')               // true
doc.has('unknown')                   // false

// 按名称查找属性节点
doc.findByName('address.city')
// => { index: number, prop: DocProp | undefined }

doc.names()                          // [ '', 'name', 'age', 'address', ... ]
```

### 写入

```ts
doc.set('name', 'Bob')                                  // 更新
doc.set('unknown.nested', 123)                          // 自动创建父节点
doc.set('tags', ['admin', 'user'])                      // 写入数组

doc.rename('address.zip', 'postcode')                   // 重命名

doc.appendAt('phones', '120')                           // 数组末尾追加
doc.appendAt('address', { street: 'ChangAn' }, 'street') // 对象追加子属性

doc.insertAt('address.city', { key: 'value' }, 'newKey')// 在同层级插入兄弟

doc.remove('age')                                       // 删除
doc.cleanEmpty()                                        // 清理空值（null/''/[]/{}）
```

### 数组项操作

```ts
doc.moveUp('phones[2]')                                 // 向上交换
doc.moveDown('phones[0]')                               // 向下交换
```

### 根据 Schema 重新导出文档

```ts
import { JSONSchemaBuilder } from 'tms-data-aid'

const rawSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age:  { type: 'number' },
    address: {
      type: 'object',
      properties: {
        city: { type: 'string' },
      },
    },
  },
}

// 只保留 schema 中定义的字段
const cleaned = doc.build({ rawSchema })
// { name: 'Alice', age: 18, address: { city: 'Beijing' } }

// 去除空值
const noEmpty = doc.build({ cleanEmpty: true })

// 以 "title" 作为输出字段名（常用于表格列导出）
doc.build({ useTitleInPath: true })

// 输出扁平键值对（列）
doc.build({ format: 'aoa' })
// [['name', 'Alice'], ['age', 18], ...]
```

### build() 参数

```ts
type DocAsArrayBuildOptions = {
  rawSchema?: RawSchema   // 只输出 schema 中声明的字段
  cleanEmpty?: boolean    // 去除空字符串、空数组、空对象
  format?: 'json' | 'aoa' // 'json' 返回对象；'aoa' 返回二维数组 [key, value][]
  useTitleInPath?: boolean// 用 schema 的 title 作为 key 名
}
```

### 强制重新渲染

```ts
doc.forceRender()     // 将内部 renderCounter +1，外部观察此值触发更新
doc.renderCounter     // { value: number }
```

## DocIter — 文档迭代器

对任意 JSON 对象做深度遍历，以 `DocProp` 形式逐个 yield 节点。

```ts
const iter = new DocIter(data)
for (const prop of iter) {
  console.log(prop.name, '->', prop.value)
}
```

## DocProp — 单个属性节点

| 字段 / 方法 | 类型 | 说明 |
| --- | --- | --- |
| `prop.name` | `string` | 完整路径，如 `'address.city'`, `'phones[0]'` |
| `prop.value` | `any` | 属性当前值 |
| `prop.parent` | `DocProp \| undefined` | 父节点 |
| `prop.getEndProp()` | `DocProp \| undefined` | 返回最后一个后代节点 |
| `prop.removeChild(key)` | — | 删除子节点（含子属性时抛错） |
| `DocProp.parsePathAndKey(name)` | `{ path, key }` | 工具方法 |

## JSONDocBuilder — 表单渲染节点构建器（进阶）

`JSONDocBuilder` 结合 `Schema` + 文档对象 + 外部回调，生成前端可渲染的"字段节点树"，常用于动态表单引擎。

> 这是一个底层 API，使用时需要提供 `FormContext<VNode>`（其中定义了如何将字段转为具体 UI 框架的虚拟节点）。

### 使用示例

```ts
import { JSONDocBuilder, SchemaIter } from 'tms-data-aid'
import h from 'my-ui-framework' // 任意 VNode 工厂

const ctx = {
  h,
  schema: rawSchema,
  editDoc: new DocAsArray(data),
  onMessage: (msg) => console.log(msg),
  // onChange, onLookup, onFileUpload, ...
}

// 一次性生成整棵渲染树
const vnode = JSONDocBuilder(ctx)

// 或分步：先扁平化，再用 build()
import { build } from 'tms-data-aid'
const root = build(ctx)
```

### FormContext 常用字段

| 字段 | 说明 |
| --- | --- |
| `h(type, props?, children?)` | VNode 工厂（如 React.createElement） |
| `schema` | 原始 JSON Schema |
| `editDoc` | 当前文档（`DocAsArray`） |
| `onMessage(msg)` | 信息回调 |
| `onChange(field, value)` | 值变更回调 |
| `onLookup(...)` | 查表 / 外部数据填充 |
| `onFileUpload(fileField, data)` | 文件上传 |
| `onFileSelect(fileField)` | 选择已有文件 |
| `onFileDownload(name, url)` | 文件下载 |
| `nestExpanded: Set<string>` | 控制 object/array 节点是否展开 |
| `hideRootTitle` / `hideFieldDescription` / `showFieldName` / `showFieldFullname` | 展示选项 |
| `placeholderUseFieldDescription` | 以 description 作为 placeholder |
| `activeFieldName` / `activePatternFieldName` | 高亮字段 |

### build() 过程说明

1. 通过 `SchemaIter` 展开 schema 为 `SchemaProp[]`
2. 对每个 `SchemaProp`，定位它在文档树中的父节点，创建对应的 `Field` 节点
3. 对数组项、正则子属性（`patternProperties`）等情况，按文档数据动态生成子节点
4. 通过 `prepareFieldNode` / `createFieldWrapNode` 生成可渲染的 VNode
5. 最后返回根节点 VNode，同时通过 `ctx.fields` 维护字段映射

## 字段类型 Schema 约定

`json-doc` 在遍历时会依赖以下常见 schema 字段（来自 `SchemaProp.attrs`）：

| 字段 | 说明 |
| --- | --- |
| `type` | `string` / `number` / `integer` / `boolean` / `object` / `array` / `json` |
| `title` | 显示名称（label） |
| `description` | 描述文本 |
| `required` | 是否必填 |
| `default` | 默认值（文档中没有对应值时采用） |
| `enum` / `items` | 下拉枚举 / 数组项定义 |
| `oneOf` / `anyOf` | 单选 / 多选 |
| `attrs.format` | 可扩展格式，如 `file`、`markdown`、`json`、`xml`、`handlebars` 等 |
| `patternProperties` | 对象下通过正则匹配的动态字段 |
