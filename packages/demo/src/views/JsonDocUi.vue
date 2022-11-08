<template>
  <div>
    <select v-model="caseName">
      <option value="overall">整体示例</option>
      <option value="array-simple">数组的项目简单类型</option>
      <option value="array-object">数组的项目是对象</option>
      <option value="array-object-pattern">数组的项目是模板属性对象</option>
      <option value="root-array">根字段类型是数组</option>
      <option value="object-map-object">对象有可选属性，属性类型是对象</option>
      <option value="object-map-array">对象有可选属性，属性类型是数组</option>
      <option value="direct-json">JSON属性</option>
      <option value="autofill">自动填充</option>
      <option value="prop-dep">属性依赖</option>
      <option value="files">文件（数组）</option>
      <option value="file">文件（单个）</option>
      <option value="defval">默认值</option>
      <option value="rcsbot">rcsbot</option>
      <option value="rcscard">rcscard</option>
      <option value="rcscarousel">rcscarousel</option>
      <option value="rcssugg">rcssugg</option>
      <option value="rcsreply">rcsreply</option>
      <option value="dialog-script">dialog-script</option>
      <option value="isoneof">isoneof</option>
      <option value="paste">粘贴</option>
    </select>
    <label><input type="checkbox" v-model="showFieldFullname" />是否显示字段路径名称</label>
  </div>
  <div class="flex flex-row">
    <div class="w-1/3 p-4">
      <json-doc v-if="loading === false" ref="jsonDocEditor" :key="caseName" :schema="testObj.schema"
        :value="testObj.data" :enable-paste="true" :autofill-request="onAutofill" :on-file-download="onFileDownload"
        :on-file-upload="onFileUpload" :hide-root-title="true" :hide-root-description="true"
        :hide-field-description="true" :show-field-fullname="showFieldFullname" @jdoc-focus="onJdocFocus"
        @jdoc-blur="onJdocBlur" :on-paste="onPaste">
      </json-doc>
    </div>
    <div class="w-1/3">
      <div v-if="activeField?.schemaType === 'json'" class="h-full flex flex-col">
        <div>
          <button @click="updateJson">更新数据【{{ activeField.fullname }}】</button>
        </div>
        <div ref="elJsonEditor" class="flex-grow"></div>
      </div>
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
import { Field, DocAsArray } from 'tms-vue3-ui/dist/es/json-doc'
import 'tms-vue3-ui/dist/es/json-doc/style/tailwind.scss'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import RandExp from 'randexp'
import _ from 'lodash'

const jsonDocEditor = ref<{ editing: () => string, editDoc: DocAsArray } | null>(null)

const caseName = ref('') // 演示数据

const jsonResult = ref('') // 表单数据结果

const loading = ref(true)

const testObj = reactive({ schema: {}, data: {}, pasted: null })

const activeField = ref<Field>() // 正在编辑的字段

const elJsonEditor = ref<HTMLElement | null>(null)

const showFieldFullname = ref(false)

function loadTestData() {
  loading.value = true
  return import(`../data/schemas/${caseName.value}.ts`).then(
    ({ SampleData, SampleSchema, SamplePasted }) => {
      testObj.schema = SampleSchema
      testObj.data = SampleData
      testObj.pasted = SamplePasted
      loading.value = false
    }
  )
}

const options = reactive({
  mode: 'code',
  search: false,
})

let jsonEditor: any = null

onMounted(async () => {
  let stored = sessionStorage.getItem('tms-vue3-ui/json-doc/caseName')
  caseName.value = stored ?? 'overall'
  await loadTestData()
})

watch(caseName, () => {
  sessionStorage.setItem('tms-vue3-ui/json-doc/caseName', caseName.value)
  loadTestData()
})

