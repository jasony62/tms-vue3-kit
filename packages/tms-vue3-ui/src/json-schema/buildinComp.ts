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
      return h('div', {}, this.$slots.default?.())
    },
  }),
  formItem: defineComponent({
    props: ['label'],
    render() {
      return h('div', {}, [
        h('div', { class: ['tvu-jse__label'] }, this.label),
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
    props: ['label', 'value', 'modelValue'],
    render() {
      let inputProps: { [k: string]: any } = {
        type: 'checkbox',
        value: this.value,
        onChange: () => {
          if (Array.isArray(this.modelValue)) {
            if (this.modelValue.includes(this.value)) {
              this.modelValue.splice(this.modelValue.indexOf(this.value), 1)
            } else {
              this.modelValue.push(this.value)
            }
          } else if (typeof this.modelValue === 'boolean') {
            this.$emit('update:modelValue', !this.modelValue)
          }
        },
      }
      if (Array.isArray(this.modelValue)) {
        if (this.modelValue.includes(this.value)) {
          inputProps.checked = true
        }
      } else {
        if (this.modelValue === true) inputProps.checked = true
      }
      return h('div', {}, [h('input', inputProps), h('div', {}, this.label)])
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
      return h('button', { ...this.$attrs }, this.$slots.default?.())
    },
  }),
}

/**内置组件实现*/
const BuildinComponents: { [k: string]: { [k: string]: any } } = {
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

export { BuildinComponents }
