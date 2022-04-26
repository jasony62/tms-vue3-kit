<template>
  <div class="tvu-jse tvu-jse--layout-default">
    <div class="tvu-jse__fields">
      <div class="tvu-jse__field" :class="f === currField ? 'tvu-jse__field--active' : ''" v-for="f in fields">
        <div @click="onClickField(f)">{{ f.path ? f.path + '.' : '' }}{{ f.name }}</div>
      </div>
    </div>
    <div class="tvu-jse__field-editor">
      <tvu-form class="tvu-jse__field-form">
        <tvu-form-item class="tvu-jse__input" label="键值">
          <tvu-input v-model="currField.name"></tvu-input>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="类型">
          <tvu-select v-model="currField.attrs.type">
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
        <tvu-form-item v-if="currField.attrs.type === 'array'" class="tvu-jse__input" label="子对象类型">
          <tvu-select v-model="currField.items.type">
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
          <tvu-select v-model="currField.attrs.format" placeholder="请选择格式">
            <tvu-option v-for="format in formats" :key="format.value" :label="format.label" :value="format.value">
            </tvu-option>
          </tvu-select>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="格式" v-if="formats2">
          <tvu-select v-model="currField.items.format" placeholder="请选择格式">
            <tvu-option v-for="format in formats2" :key="format.value" :label="format.label" :value="format.value">
            </tvu-option>
          </tvu-select>
        </tvu-form-item>
        <component :is="compFormatAttrs" v-bind.sync="currField.items?.formatAttrs"></component>
        <tvu-form-item class="tvu-jse__input" label="标题">
          <tvu-input v-model="currField.attrs.title" placeholder="标题"></tvu-input>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="描述">
          <tvu-input v-model="currField.attrs.description" placeholder="描述"></tvu-input>
        </tvu-form-item>
        <tvu-form-item label="必填">
          <tvu-checkbox v-model="currField.attrs.required"></tvu-checkbox>
        </tvu-form-item>
        <tvu-form-item label="可否分组">
          <tvu-checkbox v-model="currField.attrs.groupable"></tvu-checkbox>
        </tvu-form-item>
        <tvu-form-item label="设置范围">
          <tvu-checkbox v-model="hasEnum" @change="onChangeHasEnum"></tvu-checkbox>
        </tvu-form-item>
        <div class="tvu-jse__enum" v-if="hasEnum">
          <tvu-form-item class="tvu-jse__enum-option" label="选择范围">
            <div class="tvu-jse__input" v-for="(opt, i) in currField.attrs.enum" :key="i">
              <tvu-input v-model="opt.value"></tvu-input>
              <tvu-input v-model="opt.label"></tvu-input>
              <tvu-button @click="onDelEnumOption(opt, i)">删除</tvu-button>
            </div>
            <tvu-button @click="onAddEnumOption">新增选项</tvu-button>
          </tvu-form-item>
          <tvu-form-item class="tvu-jse__input" label="至少选">
            <tvu-input-number v-model="currField.attrs.minItems"></tvu-input-number>
          </tvu-form-item>
          <tvu-form-item class="tvu-jse__input" label="最多选">
            <tvu-input-number v-model="currField.attrs.maxItems"></tvu-input-number>
          </tvu-form-item>
          <tvu-form-item class="tvu-jse__input" label="默认选项">
            <tvu-checkbox-group>
              <tvu-checkbox v-model="currField.attrs.default" class="tvu-jse__checkbox"
                v-for="(v, i) in currField.attrs.enum" :key="i" :value="v.value" :label="v.label">
              </tvu-checkbox>
            </tvu-checkbox-group>
          </tvu-form-item>
        </div>
        <tvu-form-item class="tvu-jse__input" label="默认值" v-if="!hasEnum">
          <tvu-input v-model="currField.attrs.default"></tvu-input>
        </tvu-form-item>
        <tvu-form-item label="上传模板" v-if="currField.attrs.type === 'array' && currField.attrs.items">
          <tvu-upload action="#" multiple :file-list="currField.attrs.attachment" :http-request="onUploadFile"
            :on-remove="onRemoveFile">
            <tvu-button>上传文件</tvu-button>
          </tvu-upload>
        </tvu-form-item>
        <!-- <slot name="extKeywords" :schema="currField.attrs"></slot> -->
        <tvu-form-item class="tvu-jse__form__actions">
          <tvu-button @click="onRemoveField">删除</tvu-button>
          <tvu-button @click="onAddField" v-if="['object', 'array'].includes(currField.attrs.type)">添加属性</tvu-button>
        </tvu-form-item>
      </tvu-form>
    </div>
    <!-- 开始：扩展定义 -->
    <div class="tvu-jse__extra">
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
          <tvu-button :disabled="!currField.attrs.enum" @click="onEditEnumDependency">
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
import { Type2Format, FlattenJSONSchema } from './utils'
import File from './formats/File.vue'
import { showAsDialog as fnShowDependencyDlg } from './DependencyDlg.vue'
import { showAsEnumDialog as fnShowEnumDependencyDlg } from './EnumDependencyDIg.vue'
import { showAsEventDialog as fnShowEventDependencyDlg } from './EventDependencyDIg.vue'

