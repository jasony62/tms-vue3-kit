/**
 * 需要用户输入的数据
 *
 * type对应input组件的type类型。
 * type=captcha，作为图形验证码。
 * type=smscode，作为短信验证码。
 */
export type SubmitDataItem = {
  key: string
  type: string
  placeholder: string
}
/**
 * 验证码返回结果
 */
export type CaptchaResponse = {
  code: number
  captcha: string
  [key: string]: any
}
/**
 * 登录操作返回的响应
 */
export type LoginResponse = {
  code: number
  msg: string
  [key: string]: any
}
