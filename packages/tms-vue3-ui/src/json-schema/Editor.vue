<template>
  <div class="tvu-jse tvu-jse--layout-default">
    <div class="tvu-jse__fields">
      <div class="tvu-jse__field" v-for="p in fields">
        <div @click="onClickField(p)">{{ p.path ? p.path + '.' : '' }}{{ p.name }}</div>
      </div>
    </div>
    <div class="tvu-jse__field-editor">
      <tvu-form class="tvu-jse__field-form">
        <tvu-form-item label="键值">
          <tvu-input v-model="currField.name"></tvu-input>
        </tvu-form-item>
        <tvu-form-item label="类型">
          <tvu-select v-model="currField.attrs.type" placeholder="请选择类型">
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
        <tvu-form-item label="格式" v-if="formats">
          <tvu-select v-model="currField.attrs.format" placeholder="请选择格式">
            <tvu-option v-for="format in formats" :key="format.value" :label="format.label" :value="format.value">
            </tvu-option>
          </tvu-select>
        </tvu-form-item>
        <tvu-form-item label="标题">
          <tvu-input v-model="currField.attrs.title" placeholder="标题"></tvu-input>
        </tvu-form-item>
        <tvu-form-item label="描述">
          <tvu-input v-model="currField.attrs.description" placeholder="描述"></tvu-input>
        </tvu-form-item>
        <tvu-form-item label="必填">
          <tvu-switch type="checkbox" v-model="currField.attrs.required"></tvu-switch>
        </tvu-form-item>
        <tvu-form-item label="可否分组">
          <tvu-switch type="checkbox" v-model="currField.attrs.groupable"></tvu-switch>
        </tvu-form-item>
        <tvu-form-item label="设置范围">
          <tvu-switch v-model="hasEnum" @change="onChangeHasEnum"></tvu-switch>
        </tvu-form-item>
        <tvu-form-item label="选择范围" v-if="hasEnum">
          <tms-flex v-for="(v, i) in currField.attrs.enum" :key="i">
            <tvu-input v-model="v.value" @input="onSetValue(v.value, i)" :disabled="v.disabled">
            </tvu-input>
            <tvu-input v-model="v.label" @input="onSetLabel(v.label, i)"></tvu-input>
            <tvu-button @click="onDelOption(v, i)">删除</tvu-button>
          </tms-flex>
          <tvu-button @click="onAddOption">新增选项</tvu-button>
        </tvu-form-item>
        <tvu-form-item label="至少选" v-if="currField.attrs.type === 'array' && form.hasEnum">
          <tvu-input-number v-model="currField.attrs.minItems"></tvu-input-number>
        </tvu-form-item>
        <tvu-form-item label="最多选" v-if="currField.attrs.type === 'array' && form.hasEnum">
          <tvu-input-number v-model="currField.attrs.maxItems"></tvu-input-number>
        </tvu-form-item>
        <tvu-form-item label="默认值">
          <tvu-checkbox-group v-model="currField.attrs.default" v-if="currField.attrs.type === 'array'">
            <tvu-checkbox v-for="(v, i) in currField.attrs.enum" :key="i" :label="v.value">
            </tvu-checkbox>
          </tvu-checkbox-group>
          <tvu-input v-model="currField.attrs.default" v-else></tvu-input>
        </tvu-form-item>
        <tvu-form-item label="上传模板" v-if="currField.attrs.type === 'array' && currField.attrs.items">
          <tvu-upload action="#" multiple :file-list="currField.attrs.attachment" :http-request="onUploadFile"
            :on-remove="onRemoveFile">
            <tvu-button>上传文件</tvu-button>
          </tvu-upload>
        </tvu-form-item>
        <component :is="compFormatAttrs" v-bind.sync="currField.attrs.formatAttrs"></component>
        <slot name="extKeywords" :schema="currField.attrs"></slot>
        <tvu-form-item class="tvu-jse__form__actions">
          <tvu-button @click="onRemoveField">删除</tvu-button>
          <tvu-button @click="onAddField" v-if="['object', 'array'].includes(currField.attrs.type)">添加属性
          </tvu-button>
        </tvu-form-item>
      </tvu-form>
    </div>
    <!-- 开始：扩展定义 -->
    <div class="tvu-jse__deps">
      <tvu-tab-pane label="属性依赖" name="dependencies">
        <tms-flex direction="column">
          <tms-flex v-for="(config, p) in currField.attrs.dependencies" :key="p" direction="column">
            <tms-flex>
              <span>{{ p }}</span>
              <tms-flex direction="column">
                <tms-flex v-for="(group, index) in config.dependencyRules" :key="index">
                  <div v-for="(rule, index) in group.rules" :key="index">
                    <span>{{ rule.property }}</span>&nbsp;
                    <span>{{ rule.value }}</span>
                  </div>
                  <span>{{ group.operator }}</span>
                </tms-flex>
                <div>
                  <span>{{ config.operator }}</span>
                </div>
              </tms-flex>
            </tms-flex>
            <div>
              <tvu-button @click="onSetDependency(p)">修改</tvu-button>
              <tvu-button @click="onDelDependency(p)">删除</tvu-button>
            </div>
          </tms-flex>
          <div>
            <tvu-button @click="onAddDependency">添加</tvu-button>
          </div>
        </tms-flex>
      </tvu-tab-pane>
      <tvu-tab-pane label="选项依赖" name="enumDependencies">
        <tms-flex v-for="g in currField.attrs.enumGroups" :key="g.id">
          <span>{{ g.label }}</span>
          <span>{{ g.assocEnum.property }}</span>
          <span>{{ g.assocEnum.value }}</span>
        </tms-flex>
        <div v-for="(v, i) in currField.attrs.enum" :key="i">
          <div v-for="g in currField.attrs.enumGroups" :key="g.id">
            <tms-flex v-if="g.id === v.group">
              <span>{{ v.label }}</span>
              <span>{{ g.label }}</span>
            </tms-flex>
          </div>
        </div>
        <div>
          <tvu-button size="mini" type="default" :disabled="!currField.attrs.enum" @click="onEditEnumDependency">
            编辑选项依赖</tvu-button>
        </div>
      </tvu-tab-pane>
      <tvu-tab-pane label="事件依赖" name="eventDependencies">
        <tms-flex direction="column">
          <tms-flex v-for="(config, p) in currField.attrs.eventDependencies" :key="p" direction="column">
            <tms-flex>
              <span>{{ p }}</span>
              <tms-flex direction="column">
                <span>{{ config.rule.url }}</span>
                <tms-flex><span v-for="(value, key) in config.rule.params" :key="key">{{ value }}</span>
                </tms-flex>
                <span>{{ config.rule.type }}</span>
              </tms-flex>
            </tms-flex>
            <div>
              <tvu-button @click="onSetEventDependency(p)">修改</tvu-button>
              <tvu-button @click="onDelEventDependency(p)">删除</tvu-button>
            </div>
          </tms-flex>
          <div>
            <tvu-button @click="onAddEventDependency">添加</tvu-button>
          </div>
        </tms-flex>
      </tvu-tab-pane>
    </div>
    <!-- 结束：扩展定义 -->
  </div>
