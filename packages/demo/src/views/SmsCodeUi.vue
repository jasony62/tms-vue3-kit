<template>
  <button @click="showRegisterDialog">对话框方式使用短信验证码框</button>
  <div>
    <p>页面引入组件方式使用短信验证码框：</p>
    <div class="w-2/5">
      <sms-code :schema="schema" action-text="登录" :fn-captcha="fnCaptcha" :fn-register="fnVerify"
        :on-success="fnSuccessToken" :on-fail="fnFailToken">
      </sms-code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SmsCode } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/sms-code/style/tailwind.scss'
import { getCaptcha as fnCaptcha, fnVerify, loginDataSchema as schema } from '../data/smscode'

const showRegisterDialog = () => {
  SmsCode.open({ schema, fnCaptcha, fnVerify })
}
const fnSuccessToken = (token: string) => {
  console.log('已获得token:' + token)
}
const fnFailToken = (msg: string) => {
  console.log(msg)
}
</script>