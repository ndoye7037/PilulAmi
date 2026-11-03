import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Entry = {
  email: string;
  createdAt: string;
};

export async function POST(request: Request) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Merci d’indiquer un e-mail valide." },
      { status: 400 },
    );
  }

  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "waitlist.json");

  await mkdir(dataDir, { recursive: true });

  let entries: Entry[] = [];
  try {
    const existing = await readFile(filePath, "utf8");
    entries = JSON.parse(existing) as Entry[];
  } catch {
    entries = [];
  }

  if (entries.some((entry) => entry.email === email)) {
    return NextResponse.json({ ok: true, alreadyRegistered: true });
  }

  entries.push({ email, createdAt: new Date().toISOString() });
  await writeFile(filePath, JSON.stringify(entries, null, 2), "utf8");

  return NextResponse.json({ ok: true });
}
