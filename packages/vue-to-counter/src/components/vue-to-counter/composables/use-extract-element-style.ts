import { MaybeRefOrGetter, CSSProperties, watch, toValue, ref } from "vue";
import { useMutationObserver } from "@vueuse/core";

export function useExtractElementStyle(
  element: MaybeRefOrGetter<HTMLElement | undefined>,
  defaultStyle: MaybeRefOrGetter<CSSProperties>
) {
  const extractStyle = ref<
    Pick<CSSProperties, "color" | "backgroundImage" | "backgroundClip">
  >({});

  watch(
    [() => toValue(element), () => toValue(defaultStyle)],
    ([elementValue, defaultStyleValue]) =>
      (extractStyle.value = updateStyle(elementValue, defaultStyleValue)),
    { immediate: true }
  );
  useMutationObserver(
    element,
    () =>
      (extractStyle.value = updateStyle(
        toValue(element),
        toValue(defaultStyle)
      )),
    {
      attributes: true,
      attributeFilter: ["style", "class"],
    }
  );

  return extractStyle;
}

function updateStyle(
  elementValue: HTMLElement | undefined,
  defaultStyleValue: CSSProperties
) {
  if (!elementValue) return defaultStyleValue;

  const style = window.getComputedStyle(elementValue);

  return {
    color: style.color || defaultStyleValue.color,
    backgroundImage: style.backgroundImage || defaultStyleValue.backgroundImage,
    backgroundClip: style.backgroundClip || defaultStyleValue.backgroundClip,
  };
}
