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
import { PartDataDigit } from "./types";
import { RollerPartTestResult } from "./composables/use-roller-part-test";
import { animate } from "motion";
import type { DOMKeyframesDefinition } from "motion";
import type { DynamicAnimationOptions } from "framer-motion/dom";
import { isString, merge, omit } from "lodash-es";
import * as PennerEasingFunctions from "./easing/penner-easing-functions";

const props = defineProps({
  partId: {
    type: String,
    required: true,
  },
  testResult: {
    type: Object as PropType<RollerPartTestResult>,
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
  cellStyle: {
    type: Array as PropType<(CSSProperties | undefined)[]>,
    default: () => [],
  },
  animationOptions: {
    type: Object as PropType<DynamicAnimationOptions>,
    default: () => ({}),
  },
  keyframes: {
    type: Object as PropType<DOMKeyframesDefinition>,
    default: () => ({}),
  },
});
const {
  partId,
  testResult,
  direction,
  digits,
  textStyle,
  cellStyle,
  animationOptions,
  keyframes,
} = toRefs(props);

const emit = defineEmits(["digit-animation-end", "digit-animation-start"]);

const rollDigitList = computed(() => digits.value.data);

let animation: ReturnType<typeof animate> | null = null;
/**
 * @see https://github.com/motiondivision/motion/issues/2948
 */
let animationElement: HTMLElement | null = null;
async function handleEnter(el: Element, done: () => void) {
  emit("digit-animation-start");

  const anmOptions = merge(
    { duration: 1, repeat: 0 },
    toValue(animationOptions)
  );

  /**
   * 尝试从 `PennerEasingFunctions` 中获取对应的 easing 函数
   */
  {
    if (
      isString(anmOptions.ease) &&
      PennerEasingFunctions[
        anmOptions.ease as keyof typeof PennerEasingFunctions
      ]
    ) {
      anmOptions.ease =
        PennerEasingFunctions[
          anmOptions.ease as keyof typeof PennerEasingFunctions
        ];
    }
  }

  try {
    animation = animate(el, keyframes.value, anmOptions);
    animationElement = el as HTMLElement;

    await animation;
  } catch (e) {
    console.error(e);
  } finally {
    done();
  }
}
function handleAfterEnter() {
  emit("digit-animation-end");
}

const transitionKey = ref(uuid());
const { trigger } = watchTriggerable(
  () =>
    [
      testResult.value,
      direction.value,
      digits.value,
      partId.value,
      animationOptions.value,
      keyframes.value,
    ] as const,
  (value) => {
    const [testResultValue] = value;
    if (testResultValue.cancelPrevAnimation) {
      if (animation) {
        // animation.time = 0.1;
        animation.cancel();
      }
      if (
        animationElement &&
        animationElement.style &&
        animationElement.style.cssText
      ) {
        animationElement.style.cssText = "";
      }
    }
    if (!testResultValue.animate) return;

    transitionKey.value = uuid();
  }
);
onMounted(() => trigger());

const clonedRollDigitListRef = ref<HTMLSpanElement | null>(null);
const { width } = useElementSize(clonedRollDigitListRef);
const placeholderWidth = computed(() => `${Math.round(width.value)}px`);

const shadowCellStyle = computed(() =>
  cellStyle.value.map((style) => omit(style, ["position"]))
);
</script>

<template>
  <span ref="rootRef" class="roller-part-digit">
    <!--    占位      -->
    <span class="placeholder" :style="{ width: placeholderWidth }">0</span>
    <!--  一个不可见的滚动列表的复制, 用于计算该列表的最大宽度.  -->
    <span ref="clonedRollDigitListRef" class="roll-list__shadow">
      <span
        v-for="(digit, index) in rollDigitList"
        :key="index"
        :style="shadowCellStyle[index]"
      >
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
              :style="cellStyle[digitIndex]"
            >
              <span :style="textStyle">{{ digit }}</span>
            </span>
            <span
              v-else-if="direction === 'down' && digitIndex === 0"
              class="roll-item roll-item__tail"
              :style="cellStyle[digitIndex]"
            >
              <span :style="textStyle">{{ digit }}</span>
            </span>
            <span v-else class="roll-item" :style="cellStyle[digitIndex]">
              <span :style="textStyle">{{ digit }}</span>
            </span>
          </template>
        </template>
        <template v-else>
          <span class="roll-item" :style="cellStyle[0]">
            <span :style="textStyle">{{ rollDigitList[0] }}</span>
          </span>
        </template>
      </span>
    </transition>
  </span>
</template>

<style scoped></style>
