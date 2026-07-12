# JsonSchema Schema 编辑器

一个可视化编辑 **JSON Schema** 的组件。支持为 schema 添加属性、配置属性类型、
设置默认值、选择列表、属性依赖等。

## 注册

```ts
import { createApp } from 'vue'
import { JsonSchema } from 'tms-vue3-ui'

const app = createApp(App)
app.use(JsonSchema.install) // 注册为 <tms-json-schema />
app.mount('#app')
```

样式：

```ts
import 'tms-vue3-ui/dist/es/json-schema/style/json-schema.css'
```

## 基本用法

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { JSONSchemaBuilder } from 'tms-vue3-ui'

const schemaEditor = ref<{ editing: () => object } | null>(null)

// 初始 schema（为空则新建一个空 schema）
const schema = ref({
  type: 'object',
  properties: {},
})

onMounted(() => {
  // 使用 JSONSchemaBuilder 构造复杂 schema
  const builder = new JSONSchemaBuilder()
  builder.addProp('name', { type: 'string' })
  builder.addProp('age', { type: 'number' })
  schema.value = builder.schema
})

// 获取最终 schema
const getResult = () => {
  const result = schemaEditor.value?.editing()
  console.log('当前 schema', result)
}
</script>

<template>
  <tms-json-schema ref="schemaEditor" :schema="schema" />
  <button @click="getResult">查看结果</button>
</template>
```

## Props

| 属性              | 类型             | 默认值 | 说明                         |
| ----------------- | ---------------- | ------ | ---------------------------- |
| `schema`          | Object           | —      | 初始 JSON Schema             |
| `onUpload`        | Function         | —      | 文件上传回调（上传图标等）  |
| `onMessage`       | Function         | —      | 文本消息回调                 |
| `onPaste`         | Function         | —      | 粘贴数据的回调（接收 SchemaProp） |

## Slots

| 名称          | 说明                                 |
| ------------- | ------------------------------------ |
| `extattrs`    | 扩展属性区（`attrs` 中可放自定义配置） |

## 支持的属性类型

| 类型      | 说明                           |
| --------- | ------------------------------ |
| `string`  | 字符串                          |
| `number`  | 数字                            |
| `integer` | 整数                            |
| `boolean` | 布尔                            |
| `object`  | 对象（支持嵌套子属性、patternProperties）|
| `array`   | 数组（items 类型可选）          |
| `null`    | null                           |
| `*`        | 自动推断（根据 default 推断）   |

## 常用扩展属性

| 属性             | 说明                         |
| ---------------- | --------------------------- |
| `title`          | 显示名                       |
| `description`    | 描述                         |
| `default`        | 默认值                       |
| `enum`           | 枚举可选值                   |
| `oneOf`          | 单选枚举值                   |
| `readOnly`       | 是否只读                     |
| `minItems / maxItems` | 数组最小/最大元素数      |
| `minLength / maxLength` | 字符串最小/最大长度    |
| `minimum / maximum` | 数字最小/最大值           |
| `format`         | 扩展格式化（email/uri 等）   |

## 返回 schema

调用组件的 `editing()` 方法可获取当前正在编辑的 schema 对象：

```ts
const currentSchema = schemaEditor.value?.editing()
// => { type: 'object', properties: { ... } }
```

## 导入的类型

从 `tms-vue3-ui` 导出的常用类型（这些类型在底层实际来自 `tms-data-aid`）：

- `JSONSchemaBuilder` — 快速构建一个基础 schema
- `SchemaProp` — 单个属性对象的类型描述
- `SchemaIter` — schema 的迭代器

```ts
import { JSONSchemaBuilder, SchemaProp } from 'tms-vue3-ui'

const builder = new JSONSchemaBuilder()
builder.addProp('name', { type: 'string', title: '姓名' })
builder.addProp('age', { type: 'integer', title: '年龄' })

const schema = builder.schema
```

## 修改默认样式

组件默认样式通过以 `.tvu-jse` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/json-schema/style/json-schema.css` 中定义，
使用了 Tailwind 的 utility class（如 `p-2`, `flex`, `flex-row` 等）。

关键 CSS 类：

| 类名                              | 作用                                    |
| --------------------------------- | --------------------------------------- |
| `.tvu-jse.tvu-jse--layout-default` | 根容器（左侧属性 + 中间字段 + 右侧依赖）|
| `.tvu-jse__properties`            | 左侧属性列表区                          |
| `.tvu-jse__property`              | 单个属性项                              |
| `.tvu-jse__property--active`      | 当前选中的属性                          |
| `.tvu-jse__property--highlight`   | 高亮属性                                |
| `.tvu-jse__property__actions`     | 属性操作区（添加 / 删除等按钮）       |
| `.tvu-jse__property-fields`       | 中间字段编辑区                          |
| `.tvu-jse__field`                 | 单字段编辑容器                          |
| `.tvu-jse__field input, .tvu-jse__field select, .tvu-jse__field textarea` | 表单输入控件 |
| `.tvu-jse__checkbox`              | 复选框容器                              |
| `.tvu-jse__upload`                | 文件上传区                              |
| `.tvu-jse__file-attrs`            | 文件属性编辑区                          |
| `.tvu-jse__field--json`           | JSON 类型的字段（textarea）           |
| `.tvu-jse__form__actions`         | 表单底部按钮区                          |
| `.tvu-jse__enum-config`           | 枚举配置区                              |
| `.tvu-jse__enum-groups / .tvu-jse__enum-group` | 枚举分组 |
| `.tvu-jse__enum-options / .tvu-jse__enum-option` | 枚举选项   |
| `.tvu-jse__dependencies`          | 属性依赖区                              |
| `.tvu-jse__dependencies__rule-group` | 依赖规则分组                    |
| `.tvu-jse__dependencies__rule`    | 单条依赖规则                            |
| `.tvu-jse__dependencies__rule-group-actions` | 依赖操作按钮区              |
| `.tvu-jse__event-config`          | 事件配置区                              |

覆盖示例：

```css
/* 让左侧属性区的最大宽度更大 */
.tvu-jse__properties {
  min-width: 240px;
}

/* 选中属性的高亮样式 */
.tvu-jse__property--active {
  background: #e6f7ff;
  border-right: 2px solid #1890ff;
}

/* 调整输入框外观 */
.tvu-jse__field input,
.tvu-jse__field select,
.tvu-jse__field textarea {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px 8px;
}

/* 禁用输入框的样式 */
.tvu-jse__field input:disabled {
  background: #f5f5f5;
  color: #999;
}

/* JSON 字段（textarea）的最小高度 */
.tvu-jse__field--json textarea.tvu-input {
  min-height: 200px;
  font-family: Menlo, Consolas, monospace;
}
```
