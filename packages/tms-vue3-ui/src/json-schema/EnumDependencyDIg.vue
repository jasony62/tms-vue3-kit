<template>
  <tvu-dialog title="设置选项依赖关系" :close-on-click-modal="false" :visible="visible" :before-close="onCancel" width="50%">
    <tvu-tabs v-model="activeL0Pane" type="card">
      <tvu-tab-pane label="分组" name="group">
        <div style="margin-bottom: 20px;">
          <tvu-button type="success" size="small" @click="addTab">
            新增分组
          </tvu-button>
        </div>
        <tvu-form labtvu-position="left" labtvu-width="80px">
          <tvu-form-item label="属性" size="mini" labtvu-width="50px">
            <tvu-input v-model="property" :disabled="true" style="width: 20%"></tvu-input>
          </tvu-form-item>
        </tvu-form>
        <tvu-tabs v-model="activeName" type="border-card" closable @tab-click="shiftTab" @tab-remove="removeTab">
          <tvu-tab-pane v-for="(item, index) in enumGroups" :key="index" :label="item.label" :name="index + ''">
            <tvu-form labtvu-position="left" labtvu-width="80px">
              <tms-flex>
                <tvu-form-item label="分组名称">
                  <tvu-input v-model="item.label"></tvu-input>
                </tvu-form-item>
                <tvu-form-item label="显示条件">
                  <tvu-select v-model="item.assocEnum.property" filterable placeholder="请选择" @change="onSelectProperty">
                    <tvu-option v-for="item in enumShowKeys" :key="item.key" :label="item.label" :value="item.key">
                    </tvu-option>
                  </tvu-select>
                  <tvu-select v-model="item.assocEnum.value" placeholder="请选择"
                    v-if="item.assocEnum.property ? true : false">
                    <tvu-option v-for="item in enumShowValues" :key="item.value" :label="item.label"
                      :value="item.value">
                    </tvu-option>
                  </tvu-select>

                </tvu-form-item>
              </tms-flex>
            </tvu-form>
          </tvu-tab-pane>
        </tvu-tabs>

      </tvu-tab-pane>
      <tvu-tab-pane label="选项" name="enum">
        <tvu-form labtvu-position="left" labtvu-width="80px">
          <tvu-form-item v-for="(item, index) in enums" :key="index" :label="item.label">
            <tvu-select v-model="item.group" placeholder="请选择分组" clearable @clear="onClearGroup(index)">
              <tvu-option v-for="g in enumGroups" :key="g.id" :label="g.label" :value="g.id"></tvu-option>
            </tvu-select>
          </tvu-form-item>
        </tvu-form>
      </tvu-tab-pane>
    </tvu-tabs>
    <span slot="footer" class="dialog-footer">
      <tvu-button type="primary" @click="onClose">确 定</tvu-button>
    </span>
  </tvu-dialog>
</template>

<script>
// import Vue from 'vue'

/* 组件定义 */
const DlgComponent = {
  data() {
    return {
      visible: true,
      activeL0Pane: 'group',
      activeName: '',
      enumGroups: [],
      enums: [],
      property: '',
      enumShowKeys: [],
      enumShowValues: [],
    }
  },
  methods: {
    addTab() {
      let id = `g${new Date().getTime()}`
      this.enumGroups.push({
        id,
        label: "新分组",
        assocEnum: { property: "", value: "" }
      })
      this.activeName = this.enumGroups.length - 1 + ''
      this.enumShowValue = ''
    },

    shiftTab(vm) {
      let enumShowValues = this.enumShowKeys.filter(item => {
        if (item.key) {
          return item.key === this.enumGroups[vm.index].assocEnum.property
        }
      })
      this.enumShowValues = enumShowValues[0] ? enumShowValues[0].schema.enum : []
    },
    removeTab(targetName) {
      let id = this.enumGroups[targetName].id
      let targetIndex = this.enums.findIndex(item => {
        return item.group === id
      })
      if (targetIndex >= 0) {
        this.enums[targetIndex].group = ''
      }
      this.enumGroups.splice(targetName, 1)
      this.activeName = this.enumGroups.length - 1 + ''
    },
    onSelectProperty(key) {
      if (key) {
        let enumShowValues = this.enumShowKeys.filter(item => {
          if (item.key) {
            return item.key === key
          }
        })
        this.enumShowValues = enumShowValues[0].schema.enum
        this.enumGroups[this.activeName].assocEnum.value = ''
      }
    },
    onClearGroup(index) {
      this.enums[index].group = ''
    },
    onCancel() {
      this.$emit('cancel')
    },
    onClose() {
      this.$emit('close')
    },
    initEnumShow(allProperties) {
      let enumShowKeys = allProperties.filter(item => {
        return item.key !== this.property &&
          typeof item.schema.enum === 'object' &&
          item.schema.type === 'string'
      })
      enumShowKeys.unshift({ key: '', label: '无' })
      this.enumShowKeys = enumShowKeys
      let enumShowValues = this.enumShowKeys.filter(item => {
        if (item.key && this.enumGroups[0]) {
          return item.key === this.enumGroups[0].assocEnum.property
        }
      })
      this.enumShowValues = enumShowValues[0] ? enumShowValues[0].schema.enum : []
    },
    showAsEnumDialog(schema, property, allProperties) {
      const clone_schema = JSON.parse(JSON.stringify(schema))
      this.enumGroups = clone_schema.enumGroups
      this.enums = clone_schema.enum
      this.property = property
      this.initEnumShow(allProperties)
      this.$mount()
      document.body.appendChild(this.$el)
      return new Promise((resolve) => {
        this.$once('close', () => {
          this.visible = false
          document.body.removeChild(this.$el)
          resolve({
            enumGroups: this.enumGroups,
            enum: this.enums
          })
        })
        this.$once('cancel', () => {
          this.visible = false
          document.body.removeChild(this.$el)
          resolve(false)
        })
      })
    },
  },
}
/* 作为独组件打开 */
export function showAsEnumDialog(schema, key, allProperties) {
  let dialog = new Vue(DlgComponent)
  return dialog.showAsEnumDialog(schema, key, allProperties)
}

export default DlgComponent
</script>