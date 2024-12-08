<script setup lang="ts">
import { defineProps, computed, withDefaults, ref, watch, toRefs } from "vue";
import {
  VueToCounterProps,
  VueToCounterStringProps,
  VueToCounterStringPropsDefault,
} from "./types.ts";
import VueToCounter from "./VueToCounter.vue";

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
const { numberAdapter, stringAdapter } = toRefs(props);

const alphabet = ref("");
const replacedValue = computed(() =>
  props.value.replaceAll(" ", REPLACED_CHARS[" "])
);
watch(
  [replacedValue, stringAdapter],
  ([value, stringAdapterValue], [oldValue]) => {
    const charSet = new Set(
      stringAdapterValue
        .stringToChars(oldValue ?? "")
        .concat(stringAdapterValue.stringToChars(value ?? ""))
    );
    alphabet.value = [" "].concat(Array.from(charSet)).join("");
  },
  { immediate: true }
);

const digitToChar = computed(() => ({
  " ": REPLACED_CHARS[" "],
  ...props.digitToChar,
}));

const partDataOptions = computed<VueToCounterProps["partDataOptions"]>(() => ({
  ...props.partDataOptions,
  sampleToString: (value) => numberAdapter.value.toString(value),
}));
</script>

<template>
  <VueToCounter
    v-bind="props"
    :value="replacedValue"
    :alphabet="alphabet"
    :digit-to-char="digitToChar"
    :part-data-options="partDataOptions"
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
