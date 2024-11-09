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
    JSONPointer.set(object, pointer, value)
  }
}

export { JSONPointer, JSONPointerLodash }
