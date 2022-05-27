export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '属性值自动填充',
  type: 'object',
  properties: {
    areaCode: {
      title: '区号',
      type: 'string',
      enum: [
        {
          label: '010',
          value: '010',
        },
        {
          label: '029',
          value: '029',
        },
      ],
    },
    province: {
      title: '省份',
      type: 'string',
      autofill: {
        url: 'http://localhost:8080/order/api/admin/document/list?db=testSync&cl=areacode&page=1&size=100',
        params: ['areaCode'],
        target: 'value',
        runPolicy: 'onCreate',
      },
    },
  },
}
