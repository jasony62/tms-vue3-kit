<template>
  <div class="tvu-jse__dependencies" label="属性依赖" name="dependencies">
    <div class="tvu-jse__dependencies__rule-group" v-for="(group, key) in dependencies.dependencyRules" :key="key">
      <div>规则组 - {{ key }}</div>
      <div class="tvu-jse__dependencies__rule" v-for="(rule, indexRule) in group.rules" :key="indexRule">
        <tvu-form-item class="tvu-jse__field" label="属性">
          <tvu-input v-model="rule.property"></tvu-input>
        </tvu-form-item>
        <tvu-form-item class="tvu-jse__field" label="取值">
          <tvu-input v-model="rule.value"></tvu-input>
        </tvu-form-item>
        <div>
          <tvu-button @click="onDelRule(group.rules, indexRule, key + '')">删除规则</tvu-button>
        </div>
      </div>
      <div class="tvu-jse__dependencies__rule">
        <tvu-form-item class="tvu-jse__field" label="运算关系">
          <tvu-select v-model="group.operator">
            <tvu-option label="满足任意条件" value="or"></tvu-option>
            <tvu-option label="满足全部条件" value="and"></tvu-option>
          </tvu-select>
        </tvu-form-item>
      </div>
      <div class="tvu-jse__dependencies__rule-group-actions">
        <tvu-button @click="onAddRule(group.rules)">添加规则</tvu-button>
        <tvu-button @click="onDelRuleGroup(key + '')">删除规则组</tvu-button>
      </div>
    </div>
    <div class="tvu-jse__dependencies__rule">
      <tvu-form-item class="tvu-jse__field" label="规则间运算关系">
        <tvu-select v-model="dependencies.operator">
          <tvu-option label="满足任意条件" value="or"></tvu-option>
          <tvu-option label="满足全部条件" value="and"></tvu-option>
        </tvu-select>
      </tvu-form-item>
    </div>
    <div>
      <tvu-button @click="onAddRuleGroup">添加规则组</tvu-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { PropDepRuleSet, PropDepRule } from "./model";

const props = defineProps(
  { dependencies: { type: Object as PropType<PropDepRuleSet>, required: true } }
)

const { dependencies } = props

const onAddRuleGroup = () => {
  const newRuleGroup = {
    [`g${Date.now()}`]: { rules: [{ property: '', value: '' }], operator: 'and' }
  }
  Object.assign(dependencies.dependencyRules, newRuleGroup)
}

const onDelRuleGroup = (groupKey: string) => {
  delete dependencies.dependencyRules[groupKey]
}

const onAddRule = (rules: PropDepRule[]) => {
  const newRule = { property: "", value: "" }
  rules.push(newRule)
}
const onDelRule = (rules: PropDepRule[], indexRule: number, groupKey: string) => {
  rules.splice(indexRule, 1)
  if (rules.length === 0) onDelRuleGroup(groupKey)
}

</script>