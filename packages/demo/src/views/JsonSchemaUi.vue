<template>
  <div class="json-schema-ui">
    <h3>编辑JSONSchema</h3>
    <div id="myJsonSchema">
      <tms-json-schema ref="myJsonSchema" :schema="CardSchema" :on-upload="onUploadFile">
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

<script lang="ts">
import { JsonSchemaFactory } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/json-schema/style/tailwind.scss'
import { CardSchema } from '../data/schema-examples'

const JsonSchema = JsonSchemaFactory()

export default {
  name: 'JsonSchemaUi',
  components: { TmsJsonSchema: JsonSchema },
  data() {
    return {
      CardSchema
    }
  },
  methods: {
    onUploadFile(file) {
      let result = { name: file.name, url: location.href }
      return Promise.resolve(result)
    }
  }
}
</script>
