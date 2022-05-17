import { SampleSchema } from '../data/schema-array-object'
import { build } from '../../src/json-doc/builder'

describe('定义包含数组，数组中项目为对象，生成表单节点', () => {
  it('生成表单节点', () => {
    const editDoc = { experiences: [{}, {}] }
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
    console.log(fieldNames)
  })
})
