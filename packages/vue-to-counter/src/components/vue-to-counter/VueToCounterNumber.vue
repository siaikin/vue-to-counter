<script setup lang="ts">
import {
  toRefs,
  defineProps,
  computed,
  withDefaults,
  ref,
  toRef,
  watch,
} from "vue";
import {
  VueToCounterNumberProps,
  VueToCounterNumberPropsDefault,
} from "./types.ts";
import CounterRoller from "./CounterRoller.vue";
import { isString } from "lodash-es";
import { useLocale } from "./composables/use-locale.ts";
import { useDirection } from "./composables/use-direction.ts";
import { usePartData } from "./composables/use-part-data.ts";

const props = withDefaults(
  defineProps<VueToCounterNumberProps>(),
  VueToCounterNumberPropsDefault
);
const { duration, color, localeNumber, minPlaces } = toRefs(props);

const locale = useLocale(toRef(props, "locale"));

const value = computed(() =>
  isString(props.value) ? Number.parseFloat(props.value) : props.value
);

const numberDifferences = ref<[number, number]>([0, 0]);
watch(
  value,
  (value, oldValue) => {
    numberDifferences.value = [value, oldValue ?? value] as const;
  },
  { immediate: true }
);

const direction = useDirection(numberDifferences);

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
const durationPartData = usePartData({
  value: numberDifferences,
  onSamplePost: (samples) => [samples.slice()],
  transformToString: (value) =>
    useLocalizedNumber.value
      ? intlNumberFormat.value.format(value)
      : value.toString(10),
  decimalSeparator: localDecimalSeparator,
  minPlaces,
  // digitToCharMap: {
  //   0: "零",
  //   1: "一",
  //   2: "二",
  //   3: "三",
  //   4: "四",
  //   5: "五",
  //   6: "六",
  //   7: "七",
  //   8: "八",
  //   9: "九",
  // },
});

const backgroundClippedPartContainer = ref<HTMLTimeElement>();
</script>

<template>
  <span
    ref="backgroundClippedPartContainer"
    class="counter-mask"
    :class="{
      debug: debug,
    }"
  >
    <CounterRoller
      :container="backgroundClippedPartContainer"
      :data="durationPartData"
      :duration="duration"
      :locale="locale"
      :color="color"
      :direction="direction"
    >
      <template #prefix>
        <slot name="prefix" />
      </template>
      <template #suffix>
        <slot name="suffix" />
      </template>
    </CounterRoller>
  </span>
</template>

<style lang="scss" scoped>
.counter-mask {
  //mask: linear-gradient(
  //    to bottom,
  //    transparent,
  //    black 16px calc(100% - 16px),
  //    transparent
  //  ),
  //  linear-gradient(
  //    to right,
  //    transparent,
  //    black 16px calc(100% - 16px),
  //    transparent
  //  );
  //mask-composite: intersect;

  @apply inline-block relative overflow-hidden;
}

.debug {
  &.counter-mask {
    @apply overflow-visible;
  }
}

.time-mask {
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}
</style>
