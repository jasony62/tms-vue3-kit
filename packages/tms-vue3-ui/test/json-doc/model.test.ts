import { DocIter, DocAsArray } from '@/json-doc/model'

describe('文档迭代器', () => {
  // it('执行迭代', () => {
  //   const doc = {
  //     name: 'doc001',
  //     title: '文档001',
  //     content: { type: 'text', body: 'hello' },
  //     children: [
  //       {
  //         name: 'doc001_0',
  //         title: '文档001_0',
  //         content: { type: 'image', body: 'aaabbb' },
  //       },
  //     ],
  //   }
  //   const iter = new DocIter(doc)
  //   const props = Array.from(iter)

  //   console.log(props)
  // })
  // it('追加方式构造对象', () => {
  //   const builder = new DocAsArray()
  //   builder.append('name', 'doc001')
  //   builder.append('title', '文档001')
  //   builder.append('content.type', 'text')
  //   builder.append('content.body', 'hello')
  //   builder.append('children[0].name', 'doc001_0')
  //   builder.append('children[0].title', '文档001_0')
  //   builder.append('children[0].content.type', 'image')
  //   builder.append('children[0].content.body', 'aaabbb')
  //   const obj = builder.build()
  //   console.log(JSON.stringify(obj, null, 2))
  // })
  // it('指定位置添加方式构造对象', () => {
  //   const builder = new DocAsArray()
  //   builder.appendAt('', 'doc001', 'name')
  //   builder.appendAt('', '文档001', 'title')
  //   builder.appendAt('', {}, 'content')
  //   builder.appendAt('content', 'text', 'type')
  //   builder.appendAt('content', 'hello', 'body')
  //   builder.appendAt('content', [], 'children')
  //   builder.appendAt('content.children', {}, 0)
  //   builder.appendAt('content.children[0]', 'doc001_0', 'name')
  //   builder.appendAt('content.children[0]', '文档001_0', 'title')
  //   builder.appendAt('content.children[0]', {}, 'content')
  //   builder.appendAt('content.children[0].content', 'image', 'type')
  //   builder.appendAt('content.children[0].content', 'aaabbb', 'body')

  //   console.log(JSON.stringify(builder._properties, null, 2))
  //   const obj = builder.build()
  //   console.log(JSON.stringify(obj, null, 2))
  // })
  // it('操作数组对象，删除', () => {
  //   const doc = {
  //     additionalName: ['alice', 'bob'],
  //   }
  //   const builder = new DocAsArray(doc)
  //   builder.remove('additionalName[0]')

  //   console.log(JSON.stringify(builder._properties, null, 2))
  //   //const obj = builder.build()
  //   //console.log(JSON.stringify(obj, null, 2))
  // })
  it('操作数组对象，删除', () => {
    const doc = {
      experiences: [{ time: '2001' }, { time: '2002' }],
    }

    const builder = new DocAsArray(doc)
    builder.remove('experiences[0]')
    console.log(JSON.stringify(builder._properties, null, 2))

    //const obj = builder.build()
    //console.log(JSON.stringify(obj, null, 2))
  })
})
