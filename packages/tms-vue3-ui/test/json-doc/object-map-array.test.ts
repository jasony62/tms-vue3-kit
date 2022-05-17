import { SampleSchema } from '../data/schema-object-map-array'
import { build } from '../../src/json-doc/builder'

describe('对象包含可选属性，可选属性为数组类型', () => {
  it('生成表单节点', () => {
    const editDoc = {
      org: {
        name: '研发部',
        arrAbc: [{ label: 'aaa', value: '111' }],
        arrXyz: [{ label: 'xxx', value: '999' }],
      },
    }
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
    // console.log(fieldNames)
    expect(fieldNames).toHaveLength(10)
    expect(fieldNames[0]).toBe('org.name')
    expect(fieldNames[1]).toBe('org.arrXyz[0].label')
    expect(fieldNames[2]).toBe('org.arrAbc[0].label')
    expect(fieldNames[3]).toBe('org.arrXyz[0].value')
    expect(fieldNames[4]).toBe('org.arrAbc[0].value')
    expect(fieldNames[5]).toBe('org.arrXyz[0]')
    expect(fieldNames[6]).toBe('org.arrXyz')
    expect(fieldNames[7]).toBe('org.arrAbc[0]')
    expect(fieldNames[8]).toBe('org.arrAbc')
    expect(fieldNames[9]).toBe('org')
  })
})
