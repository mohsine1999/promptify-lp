import fs from "fs";
import fsp from "fs/promises";
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
const RAW_BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ??
  process.env.VERCEL_BLOB_READ_WRITE_TOKEN ??
  "";
const BLOB_WRITE_TOKEN = RAW_BLOB_TOKEN.trim();
const BLOB_TOKEN_SOURCE = process.env.BLOB_READ_WRITE_TOKEN
  ? "BLOB_READ_WRITE_TOKEN"
  : process.env.VERCEL_BLOB_READ_WRITE_TOKEN
  ? "VERCEL_BLOB_READ_WRITE_TOKEN"
  : null;
const BLOB_API_BASE = process.env.BLOB_API_BASE_URL?.trim() || "https://api.vercel.com";
const BLOB_PAGES_KEY = process.env.BLOB_PAGES_KEY?.trim() || "promptify/pages.json";
const onVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const USE_BLOB = onVercel && !!BLOB_WRITE_TOKEN;

if (onVercel && !USE_BLOB) {
  console.warn(
    "BLOB_READ_WRITE_TOKEN not found – landing pages will only persist for the lifetime of a single serverless instance."
  );
} else if (USE_BLOB && BLOB_TOKEN_SOURCE) {
  console.info(
    `Using Vercel Blob persistence via ${BLOB_TOKEN_SOURCE}.`
  );
}

const blobHeaders = () => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${BLOB_WRITE_TOKEN}`);
  return headers;
};

async function ensureFs(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    await fsp.mkdir(dir, { recursive: true });
  }
  try {
    await fsp.access(filePath, fs.constants.F_OK);
  } catch {
    await fsp.writeFile(filePath, JSON.stringify([]), "utf-8");
  }
}

function resolveDataDir() {
  const configured = process.env.DATA_DIR?.trim();
  if (configured) return configured;
  if (process.env.VERCEL === "1" || process.env.VERCEL === "true") return TMP_DIR;
  return path.join(process.cwd(), ".data");
}

const DATA_DIR = resolveDataDir();
const FILE = path.join(DATA_DIR, "pages.json");

let cachedPages: StoredPage[] | null = null;

function clonePages(list: StoredPage[]): StoredPage[] {
  return JSON.parse(JSON.stringify(list)) as StoredPage[];
}

async function fetchBlobJSON<T>(url: string): Promise<T | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function readAllFromBlob(): Promise<StoredPage[]> {
  if (cachedPages) {
    return clonePages(cachedPages);
  }

  const headers = blobHeaders();
  const listUrl = new URL("/v2/blob/list", BLOB_API_BASE);
  listUrl.searchParams.set("prefix", BLOB_PAGES_KEY);

  const listRes = await fetch(listUrl, { headers });
  if (!listRes.ok) {
    throw new Error(`Failed to list blob entries (${listRes.status})`);
  }

  const listJson = (await listRes.json()) as {
    blobs: { pathname: string; url: string; downloadUrl?: string }[];
  };

  const match = listJson.blobs.find((blob) => blob.pathname === BLOB_PAGES_KEY);

  if (!match) {
    await writeAllToBlob([]);
    cachedPages = [];
    return [];
  }

  const data = await fetchBlobJSON<StoredPage[]>(match.downloadUrl || match.url);
  if (!data) {
    await writeAllToBlob([]);
    cachedPages = [];
    return [];
  }

  cachedPages = clonePages(data);
  return clonePages(data);
}

async function writeAllToBlob(list: StoredPage[]) {
  const headers = blobHeaders();
  headers.set("x-vercel-filename", BLOB_PAGES_KEY);
  headers.set("x-vercel-blob-add-random-suffix", "false");
  headers.set("x-vercel-blob-access", "private");
  headers.set("Content-Type", "application/json");

  const putUrl = new URL("/v2/blob/put", BLOB_API_BASE);
  const res = await fetch(putUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(list, null, 2),
  });

  if (!res.ok) {
    throw new Error(`Failed to persist blob (${res.status})`);
  }

  cachedPages = clonePages(list);
}

async function readAllFromFs(): Promise<StoredPage[]> {
  await ensureFs(FILE);
  try {
    const raw = await fsp.readFile(FILE, "utf-8");
    const data = JSON.parse(raw) as StoredPage[];
    cachedPages = clonePages(data);
    return clonePages(data);
  } catch {
    return [];
  }
}

async function writeAllToFs(list: StoredPage[]) {
  await ensureFs(FILE);
  await fsp.writeFile(FILE, JSON.stringify(list, null, 2), "utf-8");
  cachedPages = clonePages(list);
}

async function readAll(): Promise<StoredPage[]> {
  try {
    if (USE_BLOB) {
      return await readAllFromBlob();
    }
  } catch (error) {
    console.error("Falling back to filesystem storage after blob read failure", error);
  }
  return readAllFromFs();
}

async function writeAll(list: StoredPage[]) {
  if (USE_BLOB) {
    try {
      await writeAllToBlob(list);
      return;
    } catch (error) {
      console.error("Blob storage write failed, persisting to filesystem", error);
    }
  }
  await writeAllToFs(list);
}
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
  async list(): Promise<StoredPage[]> {
    const all = await readAll();
    return [...all].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  },
  async get(id: string): Promise<StoredPage | null> {
    const all = await readAll();
    return all.find((p) => p.id === id) || null;
  },
  async create(input: { doc: LPDocument }): Promise<StoredPage> {
    const all = await readAll();
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
    all.push(page);
    await writeAll(all);
    return page;
  },
  async update(id: string, doc: LPDocument): Promise<StoredPage | null> {
    const all = await readAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    all[idx] = { ...all[idx], doc, updatedAt: now };
    await writeAll(all);
    return all[idx];
  },
  async publish(id: string): Promise<StoredPage | null> {
    const all = await readAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    const current = all[idx];
    const desiredSlug = slugify(current.doc.product?.name || current.slug || current.id) || current.slug || current.id;
    const slug = ensureUniqueSlug(all, desiredSlug, current.id);
    if (current.status === "published") {
      const updated = { ...current, slug, domain: buildDeploymentHost(slug), updatedAt: now };
      all[idx] = updated;
      await writeAll(all);
      return updated;
    }
    const published: StoredPage = {
      ...current,
      slug,
      status: "published",
      publishedAt: now,
      updatedAt: now,
      domain: buildDeploymentHost(slug),
    };
    all[idx] = published;
    await writeAll(all);
    return published;
  },
  async findBySlug(slug: string): Promise<StoredPage | null> {
    const all = await readAll();
    return all.find((p) => p.slug === slug) || null;
  },
  async delete(id: string): Promise<boolean> {
    const all = await readAll();
    const out = all.filter((p) => p.id !== id);
    await writeAll(out);
    return true;
  },
};
