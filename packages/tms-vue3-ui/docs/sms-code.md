# SmsCode 短信验证码登录

结合 `captcha`（图形验证码）和 `smscode`（短信验证码）的登录/验证组件。

## 注册

```ts
import { createApp } from 'vue'
import { SmsCode } from 'tms-vue3-ui'

const app = createApp(App)
app.use(SmsCode.install) // 注册为 <tms-sms-code />
app.mount('#app')
```

样式：

```ts
import 'tms-vue3-ui/dist/es/sms-code/style/sms-code.css'
```

## 基本用法

```vue
<script setup lang="ts">
import { SmsCode } from 'tms-vue3-ui'

const schema = [
  { key: 'phone',    type: 'text',    placeholder: '请输入手机号' },
  { key: 'captcha',  type: 'captcha', placeholder: '请输入图形验证码' },
  { key: 'smscode',  type: 'smscode', placeholder: '请输入短信验证码' },
]

// 刷新图形验证码
const fnSendCode = () => Promise.resolve({ code: 0, captcha: '<img src="/captcha">' })

// 发送短信验证码
const fnSendSmsCode = (data) => {
  console.log('发送短信，基于 data.phone', data)
  return Promise.resolve({ code: 0 })
}

// 点击"验证"按钮
const fnVerify = (data) => {
  console.log('提交验证', data)
  return Promise.resolve({ code: 0, msg: '验证成功' })
}
</script>

<template>
  <tms-sms-code
    :schema="schema"
    action-text="登录"
    :fn-send-code="fnSendCode"
    :fn-send-sms-code="fnSendSmsCode"
    :fn-verify="fnVerify"
    :error-tip="true"
    :wait-input-sms-code-time="60"
  />
</template>
```

## 对话框方式

```ts
SmsCode.open({
  schema,
  fnSendCode,
  fnSendSmsCode,
  fnVerify,
  closeAfterSuccess: true,
})
```

## Props

| 属性                    | 类型     | 默认值 | 说明                                                 |
| ----------------------- | -------- | ------ | ---------------------------------------------------- |
| `schema`                | Array    | —      | 表单项，支持 `text` / `captcha` / `smscode`       |
| `actionText`            | String   | '验证' | 提交按钮的文本                                       |
| `smsCodeTip`           | Object   | —      | 提示信息                                             |
| `errorTip`              | Boolean  | `true` | 是否显示错误提示                                     |
| `fnSendCode`           | Function | —      | 获取图形验证码                                       |
| `fnSendSmsCode`        | Function | —      | 发送短信验证码的函数                                 |
| `fnVerify`              | Function | —      | 点击"验证"的处理函数                                 |
| `onSuccess`             | Function | —      | 成功回调                                             |
| `onFail`                | Function | —      | 失败回调                                             |
| `asDialog`              | Boolean  | `false`| 以对话框形式渲染                                     |
| `onClose`               | Function | —      | 对话框关闭回调                                       |
| `waitInputSmsCodeTime` | Number   | `60`   | 短信验证码发送后倒计时的秒数                        |
| `closeAfterSuccess`    | Boolean  | `false`| 成功后自动关闭对话框                                 |

## 处理流程

1. 用户进入页面 → 自动调用 `fnSendCode()` 刷新图形验证码。
2. 用户填写手机号与图形验证码，点击「获取短信验证码」→ 触发 `fnSendSmsCode(submitData)`。
   - 若返回 `code !== 0`，则在页面上显示 `msg`。
   - 若成功，按钮上开始倒计时（`waitInputSmsCodeTime` 秒），倒计时结束后可再次发送。
3. 用户填写短信验证码后，点击「验证」按钮 → 触发 `fnVerify(submitData)`。
   - `code === 0` 时认为验证成功，回调 `onSuccess`，其余情况回调 `onFail`。

## 修改默认样式

组件默认样式通过以 `.tvu-sms-code` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/sms-code/style/sms-code.css` 中定义，
结构与 Login/Register 类似，额外多了一个短信验证码项。

关键 CSS 类：

| 类名                             | 作用                               |
| -------------------------------- | ---------------------------------- |
| `.tvu-sms-code__form`            | 表单根容器                         |
| `.tvu-sms-code__form--modal`     | 对话框模式下的根容器               |
| `.tvu-sms-code__modal`           | 对话框遮罩层                       |
| `.tvu-sms-code__input`           | 普通输入项包装                     |
| `.tvu-sms-code__input input`     | 输入框                             |
| `.tvu-sms-code__captcha`         | 图形验证码项                       |
| `.tvu-sms-code__code`            | 短信验证码项（包含发送短信按钮） |
| `.tvu-sms-code__code button`     | 发送短信按钮                       |
| `.tvu-sms-code__error--tip`      | 错误提示文本                       |
| `.tvu-sms-code__button`          | 提交按钮包装                       |

覆盖示例：

```css
.tvu-sms-code__form {
  width: 420px;
  padding: 24px;
  background: #fafafa;
  border-radius: 12px;
}
.tvu-sms-code__input input,
.tvu-sms-code__captcha input,
.tvu-sms-code__code input {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}
.tvu-sms-code__code button,
.tvu-sms-code__button button {
  background: #1890ff;
  color: #fff;
  border-radius: 6px;
}
```
