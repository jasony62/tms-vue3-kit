import { Node } from './node.js'
import { FieldNode } from './fieldNode.js'
import { Input } from './input.js'
import { Select } from './select.js'
import { Textarea } from './textarea.js'
import { Checkboxgroup } from './checkboxgroup.js'
import { DateTime } from './dateTime.js'
import { ArrayNode } from './array.js'
import { ObjectNode } from './object.js'
import { FieldWrap } from './fieldWrap.js'
import { FormNode } from './form.js'
import { Field } from '../fields/index.js'
import { FormContext } from '../builder.js'
import { components } from './common.js'

function prepareFieldNode<VNode>(
  ctx: FormContext<VNode>,
  field: Field,
  children?: (VNode | null)[]
): FieldNode<VNode> {
  switch (field.type) {
    case 'textarea':
      return new Textarea(ctx, field)
    case 'dateTime':
      return new DateTime(ctx, field)
    case 'select':
      return new Select(ctx, field)
    case 'checkboxgroup':
      return new Checkboxgroup(ctx, field)
    case 'array':
      return new ArrayNode(ctx, field, children)
    case 'object':
      return new ObjectNode(ctx, field, children)
    default:
      return new Input(ctx, field)
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
