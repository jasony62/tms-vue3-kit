import { SampleSchema } from '../data/schema-simple'
import { build } from '../../src/json-doc/builder'

describe('简单定义生成表单节点', () => {
  it('构造表单节点', () => {
    const editDoc = {}
    const fieldNames: string[] = []
    build(
      {
        schema: SampleSchema,
        editDoc,
        onMessage: (msg: string) => {
          console.log(msg)
        },
      },
      fieldNames
    )
    expect(fieldNames).toHaveLength(3)
    expect(fieldNames[0]).toBe('additionalName[0]')
    expect(fieldNames[1]).toBe('additionalName[1]')
    expect(fieldNames[2]).toBe('additionalName')
  })
})
