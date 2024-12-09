import { computed, MaybeRefOrGetter, toValue } from "vue";
import { DurationPartMillisecond, DurationPartType } from "../types";

export function usePrecision(
  precision: MaybeRefOrGetter<
    DurationPartType | [DurationPartType, DurationPartType]
  >
) {
  const minPrecision = computed(() => {
    const precisionValue = toValue(precision);
    return Array.isArray(precisionValue) ? precisionValue[0] : precisionValue;
  });

  const maxPrecision = computed(() => {
    const precisionValue = toValue(precision);
    return Array.isArray(precisionValue)
      ? precisionValue[1]
      : DurationPartType.Day;
  });

  const availableDurationParts = computed(() =>
    Object.values(DurationPartType)
      .reverse()
      .map((type) => {
        const minPrecisionValue = toValue(minPrecision);
        const maxPrecisionValue = toValue(maxPrecision);
        const minPrecisionBreakpoint =
          DurationPartMillisecond[minPrecisionValue];
        const maxPrecisionBreakpoint =
          DurationPartMillisecond[maxPrecisionValue];
        const partMilliseconds = DurationPartMillisecond[type];
        return {
          type,
          available:
            partMilliseconds >= minPrecisionBreakpoint &&
            partMilliseconds <= maxPrecisionBreakpoint,
        };
      })
      .filter((part) => part.available)
  );

  return {
    min: minPrecision,
    max: maxPrecision,
    availableDurationParts,
  };
}
