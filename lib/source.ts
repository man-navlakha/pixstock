import { docs, mechanicSetuDocs } from "@/.source/server";
import { loader } from "fumadocs-core/source";

export const pixstockSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

export const mechanicSetuSource = loader({
  baseUrl: "/mechanic-setu/docs",
  source: mechanicSetuDocs.toFumadocsSource(),
});

export const source = pixstockSource;
