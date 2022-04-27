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

<script lang="ts">
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
          province: {
            "type": "string",
            "required": false,
            "groupable": false,
            "dependencies": {},
            "eventDependencies": {},
            "readonly": false,
            "default": "",
            "title": "省",
            "enum": [
              { "label": "天津", "value": "天津" },
              { "label": "河北", "value": "河北" },
              { "label": "山西", "value": "山西" },
              { "label": "黑龙江", "value": "黑龙江" },
              { "label": "福建", "value": "福建" },
              { "label": "山东", "value": "山东" },
              { "label": "河南", "value": "河南" },
              { "label": "湖南", "value": "湖南" },
              { "label": "广东", "value": "广东" },
              { "label": "广西", "value": "广西" },
              { "label": "吉林", "value": "吉林" },
              { "label": "海南", "value": "海南" },
              { "label": "四川", "value": "四川" },
              { "label": "贵州", "value": "贵州" },
              { "label": "内蒙古", "value": "内蒙古" },
              { "label": "浙江", "value": "浙江" },
              { "label": "安徽", "value": "安徽" },
              { "label": "湖北", "value": "湖北" },
              { "label": "宁夏", "value": "宁夏" },
              { "label": "新疆", "value": "新疆" },
              { "label": "江西", "value": "江西" },
              { "label": "云南", "value": "云南" },
              { "label": "西藏", "value": "西藏" },
              { "label": "甘肃", "value": "甘肃" },
              { "label": "辽宁", "value": "辽宁" },
              { "label": "江苏", "value": "江苏" },
              { "label": "陕西", "value": "陕西" },
              { "label": "上海", "value": "上海" },
              { "label": "青海", "value": "青海" },
              { "label": "北京", "value": "北京" },
              { "label": "重庆", "value": "重庆" }
            ],
            "enumGroups": []
          },
          city: {
            "type": "string",
            "required": false,
            "groupable": false,
            "dependencies": {},
            "eventDependencies": {},
            "readonly": false,
            "default": "",
            "title": "市",
            "enum": [],
            "enumGroups": []
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
        },
        eventDependencies: {
          "city": {
            "rule": {
              "params": ["province"],
              "url": "/serviceRelation/api/mongo/document/list?db=serviceData&cl=areaCode",
              "type": "v2"
            }
          }
        }
      },
      extendSchema: (vm, schema) => {
        schema.readonly = schema.readonly || false
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
