import getValue from 'get-value'
import Jexl from 'jexl'

Jexl.addTransform('keys', (val) =>
  val && typeof val === 'object' ? Object.keys(val) : []
)

Jexl.addTransform('values', (val) =>
  val && typeof val === 'object' ? Object.values(val) : []
)

Jexl.addTransform('parseInt', (val) =>
  Array.isArray(val) ? val.map((v) => parseInt(v)) : parseInt(val)
)

Jexl.addTransform('parseFloat', (val) =>
  Array.isArray(val) ? val.map((v) => parseFloat(v)) : parseFloat(val)
)

Jexl.addTransform('length', (val) => val?.length ?? 0)

Jexl.addTransform('sum', (val: number[]) =>
  Array.isArray(val) ? val.reduce((a: number, b: number) => a + b, 0) : 0
)

Jexl.addTransform('max', (val: number[]) =>
  Array.isArray(val) ? Math.max(...val) : 0
)

Jexl.addTransform('min', (val: number[]) =>
  Array.isArray(val) ? Math.min(...val) : 0
)

Jexl.addTransform('reduce', (val: number[]) =>
  Array.isArray(val) ? val.reduce((a: number, b: number) => a + b, 0) : 0
)
/**
 * arr1 = [{ a: 1 }, { a: 2 }, { a: 3 }]
 * expr = 'arr1 | pluck("a")'
 * output [1, 2, 3]
 */
Jexl.addTransform('pluck', (val: any[], prop: string) =>
  Array.isArray(val) ? val.map((a: any) => getValue(a, prop)) : val
)
/**
 * 将对象数组转为字典对象（object）
 *
 * arr3 = [ { "n": "x", "a": 1 }, { "n": "y", "a": 2 }, { "n": "z", "a": 3 } ]
 * expr = "arr3 | dict('n')""
 * output { "x": { "n": "x", "a": 1 }, "y": { "n": "y", "a": 2 }, "z": { "n": "z", "a": 3 } }
 */
Jexl.addTransform('dict', (val: any[], prop: string) =>
  Array.isArray(val)
    ? val.reduce((dict, item: any) => {
        let k = item[prop]
        if (k && typeof k === 'string') dict[k] = item
        return dict
      }, {})
    : val
)
/**
 * 合并对象
 *
 * 如果属性已经存在，只对原始值进行覆盖
 */
Jexl.addTransform('merge', function (val: object, delta: object) {
  function merge(obj1, obj2) {
    if (obj2 && typeof obj2 === 'object') {
      let keys = Object.keys(obj2)
      for (let key of keys) {
        if (obj1[key] && typeof obj1[key] === 'object') {
          merge(obj1[key], obj2[key])
        } else {
          obj1[key] = obj2[key]
        }
      }
    }

    return obj1
  }
  // 必须都是对象
  if (val && typeof val === 'object' && delta && typeof delta === 'object')
    merge(val, delta)

  return val
})

Jexl.addTransform('avg', (val: number[]) =>
  Array.isArray(val)
    ? val.reduce((a: number, b: number) => a + b, 0) / val.length
    : 0
)

Jexl.addFunction('padRightToLength', (arr, maxLength = 0, padChar = 0) => {
  if (!Array.isArray(arr)) return arr
  if (arr.length >= maxLength) return arr
  return [
    ...arr,
    ...Array.from({ length: maxLength - arr.length }, () => padChar),
  ]
})
/**
 * 获取数组长度
 */
Jexl.addFunction('arrayLength', (arr: any[]) => {
  return arr?.length ?? 0
})
/**
 * 元素不在数组中
 */
Jexl.addBinaryOp('nin', 1, (item, arr) => !arr?.includes(item))
/**
 * 在数组中追加元素
 */
Jexl.addFunction('push', (arr: any[], newItem: any) => {
  arr.push(newItem)
  return arr
})

export { Jexl }
