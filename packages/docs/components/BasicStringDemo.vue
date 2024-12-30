<script setup>
import { ref } from "vue";

const string = ref("Hello, World!");

const strings = [
  "Hello, World!",
  "你好，世界！",
  "こんにちは、世界！",
  "안녕하세요, 세계!",
  // 太长了
  // "Bonjour, le monde!",
  "Hallo, Welt!",
  "Ciao, mondo!",
  "Olá, mundo!",
  "Привет, мир!",
  "¡Hola, mundo!",
  "Hej, världen!",
  "Merhaba, Dünya!",
  "مرحبا بالعالم!",
  "שלום, עולם!",
  "नमस्ते, दुनिया!",
  "سلام دنیا!",
];
let stringIndex = 0;
function switchString() {
  stringIndex = (stringIndex + 1) % strings.length;
  string.value = strings[stringIndex];
}
</script>

<template>
  <div class="text-center">
    <vue-to-counter-string :value="string" />
  </div>
  <hr />
  <div class="flex gap-4">
    <input class="border border-solid p-1" v-model="string" />
    <button class="border border-solid p-1" @click="switchString">切换</button>
  </div>
</template>

<style scoped></style>
