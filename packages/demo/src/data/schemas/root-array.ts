export const SampleSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
  },
}

export const SampleData = []

export const SamplePasted = [
  { name: 'test1', title: '测试1', age: 10 },
  { name: 'test2', title: '测试2', age: 20 },
]
