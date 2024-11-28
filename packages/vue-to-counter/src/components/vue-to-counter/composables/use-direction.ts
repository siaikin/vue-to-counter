import { computed, MaybeRefOrGetter, toValue } from "vue";

export function useDirection(
  differences: MaybeRefOrGetter<[number, number] | readonly [number, number]>
) {
  return computed(() => {
    const [start, end] = toValue(differences);

    return start > end ? "down" : "up";
  });
}
