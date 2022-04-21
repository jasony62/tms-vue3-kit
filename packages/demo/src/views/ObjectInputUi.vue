<template>
  <div class="object-input">
    <tms-object-input :value="array" @add="arrayAdd">
      <template v-slot:default="lineProps">
        <input v-model="lineProps.line.number" />
      </template>
      <template v-slot:add>+ 添加</template>
      <template v-slot:empty>x 清空</template>
      <template v-slot:remove>删除</template>
      <template v-slot:moveup>上</template>
      <template v-slot:movedown>下</template>
    </tms-object-input>
    <tms-object-input :value="object" @add="objectAdd">
      <template v-slot:default="lineProps">
        <input v-model="lineProps.line.number" />
      </template>
      <template v-slot:add>+ 添加</template>
      <template v-slot:empty>x 清空</template>
      <template v-slot:moveup>上</template>
      <template v-slot:movedown>下</template>
    </tms-object-input>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ObjectInputUi',
  data() {
    return {
      array: [{ number: 1 }],
      object: [{ number: 1 }]
    }
  },
  methods: {
    arrayAdd(cbAdd: Function) {
      cbAdd({ number: Math.random() * 100 })
    },
    objectAdd(cbAdd: Function) {
      let random = Math.random() * 100
      cbAdd({ number: random })
    }
  }
}
</script>
