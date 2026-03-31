# 🦖 DinoNovel — API Specification
**Base URL:** `http://localhost:3000/api`  
**Version:** 1.0 (2026-03-29)

> [!IMPORTANT]
> **Authentication:** เส้นที่มีป้าย 🔒 ต้องแนบ JWT Token ใน Header  
> `Authorization: Bearer <token>`  
> Token ได้มาจาก `/api/auth/login` หรือ `/api/auth/facebook/callback`

---

## 📌 สารบัญ
1. [Auth — ระบบสมัครสมาชิก/เข้าสู่ระบบ](#1-auth)
2. [Novel Engine — ระบบนิยาย](#2-novel-engine)
3. [Financial — ระบบการเงิน](#3-financial)
4. [ReadList — เพลย์ลิสต์นิยาย](#4-readlist)
5. [Gamification — Gacha & Mission](#5-gamification)
6. [Rewards — คลังของรางวัลและจัดส่ง](#6-rewards)
7. [Marketing — แบนเนอร์และการแจ้งเตือน](#7-marketing)
8. [Admin — จัดการระบบ](#8-admin)

---

## 1. Auth

### `POST /api/auth/register` — สมัครสมาชิก
**Auth:** ไม่ต้อง

**Request Body:**
```json
{
  "username": "dino_reader",
  "email": "user@example.com",
  "password": "P@ssw0rd"
}
```

**Response `201`:**
```json
{
  "message": "สมัครสมาชิกสำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "uuid", "username": "dino_reader", "email": "user@example.com", "role": "reader" }
}
```

---

### `POST /api/auth/login` — เข้าสู่ระบบ
**Auth:** ไม่ต้อง

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "uuid", "username": "dino_reader", "role": "reader" }
}
```

---

### `GET /api/auth/facebook` — เข้าสู่ระบบด้วย Facebook
**Auth:** ไม่ต้อง  
เรียก URL นี้โดยตรงจาก Browser → ระบบจะ Redirect ไปหน้า Facebook Login อัตโนมัติ

### `GET /api/auth/facebook/callback` — Facebook Callback
ระบบจะ Redirect กลับมาที่ `/?token=<JWT>&username=<ชื่อผู้ใช้>` — Frontend ดัก Query String แล้วเก็บ token เอง

---

## 2. Novel Engine

**Base:** `/api/novels`

### `GET /api/novels/metadata` — ดึงหมวดหมู่ & แท็กทั้งหมด
**Auth:** ไม่ต้อง

**Response `200`:**
```json
{
  "categories": [
    { "id": "uuid", "name": "แฟนตาซี" }
  ],
  "tags": [
    { "id": "uuid", "name": "ดราม่า" }
  ]
}
```

---

### `GET /api/novels` — ดึงรายการนิยาย + ค้นหา + กรอง
**Auth:** ไม่ต้อง

**Query Parameters:**

| Param | Type | ตัวอย่าง | คำอธิบาย |
|-------|------|---------|----------|
| `search` | string | `?search=ดาบ` | ค้นหาจากชื่อเรื่อง + คำอธิบาย (case-insensitive) |
| `category` | UUID | `?category=<uuid>` | กรองตามหมวดหมู่ |
| `tag` | UUID | `?tag=<uuid>` | กรองตาม Tag |

> ใช้ร่วมกันได้ เช่น `?search=แวมไพร์&category=<uuid>`

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "title": "ชื่อนิยาย",
    "description": "คำอธิบาย",
    "cover_image_url": "https://...",
    "status": "ongoing",
    "view_count": 1500,
    "rating": 4.5,
    "rating_count": 120,
    "created_at": "2026-01-01T00:00:00Z",
    "author": { "id": "uuid", "username": "นักเขียน" },
    "Category": { "id": "uuid", "name": "แฟนตาซี" },
    "Tags": [{ "id": "uuid", "name": "ดราม่า" }]
  }
]
```

---

### `GET /api/novels/:id` — รายละเอียดนิยายพร้อมรายการตอน
**Auth:** ไม่ต้อง

**Response `200`:**
```json
{
  "id": "uuid",
  "title": "ชื่อนิยาย",
  "description": "คำอธิบาย",
  "cover_image_url": "https://...",
  "status": "ongoing",
  "view_count": 1501,
  "rating": 4.5,
  "author": { "id": "uuid", "username": "นักเขียน" },
  "Category": { "id": "uuid", "name": "แฟนตาซี" },
  "Tags": [{ "id": "uuid", "name": "ดราม่า" }],
  "chapters": [
    {
      "id": "uuid",
      "chapter_number": 1,
      "title": "บทที่ 1",
      "is_free": true,
      "coin_price": 0,
      "created_at": "2026-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "chapter_number": 2,
      "title": "บทที่ 2",
      "is_free": false,
      "coin_price": 5,
      "created_at": "2026-01-02T00:00:00Z"
    }
  ]
}
```

---

### `POST /api/novels` 🔒 — สร้างนิยายใหม่ (Writer Studio)
**Auth:** ต้องการ

**Request Body:**
```json
{
  "title": "ชื่อนิยาย",
  "description": "คำอธิบาย",
  "cover_image_url": "https://...",
  "category_id": "uuid",
  "tags": ["ดราม่า", "โรแมนติก"]
}
```

**Response `201`:**
```json
{
  "message": "สร้างนิยายสำเร็จ",
  "novel": { "id": "uuid", "title": "ชื่อนิยาย", "status": "ongoing" }
}
```

---

### `PUT /api/novels/:id` 🔒 — แก้ไขข้อมูลนิยาย (เจ้าของเท่านั้น)
**Auth:** ต้องการ (เจ้าของนิยาย)

**Request Body:** (ส่งเฉพาะ field ที่ต้องการแก้ไข)
```json
{
  "title": "ชื่อใหม่",
  "description": "คำอธิบายใหม่",
  "status": "completed",
  "cover_image_url": "https://...",
  "category_id": "uuid",
  "tags": ["แอ็คชั่น"]
}
```

**Response `200`:**
```json
{ "message": "อัปเดตนิยายสำเร็จ", "novel": { ... } }
```

---

### `DELETE /api/novels/:id` 🔒 — ลบนิยาย (เจ้าของเท่านั้น)
**Auth:** ต้องการ (เจ้าของนิยาย)

**Response `200`:**
```json
{ "message": "ลบนิยายและข้อมูลทั้งหมดเรียบร้อยแล้ว" }
```

---

### `GET /api/novels/chapters/:id` — อ่านเนื้อหาตอน
**Auth:** ไม่ต้อง (แต่ถ้าแนบ Token จะตรวจสิทธิ์ Unlock อัตโนมัติ)

**Response `200` (ตอนฟรี / ปลดล็อกแล้ว):**
```json
{
  "id": "uuid",
  "chapter_number": 2,
  "title": "บทที่ 2",
  "content": "เนื้อหาทั้งหมด...",
  "is_free": false,
  "coin_price": 5,
  "novel": { "id": "uuid", "title": "ชื่อนิยาย", "author_id": "uuid" }
}
```

**Response `200` (ตอนล็อก ยังไม่ซื้อ):**
```json
{
  "id": "uuid",
  "title": "บทที่ 2",
  "is_free": false,
  "coin_price": 5,
  "content": null,
  "locked": true
}
```

---

### `POST /api/novels/chapters/:id/unlock` 🔒 — ซื้อตอนนิยายด้วยเหรียญ
**Auth:** ต้องการ

**Request Body:** ไม่ต้องส่ง (ระบบตัดเหรียญจาก Wallet อัตโนมัติ)

**Response `200`:**
```json
{ "message": "ปลดล็อกสำเร็จแล้ว!" }
```

**Response `400` (เหรียญไม่พอ):**
```json
{ "message": "เหรียญอัฐไม่เพียงพอ กรุณาเติมเงิน" }
```

---

### `POST /api/novels/chapters` 🔒 — เพิ่มตอนใหม่ (Writer Studio)
**Auth:** ต้องการ (เจ้าของนิยาย)

**Request Body:**
```json
{
  "novel_id": "uuid",
  "chapter_number": 3,
  "title": "บทที่ 3: เริ่มต้นใหม่",
  "content": "เนื้อหาของตอน...",
  "is_free": false,
  "coin_price": 5
}
```

**Response `201`:**
```json
{ "message": "เพิ่มตอนนิยายสำเร็จ", "chapter": { ... } }
```

---

### `PUT /api/novels/chapters/:id` 🔒 — แก้ไขตอน
**Auth:** ต้องการ (เจ้าของนิยาย)

**Request Body:** (ส่งเฉพาะ field ที่ต้องการแก้ไข)
```json
{
  "title": "ชื่อตอนใหม่",
  "content": "เนื้อหาใหม่...",
  "is_free": true,
  "coin_price": 0,
  "chapter_number": 3
}
```

---

### `DELETE /api/novels/chapters/:id` 🔒 — ลบตอน
**Auth:** ต้องการ (เจ้าของนิยาย)

**Response `200`:**
```json
{ "message": "ลบตอนนิยายสำเร็จ" }
```

---

### `GET /api/novels/chapters/:id/comments` — ดูคอมเมนต์ตอนนิยาย
**Auth:** ไม่ต้อง

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "content": "ชอบมากเลย!",
    "parent_id": null,
    "created_at": "...",
    "User": { "id": "uuid", "username": "reader1" }
  }
]
```

---

### `POST /api/novels/chapters/:id/comments` 🔒 — เพิ่มคอมเมนต์ / ตอบกลับ
**Auth:** ต้องการ

**Request Body:**
```json
{
  "content": "ดีมากครับ",
  "parent_id": null
}
```
> **หมายเหตุ:** ถ้าต้องการ Reply ให้ใส่ `parent_id` เป็น UUID ของคอมเมนต์แม่

---

### `POST /api/novels/:id/rate` 🔒 — ให้คะแนนนิยาย
**Auth:** ต้องการ

**Request Body:**
```json
{ "score": 5 }
```
> `score` ต้องอยู่ระหว่าง **1–5**

**Response `200`:**
```json
{ "message": "บันทึกคะแนนสำเร็จ", "rating": 4.5, "rating_count": 121 }
```

---

### `POST /api/novels/:id/bookmark` 🔒 — Toggle Bookmark นิยาย (เพิ่ม/ลบ)
**Auth:** ต้องการ

**Response `200` (เพิ่ม):**
```json
{ "bookmarked": true, "message": "เพิ่มในชั้นหนังสือแล้ว" }
```

**Response `200` (ลบ):**
```json
{ "bookmarked": false, "message": "ลบออกจากชั้นหนังสือแล้ว" }
```

---

### `GET /api/novels/:id/bookmark` 🔒 — เช็คสถานะ Bookmark
**Auth:** ต้องการ

**Response `200`:**
```json
{ "bookmarked": true }
```

---

### `GET /api/novels/my/bookmarks` 🔒 — ดูชั้นหนังสือของฉัน
**Auth:** ต้องการ

**Response `200`:** Array ของนิยายที่ Bookmark ไว้

---

### `POST /api/novels/:id/history` 🔒 — บันทึกประวัติการอ่าน
**Auth:** ต้องการ

**Request Body:**
```json
{ "chapter_id": "uuid" }
```

---

### `GET /api/novels/my/history` 🔒 — ดูประวัติการอ่านทั้งหมด
**Auth:** ต้องการ

**Response `200`:**
```json
[
  {
    "user_id": "uuid",
    "novel_id": "uuid",
    "updated_at": "2026-03-29T00:00:00Z",
    "novel": { "id": "uuid", "title": "ชื่อนิยาย", "cover_image_url": "https://...", "author": { "username": "นักเขียน" } },
    "lastChapter": { "id": "uuid", "chapter_number": 5, "title": "บทที่ 5" }
  }
]
```

---

### `GET /api/novels/authors/:authorId` — ดู Profile นักเขียน (Public)
**Auth:** ไม่ต้อง

**Response `200`:**
```json
{
  "id": "uuid",
  "username": "นักเขียน",
  "created_at": "2026-01-01T00:00:00Z",
  "follower_count": 342,
  "following_count": 10,
  "novels": [
    {
      "id": "uuid",
      "title": "ชื่อนิยาย",
      "cover_image_url": "https://...",
      "status": "ongoing",
      "view_count": 5000,
      "rating": 4.7,
      "Category": { "id": "uuid", "name": "แฟนตาซี" }
    }
  ]
}
```

---

### `POST /api/novels/authors/:authorId/follow` 🔒 — Toggle Follow/Unfollow นักเขียน
**Auth:** ต้องการ

**Request Body:** ไม่ต้องส่ง

**Response `200` (Follow):**
```json
{ "followed": true, "message": "ติดตาม DinoWriter สำเร็จ" }
```

**Response `200` (Unfollow):**
```json
{ "followed": false, "message": "ยกเลิกติดตาม DinoWriter แล้ว" }
```

---

### `GET /api/novels/authors/:authorId/follow` 🔒 — เช็คสถานะ Follow
**Auth:** ต้องการ

**Response `200`:**
```json
{ "followed": true }
```

---

### `GET /api/novels/my/following` 🔒 — รายการนักเขียนที่ฉัน Follow
**Auth:** ต้องการ

**Response `200`:**
```json
[
  { "id": "uuid", "username": "DinoWriter" }
]
```

---

## 3. Financial

**Base:** `/api/financial`

### `GET /api/financial/wallet` 🔒 — ดูกระเป๋าเงินของฉัน
**Auth:** ต้องการ

**Response `200`:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "wallet_type": "Gold",
  "balance": 250
}
```

---

### `GET /api/financial/ledger` 🔒 — ดูประวัติธุรกรรมกระเป๋าเงิน
**Auth:** ต้องการ

**Response `200`:** Array ของ Ledger entries
```json
[
  {
    "id": "uuid",
    "transaction_type": "topup",
    "amount": 100,
    "balance_after": 350,
    "reference_id": "chrg_xxx",
    "created_at": "..."
  }
]
```
**ประเภท transaction_type ที่เป็นไปได้:**
- `topup` — เติมเงิน
- `purchase_out` — ซื้อตอนนิยาย
- `author_shared` — รับส่วนแบ่งจากยอดซื้อ (นักเขียน)
- `promo_bonus` — ได้รับเหรียญจาก Promo Code

---

### `POST /api/financial/topup` 🔒 — สร้าง Order เติมเงิน (Omise)
**Auth:** ต้องการ

**Request Body:**
```json
{
  "amount_thb": 100,
  "payment_method": "promptpay"
}
```
> `payment_method`: `"promptpay"` | `"credit_card"`  
> `amount_thb`: จำนวนเงินบาทที่ต้องการเติม (ขั้นต่ำตามที่ Admin ตั้ง)

**Response `200`:**
```json
{
  "message": "สร้าง Charge สำเร็จ กรุณาชำระเงิน",
  "charge_id": "chrg_xxx",
  "qr_code_url": "https://...",
  "amount_thb": 100,
  "coins_to_receive": 110
}
```

---

### `GET /api/financial/topup/status/:chargeId` 🔒 — เช็คสถานะการเติมเงิน
**Auth:** ต้องการ

**Response `200`:**
```json
{
  "status": "successful",
  "coins_added": 110
}
```

---

### `POST /api/financial/omise-webhook` — Omise Webhook (ห้ามเรียกจาก Frontend)
> ℹ️ Omise ยิงเข้ามาเองอัตโนมัติหลังการชำระเงิน — **ไม่ต้องเรียกจาก Frontend**

---

### `GET /api/financial/author/wallet` 🔒 — ดูกระเป๋าเงินนักเขียน (THB)
**Auth:** ต้องการ (role: writer/admin)

**Response `200`:**
```json
{
  "author_id": "uuid",
  "balance": 1250.75,
  "total_earned": 5000.00
}
```

---

### `POST /api/financial/author/withdraw` 🔒 — ขอถอนเงิน
**Auth:** ต้องการ (role: writer)

**Request Body:**
```json
{
  "amount": 500,
  "bank_name": "กสิกรไทย",
  "account_number": "0123456789",
  "account_name": "นักเขียน ดีโน"
}
```

**Response `201`:**
```json
{ "message": "ส่งคำขอถอนเงินสำเร็จ กรุณารอการอนุมัติ", "request": { ... } }
```

---

### `POST /api/financial/promo/redeem` 🔒 — กดรับโปรโมชันโค้ด
**Auth:** ต้องการ

**Request Body:**
```json
{ "code": "DINO2025" }
```

**Response `200`:**
```json
{
  "message": "ใช้โค้ดสำเร็จ! ได้รับ 50 เหรียญ",
  "coins_added": 50,
  "new_balance": 300
}
```

---

## 4. ReadList

**Base:** `/api/readlists`

### `GET /api/readlists` — ดู ReadList สาธารณะ (Public)
**Auth:** ไม่ต้อง

**Response `200`:** Array ของ ReadList ที่ `is_public: true`

---

### `GET /api/readlists/my-readlists` 🔒 — ดู ReadList ของฉัน
**Auth:** ต้องการ

---

### `POST /api/readlists` 🔒 — สร้าง ReadList ใหม่
**Auth:** ต้องการ

**Request Body:**
```json
{
  "title": "นิยายไซไฟยอดนิยม",
  "description": "รวมนิยายไซไฟที่ดีที่สุด",
  "is_public": true
}
```

---

### `GET /api/readlists/:id` — ดูรายละเอียด ReadList
**Auth:** ไม่ต้อง

**Response `200`:**
```json
{
  "id": "uuid",
  "title": "นิยายไซไฟยอดนิยม",
  "is_public": true,
  "User": { "id": "uuid", "username": "curator1" },
  "Novels": [ { "id": "uuid", "title": "ชื่อนิยาย", "cover_image_url": "..." } ]
}
```

---

### `PUT /api/readlists/:id` 🔒 — แก้ไข ReadList
**Auth:** ต้องการ (เจ้าของ)

**Request Body:** เหมือน POST

---

### `DELETE /api/readlists/:id` 🔒 — ลบ ReadList
**Auth:** ต้องการ (เจ้าของ)

---

### `POST /api/readlists/:id/items` 🔒 — เพิ่มนิยายเข้า ReadList
**Auth:** ต้องการ (เจ้าของ)

**Request Body:**
```json
{ "novel_id": "uuid" }
```

---

### `DELETE /api/readlists/:id/items/:novel_id` 🔒 — ลบนิยายออกจาก ReadList
**Auth:** ต้องการ (เจ้าของ)

---

### `POST /api/readlists/:id/follow` 🔒 — Toggle Follow ReadList
**Auth:** ต้องการ

**Response `200`:**
```json
{ "followed": true, "message": "ติดตาม ReadList สำเร็จ" }
```

---

## 5. Gamification

**Base:** `/api/gamification`

### `GET /api/gamification/gacha` — ดูตู้ Gacha ที่เปิดอยู่
**Auth:** ไม่ต้อง

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "name": "ตู้ไดโนพรีเมียม",
    "ticket_cost": 1,
    "daily_limit": 10,
    "GachaRates": [
      { "id": "uuid", "drop_rate": 0.01, "Item": { "id": "uuid", "name": "ฟิกเกอร์ไดโน SR", "rarity": "SR" } }
    ]
  }
]
```

---

### `POST /api/gamification/gacha/roll` 🔒 — หมุนตู้ Gacha
**Auth:** ต้องการ

**Request Body:**
```json
{ "gacha_banner_id": "uuid" }
```

**Response `200`:**
```json
{
  "message": "สุ่มสำเร็จ!",
  "item": { "id": "uuid", "name": "ฟิกเกอร์ไดโน SR", "rarity": "SR", "image_url": "https://..." }
}
```

**Response `400`:**
```json
{ "message": "ตั๋วสุ่มไม่เพียงพอ" }
```

---

### `GET /api/gamification/missions` 🔒 — ดูภารกิจที่ Active อยู่
**Auth:** ต้องการ

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "title": "อ่านนิยาย 5 เรื่อง",
    "description": "อ่านนิยายครบ 5 เรื่องในสัปดาห์นี้",
    "reward_type": "gold_coin",
    "reward_amount": 20,
    "target_count": 5,
    "UserMissionProgress": { "progress_count": 3, "is_completed": false, "is_claimed": false }
  }
]
```

---

### `POST /api/gamification/missions/:id/claim` 🔒 — กดรับรางวัลภารกิจ
**Auth:** ต้องการ

**Response `200`:**
```json
{ "message": "รับรางวัลสำเร็จ! ได้รับ 20 เหรียญทอง" }
```

**Response `400`:**
```json
{ "message": "ภารกิจยังไม่สำเร็จ" }
```

---

## 6. Rewards

**Base:** `/api/rewards`

### `GET /api/rewards/shop` — ดู Event Shop (แลกด้วย Dino Egg)
**Auth:** ไม่ต้อง

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "name": "สติ๊กเกอร์ไดโน",
    "description": "สติ๊กเกอร์ฉลองวันเกิด",
    "egg_price": 50,
    "stock": 100,
    "max_per_user": 2,
    "image_url": "https://..."
  }
]
```

---

### `POST /api/rewards/shop/exchange` 🔒 — แลกไอเท็มจาก Event Shop
**Auth:** ต้องการ

**Request Body:**
```json
{ "item_id": "uuid", "quantity": 1 }
```

**Response `200`:**
```json
{ "message": "แลกไอเท็มสำเร็จ! ไอเท็มอยู่ในคลังของคุณแล้ว" }
```

---

### `GET /api/rewards/inventory` 🔒 — ดูคลังของรางวัลของฉัน
**Auth:** ต้องการ

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "name": "ฟิกเกอร์ไดโน SR",
    "type": "physical",
    "rarity": "SR",
    "image_url": "https://...",
    "UserInventory": { "quantity": 1, "is_claimed": false }
  }
]
```

