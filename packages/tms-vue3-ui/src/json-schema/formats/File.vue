<template>
  <div class="tvu-jse__field__file-attrs">
    <tvu-form-item class="tvu-jse__field" label="文件类型">
      <tvu-input v-model="formatAttrs.accept" placeholder="标准格式，如'png,jpeg'"></tvu-input>
    </tvu-form-item>
    <tvu-form-item class="tvu-jse__field" label="文件最大">
      <tvu-input v-model.number="formatAttrs.size" placeholder="请输入数字，默认以MB为单位"></tvu-input>
    </tvu-form-item>
    <tvu-form-item class="tvu-jse__field" label="文件个数">
      <tvu-input v-model.number="formatAttrs.limit" placeholder="请输入数字，0无意义"></tvu-input>
    </tvu-form-item>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  formatAttrs: { type: Object as PropType<{ accept: string, size: number, limit: number }>, required: true }
})
  // defaultFormatAttrs() {
  //   return { accept: '', size: null, limit: null }
  // }
</script>
