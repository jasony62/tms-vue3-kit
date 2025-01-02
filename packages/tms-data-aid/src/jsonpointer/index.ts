import JSONPointer from 'jsonpointer'
import lodashSet from 'lodash.set'

/**
 * lodash兼容的路径
 */
class JSONPointerLodash {
  /**
   *
   * @param object
   * @param dotPath
   * @param value
   */
  static set(object: Object, dotPath: string, value: any) {
    // let pointer =
    //   '/' + dotPath.replaceAll(/\[(\d+)\]/g, '/-').replaceAll('.', '/')
    // /**
    //  * 检查父节点是否为undefined或null，如果是则删除
    //  */
    // let parts = pointer.split('/')
    // if (parts.length > 2) {
    //   let pp = parts.slice(0, -1).join('/')
    //   let pv = JSONPointer.get(object, pp)
    //   if (pv === undefined || pv === null)
    //     if (/\/-$/.test(pp)) {
    //       JSONPointer.set(object, pp, [])
    //     } else JSONPointer.set(object, pp, undefined)
    // }
    // JSONPointer.set(object, pointer, value)
    lodashSet(object, dotPath, value)
  }
}

export { JSONPointer, JSONPointerLodash }
