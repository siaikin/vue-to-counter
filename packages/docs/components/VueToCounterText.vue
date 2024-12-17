<script setup>
import { useData } from "vitepress";

const { site } = useData();

const animationOptions = {
  iterations: Infinity,
  duration: 8000,
  keyframe: ({ testResults, direction }) => {
    let count = 0;

    return testResults.map((part) =>
      part.map((digit) => {
        if (!digit.animate) return;
        const delay = count++ * 0.1 * 0.125;
        return {
          up: {
            transform: ["translateY(0)", "translateY(0)", "translateY(-100%)"],
            offset: [0, delay, 0.125 + delay, 1],
          },
          down: {
            transform: ["translateY(0)", "translateY(0)", "translateY(100%)"],
            offset: [0, delay, 0.125 + delay, 1],
          },
        }[direction];
      })
    );
  },
};
</script>

<template>
  <VueToCounterString
    class="clip"
    :style="{ fontFamily: 'var(--vp-font-family-mono)' }"
    color="linear-gradient(120deg, #ed556a, #7a7374)"
    :value="site.title"
    :initial-value="site.title.replace(/./g, ' ')"
    :part-data-options="{ sampleCount: 2 }"
    :animation-options="animationOptions"
  />
</template>

<style scoped></style>
