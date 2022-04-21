# 布局框（frame）

提供自适应页面的布局。

## 使用

```js
import Vue from 'vue'
import { Frame } from 'tms-vue-ui'
Vue.use(Frame)
```

```
<tms-frame></tms-frame>
```

## 插槽（slots）

| 名称   | 说明                                        |
| ------ | ------------------------------------------- |
| header | 自定义顶部内容                              |
| footer | 自定义底部内容                              |
| left   | 自定义图片内容。屏幕宽度小于等于 768 隐藏。 |
| center | 自定义标题内容                              |
| right  | 自定义描述内容。屏幕宽度小于等于 768 隐藏。 |

## 属性（props）

| 参数              | 说明                                                            | 类型   | 默认值                                                  |
| ----------------- | --------------------------------------------------------------- | ------ | ------------------------------------------------------- |
| back-color        | 背景底色                                                        | string | #f0f3f6                                                 |
| footer-color      | 脚部区域底色                                                    | string | #f0f3f6                                                 |
| footer-min-height | 脚部区域最小高度。仅当未指定 footer 插槽未指定内容时有效。      | string | 32px                                                    |
| left-color        | 左侧区域底色                                                    | string | #f0f3f6                                                 |
| center-color      | 中间区域底色                                                    | string | #fff                                                    |
| right-color       | 右侧区域底色                                                    | string | #f0f3f6                                                 |
| header-color      | 头部区域底色                                                    | string | #f0f3f6                                                 |
| header-min-height | 头部区域最小高度。仅当未指定 header 插槽未指定内容时有效。      | string | 32px                                                    |
| left-width        | 左侧区域宽度                                                    | string | 25%                                                     |
| left-width-sm     | 左侧区域宽度                                                    | string | 100%                                                    |
| right-width       | 右侧区域宽度                                                    | string | 25%                                                     |
| right-width-sm    | 右侧区域宽度                                                    | string | 100%                                                    |
| center-margin     | 中间区域边距                                                    | string | 0 8px                                                   |
| center-margin-sm  | 屏幕小于 768 时，中间区域边距                                   | string | -                                                       |
| display           | 显示哪些区域。只要将要显示的区域设置成 true，不显示的不用设置。 | object | {header: true, footer: true, left: true, right: true}   |
| display-sm        | 屏幕小于 768 时，显示哪些区域                                   | object | {header: true, footer: true, left: false, right: false} |
