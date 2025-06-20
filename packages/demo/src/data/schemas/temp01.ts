export const SampleSchema = {
  description: '约稿函生成专家',
  type: 'object',
  properties: {
    journalName: {
      title: '期刊名称',
      type: 'string',
      description: '请输入目标期刊全称',
    },
    topic: {
      title: '主题领域',
      type: 'array',
      items: {
        type: 'string',
      },
      description: '选择稿件所属学科方向',
      anyOf: [
        {
          label: '科学技术',
          value: '科学技术',
        },
        {
          label: '社会科学',
          value: '社会科学',
        },
        {
          label: '人文艺术',
          value: '人文艺术',
        },
        {
          label: '医学',
          value: '医学',
        },
        {
          label: '工程',
          value: '工程',
        },
        {
          label: '交叉学科',
          value: '交叉学科',
        },
      ],
    },
    wordCount: {
      title: '字数要求',
      type: 'string',
      description: '选择文章字数范围',
      oneOf: [
        {
          label: '3000-5000',
          value: '3000-5000',
        },
        {
          label: '5000-8000',
          value: '5000-8000',
        },
        {
          label: '8000-10000',
          value: '8000-10000',
        },
        {
          label: '10000+',
          value: '10000+',
        },
      ],
    },
    articleType: {
      title: '投稿类型',
      type: 'array',
      items: {
        type: 'string',
      },
      description: '选择稿件类型（可多选）',
      anyOf: [
        {
          label: '原创研究',
          value: '原创研究',
        },
        {
          label: '综述',
          value: '综述',
        },
        {
          label: '论文评论',
          value: '论文评论',
        },
        {
          label: '案例分析',
          value: '案例分析',
        },
        {
          label: '洗衣服务',
          value: '洗衣服务',
        },
        {
          label: '方法论',
          value: '方法论',
        },
        {
          label: '技术报告',
          value: '技术报告',
        },
      ],
    },
    copyright: {
      title: '版权声明',
      type: 'string',
      description: '补充特殊版权要求（如开放获取声明）',
      format: 'longtext',
    },
    endDate: {
      title: '截止日期',
      type: 'string',
      description: '请输入具体日期（YYYY-MM-DD）',
    },
    writerRule: {
      title: '作者要求',
      type: 'array',
      items: {
        type: 'string',
      },
      description: '选择作者资质要求（可多选）',
      anyOf: [
        {
          label: '未发表过',
          value: '未发表过',
        },
        {
          label: '无学术不端',
          value: '无学术不端',
        },
        {
          label: '无重复投稿',
          value: '无重复投稿',
        },
        {
          label: '需附ORCID',
          value: '需附ORCID',
        },
      ],
    },
    remark: {
      title: '附加说明',
      type: 'string',
      description: '补充期刊特殊要求（如双盲审等）',
      format: 'longtext',
    },
  },
}

export const SampleData = null
