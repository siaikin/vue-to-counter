import { PartDataOptions } from "./composables/use-part-data.ts";
import { NumberAdapter, BuildInNumberAdapter } from "../../number-adapter";
import { RollerPartTestResult } from "./composables/use-roller-part-test.ts";
import { BuildInStringAdapter, StringAdapter } from "../../string-adapter";
import { PropType } from "vue";

export const VueToCounterBaseProps = () =>
  ({
    /**
     * 动画持续时间, 单位为毫秒.
     *
     * @default 1000
     */
    duration: {
      type: Number,
      default: 1000,
    },
    /**
     * 自定义本地化配置, 否则从浏览器环境中获取.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale
     *
     * @default "en-US"
     */
    locale: {
      type: [String, Array] as PropType<
        | Intl.UnicodeBCP47LocaleIdentifier
        | [Intl.UnicodeBCP47LocaleIdentifier, Intl.LocaleOptions]
      >,
      default: "en-US",
    },
    /**
     * 文本颜色, 可使用 CSS 属性 `color` 和 `background-image` 的值.
     *
     * @default "white"
     *
     * @example "red" 红色
     * @example "transparent" 透明
     * @example "linear-gradient(90deg, red, blue)" 红蓝渐变
     * @example "url('https://example.com/image.png')" 图片背景
     */
    color: {
      type: String,
      default: "white",
    },
    /**
     * 当**位数不足**时, 强制补全的 [整数, 小数] 位数. 为空时位数自适应.
     */
    minPlaces: {
      type: Array as unknown as PropType<[number, number]>,
    },
    /**
     * 可以通过该属性将数字转换为你想要的任意字符串.
     *
     * @default ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
     */
    digitToChar: {
      type: [Object, Array] as PropType<
        Record<string | number, string> | string[]
      >,
      default: () => ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    },
    /**
     * 动画选项. 目前仅支持 `easing`.
     */
    animationOptions: {
      type: Object as PropType<Partial<GroupAnimationOptions>>,
    },
    /**
     * @see {@link NumberAdapter}
     *
     * @default {@Link BuildInNumberAdapter}
     */
    numberAdapter: {
      type: Object as PropType<NumberAdapter>,
      default: () => BuildInNumberAdapter(),
    },
    /**
     * @see {@link StringAdapter}
     *
     * @default {@Link BuildInStringAdapter}
     */
    stringAdapter: {
      type: Object as PropType<StringAdapter>,
      default: () => BuildInStringAdapter(),
    },
    /**
     * @see {@link usePartData}
     */
    partDataOptions: {
      type: Object as PropType<Partial<PartDataOptions<NumberAdapter>>>,
    },
    /**
     * 调试模式下将:
     * 1. 不再隐藏溢出的数字. overflow: hidden; -> overflow: visible;
     *
     * @default false
     */
    debug: {
      type: Boolean,
      default: false,
    },
  }) as const;

export const VueToCounterDatetimeProps = () =>
  ({
    value: {
      type: [Date, Number, String] as PropType<Date | number | string>,
      required: true,
    },
    ...VueToCounterBaseProps(),
    /**
     * 计数器显示的精度.
     * 1. 当为单个值时, 表示最小精度.
     * 2. 当为数组时, 第一个值表示最小精度, 第二个值表示最大精度.
     *
     * @default [DurationPartType.Second, DurationPartType.Day]
     *
     * @example DurationPartType.Second 显示从年份到秒数的所有精度.
     * @example [DurationPartType.Second, DurationPartType.Day] 显示从天数到秒数的所有精度.
     * @example [DurationPartType.Millisecond, DurationPartType.Year] 显示从年份到毫秒的所有精度.
     */
    precision: {
      type: [String, Array] as PropType<
        DurationPartType | [DurationPartType, DurationPartType]
      >,
      default: () => [DurationPartType.Second, DurationPartType.Day],
    },
  }) as const;

export const VueToCounterDatetimeDuration = () =>
  ({
    value: {
      type: [Date, Number, String] as PropType<Date | number | string>,
      required: true,
    },
    ...VueToCounterBaseProps(),
    /**
     * 同 {@link VueToCounterDatetimeProps.precision}.
     */
    precision: {
      type: [String, Array] as PropType<
        DurationPartType | [DurationPartType, DurationPartType]
      >,
    },
  }) as const;

export const VueToCounterNumberProps = () =>
  ({
    value: {
      type: [Number, String, BigInt] as PropType<number | string | bigint>,
      required: true,
    },
    ...VueToCounterBaseProps(),
    localeNumber: {
      type: Object as PropType<Intl.NumberFormatOptions>,
    },
  }) as const;

