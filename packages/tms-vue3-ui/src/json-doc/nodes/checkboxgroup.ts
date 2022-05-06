import { initChild } from '../../utils'
import { Input } from './input'

export class Checkboxgroup extends Input {
  /**
   * 更新field对应的model数据
   */
  updateModel(newValue: any) {
    const { field } = this
    const fieldName = field.fullname
    const path = fieldName.split('.').slice(1)
    const name = path.pop()
    if (name) {
      const formModel =
        path.length > 0 ? initChild(this.ctx.editDoc, path) : this.ctx.editDoc

      if (!Array.isArray(formModel[name])) formModel[name] = []

      if (
        field.items &&
        field.itemType &&
        /integer|number/.test(field.itemType)
      ) {
        newValue = Number(newValue)
      }

      const index = formModel[name].indexOf(newValue)
      if (index !== -1) formModel[name].splice(index, 1)
      else formModel[name].push(newValue)
    }
  }
}
