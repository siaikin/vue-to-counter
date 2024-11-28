import { computed, MaybeRefOrGetter, toValue } from "vue";
import { isString } from "lodash-es";

export function useLocale(
  locale: MaybeRefOrGetter<
    | Intl.UnicodeBCP47LocaleIdentifier
    | [Intl.UnicodeBCP47LocaleIdentifier, Intl.LocaleOptions]
  >
) {
  return computed(() => {
    const localeValue = toValue(locale);
    return isString(localeValue)
      ? new Intl.Locale(localeValue)
      : new Intl.Locale(...localeValue);
  });
}
