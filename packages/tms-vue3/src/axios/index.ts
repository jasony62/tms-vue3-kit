import axios from 'axios'

/**
 * 请求拦截器中添加的参数
 */
class InterceptorRule {
  requestParams: any
  requestHeaders: any
  onRequestRejected: Function
  onResponseRejected: Function
  onRetryAttempt: Function
  onResultFault: Function
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
  constructor({
    requestParams,
    requestHeaders,
    onRequestRejected,
    onResponseRejected,
    onRetryAttempt,
    onResultFault,
  }) {
    this.requestParams = requestParams
    this.requestHeaders = requestHeaders
    this.onRequestRejected = onRequestRejected
    this.onResponseRejected = onResponseRejected
    this.onRetryAttempt = onRetryAttempt
    this.onResultFault = onResultFault
  }
}

// 保存所有创建过的实例
const instances = new Map()

function useRequestInterceptor(tmsAxios, rules) {
  if (!Array.isArray(rules) || rules.length === 0) return
  rules.forEach((rule) => {
    let { requestParams, requestHeaders, onRequestRejected } = rule

    let onFulfilled = async function (config) {
      if (undefined === config) config = {}
      let promise = Promise.resolve(config)
      let chain: any[] = []
      // 添加查询参数
      if (requestParams) {
        if (!config.params) config.params = {}
        let params = config.params
        requestParams.forEach((v, k) =>
          typeof v === 'function'
            ? chain.push([v, (v2) => (params[k] = v2)])
            : (params[k] = v)
        )
      }
      // 添加请求头
      if (requestHeaders) {
        if (!config.headers) config.headers = {}
        let headers = config.headers
        requestHeaders.forEach((v, k) =>
          typeof v === 'function'
            ? chain.push([v, (v2) => (headers[k] = v2)])
            : (headers[k] = v)
        )
      }
      while (chain.length) {
        let [f1, f2] = chain.shift()
        promise = promise
          .then(f1)
          .then(f2)
          .then(() => config)
      }

      return promise
    }
    let onRejected = function (err) {
      return typeof onRequestRejected === 'function'
        ? onRequestRejected(err, rule)
        : Promise.reject(err)
    }
    tmsAxios.interceptors.request.use(onFulfilled, onRejected)
  })
}

function useResponseInterceptor(tmsAxios, rules) {
  if (!Array.isArray(rules) || rules.length === 0) return

  let retryRules, faultRules, onRejectedRules
  retryRules = rules.filter((rule) => typeof rule.onRetryAttempt === 'function')
  faultRules = rules.filter((rule) => typeof rule.onResultFault === 'function')
  onRejectedRules = rules.filter(
    (rule) => typeof rule.onResponseRejected === 'function'
  )
  /*重发请求*/
  if (retryRules.length) {
    tmsAxios.interceptors.response.use((res) => {
      if (res.data.code !== 0) {
        /*只允许尝试重发一次*/
        if (undefined === res.config.headers['TmsAxios-Retry']) {
          res.config.headers['TmsAxios-Retry'] = 1
          let retryPromises = retryRules.map((rule) =>
            rule.onRetryAttempt(res, rule)
          )
          return Promise.all(retryPromises).then((isRetry) =>
            isRetry.includes(true) ? tmsAxios.request(res.config) : res
          )
        }
      }
      return res
    })
  }
  /*业务逻辑错误处理*/
  if (faultRules.length) {
    faultRules.forEach((rule) => {
      tmsAxios.interceptors.response.use((res) => {
        if (res.data.code !== 0) {
          return rule.onResultFault(res, rule)
        }
        return res
      })
    })
  }
  /*失败处理*/
  if (onRejectedRules.length) {
    onRejectedRules.forEach((rule) => {
      tmsAxios.interceptors.response.use(
        (res) => res,
        (err) => {
          return rule.onResponseRejected(err, rule)
        }
      )
    })
  }
}
/**
 * 增强axios
 */
class TmsAxios {
  name: string
  rules: any[]
  TmsAxios: any
  /**
   *
   * @param {object} options
   * @param {string} options.name 名称
   * @param {Array<InterceptorRule>} options.rules 拦截规则
   * @param {object} options.config 默认axios实例配置规则
   */
  constructor({ name = null, rules = undefined, config = undefined } = {}) {
    let axios2 = axios.create(config)
    Object.assign(this, axios2)

    this.name = name || `tms_axios_${instances.size + 1}`
    this.rules = rules === undefined ? [] : rules
    this.TmsAxios = TmsAxios
    instances.set(this.name, this)

    if (Array.isArray(this.rules) && this.rules.length) {
      // 添加请求拦截器
      useRequestInterceptor(this, rules)
      // 添加响应拦截器
      useResponseInterceptor(this, rules)
    }
  }
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
  static ins(nameOrConfig) {
    if (typeof nameOrConfig === 'string') return instances.get(nameOrConfig)
    if (undefined === nameOrConfig || typeof nameOrConfig === 'object')
      return new TmsAxios(nameOrConfig)

    return false
  }

  static remove(name) {
    return instances.delete(name)
  }
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
  static newInterceptorRule({
    requestParams,
    requestHeaders,
    onRequestRejected,
    onResponseRejected,
    onRetryAttempt,
    onResultFault,
  }) {
    return new InterceptorRule({
      requestParams,
      requestHeaders,
      onRequestRejected,
      onResponseRejected,
      onRetryAttempt,
      onResultFault,
    })
  }
}

export { TmsAxios }

export default function install(app: any) {
  let TmsAxiosIns: any = TmsAxios.ins
  TmsAxiosIns['newInterceptorRule'] = TmsAxios.newInterceptorRule
  TmsAxiosIns['remove'] = TmsAxios.remove
  app.TmsAxios = TmsAxiosIns
  app.config.globalProperties.TmsAxios = TmsAxios
}
