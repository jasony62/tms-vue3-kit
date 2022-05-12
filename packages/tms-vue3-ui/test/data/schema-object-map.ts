export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '对象名由正则表达式定义',
  type: 'object',
  properties: {
    org: {
      title: '组织（可扩展对象）',
      type: 'object',
      properties: {
        name: {
          title: '组织名称',
          type: 'string',
        },
      },
      patternProperties: {
        '^\\w+$': {
          title: '扩展属性',
          type: 'string',
        },
      },
    },
  },
}
