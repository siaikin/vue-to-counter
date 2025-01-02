<script setup>
import { computed, ref, toRaw, toRefs } from "vue";
import { data } from "../loader/component-meta.data";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const { name } = toRefs(props);

const meta = computed(() => data[name.value]);

const tab = ref("props");

const content = ref(meta.value[tab.value][0]);

const search = ref("");
const filteredItems = computed(() =>
  meta.value[tab.value].filter((item) =>
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
);
</script>

<template>
  <div class="border p-1">
    <nav class="relative flex gap-1 mb-2">
      <button
        class="border border-solid p-1"
        :class="{
          'text-[var(--vp-c-brand-1)]': tab === item,
          'bg-[var(--vp-c-brand-soft)]': tab === item,
        }"
        v-for="item in ['props', 'events', 'slots']"
        :key="item"
        @click="(tab = item), (content = meta[item]?.[0])"
      >
        {{ item }}
      </button>
      <span class="flex-auto" />
      <input
        class="border border-solid p-1"
        v-model="search"
        placeholder="Search"
      />
      <hr class="absolute bottom-0 !m-0 w-full -z-10 !border-black" />
    </nav>
    <div class="flex">
      <ul class="flex-none w-48 !list-none !p-0 !m-0 h-full overflow-y-auto">
        <li
          class="border-b p-1 cursor-pointer !mt-0"
          :class="{
            'text-[var(--vp-c-brand-1)]': toRaw(item) === toRaw(content),
            'bg-[var(--vp-c-brand-soft)]': toRaw(item) === toRaw(content),
            'border-[var(--vp-c-brand-soft)]': toRaw(item) === toRaw(content),
          }"
          v-for="item in filteredItems"
          :key="item.name"
          @click="content = item"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="border-r mx-2" />
      <section class="description flex-auto text-sm">
        <dl v-if="content">
          <dd>
            <strong>{{ content.name }}</strong
            >: {{ content.type }}
          </dd>

          <hr />

          <dt>Description</dt>
          <dd v-html="content.description"></dd>
        </dl>
        <div v-else>No data</div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.description {
  p {
    @apply my-2;
  }
}
</style>
