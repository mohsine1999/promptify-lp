import fs from "fs";
import path from "path";
import { buildDeploymentHost } from "@/lib/config/deployment";
import type { LPDocument } from "@/lib/schema/page";

export type StoredPage = {
  id: string;
  slug: string;
  status: "draft" | "published";
  domain?: string;
  publishedAt?: string;
  doc: LPDocument;
  createdAt: string;
  updatedAt: string;
};

const TMP_DIR = path.join("/tmp", "promptify-lp-data");

function resolveDataDir() {
  const configured = process.env.DATA_DIR?.trim();
  if (configured) return configured;
  if (process.env.VERCEL === "1" || process.env.VERCEL === "true") return TMP_DIR;
  return path.join(process.cwd(), ".data");
}

const DATA_DIR = resolveDataDir();
const FILE = path.join(DATA_DIR, "pages.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
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

function ensureUniqueSlug(list: StoredPage[], desired: string, excludeId?: string) {
  const base = desired && desired.length ? desired : "page";
  let candidate = base;
  let counter = 2;
  while (list.some(page => page.slug === candidate && page.id !== excludeId)) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
}

export const db = {
  list(): StoredPage[] { return readAll().sort((a,b)=> (a.updatedAt < b.updatedAt ? 1 : -1)); },
  get(id: string): StoredPage | null { return readAll().find(p => p.id === id) || null; },
  create(input: { doc: LPDocument }): StoredPage {
    const all = readAll();
    const id = randomId();
    const desiredSlug = slugify(input.doc.product?.name || id) || id;
    const slug = ensureUniqueSlug(all, desiredSlug, id);
    const now = new Date().toISOString();
    const page: StoredPage = {
      id,
      slug,
      status: "draft",
      domain: buildDeploymentHost(slug),
      doc: input.doc,
      createdAt: now,
      updatedAt: now,
    };
    all.push(page); writeAll(all); return page;
  },
  update(id: string, doc: LPDocument): StoredPage | null {
    const all = readAll(); const idx = all.findIndex(p => p.id === id); if (idx === -1) return null;
    const now = new Date().toISOString(); all[idx] = { ...all[idx], doc, updatedAt: now }; writeAll(all); return all[idx];
  },
  publish(id: string): StoredPage | null {
    const all = readAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    const current = all[idx];
    const desiredSlug = slugify(current.doc.product?.name || current.slug || current.id) || current.slug || current.id;
    const slug = ensureUniqueSlug(all, desiredSlug, current.id);
    if (current.status === "published") {
      const updated = { ...current, slug, domain: buildDeploymentHost(slug), updatedAt: now };
      all[idx] = updated; writeAll(all); return updated;
    }
    const published: StoredPage = {
      ...current,
      slug,
      status: "published",
      publishedAt: now,
      updatedAt: now,
      domain: buildDeploymentHost(slug),
    };
    all[idx] = published; writeAll(all); return published;
  },
  findBySlug(slug: string): StoredPage | null {
    return readAll().find(p => p.slug === slug) || null;
  },
  delete(id: string) { const out = readAll().filter(p => p.id !== id); writeAll(out); return true; }
};
