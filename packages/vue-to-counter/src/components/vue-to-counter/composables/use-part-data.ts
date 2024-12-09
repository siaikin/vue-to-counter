import { computed, MaybeRef, MaybeRefOrGetter, toValue, unref } from "vue";
import { PartData } from "../types";
import { transitionDigit } from "../utils/transition-digit";
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
  sampleCount?: number;
  digitToChar?: Record<string | number, string>;
  decimalSeparator?: string | undefined;
  minPlaces?: [number | undefined, number | undefined] | undefined | null;
  sampleSplit?: (samples: V[]) => V[][];
  sampleToString?: (value: V) => string;
}

export interface UsePartDataOptions {
  value: MaybeRefOrGetter<PartDataOptions["value"]>;
  numberAdapter: MaybeRefOrGetter<NumberAdapter>;
  stringAdapter: MaybeRefOrGetter<StringAdapter>;
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
    numberAdapter,
    stringAdapter,
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
      toValue(numberAdapter),
      toValue(stringAdapter),
      toValue(sampleCount) ?? 16,
      unref(sampleSplit) ?? ((samples) => [samples]),
      unref(sampleToString) ?? ((value) => numberAdapter.toString(value)),
      toValue(digitToChar) ?? {},
      toValue(decimalSeparator) ?? ".",
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
 * @param numberAdapter
 * @param stringAdapter
 * @param sampleCount
 * @param sampleSplit
 * @param sampleToString
 * @param digitToChar
 * @param decimalSeparator
 * @param minPlaces
 */
function processPartData<
  NS extends NumberAdapter,
  V = ExtractNumberAdapterType<NS>,
>(
  value: [V, V],
  numberAdapter: NS,
  stringAdapter: StringAdapter,
  sampleCount: number,
  sampleSplit: (samples: V[]) => V[][],
  sampleToString: (value: V) => string,
  digitToChar: Record<number | string, string>,
  decimalSeparator: string,
  minPlaces: [number | undefined, number | undefined] | undefined | null
) {
  const [from, to] = value;

  const result: PartData[] = [];

  /**
   * 对 {@link from} 到 {@link to} 的范围采样.
   */
  const tempParts: V[][] = sampleSplit(
    transitionDigit(
      numberAdapter,
      numberAdapter.max(from, to),
      numberAdapter.min(from, to),
      sampleCount
    )
  );

  /**
   * 将时间部分的数字转换为用于滚动的字符串数组
   */
  {
    const directionValue = numberAdapter.gt(from, to) ? "down" : "up";
    for (let i = 0; i < tempParts.length; i++) {
      const partData = tempParts[i];
      // const headNumber =
      //   partData[directionValue === "down" ? partData.length - 1 : 0];
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
            stringAdapter.stringToChars(integer)
          );
          if (decimalPlaces > 0) {
            result = result.concat(
              [decimalSeparator],
              stringAdapter.stringToChars(decimal),
              fill(new Array(filledDecimalPlaces), "0")
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
