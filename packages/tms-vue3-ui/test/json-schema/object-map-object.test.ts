import { SampleSchema } from '../data/schema-object-map'
import { SchemaIter } from '../../src/json-schema/model'

describe('处理动态添加对象子属性的定义', () => {
  it('迭代JSONSchema属性', () => {
    const iter = new SchemaIter(SampleSchema)
    const props = Array.from(iter)
    console.log('props', props)
    expect(props).toHaveLength(10)
  })
})
