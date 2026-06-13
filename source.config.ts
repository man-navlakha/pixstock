import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export const mechanicSetuDocs = defineDocs({
  dir: "content/mechanic-setu-docs",
});

export default defineConfig();
