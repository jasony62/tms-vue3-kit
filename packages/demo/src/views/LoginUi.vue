<template>
  <button @click="showLoginDialog">对话框方式使用登录框</button>
  <div>
    <p>页面引入组件方式使用登录框：</p>
    <div class="w-2/5">
      <login :schema="schema" :fn-captcha="fnCaptcha" :fn-login="fnLogin" :on-success="fnSuccessLogin"
        :on-fail="fnFailLogin">
      </login>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Login } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/login/style/tailwind.scss'
import { schema, fnCaptcha, fnLogin, LoginResponse } from '@/data/login'

const showLoginDialog = () => {
  Login.open({ schema, fnCaptcha, fnLogin })
}

const fnSuccessLogin = (response: LoginResponse) => {
  console.info('登录成功', response)
}

const fnFailLogin = (response: LoginResponse) => {
  console.info('登录失败', response)
}
</script>