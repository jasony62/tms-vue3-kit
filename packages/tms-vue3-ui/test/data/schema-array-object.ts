export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '数组中是对象',
  type: 'object',
  properties: {
    tel: {
      title: '联系电话',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          phoneNumber: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
        },
      },
    },
  },
}
