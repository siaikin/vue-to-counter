<script setup>
const animationOptions = ({ testResults }) => {
  let count = 0;

  return testResults.map((part) =>
    part.map((digit) => {
      if (!digit.animate) return;
      const delay = count++ * 0.1 * 0.5;

      return {
        repeat: Infinity,
        duration: 8,
        times: [0, delay, 0.25 + delay, 1],
      };
    })
  );
};

const keyframes = ({ testResults, direction }) => {
  return testResults.map((part) =>
    part.map((digit) => {
      if (!digit.animate) return;
      return {
        up: {
          transform: [
            "translateY(0)",
            "translateY(0)",
            "translateY(-100%)",
            "translateY(-100%)",
          ],
        },
        down: {
          transform: [
            "translateY(0)",
            "translateY(0)",
            "translateY(100%)",
            "translateY(100%)",
          ],
        },
      }[direction];
    })
  );
};
</script>

<template>
  <div class="text-center">
    <VueToCounterString
      class="vue-to-count-logo font-bold !text-6xl border-[#7a7374] rounded border-8"
      color="#ed556a"
      value="0A文"
      style="font-family: &quot;PingFang SC&quot;, sans-serif"
      initial-value="012"
      :part-data-options="{ sampleCount: 2 }"
      :animation-options="animationOptions"
      :keyframes="keyframes"
      :cell-style="
        ({ data }) => {
          return data.map((partData) =>
            partData.digits.map((digit) =>
              digit.data.map((char) =>
                char === '文'
                  ? {
                      fontSize: '0.8em',
                      marginTop: '6px',
                    }
                  : { margin: '0 4px' }
              )
            )
          );
        }
      "
    />
  </div>
</template>

<style lang="scss">
.vue-to-count-logo {
  .roller-part__wrapper {
    @apply border-r-8 border-r-[#7a7374];

    &:last-child {
      @apply border-r-0;
    }
  }
}
</style>
