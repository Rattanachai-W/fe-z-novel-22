import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorFollowButton } from "@/components/novels/author-follow-button";
import { SiteHeader } from "@/components/layout/site-header";
import { getAuthorProfile } from "@/lib/api/novels";

type AuthorProfilePageProps = {
  params: Promise<{
    authorId: string;
  }>;
};

export default async function AuthorProfilePage({
  params,
}: AuthorProfilePageProps) {
  const { authorId } = await params;
  const author = await getAuthorProfile(authorId);

  if (!author) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 sm:px-6 lg:px-8">
      <SiteHeader primaryHref="/" primaryLabel="กลับหน้าแรก" />

      <section className="card-surface overflow-hidden p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
          Author Profile
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">{author.username}</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              เข้าร่วมเมื่อ {new Date(author.created_at).toLocaleDateString("th-TH")}
            </p>
          </div>
          <AuthorFollowButton authorId={author.id} authorName={author.username} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4">
            <p className="text-sm text-[var(--color-muted)]">นิยายทั้งหมด</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-brand-strong)]">
              {author.novels.length}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4">
            <p className="text-sm text-[var(--color-muted)]">ผู้ติดตาม</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-brand-strong)]">
              {author.follower_count.toLocaleString("th-TH")}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4">
            <p className="text-sm text-[var(--color-muted)]">กำลังติดตาม</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-brand-strong)]">
              {author.following_count.toLocaleString("th-TH")}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 card-surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">ผลงานของนักเขียน</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {author.novels.map((novel) => (
            <Link
              key={novel.id}
              href={`/novels/${novel.id}`}
              className="rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition hover:border-[var(--color-brand)]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {novel.Category?.name ?? "Novel"}
              </p>
              <h3 className="mt-2 line-clamp-2 text-lg font-semibold">{novel.title}</h3>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
                <span>{novel.status}</span>
                <span>{novel.view_count.toLocaleString("th-TH")} views</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
