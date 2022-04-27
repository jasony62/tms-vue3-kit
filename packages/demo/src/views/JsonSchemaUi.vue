<template>
  <div class="json-schema-ui">
    <h3>编辑JSONSchema</h3>
    <div id="myJsonSchema">
      <tms-json-schema ref="myJsonSchema" :schema="jsonSchema" :extendSchema="extendSchema" :on-upload="onUploadFile">
        <template v-slot:extKeywords="props">
          <div label="不可修改">
            <input v-model="props.schema.readonly" />
          </div>
        </template>
      </tms-json-schema>
    </div>
  </div>
</template>

<script>
import { JsonSchemaFactory } from 'tms-vue3-ui'
import 'tms-vue3-ui/dist/es/json-schema/style/tailwind.scss'

const JsonSchema = JsonSchemaFactory()

export default {
  name: 'JsonSchemaUi',
  components: { TmsJsonSchema: JsonSchema },
  data() {
    return {
      jsonSchema: {
        $id: 'https://example.com/card.schema.json',
        $schema: 'http://json-schema.org/draft-07/schema#',
        description: 'A representation of a person, company, organization, or place',
        type: 'object',
        required: ['familyName', 'givenName'],
        properties: {
          file: {
            readonly: true,
            type: 'array',
            title: '上传图片和文件',
            items: {
              type: 'object',
              format: 'file',
              formatAttrs: {
                accept: 'image/png,image/jpeg',
                size: '20MB',
                limit: 2
              },
              properties: {
                name: { title: '名字', type: 'string' },
                url: { title: '地址', type: 'string' }
              }
            }
          },
          fn: {
            description: 'Formatted Name',
            type: 'string',
            enum: []
          },
          familyName: {
            type: 'string'
          },
          givenName: {
            type: 'string'
          },
          prop1: {
            type: 'array',
            items: { type: 'string' },
            enum: [
              { label: '选项x', value: 'x' },
              { label: '选项y', value: 'y' },
              { label: '选项z', value: 'z' }
            ]
          },
          additionalName: {
            type: 'array',
            items: { type: 'string' },
            default: ['a', 'b'],
            enum: [
              { label: '选项1', value: 'a' },
              { label: '选项2', value: 'b' }
            ],
            enumGroups: [
              { id: "g1", label: "第1组", assocEnum: { property: 'prop1', value: 'y' } }
            ]
          },
          honorificPrefix: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          honorificSuffix: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          nickname: {
            type: 'string'
          },
          url: {
            type: 'string'
          },
          email: {
            type: 'object',
            properties: {
              type: {
                type: 'string'
              },
              value: {
                type: 'string'
              }
            }
          },
          tel: {
            type: 'object',
            properties: {
              type: {
                type: 'string'
              },
              value: {
                type: 'string'
              }
            }
          },
          tz: {
            type: 'string'
          },
          photo: {
            type: 'string'
          },
          logo: {
            type: 'string'
          },
          sound: {
            type: 'string'
          },
          bday: {
            type: 'string'
          },
          title: {
            type: 'string'
          },
          role: {
            type: 'string'
          },
          org: {
            type: 'object',
            properties: {
              organizationName: {
                type: 'string'
              },
              organizationUnit: {
                type: 'string'
              }
            }
          }
        },
        dependencies: {
          "file": {
            "dependencyRules": {
              "1": { "rules": [{ "property": "resource", "value": "a" }, { "property": "methods", "value": "b" }], "operator": "and" },
              "2": { "rules": [{ "property": "areaCode", "value": "010" }], "operator": "and" }
            },
            "operator": "or"
          }
        }
      },
      extendSchema: (vm, schema) => {
        vm.$set(schema, 'readonly', schema.readonly || false)
      }
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
