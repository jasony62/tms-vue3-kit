<template>
  <tvu-form-item label="上传模板">
    <tvu-upload action="#" multiple :file-list="schemaProp.attachment" :http-request="onUploadFile"
      :on-remove="onRemoveFile">
      <tvu-button>上传文件</tvu-button>
    </tvu-upload>
  </tvu-form-item>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { SchemaProp } from './model';

const props = defineProps({
  schemaProp: { type: Object as PropType<SchemaProp>, required: true },
  onUpload: { type: Function, required: true }
})
const { schemaProp } = props

const onRemoveFile = (file: { name: any; }) => {
  let files = schemaProp.attachment
  files.splice(
    files.indexOf(files.find((ele: { name: any; }) => ele.name === file.name)),
    1
  )
}

const onUploadFile = ({ file }) => {
  if (!schemaProp.attachment) {
    schemaProp.attachment = []
  }
  props.onUpload(file).then((result: any) => {
    schemaProp.attachment.push(result)
  })
}
</script>