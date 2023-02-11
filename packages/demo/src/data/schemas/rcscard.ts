export const SampleSchema = {
  type: 'object',
  groupable: false,
  dependencies: {},
  eventDependencies: {},
  readonly: false,
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
      title: '单卡片消息定义',
      required: false,
      properties: {
        contentType: {
          type: 'string',
          title: '内容类型',
          description: '按照《RCC.07V11.0》中的定义。',
          default: 'application/vnd.gsma.botmessage.v1.0+json',
          readonly: true,
          required: true,
        },
        contentText: {
          type: 'object',
          title: '内容文本',
          required: true,
          properties: {
            message: {
              type: 'object',
              title: '消息',
              required: true,
              properties: {
                generalPurposeCard: {
                  type: 'object',
                  title: '单卡片',
                  required: true,
                  properties: {
                    layout: {
                      type: 'object',
                      title: '卡片布局',
                      required: false,
                      properties: {
                        cardOrientation: {
                          type: 'string',
                          title: '卡片方向',
                          default: 'HORIZONTAL',
                          required: false,
                        },
                        imageAlignment: {
                          type: 'string',
                          default: 'LEFT',
                          title: '图片对齐方式',
                          required: false,
                        },
                      },
                    },
                    content: {
                      type: 'object',
                      title: '卡片内容',
                      required: false,
                      isOneOf: true,
                      properties: {
                        media: {
                          type: 'object',
                          initialName: 'media',
                          title: '卡片媒体文件',
                          format: 'file',
                          required: false,
                          isOneOf: true,
                          isOneOfDefault: true,
                          isOneOfExclusiveGroup: '媒体文件',
                          properties: {
                            mediaUrl: {
                              type: 'string',
                              title: '媒体文件地址',
                              required: false,
                              isOneOf: true,
                            },
                            mediaUrlTemplate: {
                              type: 'string',
                              title: '媒体文件地址模板',
                              isOneOf: true,
                            },
                            mediaContentType: {
                              type: 'string',
                              title: '媒体文件内容类型',
                              required: false,
                            },
                            mediaFileSize: {
                              type: 'number',
                              title: '媒体文件大小（字节）',
                              required: false,
                            },
                            thumbnailUrl: {
                              type: 'string',
                              title: '缩略图地址',
                              required: false,
                              isOneOf: true,
                            },
                            thumbnailUrlTemplate: {
                              type: 'string',
                              title: '缩略图地址模板',
                              isOneOf: true,
                            },
                            thumbnailContentType: {
                              type: 'string',
                              title: '缩略图内容类型',
                              required: false,
                            },
                            thumbnailFileSize: {
                              type: 'number',
                              title: '缩略图文件大小（字节）',
                              required: false,
                            },
                            height: {
                              type: 'string',
                              title: '图片的高度',
                              required: false,
                            },
                            contentDescription: {
                              type: 'string',
                              title: '媒体文件内容说明',
                              required: false,
                            },
                          },
                        },
                        mediaSupplier: {
                          type: 'object',
                          initialName: 'mediaSupplier',
                          title: '卡片媒体文件服务',
                          isOneOf: true,
                          isOneOfExclusiveGroup: '媒体文件',
                          properties: {
                            url: {
                              type: 'string',
                              title: '获取数据地址',
                              isOneOf: true,
                            },
                            id: {
                              type: 'string',
                              title: '数据ID',
                              isOneOf: true,
                            },
                          },
                        },
                        title: {
                          type: 'string',
                          title: '卡片标题',
                          isOneOf: true,
                          isOneOfExclusiveGroup: '卡片标题',
                          isOneOfDefault: true,
                        },
                        titleTemplate: {
                          type: 'string',
                          title: '卡片标题模板',
                          isOneOf: true,
                          isOneOfExclusiveGroup: '卡片标题',
                        },
                        titleSupplier: {
                          type: 'object',
                          title: '卡片标题服务',
                          isOneOf: true,
                          isOneOfExclusiveGroup: '卡片标题',
                          properties: {
                            url: {
                              type: 'string',
                              title: '获取数据地址',
                              isOneOf: true,
                            },
                            id: {
                              type: 'string',
                              title: '数据ID',
                              isOneOf: true,
                            },
                          },
                        },
                        description: {
                          type: 'string',
                          initialName: 'description',
                          title: '卡片说明',
                          isOneOf: true,
                          isOneOfDefault: true,
                          isOneOfExclusiveGroup: '卡片说明',
                        },
                        descriptionTemplate: {
                          type: 'string',
                          initialName: 'descriptionTemplate',
                          title: '卡片说明模板',
                          isOneOf: true,
                          isOneOfExclusiveGroup: '卡片说明',
                        },
                        descriptionSupplier: {
                          type: 'object',
                          initialName: 'descriptionSupplier',
                          title: '卡片说明服务',
                          isOneOf: true,
                          isOneOfExclusiveGroup: '卡片说明',
                          properties: {
                            url: {
                              type: 'string',
                              title: '获取数据地址',
                              isOneOf: true,
                            },
                            id: {
                              type: 'string',
                              title: '数据ID',
                              isOneOf: true,
                            },
                          },
                        },
                        suggestions: {
                          type: 'json',
                          initialName: 'suggestions',
                          title: '卡片建议列表',
                          isOneOf: true,
                          isOneOfDefault: true,
                          isOneOfExclusiveGroup: '卡片建议列表',
                        },
                        suggestionsSupplier: {
                          type: 'object',
                          initialName: 'suggestionsSupplier',
                          title: '卡片建议列表服务',
                          isOneOf: true,
                          isOneOfExclusiveGroup: '卡片建议列表',
                          properties: {
                            url: {
                              type: 'string',
                              title: '获取数据地址',
                              isOneOf: true,
                            },
                            id: {
                              type: 'string',
                              title: '数据ID',
                              isOneOf: true,
                            },
                          },
                        },
                      },
                    },
                    contentSupplier: {
                      type: 'object',
                      title: '卡片内容服务',
                      isOneOf: true,
                      properties: {
                        url: {
                          type: 'string',
                          title: '获取数据地址',
                          isOneOf: true,
                        },
                        id: {
                          type: 'string',
                          title: '数据ID',
                          isOneOf: true,
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

export const SampleData = {
  message: {
    generalPurposeCard: {
      layout: {
        style: 'default.css',
        cardOrientation: 'HORIZONTAL',
        imageAlignment: 'LEFT',
      },
      content: {
        media: {
          mediaUrl: '5gm_red.png',
          mediaContentType: 'image/png',
          mediaFileSize: '2718288',
          thumbnailContentType: '/thumb/5gm_red.png',
          thumbnailFileSize: '314159',
          contentDescription: '媒体文件内容描述',
          height: 'MEDIUM_HEIGHT',
        },
        titile: '卡片消息提供选项',
        description: '您好，请选择您想了解的名词。',
        suggestions: [
          {
            reply: {
              displayText: 'Yes',
              postback: { data: 'set_by_chatbot_reply_yes' },
            },
          },
          {
            reply: {
              displayText: 'No',
              postback: { data: 'set_by_chatbot_reply_no' },
            },
          },
          {
            action: {
              diaplayText: 'Open website or deep link',
              postback: { data: 'set_by_chatbot_open_url' },
              urlAction: { openUrl: { url: 'https://domain.com' } },
            },
          },
        ],
      },
    },
  },
}
