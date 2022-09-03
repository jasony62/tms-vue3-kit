import { Input } from './input'

export class Checkboxgroup extends Input {
  /**
   * 更新field对应的model数据
   */
  updateModel(newValue: any) {
    const { field, ctx } = this
    const fullname = field.fullname
    const fieldName = field.name
    if (fieldName) {
      if (
        field.items &&
        field.itemType &&
        /integer|number/.test(field.itemType)
      ) {
        newValue = Number(newValue)
      }

      const { editDoc } = ctx
      let fieldValue = editDoc.get(fullname)
      if (fieldValue === null && fieldValue === undefined) {
        editDoc.set(fullname, [], false)
        fieldValue = editDoc.get(fullname)
      }

      if (!Array.isArray(fieldValue))
        throw Error(`字段【${fullname}】的值不是数组，不能添加子字段`)

      /**处理子节点*/
      const childIndex = fieldValue.indexOf(newValue)
      if (childIndex !== -1) {
        editDoc.remove(`${fullname}[${childIndex}]`)
      } else {
        editDoc.appendAt(fullname, newValue)
      }
    }
  }
}
