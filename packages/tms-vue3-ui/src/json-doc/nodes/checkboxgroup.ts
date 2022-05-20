import { Input } from './input'

export class Checkboxgroup extends Input {
  /**
   * 更新field对应的model数据
   */
  updateModel(newValue: any) {
    const { field } = this
    const fieldName = field.fullname
    const name = field.name
    if (name) {
      if (
        field.items &&
        field.itemType &&
        /integer|number/.test(field.itemType)
      ) {
        newValue = Number(newValue)
      }

      const { editDoc } = this.ctx
      const fieldValue = editDoc.init(fieldName, [])

      /**处理子节点*/
      const childIndex = fieldValue.indexOf(newValue)
      if (childIndex !== -1) {
        editDoc.remove(`${fieldName}[${childIndex}]`)
      } else {
        editDoc.appendAt(fieldName, newValue, fieldValue.length - 1)
      }
    }
  }
}
