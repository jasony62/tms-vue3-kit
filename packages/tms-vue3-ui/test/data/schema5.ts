export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '基本示例',
  type: 'object',
  properties: {
    name: {
      title: '姓名',
      type: 'string',
    },
    nickname: {
      title: '昵称',
      type: 'string',
      default: 'nickname',
    },
    gender: {
      title: '性别（单选框）',
      type: 'string',
      oneOf: [
        {
          label: '男',
          value: 'male',
        },
        {
          label: '女',
          value: 'female',
        },
      ],
    },
  },
  dependencies: {
    name: {
      dependencyRules: {
        '1': {
          rules: [{ property: 'gender', value: 'male' }],
          operator: 'and',
        },
      },
      operator: 'or',
    },
  },
}
