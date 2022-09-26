export const SampleSchema = {
  type: 'object',
  groupable: false,
  readonly: false,
  title: '机器人对话脚本',
  required: false,
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
    title: {
      type: 'string',
      title: '标题',
    },
    data: {
      type: 'object',
      title: '机器人对话脚本',
      groupable: false,
      readonly: false,
      required: false,
      properties: {
        dialogId: {
          type: 'string',
          groupable: false,
          readonly: false,
          default: '',
          title: '标识',
          required: true,
        },
        description: {
          type: 'string',
          groupable: false,
          readonly: false,
          default: '',
          title: '描述',
          required: false,
        },
        hears: {
          type: 'array',
          title: '激活关键字',
          required: false,
          items: {
            type: 'string',
          },
        },
        before: {
          type: 'object',
          title: '对话线前置操作集合',
          patternProperties: {
            '^\\w+$': {
              type: 'object',
              title: '对话线前置操作',
              properties: {
                handler: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      default: 'GenericAPIHandler',
                    },
                    url: {
                      type: 'string',
                    },
                    method: {
                      type: 'string',
                    },
                    data: {
                      type: 'json',
                    },
                    varskey: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        script: {
          type: 'object',
          groupable: false,
          readonly: false,
          title: '脚本内容',
          description: '对话脚本定义。对象的每个属性代表1条对话线。',
          required: true,
          patternProperties: {
            '^\\w+$': {
              type: 'array',
              title: '对话线',
              initialName: 'threadName',
              required: false,
              items: {
                type: 'object',
                properties: {
                  channelData: {
                    type: 'object',
                    title: '回复RCS消息',
                    required: false,
                    properties: {
                      messageList: {
                        type: 'array',
                        title: '消息内容',
                        description: '消息内容的数组。',
                        required: false,
                        items: {
                          type: 'object',
                          properties: {
                            contentType: {
                              type: 'string',
                              title: '消息内容类型',
                            },
                            contentText: {
                              type: 'json',
                              title: '消息内容文本',
                            },
                            contentTextTemplate: {
                              type: 'string',
                              title: '消息内容模板',
                            },
                          },
                        },
                      },
                      destinationAddress: {
                        type: 'array',
                        title: '接收人列表',
                        required: false,
                        items: {
                          type: 'string',
                        },
                      },
                      destinationAddressTemplate: {
                        type: 'string',
                        title: '接收人列表模板',
                      },
                      individual: {
                        type: 'boolean',
                        title: '独立发送？',
                        description: '每个接收人单独生成消息，不群发。',
                      },
                    },
                  },
                  text: {
                    type: 'string',
                    title: '回复文本消息',
                    required: false,
                  },
                  action: {
                    type: 'string',
                    title: '执行动作',
                    required: false,
                  },
                  collect: {
                    type: 'object',
                    title: '等待用户选择',
                    required: false,
                    properties: {
                      key: {
                        type: 'string',
                        title: '数据存储名称',
                        description: '收集的数据在上下文中的名称。',
                      },
                      options: {
                        type: 'array',
                        title: '用户选项列表',
                        items: {
                          type: 'object',
                          properties: {
                            pattern: {
                              type: 'string',
                              title: '用户输入内容',
                              description: '支持正则表达式。',
                            },
                            type: {
                              type: 'string',
                              title: '用户输入类型',
                              default: 'string',
                            },
                            action: {
                              type: 'string',
                              title: '匹配的操作',
                              description: '通过指定线程名称实现处理流程跳转。',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    keywords: {
      type: 'array',
      title: '关键字',
      items: {
        type: 'string',
      },
    },
    remark: {
      type: 'string',
      title: '备注',
    },
  },
}
