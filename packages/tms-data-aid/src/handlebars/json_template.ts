import { resetDelimiters, setDelimiters } from './delimiters.js'
import { RewriteOptions } from './types.js'

class JsonTransformer {
  private _transformedValue: any

  constructor(
    private _handlebars: any,
    private _inputJson: any, // 模板
    private _parameters: any,
    private _delimiters?: [string, string]
  ) {
    this._transformedValue = this.transform(_inputJson)
  }
  /**
   * 检查指定字符串是否包含模板
   *
   * @param value
   * @returns
   */
  private isTemplate(value: string) {
    if (Array.isArray(this._delimiters) && this._delimiters.length === 2) {
      const [begin, end] = this._delimiters
      return new RegExp(`${begin}.*${end}`)
    }
    return new RegExp(`{{.*}}`).test(value)
  }
  /**
   *
   * @param value
   * @returns
   */
  private transform(value: any): any {
    if (Array.isArray(value)) {
      return value.map(this.transform.bind(this))
    } else if (typeof value === 'object' && value !== null) {
      const newObj: any = {}
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          newObj[key] = this.transform(value[key])
        }
      }
      return newObj
    } else if (typeof value === 'string') {
      if (this.isTemplate(value)) {
        // 根据模板生成值
        const newValue = this._handlebars.compile(value, { noEscape: true })(
          this._parameters
        )
        // 处理JSON字符串
        if (/^{{\s*JSONstringify/.test(value)) {
          try {
            return JSON.parse(newValue)
          } catch (e) {
            return value
          }
        }

        return newValue
      }
      return value
    } else {
      return value
    }
  }

  private get transformedValue(): any {
    return this._transformedValue
  }

  static run(
    handlebars: any,
    inputJson: any,
    data: any,
    delimiters?: [string, string]
  ) {
    const transformer = new JsonTransformer(
      handlebars,
      inputJson,
      data,
      delimiters
    )
    return transformer.transformedValue
  }
}

/**
 * 转换JSON数据
 *
 * 如果上下文数据是数组，模板对应的是数组中的元素
 *
 * @param originalJson 模板
 * @param parameters 上下文数据
 * @param options 配置项
 * @returns
 */
export async function jsonRender(
  originalJson: any,
  parameters: any,
  options: RewriteOptions = {}
) {
  const { delimiters, reserveDelimiters = false } = options

  const { Handlebars } = await import('./ex_handlebars.js')
  if (Array.isArray(delimiters) && delimiters.length === 2) {
    setDelimiters(Handlebars, delimiters)
  }
  /**
   * 执行改写
   */
  let rewrited: any // 改写结果
  if (Array.isArray(parameters)) {
    rewrited = parameters.map((item) => {
      return JsonTransformer.run(Handlebars, originalJson, item, delimiters)
    })
  } else {
    rewrited = JsonTransformer.run(
      Handlebars,
      originalJson,
      parameters,
      delimiters
    )
  }
  if (reserveDelimiters !== true) {
    resetDelimiters(Handlebars)
  }

  return rewrited
}
