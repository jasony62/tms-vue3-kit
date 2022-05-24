import { SampleSchema } from '../data/schema-file'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('对象包含数组，数组的项目是文件', () => {
  it('生成表单节点', () => {
    const rawDoc = { files: [{}, {}] }
    const editDoc = new DocAsArray(rawDoc)
    const fieldNames: string[] = []
    const onFileDownload = () => {}
    build(
      {
        schema: SampleSchema,
        editDoc,
        onMessage: (msg: string) => {
          console.log(msg)
        },
        onFileDownload,
      },
      fieldNames
    )
    // console.log(fieldNames)
    expect(fieldNames).toHaveLength(7)
    expect(fieldNames[0]).toBe('files[1].name')
    expect(fieldNames[1]).toBe('files[0].name')
    expect(fieldNames[2]).toBe('files[1].url')
    expect(fieldNames[3]).toBe('files[0].url')
    expect(fieldNames[4]).toBe('files[1]')
    expect(fieldNames[5]).toBe('files[0]')
    expect(fieldNames[6]).toBe('files')
  })
})
