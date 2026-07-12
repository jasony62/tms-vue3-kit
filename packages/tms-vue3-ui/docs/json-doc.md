# JsonDoc 基于 JSONSchema 生成表单

根据一个 **JSON Schema** 自动渲染出对应表单，支持对象、数组、文件上传、单选/多选、自动填充等丰富特性。

## 注册

```ts
import { createApp } from 'vue'
import { JsonDoc } from 'tms-vue3-ui'

const app = createApp(App)
app.use(JsonDoc) // 注册为 <tms-json-doc />
app.mount('#app')
```

样式：

```ts
import 'tms-vue3-ui/dist/es/json-doc/style/json-doc.css'
```

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Field, DocAsArray } from 'tms-vue3-ui'

// JSON Schema 描述
const schema = ref({
  type: 'object',
  title: '用户信息',
  properties: {
    name: { type: 'string', title: '姓名', required: true },
    age:  { type: 'integer', title: '年龄', minimum: 0, maximum: 120 },
    email: { type: 'string', format: 'email', title: '邮箱' },
    gender: {
      type: 'string',
      title: '性别',
      enum: ['male', 'female'],
      // 生成枚举下拉
      items: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' },
      ],
    },
  },
})

// 初始文档数据
const initialValue = ref({
  name: '',
  age: 18,
  email: '',
})

const jsonDocEditor = ref<{ editing: () => any } | null>(null)

const onChange = (fieldName: string, editingDoc: any) => {
  console.log('字段变更', fieldName, editingDoc)
}

const onFileUpload = (field: Field, data: FormData) => Promise.resolve({})

const onFileDownload = (name: string, url: string) => {
  console.log('下载文件', name, url)
}

const getResult = () => {
  // 返回最终文档
  console.log(jsonDocEditor.value?.editing(true))
}
</script>

<template>
  <tms-json-doc
    ref="jsonDocEditor"
    :schema="schema"
    :value="initialValue"
    :on-change="onChange"
    :on-file-upload="onFileUpload"
    :on-file-download="onFileDownload"
    hide-root-title
  />
  <button @click="getResult">查看结果</button>
