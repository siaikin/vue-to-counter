<script setup>
import { ref, onMounted, watch, computed } from "vue";

const fonts = ref([]);
const searchQuery = ref("");
const selectedFont = defineModel("modelValue");

const fetchFonts = async () => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/webfonts/v1/webfonts?" +
        new URLSearchParams({
          key: "AIzaSyBJPgjEPn1iDes5wLzDF-JMEst6QdR4skU",
          capability: "WOFF2",
          sort: "popularity",
        }).toString()
    ); // Replace with your Google Fonts API key
    const data = await response.json();
    fonts.value = data.items;
  } catch (error) {
    console.error("Error fetching fonts:", error);
  }
};

const filteredFonts = computed(() => {
  if (!searchQuery.value) {
    return fonts.value;
  }
  return fonts.value.filter((font) =>
    font.family.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const loadFont = (fontName) => {
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

watch(selectedFont, (newFont) => {
  if (newFont) {
    loadFont(newFont);
  }
});

onMounted(async () => {
  await fetchFonts();
  selectedFont.value = "Ingrid Darling";

  // await nextTick();

  // document
  //   .querySelector(`#${selectedFont.value.replaceAll(" ", "-")}`)
  //   ?.scrollIntoView();
});

// 自动加载选择框中可见字体的预览menu字体
watch(
  filteredFonts,
  (newFonts) => {
    newFonts.forEach((font) => {
      const previewFamily = joinPreviewFamily(font.family);

      const fontFace = new FontFace(previewFamily, `url(${font.menu})`, {
        display: "swap",
      });
      document.fonts.add(fontFace);
    });
  },
  { immediate: true }
);
function joinPreviewFamily(family) {
  return [...family.split(" "), "PREVIEW"].join("-");
}
</script>

<template>
  <div class="flex-none flex flex-col">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for fonts"
      class="w-full border border-solid p-1 self-start"
    />
    <a
      href="https://developers.google.com/fonts"
      target="_blank"
      class="mt-1 text-xs"
    >
      Data provided by Google Fonts API
    </a>
  </div>
  <div
    class="flex-auto font-list-container border border-solid p-1 overflow-y-scroll h-64"
  >
    <div
      v-for="font in filteredFonts"
      :key="font.family"
      :id="font.family.replace(' ', '-')"
      :style="{ fontFamily: joinPreviewFamily(font.family) }"
      class="font-item p-2 cursor-pointer"
      :class="{
        'bg-gray-200': selectedFont === font.family,
      }"
      @click="selectedFont = font.family"
    >
      {{ font.family }}
    </div>
  </div>
</template>

<style scoped>
.font-list-container {
  max-height: 16rem;
}
.font-item:hover {
  background-color: #f0f0f0;
}
</style>
