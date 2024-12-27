import Handlebars from 'handlebars'
import StringHelpers from './helpers/string.js'
import NumberHelpers from './helpers/number.js'
import RegexHelpers from './helpers/regex.js'
import MathHelpers from './helpers/math.js'
import ComparisonHelpers from './helpers/comparison.js'
import ArrayHelpers from './helpers/array.js'
import ObjectHelpers from './helpers/object.js'

Object.keys(StringHelpers).forEach((name) => {
  Handlebars.registerHelper(name, StringHelpers[name])
})

Object.keys(NumberHelpers).forEach((name) => {
  Handlebars.registerHelper(name, NumberHelpers[name])
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

Object.keys(ObjectHelpers).forEach((name) => {
  Handlebars.registerHelper(name, ObjectHelpers[name])
})

const Helpers = {}

Object.keys(Helpers).forEach((name) => {
  Handlebars.registerHelper(name, Helpers[name])
})

export { Handlebars }
