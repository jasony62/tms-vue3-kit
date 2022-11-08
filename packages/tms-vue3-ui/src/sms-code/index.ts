import { App, createApp } from 'vue'
import SmsCode from './SmsCode.vue'

/**
 * 以对话框方式打开登录框
 *
 * @param options
 */
function showAsDialog(options: any) {
  const root = document.createElement('div')
  document.body.appendChild(root)
  let app = createApp(SmsCode, {
    asDialog: true,
    ...options,
    onClose: () => {
      app.unmount()
      document.body.removeChild(root)
    },
  })
  app.mount(root)
}

/**
 *
 * @param {*} App
 */
function install(app: App) {
  app.component('tms-sms-code', SmsCode)
}

SmsCode.install = install

SmsCode.open = showAsDialog

export default SmsCode
