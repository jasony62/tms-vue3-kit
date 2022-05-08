import { SampleSchema } from '../data/schema-array-object'
import { build } from '../../src/json-doc/builder'

describe('通过API从外部获取值', () => {
  it('返回字段的值', () => {
    const editDoc = { experiences: [{}] }
    const nodes = build({ schema: SampleSchema, editDoc })
    /**
     * 1 根节点，div
     * 1.1 嵌套节点，div
     * 1.1.1 标题节点 div
     * 1.1.2 字段节点 div
     * 1.1.2.1 time
     * 1.1.2.2 content
     */
    // console.log(JSON.stringify(nodes, null, 2))
  })
})
