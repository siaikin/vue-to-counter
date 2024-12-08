declare module "vue" {
  export interface GlobalComponents {
    VueToCounter: (typeof import("vue-to-counter"))["VueToCounter"];
    VueToCounterDatetimeDuration: (typeof import("vue-to-counter"))["VueToCounterDatetimeDuration"];
    VueToCounterNumber: (typeof import("vue-to-counter"))["VueToCounterNumber"];
    VueToCounterString: (typeof import("vue-to-counter"))["VueToCounterString"];
  }
}

export {};
