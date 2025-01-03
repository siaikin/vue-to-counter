<script setup>
import StackblitzLogo from "../assets/stackblitz-logo.svg";
import { ref, toRefs } from "vue";
import { getCodeStackblitzParams } from "./generate-stackblitz-params";
import sdk from "@stackblitz/sdk";
import packageInfo from "../../vue-to-counter/package.json";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
const { title } = toRefs(props);

const containerRef = ref();

function handleStackblitz() {
  if (!containerRef.value) return;

  const code = containerRef.value.querySelector("div.active code").textContent;
  const params = getCodeStackblitzParams(code, {
    title: `${title.value} - vue-to-counter@${packageInfo.version}`,
  });
  sdk.openProject(params, {
    openFile: "src/demo.vue",
  });
}
</script>

<template>
  <div ref="containerRef" class="demo-container">
    <div class="flex relative">
      <span class="flex-auto" />
      <span
        title="Open In Stackblitz"
        class="inline-block p-1 cursor-pointer hover:outline hover:outline-[#1389FD] outline-1"
        @click="handleStackblitz"
      >
        <img
          class="h-4 w-4 pointer-events-none"
          :src="StackblitzLogo"
          alt="CodeSandbox Logo"
        />
      </span>
    </div>
    <hr />
    <slot />
  </div>
</template>

<style lang="scss">
.demo-container {
  @apply flex flex-col justify-center border p-4 rounded-lg mt-4 text-sm;

  .vue-to-counter {
    @apply font-mono text-4xl;
  }

  .custom-block {
    @apply m-0;
  }
}
</style>
