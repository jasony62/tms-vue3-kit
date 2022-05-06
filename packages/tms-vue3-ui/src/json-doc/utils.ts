export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function getExtendibleLeaf(
  obj: { [x: string]: any },
  n: string | number,
  initIt: boolean
) {
  const v = obj[n]
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    return v
  }
  if (initIt && v === undefined) {
    obj[n] = {}
    return obj[n]
  }
}

export function getChild(data: { [x: string]: any }, ns: string | any[]) {
  if (ns.length === 1) {
    return data[ns[0]]
  }
  let obj = data[ns[0]]
  if (obj === undefined) return obj
  let i = 1
  const end = ns.length - 1
  for (; i < end; i++) {
    obj = getExtendibleLeaf(obj, ns[i], false)
    if (obj === undefined) return obj
  }
  return obj[ns[i]]
}

export function initChild(data: { [x: string]: any }, ns: any[]) {
  if (ns.length === 1) {
    const ret = getExtendibleLeaf(data, ns[0], true)
    if (ret === undefined) {
      throw new TypeError(
        'fail to init because namespace ' + ns[0] + ' = ' + data[ns[0]]
      )
    }
    return ret
  }
  let parent = data
  let obj = data[ns[0]]
  if (obj === undefined) {
    data[ns[0]] = {}
    obj = data[ns[0]]
  }
  for (let i = 1; i < ns.length; i++) {
    const n = ns[i]
    const ret = getExtendibleLeaf(obj, n, true)
    if (ret === undefined) {
      throw new TypeError(
        'fail to init because namespace ' +
          ns.join('.') +
          ' = ' +
          obj +
          '(' +
          typeof obj +
          ')'
      )
    }
    parent = obj
    obj = ret
    if (parent[n] === undefined) {
      throw new TypeError(
        'fail to init because namespace ' +
          ns.slice(0, i).join('.') +
          ' = ' +
          parent
      )
    }
  }
  return obj
}

export function formatVal(val: string | number) {
  return Number(val) < 10 ? '0' + val : '' + val
}

export function getNowTime() {
  const nowtime = new Date()
  const year = nowtime.getFullYear()
  const month = formatVal(nowtime.getMonth() + 1)
  const date = formatVal(nowtime.getDate())
  const hour = formatVal(nowtime.getHours())
  const minute = formatVal(nowtime.getMinutes())
  const seconds = formatVal(nowtime.getSeconds())

  return `${year}-${month}-${date} ${hour}:${minute}:${seconds}`
}
