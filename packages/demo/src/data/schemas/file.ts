export const SampleSchema = {
  required: false,
  type: 'object',
  properties: {
    media: {
      type: 'object',
      format: 'file',
      title: '文件',
      properties: {
        mediaUrl: {
          type: 'string',
          title: '文件地址',
        },
        mediaContentType: {
          type: 'string',
          title: '文件内容类型',
        },
        mediaFileSize: {
          type: 'number',
          title: '文件大小（字节）',
        },
        thumbnailUrl: {
          type: 'string',
          title: '文件缩略图地址',
        },
        thumbnailContentType: {
          type: 'string',
          title: '文件缩略图内容类型',
        },
        thumbnailFileSize: {
          type: 'number',
          title: '文件缩略图大小（字节）',
        },
      },
    },
  },
}

export const SampleData = {}
