<script setup lang="ts">
import { ref } from "vue";

const debug = ref(true);
const from = ref("2024-12-01T00:00:00");
const to = ref("2024-12-31T00:00:00");
const duration = ref(1);
const color = ref(
  "linear-gradient(135deg, rgba(30,87,153,0) 0%,rgba(30,87,153,0.8) 15%,rgba(30,87,153,1) 19%,rgba(30,87,153,1) 20%,rgba(41,137,216,1) 50%,rgba(30,87,153,1) 80%,rgba(30,87,153,1) 81%,rgba(30,87,153,0.8) 85%,rgba(30,87,153,0) 100%)"
);
const locale = ref("zh-CN");
const prefix = ref("Remaining");
const suffix = ref("!");
</script>

<template>
  <div class="w-full mt-16 flex flex-col justify-center items-center">
    <VueToCounterDatetimeDuration
      class="text-7xl bg-gray-300"
      :value="[from, to]"
      :duration="duration"
      :debug="debug"
      :color="color"
      :locale="locale"
      :animation-options="{ duration }"
    >
      <template #prefix>{{ prefix }}</template>
      <template #suffix>{{ suffix }}</template>
    </VueToCounterDatetimeDuration>

    <div class="flex flex-col mt-4 border w-96 p-2">
      <label class="border-b p-1">
        debug:
        <input type="checkbox" v-model="debug" />
      </label>
      <fieldset class="flex flex-col border">
        <legend>datetime</legend>
        <label class="border-b p-1">
          from:
          <input type="datetime-local" v-model="from" />
        </label>
        <label class="border-b p-1">
          to:
          <input type="datetime-local" v-model="to" />
        </label>
        <label class="p-1">
          duration:
          <input type="number" v-model="duration" :step="0.1" :min="0" />
        </label>
      </fieldset>
      <fieldset class="flex flex-col border">
        <legend>color</legend>
        <label class="border-b p-1">
          gradient:
          <textarea v-model="color" class="w-full" rows="5"></textarea>
        </label>
        <a
          class="text-blue-600"
          href="https://www.colorzilla.com/gradient-editor/"
          target="_blank"
        >
          Gradient Generator
        </a>
      </fieldset>
      <fieldset class="flex flex-col border">
        <legend>slot</legend>
        <label class="border-b p-1">
          prefix:
          <input type="text" v-model="prefix" />
        </label>
        <label class="p-1">
          suffix:
          <input type="text" v-model="suffix" />
        </label>
      </fieldset>
      <label class="border-b p-1">
        locale:
        <select v-model="locale">
          <optgroup label="CN">
            <option value="zh-CN">zh-CN</option>
            <option value="zh-HK">zh-HK</option>
            <option value="zh-TW">zh-TW</option>
          </optgroup>
          <optgroup label="EN">
            <option value="en-US">en-US</option>
            <option value="en-GB">en-GB</option>
          </optgroup>
          <option value="ja-JP">ja-JP</option>
          <option value="ko-KR">ko-KR</option>
          <option value="de-DE">de-DE</option>
          <option value="fr-FR">fr-FR</option>
        </select>
      </label>
    </div>
  </div>
</template>

<style scoped></style>
