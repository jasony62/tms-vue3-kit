import falsey from 'falsey'
import isEven from 'is-even'
import hasValue from 'has-value'
import typeOf from 'kind-of'
import sortBy from 'array-sort'
import getValue from 'get-value'

const utils = {
  isUndefined: function (val: any) {
    return val === false
  },
  isNumber: function (val: any) {
    return typeof val === 'number'
  },
  isString: function (val) {
    return typeof val === 'string' && val !== ''
  },
  /**
   * Returns true if the given value is an object.
   *
   * ```js
   * console.log(utils.isObject(null));
   * //=> false
   * console.log(utils.isObject([]));
   * //=> false
   * console.log(utils.isObject(function() {}));
   * //=> false
   * console.log(utils.isObject({}));
   * //=> true
   * ```
   * @param {Object} `val`
   * @return {Boolean}
   * @api public
   */
  isObject: function (val) {
    return typeof val === 'object'
  },
  typeOf: function (val) {
    return typeOf(val)
  },
  falsey: function (val) {
    return falsey(val)
  },
  isEven: function (num) {
    return isEven(num)
  },
  /* `object`, optionally passing a starting index.
   *
   * @param {Array} val
   * @param {Object} obj
   * @param {Number} start
   * @return {Boolean}
   */
  contains: function (val, obj, start) {
    if (val == null || obj == null || !utils.isNumber(val.length)) {
      return false
    }
    return val.indexOf(obj, start) !== -1
  },
  has: function (val, prop) {
    return hasValue(val, prop)
  },
  /**
   * Remove leading and trailing whitespace and non-word
   * characters from the given string.
   *
   * @param {String} `str`
   * @return {String}
   */
  chop: function (str) {
    if (!utils.isString(str)) return ''
    let re = /^[-_.\W\s]+|[-_.\W\s]+$/g
    return str.trim().replace(re, '')
  },
  /**
   * Change casing on the given `string`, optionally
   * passing a delimiter to use between words in the
   * returned string.
   *
   * ```handlebars
   * utils.changecase('fooBarBaz');
   * //=> 'foo bar baz'
   *
   * utils.changecase('fooBarBaz' '-');
   * //=> 'foo-bar-baz'
   * ```
   * @param {String} `string` The string to change.
   * @return {String}
   * @api public
   */
  changecase: function (str, fn) {
    if (!utils.isString(str)) return ''
    if (str.length === 1) {
      return str.toLowerCase()
    }

    str = utils.chop(str).toLowerCase()
    if (typeof fn !== 'function') {
      // fn = utils.identity
      fn = (ch) => ch
    }

    // 匹配分割字符后的第一个字符，转换为大写
    let re = /[-_.\W\s]+(\w|$)/g
    return str.replace(re, function (_, ch) {
      return fn(ch)
    })
  },
  /**
   * Generate a random number
   *
   * @param {Number} `min`
   * @param {Number} `max`
   * @return {Number}
   * @api public
   */
  random: function (min, max) {
    return min + Math.floor(Math.random() * (max - min + 1))
  },
  /**
   * Iterate over each comparison property or function until `1` or `-1`
   * is returned.
   *
   * @param  {String|Array|Function} `props` One or more object paths or comparison functions.
   * @param  {Object} `opts` Pass `{ reverse: true }` to reverse the sort order.
   * @return {Array}
   */
  sortBy: function (props, opts) {
    return sortBy(props, opts)
  },
  /**
   *
   * @param data
   * @param hash
   * @returns
   */
  createFrame: function (data, hash) {
    let frame = Object.assign({}, data, hash)
    return frame
  },
  /**
   *
   * @param array
   * @param value
   * @returns
   */
  indexOf: function (array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i
      }
    }
    return -1
  },
  /**
   *
   * @param target
   * @param path
   * @param options
   * @returns
   */
  get: function (target, path, options?) {
    return getValue(target, path, options)
  },
}

