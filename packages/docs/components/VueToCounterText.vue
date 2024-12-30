<script setup>
import { useData } from "vitepress";

const { site } = useData();

const animationOptions = ({ testResults }) => {
  let count = 0;

  return testResults.map((part) =>
    part.map((digit) => {
      if (!digit.animate) return;
      const delay = count++ * 0.1 * 0.125;

      return {
        repeat: Infinity,
        duration: 8,
        times: [0, delay, 0.125 + delay, 1],
      };
    })
  );
};

const keyframes = ({ testResults, direction }) => {
  return testResults.map((part) =>
    part.map((digit) => {
      if (!digit.animate) return;
      return {
        up: {
          transform: [
            "translateY(0)",
            "translateY(0)",
            "translateY(-100%)",
            "translateY(-100%)",
          ],
        },
        down: {
          transform: [
            "translateY(0)",
            "translateY(0)",
            "translateY(100%)",
            "translateY(100%)",
          ],
        },
      }[direction];
    })
  );
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
    :keyframes="keyframes"
  />
</template>

<style scoped></style>
