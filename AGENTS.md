<!-- BEGIN:nextjs-agent-rules -->
# 🦖 DinoNovel: System & Strategy Specification (Master Blueprint)

## 1. Project Overview & Business Goal
- **Project Name:** DinoNovel
- **Target Persona:** ผู้อ่านวัยรุ่นและวัยทำงานที่ชื่นชอบคอมมูนิตี้และการทำภารกิจเพื่อลุ้นรับของรางวัล
- **Business Goal:** สร้างแพลตฟอร์มนิยายออนไลน์ที่มี Ecosystem แข็งแกร่งที่สุด เพื่อเตรียมความพร้อมในการนำบริษัทเข้าจดทะเบียนในตลาดหลักทรัพย์ **MAI** ภายในปี 2036
- **Core Strategy:** ผสานระบบการอ่านนิยาย (Core) เข้ากับระบบ Gacha และ Physical Rewards (Monetization & CRM) โดยมี Data Transaction ที่โปร่งใสและตรวจสอบได้ (Audit-Ready) ทุกขั้นตอนตั้งแต่การเติมเงินไปจนถึงการจัดส่งสินค้า

## 2. Brand Identity & UI/UX Standards
- **Primary Color:** Vue Green (`#42b983`) - สื่อถึงความทันสมัย Tech-startup ให้ความรู้สึกสบายตา (Eye-care) เหมาะสำหรับการอ่านเนื้อหาขนาดยาว
- **UI Modes:** ต้องรองรับทั้ง **Day Mode** (White/Slate) และ **Dark Mode** (Deep Blue/Slate)
- **UX Rule:** ฟีเจอร์ CRM และ Gamification ต้อง "ไม่รบกวนประสบการณ์การอ่าน" (No intrusive pop-ups during reading).
- **Mascot/Theme:** ไดโนเสาร์ (Dino) สไตล์แก๊งนักเลง/ช่างวัยรุ่น ใช้เป็นตัวแทนของแบรนด์และของรางวัลพรีเมียม

## 3. Tech Stack & Architecture (Engineering Excellence)
- **Frontend:** Next.js (Web) / React Native (Mobile App) เน้น SEO และ Core Web Vitals
- **Backend:** Node.js (TypeScript) หรือ Go (เน้น High Concurrency)
- **Database:** PostgreSQL (Core Data) + Redis (Caching & Leaderboards)
- **Background Jobs:** BullMQ / Celery (สำหรับ Scheduled Publishing & Notifications)
- **Infrastructure:** Docker & Kubernetes, Event-Driven Architecture (Message Queue)
- **Security & Data Integrity:** ใช้ Atomic Transactions สำหรับทุกธุรกรรมการเงินและการตัดสต็อก ห้าม Hard Delete ข้อมูล (ใช้ Soft Delete เสมอ)

---

## 4. Core Features (MVP)

### 4.1 Novel Engine (ระบบนิยายพื้นฐาน)
- **Content Management:** แสดงรายการนิยาย, รายละเอียด, หมวดหมู่, และ Tags
- **Search & Discovery:** ระบบค้นหาที่ยืดหยุ่น (Full-Text Search)
- **Reading Experience:** ระบบอ่านนิยาย, ประวัติการอ่านล่าสุด (Reading History)
- **Social Graph:** ระบบติดตาม (Follow) นิยายและนักเขียน
- **Writer Studio:** Dashboard สำหรับนักเขียนสร้างเรื่องใหม่, เพิ่มตอน, และติดราคาเหรียญ (Lock/Unlock Chapters)

### 4.2 Scheduled Publishing & Notifications (ระบบลงตอนอัตโนมัติและแจ้งเตือน)
- **Scheduled Publishing:** นักเขียนตั้งเวลาลงตอนล่วงหน้าได้ (`publish_at`) ขับเคลื่อนด้วย Cron Job
- **Notification Engine:** แจ้งเตือนตอนใหม่ไปยังผู้ติดตามผ่าน In-App Badge และ Push Notification (FCM)

### 4.3 ReadList System (Spotify-Inspired)
- **Concept:** User-curated novel collections (ผู้ใช้ออกแบบเพลย์ลิสต์นิยายเอง)
- **Social Integration:** แชร์ ReadList สู่สาธารณะ และมีระบบ Follow ReadList
- **Gamification:** ระบบ Leaderboard สำหรับ Top Curators เพื่อมอบรางวัลพิเศษ

