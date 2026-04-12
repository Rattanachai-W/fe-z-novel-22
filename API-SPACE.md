# 📚 be-z-novel API Specification
**เวอร์ชัน**: 1.0.0
**อัปเดตล่าสุด**: เมษายน 2026

เอกสารนี้รวบรวม API ทั้งหมดของระบบสำหรับให้ทีมพัฒนา Frontend สามารถเรียกใช้งานได้อย่างราบรื่น

---

## 🛠️ ข้อตกลงทั่วไป (General Convention)

### 1. Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `[URL ของเซิร์ฟเวอร์ Render]/api`

### 2. การยืนยันตัวตน (Authentication)
เกือบทุกเส้น API ควบคุมสิทธิ์ด้วย JWT Token ใน Header (สัญลักษณ์ 🔒 ในเอกสารแปลว่าต้องส่งแนบด้วยเสมอ)
```http
Authorization: Bearer <your_token>
```

### 3. มาตรฐานการตอบกลับข้อผิดพลาด (Error Handling)
เมื่อเกิดข้อผิดพลาด API จะส่ง JSON พร้อมกับ HTTP Status Code ตามประเภทปัญหา และมีคีย์ `status_code` ดังนี้
```json
{
  "status_code": "101", 
  "message": "คุณไม่ใช่เจ้าของนิยายเรื่องนี้"
}
```
* **101**: สิทธิ์ไม่เพียงพอ / ยังไม่เข้าระบบ / Token หมดอายุ (Authorization)
* **102**: ค้นหาไม่เจอ / ไม่มีข้อมูล (Not Found)
* **103**: ข้อมูลที่ส่งมาผิดรูปแบบ / ขาดหาย / ข้อมูลซ้ำ (Bad Input)
* **104**: ยอดเงินไม่พอ / เติมเงินไม่ถึงขั้นต่ำ / เงื่อนไขระบบการเงินไม่ผ่าน (Financial)
* **999**: เซิร์ฟเวอร์ขัดข้อง (Server Error)

---

## 🔐 1. Authentication (ระบบผู้ใช้)

### 1.1 สมัครสมาชิก
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "username": "reader01",
    "email": "user@mail.com",
    "password": "password123"
  }
  ```
- **Response** `201 Created`:
  ```json
  { "message": "ลงทะเบียนสำเร็จแล้ว", "token": "eyJ..." }
  ```

### 1.2 ล็อกอินเข้าสู่ระบบ
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@mail.com",
    "password": "password123"
  }
  ```
- **Response** `200 OK`:
  ```json
  { "message": "ล็อกอินสำเร็จ", "token": "eyJ...", "user": { "id": "...", "username": "..." } }
  ```

### 1.3 ล็อกอินผ่าน Facebook (OAuth)
- **Endpoint**: `GET /auth/facebook`
- **อธิบาย**: Frontend จะต้องทำการเปลี่ยนเส้นทางผู้ใช้ (Redirect) มาที่ URL นี้ เมื่อล็อกอินเสร็จ ระบบจะ Redirect กลับไปยังฝั่ง Frontend ด้วย URL `/?token=xxxx&username=xxxx` ผู้ใช้จะต้องจับค่าจาก URL ไปเก็บใน LocalStorage

---

## 📖 2. Novels (ระบบนิยาย)

### 2.1 ดึงรายการนิยายทั้งหมด (ค้นหา & แบ่งหน้า)
- **Endpoint**: `GET /novels`
- **Query Params**:
  - `page` (int) - Default: 1
  - `limit` (int) - Default: 10
  - `category` (string) - หมวดหมู่ UUID
  - `search` (string) - คำค้นหา
