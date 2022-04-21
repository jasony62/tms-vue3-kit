# 在线组件（comp-online）

显示`tms-vue`中的`runtime-lib`加载的组件。

```js
import { CompOnline } from 'tms-vue-ui'
```

```html
<comp-online :url="url" :includeCss="includeCss" :props="onlineProps" :events="onlineEvents"></comp-online>
```

## 属性（props）

通过组件调用时，支持以下 Props：

| 属性       | 说明                                                   | 类型    | 默认值 |
| ---------- | ------------------------------------------------------ | ------- | ------ |
| url        | 在线组件的地址，参考：`runtime-lib`。                  | String  | -      |
| includeCss | 是否包含 css 文件。                                    | Boolean | -      |
| props      | 在线组件的接收的属性（和 Vue 组件中的 props 对应）。   | Object  | -      |
| events     | 在线组件事件名称的数组，这些事件会通过`emit`向外抛出。 | Array   | -      |
