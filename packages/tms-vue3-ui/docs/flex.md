# 弹性布局（flex）

对子元素进行弹性布局，可指定布局方向和填充剩余空间的子元素。

> 不再使用，用`tailwind.css`替换

## 使用

```js
import Vue from 'vue'
import { Flex } from 'tms-vue-ui'
Vue.use(Flex)
```

## 属性（props）

| 参数         | 说明                                                                    | 类型   | 默认值     |
| ------------ | ----------------------------------------------------------------------- | ------ | ---------- | ------- |
| direction    | 布局方向：row（水平左到右）或 column（垂直）或 row-revers（水平右到左） | string | row        |
| alignItems   | 子元素对齐方式。参考 flex 布局。                                        | string | flex-start | stretch |
| elasticItems | 占据空余空间的子元素序号。                                              | array  | -          |
| gap          | 自元素之间的间距（4px 的倍数），有效值为 1，2，3，4。                   | number | 2          |

`gap`值如果不是 1，2，3，4，仍然会生成类名称`tms-flex_gap_?`，但是不会设置样式。

水平排列时，`alignItems`默认值为`flex-start`，顶部对齐，底部不对齐；垂直排列时，`alignItems`默认值为`stretch`，两端对齐。

```
<tms-flex><tms-flex>
```
