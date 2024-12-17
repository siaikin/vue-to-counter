<script setup>
import { ref } from "vue";
import GoogleFontPicker from "./GoogleFontPicker.vue";

const number = ref(114514);

function switchNumber() {
  number.value = Math.floor(Math.random() * 1000000);
}

const color = ref(
  "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
);

const fontFamily = ref("");
</script>

<template>
  <div class="text-center">
    <vue-to-counter-number
      class="!text-8xl font-bold"
      :value="number"
      :color="color"
      locale-number
      :style="{ fontFamily: fontFamily }"
    />
  </div>
  <hr />
  <div class="flex gap-4">
    <input class="border border-solid p-1" v-model="number" type="number" />
    <button class="border border-solid p-1" @click="switchNumber">切换</button>
    <span class="flex-auto" />
    <input class="border border-solid p-1" v-model="color" type="color" />
  </div>
  <div class="flex gap-4 mt-4">
    <google-font-picker v-model="fontFamily" />
  </div>
</template>

<style scoped></style>
