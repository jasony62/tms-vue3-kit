import { initChild } from '@/utils'
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

      const formModel = initChild(
        this.ctx.editDoc,
        fieldName.split('.').slice(1),
        []
      )
      const index = formModel.indexOf(newValue)
      if (index !== -1) formModel.splice(index, 1)
      else formModel.push(newValue)
    }
  }
}
