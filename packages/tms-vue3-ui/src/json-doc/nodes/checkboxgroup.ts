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
      const fieldValue = editDoc.init(fullname, [])

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
