// @ts-nocheck
import * as __fd_glob_11 from "../content/docs/introduction/vehicle-api.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/introduction/pin-api.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/introduction/index.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/introduction/icons-api.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/introduction/github-stats.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/introduction/animal-api.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/advanced/index.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/api.mdx?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/introduction/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/advanced/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "advanced/meta.json": __fd_glob_1, "introduction/meta.json": __fd_glob_2, }, {"api.mdx": __fd_glob_3, "index.mdx": __fd_glob_4, "advanced/index.mdx": __fd_glob_5, "introduction/animal-api.mdx": __fd_glob_6, "introduction/github-stats.mdx": __fd_glob_7, "introduction/icons-api.mdx": __fd_glob_8, "introduction/index.mdx": __fd_glob_9, "introduction/pin-api.mdx": __fd_glob_10, "introduction/vehicle-api.mdx": __fd_glob_11, });