<template>
  <div class="tvu-jse tvu-jse--layout-default">
    <!--属性列表部分-->
    <div class="tvu-jse__fields">
      <div class="tvu-jse__field" :class="f === data.currField ? 'tvu-jse__field--active' : ''" v-for="f in fields">
        <div @click="onClickField(f)">{{ f.path ? f.path + '.' : '' }}{{ f.name }}</div>
      </div>
    </div>
    <!--属性编辑部分-->
    <div class="tvu-jse__field-editor">
      <div class="tvu-jse__field-form">
        <tvu-form-item class="tvu-jse__input" label="键值">
          <tvu-input v-model="data.currField.name"></tvu-input>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="类型">
          <tvu-select v-model="data.currField.attrs.type">
            <tvu-option label="integer" value="integer"></tvu-option>
            <tvu-option label="number" value="number"></tvu-option>
            <tvu-option label="string" value="string"></tvu-option>
            <tvu-option label="object" value="object"></tvu-option>
            <tvu-option label="array" value="array"></tvu-option>
            <tvu-option label="boolean" value="boolean"></tvu-option>
            <tvu-option label="json" value="json"></tvu-option>
            <tvu-option label="null" value="null"></tvu-option>
          </tvu-select>
        </tvu-form-item>
        <tvu-form-item v-if="data.currField.attrs.type === 'array'" class="tvu-jse__input" label="子对象类型">
          <tvu-select v-model="data.currField.items.type">
            <tvu-option label="integer" value="integer"></tvu-option>
            <tvu-option label="number" value="number"></tvu-option>
            <tvu-option label="string" value="string"></tvu-option>
            <tvu-option label="object" value="object"></tvu-option>
            <tvu-option label="array" value="array"></tvu-option>
            <tvu-option label="boolean" value="boolean"></tvu-option>
            <tvu-option label="json" value="json"></tvu-option>
            <tvu-option label="null" value="null"></tvu-option>
          </tvu-select>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="子对象格式" v-if="formats">
          <tvu-select v-model="data.currField.attrs.format" placeholder="请选择格式">
            <tvu-option v-for="format in formats" :key="format.value" :label="format.label" :value="format.value">
            </tvu-option>
          </tvu-select>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="格式" v-if="formats2">
          <tvu-select v-model="data.currField.items.format" placeholder="请选择格式">
            <tvu-option v-for="format in formats2" :key="format.value" :label="format.label" :value="format.value">
            </tvu-option>
          </tvu-select>
        </tvu-form-item>
        <component :is="compFormatAttrs" v-bind.sync="data.currField.items?.formatAttrs"></component>
        <tvu-form-item class="tvu-jse__input" label="标题">
          <tvu-input v-model="data.currField.attrs.title" placeholder="标题"></tvu-input>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="描述">
          <tvu-input v-model="data.currField.attrs.description" placeholder="描述"></tvu-input>
        </tvu-form-item>
        <tvu-form-item label="必填">
          <tvu-checkbox v-model="data.currField.attrs.required"></tvu-checkbox>
        </tvu-form-item>
        <tvu-form-item label="可否分组">
          <tvu-checkbox v-model="data.currField.attrs.groupable"></tvu-checkbox>
        </tvu-form-item>
        <tvu-form-item label="设置选项">
          <tvu-checkbox v-model="hasEnum" @change="onChangeHasEnum"></tvu-checkbox>
        </tvu-form-item>
        <div class="tvu-jse__enum" v-if="hasEnum">
          <tvu-jse-enum-config :field-attrs="data.currField.attrs"></tvu-jse-enum-config>
        </div>
        <tvu-form-item class="tvu-jse__input" label="默认值" v-if="!hasEnum">
          <tvu-input v-model="data.currField.attrs.default"></tvu-input>
        </tvu-form-item>
        <div v-if="onUpload && data.currField.attrs.type === 'array' && data.currField.items">
          <tvu-jse-attachment :field-attrs="data.currField.attrs" :on-upload="onUpload"></tvu-jse-attachment>
        </div>
        <tvu-jse-event-config v-if="data.currField.eventDependency?.rule" :rule="data.currField.eventDependency.rule">
        </tvu-jse-event-config>
        <!-- <slot name="extKeywords" :schema="data.currField.attrs"></slot> -->
        <tvu-form-item class="tvu-jse__form__actions">
          <tvu-button @click="onRemoveField">删除属性</tvu-button>
          <tvu-button @click="onAddField" v-if="['object', 'array'].includes(data.currField.attrs.type)">添加属性
          </tvu-button>
        </tvu-form-item>
      </div>
    </div>
    <!-- 开始：扩展定义 -->
    <div class="tvu-jse__extra">
      <tvu-jse-dependency v-if="data.currField.dependencies" :dependencies="data.currField.dependencies">
      </tvu-jse-dependency>
    </div>
    <!-- 结束：扩展定义 -->
  </div>
