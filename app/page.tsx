import { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { NovelHomeContent } from "@/components/home/novel-home-content";

export const metadata: Metadata = {
  title: "DinoNovel - อ่านนิยายออนไลน์ฟรี นิยายแปลไทย นิยายแชท และกาชาของรางวัลจริง",
  description: "พบกับ DinoNovel แพลตฟอร์มนิยายออนไลน์ที่ให้คุณมากกว่าการอ่าน ร่วมสนุกกับระบบ Gacha เพื่อลุ้นรับของรางวัลพรีเมียมจากโลกจริง พร้อมฟีเจอร์ ReadList ส่วนตัวที่คุณเลือกเองได้",
  keywords: ["นิยายออนไลน์", "นิยายจีนแปล","อ่านนิยายฟรี", "นิยายแปลไทย", "กาชาปอง", "ของรางวัล", "DinoNovel", "นิยายแชท", "ReadList", "novel", "novel thai"],
  alternates: {
    canonical: "https://dinonovel.com",
  },
  openGraph: {
    title: "DinoNovel - โลกแห่งจินตนาการและการป้ายยา",
    description: "อ่านนิยายคุณภาพพร้อมลุ้นรับของรางวัลพรีเมียมได้ทุกวัน ทะลุมิติจากหน้าจอสู่มือคุณ",
    url: "https://dinonovel.com",
    siteName: "DinoNovel",
    images: [
      {
        url: "/dino_mascot.png",
        width: 1200,
        height: 630,
        alt: "DinoNovel Gangster Mascot",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DinoNovel - แพลตฟอร์มนิยายที่คุณสัมผัสได้จริง",
    description: "อ่านนิยายและทำภารกิจเพื่อแลกของรางวัลพรีเมียม ระบบใหม่ล่าสุดสำหรับนักอ่านและนักเขียน",
    images: ["/dino_mascot.png"],
  },
};

type HomePageProps = {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    mode?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  
  // Flag to control Pre-Open mode
  // In production, this can be set via env var
  const isPreOpenMode = process.env.NEXT_PUBLIC_PRE_OPEN_MODE === "true" || true; // Defaulting to true for now as requested
  
  // Bypass flag for developers (e.g., ?mode=normal)
  const isBypass = params.mode === "normal";

  if (isPreOpenMode && !isBypass) {
    return <LandingPage />;
  }

  return <NovelHomeContent filters={params} />;
}
