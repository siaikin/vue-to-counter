<script setup>
import { onMounted, ref } from "vue";

const userCount = ref(1000);
onMounted(() => {
  setInterval(() => (userCount.value += Math.floor(Math.random() * 10)), 1100);
});
</script>

<template>
  <vue-to-counter-number
    class="font-mono font-bold self-center"
    :value="userCount"
  />
</template>

<style scoped></style>
