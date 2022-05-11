<template>
  <div class="tvu-jse__field__file-attrs">
    <tvu-form-item class="tvu-jse__field" label="文件类型">
      <tvu-input v-model="fileAccept" placeholder="标准格式，如'png,jpeg'"></tvu-input>
    </tvu-form-item>
    <tvu-form-item class="tvu-jse__field" label="文件最大">
      <tvu-input v-model.number="fileSize" placeholder="请输入数字，默认以MB为单位"></tvu-input>
    </tvu-form-item>
    <tvu-form-item class="tvu-jse__field" label="文件个数">
      <tvu-input v-model.number="fileLimit" placeholder="请输入数字，0无意义"></tvu-input>
    </tvu-form-item>
  </div>
</template>
<script>
export default {
  name: 'tvu-file-attr',
  props: ['accept', 'size', 'limit'],
  defaultFormatAttrs() {
    return { accept: '', size: null, limit: null }
  },
  data() {
    let { accept: fileAccept, size: fileSize, limit: fileLimit } = this
    return {
      fileAccept,
      fileSize,
      fileLimit
    }
  },
  watch: {
    fileAccept: function (newValue) {
      this.$emit('update:accept', newValue)
    },
    fileSize: function (newValue) {
      this.$emit('update:size', newValue)
    },
    fileLimit: function (newValue) {
      this.$emit('update:limit', parseInt(newValue))
    }
  }
}
</script>
