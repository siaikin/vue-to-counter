<script setup>
import { ref } from "vue";

const number = ref(114514);

function switchNumber() {
  number.value = Math.floor(Math.random() * 1000000);
}
</script>

<template>
  <div class="text-center">
    <vue-to-counter-number :value="number" />
  </div>
  <hr />
  <div class="flex gap-4">
    <input class="border border-solid p-1" v-model="number" />
    <button class="border border-solid p-1" @click="switchNumber">切换</button>
  </div>
</template>

<style scoped></style>
