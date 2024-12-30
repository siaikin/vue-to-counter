import {
  h,
  defineComponent,
  computed,
  ref,
  watch,
  toRef,
  normalizeClass,
  onMounted,
  toRaw,
} from "vue";
import CounterRoller from "./CounterRoller.vue";
import { useDirection } from "./composables/use-direction";
import { PartDataOptions, usePartData } from "./composables/use-part-data";
import { anyBase } from "./utils/any-base";
import {
  clone,
  isArray,
  isEqual,
  isNumber,
  isObject,
  isString,
} from "lodash-es";
import { toRefs, watchWithFilter } from "@vueuse/core";
import {
  VueToCounterBaseEmits,
  VueToCounterBaseSlots,
  VueToCounterProps,
} from "./types";
import { transitionDigit } from "./utils/transition-digit";

import "./VueToCounter.scss";

const DecimalAlphabet = "0123456789";

export default defineComponent({
  name: "VueToCounter",
  props: VueToCounterProps(),
  slots: VueToCounterBaseSlots,
  emits: VueToCounterBaseEmits,
  setup: (props, { slots }) => {
    const {
      initialValue,
      color,
      minPlaces,
      tag,
      numberAdapter,
      stringAdapter,
      cellStyle,
      prefix,
      suffix,
    } = toRefs(props);

    const value = ref(clone(initialValue.value ?? props.value));
    onMounted(() => initialValue.value && (value.value = clone(props.value)));
    watchWithFilter(
      toRef(props, "value"),
      /**
       * 最复杂的参数也只是 `number[]` 类型, 不需要 `cloneDeep`
       */
      (v) => (value.value = clone(v)),
      {
        eventFilter: (invoke, options) =>
          isEqual(options.args[0], value.value) || invoke(),
        /**
         * 启用 `deep` 选项, 可以在 value 类型为 `number[]` 时, 支持 `:value="[variable]"` 传参方式.
         */
        deep: true,
      }
    );

    const digitToChar = computed(() => {
      const digitToCharValue = props.digitToChar;

      const result: Record<string, string> = {};

      if (isArray(digitToCharValue)) {
        digitToCharValue.forEach(
          (char, index) => (result[toChar(index)] = char)
        );
      } else if (isObject(digitToCharValue)) {
        Object.entries(digitToCharValue).forEach(
          ([key, value]) => (result[key] = value)
        );
      }

      return result;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueDifferences = ref<[any, any]>([
      numberAdapter.value.create(0),
      numberAdapter.value.create(0),
    ]);
    /**
     *
     */
    const needToConvert = ref(false);

    const alphabet = computed(() => {
      const _value = value.value;

      if (!props.alphabet) {
        if (!isString(_value)) return DecimalAlphabet;
        return Array.from(
          new Set(stringAdapter.value.stringToChars(_value))
        ).join("");
      }

      return props.alphabet;
    });

    const decimalToAnyBase = computed(() =>
      anyBase(stringAdapter.value, DecimalAlphabet, alphabet.value)
    );
    const anyBaseToDecimal = computed(() =>
      anyBase(stringAdapter.value, alphabet.value, DecimalAlphabet)
    );
    watch(
      [value, numberAdapter],
      ([value], [oldValue]) => {
        oldValue = oldValue ?? value;

        needToConvert.value = !isNumber(value) || !isNumber(oldValue);

        const decimalValue = toNumber(value);
        const oldDecimalValue = toNumber(oldValue);

        valueDifferences.value = [decimalValue, oldDecimalValue] as const;
      },
      { immediate: true }
    );
    function toNumber(value: string | number | number[] | bigint) {
      if (isNumber(value) || typeof value === "bigint")
        return numberAdapter.value.create(value);

      if (isArray(value))
        value = value.map((codePoint) => toChar(codePoint)).join("");

      return numberAdapter.value.create(anyBaseToDecimal.value(value));
    }
    function toChar(value: number) {
      return String.fromCodePoint(value + 48);
    }

    const direction = useDirection(numberAdapter, valueDifferences);

    const partDataOptions = computed<
      Omit<PartDataOptions, "value" | "numberAdapter" | "stringAdapter">
    >(() => ({
      sampleCount: 16,
      decimalSeparator: ".",
      fillChar: "0",
      sampling: (na, from, to) =>
        transitionDigit(
          na,
          na.max(from, to),
          na.min(from, to),
          props.partDataOptions.sampleCount ?? 16
        ),
      sampleSplit: (samples) => [samples.slice()],
      minPlaces: minPlaces.value ?? [1, 0],
      digitToChar: digitToChar.value,
      ...props.partDataOptions,
      sampleToString: (value): string => {
        const toString =
          props.partDataOptions?.sampleToString ?? numberAdapter.value.toString;

        // todo bigint need to convert ?
        if (needToConvert.value) {
          const toAnyBase = decimalToAnyBase.value;
          return toAnyBase(toString(value));
        } else {
          return toString(value);
        }
      },
    }));
    const durationPartData = usePartData(
      valueDifferences,
      numberAdapter,
      stringAdapter,
      partDataOptions
    );

    const backgroundClippedPartContainer = ref<HTMLSpanElement>();

    const cachedSlots = computed(() => ({
      prefix: prefix.value ? () => prefix.value : undefined,
      suffix: suffix.value ? () => suffix.value : undefined,
      ...slots,
    }));

    return () =>
      h(
        tag.value,
        {
          ref: backgroundClippedPartContainer,
          class: normalizeClass({
            "vue-to-counter": true,
            debug: props.debug,
          }),
        },
        [
          <CounterRoller
            container={backgroundClippedPartContainer.value}
            value={valueDifferences.value}
            data={durationPartData.value}
            color={color.value}
            direction={direction.value}
            animationOptions={props.animationOptions}
            keyframes={props.keyframes}
            cellStyle={cellStyle.value}
          >
            {toRaw(cachedSlots.value)}
          </CounterRoller>,
        ]
      );
  },
});