</template>

<script>
import { Type2Format, flatten } from './utils'
import File from './formats/File.vue'
import { showAsDialog as fnShowDependencyDlg } from './DependencyDlg.vue'
import { showAsEnumDialog as fnShowEnumDependencyDlg } from './EnumDependencyDIg.vue'
import { showAsEventDialog as fnShowEventDependencyDlg } from './EventDependencyDIg.vue'

const Format2Comp = {
  file: File,
}

export default {
  name: 'tms-json-schema',
  components: {},
  props: { schema: Object, extendSchema: Function, onUpload: Function },
  data() {
    return {
      fields: [],
      currField: { name: '', attrs: {} },
    }
  },
  computed: {
    hasEnum() {
      return this.currField?.attrs?.enums ?? false
    },
    compFormatAttrs() {
      const format = this.currField.attrs.format
      switch (format) {
        case 'file':
          return File
      }
      return null
    },
    formats() {
      const type = this.currField.attrs.type
      return Type2Format[type]
        ? [{ value: undefined, label: '无' }].concat(Type2Format[type])
        : null
    },
  },
  watch: {
    'form.schema.format': {
      handler: function (val) {
        if (
          Format2Comp[val] &&
          typeof Format2Comp[val].defaultFormatAttrs === 'function'
        ) {
          if (!this.currField.attrs.formatAttrs) {
            this.currField.attrs.formatAttrs = Format2Comp[val].defaultFormatAttrs()
          }
        }
      },
      immediate: true,
    },
    'form.schema.type': {
      handler: function () {
        if (this.currField.attrs.default) {
          return this.currField.attrs.default
        }
        this.currField.attrs.default = this.currField.attrs.type === 'array' ? [] : ''
      },
      immediate: true,
    },
  },
  methods: {
    onRemoveFile(file) {
      let files = this.currField.attrs.attachment
      files.splice(
        files.indexOf(files.find((ele) => ele.name === file.name)),
        1
      )
    },
    onUploadFile({ file }) {
      if (!this.currField.attrs.attachment) {
        this.currField.attrs.attachment = []
      }
      this.onUpload(file).then((result) => {
        this.currField.attrs.attachment.push(result)
      })
    },
    onChangeHasEnum(bHasEnum) {
      if (bHasEnum) {
        this.currField.attrs.enum = [
          { label: '选项1', value: 'a' },
          { label: '选项2', value: 'b' },
        ]
        this.currField.attrs.enumGroups = []
      } else {
        delete this.currField.attrs.enum
        delete this.currField.attrs.enumGroups
      }
    },
    onAddOption() {
      this.currField.attrs.enum.push({
        label: '新选项',
        value: 'newKey',
      })
    },
    onDelOption(v, i) {
      this.currField.attrs.enum.splice(i, 1)
    },
    onSetValue(v, i) {
      let item = this.currField.attrs.enum[i]
      item['value'] = v
      this.currField.attrs.enum.i = item
    },
    onSetLabel(v, i) {
      let item = this.currField.attrs.enum[i]
      item['label'] = v
      // this.currField.attrs.enum.i.item
    },
    onClickField(field) {
      this.currField = field
    },
    onAddField() {
      let { path, name } = this.currField
      let newFiled = { path: `${path ? path + '.' : ''}${name}`, name: 'newKey', attrs: { type: 'string' } }
      this.fields.splice(0, 0, newFiled)
      this.currField = newFiled
    },
    onRemoveField() {
      this.fields.splice(this.fields.indexOf(this.currField), 1)
      this.currField = this.fields?.[0]
    },
    /* 添加属性依赖规则 */
    onAddDependency() {
      let dependencies = this.currField.attrs.dependencies
      fnShowDependencyDlg(this.currField.attrs).then((result) => {
        if (result) {
          let { property, dependencyRules, operator } = result
          dependencies[property] = {
            dependencyRules: dependencyRules,
            operator,
          }
        }
      })
    },
    /* 修改属性依赖规则 */
    onSetDependency(propName) {
      let dependencies = this.currField.attrs.dependencies
      fnShowDependencyDlg(
        this.currField.attrs,
        propName,
        dependencies[propName]
      ).then((result) => {
        if (result) {
          let { property, dependencyRules, operator } = result
          dependencies[property] = {
            dependencyRules: dependencyRules,
            operator,
          }
        }
      })
    },
    /* 删除属性依赖规则 */
    onDelDependency(propName) {
      delete this.currField.attrs.dependencies[propName]
    },
    /* 编辑选项依赖规则 */
    onEditEnumDependency() {
      // let allProperties = this.form.node.data.parent.children
      let allProperties = []
      fnShowEnumDependencyDlg(
        this.currField.attrs,
        this.currField.name,
        allProperties
      ).then((result) => {
        if (result) {
          let { enumGroups } = result
          this.currField.attrs.enumGroups = enumGroups
          this.currField.attrs.enum = result.enum
        }
      })
    },
    /* 添加事件依赖规则 */
    onAddEventDependency() {
      let eventDependencies = this.currField.attrs.eventDependencies
      fnShowEventDependencyDlg(this.currField.attrs).then((result) => {
        if (result) {
          let { property, rule } = result
          eventDependencies[property] = { rule: rule }
        }
      })
    },
    /* 修改事件依赖规则 */
    onSetEventDependency(propName) {
      let eventDependencies = this.currField.attrs.eventDependencies
      fnShowEventDependencyDlg(
        this.currField.attrs,
        propName,
        eventDependencies[propName]
      ).then((result) => {
        if (result) {
          let { property, rule } = result
          eventDependencies[property] = { rule }
        }
      })
    },
    /* 删除事件依赖规则 */
    onDelEventDependency(propName) {
      delete this.currField.attrs.eventDependencies[propName]
    },
  },
  mounted() {
    const result = flatten(JSON.parse(JSON.stringify(this.schema)))
    result?.forEach(r =>
      this.fields.push(r)
    )
    this.currField = this.fields?.[0]
  },
  /**
   * 设置格式特定属性的编辑组件
   */
  setFormatAttrsComp(format, comp) {
    Format2Comp[format] = comp
  },
}
</script>
