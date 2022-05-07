<template>
  <div class="layout-ui">
    <h3>Flex</h3>
    <tms-flex direction="column">
      <div v-for="(s, i) in arr" :key="i">{{ s }}</div>
    </tms-flex>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let arr = ref(['aaa', 'bbb', 'cc'])
</script>