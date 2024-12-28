import { utils } from './utils/index.js'

const helpers: any = {}
/**
 * Return the magnitude of `a`.
 *
 * @param {Number} `a`
 * @return {Number}
 * @api public
 */
helpers.abs = function (num) {
  if (!utils.isNumber(num)) {
    throw new TypeError('expected a number')
  }
  return Math.abs(num)
}

/**
 * Return the sum of `a` plus `b`.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @return {Number}
 * @api public
 */
helpers.add = function (a, b) {
  if (utils.isNumber(a) && utils.isNumber(b)) {
    return Number(a) + Number(b)
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a + b
  }
  return ''
}

/**
 * Returns the average of all numbers in the given array.
 *
 * ```handlebars
 * {{avg "[1, 2, 3, 4, 5]"}}
 * <!-- results in: '3' -->
 * ```
 *
 * @param {Array} `array` Array of numbers to add up.
 * @return {Number}
 * @api public
 */
helpers.avg = function () {
  let args = [].concat.apply([], arguments)
  // remove handlebars options object
  args.pop()
  return helpers.sum(args) / args.length
}
/**
 * Returns the max of all numbers in the given array.
 *
 * ```handlebars
 * {{max "[1, 2, 3, 4, 5]"}}
 * <!-- results in: '5' -->
 * ```
 *
 * @param {Array} `array` Array of numbers to add up.
 * @return {Number}
 * @api public
 */
helpers.max = function () {
  let args = [].concat.apply([], arguments)
  // remove handlebars options object
  args.pop()
  return Math.max(...args)
}
/**
 * Returns the min of all numbers in the given array.
 *
 * ```handlebars
 * {{min "[1, 2, 3, 4, 5]"}}
 * <!-- results in: '1' -->
 * ```
 *
 * @param {Array} `array` Array of numbers to add up.
 * @return {Number}
 * @api public
 */
helpers.min = function () {
  let args = [].concat.apply([], arguments)
  // remove handlebars options object
  args.pop()
  return Math.min(...args)
}
/**
 * Get the `Math.ceil()` of the given value.
 *
 * @param {Number} `value`
 * @return {Number}
 * @api public
 */
helpers.ceil = function (num) {
  if (!utils.isNumber(num)) {
    throw new TypeError('expected a number')
  }
  return Math.ceil(num)
}

/**
 * Divide `a` by `b`
 *
 * @param {Number} `a` numerator
 * @param {Number} `b` denominator
 * @api public
 */
helpers.divide = function (a, b) {
  if (!utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number')
  }
  if (!utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number')
  }
  return Number(a) / Number(b)
}

/**
 * Get the `Math.floor()` of the given value.
 *
 * @param {Number} `value`
 * @return {Number}
 * @api public
 */
helpers.floor = function (num) {
  if (!utils.isNumber(num)) {
    throw new TypeError('expected a number')
  }
  return Math.floor(num)
}

/**
 * Return the difference of `a` minus `b`.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @alias subtract
 * @api public
 */
helpers.minus = function (a, b) {
  if (!utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number')
  }
  if (!utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number')
  }
  return Number(a) - Number(b)
}

/**
 * Get the remainder of a division operation.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @return {Number}
 * @api public
 */
helpers.modulo = function (a, b) {
  if (!utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number')
  }
  if (!utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number')
  }
  return Number(a) % Number(b)
}

/**
 * Return the product of `a` times `b`.
 *
 * @param {Number} `a` factor
 * @param {Number} `b` multiplier
 * @return {Number}
 * @alias times
 * @api public
 */
helpers.multiply = function (a, b) {
  if (!utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number')
  }
  if (!utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number')
  }
  return Number(a) * Number(b)
}

/**
 * Add `a` by `b`.
 *
 * @param {Number} `a` factor
 * @param {Number} `b` multiplier
 * @api public
 */
helpers.plus = function (a, b) {
  if (!utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number')
  }
  if (!utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number')
  }
  return Number(a) + Number(b)
}

/**
 * Generate a random number between two values
 *
 * @param {Number} `min`
 * @param {Number} `max`
 * @return {String}
 * @api public
 */
helpers.random = function (min, max) {
  if (!utils.isNumber(min)) {
    throw new TypeError('expected minimum to be a number')
  }
  if (!utils.isNumber(max)) {
    throw new TypeError('expected maximum to be a number')
  }
  return utils.random(min, max)
}

/**
 * Get the remainder when `a` is divided by `b`.
 *
 * @param {Number} `a` a
 * @param {Number} `b` b
 * @api public
 */
helpers.remainder = function (a, b) {
  return a % b
}

/**
 * Round the given number.
 *
 * @param {Number} `number`
 * @return {Number}
 * @api public
 */
helpers.round = function (num) {
  if (!utils.isNumber(num)) {
    throw new TypeError('expected a number')
  }
  return Math.round(num)
}

/**
 * Return the product of `a` minus `b`.
 *
 * @param {Number} `a`
 * @param {Number} `b`
 * @return {Number}
 * @alias minus
 * @api public
 */
helpers.subtract = function (a, b) {
  if (!utils.isNumber(a)) {
    throw new TypeError('expected the first argument to be a number')
  }
  if (!utils.isNumber(b)) {
    throw new TypeError('expected the second argument to be a number')
  }
  return Number(a) - Number(b)
}

/**
 * Returns the sum of all numbers in the given array.
 *
 * ```handlebars
 * {{sum "[1, 2, 3, 4, 5]"}}
 * <!-- results in: '15' -->
 * ```
 * @param {Array} `array` Array of numbers to add up.
 * @return {Number}
 * @api public
 */
helpers.sum = function () {
  let args = [].concat.apply([], arguments)
  let len = args.length
  let sum = 0

  while (len--) {
    if (utils.isNumber(args[len])) {
      sum += Number(args[len])
    }
  }
  return sum
}

/**
 * Multiply number `a` by number `b`.
 *
 * @param {Number} `a` factor
 * @param {Number} `b` multiplier
 * @return {Number}
 * @alias multiply
 * @api public
 */
helpers.times = function () {
  return helpers.multiply.apply(this, arguments)
}

export default helpers
