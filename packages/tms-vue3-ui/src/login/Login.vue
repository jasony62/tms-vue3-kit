<template>
  <div ref="el" class="tvu-login__form" :class="{ 'tvu-login__form--modal': asDialog }">
    <div class="tvu-login__input" v-for="(item, index) in otherInputs" :key="index">
      <input :placeholder="item.placeholder" :type="item.type" v-model="loginData[item.key]" required />
    </div>
    <div class="tvu-login__captcha" v-if="captchaInput">
      <input :placeholder="captchaInput.placeholder" v-model="loginData[captchaInput.key]" required />
      <div ref="elCaptcha" :style="{ width: '150px', height: '44px' }"></div>
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

// 调用方指定的登录字段定义
interface Item {
  key: string
  type: string
  placeholder: string
}

// 支持通过属性传递需要数据和方法
const props = defineProps({
  schema: Array as PropType<Item[]>,
  loginTip: Object,
  fnCaptcha: Function,
  fnToken: Function,
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
let { schema, loginTip, fnToken, fnCaptcha, onSuccess, onFail, asDialog, onClose } = props

const loginData = reactive({} as { [key: string]: string })

// 整理需要用户输入的数据，为了优化模板
const otherInputs = ref([] as Item[])
const captchaInput = ref()
if (schema && schema.length)
  schema.forEach((item: Item) => {
    if (item.type === 'code') {
      captchaInput.value = item
    } else {
      otherInputs.value.push(item)
    }
  })

const refresh = () => {
  if (elCaptcha.value && typeof fnCaptcha === 'function') {
    fnCaptcha().then((response: any) => {
      let { code, result } = response
      if (code !== 0) {
        result =
          '<div style="background:#f5f5f5;color:red;text-align:center;font-size:14px;line-height:44px;">获取错误</div>'
      }
      elCaptcha!.value.innerHTML = result
    })
  }
}

const login = () => {
  if (typeof fnToken === 'function') {
    fnToken(loginData).then((response: any) => {
      let { code, result, msg } = response
      if (code !== 0) {
        refresh()
        // TODO 如何解决错误信息提示？
        return onFail(response)
      }
      // if (asDialog) this.$emit('success', result.access_token)

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
  nextTick(() => refresh())
})
</script>