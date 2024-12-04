<script setup lang="ts">
import {
  type PropType,
  toRefs,
  defineProps,
  type CSSProperties,
  ref,
  useSlots,
  watchEffect,
} from "vue";
import { PartData } from "./types.ts";
import { useResizeObserver } from "@vueuse/core";
import CounterRollerPart from "./CounterRollerPart.vue";
import { debounce, isArray } from "lodash-es";

const props = defineProps({
  container: {
    type: HTMLElement as PropType<HTMLElement>,
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
     
    type: Object as PropType<Partial<Pick<KeyframeEffectOptions, "easing">>>,
  },
});
const { data, color, container } = toRefs(props);

const containerRect = ref<DOMRect>();
const updateContainerRect = debounce(
  () => (containerRect.value = container?.value?.getBoundingClientRect()),
  0,
  // 增加防抖间隔有助于提升性能, 但频繁变化位数时动画会产生抖动.
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
      });
    } else {
      result.set(partId, {});
      console.error(new Error("The color property is not supported."));
    }
  }

  backgroundClippedPartStyleMap.value = result;
});

const slots = useSlots();
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
    class="roller-part"
    data-part-id="part-prefix"
    :style="backgroundClippedPartStyleMap.get('part-prefix')"
  >
    <slot name="prefix" />
  </span>
  <template v-for="(partData, partIndex) in data" :key="partIndex">
    <span
      v-for="(digit, digitIndex) in partData.digits ?? []"
      ref="backgroundClippedParts"
      class="roller-part"
      :key="partData.digits.length - digitIndex"
      :data-part-id="`part-${partIndex}-${partData.digits.length - digitIndex}`"
    >
      <CounterRollerPart
        class="inline-block"
        :part-id="`part-${partIndex}-${partData.digits.length - digitIndex}`"
        :duration="duration"
        :text-style="
          backgroundClippedPartStyleMap.get(
            `part-${partIndex}-${partData.digits.length - digitIndex}`
          )
        "
        :direction="direction"
        :digits="digit"
        :title="`${partData.tailNumber}`"
        :animation-options="animationOptions"
      />
    </span>
    <span
      ref="backgroundClippedParts"
      class="roller-part"
      :data-part-id="`part-${partIndex}-unit`"
      :style="backgroundClippedPartStyleMap.get(`part-${partIndex}-unit`)"
    >
      <slot name="partSuffix" :partData="partData" :index="partIndex" />
    </span>
  </template>
  <span
    ref="backgroundClippedPartSuffix"
    v-if="slots['suffix']"
    class="inline-block"
    data-part-id="part-suffix"
    :style="backgroundClippedPartStyleMap.get('part-suffix')"
  >
    <slot name="suffix" />
  </span>
</template>

<style lang="scss" scoped>
.roller-part {
  /*
    增加行高避免具有下降部分的字符(如: g, j, p, q, y)的下降部分被截断
    @see https://en.wikipedia.org/wiki/Descender
    @see https://tailwindcss.com/docs/line-height
  */
  @apply inline-block leading-tight;
}
</style>
