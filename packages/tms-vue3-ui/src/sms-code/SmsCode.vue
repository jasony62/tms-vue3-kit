<template>
  <div ref="el" class="tvu-sms-code__form" :class="{ 'tvu-sms-code__form--modal': asDialog }">
    <div class="tvu-sms-code__input" v-for="(item, index) in otherInputs" :key="index">
      <input :placeholder="item.placeholder" :type="item.type" v-model="submitData[item.key]" required />
    </div>
    <div class="tvu-sms-code__code" v-if="codeInput">
      <input :placeholder="codeInput.placeholder" v-model="submitData[codeInput.key]" required />
      <button @click="sendCode">获取验证码</button>
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
import { SubmitDataItem } from '@/types';

// 支持通过属性传递需要数据和方法
const props = defineProps({
  schema: Array as PropType<SubmitDataItem[]>,
  actionText: { default: '验证' },
  smsCodeTip: Object,
  fnSendCode: Function,
  fnVerify: Function,
  onSuccess: { type: Function, default: () => { } },
  onFail: { type: Function, default: () => { } },
  asDialog: { type: Boolean, default: false },
  onClose: { type: Function },
})

// 组件的根节点
const el = ref(null as unknown as Element)

// 使用通过属性传递的外部参数
let { schema, smsCodeTip, fnVerify, fnSendCode, onSuccess, onFail, asDialog, onClose } = props

// 用户要提交的数据
const submitData = reactive({} as { [key: string]: string })

// 整理需要用户输入的数据，为了优化模板
const otherInputs = ref([] as SubmitDataItem[])
const codeInput = ref()
if (schema && schema.length)
  schema.forEach((item: SubmitDataItem) => {
    if (item.type === 'smscode') {
      codeInput.value = item
    } else {
      otherInputs.value.push(item)
    }
  })

const sendCode = () => {
  if (typeof fnSendCode === 'function') {
    fnSendCode().then((response: any) => {
      let { code, result } = response
      if (code !== 0) {
      }
    })
  }
}

const verify = () => {
  if (typeof fnVerify === 'function') {
    fnVerify(submitData).then((response: any) => {
      let { code, result, msg } = response
      if (code !== 0) {
        sendCode()
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
  nextTick(() => sendCode())
})
</script>