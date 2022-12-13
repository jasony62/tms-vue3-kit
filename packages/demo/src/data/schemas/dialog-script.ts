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
          title: '对话线前置操作',
          patternProperties: {
            '^\\w+$': {
              type: 'object',
              title: '对话线前置操作',
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
                            format: 'mustache',
                          },
                          method: {
                            type: 'string',
                            title: 'HTTP方法',
                            default: '',
                          },
                          data: {
                            type: 'string',
                            format: 'mustache',
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
                      tpwDialogHandler: {
                        type: 'object',
                        title: '执行TPW服务指令',
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
          title: '对话线',
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
                              format: 'mustache',
                            },
                            contentSupplier: {
                              type: 'object',
                              title: '消息内容服务',
                              properties: {
                                url: {
                                  type: 'string',
                                  isOneOf: true,
                                },
                                urlTemplate: {
                                  type: 'string',
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
                              description: '通过指定线程名称实现处理流程跳转。',
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
    dialogId: 'biyi-gongshi',
    description: '比翼工时填报机器人。',
    hears: ['gongshi', '工时'],
    before: {
      waitLaunch: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'launch',
            },
          },
        ],
      },
      waitGotoLogin: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                goto: {
                  url: 'https://cas.ctbiyi.com/cas/login',
                  waitForSelector: '#login-form-controls',
                },
                screenshot: { selector: '#login-captcha' },
              },
            },
          },
        ],
      },
      waitRenewCaptcha: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                action: {
                  '#login-captcha': {
                    click: { clickCount: 1 },
                  },
                  '#captcha-customField': {
                    fill: '',
                  },
                },
                waitFor: { timeout: 1000 },
                screenshot: { selector: '#login-captcha' },
              },
            },
          },
        ],
      },
      waitShowNewCaptcha: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                screenshot: { selector: '#login-captcha' },
              },
            },
          },
        ],
      },
      waitFillAndSubmit: {
        handlers: [
          {
            genericRestApiHandler: {
              url: 'http://host.docker.internal:3030/api/unseal/document/findOne?db=biyi&cl=users_5gmc&fields=biyiUsername,biyiPassword',
              method: 'post',
              data: {
                filter: { username: '{{vars.RCSMSG_FROM.parameters.magic}}' },
              },
              varskey: 'vars.biyiAccount',
            },
          },
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                action: {
                  '#username': {
                    fill: '{{vars.biyiAccount.result.biyiUsername}}',
                  },
                  '#password': {
                    fill: '{{vars.biyiAccount.result.biyiPassword}}',
                  },
                  '#captcha-customField': { fill: '{{vars.expectCaptcha}}' },
                  '#login-btn': {
                    click: { clickCount: 1 },
                  },
                },
                waitFor: { timeout: 2000 },
                find: [
                  { '#login-btn > span': { alias: 'denglushibai' } },
                  { '#aupSubmit': { alias: 'anquanchengnuo' } },
                  {
                    '#content > div > h2 > span': { alias: 'dengluchenggong' },
                  },
                ],
                screenshot: {},
              },
            },
          },
        ],
      },
      waitClickAgree: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                action: {
                  '#aupSubmit': {
                    click: { clickCount: 1, waitForTimeout: 10000 },
                  },
                },
              },
            },
          },
        ],
      },
      waitGotoWorkbench: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                goto: {
                  url: 'https://workbench.ctbiyi.com/home',
                  options: { waitUntil: 'networkidle0' },
                },
              },
            },
          },
        ],
      },
      waitGotoZentaoCalendar: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                goto: {
                  url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=my&f=index',
                  options: { waitUntil: 'networkidle0' },
                },
              },
            },
          },
        ],
      },
      waitGotoCalendar: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                goto: {
                  url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=effort&f=calendar',
                  options: { waitUntil: 'networkidle0' },
                },
              },
            },
          },
        ],
      },
      waitGotoZentaoEffort: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                goto: {
                  url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=my&f=index',
                  options: { waitUntil: 'networkidle0' },
                },
              },
            },
          },
        ],
      },
      waitGotoEffort: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                goto: {
                  url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=my&f=effort&date=all',
                  options: { waitUntil: 'networkidle0' },
                },
              },
            },
          },
        ],
      },
      waitGotoZentaoAddEffort: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                goto: {
                  url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=my&f=index',
                  options: { waitUntil: 'networkidle0' },
                },
              },
            },
          },
        ],
      },
      waitGotoAddEffort: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'interact',
              demand: {
                goto: {
                  url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=effort&f=batchCreate',
                  options: { waitUntil: 'networkidle0' },
                },
              },
            },
          },
        ],
      },
      waitAddEffort: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'http',
              demand: {
                method: 'get',
                url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=project&f=ajaxSelectProjectsByProjectType&page1=1&recPerPage=10&sortBy=&order=asc&projectType=all',
              },
            },
          },
        ],
      },
      waitSubmitEffort: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'http',
              demand: {
                method: 'post',
                url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=effort&f=batchCreate',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: {
                  id: [1],
                  objectType: ['custom'],
                  date: '{{vars.expectDate}}',
                  work: ['{{vars.expectWork}}'],
                  projectType: ['{{vars.expectProductId}}'],
                  consumed: ['{{vars.expectConsumed}}'],
                },
              },
            },
          },
        ],
      },
      collectEffortDate: {
        handlers: [
          {
            genericDatetimeHandler: {
              varskey: 'weekWorkdays',
              perset: { name: 'WeekWorkdays', end: -1 },
              textFormat: 'dddd',
              valueFormat: 'YYYY-MM-DD',
            },
          },
        ],
      },
      waitClose: {
        handlers: [
          {
            tpwDialogHandler: {
              command: 'close',
            },
          },
        ],
      },
    },
    script: {
      default: [
        {
          text: '{{vars.RCSMSG_FROM.parameters.magic}} 你好，欢迎使用RPA机器人',
          action: 'waitLaunch',
        },
      ],
      waitLaunch: [
        {
          text: '请等待【启动应用】操作执行结果',
          collect: {
            key: 'beginResult',
            options: [
              { pattern: 'created', type: 'string', action: 'next' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
        { text: '已经启动RPA', action: 'waitGotoLogin' },
      ],
      waitGotoLogin: [
        {
          text: '请等待【打开登录页】操作执行结果',
          collect: {
            key: 'gotoResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'showCaptcha' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
      ],
      showCaptcha: [
        {
          channelData: {
            messageList: [
              {
                contentType: 'application/vnd.gsma.botmessage.v1.0+json',
                contentText: {
                  message: {
                    generalPurposeCard: {
                      layout: {
                        cardOrientation: 'HORIZONTAL',
                        imageAlignment: 'LEFT',
                        titleFontStyle: ['underline', 'bold'],
                        descriptionFontStyle: ['calibri'],
                        style: 'http://example.com/default.css',
                      },
                      content: {
                        media: {
                          mediaUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          mediaContentType: 'image/png',
                          mediaFileSize: 2,
                          thumbnailUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          thumbnailContentType: 'image/png',
                          thumbnailFileSize: 1,
                          height: 'MEDIUM_HEIGHT',
                          contentDescription: '',
                        },
                        title: '登录验证码',
                        descriptionTemplate:
                          '网页地址：https://cas.ctbiyi.com/cas/login。请选择【重新生成验证码】，或直接输入验证码。',
                        suggestions: [
                          {
                            reply: {
                              displayText: '重新生成验证码',
                              postback: {
                                data: 'renew_captcha',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
          collect: {
            key: 'expectCaptcha',
            options: [
              {
                pattern: 'renew_captcha',
                type: 'string',
                action: 'waitRenewCaptcha',
              },
              { default: true, action: 'waitFillAndSubmit' },
            ],
          },
          action: 'next',
        },
      ],
      waitRenewCaptcha: [
        {
          text: '请等待更新登录验证吗',
          collect: {
            key: 'fillCaptchaResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'showCaptcha' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
      ],
      waitShowNewCaptcha: [
        {
          text: '请等待更新登录验证吗',
          collect: {
            key: 'showCaptchaResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'showCaptcha' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
      ],
      waitFillAndSubmit: [
        {
          text: '请等待登录操作执行结果',
          collect: {
            key: 'fillSubmitResult',
            options: [
              {
                pattern: 'denglushibai',
                type: 'string',
                action: 'next',
              },
              {
                pattern: 'anquanchengnuo',
                type: 'string',
                action: 'next',
              },
              {
                pattern: 'dengluchenggong',
                type: 'string',
                action: 'guide',
              },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
        {
          channelData: {
            messageList: [
              {
                contentType: 'application/vnd.gsma.botmessage.v1.0+json',
                contentText: {
                  message: {
                    generalPurposeCard: {
                      layout: {
                        cardOrientation: 'HORIZONTAL',
                        imageAlignment: 'LEFT',
                        titleFontStyle: ['underline', 'bold'],
                        descriptionFontStyle: ['calibri'],
                        style: 'http://example.com/default.css',
                      },
                      content: {
                        media: {
                          mediaUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          mediaContentType: 'image/png',
                          mediaFileSize: 2,
                          thumbnailUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          thumbnailContentType: 'image/png',
                          thumbnailFileSize: 1,
                          height: 'MEDIUM_HEIGHT',
                          contentDescription: '',
                        },
                        title: '登录执行结果',
                        suggestions: [
                          {
                            reply: {
                              displayText: '重新登录（若登录失败）',
                              postback: {
                                data: 'redo_fill_captcha',
                              },
                            },
                          },
                          {
                            reply: {
                              displayText: '【同意】安全承诺书（若出现）',
                              postback: {
                                data: 'do_click_agree',
                              },
                            },
                          },
                          {
                            reply: {
                              displayText: '下一步',
                              postback: {
                                data: 'do_guide',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
          collect: {
            key: 'glossary',
            options: [
              {
                pattern: 'redo_fill_captcha',
                type: 'string',
                action: 'waitShowNewCaptcha',
              },
              {
                pattern: 'do_click_agree',
                type: 'string',
                action: 'waitClickAgree',
              },
              {
                pattern: 'do_guide',
                type: 'string',
                action: 'guide',
              },
              { default: true, action: 'close' },
            ],
          },
          action: 'next',
        },
      ],
      waitClickAgree: [
        {
          text: '请等待【同意】操作执行结果',
          collect: {
            key: 'clickAgreeResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'guide' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
      ],
      guide: [
        {
          channelData: {
            messageList: [
              {
                contentType: 'application/vnd.gsma.botmessage.v1.0+json',
                contentText: {
                  message: {
                    generalPurposeCard: {
                      layout: {
                        cardOrientation: 'HORIZONTAL',
                        imageAlignment: 'LEFT',
                        titleFontStyle: ['underline', 'bold'],
                        descriptionFontStyle: ['calibri'],
                        style: 'http://example.com/default.css',
                      },
                      content: {
                        media: {
                          mediaUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          mediaContentType: 'image/png',
                          mediaFileSize: 2,
                          thumbnailUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          thumbnailContentType: 'image/png',
                          thumbnailFileSize: 1,
                          height: 'MEDIUM_HEIGHT',
                          contentDescription: '',
                        },
                        title: '导航',
                        descriptionTemplate:
                          '指定要进入的页面。输入【close】退出应用。',
                        suggestions: [
                          {
                            reply: {
                              displayText: '进入【工作台】页',
                              postback: {
                                data: 'do_goto_workbench',
                              },
                            },
                          },
                          {
                            reply: {
                              displayText: '进入【日历】页',
                              postback: {
                                data: 'do_goto_calendar',
                              },
                            },
                          },
                          {
                            reply: {
                              displayText: '进入【日志】页',
                              postback: {
                                data: 'do_goto_effort',
                              },
                            },
                          },
                          {
                            reply: {
                              displayText: '新增日志',
                              postback: {
                                data: 'do_goto_addEffort',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
          collect: {
            key: 'glossary',
            options: [
              {
                pattern: 'do_goto_workbench',
                type: 'string',
                action: 'waitGotoWorkbench',
              },
              {
                pattern: 'do_goto_calendar',
                type: 'string',
                action: 'waitGotoZentaoCalendar',
              },
              {
                pattern: 'do_goto_effort',
                type: 'string',
                action: 'waitGotoZentaoEffort',
              },
              {
                pattern: 'do_goto_addEffort',
                type: 'string',
                action: 'waitGotoZentaoAddEffort',
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
      ],
      waitGotoWorkbench: [
        {
          text: '请等待进入【工作台】',
          collect: {
            key: 'gotoWorkbenchResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'next' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
        {
          channelData: {
            messageList: [
              {
                contentType: 'application/vnd.gsma.botmessage.v1.0+json',
                contentText: {
                  message: {
                    generalPurposeCard: {
                      layout: {
                        cardOrientation: 'HORIZONTAL',
                        imageAlignment: 'LEFT',
                        titleFontStyle: ['underline', 'bold'],
                        descriptionFontStyle: ['calibri'],
                        style: 'http://example.com/default.css',
                      },
                      content: {
                        media: {
                          mediaUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          mediaContentType: 'image/png',
                          mediaFileSize: 2,
                          thumbnailUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          thumbnailContentType: 'image/png',
                          thumbnailFileSize: 1,
                          height: 'MEDIUM_HEIGHT',
                          contentDescription: '',
                        },
                        title: '工作台',
                        descriptionTemplate: '输入【close】退出应用。',
                        suggestions: [
                          {
                            reply: {
                              displayText: '回到导航',
                              postback: {
                                data: 'do_guide',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
          collect: {
            key: 'glossary',
            options: [
              {
                pattern: 'do_guide',
                type: 'string',
                action: 'guide',
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
      ],
      waitGotoZentaoCalendar: [
        {
          text: '请等待进入【日历】页',
          collect: {
            key: 'gotoZentaoResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'waitGotoCalendar' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
      ],
      waitGotoCalendar: [
        {
          text: '请等待进入【日历】页',
          collect: {
            key: 'gotoCalendarResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'next' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
        {
          channelData: {
            messageList: [
              {
                contentType: 'application/vnd.gsma.botmessage.v1.0+json',
                contentText: {
                  message: {
                    generalPurposeCard: {
                      layout: {
                        cardOrientation: 'HORIZONTAL',
                        imageAlignment: 'LEFT',
                        titleFontStyle: ['underline', 'bold'],
                        descriptionFontStyle: ['calibri'],
                        style: 'http://example.com/default.css',
                      },
                      content: {
                        media: {
                          mediaUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          mediaContentType: 'image/png',
                          mediaFileSize: 2718288,
                          thumbnailUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          thumbnailContentType: 'image/png',
                          thumbnailFileSize: 314159,
                          height: 'MEDIUM_HEIGHT',
                          contentDescription: '',
                        },
                        title: '日历',
                        suggestions: [
                          {
                            reply: {
                              displayText: '回到导航',
                              postback: {
                                data: 'do_guide',
                              },
                            },
                          },
                          {
                            reply: {
                              displayText: '新增日志',
                              postback: {
                                data: 'do_add_effort',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
          collect: {
            key: 'glossary',
            options: [
              {
                pattern: 'do_guide',
                type: 'string',
                action: 'guide',
              },
              {
                pattern: 'do_add_effort',
                type: 'string',
                action: 'waitAddEffort',
              },
              { default: true, action: 'close' },
            ],
          },
          action: 'next',
        },
      ],
      waitGotoZentaoEffort: [
        {
          text: '请等待进入【日志】页',
          collect: {
            key: 'gotoZentaoResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'waitGotoEffort' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
      ],
      waitGotoEffort: [
        {
          text: '请等待进入【日志】页',
          collect: {
            key: 'gotoCalendarResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'next' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
        {
          channelData: {
            messageList: [
              {
                contentType: 'application/vnd.gsma.botmessage.v1.0+json',
                contentText: {
                  message: {
                    generalPurposeCard: {
                      layout: {
                        cardOrientation: 'HORIZONTAL',
                        imageAlignment: 'LEFT',
                        titleFontStyle: ['underline', 'bold'],
                        descriptionFontStyle: ['calibri'],
                        style: 'http://example.com/default.css',
                      },
                      content: {
                        media: {
                          mediaUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          mediaContentType: 'image/png',
                          mediaFileSize: 2,
                          thumbnailUrlTemplate:
                            '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                          thumbnailContentType: 'image/png',
                          thumbnailFileSize: 1,
                          height: 'MEDIUM_HEIGHT',
                          contentDescription: '',
                        },
                        title: '日志',
                        descriptionTemplate: '输入【close】退出应用。',
                        suggestions: [
                          {
                            reply: {
                              displayText: '回到导航',
                              postback: {
                                data: 'do_guide',
                              },
                            },
                          },
                          {
                            reply: {
                              displayText: '新增日志',
                              postback: {
                                data: 'do_add_effort',
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
          collect: {
            key: 'glossary',
            options: [
              {
                pattern: 'do_guide',
                type: 'string',
                action: 'guide',
              },
              {
                pattern: 'do_add_effort',
                type: 'string',
                action: 'waitAddEffort',
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
      ],
      waitGotoZentaoAddEffort: [
        {
          text: '请等待开始新增日志',
          collect: {
            key: 'GotoZentaoAddEffortResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'waitAddEffort' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
      ],
      waitAddEffort: [
        {
          text: '请等待获取项目信息',
          collect: {
            key: 'addEffort',
            options: [
              {
                pattern: 'ok',
                type: 'string',
                action: 'collectEffortProductId',
              },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
      ],
      collectEffortProductId: [
        {
          channelData: {
            messageList: [
              {
                contentType: 'text/plain',
                contentTextTemplate:
                  '{{#each vars.TMS_PUPPETEER_RESULT.http}}{{#unless @first}} ; {{/unless}}{{name}}: {{id}}{{/each}}',
              },
            ],
          },
        },
        {
          channelData: {
            messageList: [
              {
                contentType: 'text/plain',
                contentText: '请选择或输入项目id',
              },
              {
                contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
                contentText: {
                  suggestionsTemplate:
                    '[{{#each vars.TMS_PUPPETEER_RESULT.http}}{{#unless @first}},{{/unless}}{ "reply": { "displayText": "{{id}}", "postback": { "data": "{{id}}" } } }{{/each}}]',
                },
              },
            ],
          },
          collect: {
            key: 'expectProductId',
          },
          action: 'next',
        },
        {
          action: 'collectEffortDate',
        },
      ],
      collectEffortDate: [
        {
          channelData: {
            messageList: [
              {
                contentType: 'text/plain',
                contentText:
                  '请选择【工作日】或输入对应【日期】，例如：2022-11-11',
              },
              {
                contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
                contentText: {
                  suggestionsTemplate:
                    '[{{#each vars.weekWorkdays}}{{#unless @first}},{{/unless}}{ "reply": { "displayText": "{{text}}", "postback": { "data": "{{value}}" } } }{{/each}}]',
                },
              },
            ],
          },
          collect: {
            key: 'expectDate',
          },
          action: 'next',
        },
        {
          action: 'collectEfforWork',
        },
      ],
      collectEfforWork: [
        {
          text: '请输入【工作内容】',
          collect: {
            key: 'expectWork',
          },
          action: 'next',
        },
        {
          action: 'collectEffortConsumed',
        },
      ],
      collectEffortConsumed: [
        {
          channelData: {
            messageList: [
              {
                contentType: 'text/plain',
                contentText: '请输入【耗时（小时）】或直接选择',
              },
              {
                contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
                contentText: {
                  suggestions: [
                    {
                      reply: {
                        displayText: '1小时',
                        postback: {
                          data: '1',
                        },
                      },
                    },
                    {
                      reply: {
                        displayText: '2小时',
                        postback: {
                          data: '2',
                        },
                      },
                    },
                    {
                      reply: {
                        displayText: '4小时',
                        postback: {
                          data: '4',
                        },
                      },
                    },
                    {
                      reply: {
                        displayText: '8小时',
                        postback: {
                          data: '8',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          collect: {
            key: 'expectConsumed',
          },
          action: 'next',
        },
        {
          action: 'confirmCollectEffort',
        },
      ],
      confirmCollectEffort: [
        {
          channelData: {
            messageList: [
              {
                contentType: 'text/plain',
                contentTextTemplate:
                  '项目id={{vars.expectProductId}}，工作日={{vars.expectDate}}，工作内容={{vars.expectWork}}，消耗小时={{vars.expectConsumed}}。',
              },
              {
                contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
                contentText: {
                  suggestions: [
                    {
                      reply: {
                        displayText: '提交',
                        postback: {
                          data: 'yes',
                        },
                      },
                    },
                    {
                      reply: {
                        displayText: '返回导航',
                        postback: {
                          data: 'guide',
                        },
                      },
                    },
                    {
                      reply: {
                        displayText: '退出应用',
                        postback: {
                          data: 'close',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          collect: {
            key: 'confirmSubmitEffort',
            options: [
              {
                pattern: 'yes|是',
                type: 'string',
                action: 'waitSubmitEffort',
              },
              {
                pattern: 'close',
                type: 'string',
                action: 'close',
              },
              { default: true, action: 'guide' },
            ],
          },
          action: 'next',
        },
      ],
      waitSubmitEffort: [
        {
          text: '等待新增日志提交结果',
          collect: {
            key: 'submitEffortResult',
            options: [
              { pattern: 'ok', type: 'string', action: 'next' },
              { default: true, action: 'repeat' },
            ],
          },
          action: 'next',
        },
        {
          channelData: {
            messageList: [
              {
                contentType: 'text/plain',
                contentTextTemplate: '继续新增日志？',
              },
              {
                contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
                contentText: {
                  suggestions: [
                    {
                      reply: {
                        displayText: '继续',
                        postback: {
                          data: 'yes',
                        },
                      },
                    },
                    {
                      reply: {
                        displayText: '查看日志',
                        postback: {
                          data: 'goto_effort',
                        },
                      },
                    },
                    {
                      reply: {
                        displayText: '查看日历',
                        postback: {
                          data: 'goto_calendar',
                        },
                      },
                    },
                    {
                      reply: {
                        displayText: '退出',
                        postback: {
                          data: 'goto_close',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          collect: {
            key: 'confirmSubmitEffort',
            options: [
              {
                pattern: 'yes|是',
                type: 'string',
                action: 'waitAddEffort',
              },
              {
                pattern: 'goto_effort',
                type: 'string',
                action: 'waitGotoZentaoEffort',
              },
              {
                pattern: 'goto_calendar',
                type: 'string',
                action: 'waitGotoZentaoCalendar',
              },
              {
                pattern: 'goto_close',
                type: 'string',
                action: 'close',
              },
              { default: true, action: 'guide' },
            ],
          },
          action: 'next',
        },
      ],
      close: [
        {
          text: '请输入【close】关闭应用，其它任意内容返回导航',
          collect: {
            key: 'expectClose',
            options: [
              { pattern: 'close', type: 'string', action: 'waitClose' },
              { default: true, action: 'guide' },
            ],
          },
          action: 'next',
        },
      ],
      waitClose: [
        {
          text: '请等待【关闭】操作执行结果',
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
      finish: [{ text: '结束！若需要再次操作，请输入【gongshi】激活' }],
    },
  },
}
