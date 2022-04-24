// 用Symbol Vue会报错
// const ARR_ASSOC = Symbol('arr_assoc')
const ARR_ASSOC = '__arr_assoc'
const PROXY_OB = Symbol('proxy_ob')
const PROXY_OB_VALUE = Symbol('proxy_ob_value')

function indexOf(target, search, from = 0) {
  const arr = target[ARR_ASSOC]
  const start = from < 0 ? arr.length + from : from
  return arr.findIndex(({ val }, index) => index >= start && val === search)
}

function assocOf(target, search, from = 0) {
  const arr = target[ARR_ASSOC]
  const start = from < 0 ? arr.length + from : from
  return arr.find(({ val }, index) => index >= start && val === search)
}

function push(target, ...pushed) {
  if (!Array.isArray(target)) return false
  const arr = target[ARR_ASSOC]
  let length = target.length
  pushed.forEach((v) => {
    length = target.push(v)
    arr.push({ key: length - 1, val: v })
  })
  return length
}

function splice(target, start, deleteCount, ...items) {
  if (!Array.isArray(target)) return []
  const arr = target[ARR_ASSOC]
  arr.splice(
    start,
    deleteCount,
    items.map((item, index) => ({ key: start + index, val: item }))
  )
  delete target[ARR_ASSOC]
  target.splice(start, deleteCount, ...items)
  target[ARR_ASSOC] = arr
  return true
}

function append(handler, val, key) {
  const { target, customHandler } = handler
  if (Array.isArray(target)) {
    return push(target, val) >= 0
  }
  if (typeof customHandler.defineProperty === 'function') {
    customHandler.defineProperty(target, key, val)
  } else {
    target[key] = val
  }
  const arr = target[ARR_ASSOC]
  arr.push({ key, val })

  return true
}
/**
 * 删除、添加、移动
 * @param {*} target
 * @param {*} key
 * @param {*} newKey
 */
function rename(handler, key, newKey) {
  const { target, customHandler } = handler
  const val = target[key]
  const beforeIndex = findKeyIndex(target, key)
  const arr = target[ARR_ASSOC]
  const length = arr.length
  arr.splice(beforeIndex, 1)
  if (typeof customHandler.deleteProperty === 'function') {
    customHandler.deleteProperty(target, key)
  } else {
    delete target[key]
  }
  if (typeof customHandler.defineProperty === 'function') {
    customHandler.defineProperty(target, key)
  } else {
    target[newKey] = val
  }
  arr.push({ key: newKey, val })

  move(handler, length - 1, -1 * (length - beforeIndex - 1))
}

function findKeyIndex(target, searchKey) {
  const arr = target[ARR_ASSOC]
  if (arr) {
    let index = arr.findIndex(({ key }) => key === searchKey)
    if (index === -1 && Number.isInteger(searchKey)) {
      if (searchKey >= 0 && searchKey < arr.length) index = searchKey
    }
    return index
  }
  return -1
}

function findIndexKey(target, searchIndex) {
  const arr = target[ARR_ASSOC]
  if (arr) {
    const assoc = arr[searchIndex]
    if (assoc) return assoc.key
  }
  return undefined
}

function move(handler, indexOrProp, step) {
  const { target, customHandler } = handler
  const isArray = Array.isArray(target)
  const arr = target[ARR_ASSOC]

  let index = findKeyIndex(target, indexOrProp)
  if (index === -1) return false

  const oldIndex = index
  const newIndex = oldIndex + parseInt(step)

  // 更新关联数组中的位置
  let [assoc] = arr.splice(oldIndex, 1)
  arr.splice(newIndex, 0, assoc)

  // 更新目标对象中的位置
  if (isArray) {
    const [val] = target.splice(oldIndex, 1)
    target.splice(newIndex, 0, val)
  } else {
    const minIndex = Math.min(oldIndex, newIndex)
    const affected = arr.slice(minIndex)
    const fnDel =
      typeof customHandler.deleteProperty === 'function'
        ? (key) => customHandler.deleteProperty(target, key)
        : (key) => delete target[key]
    affected.forEach(({ key }) => fnDel(key))

    const fnSet =
      typeof customHandler.defineProperty === 'function'
        ? (key, val) => customHandler.defineProperty(target, key, val)
        : (key, val) => (target[key] = val)

    affected.forEach(({ key, val }) => fnSet(key, val))
  }

  return newIndex
}

