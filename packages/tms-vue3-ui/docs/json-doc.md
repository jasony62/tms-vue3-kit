# json 文档编辑器（json-doc）

根据指定的`JSONSchema`编辑 json 数据。

## 属性（props）

通过组件调用时，支持以下`props`：

| 参数              | 说明                         | 类型     | 默认值  |
| ----------------- | ---------------------------- | -------- | ------- |
| schema            | JSONSchema 定义              | Object   | -       |
| value             | 要编辑的 json 文档对象       | Object   | -       |
| fieldWrapClass    | 输入控件的包裹类             | String   | -       |
| showFieldFullname | 显示字段路径名称             | Boolean  | false   |
| onMessage         | 接收处理内部消息提醒的方法   | Function | alert() |
| autofillRequest   |                              | Function |         |
| onFileSelect      | 选择文件的方法               | Function |         |
| onFileUpload      | 上传文件并返回文件信息的方法 | Function |         |
| onFileDownload    | 文件下载方法                 | Function |         |

必须传入`schema`对象。支持`v-model`传递要编辑的 json 文档。

## 实例属性和方法

| 参数    | 说明               | 类型       |
| ------- | ------------------ | ---------- |
| editDoc | 返回文档操作对象。 | DocAsArray |

## 实例方法

| 参数    | 说明           |
| ------- | -------------- |
| editing | 返回文档对象。 |

| 参数名称    | 类型    | 说明                                 | 默认值 |
| ----------- | ------- | ------------------------------------ | ------ |
| --editing   |         |                                      |        |
| matchSchema | boolean | 表单中的数据是否必须和 schema 匹配。 | true   |

## 事件

通过组件调用时，支持以下事件：

| 名称      | 说明 | 参数 |
| --------- | ---- | ---- |
| jdocFocus |      | -    |
| jdocBlur  |      | -    |

## 上传文件

# 单元测试

# 其它
