import { interpolateRound, interpolateNumber } from "d3-interpolate";
import { range } from "d3-array";
// import { Decimal } from "decimal.js-light";

export function transitionDigit(from: number, to: number, count: number) {
  const interpolateFunc =
    Number.isInteger(from) && Number.isInteger(to)
      ? interpolateRound(from, to)
      : interpolateNumber(from, to);

  /**
   * 将浮点数转换为整数进行插值计算, 提供与整数插值类似的效果.
   * 取最大的小数位数作为插值个数. 但不超过30.
   */
  // const maxDecimalPlaces = Number.isInteger(from - to)
  //   ? 0
  //   : Math.max(new Decimal(from).dp(), new Decimal(to).dp());
  // const multiplier = Math.pow(10, maxDecimalPlaces);
  // const count = Math.min(
  //   Math.abs(Math.floor(from * multiplier) - Math.floor(to * multiplier)) + 1,
  //   30
  // );

  // [0, 1/count, 2/count, ..., 1]
  const percents = range(count).map((d) => d / Math.max(count - 1, 1));

  const result: number[] = [];
  for (const t of percents) {
    result.push(interpolateFunc(t));
  }

  return result;
}
