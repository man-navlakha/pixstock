// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"api.mdx": () => import("../content/docs/api.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "advanced/index.mdx": () => import("../content/docs/advanced/index.mdx?collection=docs"), "introduction/animal-api.mdx": () => import("../content/docs/introduction/animal-api.mdx?collection=docs"), "introduction/github-stats.mdx": () => import("../content/docs/introduction/github-stats.mdx?collection=docs"), "introduction/icons-api.mdx": () => import("../content/docs/introduction/icons-api.mdx?collection=docs"), "introduction/index.mdx": () => import("../content/docs/introduction/index.mdx?collection=docs"), "introduction/pin-api.mdx": () => import("../content/docs/introduction/pin-api.mdx?collection=docs"), "introduction/vehicle-api.mdx": () => import("../content/docs/introduction/vehicle-api.mdx?collection=docs"), }),
  mechanicSetuDocs: create.doc("mechanicSetuDocs", {"api.mdx": () => import("../content/mechanic-setu-docs/api.mdx?collection=mechanicSetuDocs"), "auth.mdx": () => import("../content/mechanic-setu-docs/auth.mdx?collection=mechanicSetuDocs"), "index.mdx": () => import("../content/mechanic-setu-docs/index.mdx?collection=mechanicSetuDocs"), "user-profile.mdx": () => import("../content/mechanic-setu-docs/user-profile.mdx?collection=mechanicSetuDocs"), }),
};
export default browserCollections;