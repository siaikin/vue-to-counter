import { createMarkdownRenderer } from "vitepress";
import type { SiteConfig } from "vitepress";
import { fileURLToPath } from "url";
import { glob } from "glob";
import { resolve } from "path";
import { readFileSync } from "fs";

type ComponentMetaData = {
  name: string;
  props: {
    name: string;
    description: string;
    required: boolean;
    type: string;
    default: string;
    tags: {
      name: string;
      text?: string;
    }[];
  }[];
  events: {
    name: string;
    description: string;
    type: string;
  }[];
  slots: {
    name: string;
    description: string;
    type: string;
  }[];
};

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const files = await glob(["component-meta/*.json"], {
  cwd: resolve(__dirname, "../../vue-to-counter"),
  absolute: true,
});
const componentMeta = files.map((file) =>
  JSON.parse(readFileSync(file, "utf-8"))
);

function createComponentMetaLoader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: SiteConfig = (global as any).VITEPRESS_CONFIG;
  if (!config) {
    throw new Error(
      "content loader invoked without an active vitepress process, " +
        "or before vitepress config is resolved."
    );
  }

  return {
    async load(): Promise<Record<string, ComponentMetaData>> {
      const md = await createMarkdownRenderer(
        config.srcDir,
        config.markdown,
        config.site.base,
        config.logger
      );

      const result: Record<string, ComponentMetaData> = {};
      for (const meta of componentMeta) {
        const cloned: ComponentMetaData = JSON.parse(JSON.stringify(meta));

        for (const prop of cloned.props) {
          prop.description = md.render(prop.description);
          prop.tags = prop.tags.map((tag) => ({
            ...tag,
            text: md.render(tag.text || ""),
          }));
        }

        for (const event of cloned.events) {
          event.description = md.render(event.description);
        }

        for (const slot of cloned.slots) {
          slot.description = md.render(slot.description);
        }

        result[cloned.name] = cloned;
      }

      return result;
    },
  };
}

export default createComponentMetaLoader();
