<script setup>
import CodeSandboxLogo from "../assets/CodeSandboxLogo.svg";
import { ref, toRefs } from "vue";
import { getCodeSandboxParams } from "./generate-codesandbox-params";
import packageInfo from "../../vue-to-counter/package.json";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
const { title } = toRefs(props);

const containerRef = ref();

function handleCodeSandbox() {
  if (!containerRef.value) return;

  const code = containerRef.value.querySelector("div.active code").textContent;
  const params = getCodeSandboxParams(code, {
    title: `${title.value} - vue-to-counter@${packageInfo.version}`,
  });
  const div = document.createElement("div");
  div.style.display = "none";
  div.innerHTML = `<form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
        <input type="hidden" name="parameters" value="${params}" />
        <input type="submit" value="Open in sandbox" />
      </form>`;
  document.body.appendChild(div);
  div.firstElementChild.submit();
  document.body.removeChild(div);
}
</script>

<template>
  <div ref="containerRef" class="demo-container">
    <div class="flex relative">
      <span class="flex-auto" />
      <span
        title="Open In CodeSandbox"
        class="inline-block p-1 cursor-pointer hover:scale-110"
        @click="handleCodeSandbox"
      >
        <img class="h-4" :src="CodeSandboxLogo" alt="CodeSandbox Logo" />
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
