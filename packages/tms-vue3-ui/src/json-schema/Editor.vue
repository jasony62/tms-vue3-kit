<template>
  <div class="tvu-jse tvu-jse--layout-default">
    <!--属性列表部分-->
    <div class="tvu-jse__properties">
      <div class="tvu-jse__property" :class="p === prop ? 'tvu-jse__property--active' : ''" v-for="p in nodes">
        <div class="tvu-jse__property__fullname" @click="onClickNode(p)">{{ p.fullname }}</div>
        <div class="tvu-jse__property__actions" v-if="p === prop">
          <div>
            <button @click="onRemoveProp" v-if="canRemove()">删除</button>
            <button @click="onMoveUpProp" v-if="canMoveUp()">上移</button>
            <button @click="onMoveDownProp" v-if="canMoveDown()">下移</button>
          </div>
          <div v-if="hasAddNode" class="flex flex-row gap-2">
            <button @click="onAddProp('properties')">添加属性</button>
            <button @click="onAddProp('patternProperties')">添加模板属性</button>
          </div>
        </div>
      </div>
    </div>
    <!--属性编辑部分-->
    <div class="tvu-jse__property-fields">
      <tvu-form-item class="tvu-jse__field" label="键值">
        <tvu-input v-model.trim="prop.name" :disabled="prop.name === props.rootName && prop.path === ''"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="初始名称" v-if="prop.isPattern">
        <tvu-input v-model.trim="attrs.initialName"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="类型">
        <tvu-select v-model="attrs.type" :disabled="forbidden" @change="onChangeType">
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
      <tvu-form-item v-if="attrs.type === 'array' && items" class="tvu-jse__field" label="子对象类型">
        <tvu-select v-model="items.type">
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
        <tvu-select v-model="attrs.format" placeholder="请选择格式">
          <tvu-option v-for="format in formats" :key="format.value" :label="format.label" :value="format.value">
          </tvu-option>
        </tvu-select>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="子对象格式" v-if="itemsFormats && items">
        <tvu-select v-model="items.format" placeholder="请选择格式" @change="onChangeItemsFormat">
          <tvu-option v-for="format in itemsFormats" :key="format.value" :label="format.label" :value="format.value">
          </tvu-option>
        </tvu-select>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="标题">
        <tvu-input v-model.trim="attrs.title" placeholder="标题"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="描述">
        <tvu-textarea v-model.trim="attrs.description" placeholder="描述"></tvu-textarea>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field">
        <tvu-checkbox v-model="attrs.required" label="必填"></tvu-checkbox>
      </tvu-form-item>
      <!--特定格式类型对应的扩展属性-->
      <component v-if="items" :is="compFormatAttrs" v-model:formatAttrs="items.formatAttrs"></component>
      <!--选项设置相关-->
      <tvu-form-item class="tvu-jse__field" label="选项模式"
        v-if="['string', 'integer', 'number', 'array'].includes(attrs.type)">
        <tvu-select v-model="choiceMode" @change="onChangeChoiceMode">
          <tvu-option label="不提供选项" value=""></tvu-option>
          <tvu-option label="oneOf" value="oneOf"></tvu-option>
          <tvu-option label="anyOf" value="anyOf"></tvu-option>
          <tvu-option label="enum" value="enum"></tvu-option>
        </tvu-select>
      </tvu-form-item>
      <component v-if="choiceMode" is="TvuJseEnumConfig" :field-attrs="attrs" :field-attrs-type="choiceMode">
      </component>
      <!--默认值-->
      <tvu-form-item class="tvu-jse__field" label="默认值" v-if="!choiceMode">
        <tvu-input v-model="attrs.default"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field">
        <tvu-checkbox v-model="useExistIf" label="有属性依赖条件？"></tvu-checkbox>
      </tvu-form-item>
      <tvu-form-item v-if="useExistIf" class="tvu-jse__field tvu-jse__field--json" label="属性依赖条件">
        <tvu-json v-model="prop.existIf"></tvu-json>
      </tvu-form-item>
      <!--自动填充数据规则定义-->
      <tvu-form-item class="tvu-jse__field">
        <tvu-checkbox v-model="useAutofill" label="自动填充？"></tvu-checkbox>
      </tvu-form-item>
      <component v-if="useAutofill" :is="TvuJseAutofill" v-model:autofill="autofill"></component>
      <!--上传模板文件-->
      <div class="tvu-jse__field" v-if="onUpload && attrs.type === 'array' && items?.format === 'file'">
        <tvu-jse-attachment :schema-prop="prop" :on-upload="onUpload"></tvu-jse-attachment>
      </div>
      <div class="tvu-jse__extra_fields">
        <slot name="extattrs" :attrs="attrs">备用内容</slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Type2Format, JSONSchemaBuilder, SchemaProp } from './builder'
