# Login 登录表单

一个通用登录表单组件，支持：

- 通过 `schema` 定义任意数量的输入项（用户名/密码等）
- 支持文本/密码/图形验证码 3 种输入类型
- 点击登录后回调 `fnLogin`，成功 / 失败分别触发 `onSuccess` / `onFail`
- 支持直接嵌入页面，或以对话框方式弹出

## 注册

```ts
import { createApp } from 'vue'
import { Login } from 'tms-vue3-ui'

const app = createApp(App)
app.use(Login.install)  // 注册为全局组件 <tms-login />
app.mount('#app')
```

样式：

```ts
import 'tms-vue3-ui/dist/es/login/style/login.css'
```

## 基本用法

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { Login } from 'tms-vue3-ui'
import type { SubmitDataItem, CaptchaResponse, LoginResponse } from 'tms-vue3-ui'

const schema: SubmitDataItem[] = [
  { key: 'username', type: 'text',     placeholder: '请输入用户名', defaultValue: 'admin' },
  { key: 'password', type: 'password', placeholder: '请输入密码' },
  { key: 'captcha',  type: 'captcha',  placeholder: '请输入验证码' },
]

const fnCaptcha = (): Promise<CaptchaResponse> => {
  // 返回验证码内容（图片 / SVG / Base64 等均可）
  return Promise.resolve({ code: 0, captcha: '<img src="/captcha">' })
}

const fnLogin = (data: Record<string, any>): Promise<LoginResponse> => {
  console.log('提交的登录数据', data)
  return Promise.resolve({ code: 0, msg: '登录成功' })
}

const onSuccess = (resp: LoginResponse) => console.log('成功', resp)
const onFail = (resp: LoginResponse) => console.log('失败', resp)
</script>

<template>
  <tms-login
    :schema="schema"
    :fn-captcha="fnCaptcha"
    :fn-login="fnLogin"
    :on-success="onSuccess"
    :on-fail="onFail"
    :error-tip="true"
  />
</template>
```

## 以对话框方式打开

```ts
import { Login } from 'tms-vue3-ui'

Login.open({
  schema,
  fnCaptcha,
  fnLogin,
  closeAfterSuccess: true, // 登录成功后自动关闭
  onSuccess: (resp) => console.log('登录成功', resp),
})
```

当用户点击右上角 X 时触发 `onClose` 或自动销毁。

## schema 定义

```ts
type SubmitDataItem = {
  key: string           // 字段唯一标识，会作为提交数据的 key
  type: string         // 'text' | 'password' | 'captcha' | 'smscode'
  placeholder: string  // 占位符
  defaultValue?: string // 默认值（可选）
}
```

- `type: 'text'` — 普通输入框
- `type: 'password'` — 密码框，支持「显示 / 隐藏密码」
- `type: 'captcha'` — 图形验证码（右侧会出现验证码预览区域，按钮刷新）
- `type: 'smscode'` — 短信验证码（见 SmsCode 组件专门处理）

## Props

| 属性                | 类型      | 默认值 | 说明                                      |
| ------------------- | --------- | ------ | ----------------------------------------- |
| `schema`            | Array     | —      | 表单项定义                             |
| `loginTip`         | Object    | —      | 登录提示对象（可选）                    |
| `errorTip`          | Boolean   | `true` | 是否显示错误提示                         |
| `fnCaptcha`         | Function  | —      | 返回 `Promise<CaptchaResponse>`              |
| `fnLogin`          | Function  | —      | 登录处理函数，返回 `Promise<LoginResponse>`   |
| `onSuccess`        | Function  | —      | 登录成功回调                             |
| `onFail`           | Function  | —      | 登录失败回调                             |
| `asDialog`          | Boolean   | `false`| 是否以对话框形式渲染                        |
| `onClose`          | Function  | —      | 对话框关闭回调                             |
| `closeAfterSuccess`| Boolean   | `false`| 成功后自动关闭                            |

## 返回值约定

- `CaptchaResponse`

```ts
{
  code: number    // 0 = 成功，非 0 表示失败
  captcha: string // 显示在验证码区域的 HTML / 图片 / 文本
  [key: string]: any
}
```

- `LoginResponse`

```ts
{
  code: number // 0 = 登录成功，非 0 登录失败
  msg: string
  [key: string]: any
}
```

## 修改默认样式

组件默认样式通过以 `.tvu-login` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/login/style/login.css` 中定义，
其中混合了 Tailwind 的 utility class（如 `p-4`, `bg-white`, `rounded`）
和少量固定样式（如 `modal` 的位置 / z-index、密码显示/隐藏图标等）。

关键 CSS 类：

| 类名                             | 作用                           |
| -------------------------------- | ------------------------------ |
| `.tvu-login__form`               | 表单根容器，内嵌式正常流       |
| `.tvu-login__form--modal`        | 对话框模式下的根容器（居中 + 浮层） |
| `.tvu-login__modal`              | 对话框遮罩层（半透明黑色 + z-index:9999） |
| `.tvu-login__input`              | 普通输入项的包装               |
| `.tvu-login__input input`        | 输入框                         |
| `.tvu-login__password--close::after` | 密码隐藏图标                  |
| `.tvu-login__password--open::after`  | 密码显示图标                 |
| `.tvu-login__captcha`            | 验证码项（按钮 + 图片）        |
| `.tvu-login__error--tip`         | 错误提示文本                   |
| `.tvu-login__button`             | 登录按钮包装                   |

覆盖示例：

```css
/* 让表单宽度更大、背景更柔和 */
.tvu-login__form {
  width: 420px;
  padding: 24px;
  background: #fafafa;
  border-radius: 12px;
}

/* 修改输入框的边框与圆角 */
.tvu-login__input input,
.tvu-login__captcha input {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 8px 10px;
}

/* 按钮颜色调整 */
.tvu-login__button button {
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
}
.tvu-login__button button:hover {
  background: #40a9ff;
}

/* 调整对话框层级 */
.tvu-login__modal {
  z-index: 2000;
}
.tvu-login__form--modal {
  z-index: 2001;
}
```
