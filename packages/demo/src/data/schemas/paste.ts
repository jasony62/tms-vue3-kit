export const SampleSchema = {
  type: 'object',
  title: '复制描述的内容，粘贴到address',
  description: JSON.stringify({
    type: 'object',
    properties: {
      city: {
        type: 'string',
      },
      district: {
        type: 'string',
      },
      street: {
        type: 'string',
      },
    },
  }),
  properties: {
    name: {
      type: 'string',
    },
    address: {
      type: 'object',
    },
    age: {
      type: 'number',
    },
  },
}

export const SampleData = {}