---

### `GET /api/rewards/addresses` 🔒 — ดูที่อยู่จัดส่งของฉัน
**Auth:** ต้องการ

**Response `200`:** Array ของที่อยู่

---

### `POST /api/rewards/shipping` 🔒 — ขอรับของรางวัลจริง (สร้าง Shipping Request)
**Auth:** ต้องการ

**Request Body:**
```json
{
  "item_id": "uuid",
  "address_id": "uuid"
}
```

**Response `201`:**
```json
{
  "message": "ส่งคำขอจัดส่งสำเร็จ Admin จะดำเนินการภายใน 3-5 วันทำการ",
  "request": { "id": "uuid", "status": "pending" }
}
```

---

## 7. Marketing

**Base:** `/api/marketing`

### `GET /api/marketing/banners` — ดูแบนเนอร์ที่เปิดใช้งาน
**Auth:** ไม่ต้อง

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "title": "นิยายแห่งปี 2026",
    "image_url": "https://...",
    "link_url": "https://...",
    "zone": "home",
    "display_order": 1
  }
]
```

> **หมายเหตุ:** `zone` มีค่าได้คือ `"home"` หรือ `"event"` — Frontend กรองเองตาม zone ที่ต้องการ

---

### `POST /api/marketing/banners/request` 🔒 — ขอให้ Admin นำนิยายขึ้นแบนเนอร์
**Auth:** ต้องการ (role: writer)

**Request Body:**
```json
{
  "novel_id": "uuid",
  "message": "ขอโปรโมตนิยายใหม่ของผมครับ"
}
```

**Response `201`:**
```json
{ "message": "ส่งคำขอสำเร็จ กรุณารอการอนุมัติจาก Admin" }
```

---

### `GET /api/marketing/notifications` 🔒 — ดูการแจ้งเตือนของฉัน
**Auth:** ต้องการ

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "title": "ตอนใหม่มาแล้ว!",
    "body": "นิยาย 'ชื่อนิยาย' อัปเดตบทที่ 10 แล้ว",
    "is_read": false,
    "created_at": "..."
  }
]
```

