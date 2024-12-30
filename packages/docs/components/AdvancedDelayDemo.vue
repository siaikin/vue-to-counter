<script setup>
import { ref } from "vue";

const number = ref(114514);

function switchNumber() {
  number.value = Math.floor(Math.random() * 1000000);
}

// #region increaseDelay
const delay = ref(0.1);
const increase = ref(false);
const animationOptions = ({ testResults }) => {
  if (!increase.value) return { delay: delay.value };

  let count = 0;
  return testResults.map((part) =>
    part.map(() => ({ delay: count++ * delay.value }))
  );
};
// #endregion increaseDelay
</script>

<template>
  <div class="text-center">
    <vue-to-counter-number
      :value="number"
      :animation-options="animationOptions"
    />
  </div>
  <hr />
  <div class="flex gap-4">
    <input class="border border-solid p-1" v-model="number" type="number" />
    <button class="border border-solid p-1" @click="switchNumber">切换</button>
  </div>
  <div class="flex gap-4 mt-4 items-center">
    <label class="inline-flex gap-1 border border-solid p-1">
      延时（s）：0
      <input v-model="delay" type="range" min="0" max="3" step="0.1" />
      {{ delay }}
    </label>
    <label class="inline-flex gap-1 border border-solid p-1">
      延迟递增：
      <input type="checkbox" v-model="increase" />
    </label>
  </div>
</template>

<style scoped></style>