const Format2Comp = {
  file: File
}

export default {
  name: 'tms-json-schema',
  components: {},
  props: { schema: Object, extendSchema: Function, onUpload: Function },
  data() {
    return {
      FJS: new FlattenJSONSchema(),
      fields: [],
      currField: { name: '', attrs: {} },
      hasEnum: false
    }
  },
  computed: {
    compFormatAttrs() {
      const format = this.currField.items?.format
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
    formats2() {
      const type = this.currField?.items?.type
      return Type2Format[type]
        ? [{ value: undefined, label: '无' }].concat(Type2Format[type])
        : null
    },
  },
  // watch: {
  //   'form.schema.format': {
  //     handler: function (val) {
  //       if (
  //         Format2Comp[val] &&
  //         typeof Format2Comp[val].defaultFormatAttrs === 'function'
  //       ) {
  //         if (!this.currField.attrs.formatAttrs) {
  //           this.currField.attrs.formatAttrs = Format2Comp[val].defaultFormatAttrs()
  //         }
  //       }
  //     },
  //     immediate: true,
  //   },
  //   'form.schema.type': {
  //     handler: function () {
  //       if (this.currField.attrs.default) {
  //         return this.currField.attrs.default
  //       }
  //       this.currField.attrs.default = this.currField.attrs.type === 'array' ? [] : ''
  //     },
  //     immediate: true,
  //   },
  // },
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
      const { attrs } = this.currField
      if (bHasEnum) {
        if (!Array.isArray(attrs.enum)) {
          attrs.enum = [
            { label: '选项1', value: 'a' },
            { label: '选项2', value: 'b' },
          ]
          this.currField.attrs.enumGroups = []
        }
      } else {
        delete attrs.enum
        delete attrs.enumGroups
      }
    },
    onAddEnumOption() {
      this.currField.attrs.enum.push({
        label: '新选项',
        value: 'newKey',
      })
    },
    onDelEnumOption(v, i) {
      this.currField.attrs.enum.splice(i, 1)
    },
    onClickField(field) {
      this.currField = field
      if (Array.isArray(field.attrs.enum)) {
        this.hasEnum = true
      } else {
        this.hasEnum = false
      }
    },
    onAddField() {
      let child = this.FJS.addField(this.currField)
      if (child) {
        this.currField = child
      }
    },
    onRemoveField() {
      let prev = this.FJS.removeField(this.currField)
      if (prev) {
        this.currField = prev
      }
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
    this.FJS.flatten(JSON.parse(JSON.stringify(this.schema)))
    this.fields = this.FJS.fields
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
