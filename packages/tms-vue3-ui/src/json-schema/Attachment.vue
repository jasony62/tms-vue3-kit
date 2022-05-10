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

const onUploadFile = (file: File) => {
  const {accept, size, limit} = schemaProp.items?.formatAttrs
  const suffix = file.name.split('.')[1];
  if (!accept.split(',').includes(suffix)){
    alert(`仅支持${accept}格式文件`)
    return
  }
  if (limit && schemaProp.attachment.length >= limit) {
    alert(`限制上传${limit}文件`)
    return
  }
  if (size && file.size / 1024 / 1024 > size) {
    alert(`上传文件大小过大，超过${size}M`);
    return
  }
  /*let data = await getFileBase64(file)*/
  if (!schemaProp.attachment) {
    schemaProp.attachment = []
  }
  props.onUpload(file).then((result: any) => {
    schemaProp.attachment.push(result)
  })
}
</script>