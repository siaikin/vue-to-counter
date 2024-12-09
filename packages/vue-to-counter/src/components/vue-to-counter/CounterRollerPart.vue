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
  animationOptions: {
    type: Object as PropType<Partial<AnimationOptions>>,
  },
});
const {
  partId,
  testResult,
  direction,
  digits,
  textStyle,
  duration,
  animationOptions,
} = toRefs(props);

const rollDigitList = computed(() => digits.value.data);

let animation: Animation | null = null;
async function handleEnter(el: Element, done: () => void) {
  const { delay = 0, easing } = toValue(animationOptions) ?? {};
  try {
    const keyframes: PropertyIndexedKeyframes = {};

    switch (direction.value) {
      case "up":
        keyframes["transform"] = ["translateY(0)", "translateY(-100%)"];
        break;
      case "down":
        keyframes["transform"] = ["translateY(0)", "translateY(100%)"];
    }

    animation = el.animate(keyframes, {
      duration: duration.value,
      iterations: 1,
      fill: "forwards",
      delay,
      easing,
    });

    await animation.finished;
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
      duration.value,
      partId.value,
    ] as const,
  (value) => {
    const [testResultValue] = value;
    if (testResultValue.cancelPrevAnimation) animation?.cancel();
    if (!testResultValue.animate) return;

    transitionKey.value = uuid();
  }
);
onMounted(() => trigger());

const rollDigitListRef = ref<HTMLSpanElement | null>(null);
const { width } = useElementSize(rollDigitListRef);
const placeholderWidth = computed(() => `${Math.round(width.value)}px`);
</script>

<template>
  <span ref="rootRef" class="relative">
    <!--    占位      -->
    <span class="inline-block" :style="{ width: placeholderWidth }" />
    <span
      ref="rollDigitListRef"
      class="absolute -z-10 invisible inline-flex flex-col text-nowrap"
    >
      <span v-for="(digit, digitIndex) in rollDigitList" :key="digitIndex">
        {{ digit }}
      </span>
    </span>
    <transition @enter="handleEnter" @after-enter="handleAfterEnter">
      <span
        :key="transitionKey"
        class="absolute left-0 inline-flex flex-col items-center w-full"
        :class="{
          /**
           * 向上(up)滚动时, 使滚动列表顶部对齐以便于应用 `translationY(-100%)` 实现向上滚动效果
           * 向下同理
           */
          'top-0': direction === 'up',
          'bottom-0': direction === 'down',
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
              class="absolute top-full"
              :style="textStyle"
            >
              {{ digit }}
            </span>
            <span
              v-else-if="direction === 'down' && digitIndex === 0"
              class="absolute bottom-full"
              :style="textStyle"
            >
              {{ digit }}
            </span>
            <span v-else class="inline-block" :style="textStyle">
              {{ digit }}
            </span>
          </template>
        </template>
        <template v-else>
          <span class="inline-block" :style="textStyle">
            {{ rollDigitList[0] }}
          </span>
        </template>
      </span>
    </transition>
  </span>
</template>

<style scoped></style>
