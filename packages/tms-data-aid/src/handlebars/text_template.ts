import { resetDelimiters, setDelimiters } from './delimiters.js'
import { RewriteOptions } from './types.js'
/**
 * 转换文本数据
 *
 * @param template 模板
 * @param parameters 上下文
 * @param options 配置项
 * @returns
 */
export async function textRender(
  template: string,
  parameters: any,
  options: RewriteOptions = {}
) {
  const { delimiters, reserveDelimiters = false } = options

  const { Handlebars } = await import('./ex_handlebars.js')
  if (Array.isArray(delimiters) && delimiters.length === 2) {
    setDelimiters(Handlebars, delimiters)
  }

  let rewrited = Handlebars.compile(template)(parameters)

  /**
   * 将数据还原为原始值
   */
  let re
  if (Array.isArray(delimiters) && delimiters.length === 2) {
    const [begin] = this._delimiters
    re = new RegExp(`^${begin}\s*JSONstringify`)
  } else {
    re = new RegExp('^{{2,3}s*JSONstringify')
  }
  if (re.test(template)) {
    try {
      let parsed = JSON.parse(rewrited)
      rewrited = parsed
    } catch (e) {}
  }

  if (reserveDelimiters !== true) {
    resetDelimiters(Handlebars)
  }

  return rewrited
}
