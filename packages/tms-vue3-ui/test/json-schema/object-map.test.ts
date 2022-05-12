import { SampleSchema } from '../data/schema-object-map'
import { SchemaIter } from '../../src/json-schema/model'

describe('处理动态添加对象子属性的定义', () => {
  it('迭代JSONSchema属性', () => {
    const iter = new SchemaIter(SampleSchema)
    const props = Array.from(iter)
    expect(props).toHaveLength(4)
    console.log('iter', Array.from(iter))
  })
})
