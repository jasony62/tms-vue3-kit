import { App, createApp } from 'vue'
import Login from './Login.vue'

/**
 * 以对话框方式打开登录框
 *
 * @param options
 */
function showAsDialog(options: any) {
  const root = document.createElement('div')
  document.body.appendChild(root)
  let app = createApp(Login, {
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
  app.component('tms-login', Login)
}

Login.install = install

Login.open = showAsDialog

export default Login
