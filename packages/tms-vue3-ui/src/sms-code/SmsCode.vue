<template>
  <div ref="el" class="tvu-sms-code__form" :class="{ 'tvu-sms-code__form--modal': asDialog }">
    <div class="tvu-sms-code__input" v-for="(item, index) in otherInputs" :key="index">
      <input :placeholder="item.placeholder" :type="item.type" v-model="submitData[item.key]" required />
    </div>
    <div class="tvu-captcha__code" v-if="captchaInput">
      <input :placeholder="captchaInput.placeholder" v-model="submitData[captchaInput.key]" required />
      <div ref="elCaptcha"></div>
      <button @click="sendCaptcha"></button>
    </div>
    <div class="tvu-sms-code__code" v-if="codeInput"  :class="{ 'tvu-sms-code__form--modal': codeDialog }">
      <input :placeholder="codeInput.placeholder" v-model="submitData[codeInput.key]" required />
      <button @click="sendSmsCode"></button>
    </div>
    <div class="tvu-sms-code__button">
      <button @click="verify">{{ actionText }}</button>
    </div>
    <div v-if="asDialog" class="tvu-sms-code__button">
      <button @click="close">关闭</button>
    </div>
    <div class="tvu-sms-code__tip" v-if="smsCodeTip">{{ smsCodeTip?.text }}</div>
  </div>
  <div class="tvu-sms-code__modal" v-if="asDialog"></div>
</template>

<script setup lang="ts">
import { reactive, PropType, ref, nextTick, onMounted } from 'vue';
import { SubmitDataItem,CaptchaResponse } from '@/types';
// 支持通过属性传递需要数据和方法
const props = defineProps({
  schema: Array as PropType<SubmitDataItem[]>,
  actionText: { default: '验证' },
  smsCodeTip: Object,
  fnSendCode: Function,
  fnSendSmsCode:Function,
  fnVerify: Function,
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
let { schema, smsCodeTip, fnVerify, fnSendCode,fnSendSmsCode, onSuccess, onFail, asDialog, onClose } = props
// 用户要提交的数据
const submitData = reactive({} as { [key: string]: string })

// 整理需要用户输入的数据，为了优化模板
const otherInputs = ref([] as SubmitDataItem[])
const codeInput = ref()
const captchaInput = ref()
if (schema && schema.length)
  schema.forEach((item: SubmitDataItem) => {
    if (item.type === 'smscode') {
      codeInput.value = item
    }else if(item.type === 'captcha'){
      captchaInput.value = item
    } else {
      otherInputs.value.push(item)
    }
  })

const sendSmsCode = () => {
  if (typeof fnSendSmsCode === 'function') {
    fnSendSmsCode(submitData).then((response: any) => {
      let { code, result } = response
      if (code !== 0) {
      }
    })
  }
}
const sendCaptcha = () => {
  if (elCaptcha?.value && typeof fnSendCode === 'function') {
    fnSendCode().then((response: CaptchaResponse) => {
      let { code, captcha } = response
      if (code !== 0) {
        elCaptcha.value.innerHTML = '获取失败'
      } else {
        elCaptcha.value.innerHTML = captcha
      }
    })
  }
}
const verify = () => {
  if (typeof fnVerify === 'function') {
    fnVerify(submitData).then((response: any) => {
      let { code, result, msg } = response
      if (code !== 0) {
        sendSmsCode()
        // TODO 如何解决错误信息提示？
        return onFail(response)
      }
      onSuccess(result.access_token)
    })
  }
}

const close = () => {
  if (typeof onClose === 'function') {
    onClose()
  } else {
    /*删除组件的父节点，实现关闭对话框。这个方法不好，应该避免。*/
    el.value.parentElement?.parentElement?.removeChild(el.value.parentElement)
  }
}

onMounted(() => {
  nextTick(() => sendCaptcha())
})
</script>