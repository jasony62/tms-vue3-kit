<template>
  <div>
    <!-- <div v-model="activeL0Pane" type="card"> -->
    <tvu-tabs>
      <tvu-tab-pane label="属性" name="properties">
        <tms-flex>
          <tvu-tree :data="data" :props="defaultProps" default-expand-all :expand-on-click-node="false"
            @node-click="onNodeClick" draggable :allow-drag="allowDrag" :allow-drop="allowDrop" @node-drop="onDragNode">
          </tvu-tree>
          <tvu-form label-width="80px" :model="form" :disabled="!form.node">
            <tvu-form-item label="键值">
              <tvu-input v-model="form.key" @change="onChangeKey"></tvu-input>
            </tvu-form-item>
            <tvu-form-item label="类型">
              <tvu-select v-model="form.schema.type" placeholder="请选择类型">
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
              <tvu-select v-model="form.schema.format" placeholder="请选择格式">
                <tvu-option v-for="format in formats" :key="format.value" :label="format.label" :value="format.value">
                </tvu-option>
              </tvu-select>
            </tvu-form-item>
            <tvu-form-item label="标题">
              <tvu-input v-model="form.schema.title"></tvu-input>
            </tvu-form-item>
            <tvu-form-item label="描述">
              <tvu-input type="textarea" v-model="form.schema.description"></tvu-input>
            </tvu-form-item>
            <tvu-form-item label="必填">
              <tvu-switch v-model="form.schema.required"></tvu-switch>
            </tvu-form-item>
            <tvu-form-item label="可否分组">
              <tvu-switch v-model="form.schema.groupable"></tvu-switch>
            </tvu-form-item>
            <tvu-form-item label="默认值">
              <tvu-checkbox-group v-model="form.schema.default" v-if="form.schema.type === 'array'">
                <tvu-checkbox v-for="(v, i) in form.schema.enum" :key="i" :label="v.value"></tvu-checkbox>
              </tvu-checkbox-group>
              <tvu-input v-model="form.schema.default" v-else></tvu-input>
            </tvu-form-item>
            <tvu-form-item label="设置范围">
              <tvu-switch v-model="form.hasEnum" @change="onChangeHasEnum"></tvu-switch>
            </tvu-form-item>
            <tvu-form-item label="选择范围" v-if="form.hasEnum">
              <tms-flex v-for="(v, i) in form.schema.enum" :key="i">
                <tvu-input size="mini" v-model="v.value" @input="onSetValue(v.value, i)" :disabled="v.disabled">
                </tvu-input>
                <tvu-input size="mini" v-model="v.label" @input="onSetLabel(v.label, i)"></tvu-input>
                <tvu-button size="mini" type="text" @click="onDelOption(v, i)">删除</tvu-button>
              </tms-flex>
              <tvu-button size="mini" type="primary" @click="onAddOption">新增选项</tvu-button>
            </tvu-form-item>
            <tvu-form-item label="至少选" v-if="form.schema.type === 'array' && form.hasEnum">
              <tvu-input-number v-model="form.schema.minItems"></tvu-input-number>
            </tvu-form-item>
            <tvu-form-item label="最多选" v-if="form.schema.type === 'array' && form.hasEnum">
              <tvu-input-number v-model="form.schema.maxItems"></tvu-input-number>
            </tvu-form-item>
            <tvu-form-item label="上传模板" v-if="form.schema.type === 'array' && form.schema.items">
              <tvu-upload action="#" multiple :file-list="form.schema.attachment" :http-request="onUploadFile"
                :on-remove="onRemoveFile">
                <tvu-button>上传文件</tvu-button>
              </tvu-upload>
            </tvu-form-item>
            <component :is="compFormatAttrs" v-bind.sync="form.schema.formatAttrs"></component>
            <slot name="extKeywords" :schema="form.schema"></slot>
            <tvu-form-item>
              <tvu-button size="mini" @click="onRemoveNode">删除</tvu-button>
              <tvu-button size="mini" @click="onAppendNode" v-if="
                form.schema.type === 'object' || form.schema.type === 'array'
              ">添加属性</tvu-button>
            </tvu-form-item>
          </tvu-form>
          <!-- 开始：扩展定义 -->
          <div>
            <tvu-tabs tab-position="left" v-model="activeL1Pane">
              <tvu-tab-pane label="属性依赖" name="dependencies">
                <tms-flex direction="column">
                  <tms-flex v-for="(config, p) in form.schema.dependencies" :key="p" direction="column">
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
                      <tvu-button size="mini" @click="onSetDependency(p)">修改</tvu-button>
                      <tvu-button size="mini" @click="onDelDependency(p)">删除</tvu-button>
                    </div>
                  </tms-flex>
                  <div>
                    <tvu-button size="mini" type="default" @click="onAddDependency">添加</tvu-button>
                  </div>
                </tms-flex>
              </tvu-tab-pane>
              <tvu-tab-pane label="选项依赖" name="enumDependencies">
                <tms-flex v-for="g in form.schema.enumGroups" :key="g.id">
                  <span>{{ g.label }}</span>
                  <span>{{ g.assocEnum.property }}</span>
                  <span>{{ g.assocEnum.value }}</span>
                </tms-flex>
                <div v-for="(v, i) in form.schema.enum" :key="i">
                  <div v-for="g in form.schema.enumGroups" :key="g.id">
                    <tms-flex v-if="g.id === v.group">
                      <span>{{ v.label }}</span>
                      <span>{{ g.label }}</span>
                    </tms-flex>
                  </div>
                </div>
                <div>
                  <tvu-button size="mini" type="default" :disabled="!form.schema.enum" @click="onEditEnumDependency">
                    编辑选项依赖</tvu-button>
                </div>
              </tvu-tab-pane>
              <tvu-tab-pane label="事件依赖" name="eventDependencies">
                <tms-flex direction="column">
                  <tms-flex v-for="(config, p) in form.schema.eventDependencies" :key="p" direction="column">
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
                      <tvu-button size="mini" @click="onSetEventDependency(p)">修改</tvu-button>
                      <tvu-button size="mini" @click="onDelEventDependency(p)">删除</tvu-button>
                    </div>
                  </tms-flex>
                  <div>
                    <tvu-button size="mini" type="default" @click="onAddEventDependency">添加</tvu-button>
                  </div>
                </tms-flex>
              </tvu-tab-pane>
            </tvu-tabs>
          </div>
          <!-- 结束：扩展定义 -->
        </tms-flex>
      </tvu-tab-pane>
      <tvu-tab-pane label="预览" name="preview">
        <div style="flex: 1">{{ jsonString }}</div>
      </tvu-tab-pane>
    </tvu-tabs>
  </div>