function objectForEach(target, callback) {
  const arr = target[ARR_ASSOC]
  arr.forEach(({ val }, index) => {
    callback(val, index)
  })
}

function objectMap(target, callback) {
  const arr = target[ARR_ASSOC]
  return arr.map(({ val }, index) => callback(val, index))
}
/**
 *
 */
class AssocHandler {
  constructor(target, customHandler) {
    this.target = target
    this.customHandler = customHandler
  }

  get(target, property) {
    if (property === '__target__') {
      return target
    } else if (property === '__ob__') {
      return target[PROXY_OB]
    } else if (property === 'indexOf') {
      return function (search, from = 0) {
        return indexOf(target, search, from)
      }
    } else if (property === 'findIndexKey') {
      return function (search, from = 0) {
        return findIndexKey(target, search, from)
      }
    } else if (property === 'assocOf') {
      return function (search, from = 0) {
        return assocOf(target, search, from)
      }
    } else if (property === 'push') {
      return function (...pushed) {
        return push(target, ...pushed)
      }
    } else if (property === 'splice') {
      return function (...args) {
        return splice(target, ...args)
      }
    } else if (property === 'move') {
      return (index, step) => {
        return move(this, index, step)
      }
    } else if (property === 'append') {
      return (val, key) => {
        return append(this, val, key)
      }
    } else if (property === 'rename') {
      return (key, newKey) => {
        return rename(this, key, newKey)
      }
    }
    /**
     * 扩充对象的属性
     */
    if (!Array.isArray(target)) {
      const arr = target[ARR_ASSOC]
      // length
      if (property === 'length') return arr.length
      // obj[int]
      if (!isNaN(parseInt(property))) {
        if (property < 0 && property >= arr.length) return undefined
        let assoc = arr[property]
        return assoc.val
      }
      // forEach
      if (property === 'forEach') {
        return function (callback) {
          return objectForEach(target, callback)
        }
      }
      // map
      if (property === 'map') {
        return function (callback) {
          return objectMap(target, callback)
        }
      }
    }

    return target[property]
  }
  set(target, property, value) {
    return append(this, value, property)
  }
  deleteProperty(target, property) {
    delete target[property]
    const index = findKeyIndex(target, property)
    if (index !== -1) {
      const arr = target[ARR_ASSOC]
      arr.splice(index, 1)
    }
    return true
  }
}

/**
 * 将数组或对象转换为关联数组
 */
export class Objarr {
  /**
   *
   * @param {*} target
   * @param {*} customHandler
   */
  constructor(target, customHandler = {}) {
    const arr = []
    if (Array.isArray(target)) {
      target.forEach((val, key) => arr.push({ key, val }))
    } else {
      Object.entries(target).forEach(([key, val]) => arr.push({ key, val }))
    }
    target[ARR_ASSOC] = arr
    /**
     * 捕获对observe对象的更新
     */
    if (target.hasOwnProperty('__ob__')) {
      target[PROXY_OB] = new Proxy(target.__ob__, {
        get: function (ob, prop) {
          if (prop === 'value') return target[PROXY_OB_VALUE]
          return ob[prop]
        },
      })
      target[PROXY_OB_VALUE] = new Proxy(target.__ob__.value, {
        defineProperty: function (obValue, property, descriptor) {
          const rst = Reflect.defineProperty(obValue, property, descriptor)
          if (rst) {
            const val = obValue[property]
            arr.push({ key: property, val })
          }
          return rst
        },
      })
    }

    const assocHandler = new AssocHandler(target, customHandler)

    return new Proxy(target, assocHandler)
  }
}
