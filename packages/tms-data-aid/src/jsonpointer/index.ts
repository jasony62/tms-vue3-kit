import JSONPointer from 'jsonpointer'

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
    let pointer = '/' + dotPath.replace(/\.\[(\d+)\]/, '/$1').replace('.', '/')
    /**
     * 检查父节点是否为undefined或null，如果是则删除
     */
    let parts = pointer.split('/')
    if (parts.length > 2) {
      let pp = parts.slice(0, -1).join('/')
      let pv = JSONPointer.get(object, pp)
      if (pv ?? true) JSONPointer.set(object, pp, undefined)
    }
    JSONPointer.set(object, pointer, value)
  }
}

export { JSONPointer, JSONPointerLodash }
