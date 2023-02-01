import { FormContext } from '../builder'

/**
 * 表单中的节点。与Vue中的VNode对应。
 */
export class Node<VNode> {
  ctx: FormContext
  rawArgs
  _vnode: VNode | undefined
  _h: (type: string, props?: any, children?: any) => VNode

  constructor(
    ctx: FormContext,
    rawArgs: { [k: string]: any },
    h: (type: string, props?: object | null, children?: any) => VNode
  ) {
    this.ctx = ctx
    this.rawArgs = rawArgs
    this._h = h
  }
  /**
   * 节点渲染函数
   */
  get h() {
    return this._h
  }
  /**
   * 指定的组件选项
   *
   * @param {Object} extendingOptions 节点上要添加的属性
   * @param {Object} field 表单控件
   * @param {Object} item 表单控件的子控件
   */
  attrOrProps(extendingOptions = {}, field = {}, item = {}) {
    const { option: rawOption } = this.rawArgs

    let options
    if (typeof rawOption === 'function') {
      options = rawOption({ ctx: this.ctx, field, item })
    } else {
      options = { ...rawOption, native: undefined }
    }

    return { ...extendingOptions, ...options }
  }
  /**
   * 创建表单VNode
   *
   * @param children 表单子节点数组
   * @returns 返回节点对象
   */
  createElem(children: (VNode | string)[] = []): VNode {
    const attrOrProps = this.attrOrProps()

    this._vnode = this._h(this.rawArgs.tag, attrOrProps, children)

    return this._vnode
  }
}
