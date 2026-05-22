"use client";

import { useMemo, useState } from "react";

function normalizeVehicleName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-") || "sports-car";
}

export default function VehicleLivePreview() {
  const [vehicleName, setVehicleName] = useState("sports-car");

  const imageUrl = useMemo(() => {
    const name = normalizeVehicleName(vehicleName);

    return `https://img-server-theta.vercel.app/api/vehicle/${encodeURIComponent(
      name,
    )}`;
  }, [vehicleName]);

  const markdown = `![Vehicle](${imageUrl})`;

  return (
    <section className="my-8 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.25fr)]">
        <div className="border-b border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 lg:border-b-0 lg:border-r">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
              Vehicle image playground
            </h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Resolve vehicle-related imagery from a simple URL parameter.
            </p>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Vehicle name
            </span>
            <input
              value={vehicleName}
              onChange={(event) => setVehicleName(event.target.value)}
              placeholder="sports-car"
              className="mt-2 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            />
          </label>

          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Enter a vehicle type, such as{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              motorcycle
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              plane
            </code>
            , or{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              supercar
            </code>
            .
          </p>
        </div>

        <div className="bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(244,244,245,0.88))] p-5 dark:bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.15),transparent_42%),linear-gradient(to_bottom,rgba(9,9,11,0.88),rgba(0,0,0,0.96))]">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`${normalizeVehicleName(vehicleName)} preview`}
              className="h-72 w-full rounded-lg object-cover sm:h-80"
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
