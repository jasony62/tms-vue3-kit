<template>
  <tvu-form-item class="tvu-jse__field" label="获取填充值地址">
    <tvu-input v-model="autofill.url"></tvu-input>
  </tvu-form-item>
  <tvu-form-item class="tvu-jse__field" label="HTTP方法">
    <tvu-select v-model="autofill.method">
      <tvu-option label="GET" value="GET"></tvu-option>
      <tvu-option label="POST" value="POST"></tvu-option>
    </tvu-select>
  </tvu-form-item>
  <tvu-form-item class="tvu-jse__field tvu-jse__field--json" label="查询参数">
    <tvu-json v-model="autofill.params"></tvu-json>
  </tvu-form-item>
  <tvu-form-item v-if="autofill.method === 'POST'" class="tvu-jse__field tvu-jse__field--json" label="POST请求消息体">
    <tvu-json v-model="autofill.body"></tvu-json>
  </tvu-form-item>
  <tvu-form-item class="tvu-jse__field" label="填充位置">
    <tvu-select v-model="autofill.target">
      <tvu-option label="作为填入值" value="value"></tvu-option>
      <tvu-option label="作为可选项" value="items"></tvu-option>
    </tvu-select>
  </tvu-form-item>
  <tvu-form-item class="tvu-jse__field" label="执行策略">
    <tvu-select v-model="autofill.runPolicy">
      <tvu-option label="表单创建时执行1次" value="onCreate"></tvu-option>
      <tvu-option label="依赖参数更新时执行1次" value="onParamChange"></tvu-option>
      <tvu-option label="用户执行" value="onUser"></tvu-option>
    </tvu-select>
  </tvu-form-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { PropAutofill } from './model';

const props = defineProps({
  autofill: { type: Object as PropType<PropAutofill>, required: true }
})
  // defaultFormatAttrs() {
  //   return { accept: '', size: null, limit: null }
  // }
</script>