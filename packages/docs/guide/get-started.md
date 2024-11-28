# Getting Started

## Prerequisites

- [Vue.js](https://vuejs.org/) 3.x

## Installation

::: code-group

```shell [npm]
$ npm install vue-to-print --save
```

```shell [pnpm]
$ pnpm add vue-to-print
```

```shell [yarn]
$ yarn add vue-to-print
```

:::

## Usage

<script setup lang="ts">
import { ref } from "vue";
  
const from = ref(new Date());
console.log(from);
const to = ref(new Date("2024-12-31"));
</script>

<div class="flex gap-4">
<label>
form
    <input type="date" v-model="from" />
</label>
</div>

<VueToCounterDatetime class="text-2xl" :from="from" :to="to" />

## Online Example

<a href="https://stackblitz.com/edit/vitejs-vite-32bxkk?file=src%2Fcomponents%2FComponentToPrint.vue">
  <img
    alt="Open in StackBlitz"
    src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"
  />
</a>
