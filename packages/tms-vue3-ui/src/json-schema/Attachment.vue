<template>
  <tvu-form-item label="上传模板">
    <tvu-upload action="#" multiple :file-list="schemaProp.attachment" :upload-file="onUploadFile"
      :remove-file="onRemoveFile">
      <tvu-button>上传文件</tvu-button>
    </tvu-upload>
  </tvu-form-item>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { SchemaProp } from '../data-aid.js/json-schema/model';

const props = defineProps({
  schemaProp: { type: Object as PropType<SchemaProp>, required: true },
  onUpload: { type: Function }
})
const { schemaProp, onUpload } = props

const onRemoveFile = (file: { name: any; }) => {
  let files = schemaProp.attachment
  files.splice(
    files.indexOf(files.find((ele: { name: any; }) => ele.name === file.name)),
    1
  )
}

const onUploadFile = (file: File) => {
  const { accept, size, limit } = schemaProp.items?.formatAttrs
  const suffix = file.name.split('.').pop()
  if (!accept.split(',').includes(suffix)) {
    alert(`不支持文件${file.name}的格式，仅支持${accept}`)
    return
  }
  if (limit && schemaProp.attachment.length >= limit) {
    alert(`只允许上传${limit}个文件`)
    return
  }
  if (size && file.size / 1024 / 1024 > size) {
    alert(`上传文件大小过大，超过${size}M`);
    return
  }
  if (!schemaProp.attachment) {
    schemaProp.attachment = []
  }
  onUpload?.(file).then((result: any) => {
    schemaProp.attachment.push(result)
  })
}
</script>