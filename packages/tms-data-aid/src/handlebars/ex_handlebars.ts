import Handlebars from 'handlebars'
import StringHelpers from './helpers/string.js'
import RegexHelpers from './helpers/regex.js'
import MathHelpers from './helpers/math.js'
import ComparisonHelpers from './helpers/comparison.js'
import ArrayHelpers from './helpers/array.js'

Object.keys(StringHelpers).forEach((name) => {
  Handlebars.registerHelper(name, StringHelpers[name])
})

Object.keys(RegexHelpers).forEach((name) => {
  Handlebars.registerHelper(name, RegexHelpers[name])
})

Object.keys(MathHelpers).forEach((name) => {
  Handlebars.registerHelper(name, MathHelpers[name])
})

Object.keys(ComparisonHelpers).forEach((name) => {
  Handlebars.registerHelper(name, ComparisonHelpers[name])
})

Object.keys(ArrayHelpers).forEach((name) => {
  Handlebars.registerHelper(name, ArrayHelpers[name])
})

const Helpers = {
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
  JSONstringify: (obj: any, indent = 0) => {
    if (typeof indent !== 'number') indent = 0
    return JSON.stringify(obj, null, indent)
  },
}

Object.keys(Helpers).forEach((name) => {
  Handlebars.registerHelper(name, Helpers[name])
})

export { Handlebars }
