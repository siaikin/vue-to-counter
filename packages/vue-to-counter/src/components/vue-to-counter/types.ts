import { PartDataOptions } from "./composables/use-part-data";
import { NumberAdapter, BuildInNumberAdapter } from "../../number-adapter";
import { RollerPartTestResult } from "./composables/use-roller-part-test";
import { BuildInStringAdapter, StringAdapter } from "../../string-adapter";
import { CSSProperties, PropType, SlotsType } from "vue";
import type { DOMKeyframesDefinition } from "motion";
import type { DynamicAnimationOptions } from "framer-motion/dom";
import type { Decimal } from "decimal.js";

export const VueToCounterBaseProps = <T>() =>
  ({
    /**
     * 如果初始值被设置, 组件初始化时会使用该值而不是 `value`, 然后在初始化完成后, 将内部值更新为 `value`.
     *
     * 这可以实现在初始化完成后启动动画效果非常有用.
     */
    initialValue: {
      type: null as unknown as PropType<T>,
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
     * @default 继承自父元素.
     *
     * @example "red" 红色
     * @example "transparent" 透明
     * @example "linear-gradient(90deg, red, blue)" 红蓝渐变
     * @example "url('https://example.com/image.png')" 图片背景
     */
    color: {
      type: String,
      default: "inherit",
    },
    /**
     * 当**位数不足**时, 强制补全的 [整数, 小数] 位数. 为空时位数自适应.
     */
    minPlaces: {
      type: Array as unknown as PropType<[number, number]>,
    },
    /**
     * 可以通过该属性将数字转换为你想要的任意字符串.
     */
    digitToChar: {
      type: [Object, Array] as PropType<
        Record<string | number, string> | string[]
      >,
    },
    /**
     * 传递给 motion 接口的选项.
     */
    animationOptions: {
      type: [Object, Array, Function] as PropType<
        PartDigitValueOrGetter<DynamicAnimationOptions>
      >,
    },
    keyframes: {
      type: [Object, Array, Function] as PropType<
        PartDigitValueOrGetter<DOMKeyframesDefinition>
      >,
    },
    /**
     * 数字适配器, 有以下两种:
     * 1. BuildInNumberAdapter(默认): 使用内置 number 进行计算.
     * 2. DecimalJsAdapter: 使用 Decimal.js 进行计算.
     *
     * 详细信息请查看[字符长度限制](/guide/optional-dependencies#字符长度限制)章节.
     *
     * @default BuildInNumberAdapter
     */
    numberAdapter: {
      type: Object as PropType<NumberAdapter>,
      default: () => BuildInNumberAdapter(),
    },
    /**
     * 字符串适配器, 有以下两种:
     * 1. BuildInStringAdapter(默认): 使用内置 string 进行字符串处理.
     * 2. BuildInIntlSegmenterAdapter: 使用 Intl.Segmenter 进行字符串处理. 能够支持 emoji, 字符集.
     * 3. GraphemeSplitterAdapter: 使用 grapheme-splitter 进行字符串处理. 能够支持 emoji, 字符集.
     *
     * 详细信息请查看[支持 emoji 分词](/guide/optional-dependencies#支持-emoji-分词)章节.
     *
     * @default BuildInStringAdapter
     */
    stringAdapter: {
      type: Object as PropType<StringAdapter>,
      default: () => BuildInStringAdapter(),
    },
    /**
     * 这是 `usePartData` 的配置项. `usePartData` 被用于从数值的变化中生成用于滚动的数据.
     * 这里不会有太多解释, 因为它是一个底层的配置项. 你可以查看 `usePartData` 的源码了解更多信息.
     *
     * * `sampleToString`: 用于将采样的数据转换为字符串.
     * * `sampleCount`: 采样的数量.
     * * `sampleSplit`: 用于将采样的数据分割为多个部分.
     * * `decimalSeparator`: 小数点分隔符.
     * * `fillChar`: 用于填充空白的字符.
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
     * 对 `cell` 部分的样式进行设置. 传入的对象将被直接应用到 `cell` 的 `style` 上.
     */
    cellStyle: {
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
export const VueToCounterBaseSlots = {} as SlotsType<{
  default?: void;
  /**
   * 内容将被放置在滚动内容的前面.
   */
  prefix?: void;
  /**
   * 内容将被放置在每个 part 的后面.
   */
  partSuffix?: { partData: PartData; index: number };
  /**
   * 内容将被放置在滚动内容的后面.
   */
  suffix?: void;
}>;
export const VueToCounterBaseEmits = {
  /**
   * 在所有 `digit` 开始滚动之前触发.
   */
  rollAnimationStart: ({
    testResults,
    data,
  }: Omit<GroupGetterOptions, "value">) => testResults.length && data.length,
  /**
   * 在所有 `digit` 滚动结束后触发.
   */
  rollAnimationEnd: ({
    testResults,
    data,
  }: Omit<GroupGetterOptions, "value">) => testResults.length && data.length,
} as const;

export const VueToCounterDatetimeProps = () =>
  ({
    ...VueToCounterBaseProps<Date | number | string>(),
    /**
     * 传入 `number`, `string` 时, `value` 将作为创建 `Date` 的参数.
     */
    value: {
      type: null as unknown as PropType<Date | number | string>,
      required: true,
    },
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
    minPlaces: {
      type: Array as unknown as PropType<[number, number]>,
      default: () => [2, 0],
    },
  }) as const;

export const VueToCounterDatetimeDurationProps = () => {
  const vueToCounterDatetimeProps = VueToCounterDatetimeProps();
  return {
    ...VueToCounterBaseProps<
      [Date | number | string, Date | number | string]
    >(),
    /**
     * 要求传入一个长度为 2 的数组, 分别表示开始时间和结束时间.
     *
     * 传入 `number`, `string` 时, `value` 将作为创建 `Date` 的参数.
     */
    value: {
      type: null as unknown as PropType<
        [Date | number | string, Date | number | string]
      >,
      required: true,
    },
    precision: vueToCounterDatetimeProps.precision,
    minPlaces: vueToCounterDatetimeProps.minPlaces,
  } as const;
};

export const VueToCounterNumberProps = () =>
  ({
    ...VueToCounterBaseProps<number | string>(),
    /**
     * 当数字足够大使得 `Number` 丢失精度时, 可以使用 `DecimalJsAdapter` 作为适配器. 并使用 `string` 作为 `value` 的类型.
     */
    value: {
      type: null as unknown as PropType<number | string>,
      required: true,
    },
    /**
     * 本地化数字格式化配置. 传入 `true` 时使用浏览器的默认配置.
     *
     * 详细配置参数请参考 [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)
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
    /**
     * 支持传入 `string`, 其中每个字符在去重后作为一个进制位, 然后将字符串转换为数字进行插值.
     * 例: "Hello" -> ["H", "e", "l", "o"] 得到一个四进制映射数组. "Hello" 可以转换为四进制数, 进而转换为十进制数.
     */
    value: {
      type: null as unknown as PropType<string>,
      required: true,
    },
    /**
     * 自定义字符集, 传入的 `value` 的字符串表示形式的每个字符都**必须**被包含在该字符集中.
     *
     * @default 则设置为 `value` 的去重字符集.
     */
    alphabet: {
      type: String,
    },
  }) as const;

export const VueToCounterProps = () =>
  ({
    ...VueToCounterBaseProps<number | Decimal>(),
    /**
     * 支持的数值类型有 `number`, 和 `Decimal`.
     * 1. `number`: 表示一个整数或浮点数. 内部直接根据数字进行插值.
     // * 3. {@link number[]} 表示一个整数数组. 这是 {@link string} 的变体, 数字数组的每一项表示一个代码点,
     // *    内部通过 {@link String.fromCodePoint} 将其转换为字符串, 然后按照 {@link string} 的规则进行插值.
     * 4. `Decimal`: 表示一个 Decimal.js 实例.
     */
    value: {
      type: null as unknown as PropType<number | Decimal>,
      required: true,
    },
    /**
     * 旧值, 我们通过新值和旧值的变化来生成滚动数据. 默认情况下, 旧值为 @default `value` 的上一个值.
     *
     * 在某些情况下, 你可能不希望使用默认值, 这时你可以通过该属性传入旧值.
     */
    oldValue: {
      type: null as unknown as PropType<number | Decimal>,
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
  /**
   * `digit` 的额外数据
   */
  testResults: RollerPartTestResult[][];
  /**
   * 用于生成滚动列表的数据.
   */
  data: PartData[];
  /**
   * 滚动方向.
   */
  direction: "up" | "down";
  /**
   * 导致这次滚动发生的值. [新值, 旧值].
   */
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