</template>
<script lang="ts">
import { Type2Format, FlattenJSONSchema, SchemaField } from './utils'
import { BuildinComponents } from "./buildinComp"
import File from './formats/File.vue'
import TvuJseDependency from './Dependency.vue'
import TvuJseEnumConfig from './EnumConfig.vue'
import TvuJseEventConfig from './EventConfig.vue'
import TvuJseAttachment from './Attachment.vue'
import { computed, onMounted, reactive, ref } from 'vue'

export default {
  name: 'tms-json-schema',
  components: {
    ...BuildinComponents,
    TvuJseDependency,
    TvuJseEnumConfig,
    TvuJseEventConfig
  },
}
</script>
<script setup lang="ts">

const Format2Comp = {
  file: File
}

const props = defineProps({ schema: Object, extendSchema: Function, onUpload: Function })

const FJS = new FlattenJSONSchema()
const fields = ref([] as SchemaField[])
const data = reactive({ currField: { name: '', attrs: {} } as SchemaField })
const hasEnum = ref(false)

const compFormatAttrs = computed(() => {
  const format = data.currField.items?.format
  switch (format) {
    case 'file':
      return File
  }
  return null
})
const formats = computed(() => {
  const { type } = data.currField.attrs
  return (typeof type === 'string' && Type2Format[type])
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})
const formats2 = computed(() => {
  const type = data.currField?.items?.type
  return (type && Type2Format[type])
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})
// watch: {
//   'form.schema.format': {
//     handler: function (val) {
//       if (
//         Format2Comp[val] &&
//         typeof Format2Comp[val].defaultFormatAttrs === 'function'
//       ) {
//         if (!data.currField.attrs.formatAttrs) {
//           data.currField.attrs.formatAttrs = Format2Comp[val].defaultFormatAttrs()
//         }
//       }
//     },
//     immediate: true,
//   },
//   'form.schema.type': {
//     handler: function () {
//       if (data.currField.attrs.default) {
//         return data.currField.attrs.default
//       }
//       data.currField.attrs.default = data.currField.attrs.type === 'array' ? [] : ''
//     },
//     immediate: true,
//   },
// },
const onChangeHasEnum = (bHasEnum: boolean) => {
  const { attrs } = data.currField
  if (bHasEnum) {
    if (!Array.isArray(attrs.enum)) {
      attrs.enum = [
        { label: '选项1', value: 'a' },
        { label: '选项2', value: 'b' },
      ]
      data.currField.attrs.enumGroups = []
    }
  } else {
    delete attrs.enum
    delete attrs.enumGroups
  }
}
const onClickField = (field: SchemaField) => {
  data.currField = field
  if (Array.isArray(field.attrs.enum)) {
    hasEnum.value = true
  } else {
    hasEnum.value = false
  }
}
const onAddField = () => {
  let child = FJS.addField(data.currField)
  if (typeof child === 'object') {
    data.currField = child
  }
}
const onRemoveField = () => {
  let prev = FJS.removeField(data.currField)
  if (typeof prev === 'object') {
    data.currField = prev
  }
}

onMounted(() => {
  FJS.flatten(JSON.parse(JSON.stringify(props.schema)))
  fields.value = FJS.fields
  data.currField = FJS.fields?.[0]
})
/**
 * 设置格式特定属性的编辑组件
 */
// setFormatAttrsComp(format, comp) {
//   Format2Comp[format] = comp
// },
</script>
