import { SiteHeader } from "@/components/layout/site-header";

export default function WriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(66,185,131,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.1),_transparent_24%),linear-gradient(180deg,_rgba(248,250,252,1),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(66,185,131,0.12),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.38),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,1))]" />

      <section className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 pb-16 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <SiteHeader primaryHref="/writer/novels" primaryLabel="Writer Workspace" />
        {children}
      </section>
    </main>
  );
}
