import { SampleSchema } from '../data/schema-object-map'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('对象包含可选属性，可选属性为对象类型', () => {
  it('生成表单节点', () => {
    const rawDoc = {
      org: {
        name: '研发部',
        strProduct: 'tms-vue3-kit',
        'str in valid': '123',
        objAbc: { label: 'aaa', value: '111' },
        objXyz: { label: 'xxx', value: '999' },
      },
    }
    const editDoc = new DocAsArray(rawDoc)
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
    expect(fieldNames).toHaveLength(15)
    expect(fieldNames[0]).toBe('org.name')
    expect(fieldNames[1]).toBe('org.strProduct')
    expect(fieldNames[2]).toBe('org.objXyz.label')
    expect(fieldNames[3]).toBe('org.objAbc.label')
    expect(fieldNames[4]).toBe('org.objXyz.value')
    expect(fieldNames[5]).toBe('org.objAbc.value')
    expect(fieldNames[6]).toBe('org.objAbc.extra.label')
    expect(fieldNames[7]).toBe('org.objXyz.extra.label')
    expect(fieldNames[8]).toBe('org.objAbc.extra.value')
    expect(fieldNames[9]).toBe('org.objXyz.extra.value')
    expect(fieldNames[10]).toBe('org.objAbc.extra')
    expect(fieldNames[11]).toBe('org.objXyz.extra')
    expect(fieldNames[12]).toBe('org.objXyz')
    expect(fieldNames[13]).toBe('org.objAbc')
    expect(fieldNames[14]).toBe('org')
  })
})
