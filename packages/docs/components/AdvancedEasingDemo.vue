<script setup>
import { ref } from "vue";
import EasingView from "./EasingView.vue";
import { steps } from "vue-to-counter";

const number = ref(1);

function switchNumber() {
  number.value = Math.floor(Math.random() * 100);
}

const fontSize = ref(64);

const animationOptions = ref({
  ease: "easeIn",
  duration: 2,
});
</script>

<template>
  <div class="text-center">
    <vue-to-counter-number
      class="font-bold"
      :style="{
        fontSize: fontSize + 'px',
      }"
      :value="number"
      :animation-options="{
        ...animationOptions,
        ease:
          animationOptions.ease === 'steps' ? steps(4) : animationOptions.ease,
      }"
    />
  </div>
  <hr />
  <div class="flex gap-4">
    <input class="border border-solid p-1" v-model="number" type="number" />
    <button class="border border-solid p-1" @click="switchNumber">切换</button>
  </div>
  <div class="flex gap-4 mt-4">
    <label class="inline-flex gap-1 border border-solid p-1">
      字号
      <input v-model="fontSize" type="range" min="1" max="128" />
      {{ fontSize }}px
    </label>
    <label class="inline-flex gap-1 border border-solid p-1">
      持续时间（s）：0
      <input
        v-model="animationOptions.duration"
        type="range"
        min="0"
        max="6"
        step="0.5"
      />
      {{ animationOptions.duration }}
    </label>
  </div>
  <div class="flex gap-4 mt-4">
    <div class="flex-none w-64 flex flex-col">
      <select
        v-model="animationOptions.ease"
        @update:model-value="switchNumber"
        class="w-full border border-solid p-1 self-start appearance-auto"
      >
        <optgroup label="Motion Build-in Easings">
          <option value="linear">linear</option>
          <option value="easeIn">easeIn</option>
          <option value="easeOut">easeOut</option>
          <option value="easeInOut">easeInOut</option>
          <option value="anticipate">anticipate</option>
          <option value="steps">steps(4) 模拟卡顿感</option>
        </optgroup>
        <optgroup label="easings.net Easing">
          <option value="easeInQuad">easeInQuad</option>
          <option value="easeOutQuad">easeOutQuad</option>
          <option value="easeInOutQuad">easeInOutQuad</option>
          <option value="easeInCubic">easeInCubic</option>
          <option value="easeOutCubic">easeOutCubic</option>
          <option value="easeInOutCubic">easeInOutCubic</option>
          <option value="easeInQuart">easeInQuart</option>
          <option value="easeOutQuart">easeOutQuart</option>
          <option value="easeInOutQuart">easeInOutQuart</option>
          <option value="easeInQuint">easeInQuint</option>
          <option value="easeOutQuint">easeOutQuint</option>
          <option value="easeInOutQuint">easeInOutQuint</option>
          <option value="easeInSine">easeInSine</option>
          <option value="easeOutSine">easeOutSine</option>
          <option value="easeInOutSine">easeInOutSine</option>
          <option value="easeInExpo">easeInExpo</option>
          <option value="easeOutExpo">easeOutExpo</option>
          <option value="easeInOutExpo">easeInOutExpo</option>
          <option value="easeInCirc">easeInCirc</option>
          <option value="easeOutCirc">easeOutCirc</option>
          <option value="easeInOutCirc">easeInOutCirc</option>
          <option value="easeInBack">easeInBack</option>
          <option value="easeOutBack">easeOutBack</option>
          <option value="easeInOutBack">easeInOutBack</option>
          <option value="easeInElastic">easeInElastic</option>
          <option value="easeOutElastic">easeOutElastic</option>
          <option value="easeInOutElastic">easeInOutElastic</option>
          <option value="easeInBounce">easeInBounce</option>
          <option value="easeOutBounce">easeOutBounce</option>
          <option value="easeInOutBounce">easeInOutBounce</option>
        </optgroup>
      </select>
      <span class="text-xs">
        Easing functions provided by
        <a
          href="https://motion.dev/docs/easing-functions#functions"
          target="_blank"
        >
          Motion build-in easing functions
        </a>
        and
        <a href="https://easings.net" target="_blank"> easings.net </a>
        .
      </span>
    </div>
    <easing-view :easing="animationOptions.ease" />
  </div>
</template>

<style scoped></style>
