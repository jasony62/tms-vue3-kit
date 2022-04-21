<template>
  <button @click="showLoginDialog">对话框方式使用登录框</button>
  <div>
    <p>页面引入组件方式使用登录框：</p>
    <div class="w-2/5">
      <tms-login :schema="schema" :fn-captcha="fnCaptcha" :fn-token="fnToken" :on-success="fnSuccessToken"
        :on-fail="fnFailToken">
      </tms-login>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Login as TmsLogin } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/login/style/tailwind.scss'
import { getCaptcha as fnCaptcha, getToken as fnToken, loginDataSchema as schema } from '../login'

const showLoginDialog = () => {
  TmsLogin.open({ schema, fnCaptcha, fnToken })
}
const fnSuccessToken = (token: string) => {
  console.log('已获得token:' + token)
}
const fnFailToken = (msg: string) => {
  console.log(msg)
}
</script>