</template>
```

## Props

| 属性                            | 类型     | 默认值 | 说明                                                                         |
| ------------------------------ | -------- | ------- | ---------------------------------------------------------------------------- |
| `schema`                      | Object  | —       | 要渲染的 JSON Schema（必填）                                                  |
| `value`                        | Object | `{}`    | 初始文档数据                                                                   |
| `fieldWrapClass`              | String  | —       | 字段输入框外层的自定义 class                                                  |
| `onMessage`                    | Function | `alert` | 组件内部错误提示回调                                                           |
| `onChange`                     | Function | —       | 字段变更回调                                                                  |
| `onLookup`                     | Function | —       | 当字段值变化时请求外部数据                                                    |
| `autofillRequest`              | Object / Function | — | 自动填充请求                                                   |
| `onFileSelect`                | Function | —       | 从文件服务选择文件的回调                                                        |
| `onFileUpload`                 | Function | —       | 文件上传的处理函数（返回 Promise）                                               |
| `onFileDownload`             | Function | —       | 触发文件下载的回调                                                           |
| `onPaste`                     | Function | —       | 粘贴后的回调（`(field, data) => Promise<any>`）                                 |
| `enablePaste`                  | Boolean | `false`| 是否允许通过粘贴注入数据                                                     |
| `showFieldName`              | Boolean | `true` | 是否显示字段的 key（而不是 title）                                           |
| `showFieldFullname`         | Boolean | `false`| 是否显示字段的完整路径                                                      |
| `hideRootTitle`               | Boolean | `false`| 隐藏根节点的标题                                                             |
| `hideRootDescription`       | Boolean | `false`| 隐藏根节点的描述                                                          |
| `hideFieldDescription`       | Boolean | `false`| 隐藏每个字段的描述                                                          |
| `placeholderUseFieldDescription` | Boolean | `false`| placeholder 取字段描述作为占位文本                                             |

## Emits

| 事件          | 说明                          |
| ------------- | ----------------------------- |
| `jdocFocus`  | 字段获得焦点时触发             |
| `jdocBlur`   | 字段失去焦点时触发             |

## schema 中的常用字段定义

每个字段的 schema 可以包括：

| 字段              | 作用                                             |
| ------------------- | ------------------------------------------------ |
| `type`             | `string` / `number` / `integer` / `boolean` / `object` / `array` / `json` |
| `title`           | 标题（展示时的 label）                           |
| `description`      | 描述文本                                          |
| `required`         | 是否必填                                           |
| `default`           | 默认值                                            |
| `component`       | 指定自定义渲染组件                               |
| `items`          | 数组项为对象时定义                           |
| `enum`           | 枚举（value + label）                            |
| `oneOf`            | 单选                                              |
| `anyOf`          | 多选                                              |
| `attrs.format` | 扩展格式（`markdown` / `json` / `file` 等）|

## 暴露方法（通过 ref 调用

```ts
const editor = ref<{
  editing: (matchSchema?: boolean, options?: any) => any
  editDoc: DocAsArray      // 当前文档对象
}>()
```

- `editing(true)` — 返回当前文档数据
- `editDoc` — 底层文档对象，可通过 `editDoc.get(path)` 或 `editDoc.set(path, value)` 访问/修改字段值。

## 自动填充（Autofill

通过 `autofill-request` 属性实现：

```ts
const autofillRequest = {
  get: (url) => fetch(url).then((res) => res.json()),
  post: (url, data) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => res.json()),
}
```

在 schema 的 property 中声明 `autofill` 规则（如：

```json
{
  "district": {
    "type": "string",
    "title": "区域",
    "attrs": {
      "autofill": {
        "trigger": "filter.areaCode.keyword",
        "request": {
          "method": "post",
          "url": "http://.../autofill/district",
          "data": { "filter": { "areaCode": { "keyword": "{}"} } }
      }
    }
  }
}
```

## 文件上传

在 schema 中声明一个数组，items 格式为 `type:object, attrs.format=file`：

```json
{
  "files": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
      "properties": {
      "name": {"type": "string",
      "url": {"type": "string"}
    }
  },
  "format": "file"
}
```

文件字段会调用 `onFileSelect` / `onFileDownload` 接口，最终通过 `onFileUpload` / `onFileDownload` 提交和下载。

## 字段 / 文档对象（DocIter / DocAsArray）

`tms-json-doc` 组件维护一个内部文档对象，可用 `editing()` 获得文档对象并通过 `editDoc` 访问。

- `doc.get('user.name')` — 读取字段值
- `doc.set('user.email', 'xxx@xxx.com')` — 设置字段值
- `doc.appendAt('files', { name, url })` — 在数组末尾添加一项

## 修改默认样式

组件默认样式通过以 `.tvu-jdoc` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/json-doc/style/json-doc.css` 中定义，
其中混合了 Tailwind 的 utility class（如 `flex`, `p-2`, `rounded` 等）和自定义样式。

关键 CSS 类：

| 类名                                         | 作用                                                     |
| -------------------------------------------- | -------------------------------------------------------- |
| `.tvu-jdoc__root`                             | 根容器，整体布局                                        |
| `.tvu-jdoc__field`                            | 每个字段的包装                                           |
| `.tvu-jdoc__field-fullname`                  | 字段完整路径（灰色文本）                                |
| `.tvu-jdoc__field-label`                   | 字段 label（title / field-name）                              |
| `.tvu-jdoc__field--active`               | 当前正在编辑的字段高亮                                 |
| `.tvu-jdoc__field[data-collapsed-field]    | 可折叠字段                                             |
| `.tvu-jdoc__field[data-leaf-field]            | 叶子字段                                               |
| `.tvu-jdoc__field[data-one-of-field-selected] | oneOf / anyOf 分支字段                              |
| `.tvu-jdoc__field-desc`                      | 字段描述文本区                                         |
| `.tvu-jdoc__nest`                            | object / array 的嵌套容器                                  |
| `.tvu-jdoc__nest--depth`                   | 更深层级的嵌套容器（含左侧竖线 + 缩进）|
| `.tvu-jdoc__nest__actions`                   | object/array 的操作按钮区                                |
| `.tvu-jdoc__password`                       | 密码类型字段（含显示/隐藏图标）                        |
| `.tvu-jdoc__password--close / --open::after  | 密码显示/隐藏图标伪元素                              |
| `input.tvu-jdoc__field-input:read-only`     | 只读字段的输入框样式                                |

覆盖示例：

```css
/* 调整字段间距 */
.tvu-jdoc__root {
  gap: 12px;
}

/* 调整字段 label 颜色与字号 */
.tvu-jdoc__field-label {
  color: #555;
  font-size: 14px;
}

/* 高亮当前编辑字段的背景色 */
.tvu-jdoc__field--active > .tvu-jdoc__nest {
  border-color: #1890ff;
}

/* 让字段描述的边框与背景 */
.tvu-jdoc__field-desc {
  background: #f5f5f5;
  border: 1px dashed #ccc;
}

/* 调整只读输入框的背景 */
input.tvu-jdoc__field-input:read-only {
  background: #fafafa;
}
```

需要更彻底的整体风格统一，可以通过在外部样式表中覆盖所有 `.tvu-jdoc__*` 相关规则，
或通过 `fieldWrapClass` prop 为每个字段注入自定义 class，
再在外部样式表中针对它的后代选择器来覆盖具体子节点样式。
