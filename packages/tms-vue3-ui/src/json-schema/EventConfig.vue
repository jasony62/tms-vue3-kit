<template>
  <div class="tvu-jse__event-config">
    <tvu-form-item label="地址">
      <tvu-input v-model="rule.url"></tvu-input>
    </tvu-form-item>
    <div><span v-for="(value, key) in rule.params" :key="key">{{ value }}</span>
    </div>
    <tvu-form-item class="tvu-jse__input" label="返回值">
      <tvu-select v-model="rule.type">
        <tvu-option label="作为填入值" value="v1"></tvu-option>
        <tvu-option label="作为可选项" value="v2"></tvu-option>
      </tvu-select>
    </tvu-form-item>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    rule: { type: Object, required: true }
  },
}
</script>