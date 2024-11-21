import bind from './hasown.js'

var call = Function.prototype.call
var $hasOwn = Object.prototype.hasOwnProperty

export default bind.call(call, $hasOwn)
