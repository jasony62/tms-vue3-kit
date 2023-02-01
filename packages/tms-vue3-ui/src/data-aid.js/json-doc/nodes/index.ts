import { Node } from './node'
import { FieldNode } from './fieldNode'
import { Input } from './input'
import { Select } from './select'
import { Textarea } from './textarea'
import { Checkboxgroup } from './checkboxgroup'
import { DateTime } from './dateTime'
import { ArrayNode } from './array'
import { ObjectNode } from './object'
import { FieldWrap } from './fieldWrap'
import { FormNode } from './form'
import { Field } from '../fields'
import { FormContext } from '../builder'

const option = { native: true }
/**
 * 支持的组件类型
 */
const components: { [k: string]: any } = {
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

function prepareFieldNode<VNode>(
  h: (type: string, props?: any, children?: any) => VNode,
  ctx: FormContext,
  field: Field,
  children?: (VNode | null)[]
): FieldNode<VNode> {
  switch (field.type) {
    case 'textarea':
      return new Textarea(ctx, field, h)
    case 'dateTime':
      return new DateTime(ctx, field, h)
    case 'select':
      return new Select(ctx, field, h)
    case 'checkboxgroup':
      return new Checkboxgroup(ctx, field, h)
    case 'array':
      return new ArrayNode(ctx, field, h, children)
    case 'object':
      return new ObjectNode(ctx, field, h, children)
    default:
      return new Input(ctx, field, h)
  }
}

export {
  components,
  prepareFieldNode,
  Node,
  FieldNode,
  Input,
  Select,
  Textarea,
  Checkboxgroup,
  ArrayNode,
  ObjectNode,
  FieldWrap,
  FormNode,
  DateTime,
}
