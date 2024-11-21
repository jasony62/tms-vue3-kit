let ERROR_MESSAGE = 'Function.prototype.bind called on incompatible '
let toStr = Object.prototype.toString
let max = Math.max
let funcType = '[object Function]'

let concatty = function concatty(a, b) {
  let arr = []

  for (let i = 0; i < a.length; i += 1) {
    arr[i] = a[i]
  }
  for (let j = 0; j < b.length; j += 1) {
    arr[j + a.length] = b[j]
  }

  return arr
}

let slicy = function slicy(arrLike, offset) {
  let arr = []
  for (let i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
    arr[j] = arrLike[i]
  }
  return arr
}

let joiny = function (arr, joiner) {
  let str = ''
  for (let i = 0; i < arr.length; i += 1) {
    str += arr[i]
    if (i + 1 < arr.length) {
      str += joiner
    }
  }
  return str
}

function bind(that) {
  let target = this
  if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target)
  }
  let args = slicy(arguments, 1)

  let bound
  let binder = function () {
    if (this instanceof bound) {
      let result = target.apply(this, concatty(args, arguments))
      if (Object(result) === result) {
        return result
      }
      return this
    }
    return target.apply(that, concatty(args, arguments))
  }

  let boundLength = max(0, target.length - args.length)
  let boundArgs = []
  for (let i = 0; i < boundLength; i++) {
    boundArgs[i] = '$' + i
  }

  bound = Function(
    'binder',
    'return function (' +
      joiny(boundArgs, ',') +
      '){ return binder.apply(this,arguments); }'
  )(binder)

  if (target.prototype) {
    let Empty = function Empty() {}
    Empty.prototype = target.prototype
    bound.prototype = new Empty()
    Empty.prototype = null
  }

  return bound
}

export default bind
