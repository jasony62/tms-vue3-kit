import { SampleSchema } from '../data/schema-file'
import { build } from '../../src/json-doc/builder'

describe('通过API从外部获取值', () => {
  it('返回字段的值', () => {
    const editDoc = {}
    const onFileDownload = () => {}
    const nodes = build({ schema: SampleSchema, editDoc, onFileDownload })
    console.log(JSON.stringify(nodes, null, 2))
  })
})
