import { AuthModal } from "@/components/auth/auth-modal";
import { AppProvider } from "@/components/providers/app-provider";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-body",
  subsets: ["latin", "thai"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | DinoNovel",
    default: "DinoNovel - อ่านนิยายออนไลน์ฟรี นิยายแปล นิยายแชท นิยายรัก",
  },
  description:
    "แพลตฟอร์มนิยายออนไลน์สำหรับนักอ่านและนักเขียน พร้อมระบบ ReadList ภารกิจ และรางวัลสะสมในจักรวาล DinoNovel",
  keywords: ["นิยาย", "อ่านนิยาย", "นิยายแปล", "นิยายแชท", "นิยายออนไลน์", "DinoNovel", "ฟิค", "นิยายวาย"],
  openGraph: {
    title: "DinoNovel - แพลตฟอร์มนิยายออนไลน์",
    description: "อ่านนิยายออนไลน์ นิยายแปล อ่านฟรี อัปเดตไว พร้อมระบบภารกิจแลกของรางวัลสุดพรีเมียมจาก DinoNovel",
    siteName: "DinoNovel",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DinoNovel - แพลตฟอร์มนิยายออนไลน์",
    description: "อ่านนิยายออนไลน์ นิยายแปล อ่านฟรี อัปเดตไว พร้อมระบบภารกิจแลกของรางวัลสุดพรีเมียมจาก DinoNovel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${notoSansThai.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-foreground)]">
        <AppProvider>
          {children}
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
