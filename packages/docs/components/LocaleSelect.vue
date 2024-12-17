<script setup>
const value = defineModel("modelValue");
</script>

<template>
  <select class="border border-solid p-1 appearance-auto" v-model="value">
    <optgroup label="中文">
      <option value="zh-CN">zh-CN</option>
      <option value="zh-HK">zh-HK</option>
      <option value="zh-TW">zh-TW</option>
    </optgroup>
    <optgroup label="English">
      <option value="en-US">en-US</option>
      <option value="en-GB">en-GB</option>
    </optgroup>
    <option value="ja-JP">ja-JP</option>
    <option value="ko-KR">ko-KR</option>
    <option value="de-DE">de-DE</option>
    <option value="fr-FR">fr-FR</option>
  </select>
</template>

<style scoped></style>
