export const SampleSchema = {}

export const SampleData = []

export const SamplePastedSchema = {
  $: {
    type: 'object',
    title: '复制描述的内容，粘贴到address',
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
  },
  '$.address': {
    type: 'object',
    title: '地址',
    properties: {
      district: {
        title: '街道',
        type: 'string',
      },
      postcode: {
        title: '邮编',
        type: 'string',
      },
    },
  },
}
