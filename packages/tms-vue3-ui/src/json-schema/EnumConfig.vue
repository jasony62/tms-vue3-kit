<template>
  <div class="tvu-jse__enum-config">
    <div class="tvu-jse__enum-groups">
      <tvu-form-item class="tvu-jse__enum-group tvu-jse__field" v-for="(grp, i) in fieldAttrs.enumGroups" :key="i">
        <div>分组ID</div>
        <tvu-input v-model="grp.id"></tvu-input>
        <div>分组名称</div>
        <tvu-input v-model="grp.label"></tvu-input>
        <div>分组生效属性名</div>
        <tvu-input v-model="grp.assocEnum.property"></tvu-input>
        <div>分组生效属性值</div>
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
        <tvu-button @click="onDelEnumOption(opt, i)">删除选项</tvu-button>
      </tvu-form-item>
      <tvu-button @click="onAddEnumOption">新增选项</tvu-button>
    </div>
    <div class="tvu-jse__enum-default">
      <tvu-form-item class="tvu-jse__field" label="默认选项">
        <tvu-select v-model="optionAsDefault" @change="onChangeDefaultOption">
          <tvu-option label="无" value=""></tvu-option>
          <tvu-option :label="opt.label" :value="opt.value" v-for="(opt, i) in fieldAttrs[fieldAttrsType]"></tvu-option>
        </tvu-select>
      </tvu-form-item>
    </div>
    <div class="tvu-jse__enum-range">
      <tvu-form-item class="tvu-jse__field" label="至少选">
        <tvu-input-number v-model.number="fieldAttrs.minItems"></tvu-input-number>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="最多选">
        <tvu-input-number v-model.number="fieldAttrs.maxItems"></tvu-input-number>
      </tvu-form-item>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue";
import { SchemaPropAttrs, EnumOption, EnumGroup } from 'tms-data-aid/dist/json-schema/model'

const props = defineProps({
  fieldAttrs: { type: Object as PropType<SchemaPropAttrs>, required: true },
  fieldAttrsType: { type: String, default: "oneOf", required: true }
})

// 默认选项
const optionAsDefault = ref<any>(props.fieldAttrs.default)
// 修改默认选项
const onChangeDefaultOption = () => {
  if (optionAsDefault.value) props.fieldAttrs.default = optionAsDefault.value
  else delete props.fieldAttrs.default
}

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