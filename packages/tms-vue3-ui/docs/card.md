# Card 卡片

通用卡片组件，支持缩略图、标题、描述、底部操作区，可通过 `url` / `to` 实现点击跳转。

## 注册

```ts
import { createApp } from 'vue'
import { Card } from 'tms-vue3-ui'

const app = createApp(App)
app.use(Card)  // 注册为 <tms-card />
app.mount('#app')
```

样式：

```ts
import 'tms-vue3-ui/dist/es/card/style/card.css'
```

## 基本用法

```vue
<template>
  <tms-card
    thumb="/images/demo.png"
    title="产品卡片"
    desc="这是产品的描述信息"
    :gap="4"
  />
</template>
```

## 带插槽的用法

```vue
<template>
  <tms-card back-color="#fff">
    <template #thumb>
      <img src="/images/custom.png" />
    </template>
    <template #title>
      <b>自定义标题</b>
    </template>
    <template #desc>
      <span>自定义描述</span>
    </template>
    <template #bottom>
      <tms-flex :elastic-items="[1]">
        <span>作者</span>
        <span>2025-01-01</span>
      </tms-flex>
    </template>
  </tms-card>
</template>
```

## Props

| 属性          | 类型              | 默认值   | 说明                                       |
| ------------- | ----------------- | -------- | ------------------------------------------ |
| `thumb`       | String / Boolean  | —        | 缩略图 URL；`false` 时不显示缩略图         |
| `title`       | String            | —        | 卡片标题（当没有 #title 插槽时使用）       |
| `desc`        | String            | —        | 卡片描述文本（当没有 #desc 插槽时使用）    |
| `gap`         | Number            | `2`      | 卡片整体各区块的间距                       |
| `gapMain`     | Number            | `2`      | 缩略图与内容区之间的间距                   |
| `gapContent`  | Number            | `2`      | 标题 / 描述 / 底部之间的间距               |
| `backColor`   | String            | `#ffffff`| 卡片背景色                                 |
| `descColor`   | String            | `#666666`| 描述文本颜色                               |
| `url`         | String            | —        | 点击后跳转的 URL（`window.location.href`）|
| `to`          | Object            | —        | 点击后通过 `$router.push(to)` 路由跳转     |

## Slots

| 名称       | 说明                |
| ---------- | ------------------- |
| `header`   | 卡片顶部内容        |
| `thumb`    | 缩略图区域          |
| `title`    | 标题区域            |
| `desc`     | 描述文本区域        |
| `bottom`   | 底部操作区          |
| `footer`   | 卡片底部内容        |

## 点击行为

- 如果同时设置 `url` 和 `to`，优先响应 `url`。
- 没有设置跳转时，整张卡片可点击但不会发生跳转，适合用于受控场景。

## 修改默认样式

组件的默认样式通过以 `.tms-card` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/card/style/card.css` 中定义。

关键 CSS 类：

| 类名                            | 作用                 |
| ------------------------------- | -------------------- |
| `.tms-card`                     | 卡片根容器           |
| `.tms-card__thumb`              | 缩略图区域           |
| `.tms-card__item`               | 卡片子区域项         |

覆盖示例：

```css
/* 让整张卡片有圆角和阴影 */
.tms-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 缩略图固定高度 */
.tms-card .tms-card__thumb {
  height: 160px;
  object-fit: cover;
}
```
