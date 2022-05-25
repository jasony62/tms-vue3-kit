<template>
  <div class="tvu-jse__enum-config">
    <div class="tvu-jse__enum-groups">
      <tvu-form-item class="tvu-jse__enum-group tvu-jse__field" v-for="(grp, i) in fieldAttrs.enumGroups" :key="i">
        <tvu-input v-model="grp.id"></tvu-input>
        <tvu-input v-model="grp.label"></tvu-input>
        <tvu-input v-model="grp.assocEnum.property"></tvu-input>
        <tvu-input v-model="grp.assocEnum.value"></tvu-input>
        <tvu-button @click="onDelEnumGroup(grp, i)">删除分组</tvu-button>
      </tvu-form-item>
      <tvu-button @click="onAddEnumGroup">新增分组</tvu-button>
    </div>
    <div class="tvu-jse__enum-options">
      <tvu-form-item class="tvu-jse__enum-option tvu-jse__field" v-for="(opt, i) in fieldAttrs[fieldAttrsType]"
        :key="i">
        <div>选项值</div>
        <tvu-input v-model="opt.value"></tvu-input>
        <div>选项显示内容</div>
        <tvu-input v-model="opt.label"></tvu-input>
        <div>选项所属分组</div>
        <tvu-input v-model="opt.group"></tvu-input>
        <tvu-checkbox v-model="fieldAttrs.default" :value="opt.value" label="默认项">
        </tvu-checkbox>
        <tvu-button @click="onDelEnumOption(opt, i)">删除选项</tvu-button>
      </tvu-form-item>
      <tvu-button @click="onAddEnumOption">新增选项</tvu-button>
    </div>
    <div class="tvu-jse__enum-range">
      <tvu-form-item class="tvu-jse__field" label="至少选">
        <tvu-input-number v-model="fieldAttrs.minItems"></tvu-input-number>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="最多选">
        <tvu-input-number v-model="fieldAttrs.maxItems"></tvu-input-number>
      </tvu-form-item>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { SchemaPropAttrs, EnumOption, EnumGroup } from './model'

const props = defineProps({
  fieldAttrs: { type: Object as PropType<SchemaPropAttrs>, required: true },
  fieldAttrsType: { type: String, default: "oneOf", required: true }
})

const onAddEnumGroup = () => {
  let newGroup = { id: `g${Date.now()}`, label: "newGroup", assocEnum: { property: '', value: '' } }
  if (!Array.isArray(props.fieldAttrs?.enumGroups)) {
    props.fieldAttrs.enumGroups = []
  }
  props.fieldAttrs?.enumGroups?.push(newGroup)
}

const onDelEnumGroup = (g: EnumGroup, i: number) => {
  props.fieldAttrs?.enumGroups?.splice(i, 1)
}

const onAddEnumOption = () => {
  props.fieldAttrs[props.fieldAttrsType]?.push({
    label: '新选项',
    value: 'newKey',
  })
}
const onDelEnumOption = (v: EnumOption, i: number) => {
  props.fieldAttrs[props.fieldAttrsType]?.splice(i, 1)
}
</script>