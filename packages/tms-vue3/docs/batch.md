# 执行批量任务类（Batch）

管理需要按批次执行的任务，例如：分页访问数据。

```js
import { Batch } from 'tms-vue'

const batch = new Batch((arg1, ..., argN, batchArg) => {}, arg1, ..., argN)
batch.size = 10
batch.next().then(({result,done})=>{...})
```

除了给要批次执行的方法传入固定的参数外，还会添加一个类型为`BatchArg`的示例记录批次执行状态（page 和 size）。

## 属性

| 属性       | 说明                                                                | 类型     | 默认值 |
| ---------- | ------------------------------------------------------------------- | -------- | ------ |
| action     | 需要按批次执行的方法                                                | function |        |
| actionArgs | 按批次执行方法的参数                                                | array    |        |
| page       | 批量任务的页号                                                      | number   | 0      |
| size       | 每一批的任务数量                                                    | number   | 1      |
| total      | 全部任务数量                                                        | number   | 0      |
| execPage   | 将要执行的批量任务页号，执行成功后赋值给 page                       | number   | 0      |
| tail       | 已完成的最 size 条任务的编号（只读，任务编号从 1 开始，page\*size） | number   |        |
| progress   | 当前进度，tail/total，只读                                          | string   |        |
| pages      | 总的页数                                                            | number   |        |

## 方法

> let batch = new Batch(fnAction, ..., argN)
> batch.size = 12
> let result = await batch.next()

### constructor

| 参数     | 说明                                       | 类型     |
| -------- | ------------------------------------------ | -------- |
| fnAction | 需要批量执行的方法，返回值必须为 Promise。 | function |
| argN     | 执行批量方法需要的参数。                   | any      |

如果 fnAction 的执行需要依赖特定的上下文，应该在传入前进行绑定。请参考单元测试中的用例。参数数量应该和方法需要的参数数量一致。

### exec

执行当前批次。该方法调用传入的批量方法。

返回当前批次执行的结果，和整体是否执行完成。

### next

执行下一个批次。

调用 fnAction 方法，传递构造时的参数 argN，并且最后传入一个 类型位 BatchArg 参数。

```
class BatchArg {
  constructor(page, size) {
    this.page = page
    this.size = size
  }
  toString() {
    return `${this.page},${this.size}`
  }
}
```

返回结果是一个对象，包含 fnAction 执行的结果和是否任务已经全部完成。

```
{result, done}
```

如果返回结果中包含 total，自动记录到 batch 实例中。

### goto

执行指定批次。

| 参数       | 说明       | 类型   |
| ---------- | ---------- | ------ |
| targetPage | 批次编号。 | number |

### startBatch

创建并执行 1 次批量任务。

| 参数                  | 说明                        | 类型     | 默认值 |
| --------------------- | --------------------------- | -------- | ------ |
| action                | 需要按批次执行的方法        | function |        |
| argsArray             | 按批次执行方法的参数        | array    |        |
| options               | 批次任务参数                | object   |        |
| options.size          | 每个批次包含任务数          | number   | 1      |
| options.firstCallback | 第 1 个批次执行完的回调函数 | function |        |