- **Response** `200 OK`:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "ชื่อนิยาย",
        "cover_image_url": "url",
        "view_count": 100,
        "rating": 4.5,
        "writer": { "id": "uuid", "username": "writer name" }
      }
    ],
    "pagination": { "current_page": 1, "total_pages": 5, ... }
  }
  ```

### 2.2 ดึงรายละเอียดนิยาย
- **Endpoint**: `GET /novels/:id`
- **Response** `200 OK`:
  ```json
  {
    "id": "uuid",
    "title": "ชื่อนิยาย",
    "description": "เนื้อเรื่องย่อ...",
    "chapters": [
      { "id": "uuid", "chapter_number": 1, "title": "บทนำ", "is_free": true, ... }
    ],
    ...
  }
  ```

### 2.3 สร้างนิยายใหม่ 🔒 (เฉพาะ Writer แต่อนาคตทุกคนสร้างได้)
- **Endpoint**: `POST /novels`
- **Body**: `{ "title": "...", "description": "...", "category_id": "uuid", "tags": ["uuid"] }`

### 2.4 ดึงข้อมูลโปรไฟล์นักเขียน & ผลงานนิยาย (Public)
- **Endpoint**: `GET /novels/writers/:writerId/novels`
- **Query Params**: `page`, `limit`, `sort`
- **Response** `200 OK`: คืนค่ารายชื่อนิยายของนักเขียนคนนี้แบบแบ่งหน้าพร้อม `status_code` มาตรฐาน

---

## 📑 3. Chapters & Interaction (ตอนนิยาย การอ่าน และปฏิสัมพันธ์)

### 3.1 อ่านตอนนิยาย (เนื้อหา)
- **Endpoint**: `GET /novels/chapters/:id`
- **อธิบาย**: ถ้าเป็นตอนที่จ่ายเงินและผู้อ่านยังไม่ซื้อเนื้อหา `content` จะถูกซ่อน และขึ้น `is_locked: true` ให้ Frontend โชว์ปุ่ม "ปลดล็อก" และบอกราคา 

### 3.2 ปลดล็อกตอนนิยาย 🔒
- **Endpoint**: `POST /novels/chapters/:id/unlock`
- **Response** `200 OK`: ถ้ายอดเงินพอ จะตัดยอดและคืนค่า ปลดล็อกจบ
- **Error Responses**: 
  - `104`: เหรียญอัฐไม่เพียงพอ กรุณาเติมเงิน

### 3.3 กดหัวใจ (Like) รายตอน 🔒
- **Endpoint**: `POST /novels/chapters/:id/like`
- **Response** `200 OK`: `{ "liked": true, "like_count": 15, "message": "..." }`

### 3.4 เช็คสถานะการกดหัวใจ 🔒
- **Endpoint**: `GET /novels/chapters/:id/like`
- **Response** `200 OK`: `{ "liked": true }`

### 3.5 ดู & เพิ่มคอมเมนต์ 🔒
- **Endpoint**: `GET /novels/chapters/:id/comments` (ไม่ต้องล็อคอิน)
- **Endpoint**: `POST /novels/chapters/:id/comments` (ส่ง `{ content: "...", parent_id: "uuid" }` สำหรับ Reply)

### 3.6 บันทึกและดึงของชั้นหนังสือ (Bookmarks) 🔒
- **Endpoint Toggle**: `POST /novels/:id/bookmark`
- **Endpoint List**: `GET /novels/my/bookmarks` (มี Pagination)

### 3.7 เก็บประวัติการอ่าน (History) 🔒
- **Endpoint**: `POST /novels/:id/history` (ส่ง `{ chapter_id: "uuid" }`)
- **Endpoint List**: `GET /novels/my/history`

---

## 💰 4. Financial (ระบบกระเป๋าเงิน และยอดตัดจ่าย)

### 4.1 ดูยอดเงินผู้อ่าน (Reader Wallet) 🔒
- **Endpoint**: `GET /financial/wallet`
- **Response** `200 OK`: `{ "id": "...", "balance": 1500 }` (หน่วย: เหรียญทอง)

### 4.2 เติมเงินรายครั้ง (Top-up via Omise) 🔒
- **Endpoint**: `POST /financial/topup`
- **Body**: `{ "amount": 100, "nonce": "tok_xxxx" }` *(ขั้นต่ำ 20 บาท)*
- **Response** `201 Created`: ถ้าเป็นระบบ Promptpay/บัตร จะให้ Payment Status และ QR URI คืนไปโชว์ที่หน้าเว็บ

### 4.3 ระบบตู้รหัส (Promo Code) 🔒
- **Endpoint**: `POST /financial/promo/redeem`
- **Body**: `{ "code": "NEWUSER2026" }`

### 4.4 สร้างคำขอถอนเงิน (Writer) 🔒
- **Endpoint**: `POST /financial/writer/withdraw`
- **Body**: `{ "goldAmount": 1000 }`

---

## 📊 5. Writer Dashboard (หน้านักเขียนส่วนตัว) 🔒

### 5.1 ดูนิยายของฉัน (จัดหลังบ้าน)
- **Endpoint**: `GET /novels/my/novels`
- **Query Params**: `page`, `limit`, `status` (เช่น `draft`, `published`)

### 5.2 สร้าง/อัปเดต ตอนย่อย
- **POST** `/novels/chapters`
- **PUT** `/novels/chapters/:id`
- **Body**: `{ "novel_id": "...", "title": "...", "content": "...", "is_free": false, "coin_price": 50 }`

### 5.3 ยอดสถิติหน้าแรก (Stats Dashboard)
- **Endpoint**: `GET /novels/my/stats`
- **Response**: รวบรวมยอดวิวรวม ยอดผู้ติดตาม และคะแนนรวม

### 5.4 ยอดรายได้และการถอนเงิน
- **Endpoint**: `GET /financial/writer/wallet` (ดึงยอดเงินกระเป๋า THB รอยืนยันถอนทียบกับเงินสด)
- **Endpoint**: `GET /financial/writer/earnings` (ดึง Payment History แยกรายตอนที่ขายได้)

---
*หมายเหตุถึงฝั่ง Frontend*: ระบบ API รองรับโมเดลการประมวลผลรูปแบบทศนิยม `Decimal` เพื่อป้องกันปัญหาทศนิยมตกหล่น (เช่น .001) และตัวเลขที่แสดงเกี่ยวกับรายรับรายจ่ายจะแม่นยำสูงมาก โปรดทำหน้ากากตัวเลขใน UI ปัดทศนิยมให้ถูกต้องตามดีไซน์ด้วย
