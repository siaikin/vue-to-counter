/**
 * Copy from animejs
 *
 * @see https://github.com/juliangarnier/anime/blob/d85a64227c7bd4edfd2134970220deb0dff590ce/src/index.js#L259
 */

function minMax(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// Easings

function parseEasingParameters(easingString: string): number[] {
  const match = /\(([^)]+)\)/.exec(easingString);
  return match ? match[1].split(",").map((p) => parseFloat(p)) : [];
}

// Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function

// function steps(steps: number = 10): (t: number) => number {
//   return (t: number) => Math.ceil(minMax(t, 0.000001, 1) * steps) * (1 / steps);
// }

// BezierEasing https://github.com/gre/bezier-easing

// const bezier = (() => {
//   const kSplineTableSize = 11;
//   const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
//
//   function A(aA1: number, aA2: number): number {
//     return 1.0 - 3.0 * aA2 + 3.0 * aA1;
//   }
//   function B(aA1: number, aA2: number): number {
//     return 3.0 * aA2 - 6.0 * aA1;
//   }
//   function C(aA1: number): number {
//     return 3.0 * aA1;
//   }
//
//   function calcBezier(aT: number, aA1: number, aA2: number): number {
//     return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
//   }
//   function getSlope(aT: number, aA1: number, aA2: number): number {
//     return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
//   }
//
//   function binarySubdivide(
//     aX: number,
//     aA: number,
//     aB: number,
//     mX1: number,
//     mX2: number
//   ): number {
//     let currentX,
//       currentT,
//       i = 0;
//     do {
//       currentT = aA + (aB - aA) / 2.0;
//       currentX = calcBezier(currentT, mX1, mX2) - aX;
//       if (currentX > 0.0) {
//         aB = currentT;
//       } else {
//         aA = currentT;
//       }
//     } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
//     return currentT;
//   }
//
//   function newtonRaphsonIterate(
//     aX: number,
//     aGuessT: number,
//     mX1: number,
//     mX2: number
//   ): number {
//     for (let i = 0; i < 4; ++i) {
//       const currentSlope = getSlope(aGuessT, mX1, mX2);
//       if (currentSlope === 0.0) return aGuessT;
//       const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
//       aGuessT -= currentX / currentSlope;
//     }
//     return aGuessT;
//   }
//
//   function bezier(
//     mX1: number,
//     mY1: number,
//     mX2: number,
//     mY2: number
//   ): ((x: number) => number) | undefined {
//     if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) return;
//     const sampleValues = new Float32Array(kSplineTableSize);
//
//     if (mX1 !== mY1 || mX2 !== mY2) {
//       for (let i = 0; i < kSplineTableSize; ++i) {
//         sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
//       }
//     }
//
//     function getTForX(aX: number): number {
//       let intervalStart = 0;
//       let currentSample = 1;
//       const lastSample = kSplineTableSize - 1;
//
//       for (
//         ;
//         currentSample !== lastSample && sampleValues[currentSample] <= aX;
//         ++currentSample
//       ) {
//         intervalStart += kSampleStepSize;
//       }
//
//       --currentSample;
//
//       const dist =
//         (aX - sampleValues[currentSample]) /
//         (sampleValues[currentSample + 1] - sampleValues[currentSample]);
//       const guessForT = intervalStart + dist * kSampleStepSize;
//       const initialSlope = getSlope(guessForT, mX1, mX2);
//
//       if (initialSlope >= 0.001) {
//         return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
//       } else if (initialSlope === 0.0) {
//         return guessForT;
//       } else {
//         return binarySubdivide(
//           aX,
//           intervalStart,
//           intervalStart + kSampleStepSize,
//           mX1,
//           mX2
//         );
//       }
//     }
//
//     return (x: number) => {
//       if (mX1 === mY1 && mX2 === mY2) return x;
//       if (x === 0 || x === 1) return x;
//       return calcBezier(getTForX(x), mY1, mY2);
//     };
//   }
//
//   return bezier;
// })();

const penner = (() => {
  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)

  const eases: {
    [key: string]: (a?: number, b?: number) => (t: number) => number;
  } = { linear: () => (t: number) => t };

  const functionEasings: {
    [key: string]: (a?: number, b?: number) => (t: number) => number;
  } = {
    Sine: () => (t: number) => 1 - Math.cos((t * Math.PI) / 2),
    Expo: () => (t: number) => (t ? Math.pow(2, 10 * t - 10) : 0),
    Circ: () => (t: number) => 1 - Math.sqrt(1 - t * t),
    Back: () => (t: number) => t * t * (3 * t - 2),
    Bounce: () => (t: number) => {
      let pow2,
        b = 4;
      while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {
        /* empty */
      }
      return (
        1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2)
      );
    },
    Elastic: (amplitude: number = 1, period: number = 0.5) => {
      const a = minMax(amplitude, 1, 10);
      const p = minMax(period, 0.1, 2);
      return (t: number) => {
        return t === 0 || t === 1
          ? t
          : -a *
              Math.pow(2, 10 * (t - 1)) *
              Math.sin(
                ((t - 1 - (p / (Math.PI * 2)) * Math.asin(1 / a)) *
                  (Math.PI * 2)) /
                  p
              );
      };
    },
  };

  const baseEasings = ["Quad", "Cubic", "Quart", "Quint"];

  baseEasings.forEach((name, i) => {
    functionEasings[name] = () => (t: number) => Math.pow(t, i + 2);
  });

  Object.keys(functionEasings).forEach((name) => {
    const easeIn = functionEasings[name];
    eases["easeIn" + name] = easeIn;
    eases["easeOut" + name] = (a?: number, b?: number) => (t: number) =>
      1 - easeIn(a, b)(1 - t);
    eases["easeInOut" + name] = (a?: number, b?: number) => (t: number) =>
      t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
    eases["easeOutIn" + name] = (a?: number, b?: number) => (t: number) =>
      t < 0.5
        ? (1 - easeIn(a, b)(1 - t * 2)) / 2
        : (easeIn(a, b)(t * 2 - 1) + 1) / 2;
  });

  return eases;
})();

export function parseEasings(easing: EasingTypes) {
  if (typeof easing === "function") return easing;
  const name = easing.split("(")[0];
  const ease = penner[name];

  if (!ease) return ease;

  const args = parseEasingParameters(easing);
  return ease(...args);
}

/**
 * Copy from @types/animejs
 *
 * @see https://www.npmjs.com/package/@types/animejs
 */
type EasingTypes =
  | "easeInQuad"
  | "easeInCubic"
  | "easeInQuart"
  | "easeInQuint"
  | "easeInSine"
  | "easeInExpo"
  | "easeInCirc"
  | "easeInBack"
  | "easeInElastic"
  | "easeInBounce"
  | "easeOutQuad"
  | "easeOutCubic"
  | "easeOutQuart"
  | "easeOutQuint"
  | "easeOutSine"
  | "easeOutExpo"
  | "easeOutCirc"
  | "easeOutBack"
  | "easeOutElastic"
  | "easeOutBounce"
  | "easeInOutQuad"
  | "easeInOutCubic"
  | "easeInOutQuart"
  | "easeInOutQuint"
  | "easeInOutSine"
  | "easeInOutExpo"
  | "easeInOutCirc"
  | "easeInOutBack"
  | "easeInOutElastic"
  | "easeInOutBounce";
