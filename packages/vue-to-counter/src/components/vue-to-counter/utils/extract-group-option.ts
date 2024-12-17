import {
  GroupValueOrGetter,
  PartValueOrGetter,
  ExtractGroupValue,
  ExtractPartValue,
  GroupGetter,
  PartDigitValueOrGetter,
  PartDigitCellValueOrGetter,
  ExtractPartDigitCellValue,
  ExtractPartDigitValue,
  GroupGetterOptions,
} from "../types";
import { isArray, isFunction } from "lodash-es";

export function extractGroupOption<
  P extends GroupValueOrGetter<unknown>,
  Result = ExtractGroupValue<P>,
>(option: P, getterOptions: GroupGetterOptions) {
  return (
    isFunction(option)
      ? (option as GroupGetter<ExtractGroupValue<P>>)(getterOptions)
      : option
  ) as Result;
}

export function extractPartOption<
  P extends PartValueOrGetter<unknown>,
  Result = ExtractPartValue<P>,
>(option: P, getterOptions: GroupGetterOptions) {
  const groupOption = extractGroupOption(option, getterOptions);

  const { data } = getterOptions;

  const result: Result[] = [];
  for (let i = 0; i < data.length; i++) {
    const value = isArray(groupOption) ? groupOption[i] : groupOption;
    result.push(value);
  }

  return result;
}

export function extractPartDigitOption<
  P extends PartDigitValueOrGetter<unknown>,
  Result = ExtractPartDigitValue<P>,
>(option: P, getterOptions: GroupGetterOptions) {
  const extractedOption = extractPartOption(option, getterOptions);

  const { data } = getterOptions;

  const result: Result[][] = [];
  for (let i = 0; i < data.length; i++) {
    const { digits } = data[i];
    const partOption = extractedOption[i];

    result.push([]);

    for (let j = 0; j < digits.length; j++) {
      const value = isArray(partOption) ? partOption[j] : partOption;
      result[i].push(value);
    }
  }

  return result;
}

export function extractPartDigitCellOption<
  P extends PartDigitCellValueOrGetter<unknown>,
  Result = ExtractPartDigitCellValue<P>,
>(option: P, getterOptions: GroupGetterOptions) {
  const extractedOption = extractPartDigitOption(option, getterOptions);

  const { data } = getterOptions;

  const result: Result[][][] = [];
  for (let i = 0; i < data.length; i++) {
    const { digits } = data[i];
    const partOption = extractedOption[i];

    result.push([]);

    for (let j = 0; j < digits.length; j++) {
      const { data } = digits[j];
      const partDigitOption = partOption[j];

      result[i].push([]);

      for (let k = 0; k < data.length; k++) {
        const value = isArray(partDigitOption)
          ? partDigitOption[k]
          : partDigitOption;
        result[i][j].push(value);
      }
    }
  }

  return result;
}
