export const SampleSchema = {
  required: false,
  type: 'object',
  properties: {
    media: {
      type: 'object',
      format: 'file',
      title: '文件',
      properties: {
        name: {
          type: 'string',
          title: '组件名称',
        },
        title: {
          type: 'string',
          title: '组件标题',
        },
        data: {
          type: 'object',
          title: '组件数据',
          required: false,
          properties: {
            contentType: {
              type: 'string',
              title: '消息内容类型',
              readonly: true,
              default: 'application/vnd.gsma.rcs-ft-http+xml',
              required: true,
            },
            contentText: {
              type: 'array',
              title: '消息内容',
              description:
                '文件消息中，最多可以携带2个文件。当消息内容中携带2个文件时，其中一个文件为缩略图，一个文件为发送给用户的原文件，缩略图必须为不大于200K的图片文件。',
              required: false,
              items: {
                type: 'object',
                format: 'file',
                properties: {
                  type: {
                    type: 'string',
                    title: '文件类型',
                    oneOf: [
                      {
                        label: '文件',
                        value: 'file',
                      },
                      {
                        label: '缩略图',
                        value: 'thumbnail',
                      },
                    ],
                    required: true,
                  },
                  fileSize: {
                    type: 'number',
                    title: '文件大小（字节）',
                    required: false,
                  },
                  fileName: {
                    type: 'string',
                    title: '文件名称',
                    required: false,
                  },
                  contentType: {
                    type: 'string',
                    title: '内容类型',
                    required: false,
                  },
                  url: {
                    type: 'string',
                    title: '文件地址',
                    format: 'longtext',
                    required: false,
                    isOneOf: true,
                    isOneOfExclusiveGroup: '文件地址',
                  },
                  urlTemplate: {
                    type: 'string',
                    title: '文件地址模板',
                    format: 'handlebars',
                    isOneOf: true,
                    isOneOfExclusiveGroup: '文件地址',
                  },
                  until: {
                    type: 'string',
                    title: '到期时间',
                    required: false,
                  },
                },
              },
            },
          },
        },
        keywords: {
          type: 'array',
          title: '关键字',
          items: {
            type: 'string',
          },
        },
        remark: {
          type: 'string',
          title: '备注',
        },
      },
    },
  },
}

export const SampleData = {}

export const SampleFileSelect = {
  media: {
    data: {
      contentText: [
        {
          type: 'file',
          fileSize: 789,
          fileName: 'test',
          contentType: 'image/png',
          url: 'http://localhost/fs/0001.png',
        },
      ],
    },
  },
}
