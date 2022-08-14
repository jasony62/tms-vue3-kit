<template>
  <div class="json-schema-ui">
    <h3>编辑JSONSchema</h3>
    <div class="flex">
      <div class="w-1/2">
        <div>
          <select v-model="caseName">
            <option value="overall">整体示例</option>
            <option value="array-simple">数组的项目简单类型</option>
            <option value="array-object">数组的项目是对象</option>
            <option value="object-map-object">对象有可选属性，属性类型是对象</option>
            <option value="object-map-array">对象有可选属性，属性类型是数组</option>
            <option value="files">文件（数组）示例</option>
            <option value="file">文件（单个）示例</option>
            <option value="autofill">自动填充</option>
            <option value="prop-dep">属性依赖</option>
            <option value="enum-dep">选项依赖</option>
            <option value="rcsbot">rcsbot</option>
          </select>
        </div>
        <div>
          <tms-json-schema v-if="loading === false" ref="schemaEditor" :schema="testObj.schema"
            :on-upload="onUploadFile" :on-message="onMessage">
            <template #extattrs="{ attrs }">
              <div>
                <label><input type="checkbox" v-model="attrs.readonly" />不允许编辑</label>
              </div>
              <div>
                <label><input type="checkbox" v-model="attrs.groupable" />可否分组</label>
              </div>
            </template>
          </tms-json-schema>
        </div>
      </div>
      <div class="w-1/2">
        <div>
          <button @click="getResult">查看结果</button>
        </div>
        <div>
          <pre>{{ schemaResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'tms-vue3-ui/dist/es/json-schema/style/tailwind.scss'
import { onMounted, reactive, ref, watch } from 'vue'

const caseName = ref('')

const schemaEditor = ref<{ editing: () => string } | null>(null)

const loading = ref(true)

const testObj = reactive({ schema: {} })

const schemaResult = ref('')

function loadTestData() {
  loading.value = true
  return import(`../data/schemas/${caseName.value}`).then(
    ({ SampleSchema }) => {
      testObj.schema = SampleSchema
      loading.value = false
    }
  )
}

onMounted(async () => {
  let stored = sessionStorage.getItem('tms-vue3-ui/json-schema/caseName')
  caseName.value = stored ?? 'overall'
  await loadTestData()
})

watch(caseName, () => {
  sessionStorage.setItem('tms-vue3-ui/json-schema/caseName', caseName.value)
  loadTestData()
})

const onUploadFile = (file: { name: any }) => {
  let result = { name: file.name, url: location.href }
  return Promise.resolve(result)
}

const onMessage = (msg: string) => {
  alert(`报错了:${msg}`,)
}

const getResult = () => {
  schemaResult.value = JSON.stringify(schemaEditor.value?.editing(), null, 2)
}
</script>
