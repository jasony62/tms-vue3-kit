import { SampleSchema } from '../data/schema-event'
import { build } from '../../src/json-doc/builder'

describe('通过API从外部获取值', () => {
  it('返回字段的值', (done) => {
    const onAxios = () => {
      return {
        post: (...args: any) => {
          return new Promise((resolve, reject) => {
            let result = { data: { result: { province: '北京' } } }
            resolve(result)
          })
        },
      }
    }
    const editDoc = {}
    const nodes = build({ schema: SampleSchema, editDoc, onAxios })
    // console.log(JSON.stringify(nodes, null, 2))
    setTimeout(() => {
      console.log('editDoc', editDoc)
      done()
    }, 1000)
  })
})
