import { SampleSchema as SchemaSimple } from '../data/schema-simple'
import { SampleSchema as SchemaArraySimple } from '../data/schema-array-simple'
import { SampleSchema as SchemaArrayObject } from '../data/schema-array-object'
import { JSONSchemaBuilder } from '../../src/json-schema/builder'

describe('处理JSONSchema', () => {
  it('基本处理', () => {
    const builder = new JSONSchemaBuilder()
    builder.flatten(SchemaSimple)
    const { props } = builder
    expect(props).toHaveLength(6)
    // console.log(props)
  })
  it('数组中是简单类型的情况', () => {
    const builder = new JSONSchemaBuilder()
    builder.flatten(SchemaArraySimple)
    const { props } = builder
    //1个根节点，1个顶层节点
    expect(props).toHaveLength(2)
    // console.log(props)
    // console.log(JSON.stringify(builder.unflatten(), null, 2))
  })
  it('数组中是对象的情况', () => {
    const builder = new JSONSchemaBuilder()
    builder.flatten(SchemaArrayObject)
    const { props } = builder
    builder.addProp(props[1])
    //1个根节点，1个父节点，3个子节点
    expect(props).toHaveLength(5)
    // console.log(props)
    // console.log(JSON.stringify(builder.unflatten(), null, 2))
  })
})
