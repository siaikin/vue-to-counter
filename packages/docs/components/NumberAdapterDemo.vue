<script setup>
import { ref, watch } from "vue";
import {
  BuildInBigintAdapter,
  BuildInNumberAdapter,
  DecimalJsAdapter,
} from "vue-to-counter";

const number = ref(Number.MAX_SAFE_INTEGER.toString(10));

const adapters = [
  { label: "BuildInNumberAdapter", adapter: BuildInNumberAdapter() },
  { label: "BuildInBigintAdapter", adapter: BuildInBigintAdapter() },
  { label: "DecimalJsAdapter", adapter: DecimalJsAdapter() },
];
const adapterIndex = ref(0);

const realRenderNumber = ref();
watch([number, adapterIndex], () => (realRenderNumber.value = number.value), {
  immediate: true,
});
function handleAnimationEnd({ direction, data }) {
  realRenderNumber.value = data
    .map(({ digits }) =>
      digits.map(({ data }) => data[direction === "up" ? data.length - 1 : 0])
    )
    .flat()
    .join("");
}

function handleInput(e) {
  number.value = e.target.value
    .split("")
    .filter((c) => (c >= "0" && c <= "9") || c === "-" || c === ".")
    .join("");
}
</script>

<template>
  <div class="text-center">
    <vue-to-counter-number
      :value="number"
      :number-adapter="adapters[adapterIndex].adapter"
      @roll-animation-end="handleAnimationEnd"
    />
  </div>
  <div
    v-if="realRenderNumber !== number"
    class="bg-[var(--vp-c-danger-soft)] p-2 rounded mt-4"
  >
    Mismatch: should be
    <span class="text-[var(--vp-c-danger-1)]">{{ number }}</span> but rendered
    as <span class="text-[var(--vp-c-danger-1)]">{{ realRenderNumber }}</span>
  </div>
  <hr />
  <div class="flex gap-4">
    <textarea
      class="flex-auto border border-solid p-1"
      @input="handleInput"
      :value="number"
    />
    <button class="self-start border border-solid p-1" @click="switchNumber">
      切换
    </button>
    <select
      v-model="adapterIndex"
      class="self-start border border-solid p-1 appearance-auto"
    >
      <option v-for="(adapter, index) in adapters" :key="index" :value="index">
        {{ adapter.label }}
      </option>
    </select>
  </div>
</template>

<style scoped></style>
