import { App, createApp } from 'vue'
import Register from './Register.vue'

/**
 * 以对话框方式打开登录框
 *
 * @param options
 */
function showAsDialog(options: any) {
  const root = document.createElement('div')
  document.body.appendChild(root)
  let app = createApp(Register, {
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
  app.component('tms-regiser', Register)
}

Register.install = install

Register.open = showAsDialog

export default Register
