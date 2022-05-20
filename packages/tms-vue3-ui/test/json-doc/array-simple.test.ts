import { SampleSchema } from '../data/schema-array-simple'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('定义包含数组，数组中项目为简单类型，生成表单节点', () => {
  // it('生成表单节点', () => {
  //   const editDoc = new DocAsArray({ additionalName: ['alice', 'bob'] })
  //   const fieldNames: string[] = []
  //   build(
  //     {
  //       schema: SampleSchema,
  //       editDoc,
  //       onMessage: (msg: string) => {
  //         console.log(msg)
  //       },
  //     },
  //     fieldNames
  //   )
  //   // console.log(fieldNames)
  //   expect(fieldNames).toHaveLength(3)
  //   let i = 0
  //   expect(fieldNames[i++]).toBe('additionalName')
  //   expect(fieldNames[i++]).toBe('additionalName[0]')
  //   expect(fieldNames[i++]).toBe('additionalName[1]')
  // })
  it('插入操作', () => {
    const editDoc = new DocAsArray({ additionalName: ['alice', 'bob'] })
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
    console.log(JSON.stringify(editDoc.properties, null, 2))
    editDoc.insertAt('additionalName[0]', '')
    console.log(JSON.stringify(editDoc.properties, null, 2))
    // console.log(fieldNames)
    // expect(fieldNames).toHaveLength(3)
    // let i = 0
    // expect(fieldNames[i++]).toBe('additionalName')
    // expect(fieldNames[i++]).toBe('additionalName[0]')
    // expect(fieldNames[i++]).toBe('additionalName[1]')
  })
})
