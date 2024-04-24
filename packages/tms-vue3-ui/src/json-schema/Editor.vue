<template>
  <div class="tvu-jse tvu-jse--layout-default">
    <!--属性列表部分-->
    <div class="tvu-jse__properties">
      <div class="tvu-jse__property" :class="{
        'tvu-jse__property--active': p === prop,
        'tvu-jse__property--highlight': highlight(i),
      }" v-for="(p, i) in nodes">
        <div class="tvu-jse__property__fullname" @click="onClickNode(p)">
          {{ p.fullname }}
        </div>
        <div class="tvu-jse__property__actions" v-if="p === prop">
          <div>
            <button @click="onRemoveProp" v-if="canRemove()">删除</button>
            <button @click="onAddPropBefore" v-if="canAddBefore()">
              前插入
            </button>
            <button @click="onAddPropAfter" v-if="canAddAfter()">后插入</button>
          </div>
          <div>
            <button @click="onMoveUpProp" v-if="canMoveUp()">上移</button>
            <button @click="onMoveDownProp" v-if="canMoveDown()">下移</button>
          </div>
          <div v-if="hasAddNode" class="flex flex-row gap-2">
            <button @click="onAddProp('properties')">添加子属性</button>
            <button @click="onAddProp('patternProperties')">
              添加模板子属性
            </button>
          </div>
          <div v-if="canAddJSONSchema()">
            <button @click="pasteJSONSchema(p)">粘贴子定义</button>
          </div>
        </div>
      </div>
    </div>
    <!--属性编辑部分-->
    <div class="tvu-jse__property-fields">
      <tvu-form-item class="tvu-jse__field" label="键值">
        <tvu-input v-model.trim="prop.name" :disabled="prop.name === rootName && prop.path === ''"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="初始名称" v-if="prop.isPattern">
        <tvu-input v-model.trim="attrs.initialName"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" label="类型">
        <tvu-select v-model="attrs.type" :disabled="disableChangeType" @change="onChangeType">
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
        <tvu-select v-model="items.type" :disabled="disableChangeItemType">
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
      <tvu-form-item class="tvu-jse__field" v-if="activeIndex > 0">
        <tvu-checkbox v-model="prop.isOneOf" label="isOneOf"></tvu-checkbox>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" v-if="prop.isOneOf" label="亲和组名称">
        <tvu-input v-model.trim="prop.isOneOfInclusiveGroup" placeholder="亲和组名称"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" v-if="prop.isOneOf" label="互斥组名称">
        <tvu-input v-model.trim="prop.isOneOfExclusiveGroup" placeholder="互斥组名称"></tvu-input>
      </tvu-form-item>
      <tvu-form-item class="tvu-jse__field" v-if="prop.isOneOf">
        <tvu-checkbox v-model="prop.isOneOfDefault" label="互斥组默认选项"></tvu-checkbox>
      </tvu-form-item>
      <!--特定格式类型对应的扩展属性-->
      <component v-if="items" :is="compFormatAttrs" v-model:formatAttrs="items.formatAttrs"></component>
      <!--选项设置相关-->
      <tvu-form-item class="tvu-jse__field" label="选项模式"
        v-if="['string', 'integer', 'number', 'array'].includes(attrs.type)">
        <tvu-select v-model="choiceMode" @change="onChangeChoiceMode">
          <tvu-option label="不提供选项" value=""></tvu-option>
          <tvu-option label="oneOf" value="oneOf" v-if="attrs.type !== 'array'"></tvu-option>
          <tvu-option label="anyOf" value="anyOf" v-if="attrs.type === 'array'"></tvu-option>
          <tvu-option label="enum" value="enum"></tvu-option>
        </tvu-select>
      </tvu-form-item>
      <component v-if="choiceMode" is="TvuJseEnumConfig" :field-attrs="attrs" :field-attrs-type="choiceMode">
      </component>
      <!--默认值-->
      <tvu-form-item class="tvu-jse__field" label="默认值"
        v-if="attrs.type !== 'object' && attrs.type !== 'array' && !choiceMode">
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
      <!--查询填写内容-->
      <tvu-form-item class="tvu-jse__field">
        <tvu-checkbox v-model="useLookup" label="查询填写内容？"></tvu-checkbox>
      </tvu-form-item>
      <component v-if="useLookup" :is="TvuJseLookup" v-model:prop="prop"></component>
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
import File from './formats/File.vue'
import TvuJseEnumConfig from './EnumConfig.vue'
import TvuJseAttachment from './Attachment.vue'
import TvuJseAutofill from './Autofill.vue'
import TvuJseLookup from './Lookup.vue'
import { computed, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { Type2Format, JSONSchemaBuilder, SchemaProp } from 'tms-data-aid'
import { PropAutofillRunPolicy, PropAutofillTarget } from 'tms-data-aid'

export default {
  name: 'tms-json-schema',
  components: {
    TvuJseEnumConfig,
  },
}
</script>
<script setup lang="ts">
const props = defineProps({
  schema: { type: Object, default: { type: 'object' } },
  rootName: { type: String, default: '$' },
  onMessage: {
    type: Function,
    default(msg: string) {
      alert(msg)
    },
  },
  onUpload: Function,
  onPaste: { type: Function }, // 返回子schema定义
})

const builder = new JSONSchemaBuilder(props.rootName)
const nodes = ref([] as SchemaProp[])
const data = reactive({ currProp: { name: '', attrs: {} } as SchemaProp })
// 当前属性的索引
const activeIndex = computed(() => builder.getIndex(toRaw(data.currProp)))
// 当前属性最后一个后代的索引
const activeEndIndex = computed(() =>
  activeIndex.value === 0 ? 0 : builder.getEndIndex(toRaw(data.currProp))
)
const choiceMode = ref('')
const useAutofill = ref(false)
const useLookup = ref(false)
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
  return typeof type === 'string' && Type2Format[type]
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})

