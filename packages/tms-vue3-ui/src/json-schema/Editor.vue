<template>
  <div class="tvu-jse tvu-jse--layout-default">
    <!--属性列表部分-->
    <div class="tvu-jse__properties">
      <div class="tvu-jse__property" :class="p === data.currProp ? 'tvu-jse__property--active' : ''" v-for="p in nodes">
        <div @click="onClickNode(p)">{{ p.fullname }}</div>
      </div>
    </div>
    <!--属性编辑部分-->
    <div class="tvu-jse__property-fields">
      <tvu-form-item class="tvu-jse__field" label="键值">
        <tvu-input v-model="data.currProp.name"
          :disabled="data.currProp.name === props.rootName && data.currProp.path === ''"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="类型">
        <tvu-select v-model="data.currProp.attrs.type" :disabled="forbidden" @change="onChangeType">
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
      <tvu-form-item v-if="data.currProp.attrs.type === 'array' && data.currProp.items" class="tvu-jse__field"
        label="子对象类型">
        <tvu-select v-model="data.currProp.items.type">
          <tvu-option label="integer" value="integer"></tvu-option>
          <tvu-option label="number" value="number"></tvu-option>
          <tvu-option label="string" value="string"></tvu-option>
          <tvu-option label="object" value="object"></tvu-option>
          <tvu-option label="boolean" value="boolean"></tvu-option>
          <tvu-option label="json" value="json"></tvu-option>
          <tvu-option label="null" value="null"></tvu-option>
        </tvu-select>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="格式" v-if="formats">
        <tvu-select v-model="data.currProp.attrs.format" placeholder="请选择格式">
          <tvu-option v-for="format in formats" :key="format.value" :label="format.label" :value="format.value">
          </tvu-option>
        </tvu-select>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="子对象格式" v-if="formats2 && data.currProp.items">
        <tvu-select v-model="data.currProp.items.format" placeholder="请选择格式">
          <tvu-option v-for="format in formats2" :key="format.value" :label="format.label" :value="format.value">
          </tvu-option>
        </tvu-select>
      </tvu-form-item>
      <component :is="compFormatAttrs" v-bind.sync="data.currProp.items?.formatAttrs"></component>
      <tvu-form-item class="tvu-jse__field" label="标题">
        <tvu-input v-model="data.currProp.attrs.title" placeholder="标题"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="描述">
        <tvu-input v-model="data.currProp.attrs.description" placeholder="描述"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field">
        <tvu-checkbox v-model="data.currProp.attrs.required" label="必填"></tvu-checkbox>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="选项模式"
        v-if="['string', 'integer', 'number', 'array'].includes(data.currProp.attrs.type)">
        <tvu-select v-model="hasEnum" @change="onChangeHasEnum">
          <tvu-option label="不提供选项" value=""></tvu-option>
          <tvu-option label="oneOf" value="oneOf"></tvu-option>
          <tvu-option label="anyOf" value="anyOf"></tvu-option>
          <tvu-option label="enum" value="enum"></tvu-option>
        </tvu-select>
      </tvu-form-item>
      <div class="tvu-jse__field" v-if="hasEnum">
        <tvu-jse-enum-config :field-attrs="data.currProp.attrs" :field-attrs-type="hasEnum"></tvu-jse-enum-config>
      </div>
      <tvu-form-item class="tvu-jse__field" label="默认值" v-if="!hasEnum">
        <tvu-input v-model="data.currProp.attrs.default"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field">
        <tvu-checkbox v-model="supportAutofill" label="自动填充？"></tvu-checkbox>
      </tvu-form-item>
      <tvu-form-item v-if="supportAutofill" class="tvu-jse__field" label="获取填充值地址">
        <tvu-input v-model="autofill.url"></tvu-input>
      </tvu-form-item>
      <tvu-form-item v-if="supportAutofill" class="tvu-jse__field" v-for="prop in nodes">
        <tvu-checkbox v-model="autofill.params" :label="prop.name" :value="prop.name"></tvu-checkbox>
      </tvu-form-item>
      <tvu-form-item v-if="supportAutofill" class="tvu-jse__field" label="填充位置">
        <tvu-select v-model="autofill.target">
          <tvu-option label="作为填入值" value="value"></tvu-option>
          <tvu-option label="作为可选项" value="items"></tvu-option>
        </tvu-select>
      </tvu-form-item>
      <div class="tvu-jse__field"
        v-if="onUpload && data.currProp.attrs.type === 'array' && data.currProp.items?.format === 'file'">
        <tvu-jse-attachment :schema-prop="data.currProp" :on-upload="onUpload"></tvu-jse-attachment>
      </div>
      <tvu-jse-event-config v-if="data.currProp.eventDependency?.rule" :rule="data.currProp.eventDependency.rule">
      </tvu-jse-event-config>
      <div class="tvu-jse__extra_fields">
        <slot name="extattrs" :attrs="data.currProp.attrs">备用内容</slot>
      </div>
      <tvu-form-item class="tvu-jse__field__actions">
        <tvu-button @click="onRemoveNode">删除属性</tvu-button>
        <tvu-button @click="onAddNode" v-if="hasAAddNode">添加属性</tvu-button>
      </tvu-form-item>
    </div>
    <!-- 开始：扩展定义 -->
    <div class="tvu-jse__extra">
      <tvu-jse-dependency v-if="data.currProp.dependencies" :dependencies="data.currProp.dependencies">
      </tvu-jse-dependency>
    </div>
    <!-- 结束：扩展定义 -->
  </div>
