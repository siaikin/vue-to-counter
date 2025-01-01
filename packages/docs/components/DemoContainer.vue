<script setup></script>

<template>
  <div class="demo-container">
    <slot />
  </div>
</template>

<style lang="scss">
.demo-container {
  @apply flex flex-col justify-center border p-4 rounded-lg mt-4 text-sm;

  .vue-to-counter {
    @apply font-mono text-4xl;
  }
}
</style>
