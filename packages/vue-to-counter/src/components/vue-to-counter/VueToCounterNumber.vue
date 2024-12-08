<script setup lang="ts">
import { toRefs, defineProps, computed, withDefaults, toRef } from "vue";
import {
  VueToCounterNumberProps,
  VueToCounterNumberPropsDefault,
  VueToCounterProps,
} from "./types.ts";
import { isString } from "lodash-es";
import { useLocale } from "./composables/use-locale.ts";
import VueToCounter from "./VueToCounter.vue";

const props = withDefaults(
  defineProps<VueToCounterNumberProps>(),
  VueToCounterNumberPropsDefault
);
const { localeNumber } = toRefs(props);

const locale = useLocale(toRef(props, "locale"));

const value = computed(() =>
  isString(props.value) ? Number.parseFloat(props.value) : props.value
);

const useLocalizedNumber = computed(() => !!localeNumber.value);
const intlNumberFormat = computed(
  () => new Intl.NumberFormat(locale.value, localeNumber.value)
);
const localDecimalSeparator = computed(
  () =>
    intlNumberFormat.value
      .formatToParts(3.14)
      .find((part) => part.type === "decimal")?.value || "."
);

const partDataOptions = computed<VueToCounterProps["partDataOptions"]>(() => ({
  ...props.partDataOptions,
  decimalSeparator: localDecimalSeparator.value,
  sampleToString: (value) =>
    useLocalizedNumber.value
      ? intlNumberFormat.value.format(value)
      : value.toString(10),
}));
</script>

<template>
  <VueToCounter
    v-bind="props"
    :value="value"
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
