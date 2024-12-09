import { defineComponent, computed, ref, watch } from "vue";
import { toRefs } from "@vueuse/core";
import { VueToCounterBaseSlots, VueToCounterStringProps } from "./types-props";
import VueToCounter from "./VueToCounter";
import { VueToCounterProps } from "./types";

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
  setup: (props, { attrs, slots }) => {
    const { numberAdapter, stringAdapter } = toRefs(props);

    const alphabet = ref("");
    const replacedValue = computed(() =>
      props.value.replaceAll(" ", REPLACED_CHARS[" "])
    );
    watch(
      [replacedValue, stringAdapter],
      ([value, stringAdapterValue], [oldValue]) => {
        const charSet = new Set(
          stringAdapterValue
            .stringToChars(oldValue ?? "")
            .concat(stringAdapterValue.stringToChars(value ?? ""))
        );
        alphabet.value = [" "].concat(Array.from(charSet)).join("");
      },
      { immediate: true }
    );

    const digitToChar = computed(() => ({
      " ": REPLACED_CHARS[" "],
      ...props.digitToChar,
    }));

    const partDataOptions = computed<VueToCounterProps["partDataOptions"]>(
      () => ({
        ...props.partDataOptions,
        sampleToString: (value) => numberAdapter.value.toString(value),
      })
    );

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
