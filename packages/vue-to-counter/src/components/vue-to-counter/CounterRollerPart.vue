<script setup lang="ts">
import {
  computed,
  CSSProperties,
  onMounted,
  PropType,
  ref,
  toRefs,
  toValue,
} from "vue";
import { v4 as uuid } from "uuid";
import { useElementSize, watchTriggerable } from "@vueuse/core";
import { AnimationOptions, PartDataDigit } from "./types";
import { RollerPartTestResult } from "./composables/use-roller-part-test";
import { polyfillKeyframes } from "./utils/polyfill-keyframes";

import { apply as elementCheckVisibilityPolyfill } from "@github/browser-support/lib/element-checkvisibility";
/**
 * @see https://caniuse.com/?search=checkVisibility
 */
elementCheckVisibilityPolyfill();

const props = defineProps({
  partId: {
    type: String,
    required: true,
  },
  testResult: {
    type: Object as PropType<RollerPartTestResult>,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  direction: {
    type: String as PropType<"up" | "down">,
    default: "down",
  },
  digits: {
    type: Object as PropType<PartDataDigit>,
    required: true,
  },
  textStyle: {
    type: Object as PropType<CSSProperties>,
  },
  digitStyle: {
    type: Array as PropType<(CSSProperties | undefined)[]>,
    default: () => [],
  },
  animationOptions: {
    type: Object as PropType<AnimationOptions>,
  },
});
const {
  partId,
  testResult,
  direction,
  digits,
  textStyle,
  digitStyle,
  duration: globalDuration,
  animationOptions,
} = toRefs(props);
const rollDigitList = computed(() => digits.value.data);

let animation: Animation | null = null;
let animationElement: HTMLElement | null = null;
const defaultKeyframe = {
  up: {
    transform: ["translateY(0)", "translateY(-100%)"],
  },
  down: {
    transform: ["translateY(0)", "translateY(100%)"],
  },
};
async function handleEnter(el: Element, done: () => void) {
  const {
    delay = 0,
    easing,
    iterations = 1,
    duration = globalDuration.value,
    endDelay = 0,
    keyframe = defaultKeyframe[direction.value],
  } = toValue(animationOptions) ?? {};

  try {
    animation = el.animate(polyfillKeyframes(keyframe), {
      duration,
      iterations,
      fill: "forwards",
      delay,
      endDelay,
      easing,
    });
    animationElement = el as HTMLElement;

    /**
     * 动画播放完成或被其他动画中断都会使得 `finished` resolve.
     * 只有当动画顺利播放完成的情况下, 才能调用 `cancel` 取消动画. 在其他情况下调用, 会抛出异常[1].
     *
     * 因此, 提前检查 `playState` 的值. 当 `playState` 不是 `finished` 时, 说明动画被其他 `Animation` 实例中断.
     * 因为已经有其他 `Animation` 实例的存在, 我们可以直接丢弃这个 `Animation` 实例, 而不用担心无动画可用.
     *
     * [1]: https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel#exceptions
     */
    await animation.finished;
    if (
      animation.playState === "finished" &&
      animationElement.checkVisibility()
    ) {
      animation.commitStyles();
      animation.cancel();
    }
  } catch (e) {
    console.error(e);
  } finally {
    done();
  }
}

function handleAfterEnter() {}

const transitionKey = ref(uuid());
const { trigger } = watchTriggerable(
  () =>
    [
      testResult.value,
      direction.value,
      digits.value,
      globalDuration.value,
      partId.value,
    ] as const,
  (value) => {
    const [testResultValue] = value;
    if (testResultValue.cancelPrevAnimation)
      if (
        animationElement &&
        animationElement.style &&
        animationElement.style.cssText
      )
        animationElement.style.cssText = "";
    if (!testResultValue.animate) return;

    transitionKey.value = uuid();
  }
);
onMounted(() => trigger());

const clonedRollDigitListRef = ref<HTMLSpanElement | null>(null);
const { width } = useElementSize(clonedRollDigitListRef);
const placeholderWidth = computed(() => `${Math.round(width.value)}px`);
</script>

<template>
  <span ref="rootRef" class="roller-part">
    <!--    占位      -->
    <span class="placeholder" :style="{ width: placeholderWidth }">0</span>
    <!--  一个不可见的滚动列表的复制, 用于计算该列表的最大宽度.  -->
    <span ref="clonedRollDigitListRef" class="roll-list__shadow">
      <span v-for="(digit, digitIndex) in rollDigitList" :key="digitIndex">
        {{ digit }}
      </span>
    </span>
    <transition @enter="handleEnter" @after-enter="handleAfterEnter">
      <span
        :key="transitionKey"
        class="roll-list"
        :class="{
          /**
           * 向上(up)滚动时, 使滚动列表顶部对齐以便于应用 `translationY(-100%)` 实现向上滚动效果
           * 向下同理
           */
          'roll-list__up': direction === 'up',
          'roll-list__down': direction === 'down',
        }"
      >
        <template v-if="rollDigitList.length > 1">
          <template
            v-for="(digit, digitIndex) in rollDigitList"
            :key="digitIndex"
          >
            <span
              v-if="
                direction === 'up' && digitIndex === rollDigitList.length - 1
              "
              class="roll-item roll-item__head"
              :style="digitStyle[digitIndex]"
            >
              <span :style="textStyle">{{ digit }}</span>
            </span>
            <span
              v-else-if="direction === 'down' && digitIndex === 0"
              class="roll-item roll-item__tail"
              :style="digitStyle[digitIndex]"
            >
              <span :style="textStyle">{{ digit }}</span>
            </span>
            <span v-else class="roll-item" :style="digitStyle[digitIndex]">
              <span :style="textStyle">{{ digit }}</span>
            </span>
          </template>
        </template>
        <template v-else>
          <span class="roll-item" :style="digitStyle[0]">
            <span :style="textStyle">{{ rollDigitList[0] }}</span>
          </span>
        </template>
      </span>
    </transition>
  </span>
</template>

<style scoped></style>
