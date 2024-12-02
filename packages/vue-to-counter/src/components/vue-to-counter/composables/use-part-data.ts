import { computed, MaybeRef, MaybeRefOrGetter, toValue, unref } from "vue";
import { PartData } from "../types";
import { transitionDigit } from "../utils/transition-digit";
import { zip } from "d3-array";
import { fill } from "lodash-es";

export interface PartDataOptions {
  value: [number, number];
  sampleCount?: number;
  digitToChar?: Record<string | number, string>;
  decimalSeparator?: string | undefined;
  minPlaces?: [number | undefined, number | undefined] | undefined | null;
  sampleSplit?: (samples: number[]) => number[][];
  sampleToString?: (value: number) => string;
}

interface UsePartDataOptions {
  value: MaybeRefOrGetter<PartDataOptions["value"]>;
  sampleCount?: MaybeRefOrGetter<PartDataOptions["sampleCount"]>;
  digitToChar?: MaybeRefOrGetter<PartDataOptions["digitToChar"]>;
  decimalSeparator?: MaybeRefOrGetter<PartDataOptions["decimalSeparator"]>;
  minPlaces?: MaybeRefOrGetter<PartDataOptions["minPlaces"]>;
  sampleSplit?: MaybeRef<PartDataOptions["sampleSplit"]>;
  sampleToString?: MaybeRef<PartDataOptions["sampleToString"]>;
}

export function usePartData(options: UsePartDataOptions) {
  const {
    value,
    sampleCount,
    sampleSplit,
    sampleToString,
    decimalSeparator,
    digitToChar,
    minPlaces,
  } = options;

  return computed(() =>
    processPartData(
      toValue(value),
      toValue(sampleCount),
      unref(sampleSplit),
      unref(sampleToString),
      toValue(digitToChar),
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
 * @param sampleCount
 * @param sampleSplit
 * @param sampleToString
 * @param digitToChar
 * @param decimalSeparator
 * @param minPlaces
 */
function processPartData(
  value: [number, number],
  sampleCount: number = 30,
  sampleSplit: (samples: number[]) => number[][] = (samples) => [samples],
  sampleToString: (value: number) => string = (value) => value.toString(10),
  digitToChar: Record<number | string, string> = {},
  decimalSeparator: string = ".",
  minPlaces: [number | undefined, number | undefined] | undefined | null
) {
  const [from, to] = value;

  const result: PartData[] = [];

  /**
   * 对 {@link from} 到 {@link to} 的范围采样.
   */
  const tempParts: number[][] = sampleSplit(
    transitionDigit(Math.max(from, to), Math.min(from, to), sampleCount)
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

      const numberParts = sampleToString(tailNumber).split(decimalSeparator);
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
            sampleToString(value).split(decimalSeparator);

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
            .map((value) => digitToChar[value] ?? value)
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
