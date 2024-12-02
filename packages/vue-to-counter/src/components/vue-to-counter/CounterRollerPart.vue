<script setup lang="ts">
import { computed, CSSProperties, onMounted, PropType, ref, toRefs } from "vue";
import { v4 as uuid } from "uuid";
import { useElementSize, watchTriggerable } from "@vueuse/core";
import { isEqual } from "lodash-es";

const props = defineProps({
  partId: {
    type: String,
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
    type: Array as PropType<string[]>,
    default: () => [],
  },
  textStyle: {
    type: Object as PropType<CSSProperties>,
  },
});
const { partId, direction, digits, textStyle, duration } = toRefs(props);

let animation: Animation | null = null;
async function handleEnter(el: Element, done: () => void) {
  try {
    // eslint-disable-next-line no-undef
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
  () => [direction.value, digits.value, duration.value, partId.value] as const,
  (value, oldValue) => {
    /**
     * 以下代码块用于判断是否需要启动滚动动画.
     * 下列情况将直接显示并删除上次动画结束后保留的样式:
     * 1. 当新的滚动数据(即 digits)长度为 1 时.
     * 2. 当滚动数据头尾相同时.
     * 3. 当前滚动数据与上一次全等时.
     */
    {
      const [, newDigits] = value;
      const [, oldDigits] = oldValue ?? [];

      let earlyReturn = "";
      if (newDigits.length === 1) {
        earlyReturn = "only one digit";
        animation?.cancel();
      }
      if (newDigits[0] === newDigits[newDigits.length - 1])
        earlyReturn = "same head and tail";
      if (isEqual(newDigits, oldDigits)) earlyReturn = "same digits";

      if (earlyReturn) {
        // animation?.cancel();
        return;
      }
    }

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
      <span v-for="(digit, digitIndex) in digits" :key="digitIndex">
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
        <template v-if="digits.length > 1">
          <template v-for="(digit, digitIndex) in digits" :key="digitIndex">
            <span
              v-if="direction === 'up' && digitIndex === digits.length - 1"
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
            {{ digits[0] }}
          </span>
        </template>
      </span>
    </transition>
  </span>
</template>

<style scoped></style>
