export const SampleSchema = {
  $id: 'https://example.com/card.schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '属性依赖示例',
  type: 'object',
  required: false,
  groupable: false,
  readonly: false,
  default: '',
  title: '对话逻辑模板',
  properties: {
    dialogId: {
      type: 'string',
      required: true,
      groupable: false,
      readonly: false,
      default: '',
      title: '标识',
    },
    description: {
      type: 'string',
      required: false,
      groupable: false,
      readonly: false,
      default: '',
      title: '描述',
    },
    hears: {
      type: 'array',
      required: false,
      title: '激活关键字',
      items: {
        type: 'string',
      },
    },
    script: {
      type: 'object',
      required: true,
      groupable: false,
      readonly: false,
      default: '',
      title: '脚本内容',
      description: '对话脚本定义。对象的每个属性代表1条对话线。',
      patternProperties: {
        '^\\w+$': {
          type: 'array',
          required: false,
          title: '对话线',
          initialName: 'threadName',
          items: {
            type: 'object',
            properties: {
              channelData: {
                type: 'object',
                required: false,
                title: '回复RCS消息',
                properties: {
                  messageList: {
                    type: 'array',
                    required: false,
                    items: {
                      type: 'object',
                      properties: {
                        contentType: {
                          type: 'string',
                          required: true,
                          title: '消息内容类型',
                        },
                        contentTransferEncoding: {
                          type: 'string',
                          required: false,
                          description:
                            '传输编码。如果为base64，需要特别指定，其他可以不用携带。',
                          title: '传输编码',
                        },
                        contentDisposition: {
                          type: 'string',
                          required: false,
                          description:
                            '对于多消息体（如文本、文件、RichCard等）混合编码，各消息体都需要携带本参数，用于指示终端的展示方式，本参数在单条消息里面唯一，RCS业务中应设置为”inline”，并携带”filename”参数，如：filename=”Message” filename="Picture.gif"filename="Chiplist.lst"',
                          title: '接收端处理方式',
                        },
                        contentText: {
                          type: 'json',
                          required: true,
                          title: '消息内容',
                          description: '定义RCS格式的消息内容。',
                        },
                      },
                    },
                  },
                  destinationAddress: {
                    type: 'array',
                    required: false,
                    title: '指定的接收人列表',
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
              text: {
                type: 'string',
                required: false,
                title: '回复文本消息',
              },
              action: {
                type: 'string',
                required: false,
                title: '执行动作',
              },
              collect: {
                type: 'object',
                required: false,
                title: '等待用户选择',
              },
            },
          },
        },
      },
    },
  },
}

export const SampleData = {
  _id: '62f4c33ce50323761ea1f4d3',
  dialogId: 'rcsbot-001',
  description: '测试录入脚本',
  hears: ['关键字2'],
  script: {
    default: [
      {
        channelData: {
          individual: false,
          destinationAddress: ['sip:alice@osips', 'sip:bob@osips'],
          messageList: [
            {
              contentType: 'text/plain',
              contentText: {
                message: {},
              },
            },
          ],
        },
      },
    ],
  },
}
