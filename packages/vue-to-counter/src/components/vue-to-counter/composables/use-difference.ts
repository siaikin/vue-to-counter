import { computed, MaybeRefOrGetter, toValue } from "vue";
import { usePrevious } from "@vueuse/core";

/**
 * @param from
 * @param to
 * @returns [new, old]
 */
export function useDifference(
  from: MaybeRefOrGetter<number>,
  to: MaybeRefOrGetter<number>
) {
  const previousFrom = usePrevious(from, toValue(from));
  const previousTo = usePrevious(to, toValue(to));

  return computed(() => {
    const fromValue = toValue(from);
    const previousFromValue = previousFrom.value;
    const _toValue = toValue(to);
    const previousToValue = previousTo.value;

    return [
      Math.abs(_toValue - fromValue),
      Math.abs(previousToValue - previousFromValue),
    ] as [number, number];
  });
}
