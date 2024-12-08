import { NumberAdapter } from "./types.ts";

const BuildInBigintAdapter: () => NumberAdapter<bigint> = () => ({
  create(value: string | number | bigint): bigint {
    return BigInt(value);
  },
  add(a, b) {
    return a + b;
  },
  sub(a, b) {
    return a - b;
  },
  mul(a, b) {
    return a * b;
  },
  div(a, b) {
    return a / b;
  },
  compare(a, b) {
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  },
  eq(a, b) {
    return a === b;
  },
  gt(a, b) {
    return a > b;
  },
  gte(a, b) {
    return a >= b;
  },
  lt(a, b) {
    return a < b;
  },
  lte(a, b) {
    return a <= b;
  },
  isInteger() {
    return true;
  },
  isNegative(a) {
    return a < 0n;
  },
  isPositive(a) {
    return a > 0n;
  },
  isZero(a) {
    return a === 0n;
  },
  isNaN() {
    return false;
  },
  isFinite() {
    return true;
  },
  abs(a) {
    return a < 0n ? -a : a;
  },
  ceil(a) {
    return a;
  },
  floor(a) {
    return a;
  },
  round(a) {
    return a;
  },
  max(a, b) {
    return a > b ? a : b;
  },
  min(a, b) {
    return a < b ? a : b;
  },
  toNumber(a) {
    return Number(a);
  },
  toString(a) {
    return a.toString();
  },
});

export { BuildInBigintAdapter };
