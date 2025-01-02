<script setup lang="ts">
import {
  type PropType,
  toRefs,
  defineProps,
  type CSSProperties,
  ref,
  useSlots,
  watchEffect,
  computed,
  watch,
  toRaw,
} from "vue";
import {
  PartData,
  PartDigitValueOrGetter,
  PartDigitCellValueOrGetter,
  VueToCounterBaseEmits,
} from "./types";
import { useResizeObserver } from "@vueuse/core";
import CounterRollerPartDigit from "./CounterRollerPartDigit.vue";
import { debounce, isArray } from "lodash-es";
import { useRollerPartTest } from "./composables/use-roller-part-test";
import {
  extractPartDigitCellOption,
  extractPartDigitOption,
} from "./utils/extract-group-option";
import type { DynamicAnimationOptions } from "framer-motion/dom";
import type { DOMKeyframesDefinition } from "motion";
import { useEventBus } from "./composables/use-event-bus";

const props = defineProps({
  container: {
    type: null as unknown as PropType<HTMLElement>,
  },
  value: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Object as PropType<[any, any]>,
    required: true,
  },
  data: {
    type: Object as PropType<PartData[]>,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  direction: {
    type: String as PropType<"up" | "down">,
    required: true,
  },
  animationOptions: {
    type: [Object, Array, Function] as PropType<
      PartDigitValueOrGetter<DynamicAnimationOptions>
    >,
    default: () => ({}),
  },
  keyframes: {
    type: [Object, Array, Function] as PropType<
      PartDigitValueOrGetter<DOMKeyframesDefinition>
    >,
    default: () => {
      const result: PartDigitValueOrGetter<DOMKeyframesDefinition> = ({
        direction,
      }) =>
        ({
          up: { transform: ["translateY(0)", "translateY(-100%)"] },
          down: { transform: ["translateY(0)", "translateY(100%)"] },
        })[direction];
      return result;
    },
  },
  cellStyle: {
    type: [Object, Array, Function] as PropType<
      PartDigitCellValueOrGetter<CSSProperties>
    >,
    default: () => ({}),
  },
});
const {
  value,
  data,
  color,
  container,
  animationOptions,
  keyframes,
  direction,
  cellStyle,
} = toRefs(props);

const { emit } = useEventBus<typeof VueToCounterBaseEmits>();

const containerRect = ref<DOMRect>();
const updateContainerRect = debounce(
  () => (containerRect.value = container?.value?.getBoundingClientRect()),
  0,
  // ~~增加防抖间隔有助于提升性能, 但频繁变化位数时动画会产生抖动.~~
  // 250,
  { leading: true }
);
useResizeObserver(container, updateContainerRect);

const backgroundClippedParts = ref<HTMLSpanElement[]>();

const backgroundClippedPartPrefix = ref<HTMLSpanElement>();
const backgroundClippedPartSuffix = ref<HTMLSpanElement>();

const backgroundClippedPartStyleMap = ref(new Map<string, CSSProperties>());
const previousData = ref(data.value);
watchEffect(() => {
  const result: Map<string, CSSProperties> = new Map();

  const containerValue = container?.value;
  const containerRectValue = containerRect.value;
  const prefixValue = backgroundClippedPartPrefix.value;
  const suffixValue = backgroundClippedPartSuffix.value;
  const colorValue = color.value;
  const partsValue = (backgroundClippedParts.value ?? []).slice();

  const dataValue = data.value;
  const previousDataValue = previousData.value;

  /**
   * 当某次更新**将**会导致 DOM 宽高发生变化时(如: 滚动数字的位数增加/减少),
   * 需要跳过这次更新然后等待 DOM 宽高变化完成才能更新(宽高变化后将通过 {@link containerRect} 触发).
   */
  try {
    if (!containerValue || !containerRectValue) {
      return;
    }
    /**
     * 比较 {@link data} 前后不同判断是否导致 DOM 宽高会发生变化.
     */
    if (dataValue.length !== previousDataValue.length) {
      return;
    } else {
      for (let i = 0; i < dataValue.length; i++) {
        if (dataValue[i].digits.length !== previousDataValue[i].digits.length) {
          return;
        }
      }
    }
  } finally {
    previousData.value = data.value;
  }

  if (prefixValue) partsValue.unshift(prefixValue);
  if (suffixValue) partsValue.push(suffixValue);

  for (const el of isArray(partsValue) ? partsValue : []) {
    const partId = el.dataset["partId"];
    if (!partId) {
      throw new Error("The data-part-id attribute is required.");
    }

    if (CSS.supports("color", colorValue)) {
      result.set(partId, { color: colorValue });
    } else if (CSS.supports("background-image", colorValue)) {
      result.set(partId, {
        backgroundImage: colorValue,
        backgroundClip: "text",
        backgroundSize: `${containerValue.offsetWidth}px ${containerValue.offsetHeight}px`,
        backgroundPositionX: `${-el.offsetLeft}px`,
        backgroundPositionY: `${-el.offsetTop}px`,
        backgroundRepeat: "no-repeat",
        color: "transparent",
        "-webkit-text-fill-color": "transparent",
      });
    } else {
      result.set(partId, {});
      console.error(new Error("The color property is not supported."));
    }
  }

  backgroundClippedPartStyleMap.value = result;
});

