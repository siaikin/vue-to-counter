import { computed, MaybeRefOrGetter, toValue, unref } from "vue";
import { PartData } from "../types";
import { zip } from "d3-array";
import { fill } from "lodash-es";
import {
  ExtractNumberAdapterType,
  NumberAdapter,
} from "../../../number-adapter";
import { StringAdapter } from "../../../string-adapter";

export interface PartDataOptions<V = ExtractNumberAdapterType<NumberAdapter>> {
  value: [V, V];
  numberAdapter: NumberAdapter;
  stringAdapter: StringAdapter;
  sampleCount: number;
  digitToChar: Record<string | number, string>;
  decimalSeparator: string;
  minPlaces: [number | undefined, number | undefined];
  fillChar: string;
  sampling: (na: NumberAdapter, from: V, to: V) => V[];
  sampleSplit: (samples: V[]) => V[][];
  sampleToString: (value: V) => string;
}

export function usePartData(
  value: MaybeRefOrGetter<PartDataOptions["value"]>,
  numberAdapter: MaybeRefOrGetter<PartDataOptions["numberAdapter"]>,
  stringAdapter: MaybeRefOrGetter<PartDataOptions["stringAdapter"]>,
  options: MaybeRefOrGetter<
    Omit<PartDataOptions, "value" | "numberAdapter" | "stringAdapter">
  >
) {
  return computed(() => {
    const {
      sampling,
      sampleSplit,
      sampleToString,
      decimalSeparator,
      digitToChar,
      minPlaces,
      fillChar,
    } = toValue(options);

    return processPartData(
      toValue(value),
      toValue(numberAdapter),
      toValue(stringAdapter),
      unref(sampling),
      unref(sampleSplit),
      unref(sampleToString),
      toValue(digitToChar),
      toValue(decimalSeparator),
      toValue(minPlaces),
      toValue(fillChar)
    );
  });
}

/**
 * process:
 * 1. 采样
 * 2. 转换
 * 3. 构造
 * @param value
 * @param numberAdapter
 * @param stringAdapter
 * @param sampling
 * @param sampleSplit
 * @param sampleToString
 * @param digitToChar
 * @param decimalSeparator
 * @param minPlaces
 * @param fillChar
 */
function processPartData(
  value: PartDataOptions["value"],
  numberAdapter: PartDataOptions["numberAdapter"],
  stringAdapter: PartDataOptions["stringAdapter"],
  sampling: PartDataOptions["sampling"],
  sampleSplit: PartDataOptions["sampleSplit"],
  sampleToString: PartDataOptions["sampleToString"],
  digitToChar: PartDataOptions["digitToChar"],
  decimalSeparator: PartDataOptions["decimalSeparator"],
  minPlaces: PartDataOptions["minPlaces"],
  fillChar: PartDataOptions["fillChar"]
) {
  const [from, to] = value;

  const result: PartData[] = [];

  /**
   * 对 {@link from} 到 {@link to} 的范围采样.
   */
  const tempParts = sampleSplit(sampling(numberAdapter, from, to));

  /**
   * 将时间部分的数字转换为用于滚动的字符串数组
   *
   * headNumber: 最先显示的数字. 向下滚动时, 为滚动列表的最后一个数字, 向上滚动时相反.
   * tailNumber: 最后显示的数字. 向下滚动时, 为滚动列表的第一个数字, 向上滚动时相反.
   */
  {
    const directionValue = numberAdapter.gt(from, to) ? "down" : "up";
    for (let i = 0; i < tempParts.length; i++) {
      const partData = tempParts[i];
      // const headNumber =
      //   partData[directionValue === "down" ? partData.length - 1 : 0];
      const tailNumber =
        partData[directionValue === "down" ? 0 : partData.length - 1];

      const [minIntegerPlaces = 1, minDecimalPlaces = 0] = minPlaces;

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
            fill(new Array(filledIntegerPlaces), fillChar),
            stringAdapter.stringToChars(integer)
          );
          if (decimalPlaces > 0) {
            result = result.concat(
              [decimalSeparator],
              stringAdapter.stringToChars(decimal),
              fill(new Array(filledDecimalPlaces), fillChar)
            );
          }
          return result;
        })
      )
        /**
         * 删除连续的重复项
         */
        .map((digitList, index, array) => ({
          data: digitList
            .filter(
              (value, index, array) => index === 0 || value !== array[index - 1]
            )
            .map((value) => digitToChar[value] ?? value),
          place: array.length - index,
        }));

      result.push({
        digits: data,
      });
    }
  }

  return result;
}
