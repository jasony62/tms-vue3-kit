import isObject from './is-extendable.js'

export default function extend(o, ...args) {
  if (!isObject(o)) {
    o = {}
  }

  let len = args.length
  for (let i = 1; i < len; i++) {
    let obj = args[i]

    if (isObject(obj)) {
      assign(o, obj)
    }
  }
  return o
}

function assign(a, b) {
  for (let key in b) {
    if (hasOwn(b, key)) {
      a[key] = b[key]
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