import File from './formats/File.vue'
import TvuJseEnumConfig from './EnumConfig.vue'
import TvuJseAttachment from './Attachment.vue'
import TvuJseAutofill from './Autofill.vue'
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { PropAutofillRunPolicy, PropAutofillTarget } from './model'

export default {
  name: 'tms-json-schema',
  components: {
    TvuJseEnumConfig,
  },
}
</script>
<script setup lang="ts">

const props = defineProps({
  schema: { type: Object, default: {} },
  rootName: { type: String, default: '$' },
  onMessage: { type: Function, default(msg: string) { alert(msg) } },
  onUpload: Function,
})

const builder = new JSONSchemaBuilder(props.rootName)
const nodes = ref([] as SchemaProp[])
const data = reactive({ currProp: { name: '', attrs: {} } as SchemaProp })
const choiceMode = ref('')
const useAutofill = ref(false)
const useExistIf = ref(false)

// 获得当前的JSONSchema数据
const editing = () => {
  return builder.unflatten()
}

// 允许在父组件中获取
defineExpose({ editing })

// 当前编辑的属性
const prop = computed(() => {
  return data.currProp
})

const attrs = computed(() => {
  return data.currProp.attrs
})

const items = computed(() => {
  return data.currProp.items
})

const compFormatAttrs = computed(() => {
  const format = data.currProp.items?.format
  switch (format) {
    case 'file':
      return File
  }
  return null
})

const formats = computed(() => {
  const { type } = attrs.value
  return (typeof type === 'string' && Type2Format[type])
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})

const itemsFormats = computed(() => {
  const type = data.currProp?.items?.type
  return (type && Type2Format[type])
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})

let forbidden = computed(() => {
  const { type } = attrs.value
  if (type === 'object' || (type === 'array' && data.currProp?.items?.type === 'object')) {
    const idx = nodes.value.findIndex((node: SchemaProp) => node.parentFullname === data.currProp.fullname)
    if (idx !== -1) return true
  }
  return false
})

/**允许添加属性*/
let hasAddNode = computed(() => {
  if (attrs.value.type === 'object') return true
  if (attrs.value.type === 'array' && data.currProp.items?.type === 'object') return true
  return false
})

const autofill = computed(() => {
  let rawAttrs = attrs.value
  rawAttrs.autofill ??= { url: '', method: 'GET', target: PropAutofillTarget.value, runPolicy: PropAutofillRunPolicy.onCreate }
  return rawAttrs.autofill
})

const onChangeType = (event: any) => {
  const type = event.target.value
  if (type === 'array') {
    data.currProp.items = { type: 'string' }
  } else {
    data.currProp.items = undefined
  }
}

const onChangeItemsFormat = (event: any) => {
  const format = event.target.value
  if (typeof data.currProp.items !== 'object') {
    data.currProp.items = { type: '' }
  }
  let { items } = data.currProp
  if (format === 'file') {
    items.formatAttrs = {}
  } else {
    delete items.formatAttrs
  }
}

const onChangeChoiceMode = (event: any) => {
  const { attrs } = data.currProp
  let oldValue = ""
  Object.keys(attrs).forEach(item => {
    if (['oneOf', 'anyOf', 'enum'].includes(item)) {
      oldValue = item
    }
  })
  const newValue = event.target.value

  if (oldValue) {
    if (!newValue) {
      delete attrs[oldValue]
      delete attrs.enumGroups
    } else if (newValue !== oldValue) {
      delete attrs[oldValue]
      delete attrs.enumGroups

      attrs[newValue] = [
        { label: '选项1', value: 'a' },
        { label: '选项2', value: 'b' }
      ]
      data.currProp.attrs.enumGroups = []
    }
  } else {
    if (newValue) {
      attrs[newValue] = [
        { label: '选项1', value: 'a' },
        { label: '选项2', value: 'b' }
      ]
      data.currProp.attrs.enumGroups = []
    }
  }
}

