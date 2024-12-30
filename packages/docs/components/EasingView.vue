<script setup>
import { computed, toRefs } from "vue";
import {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  anticipate,
  steps,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
} from "vue-to-counter";

const BuildInEasingFunction = {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  anticipate,
  steps,

  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
};

const props = defineProps({
  easing: String,
});
const { easing } = toRefs(props);

const easingFunction = computed(() => {
  const easingName = easing.value;
  let result = BuildInEasingFunction[easingName];

  {
    switch (easingName) {
      case "steps":
        result = result(4);
    }
  }

  return result;
});

const pathData = computed(() => {
  const easingFunctionValue = easingFunction.value;

  const points = Array.from({ length: 101 }, (_, i) => i / 100);
  return points
    .map((t, i) => {
      const x = t * 160;
      const y = 120 - easingFunctionValue(t) * 120;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
});
</script>

<template>
  <svg
    class="overflow-visible mt-2 w-32 border p-1"
    width="160"
    height="120"
    viewBox="0 0 160 120"
  >
    <defs>
      <linearGradient id="out" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ed556a"></stop>
        <stop offset="30%" stop-color="#ed556a"></stop>
        <stop offset="50%" stop-color="#7a7374"></stop>
        <stop offset="100%" stop-color="#7a7374"></stop>
      </linearGradient>
    </defs>
    <path :d="pathData" stroke="url(#out)" fill="none" stroke-width="3px" />
  </svg>
</template>

<style scoped></style>
