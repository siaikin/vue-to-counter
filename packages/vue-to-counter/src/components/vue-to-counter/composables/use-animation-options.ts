import { MaybeRefOrGetter, ref, toValue, watch } from "vue";
import { AnimationOptions, GroupAnimationOptions, PartData } from "../types";
import { isArray, isFunction } from "lodash-es";
import { RollerPartTestResult } from "./use-roller-part-test";

const animationOptionsKeys: (keyof GroupAnimationOptions)[] = [
  "easing",
  "delay",
];

export function useAnimationOptions(
  testResult: MaybeRefOrGetter<RollerPartTestResult[][]>,
  data: MaybeRefOrGetter<PartData[]>,
  groupAnimationOptions: MaybeRefOrGetter<Partial<GroupAnimationOptions>>
) {
  const animationOptions = ref<Partial<AnimationOptions>[][]>([]);

  watch(
    [
      () => toValue(testResult),
      () => toValue(data),
      () => toValue(groupAnimationOptions),
    ],
    ([testResultValue, dataValue, animationOptionsValue]) => {
      const result: Partial<AnimationOptions>[][] = [];

      const animationPropertyValues = animationOptionsKeys.map((key) => {
        const value = animationOptionsValue?.[key];
        return isFunction(value) ? value(testResultValue, dataValue) : value;
      });
      for (let i = 0; i < dataValue.length; i++) {
        const partData = dataValue[i];
        const animationPropertyPartValues = animationPropertyValues.map(
          (value) => (isArray(value) ? value[i] : value)
        );

        const resultPartValue: Partial<AnimationOptions>[] = [];
        for (let j = 0; j < partData.digits.length; j++) {
          const animationPropertyPartDigitValues =
            animationPropertyPartValues.map((value) =>
              isArray(value) ? value[j] : value
            );
          resultPartValue.push(
            animationOptionsKeys.reduce((result, key, index) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              result[key] = animationPropertyPartDigitValues[index];
              return result;
            }, {} as Partial<AnimationOptions>)
          );
        }
        result.push(resultPartValue);
      }

      animationOptions.value = result;
    },
    { immediate: true }
  );

  return {
    animationOptions,
  };
}
