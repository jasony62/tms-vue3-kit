/**
 * 按批次执行任务
 */
declare class BatchArg {
    page: number;
    size: number;
    constructor(page: any, size: any);
    toString(): string;
}
declare class Batch {
    action: Function;
    actionArgs: any[];
    page: number;
    execPage: number;
    size: number;
    total: number;
    /**
     * 创建执行批量任务对象
     *
     * @param {function} action 需要按批次执行的方法，需要返回Promise
     * @param  {...any} args
     */
    constructor(action: any, ...args: any[]);
    /**
     * 总的页数
     */
    get pages(): number;
    /**
     * 已获取最后1条任务编号
     */
    get tail(): number;
    /**
     * 当前进度
     */
    get progress(): string;
    /**
     * 指定批次是否在范围内
     *
     * @param {number} targetPage
     */
    inside(targetPage: any): boolean;
    /**
     * 是否有下一个批次
     */
    hasNext(): boolean;
    /**
     * 执行下一个批次
     */
    next(): any;
    /**
     * 执行指定批次
     *
     * @param {number} targetPage
     */
    goto(targetPage: any): any;
    /**
     * 执行当前批次
     */
    exec(): any;
}
/**
 * 创建并执行1次批次任务
 *
 * @param {function} action - 要执行的方法
 * @param {[]} [argsArray=[]] - 方法的参数列表
 * @param {object} [options={}] - 批次任务配置
 * @param {number} [options.size=1] - 每个批次包含的任务数
 *
 * @returns {Batch} 批量任务实例。
 */
declare function startBatch(action: Function, argsArray: any[], { size, reactiveWrap }?: {
    size?: number | undefined;
    reactiveWrap?: ((ins: any) => any) | undefined;
}): Batch;
export { Batch, BatchArg, startBatch };
