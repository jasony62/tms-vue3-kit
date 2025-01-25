<template>
  <div>
    <p>演示Jexl使用</p>
    <div class="p-4">
      <div>数据</div>
      <div v-html="strContext"></div>
    </div>
    <div class="p-4">
      <div v-html="expr1"></div>
      <div>{{ result1 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr2"></div>
      <div>{{ result2 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr3"></div>
      <div>{{ result3 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr4"></div>
      <div>{{ result4 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr5"></div>
      <div>{{ result5 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr6"></div>
      <div>{{ result6 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr7"></div>
      <div>{{ result7 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr8"></div>
      <div>{{ result8 }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Jexl } from 'tms-data-aid'

const obj1 = { a: 1 }
const obj2 = { x: 1, y: 2, z: 3 }
const arr1 = [{ a: 1 }, { a: 2 }, { a: 3 }]
const arr2 = [1, 2, 3, 4, 5]
const arr3 = [
  { n: 'x', a: 1 },
  { n: 'y', a: 2 },
  { n: 'z', a: 3 },
]
const obj4 = { a: { x: 1, z: 3, m: 5 } }
const obj5 = { a: { y: 2, z: 4 } }

let context = {
  obj1,
  obj2,
  arr1,
  arr2,
  arr3,
  obj4,
  obj5,
}

let strContext = JSON.stringify(context, null, 2)

let expr1 = 'obj1.a'
let result1 = Jexl.evalSync(expr1, context)

let expr2 = 'arr1 | pluck("a")'
let result2 = Jexl.evalSync(expr2, context)

let expr3 = 'arr2 | sum'
let result3 = Jexl.evalSync(expr3, context)

let expr4 = 'arr2 | avg'
let result4 = Jexl.evalSync(expr4, context)

let expr5 = 'arr1 | pluck("a") | sum'
let result5 = Jexl.evalSync(expr5, context)

let expr6 = 'obj2 | values'
let result6 = Jexl.evalSync(expr6, context)

let expr7 = "arr3 | dict('n')"
let result7 = Jexl.evalSync(expr7, context)

let expr8 = 'obj4 | merge(obj5)'
let result8 = Jexl.evalSync(expr8, context)
</script>
