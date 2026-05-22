"use client";

import { useMemo, useState } from "react";

const themes = ["react", "dark", "light"] as const;

type Theme = (typeof themes)[number];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

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
        className="h-4 w-4 rounded border-zinc-300 accent-zinc-950 dark:border-zinc-700 dark:accent-white"
      />
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-zinc-800";

export default function PinLivePreview() {
  const [username, setUsername] = useState("man-navlakha");
  const [repo, setRepo] = useState("blog_ms");
  const [theme, setTheme] = useState<Theme>("react");
  const [showIcons, setShowIcons] = useState(true);
  const [hideBorder, setHideBorder] = useState(false);
  const [showOwner, setShowOwner] = useState(true);
  const [showLanguage, setShowLanguage] = useState(true);
  const [bgColor, setBgColor] = useState("");
  const [titleColor, setTitleColor] = useState("");
  const [iconColor, setIconColor] = useState("");
  const [cardWidth, setCardWidth] = useState(430);
  const [borderRadius, setBorderRadius] = useState(16);

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams({
      username: username.trim() || "man-navlakha",
      repo: repo.trim() || "blog_ms",
      theme,
      show_icons: String(showIcons),
      hide_border: String(hideBorder),
      show_owner: String(showOwner),
      show_language: String(showLanguage),
      card_width: String(cardWidth),
      border_radius: String(borderRadius),
    });

    if (bgColor.trim()) params.set("bg_color", bgColor.trim().replace("#", ""));
    if (titleColor.trim()) {
      params.set("title_color", titleColor.trim().replace("#", ""));
    }
    if (iconColor.trim()) {
      params.set("icon_color", iconColor.trim().replace("#", ""));
    }

    return `https://img-server-theta.vercel.app/api/pin?${params.toString()}`;
  }, [
    bgColor,
    borderRadius,
    cardWidth,
    hideBorder,
    iconColor,
    repo,
    showIcons,
    showLanguage,
    showOwner,
    theme,
    titleColor,
    username,
  ]);

  const repoUrl = `https://github.com/${username.trim() || "man-navlakha"}/${
    repo.trim() || "blog_ms"
  }`;
  const markdown = `<a href="${repoUrl}"><img src="${imageUrl}" /></a>`;

  return (
    <section className="my-8 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <div className="border-b border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 xl:border-b-0 xl:border-r">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
              Repository pin playground
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Configure a repository card and copy the generated embed.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Username">
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Repository">
              <input
                value={repo}
                onChange={(event) => setRepo(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Theme">
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value as Theme)}
                className={`${inputClass} capitalize`}
              >
                {themes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Card width">
              <div className="flex h-10 items-center gap-3">
                <input
                  type="range"
                  min="340"
                  max="900"
                  value={cardWidth}
                  onChange={(event) => setCardWidth(Number(event.target.value))}
                  className="w-full accent-zinc-950 dark:accent-white"
                />
                <span className="w-12 text-right text-sm text-zinc-600 dark:text-zinc-400">
                  {cardWidth}
                </span>
              </div>
            </Field>
            <Field label="Border radius">
              <div className="flex h-10 items-center gap-3">
                <input
                  type="range"
                  min="8"
                  max="40"
                  value={borderRadius}
                  onChange={(event) =>
                    setBorderRadius(Number(event.target.value))
                  }
                  className="w-full accent-zinc-950 dark:accent-white"
                />
                <span className="w-12 text-right text-sm text-zinc-600 dark:text-zinc-400">
                  {borderRadius}
                </span>
              </div>
            </Field>
            <Field label="Background color">
              <input
                value={bgColor}
                onChange={(event) => setBgColor(event.target.value)}
                placeholder="0f172a"
                className={inputClass}
              />
            </Field>
            <Field label="Title color">
              <input
                value={titleColor}
                onChange={(event) => setTitleColor(event.target.value)}
                placeholder="ffffff"
                className={inputClass}
              />
            </Field>
            <Field label="Icon color">
              <input
                value={iconColor}
                onChange={(event) => setIconColor(event.target.value)}
                placeholder="61dafb"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Toggle
              checked={showIcons}
              label="Show icons"
              onChange={setShowIcons}
            />
            <Toggle
              checked={hideBorder}
              label="Hide border"
              onChange={setHideBorder}
            />
            <Toggle
              checked={showOwner}
              label="Show owner"
              onChange={setShowOwner}
            />
            <Toggle
              checked={showLanguage}
              label="Show language"
              onChange={setShowLanguage}
            />
          </div>
        </div>

        <div className="bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(244,244,245,0.88))] p-5 dark:bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.15),transparent_42%),linear-gradient(to_bottom,rgba(9,9,11,0.88),rgba(0,0,0,0.96))]">
          <div className="flex min-h-72 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white/70 p-4 dark:border-zinc-800 dark:bg-black/35">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`${username || "GitHub"} ${repo || "repository"} pin preview`}
              className="h-auto max-w-full rounded-md"
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
