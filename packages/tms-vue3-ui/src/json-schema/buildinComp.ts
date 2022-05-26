import { defineComponent, h } from 'vue'
/**
 * 依赖的组件
 */
const components = {
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
        class: ['tvu-input'],
        onInput: ($event: any) => {
          this.$emit('update:modelValue', $event.target.value)
        },
      })
    },
  }),
  upload: defineComponent({
    props: ['fileList', 'uploadFile', 'removeFile'],
    render() {
      const divNode = this.fileList?.map((file: any) => {
        return h('div', { class: 'tvu-jse__attachment' }, [
          h('div', file.name),
          h(
            'button',
            {
              onClick: () => {
                this.removeFile(file)
              },
            },
            '删除文件'
          ),
        ])
      })
      return h('div', { class: ['tvu-jse__upload'] }, [
        ...divNode,
        h(
          'div',
          {
            onClick: () => {
              const elInput = document.createElement('input')
              elInput.setAttribute('type', 'file')
              document.body.appendChild(elInput)
              elInput.addEventListener('change', async (e: Event) => {
                const target = e.target as HTMLInputElement
                if (target.files) {
                  const file = target.files[0]
                  this.uploadFile(file)
                }
              })
              elInput.click()
            },
          },
          this.$slots.default?.()
        ),
      ])
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
      return h('div', { class: ['tvu-jse__checkbox'] }, [
        h('div', h('input', inputProps)),
        h('div', {}, this.label),
      ])
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
          class: ['tvu-input'],
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
      return h(
        'button',
        { class: ['tvu-button'], ...this.$attrs },
        this.$slots.default?.()
      )
    },
  }),
}

/**内置组件实现*/
const BuildinComponents: { [k: string]: { [k: string]: any } } = {
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
