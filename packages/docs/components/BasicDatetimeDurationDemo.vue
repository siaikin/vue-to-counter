<script setup>
import { ref } from "vue";

const from = ref("2024-12-01T00:00:00");
const to = ref("2024-12-31T00:00:00");

function switchDatetime() {
  [from.value, to.value] = [to.value, from.value];
}
</script>

<template>
  <div class="text-center">
    <vue-to-counter-datetime-duration :value="[from, to]" />
  </div>
  <hr />
  <div class="flex gap-4">
    <div>
      <input
        class="border border-solid p-1"
        v-model="from"
        type="datetime-local"
      />
      ~
      <input
        class="border border-solid p-1"
        v-model="to"
        type="datetime-local"
      />
    </div>
    <button class="border border-solid p-1" @click="switchDatetime">
      切换
    </button>
  </div>
</template>

<style scoped></style>
