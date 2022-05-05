<template>
  <div ref="el" class="tvu-login__form" :class="{ 'tvu-login__form--modal': asDialog }">
    <div class="tvu-login__input" v-for="(item, index) in otherInputs" :key="index">
      <input :placeholder="item.placeholder" :type="item.type" v-model="submitData[item.key]" required />
      <div v-if="item.type == 'password'" @click="checkPassword" ref="passwordIcon"></div>
    </div>
    <div class="tvu-login__captcha float-right" v-if="captchaInput">
      <input :placeholder="captchaInput.placeholder" v-model="submitData[captchaInput.key]" required />
      <div ref="elCaptcha"></div>
      <button @click="refresh"><svg t="1651202469806" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="932" width="33" height="33"><path d="M872.802928 755.99406 872.864326 755.99406 872.864326 755.624646Z" p-id="933"></path><path d="M922.268526 475.740168c-10.490935-10.727319-28.947286-10.815323-39.587624-0.366344l-18.368346 18.059308c-9.727549-206.461235-177.482227-367.192963-384.91458-367.192963-212.706473 0-385.751644 173.045171-385.751644 385.752668 0 212.720799 173.045171 385.766994 385.751644 385.766994 113.354698 0 220.62891-50.167586 293.924239-137.161916 3.2623-2.495844 5.907547-5.494131 7.907087-8.875135 0.26606-0.322341 0.557702-0.64673 0.853437-0.940418l1.880837-2.998287-0.618077-0.322341c1.26276-3.321652 1.851161-6.5246 1.851161-9.815553 0-16.077164-13.049201-29.155017-29.124318-29.155017-9.66922 0-18.721387 5.142114-23.982204 13.489222-62.806441 75.444273-154.911162 118.734218-252.691139 118.734218-181.244924 0-328.751443-147.447167-328.751443-328.721767 0-181.231621 147.506519-328.72279 328.751443-328.72279 180.070168 0 326.782601 145.509025 328.693114 325.122799l-32.709983-32.813337c-10.552334-10.623965-29.036313-10.653641-39.588647-0.086981-10.991332 10.933003-10.991332 28.712949-0.059352 39.660278l69.064982 69.226664c5.262864 5.320169 12.31549 8.229428 19.778462 8.229428l0.324388-0.028653 0.733711 0.23536c1.589195 0.38067 3.321652 0.851391 5.232165 0.851391 7.375991 0 14.34266-2.849908 19.633153-8.022721l71.445192-70.300113c5.348821-5.246491 8.346085-12.31549 8.405437-19.808138C930.410973 488.069985 927.529343 481.059314 922.268526 475.740168" p-id="934"></path></svg></button>
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

// 密码图标svg
const passwordIcon = ref(null as unknown as HTMLElement)
// 使用通过属性传递的外部参数
let { schema, loginTip, fnLogin, fnCaptcha, onSuccess, onFail, asDialog, onClose } = props

// 用户提交的数据
const submitData = reactive({} as { [key: string]: string })

// 整理需要用户输入的数据，为了优化模板
const otherInputs = ref([] as SubmitDataItem[])
const captchaInput = ref()
if (schema && schema.length)
  schema.forEach((item: SubmitDataItem) => {
    console.log('item',item,captchaInput)
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
      console.log('elCaptcha.value',elCaptcha.value)
      if (code !== 0) {
        elCaptcha.value.innerHTML = '获取失败'
      } else {
        elCaptcha.value.innerHTML = captcha
      }
    })
  }
}
// 查看密码 passwordIcon
const checkPassword = () => {
  // passwordIcon.value=JSON.parse(JSON.stringify(passwordIcon.value))
     console.log('checkPassword',passwordIcon.value)
    passwordIcon.value.innerHTML = '<svg t="1651214897797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1087" width="33" height="33"><path d="M469.333 681.387c-36.053-2.432-71.253-8.534-104.96-17.92L294.571 813.14a42.368 42.368 0 0 1-56.534 20.267 42.667 42.667 0 0 1-20.821-56.32l66.987-143.659a451.712 451.712 0 0 1-148.907-112.682 388.693 388.693 0 0 1-70.57-119.339 42.667 42.667 0 1 1 80.127-29.355 303.445 303.445 0 0 0 55.211 93.099c70.57 82.261 182.955 132.181 305.664 132.181 122.752 0 235.136-49.962 305.707-132.181a303.445 303.445 0 0 0 55.21-93.099 42.667 42.667 0 0 1 80.128 29.355 388.693 388.693 0 0 1-70.57 119.339 423.68 423.68 0 0 1-18.774 20.48l104.363 104.362a42.667 42.667 0 0 1-0.299 60.032 42.368 42.368 0 0 1-60.032 0.299L791.808 596.267c-20.48 14.08-42.24 26.581-65.024 37.418l66.901 143.36a42.667 42.667 0 0 1-20.821 56.363 42.368 42.368 0 0 1-56.533-20.267l-69.718-149.546a520.533 520.533 0 0 1-91.946 16.81v130.646A42.667 42.667 0 0 1 512 853.333c-23.723 0-42.667-18.944-42.667-42.24V681.387z" p-id="1088" fill="#515151"></path><path d="M176.128 524.373a42.368 42.368 0 0 1 60.032 0.256 42.667 42.667 0 0 1 0.299 60.075L115.243 705.92a42.368 42.368 0 0 1-60.075-0.299 42.667 42.667 0 0 1-0.299-60.032l121.259-121.258z" p-id="1089" fill="#515151"></path></svg>'
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
  nextTick(() => {
    refresh();
    checkPassword()
    })
})
</script>