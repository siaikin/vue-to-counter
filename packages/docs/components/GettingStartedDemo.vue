<script setup>
import { ref } from "vue";

const userCount = ref(1000);
setInterval(() => (userCount.value += Math.floor(Math.random() * 10)), 1100);
</script>

<template>
  <vue-to-counter-number
    class="font-mono font-bold self-center"
    :value="userCount"
    color="black"
  />
</template>

<style scoped></style>
