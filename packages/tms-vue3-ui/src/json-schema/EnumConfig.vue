<template>
  <div class="tvu-jse__enum-config">
    <div class="tvu-jse__enum-groups"></div>
    <div class="tvu-jse__enum-options">
      <div class="tvu-jse__enum-options__header">
        <div>选项值</div>
        <div>选项显示内容</div>
        <div>选项所属分组</div>
      </div>
      <tvu-form-item class="tvu-jse__enum-option tvu-jse__input" v-for="(opt, i) in fieldAttrs.enum" :key="i">
        <tvu-input v-model="opt.value"></tvu-input>
        <tvu-input v-model="opt.label"></tvu-input>
        <tvu-input v-model="opt.group"></tvu-input>
        <div class="tvu-jse__enum-option__actions">
          <tvu-checkbox v-model="fieldAttrs.default" class="tvu-jse__checkbox" :value="opt.value" label="默认项">
          </tvu-checkbox>
          <tvu-button @click="onDelEnumOption(opt, i)">删除</tvu-button>
        </div>
      </tvu-form-item>
      <tvu-button @click="onAddEnumOption">新增选项</tvu-button>
    </div>
    <div class="tvu-jse__enum-range">
      <tvu-form-item class="tvu-jse__input" label="至少选">
        <tvu-input-number v-model="fieldAttrs.minItems"></tvu-input-number>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__input" label="最多选">
        <tvu-input-number v-model="fieldAttrs.maxItems"></tvu-input-number>
      </tvu-form-item>
    </div>
  </div>
</template>

<script>
import { BuildinComponents } from "./buildinComp"

export default {
  name: 'tvu-jse-enum-config',
  components: BuildinComponents,
  props: {
    fieldAttrs: { type: Object }
  },
  methods: {
    onAddEnumOption() {
      this.fieldAttrs.enum.push({
        label: '新选项',
        value: 'newKey',
      })
    },
    onDelEnumOption(v, i) {
      this.fieldAttrs.enum.splice(i, 1)
    },
  }
}
</script>