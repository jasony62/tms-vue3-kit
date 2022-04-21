import { createApp } from 'vue'
import App from './App.vue'
import { TmsAxiosPlugin, TmsAxios } from 'tms-vue3'
import { Frame, Flex, Card, Text, ObjectInput } from 'tms-vue3-ui'
import router from './router'
import './index.css'

// import 'tms-vue3-ui/dist/es/frame/style/index.css'
// import 'tms-vue3-ui/dist/es/flex/style/index.css'
// import 'tms-vue3-ui/dist/es/text/style/index.css'
// import 'tms-vue3-ui/dist/es/card/style/index.css'

const app = createApp(App)
app.use(router)

app
  .use(TmsAxiosPlugin)
  .use(Frame)
  .use(Flex)
  .use(Card)
  .use(Text)
  .use(ObjectInput)

// 注意不需要new，返回的不是Class，是工厂方法
let name = 'tms-axios-1'
let rules: any[] = [] // 见下面的说明
let config = {} // 参考axios的config
TmsAxios.ins({ name, rules, config })

app.mount('#app')
