import {
  h,
  defineComponent,
  computed,
  ref,
  watch,
  toRef,
  normalizeClass,
} from "vue";
import CounterRoller from "./CounterRoller.vue";
import { useDirection } from "./composables/use-direction";
import { usePartData } from "./composables/use-part-data";
import { anyBase } from "./utils/any-base";
import { clone, isArray, isEqual, isNumber, isString } from "lodash-es";
import { toRefs, watchWithFilter } from "@vueuse/core";
import { VueToCounterBaseSlots, VueToCounterProps } from "./types-props";

import "./VueToCounter.scss";

export default defineComponent({
  name: "VueToCounter",
  props: VueToCounterProps(),
  slots: VueToCounterBaseSlots,
  setup: (props, { attrs, slots }) => {
    const {
      duration,
      color,
      minPlaces,
      partDataOptions,
      tag,
      numberAdapter,
      stringAdapter,
    } = toRefs(props);

    const value = ref(clone(props.value));
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

      if (isArray(digitToCharValue)) {
        const result: Record<string, string> = {};
        digitToCharValue.forEach(
          (char, index) => (result[toChar(index)] = char)
        );
        return result;
      } else {
        return digitToCharValue;
      }
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

    const alphabet = computed(() =>
      props.alphabet ? props.alphabet : Object.keys(digitToChar.value).join("")
    );

    const decimalToAnyBase = computed(() =>
      anyBase(stringAdapter.value, "0123456789", alphabet.value)
    );
    const anyBaseToDecimal = computed(() =>
      anyBase(stringAdapter.value, alphabet.value, "0123456789")
    );
    watch(
      value,
      (value, oldValue) => {
        oldValue = oldValue ?? value;

        needToConvert.value = !isNumber(value) || !isNumber(oldValue);

        const decimalValue = toNumber(value);
        const oldDecimalValue = toNumber(oldValue);

        valueDifferences.value = [decimalValue, oldDecimalValue] as const;
      },
      { immediate: true }
    );
    function toNumber(value: string | number | number[] | bigint) {
      if (isArray(value))
        value = value.map((codePoint) => toChar(codePoint)).join("");
      else if (!isString(value)) value = value.toString(10);

      return numberAdapter.value.create(anyBaseToDecimal.value(value));
    }
    function toChar(value: number) {
      return String.fromCodePoint(value + 48);
    }

    const direction = useDirection(numberAdapter, valueDifferences);

    const durationPartData = usePartData({
      value: valueDifferences,
      numberAdapter,
      stringAdapter,
      sampleSplit: (samples) => [samples.slice()],
      minPlaces,
      digitToChar,
      ...toRefs(partDataOptions),
      sampleToString: (value) => {
        if (needToConvert.value) {
          if (partDataOptions.value?.sampleToString) {
            return decimalToAnyBase.value(
              partDataOptions.value?.sampleToString(value)
            );
          } else {
            return decimalToAnyBase.value(value.toString(10));
          }
        } else {
          return value.toString(10);
        }
      },
    });

    const backgroundClippedPartContainer = ref<HTMLSpanElement>();

    return () =>
      h(
        tag.value,
        {
          ...attrs,
          ref: backgroundClippedPartContainer,
          class:
            normalizeClass({
              "vue-to-counter": true,
              debug: props.debug,
            }) +
            " " +
            normalizeClass(attrs["class"]),
        },
        [
          <CounterRoller
            container={backgroundClippedPartContainer.value}
            data={durationPartData.value}
            duration={duration.value}
            color={color.value}
            direction={direction.value}
            animationOptions={props.animationOptions}
          >
            {{ ...slots }}
          </CounterRoller>,
        ]
      );
  },
});
