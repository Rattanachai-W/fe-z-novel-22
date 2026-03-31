import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="card-surface w-full p-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
          Not Found
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          ไม่พบหน้าที่ต้องการ
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          รายการนิยายหรือตอนที่คุณเปิดอาจถูกลบ หรือยังไม่มีข้อมูลจาก backend
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
