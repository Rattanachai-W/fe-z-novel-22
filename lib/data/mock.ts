import type { Banner, Chapter, HomeMetric, Novel, Tag, Wallet } from "@/lib/types/api";

const demoChapters: Chapter[] = [
  {
    id: "chapter-001",
    novel_id: "demo-001",
    chapter_number: 1,
    title: "คืนที่ไดโนขึ้นรถไฟฟ้า",
    is_free: true,
    coin_price: 0,
    content:
      "สายลมเย็นจากปลายสถานีพัดผ่านหน้าของธีร์ในคืนที่กรุงเทพฯ ดูเหมือนจะมีอะไรผิดปกติไปเล็กน้อย เขายืนมองป้ายโฆษณาที่กะพริบเป็นรูปไดโนเสาร์สวมแจ็กเก็ตช่างกล ก่อนจะได้ยินเสียงประกาศชวนเข้าร่วมภารกิจลับสำหรับนักอ่านหน้าใหม่.\n\nไม่มีใครบอกเขามาก่อนว่าการเปิดนิยายเรื่องหนึ่ง จะเป็นเหมือนการเปิดประตูสู่อีกเมืองหนึ่ง เมืองที่ทุกตอนมีราคา ทุกการตัดสินใจมีรางวัล และทุกคนกำลังแข่งกันสร้างลิสต์อ่านของตัวเองเพื่อขึ้นกระดานอันดับ.\n\nธีร์ยิ้มบาง ๆ แล้วกดเข้าอ่านตอนแรก เขาไม่ได้รู้เลยว่านี่คือคืนแรกของระบบนิเวศใหม่ที่กำลังจะกลืนทั้งเวลาว่าง กระเป๋าเหรียญ และหัวใจของเขาไปพร้อมกัน.",
    created_at: "2026-03-25T10:00:00.000Z",
  },
  {
    id: "chapter-002",
    novel_id: "demo-001",
    chapter_number: 2,
    title: "ภารกิจแรกของนักอ่าน",
    is_free: false,
    coin_price: 3,
    content:
      "เช้าวันถัดมา ธีร์พบว่าหน้าจอโปรไฟล์ของเขามีภารกิจรายวันปรากฏขึ้นมาสามข้อ อ่านครบหนึ่งตอน กดติดตามนักเขียนหนึ่งคน และสร้าง ReadList แรกให้เสร็จก่อนเที่ยงคืน.\n\nมันดูเหมือนเกม แต่ทุกอย่างกลับขยับเชื่อมกับชีวิตจริงอย่างประหลาด เหรียญทองถูกใช้ปลดล็อกตอน ไข่ไดโนเอาไปแลกของ และตั๋วกาชาก็ทำให้คนทั้งไทม์ไลน์พูดถึงตุ๊กตาไดโนรุ่นลิมิเต็ดไม่หยุด.\n\nธีร์กดดูยอดคงเหลือของตัวเอง ก่อนจะตัดสินใจว่าถ้าจะเล่น เขาจะเล่นให้สุด.",
    created_at: "2026-03-26T10:00:00.000Z",
  },
  {
    id: "chapter-003",
    novel_id: "demo-001",
    chapter_number: 3,
    title: "ห้องแชตของเหล่านักสะสม",
    is_free: false,
    coin_price: 4,
    content: null,
    locked: true,
    created_at: "2026-03-27T10:00:00.000Z",
  },
];

