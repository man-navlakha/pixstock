"use client";

import { useMemo, useState } from "react";

const themes = ["dark", "light"] as const;

type Theme = (typeof themes)[number];

export default function IconsLivePreview() {
  const [icons, setIcons] = useState("java,kotlin,nodejs,figma");
  const [theme, setTheme] = useState<Theme>("dark");
  const [perline, setPerline] = useState(15);

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams({
      i: icons.trim() || "java,kotlin,nodejs,figma",
      theme,
      perline: String(perline),
    });

    return `https://img-server-theta.vercel.app/icons?${params.toString()}`;
  }, [icons, perline, theme]);

  const markdown = `![Tech Stack Icons](${imageUrl})`;

  return (
    <section className="my-8 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]">
        <div className="border-b border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 lg:border-b-0 lg:border-r">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
              Icons playground
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Enter comma-separated technologies to generate a branded SVG grid.
            </p>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Technologies
            </span>
            <input
              value={icons}
              onChange={(event) => setIcons(event.target.value)}
              placeholder="html,css,js,react"
              className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            />
          </label>

          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Use comma-separated tech names or aliases, such as{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              java,kotlin,nodejs
            </code>
            .
          </p>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Theme
            </span>
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as Theme)}
              className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm capitalize text-zinc-950 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            >
              {themes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Icons per line
            </span>
            <div className="mt-2 flex h-10 items-center gap-3">
              <input
                type="range"
                min="1"
                max="50"
                value={perline}
                onChange={(event) => setPerline(Number(event.target.value))}
                className="w-full accent-zinc-950 dark:accent-white"
              />
              <span className="w-10 text-right text-sm text-zinc-600 dark:text-zinc-400">
                {perline}
              </span>
            </div>
          </label>

          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Controls how many icons appear before wrapping.
          </p>
        </div>

        <div className="bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(244,244,245,0.88))] p-5 dark:bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.15),transparent_42%),linear-gradient(to_bottom,rgba(9,9,11,0.88),rgba(0,0,0,0.96))]">
          <div className="flex min-h-44 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white/70 p-4 dark:border-zinc-800 dark:bg-black/35">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Tech stack icons preview"
              className="h-auto max-w-full"
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Markdown embed
            </p>
            <pre className="overflow-x-auto rounded-md border border-zinc-200 bg-white p-4 text-xs leading-6 text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-black dark:text-zinc-200">
              <code>{markdown}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
