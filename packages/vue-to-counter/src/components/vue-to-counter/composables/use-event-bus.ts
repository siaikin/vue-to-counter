import mitt, { type Emitter } from "mitt";
import { inject, provide, EmitFn, onUnmounted } from "vue";

export type ExtractEmitParameters<
  T extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => any;
  },
> = {
  [P in keyof T]: Parameters<T[P]>[0];
};

const innerKey = Symbol();
export function useEventBus<
  T extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => any;
  },
>(key: string | symbol = innerKey, emit?: EmitFn<T>) {
  const { emitter } = inject<{
    emitter: Emitter<ExtractEmitParameters<T>>;
  }>(key, { emitter: mitt() });

  provide(key, { emitter });

  onUnmounted(() => emitter.all.clear());

  if (emit) {
    emitter.on("*", (type, event) => {
      emit(type as string, event);
    });
  }

  return {
    emitter,
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  };
}