</template>

<script>
// import Vue from 'vue'
// import {
//   Tabs,
//   TabPane,
//   Tree,
//   Form,
//   FormItem,
//   Input,
//   InputNumber,
//   Select,
//   Option,
//   Button,
//   Switch,
//   Radio,
//   RadioGroup,
//   Dialog,
//   Upload,
//   Checkbox,
//   CheckboxGroup,
// } from 'element-ui'
// Vue.use(Tabs)
//   .use(TabPane)
//   .use(Tree)
//   .use(Form)
//   .use(FormItem)
//   .use(Input)
//   .use(InputNumber)
//   .use(Select)
//   .use(Option)
//   .use(Button)
//   .use(Switch)
//   .use(Radio)
//   .use(RadioGroup)
//   .use(Dialog)
//   .use(Upload)
//   .use(Checkbox)
//   .use(CheckboxGroup)
/**
 *
 */
class SchemaWrap {
  /**
   *
   * @param {*} key
   * @param {Object} schema
   */
  constructor(key, schema, parent) {
    this.key = key
    this.label = key
    this.schema = schema
    this.parent = parent
  }
  appendChild(child) {
    this.children.push(child)
    this.schema.type === 'object'
      ? Vue.set(this.schema.properties, child.key, child.schema)
      : Vue.set(this.schema, child.key, child.schema)
    child.parent = this
  }
}
/**
 * 构造树节点
 */
