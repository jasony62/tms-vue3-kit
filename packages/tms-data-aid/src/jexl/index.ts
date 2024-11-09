import Jexl from 'jexl'
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
