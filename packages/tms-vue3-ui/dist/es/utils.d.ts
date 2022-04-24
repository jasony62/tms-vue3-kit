export class Render {
    /**
     * 按层级创建节点
     *
     * @param {*} createElement
     * @param {*} tags
     * @param {*} options
     * @param {*} children
     */
    static layered(createElement: any, tags: any, options: any, children: any): any;
}
export class JsonSchema {
    /**
     * 遍历JSONSchema对象
     *
     * @param {*} schema
     * @param {*} schemaCallback
     * @param {*} schemaPath
     * @param {*} flatted
     */
    static travel(schema: any, schemaCallback: any, schemaPath?: any, flatted?: any): any;
    /**
     *
     */
    static flattenObject(obj: any, propPath?: any[], flatted?: Map<any, any>): Map<any, any>;
    /**
     * 返回根据schema剪裁后的对象
     *
     * 剪裁规则：
     * 1，schema中不包含的数据
     * 2，schema中包含但是值为空的数据，包括：空对象，空数组，undefined，null
     *
     * @param {object} schema
     * @param {object} doc
     *
     */
    static slim(schema: object, doc: object): {};
}
