<template>
  <button @click="showSmsCodeDialog">对话框方式使用短信验证码框</button>
  <div>
    <p>页面引入组件方式使用短信验证码框：</p>
    <div class="w-2/5">
      <sms-code :schema="schema" action-text="登录"  :fn-send-code="fnSendCode" :fn-verify="fnVerify"
        :on-success="fnSuccessVerify" :fn-send-sms-code="fnSendSmsCode" :on-fail="fnFailVerify" >
      </sms-code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SmsCode } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/sms-code/style/tailwind.scss'
import { fnSendCode, fnVerify, schema,fnSendSmsCode } from '@/data/smscode'

const showSmsCodeDialog = () => {
  SmsCode.open({ schema, fnSendCode, fnVerify,fnSendSmsCode })
}
const fnSuccessVerify = (token: string) => {
  console.log('已获得token:' + token)
}
const fnFailVerify = (msg: string) => {
  console.log(msg)
}
</script>