export const SampleSchema = {
  type: 'object',
  required: false,
  title: '单卡片消息',
  properties: {
    message: {
      type: 'object',
      required: false,
      title: 'RCS单卡片消息',
      properties: {
        generalPurposeCard: {
          type: 'object',
          required: false,
          title: 'RCS单卡片消息',
          properties: {
            layout: {
              type: 'object',
              required: false,
              title: '布局方式',
              properties: {
                cardOrientation: {
                  type: 'string',
                  required: false,
                  title: '卡片方向',
                  default: 'HORIZONTAL',
                },
                imageAlignment: {
                  type: 'string',
                  required: false,
                  title: '图片对齐方式',
                  default: 'LEFT',
                },
                style: {
                  type: 'string',
                  required: false,
                  title: '样式文件',
                },
              },
            },
            content: {
              type: 'object',
              required: false,
              title: '卡片内容',
              properties: {
                media: {
                  type: 'object',
                  required: false,
                  title: '卡片头图',
                  properties: {
                    mediaUrl: {
                      type: 'string',
                      required: false,
                      title: '卡片头图地址',
                    },
                    mediaContentType: {
                      type: 'string',
                      required: false,
                      title: '卡片头图内容类型',
                    },
                    mediaFileSize: {
                      type: 'string',
                      required: false,
                      title: '卡片头图文件大小（字节）',
                    },
                    thumbnailUrl: {
                      type: 'string',
                      required: false,
                      title: '缩略图地址',
                    },
                    thumbnailContentType: {
                      type: 'string',
                      required: false,
                      title: '缩略图内容类型',
                    },
                    thumbnailFileSize: {
                      type: 'string',
                      required: false,
                      title: '缩略图文件大小（字节）',
                    },
                    height: {
                      type: 'string',
                      required: false,
                      title: '头图在卡片中的高度',
                      default: 'MEDIUM_HEIGHT',
                    },
                    contentDescription: {
                      type: 'string',
                      required: false,
                      title: '头图内容描述',
                    },
                  },
                },
                titile: {
                  type: 'string',
                  required: false,
                  title: '卡片标题',
                },
                description: {
                  type: 'string',
                  required: false,
                  title: '卡片描述',
                },
                suggestions: {
                  type: 'json',
                  required: false,
                  title: '卡片内置建议列表',
                  description:
                    '卡片内置建议列表是数组，包含1-4个建议回复或建议操作。',
                },
              },
            },
          },
        },
      },
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
