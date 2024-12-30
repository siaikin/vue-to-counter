import { defineComponent, computed, toRef, ExtractPropTypes } from "vue";
import { useLocale } from "./composables/use-locale";
import { reactiveOmit, toRefs } from "@vueuse/core";
import {
  VueToCounterBaseEmits,
  VueToCounterBaseSlots,
  VueToCounterNumberProps,
  VueToCounterPropsReturn,
} from "./types";
import VueToCounter from "./VueToCounter";
import { isBoolean } from "lodash-es";
import { useEventBus } from "./composables/use-event-bus";

export default defineComponent({
  name: "VueToCounterNumber",
  props: VueToCounterNumberProps(),
  slots: VueToCounterBaseSlots,
  emits: VueToCounterBaseEmits,
  setup: (props, { attrs, slots, emit }) => {
    const { localeNumber, numberAdapter } = toRefs(props);

    const locale = useLocale(toRef(props, "locale"));

    const value = computed(() => numberAdapter.value.create(props.value));

    const useLocalizedNumber = computed(() => !!localeNumber.value);
    const intlNumberFormat = computed(
      () =>
        new Intl.NumberFormat(
          locale.value,
          isBoolean(localeNumber.value) ? {} : localeNumber.value
        )
    );
    const localDecimalSeparator = computed(
      () =>
        intlNumberFormat.value
          .formatToParts(3.14)
          .find((part) => part.type === "decimal")?.value || "."
    );

    const partDataOptions = computed<
      ExtractPropTypes<typeof VueToCounterPropsReturn>["partDataOptions"]
    >(() => ({
      ...props.partDataOptions,
      decimalSeparator: localDecimalSeparator.value,
      sampleToString: (value) =>
        useLocalizedNumber.value
          ? intlNumberFormat.value.format(value)
          : numberAdapter.value.toString(value),
    }));

    const vueToCounterProps = reactiveOmit(props, ["localeNumber"]);

    // Event Bus
    {
      useEventBus<typeof VueToCounterBaseEmits>(undefined, emit);
    }

    return () => (
      <VueToCounter
        {...vueToCounterProps}
        {...attrs}
        value={value.value}
        partDataOptions={partDataOptions.value}
      >
        {{ ...slots }}
      </VueToCounter>
    );
  },
});
