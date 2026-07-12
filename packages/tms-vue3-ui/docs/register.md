# Register 注册表单

一个通用注册表单组件。结构与 `Login` 类似，但是字段名称为 register，且处理函数为 `fnRegister`。

## 注册

```ts
import { createApp } from 'vue'
import { Register } from 'tms-vue3-ui'

const app = createApp(App)
app.use(Register.install)  // 注册为 <tms-register />
app.mount('#app')
```

样式：

```ts
import 'tms-vue3-ui/dist/es/register/style/register.css'
```

## 基本用法

```vue
<script setup lang="ts">
import { Register } from 'tms-vue3-ui'

const schema = [
  { key: 'username',  type: 'text',     placeholder: '请输入用户名' },
  { key: 'password',  type: 'password', placeholder: '请输入密码' },
  { key: 'captcha',   type: 'captcha',  placeholder: '请输入验证码' },
]

const fnCaptcha = () => Promise.resolve({ code: 0, captcha: '<img src="/captcha">' })

const fnRegister = (data: Record<string, any>) => {
  console.log('注册数据', data)
  return Promise.resolve({ code: 0, msg: '注册成功' })
}
</script>

<template>
  <tms-register
    :schema="schema"
    :fn-captcha="fnCaptcha"
    :fn-register="fnRegister"
  />
</template>
```

## 对话框方式

```ts
Register.open({
  schema,
  fnCaptcha,
  fnRegister,
  closeAfterSuccess: true,
  onSuccess: () => alert('注册成功'),
})
```

## Props

| 属性                | 类型      | 默认值 | 说明                                       |
| ------------------- | --------- | ------ | ------------------------------------------ |
| `schema`            | Array     | —      | 表单项定义，同 Login 的 SubmitDataItem |
| `registerTip`      | Object    | —      | （可选）额外提示信息                      |
| `errorTip`          | Boolean   | `false` | 是否显示错误提示                         |
| `fnCaptcha`         | Function  | —      | 获取验证码                               |
| `fnRegister`        | Function  | —      | 注册处理函数                             |
| `onSuccess`         | Function  | —      | 成功回调                                 |
| `onFail`            | Function  | —      | 失败回调                                 |
| `asDialog`          | Boolean   | `false`| 以对话框形式渲染                         |
| `onClose`           | Function  | —      | 对话框关闭回调                            |
| `closeAfterSuccess` | Boolean   | `false` | 成功后自动关闭                          |

## 密码可见切换

在 `type: 'password'` 项中，用户可点击右侧的「眼睛图标」切换密码可见，
内部会动态切换输入框的 `type` 属性。

## 修改默认样式

组件默认样式通过以 `.tvu-register` 为前缀的 CSS 类实现，
在 `tms-vue3-ui/dist/es/register/style/register.css` 中定义，
结构与 Login 组件一致。

关键 CSS 类：

| 类名                                | 作用                                  |
| ----------------------------------- | ------------------------------------- |
| `.tvu-register__form`               | 表单根容器                            |
| `.tvu-register__form--modal`        | 对话框模式下的根容器                  |
| `.tvu-register__modal`              | 对话框遮罩层                          |
| `.tvu-register__input`              | 普通输入项包装                        |
| `.tvu-register__input input`        | 输入框                                |
| `.tvu-register__password--close::after` | 密码隐藏图标                       |
| `.tvu-register__password--open::after`  | 密码显示图标                       |
| `.tvu-register__captcha`            | 验证码项                              |
| `.tvu-register__error--tip`         | 错误提示文本                          |
| `.tvu-register__button`             | 注册按钮包装                          |

覆盖示例：

```css
.tvu-register__form {
  width: 420px;
  background: #fafafa;
  padding: 24px;
  border-radius: 12px;
}
.tvu-register__input input,
.tvu-register__captcha input {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}
.tvu-register__button button {
  background: #52c41a;
  color: #fff;
  border-radius: 6px;
}
.tvu-register__button button:hover {
  background: #73d13d;
}
```
