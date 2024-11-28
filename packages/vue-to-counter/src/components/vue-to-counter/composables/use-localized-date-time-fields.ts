import { computed, MaybeRefOrGetter, toValue } from "vue";
import { getLocalizedDateTimeFields } from "../utils/localized-date-time-fields";

export function useLocalizedDateTimeFields(
  locale: MaybeRefOrGetter<Intl.Locale>
) {
  return computed(() => getLocalizedDateTimeFields(toValue(locale)));
}
