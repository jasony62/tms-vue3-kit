<template>
  <div ref="el" class="tvu-sms-code__form" :class="{ 'tvu-sms-code__form--modal': asDialog }">
    <div class="tvu-sms-code__input" v-for="(item, index) in otherInputs" :key="index">
      <input :placeholder="item.placeholder" :type="item.type" v-model="submitData[item.key]" required />
    </div>
    <div class="tvu-captcha__code" v-if="captchaInput">
      <input :placeholder="captchaInput.placeholder" v-model="submitData[captchaInput.key]" required />
      <div ref="elCaptcha"></div>
      <button @click="sendCaptcha()"></button>
    </div>
    <div class="tvu-sms-code__code" v-if="codeInput" >
      <input :placeholder="codeInput.placeholder" v-model="submitData[codeInput.key]" required />
      <button ref="elSmsCode" :disabled="codeDisabled" @click="sendSmsCode">获取短信验证码</button>
    </div>
    <div class="tvu-sms-code__error--tip" v-if="errorTip&&errorTipInfo"><i></i>{{ errorTipInfo || 'error' }}</div>
    <div class="tvu-sms-code__button">
      <button  @click="verify">{{ actionText }}</button>
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
  errorTip: { type: Boolean, default: false },
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
// 发送短信按钮节点
const elSmsCode = ref(null as unknown as Element)

// 使用通过属性传递的外部参数
let { schema, smsCodeTip, fnVerify, fnSendCode,fnSendSmsCode, onSuccess, onFail,errorTip, asDialog, onClose } = props
// 用户要提交的数据
const submitData = reactive({} as { [key: string]: string })
const errorTipInfo = ref()
// 整理需要用户输入的数据，为了优化模板
const otherInputs = ref([] as SubmitDataItem[])
const codeInput = ref()
const captchaInput = ref()
const codeDisabled = ref(false)
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
  submitData[codeInput.value.key] = ''
  codeDisabled.value = true
  let time = 60;
  let timer = setInterval(function () {
    // 判断剩余秒数
    if (time == 0) {
      // 清除定时器和复原按钮
      clearInterval(timer);
      codeDisabled.value = false;
      elSmsCode.value.innerHTML = "获取短信验证码";
    } else {
      elSmsCode.value.innerHTML = time + "秒后重发";
      time--;
    }
  }, 1000);
  if (typeof fnSendSmsCode === 'function') {
    fnSendSmsCode(submitData).then((response: any) => {
      let { code, result, msg } = response
      if (code !== 0) {
        errorTipInfo.value = msg || '获取短信验证码失败'
        return onFail(response)
      }else{
        errorTipInfo.value = ''
      }
    })
  }
}
const sendCaptcha = () => {
  submitData[captchaInput.value.key] = ''
  submitData[codeInput.value.key] = ''
  if (elCaptcha?.value && typeof fnSendCode === 'function') {
    fnSendCode().then((response: CaptchaResponse) => {
      let { code, captcha, msg } = response
      if (code !== 0) {
        errorTipInfo.value = msg || '获取图形验证码失败'
        elCaptcha.value.innerHTML = '获取失败'
      } else {
        errorTipInfo.value = ''
        elCaptcha.value.innerHTML = captcha
      }
    })
  }
}
const verify = () => {
  const keys = schema?.map(item=> {return item['key']})
  const missFields = keys?.filter((field) => {
    return !submitData[field]
  })
  if(missFields?.length){
    errorTipInfo.value = '缺少必填信息'
    return onFail({msg:'缺少必填信息'})
    }
  if (typeof fnVerify === 'function') {
    fnVerify(submitData).then((response: any) => {
      let { code, result, msg } = response
      if (code !== 0) {
        sendCaptcha()
        // TODO 如何解决错误信息提示？
        errorTipInfo.value = msg || '登录失败'
        return onFail(response)
      }
      errorTipInfo.value = ''
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