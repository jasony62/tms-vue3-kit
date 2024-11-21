import isAccessor from './is-accessor-descriptor.js'
import isData from './is-data-descriptor.js'

export default function isDescriptor(obj, key?) {
  if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false
  }

  if ('get' in obj || 'set' in obj) {
    return isAccessor(obj, key)
  }

  return isData(obj, key)
}
