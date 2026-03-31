import { BookshelfPage } from "@/components/bookshelf/bookshelf-page";
import { SiteHeader } from "@/components/layout/site-header";
import { getNovelCatalog } from "@/lib/api/novels";

export default async function BookshelfRoute() {
  const novels = await getNovelCatalog();

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[20rem] bg-[radial-gradient(circle_at_top_left,_rgba(66,185,131,0.22),_transparent_40%),linear-gradient(180deg,_rgba(241,245,249,0.96),_rgba(255,255,255,1))]" />
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 pb-16 pt-4 sm:px-4 sm:pt-6 lg:px-6">
        <SiteHeader primaryHref="/" primaryLabel="กลับหน้าแรก" />
        <BookshelfPage
          novels={novels.map((novel) => ({
            id: novel.id,
            title: novel.title,
            authorName: novel.author?.username ?? "Unknown",
            categoryName: novel.Category?.name ?? "Novel",
          }))}
        />
      </section>
    </main>
  );
}
