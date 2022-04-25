import JsonSchema from './Editor.vue'

import { defineComponent, h } from 'vue'
/**
 * 依赖的组件
 */
const components = {
  tabs: defineComponent({
    render() {
      return h('div', {}, this.$slots.default?.())
    },
  }),
  tabPane: defineComponent({
    render() {
      return h('div', {}, this.$slots.default?.())
    },
  }),
  tree: defineComponent({
    render() {
      return h('div', {}, this.$slots.default?.())
    },
  }),
  form: defineComponent({
    render() {
      return h('form', {}, this.$slots.default?.())
    },
  }),
  formItem: defineComponent({
    props: ['label'],
    render() {
      return h('div', {}, [
        `${this.label ? this.label + ':' : ''}`,
        this.$slots.default?.(),
      ])
    },
  }),
  input: defineComponent({
    props: ['modelValue'],
    emits: ['update:modelValue'],
    render() {
      return h('input', {
        value: this.modelValue,
        onInput: ($event: any) => {
          this.$emit('update:modelValue', $event.target.value)
        },
      })
    },
  }),
  upload: defineComponent({
    render() {
      return h('input', {})
    },
  }),
  checkbox: defineComponent({
    render() {
      return h('input', { type: 'checkbox' })
    },
  }),
  checkboxGroup: defineComponent({
    render() {
      return h('div', {}, this.$slots.default?.())
    },
  }),
  select: defineComponent({
    props: ['modelValue'],
    emits: ['update:modelValue'],
    render() {
      return h(
        'select',
        {
          value: this.modelValue,
          onChange: ($event: any) => {
            this.$emit('update:modelValue', $event.target.value)
          },
        },
        this.$slots.default?.()
      )
    },
  }),
  option: defineComponent({
    render() {
      return h('option', {})
    },
  }),
  button: defineComponent({
    render() {
      return h('button', {}, this.$slots.default?.())
    },
  }),
}

export function factory() {
  /*指定使用的组件*/
  JsonSchema.components = {
    'tvu-tabs': {
      ...components.tabs,
    },
    'tvu-tab-pane': {
      ...components.tabPane,
    },
    'tvu-tree': {
      ...components.tree,
    },
    'tvu-form': {
      ...components.form,
    },
    'tvu-form-item': {
      ...components.formItem,
    },
    'tvu-input': {
      ...components.input,
    },
    'tvu-input-number': {
      ...components.input,
    },
    'tvu-switch': {
      ...components.input,
    },
    'tvu-upload': {
      ...components.upload,
    },
    'tvu-checkbox': {
      ...components.checkbox,
    },
    'tvu-checkbox-group': {
      ...components.checkboxGroup,
    },
    'tvu-select': {
      ...components.select,
    },
    'tvu-option': {
      ...components.option,
    },
    'tvu-button': {
      ...components.button,
    },
  }
  return JsonSchema
}

export default JsonSchema
