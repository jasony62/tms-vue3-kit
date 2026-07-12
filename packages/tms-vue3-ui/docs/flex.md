# Flex 弹性布局

`Flex` 组件封装了 CSS `display: flex` 的常见用法。可以快速控制子节点的方向、对齐方式，以及哪些子节点弹性填充。

## 注册

```ts
import { createApp } from 'vue'
import { Flex } from 'tms-vue3-ui'

const app = createApp(App)
app.use(Flex)  // 注册为 <tms-flex />
app.mount('#app')
```

样式：

```ts
import 'tms-vue3-ui/dist/es/flex/style/flex.css'
```

## 基本用法

```vue
<template>
  <tms-flex direction="column">
    <div>第一行</div>
    <div>第二行</div>
    <div>第三行</div>
  </tms-flex>
</template>
```

渲染为：

```html
<div class="tms-flex tms-flex_column tms-flex_gap_2" style="...">
  <div class="tms-flex__item">第一行</div>
  <div class="tms-flex__item">第二行</div>
  <div class="tms-flex__item">第三行</div>
</div>
```

## Props

| 属性           | 类型     | 默认值    | 说明                                                         |
| -------------- | -------- | --------- | ------------------------------------------------------------ |
| `direction`    | String   | `row`     | `row` / `column` / `row-reverse`                            |
| `alignItems`   | String   | 视方向定 | `align-items`，默认：`column` 时为 `stretch`，否则 `flex-start` |
| `elasticItems` | Number[] | —         | 指定哪些子节点索引（从 0 起）需要弹性填充（`flex: 1`）      |
| `gap`          | Number   | `2`       | 子节点之间的间距（渲染为 CSS class `tms-flex_gap_N`）       |

## 弹性节点示例

```vue
<template>
  <!-- 第 1 个子节点（索引 1）弹性填充 -->
  <tms-flex :elastic-items="[1]" :gap="4">
    <div>左边（固定）</div>
    <div>中间（弹性）</div>
    <div>右边（固定）</div>
  </tms-flex>
</template>
```

渲染时中间节点会加上 `tms-flex__item_elastic` 类，自动 `flex: 1`。

## 自定义样式

通过 `addStyleClass` 逻辑，你可以在组件的默认 class 上叠加自定义 class（在父级或外部样式表中定义）：

```vue
<tms-flex class="my-flex">
  <div>子节点</div>
</tms-flex>
```

```css
.my-flex .tms-flex__item {
  min-width: 0;
}
```

## 修改默认样式

组件默认样式通过以 `.tms-flex` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/flex/style/flex.css` 中定义。
你可以在外部样式表中通过同名（或更高优先级）选择器覆盖。

关键 CSS 类：

| 类名                               | 作用                                      |
| ---------------------------------- | ----------------------------------------- |
| `.tms-flex`                        | 根容器 `display: flex`                    |
| `.tms-flex_row / _column / _row-reverse` | 主方向修饰                           |
| `.tms-flex_gap_1 / _2 / _3 / _4`  | 子节点间距（`margin-left` / `margin-top`）|
| `.tms-flex__item`                  | 包裹每个子节点                            |
| `.tms-flex__item_elastic`           | 被标记为弹性的子节点（`flex-grow: 1`）  |

覆盖示例：

```css
/* 让 gap 更大（不依赖组件 props，适合希望统一风格的场景） */
.tms-flex.tms-flex_row.tms-flex_gap_2 > .tms-flex__item + .tms-flex__item {
  margin-left: 24px !important;
}

/* 让所有子节点获得最小宽度，避免溢出 */
.tms-flex > .tms-flex__item {
  min-width: 0;
}

/* 让弹性子节点在溢出时能缩小 */
.tms-flex__item_elastic {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
```
