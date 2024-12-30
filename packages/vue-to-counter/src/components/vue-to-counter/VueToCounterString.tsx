import { defineComponent, computed, ref, watch, ExtractPropTypes } from "vue";
import { toRefs, useMounted } from "@vueuse/core";
import {
  VueToCounterBaseEmits,
  VueToCounterBaseSlots,
  VueToCounterPropsReturn,
  VueToCounterStringProps,
} from "./types";
import VueToCounter from "./VueToCounter";

/**
 * 替换一些特定的字符.
 * 1. " ": 空格字符在 HTML 中会被忽略导致无法计算字符宽度, 使用 \xa0 替换.
 */
const REPLACED_CHARS: Record<string, string> = {
  " ": "\xa0", // &nbsp;
};

export default defineComponent({
  name: "VueToCounterNumber",
  props: VueToCounterStringProps(),
  slots: VueToCounterBaseSlots,
  emits: VueToCounterBaseEmits,
  setup: (props, { attrs, slots }) => {
    const { stringAdapter } = toRefs(props);

    const alphabet = ref("");
    const replacedValue = computed(() => props.value);
    const initialValueChars = computed(() =>
      stringAdapter.value.stringToChars(props.initialValue ?? "")
    );
    const isMounted = useMounted();
    watch(
      [replacedValue, stringAdapter],
      ([value, stringAdapterValue], [oldValue]) => {
        const charSet = new Set(
          stringAdapterValue
            .stringToChars(oldValue ?? "")
            .concat(
              stringAdapterValue.stringToChars(value ?? ""),
              isMounted.value ? [] : initialValueChars.value
            )
        );
        charSet.add("\x00");
        alphabet.value = Array.from(charSet).sort().join("");
      },
      { immediate: true }
    );

    const digitToChar = computed(() => ({
      " ": REPLACED_CHARS[" "],
      ...props.digitToChar,
    }));

    const partDataOptions = computed<
      ExtractPropTypes<typeof VueToCounterPropsReturn>["partDataOptions"]
    >(() => ({
      fillChar: REPLACED_CHARS[" "],
      ...props.partDataOptions,
    }));

    return () => (
      <VueToCounter
        {...props}
        {...attrs}
        value={replacedValue.value}
        alphabet={alphabet.value}
        digitToChar={digitToChar.value}
        partDataOptions={partDataOptions.value}
      >
        {{ ...slots }}
      </VueToCounter>
    );
  },
});
