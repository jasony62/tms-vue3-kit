# Frame 页面布局

提供一个 `header / main(left + center + right) / footer` 结构的响应式页面布局组件。

- 在小屏幕（`window.screen.width <= 768`）下，左/右区域会自动与 center 垂直堆叠。
- 每个区域的颜色、宽度、高度均可通过 props 配置。

## 安装与注册

```ts
import { createApp } from 'vue'
import { Frame } from 'tms-vue3-ui'

const app = createApp(App)
app.use(Frame)  // 注册为 <tms-frame />
app.mount('#app')
```

样式会自动加载，路径：

```ts
import 'tms-vue3-ui/dist/es/frame/style/frame.css'
```

## 基本用法

```vue
<template>
  <tms-frame>
    <template #header>
      <div>这是顶部导航</div>
    </template>

    <template #left>
      <div>侧边菜单</div>
    </template>

    <template #center>
      <div>页面主体内容</div>
    </template>

    <template #right>
      <div>右侧信息栏</div>
    </template>

    <template #footer>
      <div>© 2025 tms-vue3-ui</div>
    </template>
  </tms-frame>
</template>
```

## Props

| 属性                      | 类型    | 默认值   | 说明                               |
| ------------------------- | ------- | -------- | ---------------------------------- |
| `display`                 | Object  | 见下方   | 在桌面端显示哪些区域               |
| `displaySm`               | Object  | 见下方   | 在小屏幕（<=768px）显示哪些区域    |
| `backColor`               | String  | `#f0f3f6` | 整个页面的背景色                   |
| `headerColor`             | String  | `#f0f3f6` | header 背景色                      |
| `headerMinHeight`         | String  | `32px`   | header 最小高度                    |
| `leftColor`               | String  | `#f0f3f6` | 左侧区域背景色                     |
| `leftWidth`               | String  | `25%`    | 左侧区域宽度                       |
| `leftWidthSm`             | String  | `100%`   | 小屏左侧区域宽度                   |
| `centerColor`             | String  | `#fff`   | 中间区域背景色                     |
| `centerMargin`            | String  | `0 8px`  | 中间区域外边距                     |
| `centerMarginSm`          | String  | `''`     | 小屏中间区域外边距                 |
| `rightColor`              | String  | `#f0f3f6` | 右侧区域背景色                     |
| `rightWidth`              | String  | `25%`    | 右侧区域宽度                       |
| `rightWidthSm`            | String  | `100%`   | 小屏右侧区域宽度                   |
| `footerColor`             | String  | `#f0f3f6` | footer 背景色                      |
| `footerMinHeight`         | String  | `32px`   | footer 最小高度                    |
| `mainDirection`           | String  | `row`    | 桌面端 main 方向（`row` / `column`）|
| `mainDirectionSm`         | String  | `row`    | 小屏 main 方向                     |

`display` / `displaySm` 的默认值：

```js
{ header: true, footer: true, left: true, right: true }
{ header: true, footer: true, left: false, right: false }  // 小屏
```

## Slots

| 名称     | 说明              |
| -------- | ----------------- |
| `header` | 顶部区域内容      |
| `left`   | 左侧区域内容      |
| `center` | 中间主体内容      |
| `right`  | 右侧区域内容      |
| `footer` | 底部区域内容      |

## 响应式

组件在挂载时通过 `window.screen.width <= 768` 判断小屏，并监听 `window.resize` 事件更新布局，
`left` / `right` 默认会被隐藏，`center` 撑满，`main` 的 flex 方向切换为 `column`。

你可以通过 `displaySm`、`mainDirectionSm` 等 props 自定义小屏行为。

## 修改默认样式

组件的默认样式通过以 `.tms-frame` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/frame/style/frame.css` 中定义。
在你自己的样式表中添加同名（或更高优先级的）选择器即可覆盖。

关键 CSS 类：

| 类名                                   | 作用                               |
| -------------------------------------- | ---------------------------------- |
| `.tms-frame`                           | 根容器，绝对定位，整页 flex 垂直布局 |
| `.tms-frame__main`                     | main 容器，水平/垂直 flex          |
| `.tms-frame__main.tms-frame__main_row`          | main 水平方向（桌面默认）|
| `.tms-frame__main.tms-frame__main_column`       | main 垂直方向              |
| `.tms-frame__main.tms-frame__main_row-reverse`  | main 反向水平              |
| `.tms-frame__main.tms-frame__main_column-reverse` | main 反向垂直             |
| `.tms-frame__main__center / __left / __right` | center / left / right 子区域 |
| `.tms-frame__header / .tms-frame__footer` | header / footer 区域            |

覆盖示例（在你的 app 全局样式中）：

```css
/* 让 main 区域留白更多 */
.tms-frame > .tms-frame__main {
  padding: 8px 16px;
}

/* 在小屏下，让 left / right 以 flex 的形式并排显示而非独占一整行 */
@media screen and (max-width: 768px) {
  .tms-frame > .tms-frame__main {
    flex-direction: row;
  }
}
```
