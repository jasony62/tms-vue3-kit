<template>
  <div id="app">
    <tvu-form-item label="依赖规则">
      {{ tabName }}
      <tvu-form :inline="true" v-for="(rule, index) in dependencyRules[tabName]['rules']" :key="index" size="medium">
        <tvu-form-item label="属性">
          <tvu-select v-model="rule.property" filterable placeholder="请选择">
            <tvu-option v-for="(prop, key) in properties" :key="key" :label="key" :value="key"></tvu-option>
          </tvu-select>
        </tvu-form-item>
        <tvu-form-item label="取值">
          <tvu-input v-model="rule.value"></tvu-input>
        </tvu-form-item>
        <tvu-button @click="onDelRule(rule, tabName)">删除</tvu-button>
      </tvu-form>
    </tvu-form-item>
    <tvu-form-item>
      <tvu-radio-group v-model="dependencyRules[tabName]['operator']">
        <tvu-radio label="and">满足全部条件</tvu-radio>
        <tvu-radio label="or">满足任意条件</tvu-radio>
      </tvu-radio-group>
    </tvu-form-item>
    <span slot="footer" class="dialog-footer">
      <tvu-button size="small" @click="onAddRule(tabName)">添加规则</tvu-button>
    </span>
  </div>
</template>

<script>
// import Vue from 'vue'

/* 组件定义 */
export default {
  data() {
    return {
      timer: ''
    }
  },
  props: {
    properties: Object,
    dependencyRules: Object,
    tabName: String
  },
  methods: {
    onAddRule(tabName) {
      this.$set(this.dependencyRules[tabName]['rules'], this.dependencyRules[tabName]['rules'].length, { property: '', value: null })
    },
    onDelRule(rule, tabName) {
      console.log('rulerulerule', rule)
      let index = this.dependencyRules[tabName].rules.indexOf(rule)
      // let index = this.rules.indexOf(rule)
      this.dependencyRules[tabName].rules.splice(index, 1)
    }
  }
}
</script>