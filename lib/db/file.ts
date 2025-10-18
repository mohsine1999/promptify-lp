import fs from "fs";
import path from "path";
import type { LPDocument } from "@/lib/schema/page";

export type StoredPage = {
  id: string;
  slug: string;
  status: "draft" | "published";
  doc: LPDocument;
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "pages.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]), "utf-8");
}

function readAll(): StoredPage[] {
  try {
    ensure();
    const raw = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(raw) as StoredPage[];
  } catch {
    return [];
  }
}

function writeAll(list: StoredPage[]) { ensure(); fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8"); }
function slugify(input: string) {
  return (input || "page").toString().trim().toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60);
}
function randomId() { return Math.random().toString(36).slice(2, 10); }

export const db = {
  list(): StoredPage[] { return readAll().sort((a,b)=> (a.updatedAt < b.updatedAt ? 1 : -1)); },
  get(id: string): StoredPage | null { return readAll().find(p => p.id === id) || null; },
  create(input: { doc: LPDocument }): StoredPage {
    const all = readAll();
    const id = randomId();
    const slug = slugify(input.doc.product?.name || id) || id;
    const now = new Date().toISOString();
    const page: StoredPage = { id, slug, status: "draft", doc: input.doc, createdAt: now, updatedAt: now };
    all.push(page); writeAll(all); return page;
  },
  update(id: string, doc: LPDocument): StoredPage | null {
    const all = readAll(); const idx = all.findIndex(p => p.id === id); if (idx === -1) return null;
    const now = new Date().toISOString(); all[idx] = { ...all[idx], doc, updatedAt: now }; writeAll(all); return all[idx];
  },
  delete(id: string) { const out = readAll().filter(p => p.id !== id); writeAll(out); return true; }
};