export const VueToCounterStringProps = () =>
  ({
    value: {
      type: [String] as PropType<string>,
      required: true,
    },
    ...VueToCounterBaseProps(),
    digitToChar: {
      type: [Object, Array] as PropType<
        Record<string | number, string> | string[]
      >,
      default: undefined,
    },
  }) as const;

export const VueToCounterProps = () =>
  ({
    /**
     * 支持的数值类型有 {@link number}, {@link number[]} 和 {@link string}.
     * 1. {@link number} 表示一个整数或浮点数. 内部直接根据数字进行插值.
     * 2. {@link string} 表示一个字符串. 其中每个字符在去重后作为一个进制位, 然后将字符串转换为数字进行插值.
     *    例: "Hello" -> ["H", "e", "l", "o"] 得到一个四进制映射数组. "Hello" 可以转换为四进制数, 进而转换为十进制数.
     * 3. {@link number[]} 表示一个整数数组. 这是 {@link string} 的变体, 数字数组的每一项表示一个代码点,
     *    内部通过 {@link String.fromCodePoint} 将其转换为字符串, 然后按照 {@link string} 的规则进行插值.
     * 4. {@link bigint} 表示一个大整数. 内部直接根据数字进行插值.
     */
    value: {
      type: [Number, String, BigInt, Array] as PropType<
        number | number[] | string | bigint
      >,
      required: true,
    },
    ...VueToCounterBaseProps(),
    /**
     * 自定义字符集, 传入的 {@link value} 的字符串表示形式的每个字符都必须被包含在该字符集中.
     *
     * @default 从 {@link digitToChar} 中获取.
     */
    alphabet: {
      type: String,
    },
    tag: {
      type: String,
      default: "span",
    },
  }) as const;

export interface PartData {
  /**
   * 每个数字数位用于过渡动画的数据.
   * @example 1 -> 10
   * [
   *   ["0", "1"], // 第一个数位
   *   ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], // 第二个数位
   * ]
   */
  digits: PartDataDigit[];
  /**
   * 运动方向的头部数字. 向下运动时该值为数组的最后一个元素. 向上运动时该值为数组的第一个元素.
   * @deprecated
   */
  headNumber?: number;
  /**
   * 运动方向的尾部数字.
   @deprecated
   */
  tailNumber?: number;
}

export interface PartDataDigit {
  data: string[];
  /**
   * 这是数字的第几位
   * @example 1024 -> 4 是第 1 位, 2 是第 2 位, 0 是第 3 位, 1 是第 4 位
   */
  place: number;
}

export enum DurationPartType {
  Millisecond = "millisecond",
  Second = "second",
  Minute = "minute",
  Hour = "hour",
  Day = "day",
  Week = "week",
  Month = "month",
  Quarter = "quarter",
  Year = "year",
}

export const DurationPartMillisecond = {
  [DurationPartType.Millisecond]: 1,
  [DurationPartType.Second]: 1000,
  [DurationPartType.Minute]: 60000,
  [DurationPartType.Hour]: 3600000,
  [DurationPartType.Day]: 86400000,
  [DurationPartType.Week]: 604800000,
  [DurationPartType.Month]: 2629800000,
  [DurationPartType.Quarter]: 7889400000,
  [DurationPartType.Year]: 31557600000,
} as const;

export const DurationPartMillisecondToType = {
  1: DurationPartType.Millisecond,
  1000: DurationPartType.Second,
  60000: DurationPartType.Minute,
  3600000: DurationPartType.Hour,
  86400000: DurationPartType.Day,
  604800000: DurationPartType.Week,
  2629800000: DurationPartType.Month,
  7889400000: DurationPartType.Quarter,
  31557600000: DurationPartType.Year,
} as const;

/**
 * 1. T: 单个数值. 为所有 part 下的 digit 使用 T.
 * 2. T[]: 数组数值. 为第 `i` 个 part 下的所有 digit 使用 `T[i]` 值.
 * 3. T[][]: 二维数组数值. 为第 `i` 个 part 下的第 `j` 个 digit 使用 `T[i][j]` 值.
 * 4. (data: PartData[]) => T | T[] | T[][]: 同上
 */
type GroupValueOrGetter<T> =
  | T
  | T[]
  | T[][]
  | ((
      testResult: RollerPartTestResult[][],
      data: PartData[]
    ) => T | T[] | T[][]);

export interface GroupAnimationOptions {
  easing: GroupValueOrGetter<AnimationOptions["easing"]>;
  delay: GroupValueOrGetter<AnimationOptions["delay"]>;
}
export interface AnimationOptions {
  easing: Required<KeyframeEffectOptions["easing"]>;
  delay: Required<KeyframeEffectOptions["delay"]>;
}
