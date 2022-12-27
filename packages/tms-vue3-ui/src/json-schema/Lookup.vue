<template>
  <tvu-form-item class="tvu-jse__field" label="获取填充值地址">
    <tvu-json v-model="prop.lookup"></tvu-json>
  </tvu-form-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  prop: { type: Object as PropType<any>, required: true }
})
</script>