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

  const rewrited = Handlebars.compile(template)(parameters)

  if (reserveDelimiters !== true) {
    resetDelimiters(Handlebars)
  }

  return rewrited
}
