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
} from "vue";
import {
  AnimationOptions,
  GroupAnimationOptions,
  PartData,
  PartDigitCellValueOrGetter,
} from "./types";
import { useResizeObserver } from "@vueuse/core";
import CounterRollerPart from "./CounterRollerPart.vue";
import { debounce, isArray } from "lodash-es";
import { useRollerPartTest } from "./composables/use-roller-part-test";
import {
  extractPartDigitCellOption,
  extractPartDigitOption,
} from "./utils/extract-group-option";

const props = defineProps({
  container: {
    type: HTMLElement as PropType<HTMLElement>,
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
  duration: {
    type: Number,
    required: true,
  },
  direction: {
    type: String as PropType<"up" | "down">,
    required: true,
  },
  animationOptions: {
    type: Object as PropType<Partial<GroupAnimationOptions>>,
    default: () => ({}),
  },
  digitStyle: {
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
  direction,
  digitStyle,
} = toRefs(props);

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

const rollerOptions = computed(() => ({
  testResults: testResults.value,
  direction: direction.value,
  value: value.value,
  data: data.value,
}));
const { testResults } = useRollerPartTest(data, direction);
const rollerPartAnimationOptions = computed(() => {
  const { easing, delay, endDelay, iterations, duration, keyframe } =
    animationOptions.value;
  const rollerOptionsValue = rollerOptions.value;

  return {
    easing: extractPartDigitOption(easing, rollerOptionsValue),
    delay: extractPartDigitOption(delay, rollerOptionsValue),
    iterations: extractPartDigitOption(iterations, rollerOptionsValue),
    duration: extractPartDigitOption(duration, rollerOptionsValue),
    endDelay: extractPartDigitOption(endDelay, rollerOptionsValue),
    keyframe: extractPartDigitOption(
      keyframe,
      rollerOptionsValue
    ) as AnimationOptions["keyframe"][][],
  };
});

function getAnimationOptions(partIndex: number, digitIndex: number) {
  const rollerPartAnimationOptionsValue = rollerPartAnimationOptions.value;
  return {
    easing: rollerPartAnimationOptionsValue.easing[partIndex][digitIndex],
    delay: rollerPartAnimationOptionsValue.delay[partIndex][digitIndex],
    iterations:
      rollerPartAnimationOptionsValue.iterations[partIndex][digitIndex],
    duration: rollerPartAnimationOptionsValue.duration[partIndex][digitIndex],
    endDelay: rollerPartAnimationOptionsValue.endDelay[partIndex][digitIndex],
    keyframe: rollerPartAnimationOptionsValue.keyframe[partIndex][digitIndex],
  };
}

const rollerPartStyle = computed(() =>
  extractPartDigitCellOption(digitStyle.value, rollerOptions.value)
);
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
    <template v-for="(partData, partIndex) in data" :key="partIndex">
      <span
        v-for="(digit, digitIndex) in partData.digits ?? []"
        ref="backgroundClippedParts"
        class="roller-part__wrapper"
        :key="partData.digits.length - digitIndex"
        :data-part-id="`part-${partIndex}-${partData.digits.length - digitIndex}`"
      >
        <CounterRollerPart
          :part-id="`part-${partIndex}-${partData.digits.length - digitIndex}`"
          :duration="duration"
          :text-style="
            backgroundClippedPartStyleMap.get(
              `part-${partIndex}-${partData.digits.length - digitIndex}`
            )
          "
          :direction="direction"
          :digits="digit"
          :test-result="testResults[partIndex][digitIndex]"
          :animation-options="getAnimationOptions(partIndex, digitIndex)"
          :digit-style="rollerPartStyle[partIndex][digitIndex]"
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
    </template>
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