SchemaWrap.build = function (key, schema, parent) {
  let wrap = new SchemaWrap(key, schema, parent)
  switch (schema.type) {
    case 'object':
      if (typeof schema.properties === 'object') {
        wrap.children = Object.entries(schema.properties).map(([k, s]) => {
          return SchemaWrap.build(k, s, wrap)
        })
      }
      break
    case 'array':
      if (typeof schema.items === 'object') {
        wrap.children = Object.entries(schema)
          .filter(([k]) => k === 'items')
          .map(([k, s]) => SchemaWrap.build(k, s, wrap))
      }
      break
  }
  return wrap
}

class FormData {
  constructor() {
    this.reset()
  }
  reset() {
    this.key = ''
    this.schema = {
      title: '',
      type: 'string',
      description: '',
      required: false,
      groupable: false,
      properties: {},
    }
    this.node = null
  }
}

const Type2Format = {
  string: [
    { value: 'name', label: '姓名' },
    { value: 'email', label: '邮箱' },
    { value: 'mobile', label: '手机' },
    { value: 'dateTime', label: '日期时间' },
  ],
  object: [
    { value: 'file', label: '文件' },
    { value: 'image', label: '图片' },
    { value: 'url', label: '链接' },
    { value: 'score', label: '打分' },
  ],
}

import File from './formats/File.vue'
import { showAsDialog as fnShowDependencyDlg } from './DependencyDlg.vue'
import { showAsEnumDialog as fnShowEnumDependencyDlg } from './EnumDependencyDIg.vue'
import { showAsEventDialog as fnShowEventDependencyDlg } from './EventDependencyDIg.vue'
import { h } from 'vue'

const Format2Comp = {
  file: File,
}

/**
 * 依赖的组件
 */
const components = {
  tabs: {
    render() { return h('div', {}, this.$slots.default?.()) }
  },
  tabPane: {
    render() { return h('div', {}, this.$slots.default?.()) }
  },
  tree: {
    render() { return h('div', {}, this.$slots.default?.()) }
  }
}

