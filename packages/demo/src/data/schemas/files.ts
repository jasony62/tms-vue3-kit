export const SampleSchema = {
  required: false,
  type: 'object',
  properties: {
    files: {
      type: 'array',
      required: false,
      default: [],
      title: '上传图片',
      items: {
        type: 'object',
        properties: {
          name: {
            title: '名字',
            type: 'string',
          },
          url: {
            title: '地址',
            type: 'string',
          },
        },
        required: false,
        format: 'file',
        formatAttrs: {
          accept: '',
          size: null,
          limit: null,
        },
      },
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
