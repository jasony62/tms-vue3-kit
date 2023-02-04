import RandExp from 'randexp'
/**
 * 生成符合指定正则表达式的随机字符串
 *
 * @param strRegExp
 * @returns
 */
export function genRandStringByExp(strRegExp: string): string {
  let randexp = new RandExp(new RegExp(strRegExp))
  randexp.max = 8
  let newKey = randexp.gen()
  return newKey
}