const onJdocFocus = (field: Field) => {
  console.log(`字段【${field.fullname}】获得输入焦点`)
  if (activeField.value !== field) {
    activeField.value = field
    if (field.schemaType === 'json') {
      nextTick(() => {
        if (elJsonEditor.value) {
          let child = elJsonEditor.value.querySelector('.jsoneditor')
          if (child) elJsonEditor.value.removeChild(child)
          // @ts-ignore
          jsonEditor = new JSONEditor(elJsonEditor.value, options)
          let fieldValue = jsonDocEditor.value?.editDoc.get(field.fullname)
          jsonEditor.set(fieldValue ?? '')
        }
      })
    }
  }
}

const onJdocBlur = (field: Field) => { }

const updateJson = () => {
  if (activeField.value) {
    let newVal = jsonEditor.get()
    jsonDocEditor.value?.editDoc.set(activeField.value.fullname, newVal)
  }
}

const onAutofill = () => {
  return {
    get: (url: string) => {
      return new Promise((resolve, reject) => {
        let result: any = { data: { result: {} } }
        if ('http://tms-vue3-kit/autofill/areaCode' === url) {
          result.data.result = [{ code: '010' }, { code: '029' }]
        } else if (url.indexOf('http://tms-vue3-kit/autofill/city') === 0) {
          if (url.indexOf('areaCode=010') !== -1)
            result.data.result.city = '北京'
          else if (url.indexOf('areaCode=029') !== -1)
            result.data.result.city = '西安'
          else result.data.result.city = ''
        }
        resolve(result)
      })
    },
    post: (url: string, data: any) => {
      return new Promise((resolve, reject) => {
        let { filter } = data
        let result: any = { data: { result: {} } }
        if ('http://tms-vue3-kit/autofill/district' === url) {
          if (filter?.areaCode?.keyword === '010')
            result.data.result.district = [{ name: '西城区' }, { name: '东城区' }, { name: '朝阳区' }, { name: '海淀区' }]
          else if (filter?.areaCode?.keyword === '029')
            result.data.result.district = [{ name: '新城区' }, { name: '碑林区' }, { name: '莲湖区' }, { name: '雁塔区' }]
          else result.data.result.district = []
        }
        console.log('axios.result', result)
        resolve(result)
      })
    },
  }
}
/**
 * 从外部文件服务选择文件的方法
 */
const onFileSelect = (field: Field) => {
  if (field.type === 'object') {
    const fileData: any = {}
    if (field.children?.length) {
      let randexp = new RandExp(/\w*/)
      field.children.forEach((cf: Field) => {
        let val: any
        switch (cf.type) {
          case 'number':
            val = Math.floor(Math.random() * 1000)
            break
          default:
            val = randexp.gen()
        }
        fileData[cf.name] = val
      })
    }
    return Promise.resolve(fileData)
  }
}
/**
 * 表单中文件上传方法
 * 需要调用放上传文件，并返回文件信息
 */
const onFileUpload = (field: Field, data: FormData) => {
  if (field.type === 'object') {
    const fileData: any = {}
    if (field.children?.length) {
      let randexp = new RandExp(/\w*/)
      field.children.forEach((cf: Field) => {
        let val: any
        switch (cf.type) {
          case 'number':
            val = Math.floor(Math.random() * 1000)
            break
          default:
            val = randexp.gen()
        }
        fileData[cf.name] = val
      })
    }
    return Promise.resolve(fileData)
  }
}

const onFileDownload = (name: string, url: string) => {
  alert(`下载文件：name=${name},url=${url}`)
}

const getResult = () => {
  jsonResult.value = JSON.stringify(jsonDocEditor.value?.editing(), null, 2)
}

const onPaste = async (field: Field) => {
  let { fullname } = field
  return new Promise((resolve, reject) => {
    let pasted
    if (testObj.pasted) {
      pasted = fullname ? _.get(testObj.pasted, fullname) : testObj.pasted
    }
    if (pasted) {
      resolve(pasted)
    } else {
      reject({ message: '没有提供粘贴数据' })
    }
  })
}
</script>

<style lang="scss">
.jsoneditor {

  .jsoneditor-transform,
  .jsoneditor-poweredBy {
    display: none;
  }
}
</style>