import { defineComponent, computed, toRef } from "vue";
import { useLocale } from "./composables/use-locale";
import { toRefs } from "@vueuse/core";
import { VueToCounterBaseSlots, VueToCounterNumberProps } from "./types-props";
import VueToCounter from "./VueToCounter";
import { isString } from "lodash-es";
import { VueToCounterProps } from "./types";

export default defineComponent({
  name: "VueToCounterNumber",
  props: VueToCounterNumberProps(),
  slots: VueToCounterBaseSlots,
  setup: (props, { attrs, slots }) => {
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

    const partDataOptions = computed<VueToCounterProps["partDataOptions"]>(
      () => ({
        ...props.partDataOptions,
        decimalSeparator: localDecimalSeparator.value,
        sampleToString: (value) =>
          useLocalizedNumber.value
            ? intlNumberFormat.value.format(value)
            : value.toString(10),
      })
    );

    return () => (
      <VueToCounter
        {...props}
        {...attrs}
        value={value.value}
        partDataOptions={partDataOptions.value}
      >
        {{ ...slots }}
      </VueToCounter>
    );
  },
});
