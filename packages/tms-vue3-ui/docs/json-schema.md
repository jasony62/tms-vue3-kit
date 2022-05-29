# JSONSchema 编辑器（json-schema）

生成`JSONSchema`的编辑器。`JSONSchema`本身是个`json`格式的数据，主要包含自定义的属性（property）和按照`JSONSchema`标准描述每个属性的关键字（keywords）。

## 核心功能

`JSONSchema`支持 7 种基本属性数据类型，包括：`string`，`number`，`integer`，`object`，`array`，`boolean`，`null`，扩展`json`类型用于直接编辑 json 格式数据。针对每种类型，`JSONSchema`定义了若干关键字（keywords），用来描述每种类型的数据规范化要求，例如：`minLength`和`maxLength`限制字符串类型的长度等。（参考：[Understanding JSON Schema](https://json-schema.org/understanding-json-schema/index.html))

`JSONSchema`标准对`string`类型提供了格式（format）关键字，说明输入格式要求，`json-schema`将`format`扩展到了`object`类型，例如，限制文件的类型和大小等。`JSONSchema`内置实现了一些常用格式扩展信息，例如：文件。组件的使用者也可以通过`setFormatAttrsComp`方法，指定特定格式对应的扩展信息编辑组件。格式扩展信息记录在`formatAttrs`关键字中。自定义的格式扩展信息编辑组件必须实现`defaultFormatAttrs`方法，提供扩展信息的默认设置。

## 内置支持的格式

| 基础类型（type） | 支持的格式（format） | 说明             |
| ---------------- | -------------------- | ---------------- |
| string           | name                 | 用户名           |
| string           | mobile               | 手机号           |
| string           | email                | 电子邮件         |
| object           | file                 | 文件             |
| object           | image                | 图片             |
| object           | score                | 打分             |
| object           | url                  | 外部链接         |
| integer          | date-time            | 日期时间的秒表示 |
| string           | date                 | 日期             |
| string           | time                 | 时间             |

## 设置必填（未按规范实现）

指定某些属性为必填字段。

[Required Properties](https://json-schema.org/understanding-json-schema/reference/object.html#id3)

## 选项

属性的类型为`integer`、`number`、`string`、`array`，出现设置【选项模式】。

【选项模式】要支持`enum`，`oneOf`和`anyOf`几种情况。

选项中的值固定为包含`label`和`value`属性的对象。

```json
[
  {
    "label": "男",
    "value": "male"
  },
  {
    "label": "女",
    "value": "female"
  }
]
```

支持设置要求的选项数量`minItems`和`maxItems`。

## 属性依赖

用`existIf`指定属性间的依赖关系，只有当某个（或某些）属性的值满足条件时，属性才存在（出现在表达中）。

用`properties`定义属性的取值条件，多个属性取值条件是和的关系（同时满足）。

```json
{
  "properties": { "prop1": { "const": "value" }, "prop2": { "const": "value" } }
}
```

用`oneOf`定义多组条件间任意满足一项的情况，多个条件放在数组中。

```json
{
  "oneOf": [
    { "properties": { "prop1": { "const": "value" } } },
    { "properties": { "prop2": { "const": "value" } } }
  ]
}
```

用`allOf`定义多组条件间同时满足的情况，多个条件放在数组中。

```json
{
  "allOf": [
    { "properties": { "prop1": { "const": "value" } } },
    { "properties": { "prop2": { "const": "value" } } }
  ]
}
```

支持条件嵌套。

```json
{
  "allOf": [
    {
      "anyOf": [
        { "prop1": { "const": "value" } },
        { "prop2": { "const": "value" } }
      ]
    },
    { "properties": [{ "prop3": { "const": "value" } }] }
  ]
}
```

注：目前，仅支持通过直接填入规则`JSON`文本的方式定义属性依赖规则。

[dependentRequired](https://json-schema.org/understanding-json-schema/reference/conditionals.html#id4)

[dependentSchemas](https://json-schema.org/understanding-json-schema/reference/conditionals.html#id5)

[If-Then-Else](https://json-schema.org/understanding-json-schema/reference/conditionals.html#id6)

[Property dependencies](https://json-schema.org/understanding-json-schema/reference/object.html#id7)

[Constant values](https://json-schema.org/understanding-json-schema/reference/generic.html#id5)

## 选项依赖

属性值的可选项根据其他属性的值决定，例如：省市属性的值为北京时，区县属性的可选值（enum）只有北京下的区县。

在区县属性下建立选项组，每个选项组匹配省市属性下的某个值。（为了降低复杂度，不要求所有的属性组都关联同一个属性下的不同选项。）

```json
{
  "enumGroups": [
    {
      "id": "选项组id",
      "label": "选项组名称",
      "assocEnum": { "property": "关联的属性id", "value": "关联属性的取值" }
    }
  ],
  "enum": [
    { "label": "选项1", "value": "选项1的值", "group": "选项组的id" },
    { "label": "选项2", "value": "选项2的值", "group": "选项组的id" }
  ]
}
```

## 属性值自动填充

通过`autofill`可以定义为属性通过调用 API 获取数据的规则。

| 字段       | 说明                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| url        | API 的地址。                                                                                                      |
| method     | HTTP 请求方法，支持 POST 和 GET。                                                                                 |
| params     | 设置 url 中的查询参数。数组，可包含多个定义。                                                                     |
| --name     | 查询参数的名称。                                                                                                  |
| --path     | 从 schema 对应的文档中获取查询参数值的路径。                                                                      |
| --vaule    | 查询参数的值。（用于指定固定值）                                                                                  |
| body       | 设置 POST 请求的消息体。数组，可包含多个定义。消息体为 JSON 对象。                                                |
| --bodyPath | 消息对象中的属性名称。                                                                                            |
| --path     | 从 schema 对应的文档中获取查询参数值的路径。                                                                      |
| --value    | 消息对象中属性的值。（用于指定固定值）                                                                            |
| target     | 指定获取的数据的填充位置，作为填入只（value）或作为选项（items）的值。                                            |
| runPolicy  | 执行运行策略。构造表单时执行一次（onCreate）。依赖的参数发生变化时执行（onParamChange）。用户主动更新（onUser）。 |

注：查询参数和消息体定义中的路径遵循`lodash`属性名的命名规则，支持多级，支持数组。

注：`autofill`不是`JSONSchema`标准中的内容。

## 文件属性

待补充

## 扩展属性定义

在实际的项目中可能存在两类扩展需求：1、规范中的关键字（keywords）不满足要求需要扩展，例如：指定某些属性只读；2、某些常用类型对象的输入限制条件，例如：手机号码、文件等。

`json-schema`通过`slot`实现关键字扩展，插槽名称为`extattrs`，示例代码如下：

```
<tms-json-schema schema="schema" :on-message="onMessage" :root-name="'$'">
  <template #extattrs="{ attrs }">
    <div>
      <label><input type="checkbox" v-model="attrs.readonly" />不允许编辑</label>
    </div>
    <div>
      <label><input type="checkbox" v-model="attrs.groupable" />可否分组</label>
    </div>
  </template>
 </tms-json-schema>
```

关键字扩展适用于对所有属性统一添加某种信息。

注：`JSONSchema`新版本规范中已经支持`readOnly`和`writeOnly`属性。

## 使用组件

| 组件属性  | 说明                                                     | 类型     | 必填 | 默认值 |
| --------- | -------------------------------------------------------- | -------- | ---- | ------ |
| schema    | 要编辑的`JSONSchema`对象。编辑过程中不会改变传入的对象。 | object   | 否   |        |
| onMessage | 显示提示信息。                                           | function | 否   |        |
| onUpload  | 为文件属性提供上传模版文件的方法。                       | function | 否   |        |
| rootName  | 属性路径名的根节点名称。请参考`JSON Path`的定义。        | sting    | 否   | $      |

```js
import { JsonSchema } from 'tms-vue3-ui'
```

```html
<json-schema :schema="jsonSchema"></json-schema>
```

# 参考

https://json-schema.org
