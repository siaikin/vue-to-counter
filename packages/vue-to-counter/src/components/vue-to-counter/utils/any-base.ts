/**
 * @license https://github.com/HarasimowiczKamil/any-base
 */

export function anyBase(srcAlphabet: string, dstAlphabet: string) {
  return (number: string) => convert(srcAlphabet, dstAlphabet, number);
}

function convert(srcAlphabet: string, dstAlphabet: string, number: string) {
  let i, divide, newLen;
  let length = number.length;
  const numberMap: Record<string, number> = {};
  const fromBase = srcAlphabet.length;
  const toBase = dstAlphabet.length;
  const result = [];

  if (!isValid(number, srcAlphabet)) {
    throw new Error(
      `Number "${number}" contains of non-alphabetic digits (${srcAlphabet})`
    );
  }

  if (srcAlphabet === dstAlphabet) {
    return number;
  }

  for (i = 0; i < length; i++) {
    numberMap[i] = srcAlphabet.indexOf(number[i]);
  }
  do {
    divide = 0;
    newLen = 0;
    for (i = 0; i < length; i++) {
      divide = divide * fromBase + numberMap[i];
      if (divide >= toBase) {
        numberMap[newLen++] = Math.floor(divide / toBase);
        divide = divide % toBase;
      } else if (newLen > 0) {
        numberMap[newLen++] = 0;
      }
    }
    length = newLen;
    result.push(dstAlphabet[divide]);
  } while (newLen !== 0);

  return result.reverse().join("");
}

function isValid(number: string, alphabet: string) {
  let i = 0;
  for (; i < number.length; ++i) {
    if (alphabet.indexOf(number[i]) === -1) {
      return false;
    }
  }
  return true;
}

export const BIN = "01";
export const OCT = "01234567";
export const DEC = "0123456789";
export const HEX = "0123456789abcdef";
