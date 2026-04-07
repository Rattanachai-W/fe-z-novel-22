import { HeroSection } from "./hero-section";
import { FeatureGrid } from "./feature-grid";
import { SignupForm } from "./signup-form";
import { SiteHeader } from "@/components/layout/site-header";

export function LandingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DinoNovel",
    "url": "https://dinonovel.com",
    "logo": "https://dinonovel.com/dino_mascot.png",
    "description": "แพลตฟอร์มนิยายออนไลน์ที่รวมความสนุกของการอ่านเข้ากับระบบของรางวัลจริงและ Gacha",
    "sameAs": [
      "https://facebook.com/dinonovel",
      "https://twitter.com/dinonovel"
    ]
  };

  const appData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DinoNovel",
    "operatingSystem": "Web, Android, iOS",
    "applicationCategory": "ReadingApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "THB"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appData) }}
      />
      <div className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <SiteHeader />
        </div>
      </div>

      <main className="flex-grow">
        <HeroSection />
        <FeatureGrid />
        <SignupForm />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#42b983] flex items-center justify-center text-white font-bold text-xl">D</div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">DinoNovel</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                โลกใหม่แห่งการอ่านนิยาย นิยายแปล นิยายรัก และนิยายแชท
                พร้อมลุ้นของรางวัลสุดพรีเมียมจาก Dino Gacha ทุกวัน
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">สำรวจ Dino</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-[#42b983]">หน้าหลัก</a></li>
                <li><a href="#features" className="hover:text-[#42b983]">ฟีเจอร์</a></li>
                <li><a href="#" className="hover:text-[#42b983]">นิยายทั้งหมด</a></li>
                <li><a href="#" className="hover:text-[#42b983]">สำหรับนักเขียน</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">ช่วยเหลือ & กฎกติกา</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-[#42b983]">เกี่ยวกับเรา</a></li>
                <li><a href="#" className="hover:text-[#42b983]">ข้อกำหนดการใช้งาน</a></li>
                <li><a href="#" className="hover:text-[#42b983]">นโยบายความเป็นส่วนตัว</a></li>
                <li><a href="#" className="hover:text-[#42b983]">ติดต่อสอบถาม</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} DinoNovel Team.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-[#42b983]">Facebook</a>
              <a href="#" className="text-slate-400 hover:text-[#42b983]">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-[#42b983]">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
