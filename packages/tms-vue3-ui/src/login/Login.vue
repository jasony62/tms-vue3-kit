<template>
  <div ref="el" class="tvu-login__form" :class="{ 'tvu-login__form--modal': asDialog }">
    <div class="tvu-login__input" v-for="(item, index) in otherInputs" :key="index">
      <input :placeholder="item.placeholder" :type="item.type" v-model="submitData[item.key]" required />
    </div>
    <div class="tvu-login__captcha" v-if="captchaInput">
      <input :placeholder="captchaInput.placeholder" v-model="submitData[captchaInput.key]" required />
      <div ref="elCaptcha"></div>
      <button @click="refresh">刷新</button>
    </div>
    <div class="tvu-login__button">
      <button @click="login">登录</button>
    </div>
    <div v-if="asDialog" class="tvu-login__button">
      <button @click="close">关闭</button>
    </div>
    <div class="tvu-login__tip" v-if="loginTip">{{ loginTip?.text }}</div>
  </div>
  <div class="tvu-login__modal" v-if="asDialog"></div>
</template>
<script setup lang="ts">
import { reactive, PropType, ref, nextTick, onMounted } from 'vue';
import { SubmitDataItem, CaptchaResponse, LoginResponse } from '@/types';

// 支持通过属性传递需要数据和方法
const props = defineProps({
  schema: Array as PropType<SubmitDataItem[]>,
  loginTip: Object,
  fnCaptcha: Function as PropType<() => Promise<CaptchaResponse>>,
  fnLogin: Function as PropType<(data: { [key: string]: any }) => Promise<LoginResponse>>,
  onSuccess: { type: Function, default: () => { } },
  onFail: { type: Function, default: () => { } },
  asDialog: { type: Boolean, default: false },
  onClose: { type: Function },
})

// 组件的根节点
const el = ref(null as unknown as Element)

// 验证码节点
const elCaptcha = ref(null as unknown as Element)

// 使用通过属性传递的外部参数
let { schema, loginTip, fnLogin, fnCaptcha, onSuccess, onFail, asDialog, onClose } = props

// 用户提交的数据
const submitData = reactive({} as { [key: string]: string })

// 整理需要用户输入的数据，为了优化模板
const otherInputs = ref([] as SubmitDataItem[])
const captchaInput = ref()
if (schema && schema.length)
  schema.forEach((item: SubmitDataItem) => {
    if (item.type === 'captcha') {
      captchaInput.value = item
    } else {
      otherInputs.value.push(item)
    }
  })

/** 刷新验证码*/
const refresh = () => {
  if (elCaptcha?.value && typeof fnCaptcha === 'function') {
    fnCaptcha().then((response: CaptchaResponse) => {
      let { code, captcha } = response
      if (code !== 0) {
        elCaptcha.value.innerHTML = '获取失败'
      } else {
        elCaptcha.value.innerHTML = captcha
      }
    })
  }
}
/*执行登录操作*/
const login = () => {
  if (typeof fnLogin === 'function') {
    fnLogin(submitData).then((response: LoginResponse) => {
      let { code, msg } = response
      if (code !== 0) {
        refresh()
        // TODO 需要解决错误信息提示？
        return onFail(response)
      }
      onSuccess(response)
    })
  }
}
/*关闭对话框*/
const close = () => {
  if (typeof onClose === 'function') {
    onClose()
  } else {
    /*删除组件的父节点，实现关闭对话框。这个方法不好，应该避免。*/
    el.value.parentElement?.parentElement?.removeChild(el.value.parentElement)
  }
}

onMounted(() => {
  nextTick(() => refresh())
})
</script>