const onClickNode = (prop: SchemaProp) => {
  data.currProp = prop
  if (Array.isArray(prop.attrs.enum)) {
    choiceMode.value = 'enum'
  } else if (Array.isArray(prop.attrs.oneOf)) {
    choiceMode.value = 'oneOf'
  } else if (Array.isArray(prop.attrs.anyOf)) {
    choiceMode.value = 'anyOf'
  } else {
    choiceMode.value = ''
  }
  useAutofill.value = typeof prop.attrs.autofill === 'object'
  useExistIf.value = typeof prop.existIf === 'object'
}

const onAddProp = (type: string) => {
  let child = builder.addProp(toRaw(data.currProp), type)
  data.currProp = child
}

const onRemoveProp = () => {
  let prev = builder.removeProp(toRaw(data.currProp))
  if (typeof prev === 'object') {
    data.currProp = prev
  } else if (typeof prev === 'boolean' && prev === false) {
    props.onMessage('根节点不允许删除')
  } else {
    props.onMessage('删除属性遇到未知错误')
  }
}
/**
 * 节点是否可以向上移动
 */
const canMoveUp = (): boolean => {
  let current = toRaw(data.currProp)
  // 有子节点不允许移动
  let lastChildIndex = builder.getLastChildIndex(current)
  if (lastChildIndex !== -1) return false
  // 当前节点在全局数组中的位置
  const index = builder.getIndex(current)
  if (index === -1) {
    // 没有找到
    return false
  }
  // 当前节点的父节点。
  const parent = builder.getParent(current)
  if (!parent) {
    // 没有父属性，不允许移动
    return false
  }
  const parentIndex = builder.getIndex(parent)
  if (parentIndex === -1) return false

  if (index === parentIndex + 1) {
    // 已经是第一个节点，不允许上移
    return false
  }

  return true
}
/**
 * 节点是否可以向下移动
 */
const canMoveDown = (): boolean => {
  let current = toRaw(data.currProp)
  // 有子节点不允许移动
  let lastChildIndex = builder.getLastChildIndex(current)
  if (lastChildIndex !== -1) return false
  // 当前节点的父节点。
  const parent = builder.getParent(current)
  if (!parent) {
    // 没有父属性，不允许移动
    return false
  }
  const lastIndex = builder.getLastChildIndex(parent)
  if (lastIndex === -1) return false

  // 当前节点在全局数组中的位置
  const index = builder.getIndex(current)
  if (index === -1) {
    // 没有找到
    return false
  }
  if (index === lastIndex) {
    // 已经是最后一个节点，不允许上移
    return false
  }
  return true
}
/**
 * 是否允许删除
 */
const canRemove = (): boolean => {
  let current = toRaw(data.currProp)
  if (current === builder.props[0]) return false
  let lastChildIndex = builder.getLastChildIndex(current)
  if (lastChildIndex !== -1) return false

  return true
}
/**
 * 向上移动当前属性
 * 
 * 只允许在父节点中移动
 */
const onMoveUpProp = () => {
  if (!canMoveUp()) return

  let current = toRaw(data.currProp)
  const index = builder.getIndex(current)

  // 移动位置
  //@ts-ignore
  data.currProp = { name: '', attrs: {} }
  const { props } = builder
  props.splice(index, 1)
  props.splice(index - 1, 0, current)
  data.currProp = current
}

/**向下移动当前属性*/
const onMoveDownProp = () => {
  if (!canMoveDown()) return

  let current = toRaw(data.currProp)
  // 当前节点在全局数组中的位置
  const index = builder.getIndex(current)

  // 移动位置
  //@ts-ignore
  data.currProp = { name: '', attrs: {} }
  const { props } = builder
  props.splice(index, 1)
  props.splice(index + 1, 0, current)
  data.currProp = current
}

onMounted(() => {
  builder.flatten(JSON.parse(JSON.stringify(props.schema)))
  nodes.value = builder.props
  data.currProp = builder.props?.[0]
  useAutofill.value = typeof data.currProp.attrs.autofill === 'object'
  useExistIf.value = typeof data.currProp.existIf === 'object'
})
</script>
