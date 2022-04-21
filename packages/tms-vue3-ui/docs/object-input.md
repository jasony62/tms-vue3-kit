# 对象输入（object-input）

编辑一个对象或数组。

```js
import { ObjectInput } from 'tms-vue-ui'
```

```html
<template>
  <div class="object-input">
    <tms-object-input :value="array" @add="add">
      <template v-slot:default="lineProps">
        <el-input-number size="mini" v-model="lineProps.line.number"></el-input-number>
      </template>
      <template v-slot:add>+ 添加</template>
      <template v-slot:empty>x 清空</template>
      <template v-slot:remove></template>
      <template v-slot:moveup></template>
      <template v-slot:movedown></template>
    </tms-object-input>
  </div>
</template>
```

## 属性（props）

通过组件调用时，支持以下 Props：

| 属性       | 说明                                             | 类型         | 默认值 |
| ---------- | ------------------------------------------------ | ------------ | ------ |
| value      | 需要处理的对象或数组数据。                       | Object/Array | -      |
| slotRender | 编辑数据组件的`render`函数，用于替换插槽的内容。 | Function     | -      |

## 事件

通过组件调用时，支持以下事件：

| 属性 | 说明                   | 参数 |
| ---- | ---------------------- | ---- |
| add  | 请求向数组添加新元素。 | -    |

## 插槽

| 名称     | 说明                   | 属性 | 默认值 |
| -------- | ---------------------- | ---- | ------ |
| default  | 指定显示一行数据的模板 | line | -      |
| add      | 添加一行数据按钮的文字 | -    | 添加   |
| empty    | 清空所有数据按钮的文字 | -    | 清空   |
| remove   | 删除一行数据按钮的文字 | -    | 删除   |
| moveup   | 上移一行数据按钮的文字 | -    | 上移   |
| movedown | 下移一行数据按钮的文字 | -    | 下移   |

## 替换组件

```js
ObjectInput.setComponent('layout.root', 'tms-flex', options)
ObjectInput.setComponent('button.add', 'el-button', options)
```

| 名称                | 说明                       | 默认值 | 支持多级 |
| ------------------- | -------------------------- | ------ | -------- |
| button.add          | 添加一行数据按钮的文字     | button | -        |
| button.empty        | 清空所有数据按钮的文字     | button | -        |
| button.remove       | 删除一行数据按钮的文字     | button | -        |
| button.moveup       | 上移一行数据按钮的文字     | button | -        |
| button.movedown     | 下移一行数据按钮的文字     | button | -        |
| layout.root         | 组件根元素                 | div    | -        |
| layout.lines        | 数组数据展示区             | div    | -        |
| layout.line         | 单行数组数据展示区         | div    | 是       |
| layout.line-index   | 编辑数组时，编辑项的索引   | div    | -        |
| layout.line-key     | 编辑对象时，编辑项的属性名 | div    | -        |
| layout.line-slots   | 单行数据展示区             | div    | -        |
| layout.line-buttons | 单数数据操作按钮区         | div    | -        |
| layout.bottom       | 数组操作按钮区             | div    | -        |

`options`参数请参考`Vue`官网文档。参考：https://cn.vuejs.org/v2/guide/render-function.html#深入数据对象

有些时候，我们需要将组件替换为有层级关系的多个组件，例如一个解决外部的样式，一个解决内部的样式，可以通过如下形式进行设置，层级组件的标签可以是数组或者用点分割的字符串。

```
ObjectInput.setComponent('layout.line', 'el-collapse-item.tms-flex', {
  'tms-flex': { props: { direction: 'column' } }
})
```
