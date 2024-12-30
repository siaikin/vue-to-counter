<script setup>
import { ref } from "vue";
import { DurationPartType } from "vue-to-counter";

const from = ref("2024-12-01T00:00:00");
const to = ref("2024-12-01T09:00:01");
</script>

<template>
  <div class="text-center py-16 overflow-hidden">
    <vue-to-counter-datetime-duration
      class="vue-to-counter-struct !text-6xl"
      :value="[from, to]"
      :initial-value="[from, from]"
      :precision="[DurationPartType.Hour, DurationPartType.Day]"
    />
  </div>
  <!--  <hr />-->
  <!--  <div class="flex gap-4">-->
  <!--    <div>-->
  <!--      <input-->
  <!--        class="border border-solid p-1"-->
  <!--        v-model="from"-->
  <!--        type="datetime-local"-->
  <!--      />-->
  <!--      ~-->
  <!--      <input-->
  <!--        class="border border-solid p-1"-->
  <!--        v-model="to"-->
  <!--        type="datetime-local"-->
  <!--      />-->
  <!--    </div>-->
  <!--    <button class="border border-solid p-1" @click="switchDatetime">-->
  <!--      切换-->
  <!--    </button>-->
  <!--  </div>-->
</template>

<style lang="scss">
@mixin component-parts__up($text, $color, $offset) {
  &::before {
    @apply content-["#{$text}"] text-xs font-bold absolute -top-#{$offset + 4} inline-block w-full text-[#{$color}];
  }
  &::after {
    @apply content-[""] text-xs absolute left-0 -top-#{$offset} inline-block w-full border-2 border-b-0 h-2 border-[#{$color}];
  }
}
@mixin component-parts__down($text, $color, $offset) {
  &::before {
    @apply content-["#{$text}"] text-xs font-bold absolute -bottom-#{$offset + 4} inline-block w-full text-[#{$color}];
  }
  &::after {
    @apply content-[""] text-xs absolute left-0 -bottom-#{$offset} inline-block w-full border-2 border-t-0 h-2 border-[#{$color}];
  }
}

@mixin component-parts__right($text, $color, $offset) {
  &::before {
    @apply content-["#{$text}"] text-xs font-bold absolute translate-x-full -right-#{$offset + 2} inline-flex items-center h-full text-[#{$color}];
  }
  &::after {
    @apply content-[""] text-xs absolute -right-#{$offset} inline-block h-full border-2 border-l-0 w-2 border-[#{$color}];
  }
}

.vue-to-counter-struct {
  @apply overflow-visible;

  //@include component-parts__up("group", var(--vp-c-red-3), 7);

  .roller-part {
    @apply p-1;
  }
  .roller-part:nth-child(1) {
    @apply relative bg-[var(--vp-c-indigo-soft)];

    @include component-parts__down("part", var(--vp-c-indigo-3), 3);

    .roller-part__wrapper {
      @apply relative mr-1 bg-[var(--vp-c-green-soft)];

      &:first-child {
        @include component-parts__up("digit", var(--vp-c-green-3), 4);
      }
    }

    .roller-part__unit {
      @apply relative mr-1 bg-[var(--vp-c-yellow-soft)];

      @include component-parts__up("suffix", var(--vp-c-yellow-3), 4);
    }
  }

  .roller-part:nth-child(2) {
    .roller-part__wrapper:nth-last-child(2) {
      .roll-item {
        @apply relative mt-1 bg-[var(--vp-c-purple-soft)];

        @include component-parts__right("cell", var(--vp-c-purple-3), 2);

        &.roll-item__tail,
        &.roll-item__head {
          @apply absolute mt-0;
        }
      }
    }
  }
}
</style>
