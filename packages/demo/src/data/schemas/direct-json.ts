export const SampleSchema = {
  $id: 'https://example.com/card.schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '属性的类型是JSON',
  type: 'object',
  properties: {
    id: {
      title: 'ID',
      type: 'string',
    },
    data: {
      title: '数据（JSON）',
      type: 'json',
      description: '显示时JSON字符串，保存时为对象',
    },
  },
}
