export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '基本示例',
  type: 'object',
  required: ['name', 'tel'],
  properties: {
    nickname: {
      title: '昵称',
      type: 'string',
      default: 'nickname',
    },
  },
}
