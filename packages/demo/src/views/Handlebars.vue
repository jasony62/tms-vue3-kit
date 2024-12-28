<template>
  <div>
    <p>演示Handlebars使用</p>
    <div class="p-4">
      <div>数据</div>
      <div v-html="strContext"></div>
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
    <div class="p-4">
      <div v-html="tpl4"></div>
      <div>{{ result4 }}</div>
    </div>
    <div class="p-4">
      <div v-html="tpl5"></div>
      <div>{{ result5 }}</div>
    </div>
    <div class="p-4">
      <div v-html="tpl6"></div>
      <div>{{ result6 }}</div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { Handlebars } from 'tms-data-aid'
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

let tpl1 = '{{{stringify ( extend obj1 b=2 c=3 ) }}}'

let template1 = Handlebars.compile(tpl1)
let result1 = template1(context)


let tpl2 = '{{#forIn obj2}} {{@key}}:{{this}} {{/forIn}}'

let template2 = Handlebars.compile(tpl2)
let result2 = template2(context)


let tpl3 = '{{{stringify (pick (split "x,y") obj2)}}}'

let template3 = Handlebars.compile(tpl3)
let result3 = template3(context)


let tpl4 = '{{{stringify (pluck arr1 "a")}}}'

let template4 = Handlebars.compile(tpl4)
let result4 = template4(context)

let tpl5 = '{{#if (eq obj1.a obj2.x)}}相等{{else}}不相等{{/if}}'

let template5 = Handlebars.compile(tpl5)
let result5 = template5(context)

let tpl6 = 'max: {{max arr2}} min: {{min arr2}} avg: {{avg arr2}} sum: {{sum arr2}}'

let template6 = Handlebars.compile(tpl6)
let result6 = template6(context)
</script>