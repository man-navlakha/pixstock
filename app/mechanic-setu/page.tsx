import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Wrench } from "lucide-react";

export const metadata = {
  title: "Mechanic Setu",
  description:
    "Mechanic Setu backend documentation for authentication, RBAC, refresh tokens, and user profile APIs.",
};

export default function MechanicSetuHome() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-96 w-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.24),rgba(16,185,129,0.18)_35%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.3),rgba(52,211,153,0.2)_35%,transparent_70%)]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-24 text-center sm:px-8">
        <Image
          src="/mechanic%20setu%20doc/logo.png"
          alt="Mechanic Setu logo"
          width={160}
          height={160}
          priority
          className="mb-6 h-28 w-28 object-contain sm:h-36 sm:w-36"
        />

        <Link
          href="/mechanic-setu/docs"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
        >
          <Wrench className="h-4 w-4" aria-hidden="true" />
          Mechanic Setu documentation
        </Link>

        <div className="max-w-4xl">
          <h1 className="bg-gradient-to-b from-zinc-950 via-zinc-800 to-zinc-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-white dark:via-zinc-100 dark:to-zinc-500 sm:text-6xl lg:text-7xl">
            Mechanic Setu Backend Docs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Mechanic Setu reuses the same documentation system as PixStock so
            authentication, role authorization, refresh tokens, and profile
            APIs can live in one consistent docs experience.
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/mechanic-setu/docs"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-950 sm:w-auto"
          >
            Open Docs
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white/70 px-5 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-950 sm:w-auto"
          >
            View PixStock Docs
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
