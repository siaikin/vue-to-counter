import * as Components from "./components";
import type { App } from "vue";
import type { Component, Plugin } from "vue";

export function install(app: App) {
  const keys = Object.keys(Components);
  console.log(Components);
  keys.forEach((key) => {
    const component = (Components as Record<string, Component>)[key];
    app.use(installToVue(key, component));
  });
}

function installToVue<T extends Component>(
  componentName: string,
  component: T
): Plugin {
  return {
    install: (app) => {
      app.component(componentName, component);
    },
  };
}

export * from "./types.ts";
export * from "./components";
