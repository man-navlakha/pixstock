"use client";

import { useMemo, useState } from "react";

const themes = ["dark", "light", "ocean"] as const;

type Theme = (typeof themes)[number];

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-zinc-300 text-zinc-950 accent-zinc-950 focus:ring-zinc-500 dark:border-zinc-700 dark:accent-white"
      />
    </label>
  );
}

export default function StatsLivePreview() {
  const [username, setUsername] = useState("man-navlakha");
  const [theme, setTheme] = useState<Theme>("dark");
  const [showLanguages, setShowLanguages] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  const [showBorder, setShowBorder] = useState(true);
  const [compact, setCompact] = useState(false);

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams({
      username: username.trim() || "man-navlakha",
      theme,
      show_languages: String(showLanguages),
      show_avatar: String(showAvatar),
      show_border: String(showBorder),
      compact: String(compact),
    });

    return `https://img-server-theta.vercel.app/api/stats?${params.toString()}`;
  }, [compact, showAvatar, showBorder, showLanguages, theme, username]);

  const markdown = `![GitHub Stats Card](${imageUrl})`;

  return (
    <section className="my-8 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <div className="border-b border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 lg:border-b-0 lg:border-r">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
              Live playground
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Configure a card and copy the generated Markdown embed.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Username
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="github-login"
                className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
              />
            </label>

            <label className="block">
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

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <Toggle
                checked={showLanguages}
                label="Show languages"
                onChange={setShowLanguages}
              />
              <Toggle
                checked={showAvatar}
                label="Show avatar"
                onChange={setShowAvatar}
              />
              <Toggle
                checked={showBorder}
                label="Show border"
                onChange={setShowBorder}
              />
              <Toggle checked={compact} label="Compact" onChange={setCompact} />
            </div>
          </div>
        </div>

        <div className="bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(244,244,245,0.88))] p-5 dark:bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.15),transparent_42%),linear-gradient(to_bottom,rgba(9,9,11,0.88),rgba(0,0,0,0.96))]">
          <div className="flex min-h-72 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white/70 p-4 dark:border-zinc-800 dark:bg-black/35">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`${username || "GitHub"} stats card preview`}
              className="h-auto max-w-full rounded-md"
            />
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Markdown embed
              </p>
            </div>
            <pre className="overflow-x-auto rounded-md border border-zinc-200 bg-white p-4 text-xs leading-6 text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-black dark:text-zinc-200">
              <code>{markdown}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
