export const SampleSchema = {
  type: 'object',
  groupable: false,
  dependencies: {},
  eventDependencies: {},
  readonly: false,
  title: '机器人对话脚本',
  description: '定义机器人对话脚本。',
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
      title: '对话脚本',
      properties: {
        dialogId: {
          type: 'string',
          title: '标识（ID）',
          required: true,
        },
        description: {
          type: 'string',
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
        script: {
          type: 'object',
          title: '对话线',
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
                },
                before: {
                  type: 'object',
                  title: '前置操作',
                  description: '在进入对话线之前执行。',
                  properties: {
                    handlers: {
                      type: 'array',
                      title: '前置操作数组',
                      description: '按顺序执行的前置操作。',
                      items: {
                        type: 'object',
                        properties: {
                          genericRestApiHandler: {
                            type: 'object',
                            title: '调用RESTAPI',
                            description:
                              '调用RESTAPI，将获得的结果保存在上下文中。',
                            isOneOf: true,
                            properties: {
                              handlerId: {
                                type: 'string',
                                title: '前置操作id',
                                description: '同一个对话中不允许重复。',
                              },
                              url: {
                                type: 'string',
                                title: '调用地址模板',
                                description: '支持通过模板设置参数',
                                format: 'handlebars',
                              },
                              method: {
                                type: 'string',
                                title: 'HTTP方法',
                                default: '',
                              },
                              data: {
                                type: 'string',
                                format: 'handlebars',
                                title: 'POST方法数据模板',
                                description: 'body中的JSON格式数据模板。',
                              },
                              varskey: {
                                type: 'string',
                                title: '结果变量名称',
                                description: '上下文中保存返回结果的变量名称。',
                              },
                              batch: {
                                type: 'object',
                                title: '批次执行参数',
                                properties: {
                                  page: {
                                    type: 'object',
                                    title: '批次分页参数',
                                    properties: {
                                      queryName: {
                                        type: 'string',
                                        title: '批次页号作为查询参数的名称',
                                      },
                                      dataKey: {
                                        type: 'string',
                                        title: '获得的批次数据在上线文中的名称',
                                      },
                                      size: {
                                        type: 'object',
                                        title: '每个批次获得的数据条数',
                                        properties: {
                                          value: {
                                            type: 'number',
                                            title: '最大条数',
                                          },
                                        },
                                      },
                                    },
                                  },
                                  total: {
                                    type: 'object',
                                    title: '数据总数',
                                    properties: {
                                      key: {
                                        type: 'string',
                                        title: '数据总条数在上下文中的名称',
                                      },
                                    },
                                  },
                                },
                              },
                              webhookChannel: {
                                type: 'object',
                                title: 'webhook发送通道',
                                description: '将生成的消息发送给指定的api。',
                                properties: {
                                  urls: {
                                    type: 'array',
                                    title: '消息接收地址',
                                    items: {
                                      type: 'string',
                                    },
                                  },
                                  bypass: {
                                    type: 'boolean',
                                    title: '作为旁路通道',
                                    description:
                                      '作为旁路通道是，消息主通道继续发送。',
                                  },
                                },
                              },
                            },
                          },
                          genericRestApiHandlerSupplier: {
                            type: 'object',
                            title: '调用RESTAPI服务',
                            isOneOf: true,
                            properties: {
                              ref: {
                                type: 'object',
                                title: '预定义RESTAPI',
                                lookup: {
                                  source: {
                                    cl: 'skill_rest_api',
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
                                    title: '数据ID',
                                  },
                                  title: {
                                    type: 'string',
                                    title: '数据标题',
                                  },
                                },
                              },
                            },
                          },
                          tpwDialogHandler: {
                            type: 'object',
                            title: '执行TPW服务指令',
                            isOneOf: true,
                            properties: {
                              command: {
                                type: 'string',
                                title: '指令',
                              },
                              demand: {
                                type: 'json',
                                title: '指令参数',
                              },
                            },
                          },
                          tpwDialogHandlerSupplier: {
                            type: 'object',
                            title: '调用TPWDIALOG服务',
                            isOneOf: true,
                            properties: {
                              ref: {
                                type: 'object',
                                title: '预定义TPWDIALOG',
                                lookup: {
                                  source: {
                                    cl: 'skill_tpw_dialog',
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
                                    title: '数据ID',
                                  },
                                  title: {
                                    type: 'string',
                                    title: '数据标题',
                                  },
                                },
                              },
                            },
                          },
                          gotoHeardThreadHandler: {
                            type: 'object',
                            title: '根据接收关键字进入对话线',
                            isOneOf: true,
                            properties: {
                              threadWhenHeard: {
                                type: 'object',
                                title: '关键字与对话线对应关系',
                                patternProperties: {
                                  '^\\w+$': {
                                    type: 'string',
                                    initialName: 'threadName',
                                    title: '对话线进入条件',
                                    description: '接收关键字的正则表达式。',
                                  },
                                },
                              },
                            },
                          },
                          genericDatetimeHandler: {
                            type: 'object',
                            title: '对话过程中生成需要的日期数据',
                            isOneOf: true,
                            properties: {
                              varskey: {
                                type: 'string',
                                title: '结果变量名称',
                                description: '上下文中保存返回结果的变量名称。',
                              },
                              perset: {
                                type: 'object',
                                title: '预制数据生成模式',
                                properties: {
                                  name: {
                                    type: 'string',
                                    title: '模式名称',
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
                steps: {
                  type: 'array',
                  title: '对话步骤',
                  items: {
                    type: 'object',
                    properties: {
                      channelData: {
                        type: 'object',
                        title: '回复RCS消息',
                        required: false,
                        isOneOf: true,
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
                                  isOneOf: true,
                                },
                                contentTextTemplate: {
                                  type: 'string',
                                  title: '消息内容模板',
                                  format: 'handlebars',
                                  isOneOf: true,
                                },
                                contentSupplier: {
                                  type: 'object',
                                  title: '消息内容服务',
                                  isOneOf: true,
                                  properties: {
                                    id: {
                                      type: 'string',
                                      title: '数据ID',
                                      isOneOf: true,
                                    },
                                    url: {
                                      type: 'string',
                                      format: 'longtext',
                                      isOneOf: true,
                                    },
                                    urlTemplate: {
                                      type: 'string',
                                      format: 'handlebars',
                                      isOneOf: true,
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
                          },
                          destinationAddressTemplate: {
                            type: 'string',
                            title: '接收人列表模板',
                            format: 'mustache',
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
                        isOneOf: true,
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
                                  isOneOf: true,
                                },
                                type: {
                                  type: 'string',
                                  title: '用户输入类型',
                                  default: 'string',
                                },
                                action: {
                                  type: 'string',
                                  title: '匹配的操作',
                                  description:
                                    '通过指定线程名称实现处理流程跳转。',
                                },
                                default: {
                                  type: 'boolean',
                                  title: '默认条件',
                                  description: '当其它条件不满足时采用。',
                                  isOneOf: true,
                                },
                                execute: {
                                  type: 'object',
                                  title: '对话脚本参数',
                                  description:
                                    '当action为beginDialog或execute_script时使用的参数。',
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
                      action: {
                        type: 'string',
                        title: '执行动作',
                        required: false,
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
  name: 'test',
  title: '测试数据',
  data: {
    dialogId: 'baidu_search',
    description: '将百度搜索的结果转换为5G消息卡片。',
    hears: ['百度搜索', 'bdss'],
    script: {
      default: {
        before: {
          handlers: [
            {
              tpwDialogHandler: {
                command: 'launch',
              },
            },
          ],
        },
        steps: [
          {
            action: 'waitLaunch',
          },
        ],
      },
      waitLaunch: {
        steps: [
          {
            text: '请稍候，正在启动百度搜索机器人...',
            collect: {
              key: 'launchResult',
              options: [
                {
                  pattern: 'created',
                  type: 'string',
                  action: 'collectKeyword',
                },
                { default: true, action: 'repeat' },
              ],
            },
            action: 'next',
          },
        ],
      },
      collectKeyword: {
        steps: [
          {
            text: '请输入搜索关键字',
            collect: {
              key: 'keyword',
            },
            action: 'next',
          },
          {
            action: 'waitFirstSearch',
          },
        ],
      },
      waitFirstSearch: {
        before: {
          handlers: [
            {
              tpwDialogHandler: {
                command: 'interact',
                demand: {
                  sequence: [
                    {
                      goto: {
                        url: 'https://www.baidu.com/s?wd={{vars.keyword}}',
                        options: { waitUntil: 'load' },
                      },
                    },
                    { waitFor: { timeout: 6000 } },
                    {
                      extract: {
                        '#content_left .c-container h3>a,#content_left .c-container section>a':
                          {
                            title: 'textContent',
                            url: './/@href',
                          },
                      },
                    },
                    {
                      screenshot: [
                        {
                          selector: '#content_left .c-container:nth-child(1)',
                        },
                        {
                          selector: '#content_left .c-container:nth-child(5)',
                        },
                        {
                          selector: '#content_left .c-container:nth-child(9)',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
        steps: [
          {
            text: '请等待百度搜索结果...',
            collect: {
              key: 'searchResult',
              options: [
                {
                  pattern: 'ok',
                  type: 'string',
                  action: 'renderSearchResult',
                },
                { default: true, action: 'repeat' },
              ],
            },
            action: 'next',
          },
        ],
      },
      waitNextSearch: {
        before: {
          handlers: [
            {
              tpwDialogHandler: {
                command: 'interact',
                demand: {
                  sequence: [
                    {
                      action: {
                        '#page > div > a.n:last-of-type': {
                          click: {},
                        },
                      },
                    },
                    {
                      waitFor: { timeout: 6000 },
                    },
                    {
                      extract: {
                        '#content_left .c-container h3>a,#content_left .c-container section>a':
                          {
                            title: 'textContent',
                            url: './/@href',
                          },
                      },
                    },
                    {
                      screenshot: [
                        {
                          selector: '#content_left .c-container:nth-child(1)',
                        },
                        {
                          selector: '#content_left .c-container:nth-child(5)',
                        },
                        {
                          selector: '#content_left .c-container:nth-child(9)',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
        steps: [
          {
            text: '请等待百度搜索结果...',
            collect: {
              key: 'searchResult',
              options: [
                {
                  pattern: 'ok',
                  type: 'string',
                  action: 'renderSearchResult',
                },
                { default: true, action: 'repeat' },
              ],
            },
            action: 'next',
          },
        ],
      },
      waitCurrentSearch: {
        before: {
          handlers: [
            {
              tpwDialogHandler: {
                command: 'interact',
                demand: {
                  sequence: [
                    {
                      extract: {
                        '#content_left .c-container h3>a,#content_left .c-container section>a':
                          {
                            title: 'textContent',
                            url: './/@href',
                          },
                      },
                    },
                    {
                      screenshot: [
                        {
                          selector: '#content_left .c-container:nth-child(1)',
                        },
                        {
                          selector: '#content_left .c-container:nth-child(5)',
                        },
                        {
                          selector: '#content_left .c-container:nth-child(9)',
                        },
                      ],
                    },
                    {
                      content: {},
                    },
                  ],
                },
              },
            },
          ],
        },
        steps: [
          {
            text: '请等待刷新百度搜索结果...',
            collect: {
              key: 'searchResult',
              options: [
                {
                  pattern: 'ok',
                  type: 'string',
                  action: 'renderSearchResult',
                },
                { default: true, action: 'repeat' },
              ],
            },
            action: 'next',
          },
        ],
      },
      renderSearchResult: {
        steps: [
          {
            channelData: {
              messageList: [
                {
                  contentType: 'application/vnd.gsma.botmessage.v1.0+json',
                  contentText: {
                    message: {
                      generalPurposeCardCarousel: {
                        layout: {
                          cardWidth: 'MEDIUM_WIDTH',
                        },
                        content: [
                          {
                            media: {
                              mediaUrlTemplate:
                                '{{{vars.TPW_DIALOG_RESULT.screenshot.[0].url}}}',
                              mediaContentType: 'image/png',
                              mediaFileSize: 2,
                              thumbnailUrlTemplate:
                                '{{{vars.TPW_DIALOG_RESULT.screenshot.[0].url}}}',
                              thumbnailContentType: 'image/png',
                              thumbnailFileSize: 1,
                              height: 'MEDIUM_HEIGHT',
                              contentDescription: '',
                            },
                            suggestionsTemplate:
                              '{"action":{"urlAction":{"openUrl":{"url":"{{{vars.TPW_DIALOG_RESULT.extract.[0].[0].url}}}"}},"displayText":"{{vars.TPW_DIALOG_RESULT.extract.[0].[0].title}}","postback":{"data":""}}}',
                          },
                        ],
                        buildOptions: {
                          thumbnailUrlKey: 'vars.TPW_DIALOG_RESULT.screenshot',
                          suggestionsKey: 'vars.TPW_DIALOG_RESULT.extract.[0]',
                          suggestionsLength: '4',
                        },
                      },
                    },
                  },
                },
                {
                  contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
                  contentText: {
                    suggestions: [
                      {
                        reply: {
                          displayText: '结束',
                          postback: {
                            data: 'close',
                          },
                        },
                      },
                      {
                        reply: {
                          displayText: '刷新',
                          postback: {
                            data: 'refresh',
                          },
                        },
                      },
                      {
                        reply: {
                          displayText: '搜索其它',
                          postback: {
                            data: 'other',
                          },
                        },
                      },
                      {
                        reply: {
                          displayText: '下一页',
                          postback: {
                            data: 'next',
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            collect: {
              key: 'nextAction',
              options: [
                {
                  pattern: 'next',
                  type: 'string',
                  action: 'waitNextSearch',
                },
                {
                  pattern: 'refresh',
                  type: 'string',
                  action: 'waitCurrentSearch',
                },
                {
                  pattern: 'other',
                  type: 'string',
                  action: 'collectKeyword',
                },
                {
                  pattern: 'close',
                  type: 'string',
                  action: 'waitClose',
                },
                { default: true, action: 'close' },
              ],
            },
            action: 'next',
          },
          {
            action: 'close',
          },
        ],
      },
      close: {
        steps: [
          {
            text: '请输入【close】关闭应用，其它任意内容返回导航',
            collect: {
              key: 'expectClose',
              options: [
                { pattern: 'close', type: 'string', action: 'waitClose' },
                { default: true, action: 'collectKeyword' },
              ],
            },
            action: 'next',
          },
        ],
      },
      waitClose: {
        before: {
          handlers: [
            {
              tpwDialogHandler: {
                command: 'close',
              },
            },
          ],
        },
        steps: [
          {
            text: '正在关闭百度搜索机器人...',
            collect: {
              key: 'closeResult',
              options: [
                { pattern: 'closed', type: 'string', action: 'finish' },
                { default: true, action: 'repeat' },
              ],
            },
            action: 'next',
          },
        ],
      },
      finish: {
        steps: [{ text: '结束！若需要再次操作，请输入【bdss】激活' }],
      },
    },
  },
}
