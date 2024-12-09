import { defineComponent, computed, toRef, toValue } from "vue";
import { iso8601Duration } from "./utils/iso8601-duration";
import { durationObject } from "./utils/duration";
import { usePrecision } from "./composables/use-precision";
import { useLocalizedDateTimeFields } from "./composables/use-localized-date-time-fields";
import { isDate, toDate } from "date-fns";
import { useLocale } from "./composables/use-locale";
import { duration as genDuration } from "./utils/duration";
import { toRefs } from "@vueuse/core";
import {
  DurationPartMillisecond,
  VueToCounterBaseSlots,
  VueToCounterDatetimeDurationProps,
} from "./types-props";
import VueToCounter from "./VueToCounter";
import { PartDataOptions } from "./composables/use-part-data";

export default defineComponent({
  name: "VueToCounterDatetimeDuration",
  props: VueToCounterDatetimeDurationProps(),
  slots: VueToCounterBaseSlots,
  setup: (props, { attrs, slots }) => {
    const { precision } = toRefs(props);

    const locale = useLocale(toRef(props, "locale"));

    const from = computed(() =>
      isDate(props.value[0]) ? props.value[0] : toDate(props.value[0])
    );
    const to = computed(() =>
      isDate(props.value[1]) ? props.value[1] : toDate(props.value[1])
    );

    const { min, availableDurationParts } = usePrecision(precision);

    // 最小精度的毫秒值
    const minPrecisionMs = computed(
      () => DurationPartMillisecond[toValue(min)]
    );

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

    const fromToDuration = computed(
      () => toValue(to).getTime() - toValue(optimizedFrom)
    );

    const availableDurationPartTypes = computed(() =>
      toValue(availableDurationParts).map((part) => part.type)
    );

    const partDataOptions = computed<
      Partial<
        Pick<
          PartDataOptions,
          "sampleToString" | "sampleCount" | "sampleSplit" | "decimalSeparator"
        >
      >
    >(() => ({
      ...props.partDataOptions,
      sampleSplit: (samples) => {
        const toTimeValue = toValue(to).getDate();
        const availableDurationPartTypesValue = toValue(
          availableDurationPartTypes
        );

        const tempParts = availableDurationPartTypesValue.map(
          () => [] as number[]
        );
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
    }));

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time#datetime
     */
    const datetimeAttribute = computed(() => {
      const toTimeValue = toValue(to).getTime();
      const fromToDurationValue = toValue(fromToDuration);
      const availableDurationPartTypesValue = toValue(
        availableDurationPartTypes
      );
      return iso8601Duration(
        durationObject(
          new Date(Math.min(fromToDurationValue, toTimeValue)),
          new Date(Math.max(fromToDurationValue, toTimeValue)),
          availableDurationPartTypesValue
        )
      );
    });

    return () => (
      <VueToCounter
        {...props}
        {...{
          ...attrs,
          datetime: datetimeAttribute.value,
        }}
        value={optimizedFrom.value}
        partDataOptions={partDataOptions.value}
        tag={"time"}
      >
        {{
          ...slots,
          partSuffix: ({ index }: { index: number }) => (
            <span style="font-size: 0.4em">
              {
                dateTimeFieldLabels.value[
                  availableDurationPartTypes.value[index]
                ]
              }
            </span>
          ),
        }}
      </VueToCounter>
    );
  },
});
