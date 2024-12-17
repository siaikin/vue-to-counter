<script setup>
import { ref } from "vue";
import LocaleSelect from "./LocaleSelect.vue";

const from = ref("2024-12-01T00:00:00");
const to = ref("2024-12-31T00:00:00");

function switchDatetime() {
  [from.value, to.value] = [to.value, from.value];
}

const locale = ref(navigator.language);
</script>

<template>
  <div class="text-center">
    <vue-to-counter-datetime-duration :value="[from, to]" :locale="locale" />
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
    <span class="flex-auto" />
    <locale-select
      class="border border-solid p-1 appearance-auto"
      v-model="locale"
    />
  </div>
</template>

<style scoped></style>
