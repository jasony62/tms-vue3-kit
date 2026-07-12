# tms-data-aid 文档

通用 JSON 数据处理工具包，封装了多种常用的数据处理能力，包括：

| 模块 | 说明 | 入口文件 |
| --- | --- | --- |
| [json-doc](./docs/json-doc.md) | 基于 JSON Schema 管理文档对象，提供 `DocAsArray`、`DocIter` 等 | `src/json-doc` |
| [json-schema](./docs/json-schema.md) | 操作 JSON Schema，支持属性的增、删、排序、合并等 | `src/json-schema` |
| [Handlebars / textRender / jsonRender](./docs/handlebars.md) | 模板渲染（文本 + JSON），内置丰富 Helper | `src/handlebars` |
| [Jexl](./docs/jexl.md) | JSON Expression Language，支持自定义 transforms / functions | `src/jexl` |
| [JsonLogic](./docs/json-logic.md) | 基于 JSON 的规则引擎，支持自定义操作符 | `src/json-logic-js` |
| [JSONPointer](./docs/jsonpointer.md) | RFC 6901 JSON Pointer，及 lodash 风格路径 | `src/jsonpointer` |

## 安装 & 使用

```bash
npm install tms-data-aid
# 或
pnpm add tms-data-aid
```

```ts
import {
  JSONSchemaBuilder,
  SchemaProp,
  JSONDocBuilder,
  DocAsArray,
  Jexl,
  JsonLogic,
  Handlebars,
  textRender,
  jsonRender,
  JSONPointer,
  JSONPointerLodash,
} from 'tms-data-aid'
```

## 依赖的外部库

- [`handlebars`](https://github.com/handlebars-lang/handlebars.js) — 模板引擎
- [`jexl`](https://github.com/TomFrost/jexl) — JSON Expression Language
- [`json-logic-js`](https://github.com/jwadhams/json-logic-js) — JSON 规则引擎
- [`jsonpointer`](https://github.com/manuelstofer/json-pointer) — RFC 6901
- [`es-toolkit`](https://github.com/toss/es-toolkit) — lodash 兼容的高性能工具
