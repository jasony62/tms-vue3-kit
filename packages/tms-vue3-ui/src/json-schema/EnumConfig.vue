<template>
  <div class="tvu-jse__enum-config">
    <div class="tvu-jse__enum-groups">
      <tvu-form-item class="tvu-jse__enum-group tvu-jse__input" v-for="(grp, i) in fieldAttrs.enumGroups" :key="i">
        <tvu-input v-model="grp.id"></tvu-input>
        <tvu-input v-model="grp.label"></tvu-input>
        <tvu-input v-model="grp.assocEnum.property"></tvu-input>
        <tvu-input v-model="grp.assocEnum.value"></tvu-input>
        <div class="tvu-jse__gruop__actions">
          <tvu-button @click="onDelEnumGroup(grp, i)">删除</tvu-button>
        </div>
      </tvu-form-item>
      <tvu-button @click="onAddEnumGroup">新增分组</tvu-button>
    </div>
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
<script setup lang="ts">
import { PropType } from "vue";
import { SchemaPropAttrs, EnumOption, EnumGroup } from './model'

const props = defineProps({
  fieldAttrs: { type: Object as PropType<SchemaPropAttrs>, required: true }
})

const { fieldAttrs } = props

const onAddEnumGroup = () => {
  let newGroup = { id: `g${Date.now()}`, label: "newGroup", assocEnum: { property: '', value: '' } }
  fieldAttrs?.enumGroups?.push(newGroup)
}

const onDelEnumGroup = (g: EnumGroup, i: number) => {
  fieldAttrs?.enumGroups?.splice(i, 1)
}

const onAddEnumOption = () => {
  fieldAttrs?.enum?.push({
    label: '新选项',
    value: 'newKey',
  })
}
const onDelEnumOption = (v: EnumOption, i: number) => {
  fieldAttrs?.enum?.splice(i, 1)
}
</script>