---

## 5. Economy & Payment Gateway (ระบบการเงิน)

### 5.1 Payment Integration
- **Gateway:** **Omise** (รองรับ PromptPay QR Code และ Credit Card)
- **Dynamic Rates:** Admin ปรับอัตราแลกเปลี่ยนและโบนัสของแถมได้ตลอดเวลา
- **Withdrawal:** ระบบจัดการการถอนเงินของนักเขียน (Pending -> Approved -> Transferred)

### 5.2 Triple-Currency System
- **Gold Coin (เหรียญทอง):** สกุลเงินหลักสำหรับซื้อตอนนิยาย
- **Dino Egg (ไข่ไดโนเสาร์):** สกุลเงินสำหรับแลกไอเท็มใน Event Shop
- **Gacha Ticket (ตั๋วสุ่ม):** ใช้สำหรับหมุนตู้สุ่มรางวัล (ได้จากการเติมเงินหรือทำภารกิจ)

---

## 6. CRM, Gamification & Fulfillment

### 6.1 Dynamic Mission Engine (ระบบภารกิจ)
- **Role Separation:** แยกภารกิจสำหรับ `Reader` (นักอ่าน) และ `Writer` (นักเขียน)
- **Admin Control:** กำหนดเงื่อนไขและของรางวัลได้อย่างอิสระ
- **Milestone Tracking:** รองรับภารกิจแบบ Checkpoint (เช่น ล็อคอิน 7 วัน กดรับของได้ในวันที่ 1, 3, 7)

### 6.2 Gacha & Event Shop (สุ่มรางวัลและร้านค้ากิจกรรม)
- **Gacha Config:** Admin ปรับเพิ่ม/ลดตู้สุ่ม, ตั้ง Drop Rate, และ Daily Limit ได้
- **Exchange Shop:** ร้านค้าใช้ไข่ไดโนแลกของ Admin ตั้งสต็อก ราคา และจำกัดจำนวนการซื้อต่อคนได้
- **Transparency Logs:** บันทึก Transaction Log ทุกการสุ่มและการแลกของ

### 6.3 Inventory & Reward Fulfillment (ระบบคลังและจัดส่งของรางวัล)
- **User Inventory:** คลังเก็บของดิจิทัลและของรางวัลจริงที่ User สุ่มหรือแลกมาได้ (รอการกดยืนยันรับของ)
- **Address Management:** User สามารถเพิ่มและจัดการที่อยู่สำหรับจัดส่งสินค้าได้
- **Shipping Workflow:** เมื่อ User กดรับของจริง ระบบจะสร้าง Ticket `reward_shipping_requests` ให้ Admin ดำเนินการ (Pending -> Processing -> Shipped พร้อม Tracking Number)

### 6.4 Banner Management (ระบบป้ายโฆษณา)
- **Zones:** รองรับแบนเนอร์หลายจุด (Home, Event)
- **Admin Control:** เพิ่ม/ลด/แก้ไข และตั้งเวลาเปิด-ปิดแบนเนอร์
- **Writer Request:** Workflow ให้นักเขียนกด Request ขอนำนิยายขึ้นแบนเนอร์โปรโมตได้ (Pending -> Approved/Rejected)

---

## 7. AI Agent Instructions (กฎสำหรับ AI ที่ทำงานในโปรเจกต์นี้)
1. **Developer Persona:** ให้คำปรึกษาในฐานะ Lead Programmer ที่โฟกัสเรื่อง Scalability, Performance, และ System Architecture.
2. **MAI Compliance:** ทุกการออกแบบ Database Schema ที่เกี่ยวกับการเงิน, สต็อกสินค้า, หรือการจัดส่ง ต้องมี Audit Trail และ Status Tracking ที่ชัดเจน.
3. **Format:** ใช้ Markdown (Tables, Code blocks) อย่างเคร่งครัด อธิบายกระชับ ตรงประเด็นแบบวิศวกรซอฟต์แวร์.
4. **Context Awareness:** จดจำเสมอว่าระบบใช้ Primary Color เป็น `#42b983`, ใช้ Triple-Currency, มี ReadList, และขับเคลื่อน Marketing ด้วยระบบภารกิจ/Gacha เพื่อแลกของรางวัลจริง (Physical Rewards).
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