export const mockNovels: Novel[] = [
  {
    id: "demo-001",
    author_id: "author-001",
    category_id: "cat-urban",
    title: "Dino Metro: อ่านคืนนี้ ลุ้นรางวัลพรุ่งนี้",
    description:
      "นิยายเมืองร่วมสมัยที่พาผู้อ่านเข้าสู่แพลตฟอร์มอ่านนิยายสายคอมมูนิตี้ ทุกตอนคือทั้งเรื่องเล่าและประตูสู่ภารกิจสะสมรางวัลจริง",
    cover_image_url: "",
    status: "ongoing",
    view_count: 128430,
    rating: 4.8,
    rating_count: 984,
    author: { id: "author-001", username: "RexWriter" },
    Category: { id: "cat-urban", name: "Urban Fantasy" },
    Tags: [
      { id: "tag-community", name: "คอมมูนิตี้" },
      { id: "tag-gamification", name: "ภารกิจ" },
      { id: "tag-reward", name: "รางวัลจริง" },
    ],
    chapters: demoChapters,
  },
  {
    id: "demo-002",
    author_id: "author-002",
    category_id: "cat-romance",
    title: "ReadList ของหัวใจ",
    description:
      "เรื่องรักของคิวเรเตอร์สาวที่ใช้ ReadList รวมเรื่องโปรดจนได้พบกับนักเขียนลึกลับผู้ตามอ่านทุกลิสต์ของเธอ",
    cover_image_url: "",
    status: "ongoing",
    view_count: 86420,
    rating: 4.6,
    rating_count: 612,
    author: { id: "author-002", username: "MellowPleo" },
    Category: { id: "cat-romance", name: "Romance" },
    Tags: [
      { id: "tag-readlist", name: "ReadList" },
      { id: "tag-romance", name: "โรแมนติก" },
      { id: "tag-social", name: "Social" },
    ],
    chapters: [
      {
        id: "chapter-101",
        novel_id: "demo-002",
        chapter_number: 1,
        title: "ลิสต์ที่ไม่ควรถูกเปิดอ่าน",
        is_free: true,
        coin_price: 0,
        content:
          "เธอเริ่มต้นจากการจัดลิสต์เงียบ ๆ แต่ทุกอย่างเปลี่ยนไปเมื่อมีคนลึกลับส่งคอมเมนต์สั้น ๆ ใต้รายการโปรดนั้น",
        created_at: "2026-03-20T10:00:00.000Z",
      },
    ],
  },
  {
    id: "demo-003",
    author_id: "author-003",
    category_id: "cat-scifi",
    title: "Ledger of the Last Author",
    description:
      "ไซไฟระบบหนัก เมื่อรายได้นักเขียน การถอนเงิน และธุรกรรมทุกบรรทัดกลายเป็นเบาะแสของคดีครั้งใหญ่",
    cover_image_url: "",
    status: "completed",
    view_count: 54120,
    rating: 4.9,
    rating_count: 1201,
    author: { id: "author-003", username: "AuditLizard" },
    Category: { id: "cat-scifi", name: "Sci-Fi" },
    Tags: [
      { id: "tag-fintech", name: "การเงิน" },
      { id: "tag-thriller", name: "สืบสวน" },
      { id: "tag-audit", name: "Audit Trail" },
    ],
    chapters: [
      {
        id: "chapter-201",
        novel_id: "demo-003",
        chapter_number: 1,
        title: "รายการที่ไม่ควรมีอยู่",
        is_free: true,
        coin_price: 0,
        content: "ทุกธุรกรรมควรตรวจสอบได้ ยกเว้นรายการนี้ที่หายไปจากระบบตอนตีสามตรง.",
        created_at: "2026-01-12T10:00:00.000Z",
      },
    ],
  },
];

export const mockTags: Tag[] = [
  { id: "tag-community", name: "คอมมูนิตี้" },
  { id: "tag-readlist", name: "ReadList" },
  { id: "tag-gamification", name: "ภารกิจ" },
  { id: "tag-reward", name: "รางวัลจริง" },
  { id: "tag-fintech", name: "การเงิน" },
];

export const mockHomeMetrics: HomeMetric[] = [
  {
    label: "Readers",
    value: "120K+",
    description: "ฐานผู้อ่านที่พร้อมเติบโตด้วยระบบสะสมและกิจกรรมประจำสัปดาห์",
  },
  {
    label: "ReadLists",
    value: "8.4K",
    description: "พื้นที่ curated discovery สำหรับผลักดันการค้นพบเรื่องใหม่อย่างต่อเนื่อง",
  },
  {
    label: "Reward Ops",
    value: "Audit-Ready",
    description: "ต่อยอด wallet, inventory และ reward fulfillment ได้โดยมี status tracking ชัดเจน",
  },
];

export const mockWallet: Wallet = {
  gold: 24,
  egg: 120,
  ticket: 3,
};

export const mockBanners: Banner[] = [
  {
    id: "banner-001",
    title: "เจ้าหญิงจำยอมของท่านประธาน",
    description: "อัปเดตตอนใหม่แล้ววันนี้ อ่านต่อแบบมือถือสบายตาใน DinoNovel",
    image_url: "",
    mobile_image_url: "",
    link_url: "/novels/demo-001",
    zone: "home",
    is_active: true,
    novel_id: "demo-001",
    Novel: mockNovels[0],
  },
  {
    id: "banner-002",
    title: "ราชันเทพเจ้า",
    description: "สายแฟนตาซีระบบหนัก กลับมาพร้อมตอนล่าสุดและภารกิจรายวัน",
    image_url: "",
    mobile_image_url: "",
    link_url: "/novels/demo-002",
    zone: "home",
    is_active: true,
    novel_id: "demo-002",
    Novel: mockNovels[1],
  },
  {
    id: "banner-003",
    title: "มหาเทพฝึกอสูร",
    description: "จัดอันดับกระแสรายสัปดาห์ พร้อมลุ้นของรางวัลสำหรับสายสะสม",
    image_url: "",
    mobile_image_url: "",
    link_url: "/novels/demo-003",
    zone: "home",
    is_active: true,
    novel_id: "demo-003",
    Novel: mockNovels[2],
  },
];
