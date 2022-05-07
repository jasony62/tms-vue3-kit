<template>
  <button @click="showRegisterDialog">对话框方式使用注册框</button>
  <div>
    <p>页面引入组件方式使用注册框：</p>
    <div class="w-2/5">
      <register :schema="schema" :fn-captcha="fnCaptcha" :fn-register="fnRegister" :on-success="fnSuccessToken"
        :on-fail="fnFailToken">
      </register>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Register } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/register/style/tailwind.scss'
import { fnCaptcha, fnRegister, schema } from '@/data/register'

const showRegisterDialog = () => {
  Register.open({ schema, fnCaptcha, fnRegister })
}
const fnSuccessToken = (token: string) => {
  console.log('已获得token:' + token)
}
const fnFailToken = (msg: string) => {
  console.log(msg)
}
</script>