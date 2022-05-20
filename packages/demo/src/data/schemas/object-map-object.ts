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
        '^str\\w+$': {
          title: '扩展属性简单类型',
          type: 'string',
          initialName: 'strNewProp',
        },
        '^obj\\w+$': {
          title: '扩展属性对象类型',
          type: 'object',
          initialName: 'objNewProp',
          properties: {
            label: {
              title: '标题',
              type: 'string',
            },
            value: {
              title: '数值',
              type: 'string',
            },
            extra: {
              title: '扩展数据',
              type: 'object',
              properties: {
                label: {
                  title: '标题2',
                  type: 'string',
                },
                value: {
                  title: '数值2',
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
}

export const SampleData = {
  org: {
    name: '研发部',
    strProduct: 'tms-vue3-kit',
    'str in valid': '123',
    objAbc: {
      label: 'aaa',
      value: '111',
      extra: { label: 'aaa_bbb', value: '111_222' },
    },
    objXyz: {
      label: 'xxx',
      value: '999',
      extra: { label: 'xxx_yyy', value: '999_888' },
    },
  },
}
