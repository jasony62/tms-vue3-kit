/**
 * 请求拦截器中添加的参数
 */
declare class InterceptorRule {
    requestParams: any;
    requestHeaders: any;
    onRequestRejected: Function;
    onResponseRejected: Function;
    onRetryAttempt: Function;
    onResultFault: Function;
    /**
     * 拦截规则
     *
     * @param {Map<string,string>} requestParams 请求中添加参数，key作为名称，value作为值
     * @param {Map<string,string>} requestHeaders 请求中添加头，key作为名称，value作为值
     * @param {function} onRequestRejected 处理请求阶段发生的异常
     * @param {function} onResponseRejected 处理响应阶段发生的异常
     * @param {function} onRetryAttempt 响应失败时，尝试重发请求
     * @param {function} onResultFault 响应失败时，处理响应
     */
    constructor({ requestParams, requestHeaders, onRequestRejected, onResponseRejected, onRetryAttempt, onResultFault, }: {
        requestParams: any;
        requestHeaders: any;
        onRequestRejected: any;
        onResponseRejected: any;
        onRetryAttempt: any;
        onResultFault: any;
    });
}
/**
 * 增强axios
 */
declare class TmsAxios {
    name: string;
    rules: any[];
    TmsAxios: any;
    /**
     *
     * @param {object} options
     * @param {string} options.name 名称
     * @param {Array<InterceptorRule>} options.rules 拦截规则
     * @param {object} options.config 默认axios实例配置规则
     */
    constructor({ name, rules, config }?: {
        name?: null | undefined;
        rules?: undefined;
        config?: undefined;
    });
    /**
     * 查找或创建一个实例
     *
     * @param {*} nameOrConfig 实例的名称或新建参数，如果是字符串当作实例名称，如果是对象当作创建参数
     * @param {string} nameOrConfig.name 实例名称
     * @param {Array<InterceptorRule>} nameOrConfig.rules 拦截规则
     * @param {object} nameOrConfig.config 默认axios实例配置规则
     *
     * @return {TmsAxios} 实例
     */
    static ins(nameOrConfig: any): any;
    static remove(name: any): boolean;
    /**
     * 创建拦截规则
     *
     * @param {Map<string,string>} requestParams 请求中添加参数，key作为名称，value作为值
     * @param {Map<string,string>} requestHeaders 请求中添加头，key作为名称，value作为值
     * @param {function} onRequestRejected 处理请求阶段发生的异常
     * @param {function} onResponseRejected 处理响应阶段发生的异常
     * @param {function} onRetryAttempt 请求返回失败时进行重试
     * @param {function} onResultFault 请求返回失败时的处理
     *
     * @return {InterceptorRule} 规则对象
     */
    static newInterceptorRule({ requestParams, requestHeaders, onRequestRejected, onResponseRejected, onRetryAttempt, onResultFault, }: {
        requestParams: any;
        requestHeaders: any;
        onRequestRejected: any;
        onResponseRejected: any;
        onRetryAttempt: any;
        onResultFault: any;
    }): InterceptorRule;
}
export { TmsAxios };
export default function install(app: any): void;
