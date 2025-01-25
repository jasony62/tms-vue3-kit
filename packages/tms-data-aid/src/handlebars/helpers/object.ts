import { utils, utils_hb } from './utils/index.js'
import array from './array.js'

const hasOwn = Object.hasOwnProperty

const helpers: any = {}
/**
 * Extend the context with the properties of other objects.
 * A shallow merge is performed to avoid mutating the context.
 *
 * @param {Object} `objects` One or more objects to extend.
 * @return {Object}
 * @api public
 */

helpers.extend = function (/*objects*/) {
  let args = [].slice.call(arguments)
  let opts = {}

  if (utils_hb.isOptions(args[args.length - 1])) {
    // remove handlebars options object
    opts = args.pop().hash
    // re-add handlebars options.hash object
    args.push(opts)
  }

  let context = {}
  for (let i = 0; i < args.length; i++) {
    let obj = args[i]
    if (utils.isObject(obj)) {
      let keys = Object.keys(obj)
      for (let j = 0; j < keys.length; j++) {
        let key = keys[j]
        context[key] = obj[key]
      }
    }
  }

  return context
}

/**
 * Block helper that iterates over the properties of
 * an object, exposing each key and value on the context.
 *
 * @param {Object} `context`
 * @param {Object} `options`
 * @return {String}
 * @block
 * @api public
 */

helpers.forIn = function (obj, options) {
  if (!utils_hb.isOptions(options)) {
    return obj.inverse(this)
  }

  let data = utils.createFrame(options, options.hash)
  let result = ''

  let keys = Object.keys(obj)
  let index = 0
  let length = keys.length
  for (let key in obj) {
    data.key = key
    data.index = index
    data.total = length
    index++
    result += options.fn(obj[key], { data: data })
  }
  return result
}

/**
 * Block helper that iterates over the **own** properties of
 * an object, exposing each key and value on the context.
 *
 * @param {Object} `obj` The object to iterate over.
 * @param {Object} `options`
 * @return {String}
 * @block
 * @api public
 */

helpers.forOwn = function (obj, options) {
  if (!utils_hb.isOptions(options)) {
    return obj.inverse(this)
  }

  let data = utils.createFrame(options, options.hash)
  let result = ''

  let index = 0
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      data.key = key
      data.index = index
      index++
      result += options.fn(obj[key], { data: data })
    }
  }
  return result
}

/**
 * Take arguments and, if they are string or number, convert them to a dot-delineated object property path.
 *
 * @param {String|Number} `prop` The property segments to assemble (can be multiple).
 * @return {String}
 * @api public
 */

helpers.toPath = function (/*prop*/) {
  let prop = []
  for (let i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] === 'string' || typeof arguments[i] === 'number') {
      prop.push(arguments[i])
    }
  }
  return prop.join('.')
}

/**
 * Use property paths (`a.b.c`) to get a value or nested value from
 * the context. Works as a regular helper or block helper.
 *
 * @param {String} `prop` The property to get, optionally using dot notation for nested properties.
 * @param {Object} `context` The context object
 * @param {Object} `options` The handlebars options object, if used as a block helper.
 * @return {String}
 * @block
 * @api public
 */

helpers.get = function (prop, context, options) {
  let val = utils.get(context, prop)
  if (options && options.fn) {
    return val ? options.fn(val) : options.inverse(context)
  }
  return val
}
/**
 * Use property paths (`a.b.c`) to get an object from
 * the context. Differs from the `get` helper in that this
 * helper will return the actual object, including the
 * given property key. Also, this helper does not work as a
 * block helper.
 *
 * @param {String} `prop` The property to get, optionally using dot notation for nested properties.
 * @param {Object} `context` The context object
 * @return {String}
 * @api public
 */

helpers.getObject = function (prop, context) {
  return utils.getObject(context, prop)
}
/**
 * Return true if `key` is an own, enumerable property
 * of the given `context` object.
 *
 * ```handlebars
 * {{hasOwn context key}}
 * ```
 *
 * @param {String} `key`
 * @param {Object} `context` The context object.
 * @return {Boolean}
 * @api public
 */

helpers.hasOwn = function (context, key) {
  return hasOwn.call(context, key)
}

/**
 * Return true if `value` is an object.
 *
 * ```handlebars
 * {{isObject "foo"}}
 * //=> false
 * ```
 * @param {String} `value`
 * @return {Boolean}
 * @api public
 */

helpers.isObject = function (value) {
  return utils.typeOf(value) === 'object'
}

/**
 * Parses the given string using `JSON.parse`.
 *
 * ```handlebars
 * <!-- string: '{"foo": "bar"}' -->
 * {{JSONparse string}}
 * <!-- results in: { foo: 'bar' } -->
 * ```
 * @param {String} `string` The string to parse
 * @contributor github.com/keeganstreet
 * @block
 * @api public
 */

helpers.JSONparse = function (str, options) {
  return JSON.parse(str)
}

/**
 * Deeply merge the properties of the given `objects` with the
 * context object.
 *
 * @param {Object} `object` The target object. Pass an empty object to shallow clone.
 * @param {Object} `objects`
 * @return {Object}
 * @api public
 */

helpers.merge = function (context /*, objects, options*/) {
  let args = [].slice.call(arguments)
  let opts = {}

  if (utils_hb.isOptions(args[args.length - 1])) {
    // remove handlebars options object
    opts = args.pop().hash
    // re-add options.hash
    args.push(opts)
  }

  return Object.assign.apply(null, args)
}

/**
 * Pick properties from the context object.
 *
 * @param {Array|String} `properties` One or more properties to pick.
 * @param {Object} `context`
 * @param {Object} `options` Handlebars options object.
 * @return {Object} Returns an object with the picked values. If used as a block helper, the values are passed as context to the inner block. If no values are found, the context is passed to the inverse block.
 * @block
 * @api public
 */

helpers.pick = function (props, context, options) {
  var keys = array.arrayify(props)
  var len = keys.length,
    i = -1
  var result = {}

  while (++i < len) {
    result = helpers.extend({}, result, utils.getObject(context, keys[i]))
  }

  if (options.fn) {
    if (Object.keys(result).length) {
      return options.fn(result)
    }
    return options.inverse(context)
  }
  return result
}

/**
 * Stringify an object using `JSON.stringify`.
 *
 * ```handlebars
 * <!-- object: { foo: 'bar' } -->
 * {{JSONstringify object}}
 * <!-- results in: '{"foo": "bar"}' -->
 * ```
 * @param {Object} `obj` Object to stringify
 * @return {String}
 * @api public
 */
helpers.JSONstringify = function (obj: any, indent = 0) {
  if (typeof indent !== 'number') indent = 0
  return JSON.stringify(obj, null, indent)
}
/**
 * Alias for parseJSON. this will be
 * deprecated in a future release
 */

helpers.parseJSON = helpers.JSONparse

/**
 * Alias for JSONstringify. this will be
 * deprecated in a future release
 */
helpers.stringify = helpers.JSONstringify

export default helpers
