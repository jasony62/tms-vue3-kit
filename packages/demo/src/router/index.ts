import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import LayoutUi from '../views/LayoutUi.vue'
import ObjectInputUi from '../views/ObjectInputUi.vue'
import LoginUi from '../views/LoginUi.vue'
import JsonSchemaUi from '../views/JsonSchemaUi.vue'

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
    path: '/object-input',
    name: 'object-input',
    component: ObjectInputUi,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginUi,
  },
  {
    path: '/json-schema',
    name: 'json-schema',
    component: JsonSchemaUi,
  },
]
const router = createRouter({
  history: createWebHistory(VITE_BASE_URL),
  routes,
})

export default router
