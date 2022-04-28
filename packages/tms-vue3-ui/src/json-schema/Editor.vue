<template>
  <div class="tvu-jse tvu-jse--layout-default">
    <!--属性列表部分-->
    <div class="tvu-jse__fields">
      <div class="tvu-jse__field" :class="f === data.currNode ? 'tvu-jse__field--active' : ''" v-for="f in nodes">
        <div @click="onClickField(f)">{{ f.path ? f.path + '.' : '' }}{{ f.name }}</div>
      </div>
    </div>
    <!--属性编辑部分-->
    <div class="tvu-jse__field-editor">
      <div class="tvu-jse__field-form">
        <tvu-form-item class="tvu-jse__input" label="键值">
          <tvu-input v-model="data.currNode.name"></tvu-input>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="类型">
          <tvu-select v-model="data.currNode.attrs.type">
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
        <tvu-form-item v-if="data.currNode.attrs.type === 'array'" class="tvu-jse__input" label="子对象类型">
          <tvu-select v-model="data.currNode.items.type">
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
          <tvu-select v-model="data.currNode.attrs.format" placeholder="请选择格式">
            <tvu-option v-for="format in formats" :key="format.value" :label="format.label" :value="format.value">
            </tvu-option>
          </tvu-select>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="格式" v-if="formats2">
          <tvu-select v-model="data.currNode.items.format" placeholder="请选择格式">
            <tvu-option v-for="format in formats2" :key="format.value" :label="format.label" :value="format.value">
            </tvu-option>
          </tvu-select>
        </tvu-form-item>
        <component :is="compFormatAttrs" v-bind.sync="data.currNode.items?.formatAttrs"></component>
        <tvu-form-item class="tvu-jse__input" label="标题">
          <tvu-input v-model="data.currNode.attrs.title" placeholder="标题"></tvu-input>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="描述">
          <tvu-input v-model="data.currNode.attrs.description" placeholder="描述"></tvu-input>
        </tvu-form-item>
        <tvu-form-item label="必填">
          <tvu-checkbox v-model="data.currNode.attrs.required"></tvu-checkbox>
        </tvu-form-item>
        <tvu-form-item label="可否分组">
          <tvu-checkbox v-model="data.currNode.attrs.groupable"></tvu-checkbox>
        </tvu-form-item>
        <tvu-form-item label="设置选项">
          <tvu-checkbox v-model="hasEnum" @change="onChangeHasEnum"></tvu-checkbox>
        </tvu-form-item>
        <div class="tvu-jse__enum" v-if="hasEnum">
          <tvu-jse-enum-config :field-attrs="data.currNode.attrs"></tvu-jse-enum-config>
        </div>
        <tvu-form-item class="tvu-jse__input" label="默认值" v-if="!hasEnum">
          <tvu-input v-model="data.currNode.attrs.default"></tvu-input>
        </tvu-form-item>
        <div v-if="onUpload && data.currNode.attrs.type === 'array' && data.currNode.items">
          <tvu-jse-attachment :field-attrs="data.currNode.attrs" :on-upload="onUpload"></tvu-jse-attachment>
        </div>
        <tvu-jse-event-config v-if="data.currNode.eventDependency?.rule" :rule="data.currNode.eventDependency.rule">
        </tvu-jse-event-config>
        <div class="tvu-jse__form__extattrs">
          <slot name="extattrs" :attrs="data.currNode.attrs">备用内容</slot>
        </div>
        <tvu-form-item class="tvu-jse__form__actions">
          <tvu-button @click="onRemoveNode">删除属性</tvu-button>
          <tvu-button @click="onAddNode" v-if="['object', 'array'].includes(data.currNode.attrs.type)">添加属性
          </tvu-button>
          <tvu-button @click="onPreview">预览</tvu-button>
        </tvu-form-item>
      </div>
    </div>
    <!-- 开始：扩展定义 -->
    <div class="tvu-jse__extra">
      <tvu-jse-dependency v-if="data.currNode.dependencies" :dependencies="data.currNode.dependencies">
      </tvu-jse-dependency>
    </div>
    <!-- 结束：扩展定义 -->
  </div>
</template>
<script lang="ts">
import { Type2Format, FlattenJSONSchema, SchemaNode } from './utils'
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

const props = defineProps({ schema: Object, onUpload: Function })

const FJS = new FlattenJSONSchema()
const nodes = ref([] as SchemaNode[])
const data = reactive({ currNode: { name: '', attrs: {} } as SchemaNode })
const hasEnum = ref(false)

// 获得当前的JSONSchema数据
const outcome = () => {
  return FJS.unflatten()
}

// 允许在父组件中获取
defineExpose({ outcome })

const compFormatAttrs = computed(() => {
  const format = data.currNode.items?.format
  switch (format) {
    case 'file':
      return File
  }
  return null
})

const formats = computed(() => {
  const { type } = data.currNode.attrs
  return (typeof type === 'string' && Type2Format[type])
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})

const formats2 = computed(() => {
  const type = data.currNode?.items?.type
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
//         if (!data.currNode.attrs.formatAttrs) {
//           data.currNode.attrs.formatAttrs = Format2Comp[val].defaultFormatAttrs()
//         }
//       }
//     },
//     immediate: true,
//   },
//   'form.schema.type': {
//     handler: function () {
//       if (data.currNode.attrs.default) {
//         return data.currNode.attrs.default
//       }
//       data.currNode.attrs.default = data.currNode.attrs.type === 'array' ? [] : ''
//     },
//     immediate: true,
//   },
// },
const onChangeHasEnum = (bHasEnum: boolean) => {
  const { attrs } = data.currNode
  if (bHasEnum) {
    if (!Array.isArray(attrs.enum)) {
      attrs.enum = [
        { label: '选项1', value: 'a' },
        { label: '选项2', value: 'b' },
      ]
      data.currNode.attrs.enumGroups = []
    }
  } else {
    delete attrs.enum
    delete attrs.enumGroups
  }
}
const onClickField = (field: SchemaNode) => {
  data.currNode = field
  if (Array.isArray(field.attrs.enum)) {
    hasEnum.value = true
  } else {
    hasEnum.value = false
  }
}
const onAddNode = () => {
  let child = FJS.addField(data.currNode)
  if (typeof child === 'object') {
    data.currNode = child
  }
}
const onRemoveNode = () => {
  let prev = FJS.removeField(data.currNode)
  if (typeof prev === 'object') {
    data.currNode = prev
  }
}

const onPreview = () => {
  console.log(outcome())
}

onMounted(() => {
  FJS.flatten(JSON.parse(JSON.stringify(props.schema)))
  nodes.value = FJS.nodes
  data.currNode = FJS.nodes?.[0]
})
/**
 * 设置格式特定属性的编辑组件
 */
// setFormatAttrsComp(format, comp) {
//   Format2Comp[format] = comp
// },
</script>
