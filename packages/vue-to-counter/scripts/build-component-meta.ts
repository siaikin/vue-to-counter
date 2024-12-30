/**
 * @see https://github.com/jd-solanki/anu/blob/main/scripts/gen-component-meta.ts
 */

import fs, { existsSync, mkdirSync } from "fs";
import { glob } from "glob";
import { join, parse, resolve } from "path";
import { fileURLToPath } from "url";

import { createChecker } from "vue-component-meta";
import type { MetaCheckerOptions, ComponentMeta } from "vue-component-meta";

// SECTION Types
export interface ComponentApiProps {
  name: ComponentMeta["props"][number]["name"];
  description: ComponentMeta["props"][number]["description"];

  required: ComponentMeta["props"][number]["required"];
  type: ComponentMeta["props"][number]["type"];
  default: ComponentMeta["props"][number]["default"];
  tags: ComponentMeta["props"][number]["tags"];
}

export interface ComponentApi {
  name: string;
  props: ComponentApiProps[];
  events: ComponentMeta["events"];
  slots: ComponentMeta["slots"];
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  printer: { newLine: 1 },
};

const tsconfigChecker = createChecker(
  resolve(__dirname, "../tsconfig.app.json"),
  checkerOptions
);

const filterMeta = (
  meta: ComponentMeta,
  componentName: string
): ComponentApi => {
  // const clonedMeta: ComponentMeta = JSON.parse(JSON.stringify(meta))

  // Exclude global props
  const props: ComponentApiProps[] = [];
  meta.props.forEach((prop) => {
    if (prop.global) return;

    const {
      name,
      description,
      required,
      type,
      default: defaultValue,
      tags,
    } = prop;

    const defaultTag = tags.find((tag) => tag.name === "default");

    props.push({
      name: `${name}${required ? "" : "?"}`,
      description: description,
      required,

      type,
      default: defaultValue || defaultTag?.text || "unknown",
      tags,
    });
  });

  return {
    name: componentName,
    props,
    events: meta.events,
    slots: meta.slots,
  };
};

// Collect components
const components = await glob(["src/components/**/*.tsx"], {
  cwd: resolve(__dirname, "../"),
  absolute: true,
});

// Generate component meta
components.forEach((componentPath) => {
  const componentName = parse(componentPath).name;

  const meta = filterMeta(
    tsconfigChecker.getComponentMeta(componentPath),
    componentName
  );

  const metaDirPath = resolve(__dirname, "../component-meta");

  // if meta dir doesn't exist create
  if (!existsSync(metaDirPath)) mkdirSync(metaDirPath);

  const metaJsonFilePath = join(metaDirPath, `${componentName}.json`);
  fs.writeFileSync(metaJsonFilePath, JSON.stringify(meta, null, 4));
});
