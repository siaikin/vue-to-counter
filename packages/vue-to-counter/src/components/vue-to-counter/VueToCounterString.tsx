import {
  defineComponent,
  computed,
  ref,
  watch,
  ExtractPropTypes,
  toRef,
} from "vue";
import { reactiveOmit, toRefs, useMounted } from "@vueuse/core";
import {
  VueToCounterBaseEmits,
  VueToCounterBaseSlots,
  VueToCounterPropsReturn,
  VueToCounterStringProps,
} from "./types";
import VueToCounter from "./VueToCounter";
import { anyBase } from "./utils/any-base";

/**
 * 替换一些特定的字符.
 * 1. " ": 空格字符在 HTML 中会被忽略导致无法计算字符宽度, 使用 \xa0 替换.
 */
const REPLACED_CHARS: Record<string, string> = {
  " ": "\xa0", // &nbsp;
};

const DecimalAlphabet = "0123456789";

export default defineComponent({
  name: "VueToCounterString",
  props: VueToCounterStringProps(),
  slots: VueToCounterBaseSlots,
  emits: VueToCounterBaseEmits,
  inheritAttrs: false,
  setup: (props, { attrs, slots }) => {
    const { value, initialValue, numberAdapter, stringAdapter } = toRefs(props);

    // function toString(value: number[] | string): string {
    //   if (isArray(value))
    //     value = value.map((codePoint) => toChar(codePoint)).join("");
    //   return value;
    // }
    // function toChar(value: number) {
    //   return String.fromCodePoint(value + 48);
    // }

    const alphabet = ref("");
    const oldValue = ref("");
    const isMounted = useMounted();
    watch(
      [value, stringAdapter, toRef(props, "alphabet")],
      ([value, stringAdapterValue, alphabetValue], [_oldValue]) => {
        if (alphabetValue) {
          alphabet.value = alphabetValue;
          return;
        }

        const allChars =
          "\x00" +
          (_oldValue ?? "") +
          (value ?? "") +
          (isMounted.value ? "" : (initialValue.value ?? ""));

        const charSet = new Set(stringAdapterValue.stringToChars(allChars));
        alphabet.value = Array.from(charSet).sort().join("");

        oldValue.value =
          (isMounted.value ? _oldValue : initialValue.value) ?? value;
      },
      { immediate: true }
    );

    const decimalToAnyBase = computed(() =>
      anyBase(stringAdapter.value, DecimalAlphabet, alphabet.value)
    );
    const anyBaseToDecimal = computed(() =>
      anyBase(stringAdapter.value, alphabet.value, DecimalAlphabet)
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
      sampleToString: (value): string => {
        const toAnyBase = decimalToAnyBase.value;
        return toAnyBase(numberAdapter.value.toString(value));
      },
    }));

    const numberValue = computed(() =>
      numberAdapter.value.create(anyBaseToDecimal.value(value.value))
    );
    const oldNumberValue = computed(() =>
      numberAdapter.value.create(anyBaseToDecimal.value(oldValue.value))
    );
    const numberInitialValue = computed(() =>
      initialValue.value
        ? numberAdapter.value.create(anyBaseToDecimal.value(initialValue.value))
        : undefined
    );

    const vueToCounterProps = reactiveOmit(props, ["value", "initialValue"]);

    return () => (
      <VueToCounter
        {...vueToCounterProps}
        {...attrs}
        value={numberValue.value}
        oldValue={oldNumberValue.value}
        initialValue={numberInitialValue.value}
        digitToChar={digitToChar.value}
        partDataOptions={partDataOptions.value}
      >
        {{ ...slots }}
      </VueToCounter>
    );
  },
});
