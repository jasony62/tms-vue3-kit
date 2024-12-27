<template>
  <div>
    <p>演示handlebars使用</p>
    <div class="p-4">
      <div>数据</div>
      <div v-html="context"></div>
    </div>
    <div class="p-4">
      <div v-html="tpl1"></div>
      <div>{{ result1 }}</div>
    </div>
    <div class="p-4">
      <div v-html="tpl2"></div>
      <div>{{ result2 }}</div>
    </div>
    <div class="p-4">
      <div v-html="tpl3"></div>
      <div>{{ result3 }}</div>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { Handlebars } from 'tms-data-aid'
const obj1 = { a: 1 }
let obj2 = { x: 1, y: 2, z: 3 }

let context = JSON.stringify({
  obj1,
  obj2
})

let tpl1 = '{{{stringify ( extend obj1 b=2 c=3 ) }}}'

let template1 = Handlebars.compile(tpl1)
let result1 = template1({ obj1, obj2 })


let tpl2 = '{{#forIn obj2}} {{@key}}:{{this}} {{/forIn}}'

let template2 = Handlebars.compile(tpl2)
let result2 = template2({ obj1, obj2 })


let tpl3 = '{{{stringify (pick (split "x,y") obj2)}}}'

let template3 = Handlebars.compile(tpl3)
let result3 = template3({ obj1, obj2 })

</script>