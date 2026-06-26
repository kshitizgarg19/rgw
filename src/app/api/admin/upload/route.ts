import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/avif"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Use JPG, PNG, WEBP or SVG." }, { status: 400 });
  }
  if (file.size > 6 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 6MB)." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const name = `${Date.now()}-${safe}`;
  await writeFile(path.join(dir, name), bytes);

  return NextResponse.json({ path: `/uploads/${name}` });
}
