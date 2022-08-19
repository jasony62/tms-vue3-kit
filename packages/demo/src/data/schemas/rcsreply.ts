export const SampleSchema = {
  type: 'object',
  required: false,
  properties: {
    name: {
      type: 'string',
      required: false,
      title: '名称',
    },
    title: {
      type: 'string',
      required: false,
      title: '标题',
    },
    reply: {
      type: 'object',
      required: false,
      title: '消息数据',
      properties: {
        displayText: {
          type: 'string',
          required: false,
          title: '显示内容',
        },
        postback: {
          type: 'object',
          required: false,
          title: '回复数据',
          properties: {
            data: {
              type: 'string',
              required: false,
              title: '回复数据的值',
            },
          },
        },
      },
    },
    keywords: {
      type: 'array',
      required: false,
      title: '关键字列表',
      description: '按关键字搜索',
      items: {
        type: 'string',
      },
    },
  },
}

export const SampleData = []
