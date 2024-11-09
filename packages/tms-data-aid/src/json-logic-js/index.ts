import JsonLogic from 'json-logic-js'

function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch (err) {
    return false
  }
}

JsonLogic.add_operation('isValidUrl', isValidUrl)
/**
 * 生成包含制定数字的数组
 *
 * @param start
 * @param end
 * @param step
 * @returns
 */
function arange(start, end, step = 1) {
  let arr = []
  for (let i = start; i < end; i += step) {
    arr.push(i)
  }
  return arr
}

JsonLogic.add_operation('arange', arange)

export { JsonLogic }
