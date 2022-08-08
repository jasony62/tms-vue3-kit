import { JSONSchemaBuilder } from '../../src/json-schema/builder'

describe('处理JSONSchema', () => {
  it('测试向前移动属性', () => {
    const schema = {
      type: 'object',
    }

    let counter = 0
    let newName = () => `prop_${++counter}`

    const builder = new JSONSchemaBuilder()
    builder.flatten(schema)
    const rootProp = builder.props[0]
    // 添加
    let newProp1 = builder.addProp(rootProp)
    newProp1.name = newName()
    expect(builder.fullnames()).toEqual(['', 'prop_1'])
    // 添加
    let newProp2 = builder.addProp(rootProp)
    newProp2.name = newName()
    expect(builder.fullnames()).toEqual(['', 'prop_1', 'prop_2'])
    // 在前面添加
    let newProp3 = builder.addPropBefore(newProp2)
    if (newProp3) {
      newProp3.name = newName()
      expect(builder.fullnames()).toEqual(['', 'prop_1', 'prop_3', 'prop_2'])
      // 向后移动
      builder.moveUp(newProp2)
      expect(builder.fullnames()).toEqual(['', 'prop_1', 'prop_2', 'prop_3'])
      // 第1个属性不能向前移动
      expect(builder.canMoveUp(newProp1)).toBeFalsy()
      expect(builder.moveUp(newProp1)).toBeFalsy()
      // 最后1个属性不能向后移动
      expect(builder.canMoveDown(newProp3)).toBeFalsy()
      expect(builder.moveDown(newProp3)).toBeFalsy()

      /**将3个属性改为对象，验证嵌套情况下的是否正确*/
      newProp1.attrs.type = 'object'
      let newProp4 = builder.addProp(newProp1)
      newProp4.name = newName()
      newProp2.attrs.type = 'object'
      let newProp5 = builder.addProp(newProp2)
      newProp5.name = newName()
      newProp3.attrs.type = 'object'
      let newProp6 = builder.addProp(newProp3)
      newProp6.name = newName()
      expect(builder.fullnames()).toEqual([
        '',
        'prop_1',
        'prop_1.prop_4',
        'prop_2',
        'prop_2.prop_5',
        'prop_3',
        'prop_3.prop_6',
      ])
      // 向前移动
      builder.moveUp(newProp3)
      expect(builder.fullnames()).toEqual([
        '',
        'prop_1',
        'prop_1.prop_4',
        'prop_3',
        'prop_3.prop_6',
        'prop_2',
        'prop_2.prop_5',
      ])
      builder.moveUp(newProp3)
      expect(builder.fullnames()).toEqual([
        '',
        'prop_3',
        'prop_3.prop_6',
        'prop_1',
        'prop_1.prop_4',
        'prop_2',
        'prop_2.prop_5',
      ])
      // 向后移动
      builder.moveDown(newProp3)
      expect(builder.fullnames()).toEqual([
        '',
        'prop_1',
        'prop_1.prop_4',
        'prop_3',
        'prop_3.prop_6',
        'prop_2',
        'prop_2.prop_5',
      ])
      builder.moveDown(newProp3)
      expect(builder.fullnames()).toEqual([
        '',
        'prop_1',
        'prop_1.prop_4',
        'prop_2',
        'prop_2.prop_5',
        'prop_3',
        'prop_3.prop_6',
      ])
      // 在后面添加
      let newProp7 = builder.addPropAfter(newProp3)
      if (newProp7) {
        newProp7.name = newName()
        expect(builder.fullnames()).toEqual([
          '',
          'prop_1',
          'prop_1.prop_4',
          'prop_2',
          'prop_2.prop_5',
          'prop_3',
          'prop_3.prop_6',
          'prop_7',
        ])
      }
      let newProp8 = builder.addPropAfter(newProp2)
      if (newProp8) {
        newProp8.name = newName()
        expect(builder.fullnames()).toEqual([
          '',
          'prop_1',
          'prop_1.prop_4',
          'prop_2',
          'prop_2.prop_5',
          'prop_8',
          'prop_3',
          'prop_3.prop_6',
          'prop_7',
        ])
      }
      if (newProp7) {
        let newProp9 = builder.addPropAfter(newProp7)
        if (newProp9) {
          newProp9.name = newName()
          expect(builder.fullnames()).toEqual([
            '',
            'prop_1',
            'prop_1.prop_4',
            'prop_2',
            'prop_2.prop_5',
            'prop_8',
            'prop_3',
            'prop_3.prop_6',
            'prop_7',
            'prop_9',
          ])
        }
      }
    }
  })
})
