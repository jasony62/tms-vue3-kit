const isExtensible = Object.isExtensible

export default function extend(o, ...args) {
  if (!isExtensible(o)) {
    o = {}
  }

  let len = args.length
  for (let i = 1; i < len; i++) {
    let obj = args[i]

    if (isExtensible(obj)) {
      assign(o, obj)
    }
  }
  return o
}

function assign(a, b) {
  for (let key in b) {
    if (Object.hasOwn(b, key)) {
      a[key] = b[key]
    }
  }
}
