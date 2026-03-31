import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "novel-covers");
const supportedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ message: "ไม่พบไฟล์รูปภาพ" }, { status: 400 });
    }

    if (!supportedMimeTypes.has(file.type)) {
      return Response.json(
        { message: "รองรับเฉพาะไฟล์ JPG, PNG, WEBP และ GIF" },
        { status: 415 },
      );
    }

    const maxBytes = 5 * 1024 * 1024;

    if (file.size > maxBytes) {
      return Response.json({ message: "ไฟล์ต้องมีขนาดไม่เกิน 5MB" }, { status: 413 });
    }

    await mkdir(uploadDirectory, { recursive: true });

    const extension = supportedMimeTypes.get(file.type) ?? ".jpg";
    const safeName = `${Date.now()}-${randomUUID()}${extension}`;
    const filePath = path.join(uploadDirectory, safeName);
    const arrayBuffer = await file.arrayBuffer();

    await writeFile(filePath, Buffer.from(arrayBuffer));

    return Response.json({
      message: "อัปโหลดรูปปกแล้ว",
      url: `/uploads/novel-covers/${safeName}`,
      fileName: safeName,
    });
  } catch {
    return Response.json({ message: "อัปโหลดรูปปกไม่สำเร็จ" }, { status: 500 });
  }
}
