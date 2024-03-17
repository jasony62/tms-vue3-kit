export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '基本示例',
  type: 'object',
  properties: {
    additionalName: {
      title: '其他名称',
      type: 'array',
      description: '基础类型数组',
      items: {
        type: 'string',
      },
    },
    colors: {
      title: '颜色',
      type: 'array',
      description: '提供了enum',
      items: {
        type: 'string',
      },
      enum: [
        {
          label: '红色',
          value: 'red',
        },
        {
          label: '绿色',
          value: 'green',
        },
        {
          label: '蓝色',
          value: 'blue',
        },
      ],
    },
    cites: {
      title: '城市',
      type: 'array',
      description: '提供了anyOf',
      items: {
        type: 'string',
      },
      anyOf: [
        {
          label: '北京',
          value: 'beijing',
        },
        {
          label: '上海',
          value: 'shanghai',
        },
        {
          label: '广州',
          value: 'guangzhou',
        },
      ],
    },
  },
}

export const SampleData = {}