export default {
  name: 'tms-json-schema',
  components: {
    'tvu-tabs': {
      ...components.tabs
    },
    'tvu-tab-pane': {
      ...components.tabPane
    },
    'tvu-tree': {
      ...components.tree
    }
  },
  props: { schema: Object, extendSchema: Function, onUpload: Function },
  data() {
    return {
      activeL0Pane: 'properties',
      activeL1Pane: 'dependencies',
      form: new FormData(),
      data: [],
      isParentArray: false,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      jsonString: '',
    }
  },
  computed: {
    compFormatAttrs() {
      const format = this.form.schema.format
      switch (format) {
        case 'file':
          return File
      }
      return null
    },
    formats() {
      const type = this.form.schema.type
      return Type2Format[type]
        ? [{ value: undefined, label: '无' }].concat(Type2Format[type])
        : null
    },
  },
  watch: {
    schema: {
      handler: function (val) {
        this.jsonString = typeof val === 'object' ? JSON.stringify(val) : '{}'
      },
      deep: true,
      immediate: true,
    },
    'form.schema.format': {
      handler: function (val) {
        if (
          Format2Comp[val] &&
          typeof Format2Comp[val].defaultFormatAttrs === 'function'
        ) {
          if (!this.form.schema.formatAttrs) {
            this.form.schema.formatAttrs = Format2Comp[val].defaultFormatAttrs()
            // this.$set(
            //   this.form.schema,
            //   'formatAttrs',
            //   Format2Comp[val].defaultFormatAttrs()
            // )
          }
        }
      },
      immediate: true,
    },
    'form.schema.type': {
      handler: function () {
        if (this.form.schema.default) {
          return this.form.schema.default
        }
        this.form.schema.default = this.form.schema.type === 'array' ? [] : ''
        // this.form.schema.type === 'array'
        //   ? this.$set(this.form.schema, 'default', [])
        //   : this.$set(this.form.schema, 'default', '')
      },
      immediate: true,
    },
  },
  methods: {
    onRemoveFile(file) {
      let files = this.form.schema.attachment
      files.splice(
        files.indexOf(files.find((ele) => ele.name === file.name)),
        1
      )
    },
    onUploadFile({ file }) {
      if (!this.form.schema.attachment) {
        // this.$set(this.form.schema, 'attachment', [])
        this.form.schema.attachment = []
      }
      this.onUpload(file).then((result) => {
        this.form.schema.attachment.push(result)
      })
    },
    onChangeHasEnum(bHasEnum) {
      if (bHasEnum) {
        // this.$set(this.form.schema, 'enum', [
        //   { label: '选项1', value: 'a' },
        //   { label: '选项2', value: 'b' },
        // ])
        // this.$set(this.form.schema, 'enumGroups', [])
        this.form.schema.enum = [
          { label: '选项1', value: 'a' },
          { label: '选项2', value: 'b' },
        ]
        this.form.schema.enumGroups = []
      } else {
        // this.$delete(this.form.schema, 'enum')
        // this.$delete(this.form.schema, 'enumGroups')
        delete this.form.schema.enum
        delete this.form.schema.enumGroups
      }
    },
    onAddOption() {
      this.form.schema.enum.push({
        label: '新选项',
        value: 'newKey',
      })
    },
    onDelOption(v, i) {
      this.form.schema.enum.splice(i, 1)
    },
    onSetValue(v, i) {
      let item = this.form.schema.enum[i]
      item['value'] = v
      // this.$set(this.form.schema.enum, i, item)
      this.form.schema.enum.i = item
    },
    onSetLabel(v, i) {
      let item = this.form.schema.enum[i]
      item['label'] = v
      // this.$set(this.form.schema.enum, i, item)
      this.form.schema.enum.i.item
    },
    onDragNode(draggingNode, dropNode) {
      let children = dropNode.data.parent.children
      let { properties } = this.schema
      let newProperties = {}
      children.map((d) => {
        newProperties[d.key] = properties[d.key]
      })
      dropNode.data.parent.schema.properties = newProperties
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        return type === 'prev' || type === 'next'
      } else {
        return false
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.level === 2
    },
    onNodeClick(schemaWrap, node) {
      const { key, schema } = schemaWrap
      // this.$set(schema, 'required', !!schema.required)
      // this.$set(schema, 'groupable', !!schema.groupable)
      schema.required = !!schema.required
      schema.groupable = !!schema.groupable
      // 添加依赖关系定义
      if (!schema.dependencies || typeof schema.dependencies !== 'object')
        // this.$set(schema, 'dependencies', {})
        schema.dependencies = {}
      // 添加选项依赖关系定义
      if (!schema.enumGroups && schema.enum) {
        // this.$set(schema, 'enumGroups', [])
        schema.enumGroups = []
      }
      // 添加事件依赖关系定义
      if (
        !schema.eventDependencies ||
        typeof schema.eventDependencies !== 'object'
      )
        schema.eventDependencies = {}
      // this.$set(schema, 'eventDependencies', {})
      this.form.key = key
      this.form.schema = schema
      this.form.node = node
      this.form.hasEnum = Array.isArray(schema.enum) ? true : false
      if (this.extendSchema) this.extendSchema(this, schema)
    },
    onChangeKey() {
      const schemaWrap = this.form.node.data
      if (this.form.key !== schemaWrap.key) {
        const newKey = this.form.key
        if (schemaWrap.parent && schemaWrap.parent.schema.properties) {
          // this.$delete(schemaWrap.parent.schema.properties, schemaWrap.key)
          delete schemaWrap.parent.schema.properties[schemaWrap.key]
          // this.$set(
          //   schemaWrap.parent.schema.properties,
          //   newKey,
          //   schemaWrap.schema
          // )
          schemaWrap.parent.schema.properties[newKey] = schemaWrap.schema
        }
        schemaWrap.label = schemaWrap.key = newKey
      }
    },
    onAppendNode() {
      const data = this.form.node.data
      const { schema, children } = data
      let newChild
      if (!Array.isArray(children)) {
        // this.$set(data, 'children', [])
        data.children = []
      }
      if (schema.type === 'object') {
        if (
          typeof schema.properties !== 'object' ||
          Array.isArray(schema.properties)
        ) {
          // this.$set(schema, 'properties', {})
          schema.properties = {}
        }
        newChild = new SchemaWrap('newKey', {
          type: 'string',
        })
      } else if (schema.type === 'array') {
        if (schema.items) return
        newChild = new SchemaWrap('items', { type: 'object' })
      }

      if (this.extendSchema) this.extendSchema(this, schema)

      data.appendChild(newChild)
    },
    onRemoveNode() {
      const { parent, data } = this.form.node
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.key === data.key)
      children.splice(index, 1)
      const properties = parent.data.schema.properties
      properties && this.$delete(properties, data.key)
      this.form.reset()
    },
    /* 添加属性依赖规则 */
    onAddDependency() {
      let dependencies = this.form.schema.dependencies
      fnShowDependencyDlg(this.form.schema).then((result) => {
        if (result) {
          let { property, dependencyRules, operator } = result
          // this.$set(dependencies, property, {
          //   dependencyRules: dependencyRules,
          //   operator,
          // })
          dependencies[property] = {
            dependencyRules: dependencyRules,
            operator,
          }
        }
      })
    },
    /* 修改属性依赖规则 */
    onSetDependency(propName) {
      let dependencies = this.form.schema.dependencies
      fnShowDependencyDlg(
        this.form.schema,
        propName,
        dependencies[propName]
      ).then((result) => {
        if (result) {
          let { property, dependencyRules, operator } = result
          // this.$set(dependencies, property, {
          //   dependencyRules: dependencyRules,
          //   operator,
          // })
          dependencies[property] = {
            dependencyRules: dependencyRules,
            operator,
          }
        }
      })
    },
    /* 删除属性依赖规则 */
    onDelDependency(propName) {
      // this.$delete(this.form.schema.dependencies, propName)
      delete this.form.schema.dependencies[propName]
    },
    /* 编辑选项依赖规则 */
    onEditEnumDependency() {
      let allProperties = this.form.node.data.parent.children
      fnShowEnumDependencyDlg(
        this.form.schema,
        this.form.key,
        allProperties
      ).then((result) => {
        if (result) {
          let { enumGroups } = result
          // this.$set(this.form.schema, 'enumGroups', enumGroups)
          // this.$set(this.form.schema, 'enum', result.enum)
          this.form.schema.enumGroups = enumGroups
          this.form.schema.enum = result.enum
        }
      })
    },
    /* 添加事件依赖规则 */
    onAddEventDependency() {
      let eventDependencies = this.form.schema.eventDependencies
      fnShowEventDependencyDlg(this.form.schema).then((result) => {
        if (result) {
          let { property, rule } = result
          // this.$set(eventDependencies, property, { rule: rule })
          eventDependencies[property] = { rule: rule }
        }
      })
    },
    /* 修改事件依赖规则 */
    onSetEventDependency(propName) {
      let eventDependencies = this.form.schema.eventDependencies
      fnShowEventDependencyDlg(
        this.form.schema,
        propName,
        eventDependencies[propName]
      ).then((result) => {
        if (result) {
          let { property, rule } = result
          // this.$set(eventDependencies, property, { rule: rule })
          eventDependencies[property] = { rule }
        }
      })
    },
    /* 删除事件依赖规则 */
    onDelEventDependency(propName) {
      // this.$delete(this.form.schema.eventDependencies, propName)
      delete this.form.schema.eventDependencies[propName]
    },
  },
  mounted() {
    const root = SchemaWrap.build('root', this.schema)
    this.data = [root]
  },
  /**
   * 设置格式特定属性的编辑组件
   */
  setFormatAttrsComp(format, comp) {
    Format2Comp[format] = comp
  },
}
</script>
