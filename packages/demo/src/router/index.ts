import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import LayoutUi from '../views/LayoutUi.vue'
import LoginUi from '../views/LoginUi.vue'
import RegisterUi from '../views/RegisterUi.vue'
import SmsCodeUi from '../views/SmsCodeUi.vue'
import JsonSchemaUi from '../views/JsonSchemaUi.vue'
import JsonDocUi from '../views/JsonDocUi.vue'
import Handlebars from '../views/Handlebars.vue'
import Jexl from '../views/Jexl.vue'
import JsonLogic from '../views/JsonLogic.vue'

const VITE_BASE_URL =
  typeof import.meta.env.VITE_BASE_URL === 'string'
    ? import.meta.env.VITE_BASE_URL
    : '/'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/layout',
    name: 'layout',
    component: LayoutUi,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginUi,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterUi,
  },
  {
    path: '/sms-code',
    name: 'sms-code',
    component: SmsCodeUi,
  },
  {
    path: '/json-schema',
    name: 'json-schema',
    component: JsonSchemaUi,
  },
  {
    path: '/json-doc',
    name: 'json-doc',
    component: JsonDocUi,
  },
  {
    path: '/handlebars',
    name: 'handlebars',
    component: Handlebars,
  },
  {
    path: '/jexl',
    name: 'jexl',
    component: Jexl,
  },
  {
    path: '/jsonlogic',
    name: 'jsonlogic',
    component: JsonLogic,
  },
]
const router = createRouter({
  history: createWebHistory(VITE_BASE_URL),
  routes,
})

export default router