</template>
<script lang="ts">
import { Type2Format, JSONSchemaBuilder, SchemaProp } from './builder'
import File from './formats/File.vue'
import TvuJseDependency from './Dependency.vue'
import TvuJseEnumConfig from './EnumConfig.vue'
import TvuJseEventConfig from './EventConfig.vue'
import TvuJseAttachment from './Attachment.vue'
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { PropAutofillTarget } from './model'

export default {
  name: 'tms-json-schema',
  components: {
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

const props = defineProps({
  schema: { type: Object, default: {} },
  onUpload: Function,
  onMessage: { type: Function, default(msg: string) { alert(msg) } },
  rootName: { type: String, default: '' }
})

const builder = new JSONSchemaBuilder(props.rootName)
const nodes = ref([] as SchemaProp[])
const data = reactive({ currProp: { name: '', attrs: {} } as SchemaProp })
const hasEnum = ref("")
const supportAutofill = ref(false)

// 获得当前的JSONSchema数据
const editing = () => {
  return builder.unflatten()
}

// 允许在父组件中获取
defineExpose({ editing })

const compFormatAttrs = computed(() => {
  const format = data.currProp.items?.format
  switch (format) {
    case 'file':
      return File
  }
  return null
})

const formats = computed(() => {
  const { type } = data.currProp.attrs
  return (typeof type === 'string' && Type2Format[type])
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})

const formats2 = computed(() => {
  const type = data.currProp?.items?.type
  return (type && Type2Format[type])
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})

let forbidden = computed(() => {
  const { type } = data.currProp.attrs
  if (type === 'object' || (type === 'array' && data.currProp?.items?.type === 'object')) {
    const idx = nodes.value.findIndex((node: SchemaProp) => node.parentFullname === data.currProp.fullname)
    if (idx !== -1) return true
  }
  return false
})

let hasAAddNode = computed(() => {
  if (data.currProp.attrs.type === 'object') return true
  if (data.currProp.attrs.type === 'array' && data.currProp.items?.type === 'object') return true
  return false
})

const autofill = computed({
  get: () => {
    if (data.currProp.attrs.autofill) return data.currProp.attrs.autofill
    return { url: '', params: [], target: PropAutofillTarget.value }
  },
  set: val => { }
})

const onChangeType = (event: any) => {
  const type = event.target.value
  if (type === 'array') {
    data.currProp.items = { type: 'string' }
  } else {
    data.currProp.items = undefined
  }
}

const onChangeHasEnum = (event: any) => {
  const { attrs } = data.currProp
  const value = event.target.value
  if (value) {
    if (!Array.isArray(attrs[value])) {
      attrs[value] = [
        { label: '选项1', value: 'a' },
        { label: '选项2', value: 'b' },
      ]
      data.currProp.attrs.enumGroups = []
    }
  } else {
    delete attrs[value]
    delete attrs.enumGroups
  }
}

const onClickNode = (prop: SchemaProp) => {
  data.currProp = prop
  if (Array.isArray(prop.attrs.enum)) {
    hasEnum.value = 'enum'
  } else if (Array.isArray(prop.attrs.oneOf)) {
    hasEnum.value = 'oneOf'
  } else if (Array.isArray(prop.attrs.anyOf)) {
    hasEnum.value = 'anyOf'
  } else {
    hasEnum.value = ''
  }
  supportAutofill.value = typeof prop.attrs.autofill === 'object'
}

const onAddNode = () => {
  let child = builder.addProp(toRaw(data.currProp))
  data.currProp = child
}

const onRemoveNode = () => {
  let prev = builder.removeProp(toRaw(data.currProp))
  if (typeof prev === 'object') {
    data.currProp = prev
  } else if (typeof prev === 'boolean' && prev === false) {
    props.onMessage('根节点不允许删除')
  } else {
    props.onMessage('删除属性遇到未知错误')
  }
}

onMounted(() => {
  builder.flatten(JSON.parse(JSON.stringify(props.schema)))
  nodes.value = builder.props
  data.currProp = builder.props?.[0]
  supportAutofill.value = typeof data.currProp.attrs.autofill === 'object'
})
</script>
