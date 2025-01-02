/**
 * @see https://github.com/vueComponent/ant-design-vue/blob/main/site/src/utils/generateOnlineDemo.ts
 */

import { getParameters } from "codesandbox/lib/api/define";
import packageInfo from "../package.json";

const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Vue To Counter Demo</title>
    <style>
      body {
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;

const appVue = `<template>
<Demo />
</template>

<script setup>
import { defineComponent } from "vue";
import Demo from "./demo.vue";
</script>`;

const mainJs = `import { createApp } from 'vue';
import VueToCounter from 'vue-to-counter';
import App from './App';
import 'vue-to-counter/dist/style.css';

const app = createApp(App);

app.use(VueToCounter).mount('#app');
`;

function getDeps(code: string) {
  const deps: Record<string, string> = Object.assign(
    {},
    packageInfo.dependencies,
    packageInfo.devDependencies
  );
  return (code.match(/from '([^']+)';\n/g) || [])
    .map((v) => v.slice(6, v.length - 3))
    .reduce(
      (prevV, dep) => {
        prevV[dep] = deps[dep] || "latest";
        return prevV;
      },
      {} as Record<string, string>
    );
}

type Meta = {
  title: string;
};

// codeSandbox
export function getCodeSandboxParams(code: string, meta: Meta): string {
  return getParameters({
    files: {
      "package.json": {
        content: JSON.stringify(
          {
            title: meta.title,
            dependencies: {
              ...getDeps(code),
              "vue-to-counter": packageInfo.version,
            },
          },
          undefined,
          2
        ),
        isBinary: false,
      },
      "index.html": {
        content: indexHtml,
        isBinary: false,
      },
      "src/demo.vue": {
        content: code,
        isBinary: false,
      },
      "src/App.vue": {
        content: appVue,
        isBinary: false,
      },
      "src/main.js": {
        content: mainJs,
        isBinary: false,
      },
    },
  });
}
