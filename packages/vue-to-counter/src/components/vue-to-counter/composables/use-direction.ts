import { computed, MaybeRefOrGetter, toValue } from "vue";
import { NumberAdapter } from "../../../number-adapter";

export function useDirection<NS extends NumberAdapter>(
  numberAdapter: MaybeRefOrGetter<NS>,
  differences: MaybeRefOrGetter<[number, number] | readonly [number, number]>
) {
  return computed(() => {
    const numberAdapterValue = toValue(numberAdapter);
    const [start, end] = toValue(differences);

    return numberAdapterValue.gt(start, end) ? "down" : "up";
  });
}
