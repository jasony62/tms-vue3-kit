<script lang="ts">
import { defineComponent, h, PropType, ref, computed, getCurrentInstance } from 'vue'
import { RawSchema } from '@/json-schema/model'
import { deepClone } from '@/utils'
import BuildEditor from './builder'
import { Field } from './fields'
import { DocAsArray } from './model'
import Debug from 'debug'

const debug = Debug('json-doc:editor')

type FileUploadArgs = {
  fullname: string // 文件对应的字段名称
  data: string // base64编码的文件内容
  field: Field
}

export default defineComponent({
  props: {
    /**
     * The JSON Schema object.
     */
    schema: { type: Object as PropType<RawSchema>, required: true },
    /**
     * Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type.
     * @model
     * @default {}
     */
    value: { type: Object, default: () => ({}) },
    /**
     * Define the inputs wrapping class. Leave `undefined` to disable input wrapping.
     */
    fieldWrapClass: { type: String },
    /**
     * 隐藏文档定义的标题
     */
    hideRootTitle: { type: Boolean, default: false },
    /**
     * 隐藏文档定义的描述
     */
    hideRootDescription: { type: Boolean, default: false },
    /**
     * 隐藏字段的描述
     */
    hideFieldDescription: { type: Boolean, default: false },
    /**
     * 显示字段路径名称
     */
    showFieldFullname: { type: Boolean, default: false },
    /**
     * 是否支持黏贴操作
     * 对象字段可以通过黏贴操作快速对子字段进行赋值
     */
    enablePaste: { type: Boolean, default: false },
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
    autofillRequest: { type: Function },
    /**
     * 黏贴操作回调函数
     */
    onPaste: {
      type: Function
    },
    /**
     * 选择文件的方法
     */
    onFileSelect: {
      type: Function as PropType<(field: Field) => Promise<any>>,
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
  emits: ['jdocFocus', 'jdocBlur'],
  setup(props: any, context: any) {
    const internalInstance = getCurrentInstance()
    /**
     * 返回表单中正在编辑的数据
     */
    const editing = (matchSchema = true): any => {
      return editDoc.build(matchSchema === true ? schema : null)
    }

    const {
      schema,
      enablePaste,
      onMessage,
      autofillRequest,
      onPaste,
      onFileUpload,
      onFileSelect,
      onFileDownload,
      hideRootTitle,
      hideRootDescription,
      hideFieldDescription,
      showFieldFullname
    } = props

    const editDoc = new DocAsArray(deepClone(props.value))
    debug(`初始文档属性列表\n` + JSON.stringify(editDoc.properties, null, 2))
    editDoc.renderCounter = ref(0) // 用于强制触发渲染

    context.expose({ editing, editDoc })

    /**全局保存所有的字段，方便查找*/
    const fields = new Map<string, Field>()
    /**根据文档数据和用户选择，全局保存所有的oneOf字段选择状态*/
    const oneOfSelected = new Set<string>()
    /**全局保留嵌套字段的折叠/展开状态*/
    const nestExpanded = new Set<string>()

    const ctx = {
      editDoc,
      fields,
      oneOfSelected,
      nestExpanded,
      schema,
      enablePaste,
      onMessage,
      autofillRequest,
      onPaste,
      onFileUpload,
      onFileSelect,
      onFileDownload,
      hideRootTitle,
      hideRootDescription,
      hideFieldDescription,
      showFieldFullname,
      onNodeFocus: (field: Field) => {
        debug(`节点【${field.fullname}】获得输入焦点，抛出jdocFocus事件`)
        internalInstance?.emit('jdocFocus', field)
      },
      onNodeBlur: (field: Field) => {
        debug(`节点【${field.fullname}】获得输入焦点，抛出jdocBlur事件`)
        internalInstance?.emit('jdocBlur', field)
      }
    }

    return () => {
      const fieldNames: string[] = []
      const nodes = BuildEditor(ctx, fieldNames)
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
