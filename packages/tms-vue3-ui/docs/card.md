# 卡片（card）

用卡片的形式显示信息，包括：图片，标题，描述。可以通过插槽进行定制。

## 使用

```js
import Vue from 'vue'
import { Flex, Card } from 'tms-vue-ui'
Vue.use(Flex).use(Card)
```

```
<tms-card></tms-card>
```

## 属性（props）

| 参数       | 说明                                               | 类型   | 默认值  |
| ---------- | -------------------------------------------------- | ------ | ------- |
| thumb      | 左侧图片 URL                                       | string | boolean | - |
| title      | 标题                                               | string | -       |
| desc       | 描述                                               | string | -       |
| gap        | 头，主体和脚的间隙                                 | number | 2       |
| gapMain    | 缩略图和内容的间隙                                 | number | 2       |
| gapContent | 内容中标题，描述和底部内容的间隙                   | number | 2       |
| back-color | 背景底色                                           | string | #fffff  |
| desc-color | 描述文字颜色                                       | string | #666666 |
| to         | 点击后跳转的目标路由对象，同 vue-router 的 to 属性 | object |         |
| url        | 点击后跳转的链接地址                               | string |         |

如果`thumb`未指定或值是布尔值`false`，不生成`thumb`元素。

卡片在第一层从上到下分为：`header`，`main`和`footer`三个区域，`header`和`footer`默认没有内容，用`tms-flex`包裹，`gap`参数和`gap`对应。

`main`从左到右分为`thumb`和`content`两个区域，用`tms-flex`包裹，`gap`参数和`gapMain`对应。

`content`从上到下分为`title`，`desc`和`bottom`三个区域，用`tms-flex`包裹，`gap`参数和`gapContent`对应。

## 插槽（slots）

| 名称   | 说明           |
| ------ | -------------- |
| header | 自定义顶部内容 |
| footer | 自定义底部内容 |
| thumb  | 自定义图片内容 |
| title  | 自定义标题内容 |
| desc   | 自定义描述内容 |
| bottom | 自定义底部内容 |
