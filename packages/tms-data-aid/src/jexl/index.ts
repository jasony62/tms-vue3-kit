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

Jexl.addTransform('pluck', (val: any[], prop: string) =>
  Array.isArray(val) ? val.map((a: any) => getValue(a, prop)) : val
)

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

export { Jexl }
