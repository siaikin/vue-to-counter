import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInQuarters,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  subDays,
  subHours,
  subMilliseconds,
  subMinutes,
  subMonths,
  subQuarters,
  subSeconds,
  subWeeks,
  subYears,
} from "date-fns";
import { differenceInMilliseconds } from "date-fns/differenceInMilliseconds";
import { DurationPartType } from "../types";

/**
 * 计算两个日期之间的时间间隔. 返回一个数组, 包含 {@link parts} 每个部分的值.
 *
 * @example duration(new Date("2022-01-01"), new Date("2022-01-02"), [DurationPartType.Day, DurationPartType.Hour, DurationPartType.Minute, DurationPartType.Second]) // [1, 0, 0, 0]
 * @example duration(new Date("2022-01-01 12:00:00"), new Date("2022-01-02 12:30:00"), [DurationPartType.Day, DurationPartType.Hour, DurationPartType.Minute, DurationPartType.Second]) // [1, 0, 30, 0]
 *
 * @param start
 * @param end
 * @param parts
 */
export function durationObject(
  start: Date,
  end: Date,
  parts: DurationPartType[]
): { [key in DurationPartType]?: number } {
  const result: { [key in DurationPartType]?: number } = {};
  for (const part of parts) {
    let value = 0;

    switch (part) {
      case DurationPartType.Year:
        value = differenceInYears(end, start);
        end = subYears(end, value);
        break;
      case DurationPartType.Quarter:
        value = differenceInQuarters(end, start);
        end = subQuarters(end, value);
        break;
      case DurationPartType.Month:
        value = differenceInMonths(end, start);
        end = subMonths(end, value);
        break;
      case DurationPartType.Week:
        value = differenceInWeeks(end, start);
        end = subWeeks(end, value);
        break;
      case DurationPartType.Day:
        value = differenceInDays(end, start);
        end = subDays(end, value);
        break;
      case DurationPartType.Hour:
        value = differenceInHours(end, start);
        end = subHours(end, value);
        break;
      case DurationPartType.Minute:
        value = differenceInMinutes(end, start);
        end = subMinutes(end, value);
        break;
      case DurationPartType.Second:
        value = differenceInSeconds(end, start);
        end = subSeconds(end, value);
        break;
      case DurationPartType.Millisecond:
        value = differenceInMilliseconds(end, start);
        end = subMilliseconds(end, value);
        break;
    }

    result[part] = value;
  }

  return result;
}

export function duration(
  start: Date,
  end: Date,
  parts: DurationPartType[]
): number[] {
  const obj = durationObject(start, end, parts);
  return parts.map((part) => obj[part]) as number[];
}
