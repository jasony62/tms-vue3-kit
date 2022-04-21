# json 文档编辑器（json-doc）

根据指定的`JSONSchema`编辑 json 数据。

## 属性（props）

通过组件调用时，支持以下 Props：

| 参数           | 说明                             | 类型    | 默认值 |
| -------------- | -------------------------------- | ------- | ------ |
| schema         | JSONSchema 定义                  | Object  | -      |
| value          | 要编辑的 json 文档对象           | Object  | -      |
| fieldWrapClass | 输入控件的包裹类                 | String  | -      |
| requireButtons | 是否显示表单操作按钮，例如：提交 | Boolean | true   |
| oneWay         | 传入数据是单向的，不会被修改     | Boolean | true   |
| isSubmit       | 是否提交，若已提交则置为loading状态，防止多次提交     | Boolean | false   |

必须传入`schema`对象。支持`v-model`传递要编辑的 json 文档。

## 方法

| 名称    | 说明             | 参数                                                      |
| ------- | ---------------- | --------------------------------------------------------- |
| editing | 返回表单中的数据 | isCheckValidity，返回前是否做合规性检查，不合规返回 false |
| reset   | 恢复数据原始值   | -                                                         |

## 事件

通过组件调用时，支持以下事件：

| 名称   | 说明                   | 参数 |
| ------ | ---------------------- | ---- |
| submit | 选择表单的提交按钮时。 | -    |

## 定制（setComponent 方法）

使用`setComponent`方法替换组件。

| 参数           | 说明                                                              | 类型     | 默认   |
| -------------- | ----------------------------------------------------------------- | -------- | ------ |
| type           | 控件名称                                                          | String   | -      |
| tag            | 组件名称，例如：`el-input`等                                      | String   | -      |
| options        | 传入 `createElement` 函数的组件选项                               | Object   | 空对象 |
| options.native | true 将指定的值添加到`attrs`否则添加到`props`                     | Boolean  | 空对象 |
| options        | 指定为一个函数，将被调用，传入参数`{vm,field,item}`，返回属性设置 | Function | -      |

支持设置的字段类型及默认组件：

| 控件名称      | 说明                                           | 默认组件 |
| ------------- | ---------------------------------------------- | -------- |
| title         | JSONSchema.\$title                             | h1       |
| description   | JSONSchema.\$description                       | p        |
| error         | 错误提示                                       | div      |
| form          | -                                              | form     |
| label         | -                                              | label    |
| input         | -                                              | input    |
| textarea      | -                                              | textarea |
| radio         | 定义中出现`oneOf`时                            | input    |
| radiogroup    | -                                              | div      |
| select        | 定义中包含`enum:[]`                            | select   |
| option        | select 控件中的选项                            | option   |
| checkbox      | -                                              | input    |
| checkboxgroup | -                                              | div      |
| file          | -                                              | input    |
| button        | -                                              | button   |
| array         | 不限制输入长度的数组，数组中必须是对象         | -        |
| array         | 不限制输入长度的文件上传数组，`format`是`file` | -        |
| object        | 不限制字段数量和名称的独享                     | -        |
| jsondoc       | 编辑`array`和`object`中的子文档时使用的组件    | div      |

## 上传文件

## 嵌套使用 json-doc

如果编辑的对象中包含不限制字段数量的对象或不限制长度的数组，需要额外设置组件。

例如：下面的对象和数组 scheam 定义，它们的`items`只定义了类型。

```
onlineComponents: {
  type: 'object',
  title: '命名路由',
  items: { type: 'object', properties: {} }
}
```

```
children: {
  type: 'array',
  title: '子路由表',
  items: { type: 'object', properties: {} }
}
```

`object`和`array`类型字段没有默认组件，必须指定。可以使用`tms-vue-ui`组件库中的[对象输入组件](object-input.md)。`object-input`组件中使用`jsondoc`编辑内部的子文档。

```
import { ObjectInput, JsonDoc } from '../../src'

Vue.component('tms-object-input', ObjectInput)
JsonDoc.setComponent('array', 'tms-object-input')
JsonDoc.setComponent('object', 'tms-object-input')
```

## element-ui 版

`json-doc`组件提供了边界 json 文档的基本框架，为了用户友好需要形成组件的定制版本。`el-json-doc`使用`element-ui`库中的组件形成定制版本。

```js
import { ElJsonDoc } from 'tms-vue-ui'
```

```html
<tms-el-json-doc :schema="schema" :doc="doc" v-on:submit="jsonDocSubmit"></tms-el-json-doc>
```

| 控件名称      | 说明                                        | 默认组件          |
| ------------- | ------------------------------------------- | ----------------- |
| title         | JSONSchema.\$title                          | h1                |
| description   | JSONSchema.\$description                    | p                 |
| error         | 错误提示                                    | el-alert          |
| form          | -                                           | el-form           |
| label         | -                                           | el-form-item      |
| input         | -                                           | el-input          |
| textarea      | -                                           | el-input          |
| email         |                                             | el-input          |
| url           |                                             | el-input          |
| number        |                                             | el-input          |
| color         |                                             | el-color-picker   |
| radio         | 定义中出现`oneOf`时                         | el-radio          |
| radiogroup    | -                                           | div               |
| select        | 定义中包含`enum:[]`                         | el-select         |
| option        | select 控件中的选项                         | el-option         |
| switch        |                                             | el-switch         |
| rate          |                                             | el-rate           |
| checkbox      | -                                           | el-checkbox       |
| checkboxgroup | -                                           | el-checkbox-group |
| file          | -                                           | el-upload         |
| button        | -                                           | button            |
| jsondoc       | 编辑`array`和`object`中的子文档时使用的组件 | tms-el-json-doc   |
| array         | 不限制输入长度的数组，数组中必须是对象      | -                 |
| object        | 不限制字段数量和名称的独享                  | -                 |
