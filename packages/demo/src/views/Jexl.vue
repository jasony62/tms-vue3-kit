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
  </div>
</template>

<script setup lang="ts">
import { Jexl } from 'tms-data-aid'

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

let expr1 = 'obj1.a'
let result1 = Jexl.evalSync(expr1, context)

let expr2 = 'arr1 | pluck("a")'
let result2 = Jexl.evalSync(expr2, context)

</script>