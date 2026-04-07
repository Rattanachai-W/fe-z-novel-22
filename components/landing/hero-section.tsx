import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-slate-950 px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#42b983] to-[#0ea5e9] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full bg-[#42b983]/10 px-3 py-1 text-sm font-semibold leading-6 text-[#42b983] ring-1 ring-inset ring-[#42b983]/20">
              Coming Soon in late 2026
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              DinoNovel <span className="text-[#42b983]">อาณาจักรนิยาย</span> ที่คุณสัมผัสได้จริง
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              อ่านนิยายออนไลน์ฟรีครบทุกรสชาติ ทั้งนิยายรัก นิยายวาย และนิยายแปลไทย 
              สัมผัสประสบการณ์ใหม่ที่รวมการอ่านเข้ากับระบบ Gacha ลุ้นรับของรางวัลพรีเมียม 
              ส่งตรงจากโลกจินตนาการสู่มือคุณ พร้อมระบบ ReadList ส่วนตัวที่ดีที่สุด
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" className="bg-[#42b983] hover:bg-[#36a372] text-white rounded-full px-8">
                ลงทะเบียนล่วงหน้า
              </Button>
              <a href="#features" className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                เรียนรู้เพิ่มเติม <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#42b983]/20 to-[#0ea5e9]/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-2xl">
                <Image
                  src="/dino_mascot.png"
                  alt="DinoNovel Mascot"
                  width={600}
                  height={600}
                  className="w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#0ea5e9] to-[#42b983] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
