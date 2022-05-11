<template>
  <div class="json-schema-ui">
    <h3>编辑JSONSchema</h3>
    <div><button @click="getResult">查看结果</button></div>
    <div>
      <tms-json-schema ref="schemaEditor" :schema="CardSchema" :on-upload="onUploadFile" :root-name="'$'">
        <template #extattrs="{ attrs }">
          <div>
            <div>不允许编辑</div>
            <input type="checkbox" v-model="attrs.readonly" />
          </div>
        </template>
      </tms-json-schema>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'tms-vue3-ui/dist/es/json-schema/style/tailwind.scss'
import { ref } from 'vue';
import { CardSchema } from '../data/schema-examples'

const schemaEditor = ref<{ editing: () => string } | null>(null)

const onUploadFile = (file: { name: any; }) => {
  let result = { name: file.name, url: location.href }
  return Promise.resolve(result)
}

const getResult = () => {
  let value = JSON.stringify(schemaEditor.value?.editing(), null, 2)
  alert(value)
}
</script>
