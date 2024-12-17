import { PartDataOptions } from "./composables/use-part-data";
import { NumberAdapter, BuildInNumberAdapter } from "../../number-adapter";
import { RollerPartTestResult } from "./composables/use-roller-part-test";
import { BuildInStringAdapter, StringAdapter } from "../../string-adapter";
import { CSSProperties, PropType, SlotsType } from "vue";

export const VueToCounterBaseProps = <T>() =>
  ({
    value: {
      type: null as unknown as PropType<T>,
      required: true,
    },
    /**
     * 如果初始值被设置, 组件初始化时会使用该值而不是 `value`, 然后在初始化完成后, 将内部值更新为 `value`.
     *
     * 这可以实现在初始化完成后启动动画效果非常有用.
     */
    initialValue: {
      type: null as unknown as PropType<T>,
    },
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
     * @default 使用当前元素设置的颜色, 通常为黑色.
     *
     * @example "red" 红色
     * @example "transparent" 透明
     * @example "linear-gradient(90deg, red, blue)" 红蓝渐变
     * @example "url('https://example.com/image.png')" 图片背景
     */
    color: {
      type: String,
      default: "black",
    },
    /**
     * 当**位数不足**时, 强制补全的 [整数, 小数] 位数. 为空时位数自适应.
     */
    minPlaces: {
      type: Array as unknown as PropType<[number, number]>,
      default: () => [2, 0],
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
     * 传递给 {@link HTMLElement.animate} 接口的选项.
     * 目前仅支持 {@link KeyframeAnimationOptions.easing} 和 {@link KeyframeAnimationOptions.delay} 选项.
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
      type: Object as PropType<
        Partial<
          Pick<
            PartDataOptions,
            | "sampleToString"
            | "sampleCount"
            | "sampleSplit"
            | "decimalSeparator"
            | "fillChar"
          >
        >
      >,
      default: () => ({}),
    },
    /**
     * 对滚轮数字部分的样式进行设置. 传入的对象将被直接应用到滚轮数字部分的样式上.
     *
     * 查看 {@link PartDigitCellValueOrGetter} 了解不同的参数类型对应的精度.
     */
    digitStyle: {
      type: [Object, Array, Function] as PropType<
        PartDigitCellValueOrGetter<CSSProperties>
      >,
    },
    /**
     * 等效与 prefix slot. 当存在 prefix slot 时, 该属性无效.
     */
    prefix: {
      type: String,
    },
    /**
     * 等效与 suffix slot. 当存在 suffix slot 时, 该属性无效.
     */
    suffix: {
      type: String,
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
export const VueToCounterBaseSlots = {} as SlotsType<
  Partial<{
    default: void;
    prefix: void;
    partSuffix: { partData: PartData; index: number };
    suffix: void;
  }>
>;

export const VueToCounterDatetimeProps = () =>
  ({
    ...VueToCounterBaseProps<Date | number | string>(),
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

export const VueToCounterDatetimeDurationProps = () =>
  ({
    ...VueToCounterDatetimeProps(),
    value: {
      type: Array as PropType<(Date | number | string)[]>,
      required: true,
    },
  }) as const;

export const VueToCounterNumberProps = () =>
  ({
    ...VueToCounterBaseProps<number | string | bigint>(),
    /**
     * 本地化数字格式化配置. 传入 `true` 时使用默认配置.
     *
     * 详细配置参数请参考 {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat}
     *
     * @default false
     */
    localeNumber: {
      type: [Object, Boolean] as PropType<Intl.NumberFormatOptions | boolean>,
      default: false,
    },
  }) as const;

export const VueToCounterStringProps = () =>
  ({
    ...VueToCounterBaseProps<string>(),
    digitToChar: {
      type: [Object, Array] as PropType<
        Record<string | number, string> | string[]
      >,
      default: undefined,
    },
  }) as const;

/**
 * 支持的数值类型有 {@link number}, {@link number[]} 和 {@link string}.
 * 1. {@link number} 表示一个整数或浮点数. 内部直接根据数字进行插值.
 * 2. {@link string} 表示一个字符串. 其中每个字符在去重后作为一个进制位, 然后将字符串转换为数字进行插值.
 *    例: "Hello" -> ["H", "e", "l", "o"] 得到一个四进制映射数组. "Hello" 可以转换为四进制数, 进而转换为十进制数.
 * 3. {@link number[]} 表示一个整数数组. 这是 {@link string} 的变体, 数字数组的每一项表示一个代码点,
 *    内部通过 {@link String.fromCodePoint} 将其转换为字符串, 然后按照 {@link string} 的规则进行插值.
 * 4. {@link bigint} 表示一个大整数. 内部直接根据数字进行插值.
 */
export const VueToCounterProps = () =>
  ({
    ...VueToCounterBaseProps<number | number[] | string | bigint>(),
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

export interface GroupAnimationOptions {
  easing?: PartDigitValueOrGetter<AnimationOptions["easing"]>;
  delay?: PartDigitValueOrGetter<AnimationOptions["delay"]>;
  iterations?: PartDigitValueOrGetter<AnimationOptions["iterations"]>;
  duration?: PartDigitValueOrGetter<AnimationOptions["duration"]>;
  endDelay?: PartDigitValueOrGetter<AnimationOptions["endDelay"]>;
  keyframe?: PartDigitValueOrGetter<AnimationOptions["keyframe"]>;
}
export interface AnimationOptions {
  easing?: KeyframeEffectOptions["easing"];
  delay?: KeyframeEffectOptions["delay"];
  iterations?: KeyframeEffectOptions["iterations"];
  duration?: KeyframeEffectOptions["duration"];
  endDelay?: KeyframeEffectOptions["endDelay"];
  keyframe?: PropertyIndexedKeyframes;
}

export const VueToCounterPropsReturn = VueToCounterProps();
export const VueToCounterDatetimePropsReturn = VueToCounterDatetimeProps();
export const VueToCounterDatetimeDurationPropsReturn =
  VueToCounterDatetimeDurationProps();
export const VueToCounterNumberPropsReturn = VueToCounterNumberProps();
export const VueToCounterStringPropsReturn = VueToCounterStringProps();

/**
 * 1. T: 单个数值. 为所有 part 下的 digit 使用 T.
 * 2. T[]: 数组数值. 为第 `i` 个 part 下的所有 digit 使用 `T[i]` 值.
 * 3. T[][]: 二维数组数值. 为第 `i` 个 part 下的第 `j` 个 digit 使用 `T[i][j]` 值.
 * 4. (data: PartData[]) => T | T[] | T[][]: 同上
 */
export type GroupValue<T> = T | undefined;
export type GroupGetterOptions = {
  testResults: RollerPartTestResult[][];
  data: PartData[];
  direction: "up" | "down";
  value: [unknown, unknown];
};
export type GroupGetter<T> = (options: GroupGetterOptions) => GroupValue<T>;
export type GroupValueOrGetter<T> = GroupValue<T> | GroupGetter<T>;

export type PartValue<T> = GroupValue<T> | GroupValue<T[]>;
export type PartGetter<T> = GroupGetter<T> | GroupGetter<T[]>;
export type PartValueOrGetter<T> = PartValue<T> | PartGetter<T>;

export type PartDigitValue<T> = PartValue<T> | PartValue<T[]>;
export type PartDigitGetter<T> = PartGetter<T> | PartGetter<T[]>;
export type PartDigitValueOrGetter<T> = PartDigitValue<T> | PartDigitGetter<T>;

export type PartDigitCellValue<T> = PartValue<T> | PartValue<T[]>;
export type PartDigitCellGetter<T> = PartGetter<T> | PartGetter<T[]>;
export type PartDigitCellValueOrGetter<T> =
  | PartDigitCellValue<T>
  | PartDigitCellGetter<T>;

export type ExtractGroupValue<T> =
  T extends GroupValueOrGetter<infer U>
    ? U extends Array<infer V>
      ? V
      : U
    : never;

export type ExtractPartValue<T> =
  T extends PartValueOrGetter<infer U>
    ? U extends Array<infer V>
      ? ExtractGroupValue<V>
      : U
    : never;

export type ExtractPartDigitValue<T> =
  T extends PartDigitValueOrGetter<infer U>
    ? U extends Array<infer V>
      ? ExtractPartValue<V>
      : U
    : never;

export type ExtractPartDigitCellValue<T> =
  T extends PartDigitCellValueOrGetter<infer U>
    ? U extends Array<infer V>
      ? ExtractPartDigitValue<V>
      : U
    : never;
