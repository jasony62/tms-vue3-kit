export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '默认值示例。因为属性定义有默认值，构造表单时会自动更新文档。',
  type: 'object',
  properties: {
    generalPurposeCard: {
      type: 'object',
      required: false,
      title: 'RCS单卡片消息',
      properties: {
        layout: {
          type: 'object',
          required: false,
          title: '布局方式',
          properties: {
            cardOrientation: {
              type: 'string',
              required: false,
              title: '卡片方向',
              default: 'HORIZONTAL',
            },
            imageAlignment: {
              type: 'string',
              required: false,
              title: '图片对齐方式',
              default: 'LEFT',
            },
            style: {
              type: 'string',
              required: false,
              title: '样式文件',
            },
          },
        },
      },
    },
    cardArray: {
      title: 'RCS单卡片消息-数组',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          layout: {
            type: 'object',
            required: false,
            title: '布局方式',
            properties: {
              cardOrientation: {
                type: 'string',
                required: false,
                title: '卡片方向',
                default: 'HORIZONTAL',
              },
              imageAlignment: {
                type: 'string',
                required: false,
                title: '图片对齐方式',
                default: 'LEFT',
              },
              style: {
                type: 'string',
                required: false,
                title: '样式文件',
              },
            },
          },
        },
      },
    },
  },
}

export const SampleData = {}
