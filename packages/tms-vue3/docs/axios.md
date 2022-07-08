# axios

支持通过拦截器添加请求参数，处理业务逻辑错误。

## 创建实例

```javascript
import { createApp } from 'vue'
import { TmsAxiosPlugin } from 'tms-vue3'

const app = createApp({})
app.use(TmsAxiosPlugin)

// 注意不需要new，返回的不是Class，是工厂方法
let name = 'tms-axios-1'
let rules = [] // 见下面的说明
let config = {} // 参考axios的config
let tmsAxios = app.TmsAxios({ name, rules, config })
```

在 Vue 的组件中使用之前创建实例。

```javascript
let name = 'tms-axios-1'
let tmsAxios = this.TmsAxios(name)
```

不通过 Vue 使用之前创建的实例。

```javascript
import { TmsAxios } from 'tms-vue3'
let name = 'tms-axios-1'
let tmsAxios = TmsAxios.ins(name)
```

## 指定拦截规则，给请求添加参数

```javascript
let rule = TmsAxios.newInterceptorRule({
  requestParams: new Map([['access_token', 'validaccesstoken']]),
})
let tmsAxios = TmsAxios.ins({ rules: [rule] })
```

参数可以通过函数提供，并且支持放回 promise，例如：

```javascript
requestParams: new Map([
  [
    'access_token',
    function () {
      return 'validaccesstoken'
    },
  ],
])
```

## 指定拦截规则，给请求添加头

```javascript
let rule = TmsAxios.newInterceptorRule({
  requestHeaders: new Map([['Authorization', 'Bearer valid-jwt']]),
})
let tmsAxios = TmsAxios.ins({ rules: [rule] })
```

请求头参数可以通过函数提供，并且支持放回 promise，例如：

```javascript
requestHeaders: new Map([
  [
    'Authorization',
    function () {
      return 'Bearer valid-jwt'
    },
  ],
])
```

## 指定拦截规则，重发请求

```javascript
let rule = TmsAxios.newInterceptorRule({
  onRetryAttempt: (res, rule) => {
    return new Promise((resolve) => {
      rule.requestParams.set('access_token', 'new_access_token')
      resolve(true)
    })
  },
})
let tmsAxiso = TmsAxios.ins({ rules: [rule] })
```

如果有多个重发请求规则，只要任意一个发生异常（reject），就不进行重发；如果有任意一个需要重发（返回 resolve(true）)，就进行重发。

只允许重发一次。

## 指定拦截规则，业务逻辑错误处理（返回结果中 code 不等于 0）

```javascript
let rule = TmsAxios.newInterceptorRule({
  onResultFault: (res, rule) => {
    return new Promise((resolve) => {
      console.log('发生业务逻辑错误', res.data)
      resolve(true)
    })
  },
})
let tmsAxiso = TmsAxios.ins({ rules: [rule] })
```

业务逻辑错误拦截器处理返回结果后，tms-vue 仍然会继续将执行 Promise.reject(res.data)，调用方应该使用 catch 进行接收。

使用方法参考测试用例：tms-axios.spec.js

发起请求的接口和 axios 一致，参考：https://github.com/axios/axios

## 指定连接规则，响应阶段失败处理

```javascript
rule = TmsAxios.newInterceptorRule({
  onResponseRejected: (err, rule) => {
    // 修复错误，或者转发错误
  },
})
let tmsAxios = TmsAxios.ins({ rules: [rule] })
```

响应失败处理不是对业务错误的处理（参考：onResultFault）,是在响应阶段对发生的异常的处理，例如：希望对调用请求过程中发生的异常做统一处理（用统一的弹出框显示），那么就可以在这里实现。但是，需要注意这是 promise 调用链中的一环，调用仍然会继续，只是插入了一个处理环节。
