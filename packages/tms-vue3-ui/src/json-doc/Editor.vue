<script lang="ts">
import BuildEditor from './builder'
import { h, PropType, reactive, toRaw } from 'vue'
import { RawSchema } from '@/json-schema/model';
import { deepClone } from './utils';

export default {
  props: {
    /**
     * The JSON Schema object. Use the `v-if` directive to load asynchronous schema.
     */
    schema: { type: Object as PropType<RawSchema>, required: true },
    /**
     * Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type.
     * @model
     * @default {}
     */
    value: { type: Object, default: () => ({}) },
    /**
     * This property indicates whether the value of the control can be automatically completed by the browser. Possible values are: `off` and `on`.
     */
    autoComplete: { type: String, default: 'off' },
    /**
     * This Boolean attribute indicates that the form is not to be validated when submitted.
     */
    noValidate: { type: Boolean, default: false },
    /**
     * Define the inputs wrapping class. Leave `undefined` to disable input wrapping.
     */
    fieldWrapClass: { type: String },
    /**
     * 是否需要显示表单按钮
     */
    requireButtons: { type: Boolean, default: () => true },
    /**
     * 通过动态数据 
     */
    onAxios: { type: Function },
    /**
     * 
     */
    onFileDownload: { type: Function }
  },
  setup(props: any, context: any) {
    /**
     * 返回表单中正在编辑的数据
     */
    const editing = (isCheckValidity = true): RawSchema => {
      // if (isCheckValidity && !checkValidity()) return false
      return toRaw(editDoc)
    }

    context.expose({ editing })

    const defaultDoc = deepClone(props.value)
    const editDoc = reactive(deepClone(props.value))

    return () => {
      const nodes = BuildEditor({ editDoc, schema: props.schema, onAxios: props.onAxios, onFileDownload: props.onFileDownload })
      return h('div', { class: ['tvu-jdoc__root'] }, nodes)
    }
  }
}
</script>
