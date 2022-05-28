export const SampleSchema = {
  $id: 'https://example.com/card.schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '选项依赖示例',
  type: 'object',
  properties: {
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
    activities: {
      title: '活动（根据性别关联选项）',
      type: 'string',
      required: false,
      enum: [
        {
          label: '购物',
          value: 'a',
          group: 'v1',
        },
        {
          label: '美容',
          value: 'b',
          group: 'v1',
        },
        {
          label: '游戏',
          value: 'c',
          group: 'v2',
        },
        {
          label: '打牌',
          value: 'd',
          group: 'v2',
        },
      ],
      enumGroups: [
        {
          id: 'v1',
          label: '分组1',
          assocEnum: {
            property: 'gender',
            value: 'female',
          },
        },
        {
          id: 'v2',
          label: '分组2',
          assocEnum: {
            property: 'gender',
            value: 'male',
          },
        },
      ],
    },
  },
}

export const SampleData = { name: 'overall' }
