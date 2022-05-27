<script lang="ts">
import { defineComponent, h, PropType, ref } from 'vue'
import { RawSchema } from '@/json-schema/model'
import { deepClone } from '@/utils'
import BuildEditor from './builder'
import { Field } from './fields'
import { DocAsArray } from './model'

type FileSelectArgs = {
  fullname: string // 文件对应的字段名称
  fileld: Field
}

type FileUploadArgs = {
  fullname: string // 文件对应的字段名称
  data: string // base64编码的文件内容
  field: Field
}

export default defineComponent({
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
     * 接收处理内部消息提醒的方法
     */
    onMessage: {
      type: Function,
      default: (msg: string) => {
        alert(msg)
      },
    },
    /**
     * 通过动态数据
     */
    onAutofill: { type: Function },
    /**
     * 选择文件的方法
     */
    onFileSelect: {
      type: Function as PropType<(args: FileSelectArgs) => Promise<any>>,
    },
    /**
     * 上传文件并返回文件信息的方法
     */
    onFileUpload: {
      type: Function as PropType<(args: FileUploadArgs) => Promise<any>>,
    },
    /**
     * 文件下载方法
     */
    onFileDownload: { type: Function },
  },
  setup(props: any, context: any) {
    /**
     * 返回表单中正在编辑的数据
     */
    const editing = (isCheckValidity = true): any => {
      // if (isCheckValidity && !checkValidity()) return false
      return editDoc.build()
    }
    context.expose({ editing })

    const editDoc = new DocAsArray(deepClone(props.value))
    editDoc.renderCounter = ref(0)

    return () => {
      let {
        schema,
        onMessage,
        onAutofill,
        onFileUpload,
        onFileSelect,
        onFileDownload,
      } = props
      const fieldNames: string[] = []
      const nodes = BuildEditor(
        {
          editDoc,
          schema,
          onMessage,
          onAutofill,
          onFileUpload,
          onFileSelect,
          onFileDownload,
        },
        fieldNames
      )
      console.log('render...')
      return h(
        'div',
        {
          'data-render-counter': editDoc.renderCounter.value,
          class: ['tvu-jdoc__root'],
        },
        nodes
      )
    }
  },
})
</script>
