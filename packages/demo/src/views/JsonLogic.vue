<template>
  <div>
    <p>演示JsonLogic使用</p>
    <div class="p-4">
      <div>数据</div>
      <div v-html="strContext"></div>
    </div>
    <div class="p-4">
      <div v-html="strRule1"></div>
      <div>{{ result1 }}</div>
    </div>
    <div class="p-4">
      <div v-html="strRule2"></div>
      <div>{{ result2 }}</div>
    </div>
    <div class="p-4">
      <div v-html="strRule3"></div>
      <div>{{ result3 }}</div>
    </div>
    <div class="p-4">
      <div v-html="strRule4"></div>
      <div>{{ result4 }}</div>
    </div>
    <div class="p-4">
      <div v-html="strRule5"></div>
      <div>{{ result5 }}</div>
    </div>
    <div class="p-4">
      <div v-html="strRule6"></div>
      <div>{{ result6 }}</div>
    </div>
    <div class="p-4">
      <div v-html="strRule7"></div>
      <div>{{ result7 }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { JsonLogic } from 'tms-data-aid'

const obj1 = { a: 1 }
const obj2 = { x: 1, y: 2, z: 3 }
const arr1 = [{ a: 1 }, { a: 2 }, { a: 3 }]
const arr2 = [1, 2, 3, 4, 5]

let context = {
  obj1,
  obj2,
  arr1,
  arr2
}

let strContext = JSON.stringify(context, null, 2)

let rule1 = { map: [{ var: 'arr1' }, { var: 'a' }] }
let strRule1 = JSON.stringify(rule1, null, 2)
//@ts-ignore
let result1 = JsonLogic.apply(rule1, context)

let rule2 = { map: [{ var: 'arr1' }, { "*": [{ var: 'a' }, 2] }] }
let strRule2 = JSON.stringify(rule2, null, 2)
//@ts-ignore
let result2 = JsonLogic.apply(rule2, context)

let rule3 = { filter: [{ var: 'arr2' }, { ">=": [{ var: '' }, 3] }] }
let strRule3 = JSON.stringify(rule3, null, 2)
//@ts-ignore
let result3 = JsonLogic.apply(rule3, context)

let rule4 = {
  reduce: [
    { var: 'arr2' },
    { '+': [{ var: 'current' }, { var: 'accumulator' }] },
    0,
  ],
}
let strRule4 = JSON.stringify(rule4, null, 2)
//@ts-ignore
let result4 = JsonLogic.apply(rule4, context)

let rule5 = { cat: ['I love', ' pie'] }
let strRule5 = JSON.stringify(rule5, null, 2)
//@ts-ignore
let result5 = JsonLogic.apply(rule5, context)

let rule6 = { substr: ['jsonlogic', 4, -2] }
let strRule6 = JSON.stringify(rule6, null, 2)
//@ts-ignore
let result6 = JsonLogic.apply(rule6, context)


let rule7 = { max: [1, 2, 3] }
let strRule7 = JSON.stringify(rule7, null, 2)
//@ts-ignore
let result7 = JsonLogic.apply(rule7, context)
</script>