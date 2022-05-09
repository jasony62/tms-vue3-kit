<template>
  <div ref="el" class="tvu-register__form" :class="{ 'tvu-register__form--modal': asDialog }">
    <div class="tvu-register__input" v-for="(item, index) in otherInputs" :key="index">
      <input :placeholder="item.placeholder" :type="item.type" v-model="submitData[item.key]" required />
      <span v-if="item.type == 'password'" ref="passwordEle" @click="checkPassword(item.key)" :class="{'tvu-register__password--close':!passwordIcon[item.key],'tvu-register__password--open':passwordIcon[item.key]}"></span>
    </div>
    <div class="tvu-register__captcha" v-if="captchaInput">
      <input :placeholder="captchaInput.placeholder" v-model="submitData[captchaInput.key]" required />
      <div ref="elCaptcha" :style="{ width: '150px', height: '44px' }"></div>
      <button @click="refresh"></button>
    </div>
    <div class="tvu-register__button">
      <button @click="register">注册</button>
    </div>
    <div v-if="asDialog" class="tvu-register__button">
      <button @click="close">关闭</button>
    </div>
    <div class="tvu-register__tip" v-if="registerTip">{{ registerTip?.text }}</div>
  </div>
  <div class="tvu-register__modal" v-if="asDialog"></div>
</template>
<script setup lang="ts">
import { reactive, PropType, ref, nextTick, onMounted,toRaw } from 'vue';
import { SubmitDataItem, CaptchaResponse } from '@/types';
interface passwordIcon {
  password: Boolean,
  password2: Boolean
}
// 支持通过属性传递需要数据和方法
const props = defineProps({
  schema: Array as PropType<SubmitDataItem[]>,
  registerTip: Object,
  fnCaptcha: Function as PropType<() => Promise<CaptchaResponse>>,
  fnRegister: Function,
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
let { schema, registerTip, fnRegister, fnCaptcha, onSuccess, onFail, asDialog, onClose } = props

// 用户要提交的数据
const submitData = reactive({} as { [key: string]: string })
// 密码节点
const passwordEle = ref(null as unknown as Element)
// 密码图标svg
let passwordIcon = reactive({ password: false, password2: false } as passwordIcon);
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
// 查看密码 passwordIcon
const checkPassword = (key:string) => {
  passwordIcon[key] = !passwordIcon[key]
  const list = toRaw(passwordEle.value)
  if(key == 'password'){
    if(passwordIcon[key]){
      list[0].previousSibling.type = 'text'
    }else{
      list[0].previousSibling.type = 'password'
    }
  } else {
    if(passwordIcon[key]){
      list[1].previousSibling.type = 'text'
    }else{
      list[1].previousSibling.type = 'password'
    }
  }
}
const register = () => {
  if (typeof fnRegister === 'function') {
    fnRegister(submitData).then((response: any) => {
      let { code, msg } = response
      if (code !== 0) {
        refresh()
        // TODO 如何解决错误信息提示？
        return onFail(response)
      }
      onSuccess(response)
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
  nextTick(() => refresh())
})
</script>