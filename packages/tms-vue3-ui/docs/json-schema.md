# JSONSchema 编辑器（json-schema）

生成`JSONSchema`的编辑器。`JSONSchema`本身是个`json`格式的数据，主要包含自定义的属性（property）和按照`JSONSchema`标准描述每个属性的关键字（keywords）。

## 核心功能

`JSONSchema`支持 7 种基本属性数据类型，包括：`string`，`number`，`integer`，`object`，`array`，`boolean`，`null`。针对每种类型，`JSONSchema`定义了若干关键字（keywords），用来描述每种类型的数据规范化要求，例如：`minLength`和`maxLength`限制字符串类型的长度等。（参考：[Understanding JSON Schema](https://json-schema.org/understanding-json-schema/index.html))

在实际的项目中可能存在两类扩展需求：1、规范中的关键字（keywords）不满足要求需要扩展，例如：指定某些属性只读；2、某些常用类型对象的输入限制条件，例如：手机号码、文件等。

`json-schema`通过`slot`实现关键字扩展，插槽名称为`extKeywords`，示例代码如下。

```
<tms-json-schema ref="myJsonSchema" :schema="jsonSchema" :extendSchema="extendSchema">
  <template v-slot:extKeywords="props">
    <el-form-item label="不可修改">
      <el-switch v-model="props.schema.readonly"></el-switch>
    </el-form-item>
  </template>
</tms-json-schema>
```

关键字扩展适用于对所有属性统一添加某种信息。

`JSONSchema`标准对`string`类型提供了格式（format）关键字，说明输入格式要求，`json-schema`将`format`扩展到了`object`类型，例如，限制文件的类型和大小等。`JSONSchema`内置实现了一些常用格式扩展信息，例如：文件。组件的使用者也可以通过`setFormatAttrsComp`方法，指定特定格式对应的扩展信息编辑组件。格式扩展信息记录在`formatAttrs`关键字中。自定义的格式扩展信息编辑组件必须实现`defaultFormatAttrs`方法，提供扩展信息的默认设置。

数组类型（array），字符串类型（string）和整数类型（integer）的属性支持通过`enum`设置可选项范围。目前，`enum`仅支持放`{label:"",value:""}`的对象。

如果数组设置了可选范围，支持设置要求的选项数量`minItems`和`maxItems`。

## 计划内置支持的格式

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

## 设置依赖

指定属性间的依赖关系，只有当某个（或某些）属性的值满足某条件时，属性才出现。

`JSONSchema`只定义了简单的依赖关系，说明当某属性出现时，另一个属性必须出现。但是，经常需要支持的情况是当某属性的值满足某个条件时，另一个属性才出现。

目前只实现了在同一个目录下的属性之间建立依赖关系，不支持建立和父对象属性的依赖关系。（计划支持）

某个属性可以指定多条依赖关系，描述为某个属性等于某个值，然后指定这多个条件是需要全部满足还是满足任意一个就行。（单个条件除了等于，还有可能存在其他关系，例如：大于、小于等；多个条件之间除了与和或的关系，还有可能先分组，再描述组间的关系。）

```json
{
  "dependencies": { "file": { "rules": { "familyName": "1", "givenName": "2" }, "operator": "or" } }
}
```

| 关键字       | 说明                                                                                                                                                      | 类型   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| dependencies | 对象类型下和`properties`并列，描述`properties`之间的依赖关系。由其它属性的值决定是否需要在表单中显示的属性作为对象的`key`，对应的值为描述依赖规则的对象。 | object |
| rules        | 依赖规则的集合。对象的`key`为被依赖的属性，值为当属性等一该值时规则成立。                                                                                 | object |
| operator     | 多条规则间的预算规则，目前仅支持`and`和`or`两个值，分别代表全部满足或满足任意一个。                                                                       | string |

[Property dependencies](https://json-schema.org/understanding-json-schema/reference/object.html#id7)

## 选项依赖（未实现）

属性值的可选项根据其他属性的值决定，例如：省市属性的值为北京时，区县属性的可选值（enum）只有北京下的区县。

在区县属性下建立选项组，每个选项组匹配省市属性下的某个值。（为了降低复杂度，不要求所有的属性组都关联同一个属性下的不同选项。）

```json
{
  "enumGroups": [
    { "id": "选项组id", "label": "选项组名称", "assocEnum": { "property": "关联的属性id", "value": "关联属性的取值" } }
  ],
  "enum": [
    { "label": "选项1", "value": "选项1的值", "group": "选项组的id" },
    { "label": "选项2", "value": "选项2的值", "group": "选项组的id" }
  ]
}
```

## 使用组件

```js
import { JsonSchema } from 'tms-vue-ui'
```

```html
<tms-json-schema :schema="jsonSchema"></tms-json-schema>
```

> 注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态。

参考：https://json-schema.org
