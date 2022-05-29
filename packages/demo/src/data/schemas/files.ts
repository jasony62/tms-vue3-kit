export const SampleSchema = {
  required: false,
  default: [],
  type: 'object',
  properties: {
    files: {
      type: 'array',
      required: false,
      default: [],
      title: '上传图片',
      items: {
        type: 'object',
        required: false,
        default: '',
        format: 'file',
        title: '',
        formatAttrs: {
          accept: '',
          size: null,
          limit: null,
        },
      },
    },
  },
}