const slots = useSlots();

const extractOptionContext = computed(() => ({
  testResults: testResults.value,
  direction: direction.value,
  value: value.value,
  data: data.value,
}));
const { testResults } = useRollerPartTest(data, direction);

const partDigitAnimationOptions = computed(
  () =>
    extractPartDigitOption(
      animationOptions.value,
      extractOptionContext.value
    ) as DynamicAnimationOptions[][]
);
const partDigitKeyframes = computed(
  () =>
    extractPartDigitOption(
      keyframes.value,
      extractOptionContext.value
    ) as DOMKeyframesDefinition[][]
);

const rollerCellStyle = computed(
  () =>
    extractPartDigitCellOption(
      cellStyle.value,
      extractOptionContext.value
    ) as CSSProperties[][][]
);

// 处理动画开始/结束事件
const animateDigitTotal = computed(
  () => testResults.value.flat().filter(({ animate }) => animate).length
);
const animatedDigitCount = ref(0);
watch(
  testResults,
  (testResultsValue) => {
    for (const { animate } of testResultsValue.flat()) {
      if (!animate) continue;

      emit("rollAnimationStart", {
        testResults: toRaw(testResultsValue),
        data: toRaw(data.value),
        direction: direction.value,
      });
      animatedDigitCount.value = 0;
      break;
    }
  },
  { immediate: true }
);
watch([animatedDigitCount, animateDigitTotal], ([animated, total]) => {
  if (animated < total) return;

  emit("rollAnimationEnd", {
    testResults: toRaw(testResults.value),
    data: toRaw(data.value),
    direction: direction.value,
  });
});
const handleAnimationEnd = () => animatedDigitCount.value++;
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <span
    v-if="slots['prefix']"
    ref="backgroundClippedPartPrefix"
    class="roller-part__prefix"
    data-part-id="part-prefix"
    :style="backgroundClippedPartStyleMap.get('part-prefix')"
  >
    <slot name="prefix" />
  </span>
  <span class="roller-parts">
    <span
      class="roller-part"
      v-for="(partData, partIndex) in data"
      :key="partIndex"
    >
      <span
        v-for="(digit, digitIndex) in partData.digits ?? []"
        ref="backgroundClippedParts"
        class="roller-part__wrapper"
        :key="partData.digits.length - digitIndex"
        :data-part-id="`part-${partIndex}-${partData.digits.length - digitIndex}`"
      >
        <CounterRollerPartDigit
          :part-id="`part-${partIndex}-${partData.digits.length - digitIndex}`"
          :text-style="
            backgroundClippedPartStyleMap.get(
              `part-${partIndex}-${partData.digits.length - digitIndex}`
            )
          "
          :direction="direction"
          :digits="digit"
          :test-result="testResults[partIndex][digitIndex]"
          :animation-options="partDigitAnimationOptions[partIndex][digitIndex]"
          :keyframes="partDigitKeyframes[partIndex][digitIndex]"
          :cell-style="rollerCellStyle[partIndex][digitIndex]"
          @digit-animation-end="handleAnimationEnd"
        />
      </span>
      <span
        v-if="slots['partSuffix']"
        ref="backgroundClippedParts"
        class="roller-part__unit"
        :data-part-id="`part-${partIndex}-unit`"
        :style="backgroundClippedPartStyleMap.get(`part-${partIndex}-unit`)"
      >
        <slot name="partSuffix" :partData="partData" :index="partIndex" />
      </span>
    </span>
  </span>
  <span
    ref="backgroundClippedPartSuffix"
    v-if="slots['suffix']"
    class="roller-part__prefix"
    data-part-id="part-suffix"
    :style="backgroundClippedPartStyleMap.get('part-suffix')"
  >
    <slot name="suffix" />
  </span>
</template>
