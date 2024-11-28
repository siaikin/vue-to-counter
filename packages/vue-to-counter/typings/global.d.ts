declare module "vue" {
  export interface GlobalComponents {
    VueToCounterDatetime: (typeof import("vue-to-counter"))["VueToCounterDatetime"];
  }
}

export {};
