<script setup>
import { ref, watch } from "vue";
import {
  BuildInStringAdapter,
  BuildInIntlSegmenterAdapter,
  GraphemeSplitterAdapter,
} from "vue-to-counter";

const string = ref("emoji 🎉 🧑‍💻");

const adapters = [
  { label: "BuildInStringAdapter", adapter: BuildInStringAdapter() },
  {
    label: "BuildInIntlSegmenterAdapter",
    adapter: BuildInIntlSegmenterAdapter(),
  },
  { label: "GraphemeSplitterAdapter", adapter: GraphemeSplitterAdapter() },
];
const adapterIndex = ref(0);

const realRenderString = ref();
watch([string, adapterIndex], () => (realRenderString.value = string.value), {
  immediate: true,
});
function handleAnimationEnd({ direction, data }) {
  realRenderString.value = data
    .map(({ digits }) =>
      digits.map(({ data }) => data[direction === "up" ? data.length - 1 : 0])
    )
    .flat()
    .join("");
}
</script>

<template>
  <div class="text-center">
    <vue-to-counter-string
      :value="string"
      :string-adapter="adapters[adapterIndex].adapter"
      @roll-animation-end="handleAnimationEnd"
    />
  </div>
  <div
    v-if="realRenderString !== string"
    class="bg-[var(--vp-c-danger-soft)] p-2 rounded mt-4"
  >
    Mismatch: should be
    <span class="text-[var(--vp-c-danger-1)]">{{ string }}</span> but rendered
    as <span class="text-[var(--vp-c-danger-1)]">{{ realRenderString }}</span>
  </div>
  <hr />
  <div class="flex gap-4">
    <textarea class="flex-auto border border-solid p-1" v-model="string" />
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
