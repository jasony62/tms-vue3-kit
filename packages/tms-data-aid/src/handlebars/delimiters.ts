const cache: { [key: string]: any } = {}

/**
 * Pass `Handlebars` and the `delimiters` to use as replacements. This
 * patches the `Handlebars.compile` method to automatically use the
 * custom delimiters when compiling.
 *
 * ```js
 * var delimiters = require('handlebars-delimiters');
 * var handlebars = require('handlebars');
 * delimiters(handlebars, ['<%', '%>']);
 * // you can now use handlebars as usual, but with the new delimiters
 * ```
 * @param {Object} `Handlebars`
 * @param {Array} `delimiters` Array with open and close delimiters, like `['<%', '%>']`
 * @return {undefined}
 * @api public
 */
export function setDelimiters(Handlebars: any, delimiters: [string, string]) {
  if (delimiters[0].slice(-1) !== '=') {
    delimiters[0] += '(?!=)'
  }
  // 通过delimiters标识的模板部分
  let source = delimiters[0] + '([\\s\\S]+?)' + delimiters[1]

  // Idea for compile method from http://stackoverflow.com/a/19181804/1267639
  if (!Handlebars._compile) {
    Handlebars._compile = Handlebars.compile
  }

  Handlebars.compile = function (str: string) {
    let args: string[] = [].slice.call(arguments)
    if (typeof str === 'string') {
      if (delimiters[0] !== '{{' && delimiters[1] !== '}}') {
        args[0] = escapeDelimiters(args[0])
      }
      args[0] = replaceDelimiters(args[0], source)
    }
    return Handlebars._compile.apply(Handlebars, args)
  }
}
/**
 * 恢复默认设置
 * @param Handlebars
 */
export function resetDelimiters(Handlebars: any) {
  if (Handlebars._compile) {
    Handlebars.compile = Handlebars._compile
    delete Handlebars._compile
  }
}

/**
 * Replace or delimiters in the given string.
 *
 * ```js
 * var replaced = delimiters.replace(str, ['<%=', '%>']);
 * ```
 * @name .replace
 * @param {String} `str` String with handlebars to replace or escape.
 * @param {String} `source` The delimiters regex source string to conver to a regular expression.
 * @param {Boolean} `escape` If true, replacements are escaped with a double-slash.
 * @return {String}
 * @api public
 */

function replaceDelimiters(
  str: string,
  source: string,
  escape: boolean = false
) {
  const regex = cache[source] || (cache[source] = new RegExp(source, 'g'))
  let match

  // 逐个将指定delimiter替换为默认的delimiter
  while ((match = regex.exec(str))) {
    let prefix = str.slice(0, match.index)
    let inner = (escape ? '\\' : '') + '{{' + match[1] + '}}'
    let suffix = str.slice(match.index + match[0].length)
    str = prefix + inner + suffix
  }
  return str
}

/**
 * 添加‘\’，让默认的块失效
 *
 * ```
 * \{{foo}}
 * ```
 *
 * 直接输出：{{foo}}
 *
 * ```js
 * var escaped = delimiters.escape(str);
 * ```
 * @name .escape
 * @param {String} `str` String with handlebars to replace or escape.
 * @return {String}
 * @api public
 */

function escapeDelimiters(str: string) {
  return replaceDelimiters(str, '{{([\\s\\S]+?)}}', true)
}
