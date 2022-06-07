export const SampleSchema = {
  type: 'object',
  groupable: false,
  dependencies: {},
  eventDependencies: {},
  readonly: false,
  default: [],
  title: '根节点',
  required: false,
  items: {
    type: 'array',
    required: false,
    groupable: false,
    dependencies: {},
    eventDependencies: {},
    readonly: false,
    default: [],
    title: '上传图片',
    items: {
      type: 'object',
      required: false,
      groupable: false,
      dependencies: {},
      eventDependencies: {},
      readonly: false,
      default: '',
      format: 'image',
      title: '图片',
    },
  },
  properties: {
    files: {
      type: 'array',
      groupable: false,
      dependencies: {},
      eventDependencies: {},
      readonly: false,
      default: [],
      title: '上传图片',
      required: false,
      items: {
        type: 'object',
        required: false,
        groupable: false,
        dependencies: {},
        eventDependencies: {},
        readonly: false,
        default: '',
        format: 'file',
        title: '',
        formatAttrs: {
          accept: '',
          size: null,
          limit: null,
        },
        properties: {
          name: {
            type: 'string',
            title: '文件名称',
          },
          url: {
            type: 'string',
            title: '文件地址',
          },
        },
      },
    },
    title: {
      type: 'string',
      title: '标题',
    },
  },
}

export const SampleData = {
  files: [
    {
      name: 'test1.png',
      url: 'http://localhost:3010/fs/upload/test/test1.png',
    },
    {
      name: 'test2.png',
      url: 'http://localhost:3010/fs/upload/test/test2.png',
    },
  ],
}
