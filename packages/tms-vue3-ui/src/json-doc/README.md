根据指定`JSONSchema`生成表单，将表单和数据绑定。

`JSONSchema`支持 7 种（"null", "boolean", "object", "array", "number", "integer", or "string"）基本的属性类型，每个属性和特定输入控件对应。

`object`和`array`分为固定和自由两种情况。

除了 7 种属性类型，还包括元数据（title,description,error）和操作(submit)。

`schema`中的 `attrs`会作为`field`的初始值。

`items`是`{value,label}`的数组。

schema（定义）->field（字段）->vnode（节点）->form（表单）

# schema

| 属性        | 说明       | 是否必填 |
| ----------- | ---------- | -------- |
| type        | 类型       | 是       |
| title       | 标签名     | 否       |
| description | 描述       | 否       |
| required    | 是否必填   | 否       |
| value       | 默认值     | 否       |
| component   | 指定的组件 | 否       |

# parse 阶段

schema->field

field 是嵌套的关系
next 节点
\$开头的属性不显示

## field.name

## field.type

schema.type 有 6 种有效的 type，需要设置成对应的 field.type

`parser`将 schema 转换成输入控件，对应关系如下：

| schema  | 属性         | field    | 初始值                  |
| ------- | ------------ | -------- | ----------------------- |
| boolean | -            | checkbox | schema.checked 或 false |
| integer |              | number   |                         |
| number  |              |          | number                  |
| string  |              | text     |                         |
| string  | format=email | email    |                         |
| string  | format=uri   | url      |                         |
| string  | format=regex | text     |                         |
| enum    |              | select   |                         |
| oneOf   |              | radio    |                         |
| anyOf   |              | checkbox |                         |

## field.value

初始化 model 的值

`schema.defalut`或者`schema.attrs.value`

# render 阶段

替换默认组件

以最简单的 string 为例。

string => input

```js
const options = { on: { input: () => {}, change: this.changed } } // this是json-doc组件
createElement('input', options)
```

如果需要，用`label`包裹`input`。

```js
labelNodes.push(inputElement)
```

添加到组件列表中

```js
formControlsNodes.push(inputElement)
```

如果需要添加描述信息

```js
formControlsNodes.push(createElement('br'))
formControlsNodes.push(createElement('small', field.description))
```

创建 form

```js
createElement(components.form.tag, {}, allFormNodes)
```

form 被包裹在 div 中

每个输入字段

```js
return createElement('div', nodes)
```

```html
<div>
  <!-- schema.title -->
  <h1></h1>
  <!-- schema.description -->
  <p></p>
  <!-- error -->
  <div></div>
  <!--表单-->
  <form>
    <!-- 可选，嵌套表单有效-->
    <div class="sub-title"></div>
    <!-- 可选，嵌套表单有效-->
    <div class="sub">
      <!-- wrappingClass 可选 -->
      <div>
        <!-- label可选 -->
        <label>
          <!-- 可选 -->
          <span data-required-field="true/false">label的值</span>
          <input />
          <!--下面连个可选，如果属性有描述-->
          <br />
          <small></small>
        </label>
      </div>
    </div>
    <!--表单按钮-->
    <buttons></buttons>
  </form>
</div>
```

sub 是个奇怪的东西！

对象

对象指定了名字`name`，和属性`key`不一样

fields 是嵌套的

如果指定了 name 就不是按照层级关系，会和 root 并列，不影响数据对象的命名，也不影响显示顺序

通过 default 指定默认值

添加\$sub

formNode.root

formNode.指定的名字

发生在对象属性的循环里

记在根 fields 里，还是一个 name 命名的子 fields 里

添加 sub-title 用 sub 把每一个 form 包起来

参考：https://json-schema.org/draft/2019-09/json-schema-validation.html

在 parse 阶段完成数据的初始化？

# 错误处理

# 布局问题

提交和重置按钮

错误提示

嵌套

通过折叠面板解决

动态增减项

如何表示必选

creator

creator.render

支持 doc 瘦身
