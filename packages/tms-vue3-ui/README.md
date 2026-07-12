# tms-vue3-ui

Vue 3 + TypeScript 基础 UI 组件库，提供：

- 布局（`Frame`、`Flex`）
- 展示（`Card`、`Text`）
- 用户认证（`Login`、`Register`、`SmsCode`）
- 数据表单（`JsonDoc`）
- Schema 编辑器（`JsonSchema`）

样式通过 **Tailwind CSS v4** 处理，组件样式通过 `postcss` 编译为纯 CSS 文件，
消费端**不需要**依赖 Tailwind / PostCSS。

## 安装

使用 npm / pnpm：

```bash
pnpm add tms-vue3-ui
# 或者
npm install tms-vue3-ui
```

如果你的项目中也使用了 Tailwind（可选）：

```bash
pnpm add -D tailwindcss @tailwindcss/postcss postcss
```

## 注册组件

### 方式一：Vue `use` 全局注册（推荐）

在应用入口文件（例如 `main.ts`）中注册需要的组件：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { Frame, Flex, Card, Text, Login, Register, SmsCode, JsonDoc, JsonSchema } from 'tms-vue3-ui'

const app = createApp(App)

app.use(Frame)           // <tms-frame />
app.use(Flex)            // <tms-flex />
app.use(Card)            // <tms-card />
app.use(Text)            // <tms-text />
app.use(Login.install)   // <login /> 或 Login.open()
app.use(Register.install)// <register /> 或 Register.open()
app.use(SmsCode.install) // <sms-code /> 或 SmsCode.open()
app.use(JsonDoc)         // <json-doc />
app.use(JsonSchema.install) // <tms-json-schema />

app.mount('#app')
```

每个 `app.use(Xxx)` 会将组件注册为全局标签，组件使用的全局名称见下表：

| 组件     | 全局名称           |
| -------- | ------------------ |
| Frame    | `tms-frame`        |
| Flex     | `tms-flex`         |
| Card     | `tms-card`         |
| Text     | `tms-text`         |
| Login    | `login`            |
| Register | `register`         |
| SmsCode  | `sms-code`         |
| JsonDoc  | `json-doc`         |
| JsonSchema | `tms-json-schema` |

### 方式二：在单文件组件中直接引入

```vue
<script setup lang="ts">
import { Login } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/login/style/login.css'
</script>

<template>
  <Login :schema="..." :fn-login="..." />
</template>
```

### 方式三：以对话框方式打开（Login / Register / SmsCode）

```ts
import { Login } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/login/style/login.css'

Login.open({
  schema: [...],
  fnLogin: (data) => Promise.resolve({ code: 0, msg: 'ok' }),
  onSuccess: (resp) => console.log('登录成功', resp),
  closeAfterSuccess: true,
})
```

## 组件样式

组件样式打包在 `dist/es/<component>/style/<component>.css` 中。
全局注册 `app.use(Xxx)` 会自动加载样式；如果手动引入，使用显式 `import '...style/xxx.css'`。

| 组件        | 样式文件路径                                    |
| ----------- | ----------------------------------------------- |
| frame       | `tms-vue3-ui/dist/es/frame/style/frame.css`       |
| flex        | `tms-vue3-ui/dist/es/flex/style/flex.css`         |
| card        | `tms-vue3-ui/dist/es/card/style/card.css`         |
| text        | `tms-vue3-ui/dist/es/text/style/text.css`         |
| login       | `tms-vue3-ui/dist/es/login/style/login.css`       |
| register    | `tms-vue3-ui/dist/es/register/style/register.css` |
| sms-code    | `tms-vue3-ui/dist/es/sms-code/style/sms-code.css` |
| json-doc    | `tms-vue3-ui/dist/es/json-doc/style/json-doc.css` |
| json-schema | `tms-vue3-ui/dist/es/json-schema/style/json-schema.css` |

## 目录结构

```
packages/tms-vue3-ui/
├── src/
│   ├── index.ts            # 统一出口
│   ├── frame/              # 页面整体布局
│   ├── flex/               # 弹性布局
│   ├── card/               # 卡片
│   ├── text/               # 多行文本截断
│   ├── login/              # 登录表单
│   ├── register/           # 注册表单
│   ├── sms-code/           # 短信验证码登录
│   ├── json-doc/           # 根据 JSONSchema 生成表单
│   ├── json-schema/        # JSONSchema 编辑器
│   └── style/              # Tailwind 入口
├── docs/                   # 各组件详细用法
└── package.json
```

## 开发与构建

```bash
# 构建
node bin/build.js

# 产物
# dist/es/<component>/index.js
# dist/es/<component>/style/<component>.css
```

## 各组件文档

详细使用指南见 `docs/`：

- [frame.md](./docs/frame.md)
- [flex.md](./docs/flex.md)
- [card.md](./docs/card.md)
- [text.md](./docs/text.md)
- [login.md](./docs/login.md)
- [register.md](./docs/register.md)
- [sms-code.md](./docs/sms-code.md)
- [json-doc.md](./docs/json-doc.md)
- [json-schema.md](./docs/json-schema.md)