---

### `POST /api/marketing/device-token` 🔒 — ลงทะเบียน FCM Token (Push Notification)
**Auth:** ต้องการ

**Request Body:**
```json
{
  "token": "fcm_device_token_string",
  "platform": "web"
}
```
> `platform`: `"web"` | `"ios"` | `"android"`

**Response `200`:**
```json
{ "message": "ลงทะเบียน Device Token สำเร็จ" }
```

---

## 8. Admin

**Base:** `/api/admin`

> [!CAUTION]
> ทุก endpoint ในหมวดนี้ต้องการ Token ที่มี **`role: "admin"`** เท่านั้น ผู้ใช้ทั่วไปจะได้รับ `403 Forbidden`

### `GET /api/admin/dashboard` 🔒👑 — ภาพรวม Dashboard
**Response `200`:**
```json
{
  "total_users": 1500,
  "total_novels": 320,
  "total_revenue_thb": 125000.00,
  "pending_withdrawals": 5
}
```

---

### `GET /api/admin/users` 🔒👑 — ดูรายชื่อผู้ใช้ทั้งหมด
**Response `200`:** Array ของ Users พร้อม Wallet balance

---

### `PUT /api/admin/users/:id/role` 🔒👑 — เปลี่ยน Role ผู้ใช้
**Request Body:**
```json
{ "role": "writer" }
```
> `role`: `"reader"` | `"writer"` | `"admin"`

