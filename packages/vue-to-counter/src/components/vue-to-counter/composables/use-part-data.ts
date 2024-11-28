import { computed, MaybeRefOrGetter, toValue } from "vue";
import { PartData } from "../types";
import { transitionDigit } from "../utils/transition-digit";
import { zip } from "d3-array";
import { fill } from "lodash-es";

export interface UsePartDataOptions {
  value: MaybeRefOrGetter<[number, number]>;
  onSamplePost?: (samples: number[]) => number[][];
  transformToString?: (value: number) => string;
  digitToCharMap?: MaybeRefOrGetter<Record<string, string>>;
  decimalSeparator?: MaybeRefOrGetter<string>;
  minPlaces?: MaybeRefOrGetter<
    [number | undefined, number | undefined] | undefined | null
  >;
}

export function usePartData(options: UsePartDataOptions) {
  const {
    value,
    onSamplePost,
    transformToString,
    digitToCharMap,
    decimalSeparator,
    minPlaces,
  } = options;

  return computed(() =>
    processPartData(
      toValue(value),
      onSamplePost,
      transformToString,
      toValue(digitToCharMap),
      toValue(decimalSeparator),
      toValue(minPlaces)
    )
  );
}

/**
 * process:
 * 1. 采样
 * 2. 转换
 * 3. 构造
 * @param value
 * @param onSamplePost
 * @param transformToString
 * @param digitToCharMap
 * @param decimalSeparator
 * @param minPlaces
 */
function processPartData(
  value: [number, number],
  onSamplePost: (samples: number[]) => number[][] = (samples) => [samples],
  transformToString: (value: number) => string = (value) => value.toString(),
  digitToCharMap: Record<string, string> = {},
  decimalSeparator: string = ".",
  minPlaces: [number | undefined, number | undefined] | undefined | null
) {
  const [from, to] = value;

  const result: PartData[] = [];

  /**
   * 对 {@link from} 到 {@link to} 的范围采样.
   */
  const tempParts: number[][] = onSamplePost(
    transitionDigit(Math.max(from, to), Math.min(from, to))
  );

  /**
   * 将时间部分的数字转换为用于滚动的字符串数组
   */
  {
    const directionValue = from > to ? "down" : "up";
    for (let i = 0; i < tempParts.length; i++) {
      const partData = tempParts[i];
      const headNumber =
        partData[directionValue === "down" ? partData.length - 1 : 0];
      const tailNumber =
        partData[directionValue === "down" ? 0 : partData.length - 1];

      const [minIntegerPlaces = 2, minDecimalPlaces = 0] = minPlaces ?? [];

      const numberParts = transformToString(tailNumber).split(decimalSeparator);
      const integerPlaces = Math.max(numberParts[0].length, minIntegerPlaces);
      const decimalPlaces = Math.max(
        numberParts[1]?.length ?? 0,
        minDecimalPlaces
      );

      /**
       * 使用 zip 将二维矩阵, 旋转90度
       */
      const data = zip(
        ...partData.map((value) => {
          // 保证位数一致, 向前补零
          const [integer = "", decimal = ""] =
            transformToString(value).split(decimalSeparator);

          const filledIntegerPlaces = Math.max(
            integerPlaces - integer.length,
            0
          );

          const filledDecimalPlaces = Math.max(
            decimalPlaces - decimal.length,
            0
          );

          let result = ([] as string[]).concat(
            fill(new Array(filledIntegerPlaces), "0"),
            integer.split("")
          );
          if (decimalPlaces > 0) {
            result = result.concat(
              [decimalSeparator],
              decimal.split(""),
              fill(new Array(filledDecimalPlaces), "0")
            );
          }
          return result;
        })
      )
        /**
         * 删除连续的重复项
         */
        .map((digitList) =>
          digitList
            .filter(
              (value, index, array) => index === 0 || value !== array[index - 1]
            )
            .map((value) => digitToCharMap[value] ?? value)
        );

      result.push({
        digits: data,
        headNumber,
        tailNumber,
      });
    }
  }

  return result;
}