const utils_hb = {
  /**
   * Returns true if a helper is a block helper.
   *
   * ```js
   * Handlebars.registerHelper('example', function(options) {
   *   if (utils.isBlock(options)) {
   *     // do something if this is a block helper
   *   } else {
   *     // do something else if this is a not block helper
   *   }
   * });
   * ```
   * @param {Object} `options` Helper options object
   * @return {Boolean}
   * @api public
   */

  isBlock: function (options) {
    return (
      utils_hb.isOptions(options) &&
      typeof options.fn === 'function' &&
      typeof options.inverse === 'function'
    )
  },
  /**
   * Returns true if the given value is a handlebar `options` object.
   *
   * ```js
   * Handlebars.registerHelper('example', function(val, locals, options) {
   *   if (utils.isOptions(locals)) {
   *     options = locals;
   *     locals = {};
   *   }
   *   // do stuff
   * });
   * ```
   * @param {Object} `val`
   * @return {Boolean}
   * @api public
   */
  isOptions: function (val) {
    return utils.isObject(val) && utils.isObject(val.hash)
  },
  /**
   * Gets the return value for a helper, by either rendering the block
   * or inverse block if it's a block helper, or returning the given value
   * (when truthy) or an empty string (when falsey) if it's a non-block expression.
   *
   * ```js
   * Handlebars.registerHelper('example', function(val, locals, options) {
   *   return utils.value(val, locals, options);
   * });
   * ```
   * @param {any} `val`
   * @param {Object} `options`
   * @param {Object} `context`
   * @return {String}
   * @api public
   */
  value: function (val, context, options) {
    if (utils_hb.isOptions(val)) {
      return utils_hb.value(null, val, options)
    }
    if (utils_hb.isOptions(context)) {
      return utils_hb.value(val, {}, context)
    }
    if (utils_hb.isBlock(options)) {
      return !!val ? options.fn(context) : options.inverse(context)
    }
    return val
  },
  /**
   * Returns the given value or renders the block if it's a block helper.
   *
   * ```js
   * Handlebars.registerHelper('example', function(val, locals, options) {
   *   return utils.fn(val, locals, options);
   * });
   * ```
   * @param {any} `val`
   * @param {Object} `options`
   * @param {Object} `context`
   * @return {String} Either returns the value, or renders the block.
   * @api public
   */
  fn: function (val, context, options) {
    if (utils_hb.isOptions(val)) {
      return utils_hb.fn('', val, options)
    }
    if (utils_hb.isOptions(context)) {
      return utils_hb.fn(val, {}, context)
    }
    return utils_hb.isBlock(options) ? options.fn(context) : val
  },
  /**
   * Returns the given value as-is, unchanged.
   *
   * ```js
   * console.log(utils.result('foo'));
   * //=> 'foo'
   * console.log(utils.result(function() {
   *   return 'foo';
   * }));
   * //=> [function]
   * ```
   * @param  {any} `val`
   * @return {any}
   * @api public
   */

  identity: function (val) {
    return val
  },
  /**
   * Returns the given value or renders the inverse block if it's a block helper.
   *
   * ```js
   * Handlebars.registerHelper('example', function(val, locals, options) {
   *   return utils.inverse(val, locals, options);
   * });
   * ```
   * @param {any} `val`
   * @param {Object} `options`
   * @param {Object} `context`
   * @return {String} Either returns the value, or renders the inverse block.
   * @api public
   */
  inverse: function (val, context, options) {
    if (utils_hb.isOptions(val)) {
      // return utils_hb.identity('', val, options)
      return utils_hb.identity('')
    }
    if (utils_hb.isOptions(context)) {
      return utils_hb.inverse(val, {}, context)
    }
    return utils_hb.isBlock(options) ? options.inverse(context) : val
  },
  /**
   * Creates an options object from the `context`, `locals` and `options.`
   * Handlebars' `options.hash` is merged onto the options, and if the context
   * is created by [templates][], `this.options` will be merged onto the
   * options as well.
   *
   * @param {Object} `context`
   * @param {Object} `locals` Options or locals
   * @param {Object} `options`
   * @return {Boolean}
   * @api public
   */
  options: function (thisArg, locals, options?) {
    if (utils_hb.isOptions(thisArg)) {
      return utils_hb.options({}, locals, thisArg)
    }
    if (utils_hb.isOptions(locals)) {
      return utils_hb.options(thisArg, options, locals)
    }
    options = options || {}
    if (!utils_hb.isOptions(options)) {
      locals = Object.assign({}, locals, options)
    }
    var opts = Object.assign({}, locals, options.hash)
    if (utils.isObject(thisArg)) {
      opts = Object.assign({}, thisArg.options, opts)
    }
    if (opts[options.name]) {
      opts = Object.assign({}, opts[options.name], opts)
    }
    return opts
  },
  /**
   * Returns the given value. If the value is a function it will be
   * called with the current context, otherwise the value is returned.
   *
   * ```js
   * console.log(utils.result('foo'));
   * //=> 'foo'
   * console.log(utils.result(function() {
   *   return 'foo';
   * }));
   * //=> 'foo'
   * ```
   * @param  {any} `val`
   * @return {any}
   * @api public
   */
  result: function (val) {
    if (typeof val === 'function') {
      return val.apply(this, [].slice.call(arguments, 1))
    }
    return val
  },
}

export { utils, utils_hb }
