const option = { native: true }
/**
 * 支持的组件类型
 */
export const components: { [k: string]: any } = {
  title: { tag: 'h1', option },
  description: { tag: 'p', option },
  error: { tag: 'div', option },
  form: { tag: 'div', option },
  fieldWrap: { tag: 'div', option },
  fieldLabel: { tag: 'label', option },
  fieldDescription: { tag: 'div', option },
  input: { tag: 'input', option },
  textarea: { tag: 'textarea', option },
  radio: { tag: 'input', option },
  radiogroup: { tag: 'div', option },
  select: { tag: 'select', option },
  option: { tag: 'option', option },
  checkbox: { tag: 'input', option },
  checkboxgroup: { tag: 'div', option },
  object: { tag: 'div', option },
  array: { tag: 'div', option },
  file: { tag: 'div', option },
  button: { tag: 'button', option },
  a: { tag: 'a', option },
}
