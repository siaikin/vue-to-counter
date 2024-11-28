<script setup lang="ts">
import {
  toRefs,
  defineProps,
  computed,
  withDefaults,
  toValue,
  ref,
  toRef,
} from "vue";
import { iso8601Duration } from "./utils/iso8601-duration.ts";
import {
  DurationPartMillisecond,
  VueToCounterDatetimeDurationProps,
  VueToCounterDatetimeDurationPropsDefault,
} from "./types.ts";
import { duration as genDuration, durationObject } from "./utils/duration.ts";
import { usePrecision } from "./composables/use-precision.ts";
import { useDifference } from "./composables/use-difference.ts";
import CounterRoller from "./CounterRoller.vue";
import { useLocalizedDateTimeFields } from "./composables/use-localized-date-time-fields.ts";
import { isDate, toDate } from "date-fns";
import { usePartData } from "./composables/use-part-data.ts";
import { useLocale } from "./composables/use-locale.ts";
import { useDirection } from "./composables/use-direction.ts";

const props = withDefaults(
  defineProps<VueToCounterDatetimeDurationProps>(),
  VueToCounterDatetimeDurationPropsDefault
);
const { duration, color, precision } = toRefs(props);

const locale = useLocale(toRef(props, "locale"));

const from = computed(() =>
  isDate(props.value[0]) ? props.value[0] : toDate(props.value[0])
);
const to = computed(() =>
  isDate(props.value[1]) ? props.value[1] : toDate(props.value[1])
);

const { min, availableDurationParts } = usePrecision(precision);

// 最小精度的毫秒值
const minPrecisionMs = computed(() => DurationPartMillisecond[toValue(min)]);

const dateTimeFieldLabels = useLocalizedDateTimeFields(locale);

// 根据最小精度对 from 进行优化. 避免频繁更新
const optimizedFrom = computed(() => {
  const minPrecisionMsValue = toValue(minPrecisionMs);
  const fromValue = toValue(from).getTime();
  return (
    Math.floor(fromValue / minPrecisionMsValue) * minPrecisionMsValue +
    // 加上 deadlineDate 的余数, 消除精度误差.
    (toValue(to).getTime() % minPrecisionMsValue)
  );
});

const durationInMilliseconds = useDifference(
  computed(() => toValue(optimizedFrom)),
  computed(() => toValue(to).getTime())
);

const direction = useDirection(durationInMilliseconds);

const availableDurationPartTypes = computed(() =>
  toValue(availableDurationParts).map((part) => part.type)
);

const durationPartData = usePartData({
  value: durationInMilliseconds,
  onSamplePost: (samples) => {
    const toTimeValue = toValue(to).getDate();
    const availableDurationPartTypesValue = toValue(availableDurationPartTypes);

    const tempParts = availableDurationPartTypesValue.map(() => [] as number[]);
    for (const n of samples) {
      /**
       * 计算并保存每个在 {@link precision} 范围内的时间部分的值
       */
      const availablePartValues = genDuration(
        new Date(Math.min(n, toTimeValue)),
        new Date(Math.max(n, toTimeValue)),
        availableDurationPartTypesValue
      );
      availablePartValues.forEach((value, i) => tempParts[i].push(value));
    }

    return tempParts;
  },
});

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time#datetime
 */
const datetimeAttribute = computed(() => {
  const toTimeValue = toValue(to).getTime();
  const [durationInMillisecondsValue] = toValue(durationInMilliseconds);
  const availableDurationPartTypesValue = toValue(availableDurationPartTypes);
  return iso8601Duration(
    durationObject(
      new Date(Math.min(durationInMillisecondsValue, toTimeValue)),
      new Date(Math.max(durationInMillisecondsValue, toTimeValue)),
      availableDurationPartTypesValue
    )
  );
});

const backgroundClippedPartContainer = ref<HTMLTimeElement>();
</script>

<template>
  <time
    ref="backgroundClippedPartContainer"
    class="counter-mask"
    :datetime="datetimeAttribute"
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
      <template #partSuffix="{ index }">
        <span :style="{ fontSize: '0.4em' }">
          {{ dateTimeFieldLabels[availableDurationPartTypes[index]] }}
        </span>
      </template>
    </CounterRoller>
  </time>
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
