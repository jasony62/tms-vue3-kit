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
      <div v-html="expr3_1"></div>
      <div>{{ result3_1 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr3_2"></div>
      <div>{{ result3_2 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr3_3"></div>
      <div>{{ result3_3 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr3_4"></div>
      <div>{{ result3_4 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr4_1"></div>
      <div>{{ result4_1 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr4_2"></div>
      <div>{{ result4_2 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr4_3"></div>
      <div>{{ result4_3 }}</div>
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
    <div class="p-4">
      <div v-html="expr10"></div>
      <div>{{ result10 }}</div>
    </div>
    <div class="p-4">
      <div v-html="expr11"></div>
      <div>{{ result11 }}</div>
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

let expr3_1 = 'arr2 | min'
let result3_1 = Jexl.evalSync(expr3_1, context)

let expr3_2 = 'arr2 | max'
let result3_2 = Jexl.evalSync(expr3_2, context)

let expr3_3 = 'arr2 | sum'
let result3_3 = Jexl.evalSync(expr3_3, context)

let expr3_4 = 'arr2 | avg'
let result3_4 = Jexl.evalSync(expr3_4, context)

let expr4_1 = '"123" | parseInt'
let result4_1 = Jexl.evalSync(expr4_1, context)

let expr4_2 = '"1.23" | parseFloat'
let result4_2 = Jexl.evalSync(expr4_2, context)

let expr4_3 = '1.2345 | toFix(2)'
let result4_3 = Jexl.evalSync(expr4_3, context)

let expr5 = 'arr1 | pluck("a") | sum'
let result5 = Jexl.evalSync(expr5, context)

let expr6 = 'obj2 | values'
let result6 = Jexl.evalSync(expr6, context)

let expr7 = "arr3 | dict('n')"
let result7 = Jexl.evalSync(expr7, context)

let expr8 = 'obj4 | merge(obj5)'
let result8 = Jexl.evalSync(expr8, context)

let expr10 = '"?abc=123&xyz=789" | querySearch'
let result10 = Jexl.evalSync(expr10, context)

let expr11 = '"123abc789" | replace("abc", "xyz")'
let result11 = Jexl.evalSync(expr11, context)
</script>
