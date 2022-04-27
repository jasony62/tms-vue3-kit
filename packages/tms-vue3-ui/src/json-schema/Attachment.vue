<template>
  <tvu-form-item label="上传模板">
    <tvu-upload action="#" multiple :file-list="fieldAttrs.attachment" :http-request="onUploadFile"
      :on-remove="onRemoveFile">
      <tvu-button>上传文件</tvu-button>
    </tvu-upload>
  </tvu-form-item>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { SchemaFieldAttrs } from './utils';
import { BuildinComponents } from "./buildinComp"
export default {
  components: BuildinComponents
}
</script>
<script setup lang="ts">

const props = defineProps({
  fieldAttrs: { type: Object as PropType<SchemaFieldAttrs>, required: true },
  onUpload: { type: Function, required: true }
})
const { fieldAttrs } = props

const onRemoveFile = (file) => {
  let files = fieldAttrs.attachment
  files.splice(
    files.indexOf(files.find((ele) => ele.name === file.name)),
    1
  )
}

const onUploadFile = ({ file }) => {
  if (!fieldAttrs.attachment) {
    fieldAttrs.attachment = []
  }
  props.onUpload(file).then((result) => {
    fieldAttrs.attachment.push(result)
  })
}
</script>