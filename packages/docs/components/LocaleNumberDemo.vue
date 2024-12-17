<script setup>
import { ref } from "vue";
import LocaleSelect from "./LocaleSelect.vue";

const number = ref(114514);

function switchNumber() {
  number.value = Math.floor(Math.random() * 1000000);
}

const locale = ref(navigator.language);
</script>

<template>
  <div class="text-center">
    <vue-to-counter-number :value="number" :locale="locale" locale-number />
  </div>
  <hr />
  <div class="flex gap-4">
    <input class="border border-solid p-1" v-model="number" type="number" />
    <button class="border border-solid p-1" @click="switchNumber">切换</button>
    <span class="flex-auto" />
    <locale-select
      class="border border-solid p-1 appearance-auto"
      v-model="locale"
    />
  </div>
</template>

<style scoped></style>
