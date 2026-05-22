import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-96 w-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.26),rgba(168,85,247,0.16)_35%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.32),rgba(217,70,239,0.18)_35%,transparent_70%)]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-24 text-center sm:px-8">
        <Link
          href="/docs"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          PixStock documentation
        </Link>

        <div className="max-w-4xl">
          <h1 className="bg-gradient-to-b from-zinc-950 via-zinc-800 to-zinc-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-white dark:via-zinc-100 dark:to-zinc-500 sm:text-6xl lg:text-7xl">
            The Ultimate Asset Infrastructure
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            PixStock gives teams fast, reliable, developer-friendly primitives
            for storing, delivering, and automating production-ready digital
            assets.
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-950 sm:w-auto"
          >
            Get Started
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/templates"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white/70 px-5 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-950 sm:w-auto"
          >
            Template Builder
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

      </section>

      <section
        id="templates"
        className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8"
      >
        <div className="border-t border-zinc-200 pt-16 dark:border-zinc-800">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Template Builder
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Generate stunning README templates
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Use our interactive template builder to create beautiful GitHub profile READMEs, project showcases, and company documentation with live previews.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: "GitHub Profile README", desc: "Beautiful profile templates with stats and info" },
              { title: "Project Showcase", desc: "Coming soon" },
              { title: "Company Documentation", desc: "Coming soon" },
            ].map((template) => (
              <div
                key={template.title}
                className="group rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-4 h-24 rounded-md border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-black" />
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {template.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {template.desc}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/templates"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-500 dark:focus:ring-offset-zinc-950"
          >
            Open Template Builder
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
