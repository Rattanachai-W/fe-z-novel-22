import { SiteHeader } from "@/components/layout/site-header";

export default function NotificationsPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[20rem] bg-[radial-gradient(circle_at_top_left,_rgba(66,185,131,0.22),_transparent_40%),linear-gradient(180deg,_rgba(241,245,249,0.96),_rgba(255,255,255,1))]" />
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 pb-16 pt-4 sm:px-4 sm:pt-6 lg:px-6">
        <SiteHeader primaryHref="/" primaryLabel="กลับหน้าแรก" />

        <section className="card-surface p-5 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
            Notifications
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">การแจ้งเตือน</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            หน้านี้เตรียมไว้สำหรับเชื่อม `GET /api/marketing/notifications`
            ในรอบถัดไป ตอนนี้ใช้เป็นปลายทางจริงให้ quick action ใน header ก่อน
          </p>

          <div className="mt-6 rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <p className="text-sm text-[var(--color-muted)]">
              เมื่อเชื่อม API แล้ว ที่นี่จะแสดงตอนใหม่จากนิยายที่ติดตาม, ผลภารกิจ,
              และข่าวกิจกรรมสำคัญของ DinoNovel
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
