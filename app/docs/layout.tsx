import Link from "next/link";
import { GitBranch } from "lucide-react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <Link href="/" className="font-semibold tracking-tight">
            PixStock
          </Link>
        ),
      }}
      links={[
        {
          type: "icon",
          text: "GitHub",
          label: "GitHub repository",
          icon: <GitBranch className="h-4 w-4" aria-hidden="true" />,
          url: "https://github.com/pixstock/pixstock",
          external: true,
        },
      ]}
      searchToggle={{
        enabled: true,
      }}
      sidebar={{
        defaultOpenLevel: 1,
      }}
    >
      {children}
    </DocsLayout>
  );
}
