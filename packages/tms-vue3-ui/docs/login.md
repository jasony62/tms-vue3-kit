# 登录框（login）

可指定用户名框、密码、验证码是否可见。

## 使用

同时支持组件调用和函数调用两种方式

(1) 组件调用

```template
<tms-login :on-success="fnOnSuccess" on-fail="fnOnFail"></tms-login>
```

```js
import Vue from 'vue'
import { Login } from 'tms-vue-ui'
Vue.use(Login, { schema, fnGetCaptcha, fnGetToken })
```

(2) 函数调用

```js
import Vue from 'vue'
import { Login } from 'tms-vue-ui'

const login = new Login(schema, fnGetCaptcha, fnGetToken)

let confirm = new Vue(login.component)
confirm.showAsDialog().then(fnOnSuccess)
```

| 参数         | 说明                                | 类型     | 默认值 | 备注                                       |
| ------------ | ----------------------------------- | -------- | ------ | ------------------------------------------ |
| schema       | 给后台传递的键和配置                | Array    | -      |                                            |
| fnGetCaptcha | 获得验证码的回调函数，返回 promise  | function | -      | {code: "0", msg: "\*\*", result:值为 svg } |
| fnGetToken   | 获得 token 的回调函数，返回 promise | function | -      | 
| loginTip   | 登录提示 | Object | -      | {text:''}
-                                          |

## 属性（props）

通过组件调用时，支持以下 Props：

| 参数       | 说明                      | 类型     | 默认值 |
| ---------- | ------------------------- | -------- | ------ |
| on-success | 获取 token 成功的回调函数 | Function | -      |
| on-fail    | 获取 token 失败的回调函数 | Function | -      |

```javascript
schema: [
  {
    // 当前双向绑定的属性名
    key: 'uname',
    // 组件类型
    type: 'text',
    placeholder: '用户名'
  },
  {
    key: 'password',
    type: 'password',
    placeholder: '密码'
  },
  {
    key: 'pin',
    type: 'code',
    placeholder: '验证码'
  }
]
```
