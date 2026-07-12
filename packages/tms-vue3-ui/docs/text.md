# Text 文本截断

用于展示文本内容，并在内容过长时按行数进行截断。桌面端和小屏幕可以分别设置最大行数。

## 注册

```ts
import { createApp } from 'vue'
import { Text } from 'tms-vue3-ui'

const app = createApp(App)
app.use(Text)  // 注册为 <tms-text />
app.mount('#app')
```

样式：

```ts
import 'tms-vue3-ui/dist/es/text/style/text.css'
```

## 基本用法

```vue
<template>
  <div style="width: 300px">
    <h4>原始文本</h4>
    <tms-text>
      这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本，
      这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本。
    </tms-text>

    <h4>显示两行</h4>
    <tms-text :lines="2">
      这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本，
      这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本。
    </tms-text>

    <h4>小屏幕（<= 768px）显示两行</h4>
    <tms-text :lines-sm="2">
      这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本，
      这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本。
    </tms-text>
  </div>
</template>
```

## Props

| 属性       | 类型   | 默认值 | 说明                                |
| ---------- | ------ | ------ | ----------------------------------- |
| `lines`    | Number | —      | 桌面端最多显示的行数，超出省略显示  |
| `linesSm`  | Number | —      | 小屏（<= 768px）最多显示的行数      |

## 样式原理

组件通过 `tms-text_lines_<n>` / `tms-text_lines-sm_<n>` 类名配合 CSS 的
`-webkit-line-clamp` 实现截断。你可以在外部样式表中覆写对应的行数实现。

## 修改默认样式

组件的默认样式通过以 `.tms-text` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/text/style/text.css` 中定义。

关键 CSS 类：

| 类名                         | 作用                              |
| ---------------------------- | --------------------------------- |
| `.tms-text`                  | 根元素，默认 `display: -webkit-box` |
| `.tms-text_lines_1 / _2 / _3 / _4` | 桌面端 最大行数         |
| `.tms-text_lines-sm_1 / _2 / _3 / _4` | 小屏下最大行数（`max-width: 768px`） |

覆盖示例：

```css
/* 自定义截断时末尾的样式 */
.tms-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #666;
  line-height: 1.6;
}

/* 当组件只提供 1/2/3/4 行的默认值时，需要 5 行可以这样补充 */
.tms-text.tms-text_lines_5 {
  -webkit-line-clamp: 5;
}
```
