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
import { clone, isArray, isEqual, isObject } from "lodash-es";
import { toRefs, watchWithFilter } from "@vueuse/core";
import {
  VueToCounterBaseEmits,
  VueToCounterBaseSlots,
  VueToCounterProps,
} from "./types";
import { transitionDigit } from "./utils/transition-digit";

import "./VueToCounter.scss";

export default defineComponent({
  name: "VueToCounter",
  props: VueToCounterProps(),
  slots: VueToCounterBaseSlots,
  emits: VueToCounterBaseEmits,
  setup: (props, { slots }) => {
    const {
      initialValue,
      oldValue: outerOldValue,
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
    function toChar(value: number) {
      return String.fromCodePoint(value + 48);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueDifferences = ref<[any, any]>([
      numberAdapter.value.create(0),
      numberAdapter.value.create(0),
    ]);

    watch(
      [value, numberAdapter],
      ([value, na], [oldValue, oldNa]) => {
        if (na === oldNa) {
          valueDifferences.value = [
            value,
            outerOldValue.value ?? oldValue ?? value,
          ];
        } else {
          /**
           * adapter 变化时, 保证 `valueDifferences` 新旧值类型一致.
           */
          valueDifferences.value = [value, value];
        }
      },
      { immediate: true }
    );

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

        return toString(value);
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
