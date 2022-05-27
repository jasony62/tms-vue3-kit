<template>
  <div>
    <select v-model="caseName">
      <option value="overall">整体示例</option>
      <option value="array-simple">数组的项目简单类型</option>
      <option value="array-object">数组的项目是对象</option>
      <option value="object-map-object">对象有可选属性，属性类型是对象</option>
      <option value="object-map-array">对象有可选属性，属性类型是数组</option>
      <option value="autofill">自动填充</option>
    </select>
  </div>
  <div class="flex flex-row">
    <div class="w-1/3 p-4">
      <json-doc v-if="loading === false" ref="jsonDocEditor" :key="caseName" :schema="testObj.schema"
        :value="testObj.data" :on-autofill="onAutofill" :on-file-download="onFileDownload"
        :on-file-upload="onFileUpload">
      </json-doc>
    </div>
    <div class="p-4">
      <div>
        <button @click="getResult">查看结果</button>
      </div>
      <div>
        <pre>{{ jsonResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { JsonDoc } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/json-doc/style/tailwind.scss'
import { onMounted, reactive, ref, watch } from 'vue'

const jsonDocEditor = ref<{ editing: () => string } | null>(null)

const jsonResult = ref('')

const caseName = ref('overall')

const loading = ref(true)

const testObj = reactive({ schema: {}, data: {} })

function loadTestData() {
  loading.value = true
  return import(`../data/schemas/${caseName.value}`).then(
    ({ SampleData, SampleSchema }) => {
      testObj.schema = SampleSchema
      testObj.data = SampleData
      loading.value = false
    }
  )
}

onMounted(async () => {
  await loadTestData()
})

watch(caseName, () => {
  loadTestData()
})

const onAutofill = () => {
  return {
    post: (url: string, data: any) => {
      return new Promise((resolve, reject) => {
        let { filter } = data
        console.log('axios.data.filter', filter)
        let result: any = { data: { result: {} } }
        if ('http://tms-vue3-kit/areaCode/city' === url) {
          if (filter?.areaCode?.keyword === '010')
            result.data.result.city = '北京'
          else if (filter?.areaCode?.keyword === '029')
            result.data.result.city = '西安'
          else result.data.result.city = ''
        }
        console.log('axios.result', result)
        resolve(result)
      })
    },
  }
}
/**
 * 从外部选择文件的方法
 * @param params
 */
const onFileSelect = (params: any) => {
  console.log('params', params)
  return new Promise((resolve) => {
    /**这里需要返回文件属性中items.properties中定义的内容*/
    resolve({
      name: 'onFileSelect返回文件名称',
      url: 'onFileSelect返回的文件地址',
    })
  })
}
/**
 * 表单中文件上传方法
 * @param params
 */
const onFileUpload = (params: any) => {
  console.log('params', params)
  return new Promise((resolve) => {
    /**这里需要返回文件属性中items.properties中定义的内容*/
    resolve({
      name: 'onFileUpload返回文件名称',
      url: 'onFileUpload返回的文件地址',
    })
  })
}

const onFileDownload = (name: string, url: string) => {
  alert(`下载文件：name=${name},url=${url}`)
}

const getResult = () => {
  jsonResult.value = JSON.stringify(jsonDocEditor.value?.editing(), null, 2)
}
</script>