const itemsFormats = computed(() => {
  const type = data.currProp?.items?.type
  return type && Type2Format[type]
    ? [{ value: '', label: '无' }].concat(Type2Format[type])
    : null
})

/**禁止修改属性类型*/
const disableChangeType = computed(() => {
  const { type } = attrs.value
  if (
    type === 'object' ||
    (type === 'array' && data.currProp?.items?.type === 'object')
  ) {
    const idx = nodes.value.findIndex(
      (node: SchemaProp) => node.parentFullname === data.currProp.fullname
    )
    if (idx !== -1) return true
  }
  return false
})
/**禁止修改子项目属性类型*/
const disableChangeItemType = computed(() => {
  if (data.currProp.items) {
    const { type } = data.currProp.items
    if (type === 'object') {
      const idx = nodes.value.findIndex(
        (node: SchemaProp) => node.parentFullname === data.currProp.fullname
      )
      if (idx !== -1) return true
    }
  }
  return false
})

/**允许添加属性*/
let hasAddNode = computed(() => {
  if (attrs.value.type === 'object') return true
  if (attrs.value.type === 'array' && data.currProp.items?.type === 'object')
    return true
  return false
})

watch(useExistIf, (nv) => {
  if (nv !== true) delete attrs.value.existIf
})

watch(useLookup, (nv) => {
  if (nv !== true) delete attrs.value.lookup
})

watch(useAutofill, (nv) => {
  if (nv !== true) delete attrs.value.autofill
})

const autofill = computed(() => {
  let rawAttrs = attrs.value
  rawAttrs.autofill ??= {
    url: '',
    method: 'GET',
    target: PropAutofillTarget.value,
    runPolicy: PropAutofillRunPolicy.onCreate,
  }
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
  let oldValue = ''
  Object.keys(attrs).forEach((item) => {
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
        { label: '选项2', value: 'b' },
      ]
      data.currProp.attrs.enumGroups = []
    }
  } else {
    if (newValue) {
      attrs[newValue] = [
        { label: '选项1', value: 'a' },
        { label: '选项2', value: 'b' },
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
  useLookup.value = typeof prop.lookup === 'object'
  useExistIf.value = typeof prop.existIf === 'object'
}
/**
 * 是否在高亮区域（属性及其后代）
 */
const highlight = (index: number): boolean =>
  index > activeIndex.value && index <= activeEndIndex.value
/**
 * 节点前是否可以插入节点
 */
const canAddBefore = (): boolean => builder.canAddBefore(toRaw(data.currProp))
/**
 * 节点后是否可以插入节点
 */
const canAddAfter = (): boolean => builder.canAddAfter(toRaw(data.currProp))
/**
 * 节点是否可以向上移动
 */
const canMoveUp = (): boolean => builder.canMoveUp(toRaw(data.currProp))
/**
 * 节点是否可以向下移动
 */
const canMoveDown = (): boolean => builder.canMoveDown(toRaw(data.currProp))
/**
 * 节点是否允许删除
 */
const canRemove = (): boolean => builder.canRemove(toRaw(data.currProp))
/**
 * 节点是否可以粘贴子定义
 */
const canAddJSONSchema = (): boolean => {
  if (!builder.canAddJSONSchema(toRaw(data.currProp))) return false
  return true
}
/**
 * 在结尾添加子属性
 * @param type
 */
const onAddProp = (type: string) => {
  let child = builder.addProp(toRaw(data.currProp), type)
  data.currProp = child
}
/**
 * 节点前插入节点
 */
const onAddPropBefore = () => {
  const sibling = builder.addPropBefore(toRaw(data.currProp))
  if (sibling) data.currProp = sibling
}
/**
 * 节点后插入节点
 */
const onAddPropAfter = () => {
  const sibling = builder.addPropAfter(toRaw(data.currProp))
  if (sibling) data.currProp = sibling
}
/**
 * 向上移动当前属性
 */
const onMoveUpProp = () => {
  let current = toRaw(data.currProp)
  //@ts-ignore
  data.currProp = { name: '', attrs: {} }
  builder.moveUp(current)
  data.currProp = current
}
/**
 * 向下移动当前属性
 */
const onMoveDownProp = () => {
  let current = toRaw(data.currProp)
  //@ts-ignore
  data.currProp = { name: '', attrs: {} }
  builder.moveDown(current)
  data.currProp = current
}
/**
 * 删除节点
 */
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
 * 从粘贴板获得数据，在指定属性下添加子定义
 */
const pasteJSONSchema = async (prop: SchemaProp) => {
  const { onPaste } = props
  try {
    let rawSchema
    if (onPaste && typeof onPaste === 'function') {
      rawSchema = await onPaste(toRaw(data.currProp))
    } else {
      const clipText = await navigator.clipboard.readText()
      rawSchema = JSON.parse(clipText)
    }
    if (rawSchema) {
      let newProps = builder.addJSONSchema(toRaw(data.currProp), rawSchema)
      if (Array.isArray(newProps) && newProps.length) {
        data.currProp = newProps[0]
      }
    }
  } catch (e: any) {
    if (e) props.onMessage(`粘贴【${prop.fullname}】错误：${e.message}`)
  }
}

onMounted(() => {
  const schema = JSON.parse(JSON.stringify(props.schema))
  if (!schema.type) schema.type = 'object'
  builder.flatten(schema)
  nodes.value = builder.props
  data.currProp = builder.props?.[0]
  useAutofill.value = typeof data.currProp.attrs.autofill === 'object'
  useLookup.value = typeof data.currProp.lookup === 'object'
  useExistIf.value = typeof data.currProp.existIf === 'object'
})
</script>
