<template>
  <div class="tvu-jse__dependencies" label="属性依赖" name="dependencies">
    <div class="tvu-jse__dependencies__rule-group" v-for="(group, index) in dependencies.dependencyRules" :key="index">
      <div>规则组 - {{ index }}</div>
      <div class="tvu-jse__dependencies__rule" v-for="(rule, index2) in group.rules" :key="index2">
        <tvu-form-item class="tvu-jse__input" label="属性">
          <tvu-input v-model="rule.property"></tvu-input>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__input" label="取值">
          <tvu-input v-model="rule.value"></tvu-input>
        </tvu-form-item>
        <div>
          <tvu-button @click="onDelDependencyRule(group.rules, index2, index)">删除规则</tvu-button>
        </div>
      </div>
      <div class="tvu-jse__dependencies__rule-group-actions">
        <div class="tvu-jse__dependencies__rule">
          <tvu-form-item class="tvu-jse__input" label="运算关系">
            <tvu-select v-model="group.operator">
              <tvu-option label="or" value="or"></tvu-option>
              <tvu-option label="and" value="and"></tvu-option>
            </tvu-select>
          </tvu-form-item>
        </div>
        <tvu-button @click="onAddDependencyRule(group.rules)">添加规则</tvu-button>
        <tvu-button @click="onDelDependencyRuleGroup(index)">删除规则组</tvu-button>
      </div>
    </div>
    <div class="tvu-jse__dependencies__rule">
      <tvu-form-item class="tvu-jse__input" label="规则间运算关系">
        <tvu-select v-model="dependencies.operator">
          <tvu-option label="or" value="or"></tvu-option>
          <tvu-option label="and" value="and"></tvu-option>
        </tvu-select>
      </tvu-form-item>
    </div>
    <div>
      <tvu-button @click="onAddDependencyRuleGroup">添加规则组</tvu-button>
    </div>
  </div>
</template>

<script>
import { BuildinComponents } from "./buildinComp"

export default {
  name: 'tvu-jse-dependency',
  components: BuildinComponents,
  props: { dependencies: Object },
  data() {
    return {
    }
  },
  methods: {
    onAddDependencyRuleGroup() {
      const newRuleGroup = {
        "3": { "rules": [{ property: "", value: "" }], operator: 'and' }
      }
      Object.assign(this.dependencies.dependencyRules, newRuleGroup)
    },
    onAddDependencyRule(rules) {
      const newRule = { property: "", value: "" }
      rules.push(newRule)
    },
    onDelDependencyRule(rules, index2, index) {
      rules.splice(index2, 1)
      if (rules.length === 0) this.onDelDependencyRuleGroup(index)
    },
    onDelDependencyRuleGroup(index) {
      delete this.dependencies.dependencyRules[index]
    },
  },
}
</script>