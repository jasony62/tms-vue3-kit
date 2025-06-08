export const SampleSchema = {
  type: 'object',
  groupable: false,
  dependencies: {},
  eventDependencies: {},
  readonly: false,
  title: '对话脚本',
  description: '定义RCS机器人对话脚本。',
  required: false,
  properties: {
    name: {
      type: 'string',
      title: '脚本名称',
    },
    title: {
      type: 'string',
      title: '脚本标题',
    },
    data: {
      type: 'object',
      title: '脚本数据',
      properties: {
        dialogId: {
          type: 'string',
          title: '标识（ID）',
          required: true,
        },
        description: {
          type: 'string',
          title: '描述',
          format: 'longtext',
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
        hearsForUser: {
          type: 'array',
          title: '针对用户的激活关键字',
          description:
            '实现同一个机器人中，不同用户对应不同对话。若指定，属性hears失效。示例：[{ "user": "alice", "words": ["onboarding"] }]',
          required: false,
          items: {
            type: 'json',
          },
        },
        args: {
          type: 'object',
          title: '参数',
          required: false,
          properties: {
            handlebarsDelimiters: {
              type: 'array',
              title: '模板分割符',
              description:
                '机器人加载模板时使用的参数，例如：<%和%>，与运行时模板分割符区分。',
              required: false,
              items: {
                type: 'string',
              },
            },
            values: {
              type: 'json',
              title: '模板变量',
              description: '对话脚本执模板中使用的变量。',
              required: false,
            },
          },
        },
        script: {
          type: 'object',
          title: '所有对话线',
          description: '对话脚本定义。对象的每个属性代表1条对话线。',
          required: true,
          patternProperties: {
            '^\\w+$': {
              type: 'object',
              title: '对话线',
              initialName: 'threadName',
              required: false,
              properties: {
                title: {
                  type: 'string',
                  title: '对话线中文名称',
                },
                description: {
                  type: 'string',
                  title: '对话线说明',
                  format: 'longtext',
                },
                before: {
                  type: 'object',
                  title: '前置操作',
                  description:
                    '在进入对话线之前执行，通常用于获得生成消息的数据。',
                  properties: {
                    handlers: {
                      type: 'array',
                      title: '前置操作数组',
                      description: '按顺序执行的前置操作。',
                      items: {
                        type: 'json',
                      },
                    },
                  },
                },
                steps: {
                  type: 'array',
                  title: '对话步骤',
                  items: {
                    type: 'object',
                    properties: {
                      channelData: {
                        type: 'object',
                        title: 'RCS消息',
                        required: false,
                        isOneOf: true,
                        isOneOfExclusiveGroup: '发送内容',
                        properties: {
                          messageList: {
                            type: 'array',
                            title: '消息内容',
                            description:
                              '消息内容的数组，第1个是RCS消息，第2个是悬浮建议列表（可选）。',
                            required: false,
                            items: {
                              type: 'object',
                              properties: {
                                contentType: {
                                  type: 'string',
                                  title: '消息内容类型',
                                  oneOf: [
                                    {
                                      label: '文本',
                                      value: 'text/plain',
                                    },
                                    {
                                      label: '文件',
                                      value:
                                        'application/vnd.gsma.rcs-ft-http+xml',
                                    },
                                    {
                                      label: '卡片',
                                      value:
                                        'application/vnd.gsma.botmessage.v1.0+json',
                                    },
                                    {
                                      label: 'JSON',
                                      value: 'application/json',
                                    },
                                    {
                                      label: '建议列表',
                                      value:
                                        'application/vnd.gsma.botsuggestion.v1.0+json',
                                    },
                                  ],
                                },
                                contentText: {
                                  type: 'json',
                                  title: '消息内容文本',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '内容文本',
                                },
                                contentTextTemplate: {
                                  type: 'string',
                                  title: '消息内容模板',
                                  format: 'handlebars',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '内容文本',
                                },
                                contentTextLiteral: {
                                  type: 'string',
                                  title: '上下文数据（JSON）',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '内容文本',
                                },
                                contentSupplier: {
                                  type: 'object',
                                  title: '消息内容组件',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '内容文本',
                                  properties: {
                                    ref: {
                                      type: 'object',
                                      title: '引用消息内容组件',
                                      lookup: {
                                        transform: [
                                          {
                                            src: '_id',
                                            dst: 'id',
                                          },
                                          {
                                            src: 'title',
                                            dst: 'title',
                                          },
                                          {
                                            src: '_clName',
                                            dst: 'cl',
                                          },
                                        ],
                                      },
                                      isOneOf: true,
                                      isOneOfDefault: true,
                                      isOneOfExclusiveGroup: '消息内容组件',
                                      properties: {
                                        id: {
                                          type: 'string',
                                          title: '组件ID',
                                        },
                                        title: {
                                          type: 'string',
                                          title: '组件标题',
                                        },
                                        cl: {
                                          type: 'string',
                                          title: '所属集合',
                                        },
                                      },
                                    },
                                    url: {
                                      type: 'string',
                                      title: '消息内容组件地址',
                                      format: 'longtext',
                                      isOneOf: true,
                                      isOneOfExclusiveGroup: '消息内容组件',
                                    },
                                    urlTemplate: {
                                      type: 'string',
                                      title: '消息内容组件地址模板',
                                      format: 'handlebars',
                                      isOneOf: true,
                                      isOneOfExclusiveGroup: '消息内容组件',
                                    },
                                  },
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
                            isOneOf: true,
                            isOneOfExclusiveGroup: '接收人',
                          },
                          destinationAddressSource: {
                            type: 'object',
                            title: '接收人列表数据源',
                            isOneOf: true,
                            isOneOfExclusiveGroup: '接收人',
                            properties: {
                              clName: {
                                type: 'string',
                                title: '集合名称',
                              },
                              propertyName: {
                                type: 'string',
                                title: '属性名称',
                              },
                            },
                          },
                          destinationAddressTemplate: {
                            type: 'string',
                            title: '接收人列表模板',
                            description:
                              'JSON数组，数组中的项目为接收人，例如：["sip:18900001111@osips","sip:18900002222@osips"]。',
                            format: 'mustache',
                            isOneOf: true,
                            isOneOfExclusiveGroup: '接收人',
                          },
                          destinationAddressSupplier: {
                            type: 'object',
                            title: '接收人列表组件',
                            isOneOf: true,
                            isOneOfExclusiveGroup: '接收人',
                            properties: {
                              ref: {
                                type: 'object',
                                title: '引用接收人列表组件',
                                lookup: {
                                  source: {
                                    cl: 'rcs_destination_address',
                                  },
                                  transform: [
                                    {
                                      src: '_id',
                                      dst: 'id',
                                    },
                                    {
                                      src: 'title',
                                      dst: 'title',
                                    },
                                  ],
                                },
                                isOneOf: true,
                                isOneOfExclusiveGroup: '接收人列表组件',
                                properties: {
                                  id: {
                                    type: 'string',
                                    title: '组件ID',
                                  },
                                  title: {
                                    type: 'string',
                                    title: '组件标题',
                                  },
                                },
                              },
                              url: {
                                type: 'string',
                                title: '接收人列表组件地址',
                                format: 'longtext',
                                isOneOf: true,
                                isOneOfExclusiveGroup: '接收人列表组件',
                              },
                              urlTemplate: {
                                type: 'string',
                                title: '接收人列表组件地址模板',
                                format: 'handlebars',
                                isOneOf: true,
                                isOneOfExclusiveGroup: '接收人列表组件',
                              },
                            },
                          },
                          individual: {
                            type: 'boolean',
                            title: '每个接收人独立发送？',
                            description: '每个接收人单独生成消息，不群发。',
                            existIf: {
                              oneOf: [
                                {
                                  properties: {
                                    destinationAddress: {
                                      valid: true,
                                    },
                                  },
                                },
                                {
                                  properties: {
                                    destinationAddressTemplate: {
                                      valid: true,
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      },
                      channelDataSupplier: {
                        type: 'object',
                        title: 'RCS消息组件',
                        isOneOf: true,
                        isOneOfExclusiveGroup: '发送内容',
                        properties: {
                          ref: {
                            type: 'object',
                            title: 'RCS消息组件',
                            lookup: {
                              source: {
                                cl: 'rcs_channel_data',
                              },
                              transform: [
                                {
                                  src: '_id',
                                  dst: 'id',
                                },
                                {
                                  src: 'title',
                                  dst: 'title',
                                },
                              ],
                            },
                            properties: {
                              id: {
                                type: 'string',
                                title: '组件ID',
                              },
                              title: {
                                type: 'string',
                                title: '组件标题',
                              },
                            },
                          },
                        },
                      },
                      text: {
                        type: 'string',
                        title: '文本消息',
                        required: false,
                        isOneOf: true,
                        isOneOfExclusiveGroup: '发送内容',
                      },
                      collect: {
                        type: 'object',
                        title: '收集回复',
                        required: false,
                        isOneOf: true,
                        isOneOfExclusiveGroup: '收集回复',
                        properties: {
                          key: {
                            type: 'string',
                            title: '数据存储路径',
                            description: '收集的数据在上下文中的存储位置。',
                          },
                          onChange: {
                            type: 'array',
                            title: '回复加工选项',
                            items: {
                              type: 'object',
                              properties: {
                                pattern: {
                                  type: 'string',
                                  title: '匹配回复内容',
                                  description: '支持正则表达式。',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '回复匹配方式',
                                },
                                type: {
                                  type: 'string',
                                  title: '回复内容类型',
                                  default: 'string',
                                  description:
                                    '字符串（string）或正则表（regex）达式。',
                                },
                                default: {
                                  type: 'boolean',
                                  title: '默认条件',
                                  description: '当其它条件不满足时采用。',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '回复匹配方式',
                                },
                                action: {
                                  type: 'string',
                                  title: '匹配时执行',
                                  description:
                                    '支持repeat和stop操作，支持指定要跳转的对话线名称。',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '处理方式',
                                },
                                template: {
                                  type: 'string',
                                  title: '修改回复值',
                                  description: '通过模板修改回复值。',
                                  format: 'handlebars',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '处理方式',
                                },
                              },
                            },
                          },
                          options: {
                            type: 'array',
                            title: '回复处理选项',
                            items: {
                              type: 'object',
                              properties: {
                                pattern: {
                                  type: 'string',
                                  title: '匹配回复内容',
                                  description: '支持正则表达式。',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '回复匹配方式',
                                },
                                type: {
                                  type: 'string',
                                  title: '回复内容类型',
                                  default: 'string',
                                },
                                action: {
                                  type: 'string',
                                  title: '进入对话线',
                                  description:
                                    '通过指定线程名称实现处理流程跳转。',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '响应方式',
                                },
                                default: {
                                  type: 'boolean',
                                  title: '默认条件',
                                  description: '当其它条件不满足时采用。',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '回复匹配方式',
                                },
                                execute: {
                                  type: 'object',
                                  title: '进入对话',
                                  description:
                                    '当action为beginDialog或execute_script时使用的参数。',
                                  isOneOf: true,
                                  isOneOfExclusiveGroup: '响应方式',
                                  properties: {
                                    script: {
                                      type: 'string',
                                      title: '对话脚本ID',
                                    },
                                    thread: {
                                      type: 'string',
                                      title: '对话线名称',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      collectSupplier: {
                        type: 'object',
                        title: '收集回复组件',
                        isOneOf: true,
                        isOneOfExclusiveGroup: '收集回复',
                        properties: {
                          ref: {
                            type: 'object',
                            title: '等待输入组件',
                            lookup: {
                              source: {
                                cl: 'dialog_collect',
                              },
                              transform: [
                                {
                                  src: '_id',
                                  dst: 'id',
                                },
                                {
                                  src: 'title',
                                  dst: 'title',
                                },
                              ],
                            },
                            properties: {
                              id: {
                                type: 'string',
                                title: '组件ID',
                              },
                              title: {
                                type: 'string',
                                title: '组件标题',
                              },
                            },
                          },
                        },
                      },
                      action: {
                        type: 'string',
                        title: '执行动作',
                        required: false,
                      },
                      execute: {
                        type: 'object',
                        title: '进入对话',
                        description:
                          '当action为beginDialog或execute_script时使用的参数。',
                        required: false,
                        properties: {
                          script: {
                            type: 'string',
                            title: '对话脚本ID',
                          },
                          thread: {
                            type: 'string',
                            title: '对话线名称',
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
        supplement: {
          type: 'array',
          title: '消息补充内容',
          description: '给对话中的消息添加悬浮建议操作。',
          items: {
            type: 'object',
            properties: {
              channelData: {
                type: 'json',
                title: 'RCS消息-建议列表',
                required: false,
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
      format: 'longtext',
    },
  },
}

export const SampleData = {
  name: 'kehugangweijiema',
  title: '客户岗位解码',
  data: {
    dialogId: 'kehugangweijiema',
    hears: ['kehugangweijiema', '客户岗位解码', 'resume'],
    args: {
      handlebarsDelimiters: ['<%', '%>'],
    },
    script: {
      default: {
        title: '说明',
        before: {
          handlers: [
            {
              gotoHeardThreadHandler: {
                threadWhenHeard: {
                  resumeChat: '^resume$',
                },
              },
            },
          ],
        },
        steps: [
          {
            action: 'gotoChat',
          },
        ],
      },
      gotoChat: {
        before: {
          handlers: [
            {
              cozeAgentBeforeHandler: {
                agent: {
                  name: '🧡活动策划①-策划案助手',
                  bot_id: '7494212635618410547',
                },
                oneOff: false,
                conversation: {
                  commands: ['/quit'],
                },
              },
            },
          ],
        },
        steps: [
          {
            channelData: {
              messageList: [
                {
                  contentType: 'text/plain',
                  contentText:
                    '#STATUS_HINT#你好❤️我来协助你策划活动并且编写活动策划案 \n\n ❣️工作流： ① 活动主题策划②流程设计③环节设计④互动设计⑤策划案整合\n\n 🌰参考提供信息：计划为【银行】的【关心养老生活的客户】举办一场【沙龙】活动；活动目标为【增加客户粘性、后续面访机会】；活动结束后【与客户保持联系】；活动时长【2小时】；地点【会议室】；参与人数【10-15人】；活动形式期待【多互动体验】；选题范围【生活贴近的主题】；预算【越低越好，准备简单的礼品】',
                },
              ],
            },
            collect: {
              key: 'generation',
              options: [
                {
                  pattern: '/quit',
                  type: 'string',
                  action: 'quit',
                },
                {
                  action: 'waitGeneration',
                  default: true,
                },
              ],
            },
          },
        ],
      },
      resumeChat: {
        before: {
          handlers: [
            {
              cozeAgentBeforeHandler: {
                agent: {
                  name: '7494212635618410547',
                  bot_id: '🧡活动策划①-策划案助手',
                },
                oneOff: false,
                conversation: {
                  commands: ['/quit'],
                },
              },
            },
          ],
        },
        steps: [
          {
            action: 'waitGeneration',
          },
        ],
      },
      waitGeneration: {
        steps: [
          {
            collect: {
              key: 'generation',
              options: [
                {
                  pattern: '/quit',
                  type: 'string',
                  action: 'quit',
                },
                {
                  action: 'waitGeneration',
                  default: true,
                },
              ],
            },
          },
        ],
      },
      quit: {
        title: '退出',
        before: {
          handlers: [
            {
              cozeAgentBeforeHandler: {
                enabled: false,
              },
            },
          ],
        },
        steps: [
          {
            text: '#STATUS_HINT#再见！',
          },
        ],
      },
    },
    supplement: [
      {
        channelData: {
          messageList: [
            {
              contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
              contentText: {
                suggestions: [
                  {
                    reply: {
                      displayText: '快捷输入：继续',
                      postback: {
                        data: '继续',
                      },
                      asUserInput: true,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  remark: '7494212635618410547 🧡活动策划①-策划案助手',
}
