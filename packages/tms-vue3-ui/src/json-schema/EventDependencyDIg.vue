<template>
  <tvu-dialog title="设置事件依赖关系" :close-on-click-modal="false" :visible="visible" :before-close="onCancel" width="50%">
    <tvu-form labtvu-position="left" labtvu-width="80px">
      <tvu-form-item label="属性">
        <tvu-select v-model="property" filterable placeholder="请选择">
          <tvu-option v-for="(prop, key) in properties" :key="key" :label="key" :value="key"></tvu-option>
        </tvu-select>
      </tvu-form-item>
      <tvu-form-item label="地址">
        <tvu-input v-model="rule.url"></tvu-input>
      </tvu-form-item>
      <tvu-form-item label="参数">
        <tvu-select v-model="rule.params" multiple filterable placeholder="请选择">
          <tvu-option v-for="(prop, key) in signleProperties" :key="key" :label="key" :value="key"></tvu-option>
        </tvu-select>
      </tvu-form-item>
      <tvu-form-item label="返回值">
        <tvu-select v-model="rule.type" clearable placeholder="请选择">
          <tvu-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></tvu-option>
        </tvu-select>
      </tvu-form-item>
    </tvu-form>
    <span slot="footer" class="dialog-footer">
      <tvu-button @click="onCancel">取 消</tvu-button>
      <tvu-button type="primary" @click="onClose">确 定</tvu-button>
    </span>
  </tvu-dialog>
</template>

<script>
// import Vue from 'vue'

/* 组件定义 */
const DlgComponent = {
  props: {
    properties: { type: Object },
  },
  data() {
    return {
      visible: true,
      property: 'file',
      rule: {},
      options: [
        {
          value: 'v1',
          label: '作为填入值'
        }, {
          value: 'v2',
          label: '作为可选项'
        }
      ]
    }
  },
  computed: {
    signleProperties() {
      let result = {}
      for (let [key, value] of Object.entries(this.properties)) {
        if (value.type === 'string' && value.hasOwnProperty('enum')) {
          result[key] = value
        }
      }
      return result
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onClose() {
      this.$emit('close')
    },
    showAsEventDialog(schema, property, config) {
      let { rule } = config || {}
      this.properties = schema.properties
      this.property = property
      if (rule && typeof rule === 'object')
        for (let property in rule) {
          this.$set(this.rule, property, rule[property])
        }
      this.$mount()
      document.body.appendChild(this.$el)
      return new Promise((resolve) => {
        this.$once('close', () => {
          this.visible = false
          document.body.removeChild(this.$el)
          resolve({
            property: this.property,
            rule: this.rule,
          })
        })
        this.$once('cancel', () => {
          this.visible = false
          document.body.removeChild(this.$el)
          resolve(false)
        })
      })
    },
  },
}
/* 作为独组件打开 */
export function showAsEventDialog(schema, property, rule) {
  let dialog = new Vue(DlgComponent)
  return dialog.showAsEventDialog(schema, property, rule)
}

export default DlgComponent
</script>