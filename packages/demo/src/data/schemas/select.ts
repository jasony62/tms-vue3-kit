export const SampleSchema = {
  description: '基本示例',
  type: 'object',
  properties: {
    gender: {
      title: '性别',
      type: 'string',
      description: '用oneOf生成单选框',
      oneOf: [
        {
          value: 'male',
        },
        {
          label: '女',
          value: 'female',
        },
      ],
    },
    hobbies: {
      title: '爱好',
      type: 'array',
      items: {
        type: 'string',
      },
      description: '用anyOf生成多选框',
      anyOf: [
        {
          label: '美食',
          value: 'food',
        },
        {
          label: '读书',
          value: 'book',
        },
        {
          value: 'film',
        },
        {
          value: 'trip',
        },
      ],
    },
    areaCode: {
      title: '区号（选项）',
      type: 'string',
      description: '用enum生成下拉框',
      enum: [
        {
          label: '北京',
          value: '010',
        },
        {
          value: '029',
        },
      ],
    },
  },
}

export const SampleData = {}
