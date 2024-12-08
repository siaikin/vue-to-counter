import {
  ExtractNumberAdapterType,
  NumberAdapter,
} from "../../../number-adapter";

export function transitionDigit<
  NS extends NumberAdapter,
  V = ExtractNumberAdapterType<NS>,
>(na: NS, from: V, to: V, count: number) {
  const interpolateFunc =
    na.isInteger(from) && na.isInteger(to)
      ? interpolateRound(na, from, to)
      : interpolateNumber(na, from, to);

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

  if (na.eq(from, to)) count = 1;
  // [0, 1/count, 2/count, ..., 1]
  // const percents = range(count).map((d) => d / Math.max(count - 1, 1));

  const result: V[] = [];
  for (let i = 0; i < count; i++) {
    const percent = na.div(na.create(i), na.create(Math.max(count - 1, 1)));
    // const percent = i / Math.max(count - 1, 1);
    result.push(interpolateFunc(percent));
  }

  return result;
}

/**
 * @see https://github.com/d3/d3-interpolate/blob/main/src/round.js
 * @param na
 * @param a
 * @param b
 */
function interpolateRound<
  NS extends NumberAdapter,
  V = ExtractNumberAdapterType<NS>,
>(na: NS, a: V, b: V) {
  return function (t: V) {
    console.log(`
      a: ${na.toString(a)},
      b: ${na.toString(b)},
      t: ${t},
      1 - t: ${na.toString(na.sub(na.create(1), t))},
      a * (1 - t): ${na.toString(na.mul(a, na.sub(na.create(1), t)))},
      b * t: ${na.toString(na.mul(b, t))}
      a * (1 - t) + b * t: ${na.toString(
        na.add(na.mul(a, na.sub(na.create(1), t)), na.mul(b, t))
      )}
    `);
    return na.round(na.add(na.mul(a, na.sub(na.create(1), t)), na.mul(b, t)));
  };
}

/**
 * @see https://github.com/d3/d3-interpolate/blob/main/src/number.js
 * @param na
 * @param a
 * @param b
 */
function interpolateNumber<
  NS extends NumberAdapter,
  V = ExtractNumberAdapterType<NS>,
>(na: NS, a: V, b: V) {
  return function (t: V) {
    return na.add(na.mul(a, na.sub(na.create(1), t)), na.mul(b, t));
  };
}