---

### `GET /api/admin/withdrawals` 🔒👑 — ดูคำขอถอนเงินทั้งหมด
**Response `200`:** Array ของ WithdrawalRequests พร้อม status filter ได้

---

### `PUT /api/admin/withdrawals/:id/process` 🔒👑 — อนุมัติ/ปฏิเสธการถอนเงิน
**Request Body:**
```json
{
  "status": "approved",
  "admin_note": "โอนแล้วเมื่อ 29 มี.ค. 2026"
}
```
> `status`: `"approved"` | `"rejected"`

---

### `GET /api/admin/promos` 🔒👑 — ดูโปรโมชันโค้ดทั้งหมด

### `POST /api/admin/promos` 🔒👑 — สร้างโปรโมชันโค้ด
**Request Body:**
```json
{
  "code": "DINO2025",
  "coin_reward": 50,
  "max_uses": 1000,
  "expires_at": "2026-12-31T23:59:59Z"
}
```

---

### `PUT /api/admin/novels/:id/suspend` 🔒👑 — ระงับนิยาย
**Response `200`:**
```json
{ "message": "ระงับนิยายสำเร็จ" }
```

---

## 🔑 HTTP Status Codes

| Code | ความหมาย |
|------|----------|
| `200` | สำเร็จ |
| `201` | สร้างข้อมูลสำเร็จ |
| `400` | ข้อมูลไม่ถูกต้อง / เงื่อนไขไม่ผ่าน |
| `401` | ไม่ได้ส่ง Token หรือ Token หมดอายุ |
| `403` | ไม่มีสิทธิ์ (Token ถูก แต่ Role ไม่ใช่) |
| `404` | ไม่พบข้อมูล |
| `500` | Server Error |

---

## 💡 Tips สำหรับ Frontend

1. **Token expiry:** JWT หมดอายุใน **7 วัน** — ให้ Redirect ไปหน้า Login เมื่อได้ `401`
2. **UUID:** ทุก ID ในระบบเป็น `UUID v4` format
3. **Soft Search:** `?search=` ใช้ `iLike` (case-insensitive) รองรับภาษาไทย
4. **Toggle pattern:** Endpoint ที่เป็น Toggle (Follow/Bookmark) เรียก POST ซ้ำเพื่อ Unfollow — ดูจาก `followed: true/false` ในผลลัพธ์
5. **Pagination:** ยังไม่มีในเวอร์ชันนี้ — API คืนข้อมูลทั้งหมดในครั้งเดียว
