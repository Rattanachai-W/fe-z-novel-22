import { Suspense } from "react";
import { HomepageSections } from "@/components/home/homepage-sections";
import { SiteHeader } from "@/components/layout/site-header";

type HomePageProps = {
  searchParams: Promise<{
    category?: string;
    tag?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const filters = await searchParams;

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[radial-gradient(circle_at_top_left,_rgba(66,185,131,0.24),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.1),_transparent_32%),linear-gradient(180deg,_rgba(241,245,249,0.96),_rgba(240,235,255,0.9),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(66,185,131,0.18),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.08),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(2,6,23,1))]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 pb-16 pt-4 sm:px-4 sm:pt-6 lg:px-6">
        <SiteHeader />

        <Suspense fallback={<HomepageSectionsLoading />}>
          <HomepageSections category={filters.category} tag={filters.tag} />
        </Suspense>

        <footer
          id="footer"
          className="card-surface mt-8 rounded-[1.6rem] px-4 py-5 text-center text-sm text-[var(--color-muted)] sm:mt-10 sm:rounded-[2rem] sm:px-6"
        >
          DinoNovel Footer
        </footer>
      </section>
    </main>
  );
}

function HomepageSectionsLoading() {
  return (
    <section className="space-y-8 sm:space-y-10">
      <section className="card-surface min-h-[240px] animate-pulse rounded-[1.5rem] bg-[var(--color-surface-muted)] sm:min-h-[280px]" />

      <section className="card-surface p-4 sm:p-6 lg:p-8">
        <div className="mb-5 h-8 w-40 animate-pulse rounded-full bg-[var(--color-surface-muted)]" />
        <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex gap-3 sm:grid sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`updated-skeleton-${index}`}
                className="min-w-[10.5rem] rounded-[1.35rem] bg-[var(--color-surface-muted)] p-3 sm:min-w-0 sm:rounded-[1.6rem]"
              >
                <div className="aspect-[4/5] animate-pulse rounded-[1.25rem] bg-white/50 dark:bg-slate-700/50" />
                <div className="mt-4 h-4 w-4/5 animate-pulse rounded-full bg-white/50 dark:bg-slate-700/50" />
                <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-white/50 dark:bg-slate-700/50" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="card-surface p-4 sm:p-6 lg:p-8">
          <div className="mb-5 h-8 w-48 animate-pulse rounded-full bg-[var(--color-surface-muted)]" />
          <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="flex gap-3 sm:grid sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`recommended-skeleton-${index}`}
                  className="min-w-[10.5rem] rounded-[1.35rem] bg-[var(--color-surface-muted)] p-3 sm:min-w-0 sm:rounded-[1.6rem]"
                >
                  <div className="aspect-[4/5] animate-pulse rounded-[1.25rem] bg-white/50 dark:bg-slate-700/50" />
                  <div className="mt-4 h-4 w-4/5 animate-pulse rounded-full bg-white/50 dark:bg-slate-700/50" />
                  <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-white/50 dark:bg-slate-700/50" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="card-surface p-4 sm:p-6 lg:p-8">
          <div className="h-8 w-36 animate-pulse rounded-full bg-[var(--color-surface-muted)]" />
          <div className="mt-5 grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`rank-tab-${index}`}
                className="h-10 animate-pulse rounded-xl bg-[var(--color-surface-muted)]"
              />
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`rank-item-${index}`}
                className="flex items-center gap-3 rounded-[1.1rem] bg-[var(--color-surface-muted)] p-3"
              >
                <div className="h-12 w-12 animate-pulse rounded-xl bg-white/50 dark:bg-slate-700/50" />
                <div className="flex-1">
                  <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/50 dark:bg-slate-700/50" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-white/50 dark:bg-slate-700/50" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </section>
  );
}
