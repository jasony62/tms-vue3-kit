import JsonLogic from 'json-logic-js'
/**
 * 检查输入是否为合法的url
 * @param url
 * @returns
 */
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
 * 对输入的字符串进行正则匹配
 * ```
 * { stringMatch: ['helle tms-data-aid', 'TMS', 'i'] }
 * ```
 * @param input
 * @param rule
 * @param flag
 * @returns
 */
function stringMatch(input: string, rule: string, flag = '') {
  try {
    return new RegExp(rule, flag).test(input)
  } catch (err) {
    return false
  }
}
JsonLogic.add_operation('stringMatch', stringMatch)
/**
 * 生成包含制定数字的数组
 *
 * ```
 * { arange: [3, 20, 5] }
 * ```
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
