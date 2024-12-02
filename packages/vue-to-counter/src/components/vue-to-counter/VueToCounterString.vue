<script setup lang="ts">
import { defineProps, computed, withDefaults, ref, watch } from "vue";
import {
  VueToCounterStringProps,
  VueToCounterStringPropsDefault,
} from "./types.ts";
import VueToCounter from "./VueToCounter.vue";
import { replace } from "lodash-es";

/**
 * 替换一些特定的字符.
 * 1. " ": 空格字符在 HTML 中会被忽略导致无法计算字符宽度, 使用 \xa0 替换.
 */
const REPLACED_CHARS: Record<string, string> = {
  " ": "\xa0", // &nbsp;
};

const props = withDefaults(
  defineProps<VueToCounterStringProps>(),
  VueToCounterStringPropsDefault
);

const alphabet = ref("");
const replacedValue = computed(() =>
  replace(props.value, " ", REPLACED_CHARS[" "])
);
watch(
  replacedValue,
  (value, oldValue) => {
    const charSet = new Set(
      (oldValue ?? "").split("").concat((value ?? "").split(""))
    );
    alphabet.value = [" "].concat(Array.from(charSet)).join("");
  },
  { immediate: true }
);

const digitToChar = computed(() => ({
  0: REPLACED_CHARS[" "],
  ...props.digitToChar,
}));
</script>

<template>
  <VueToCounter
    v-bind="props"
    :value="replacedValue"
    :alphabet="alphabet"
    :digit-to-char="digitToChar"
  >
    <template #prefix>
      <slot name="prefix" />
    </template>
    <template #suffix>
      <slot name="suffix" />
    </template>
  </VueToCounter>
</template>

<style lang="scss" scoped></style>
