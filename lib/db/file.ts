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

/**
 * Supabase table schema (public.pages)
 * - id text primary key
 * - slug text unique
 * - status text ('draft' | 'published')
 * - domain text
 * - published_at timestamptz null
 * - doc jsonb
 * - created_at timestamptz default now()
 * - updated_at timestamptz default now()
 * Ensure RLS policies permit the configured key to perform CRUD operations.
 */
type SupabasePageRow = {
  id: string;
  slug: string;
  status: "draft" | "published";
  domain: string | null;
  published_at: string | null;
  doc: LPDocument;
  created_at: string;
  updated_at: string;
};

type SupabaseRequestInit = RequestInit & {
  searchParams?: Record<string, string | number | undefined>;
};

const SUPABASE_URL =
  process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) must be configured");
}

if (!SUPABASE_KEY) {
  throw new Error(
    "A Supabase API key is required. Set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

const REST_BASE = new URL("/rest/v1/", SUPABASE_URL);

function mapRow(row: SupabasePageRow): StoredPage {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    domain: row.domain ?? undefined,
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : undefined,
    doc: row.doc,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function supabaseFetch<T>(path: string, init: SupabaseRequestInit = {}): Promise<T> {
  const { searchParams, ...requestInit } = init;
  const url = new URL(path.replace(/^\//, ""), REST_BASE);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }

  const headers = new Headers(requestInit.headers);
  headers.set("apikey", SUPABASE_KEY);
  headers.set("Authorization", `Bearer ${SUPABASE_KEY}`);
  if (requestInit.method && requestInit.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...requestInit,
    headers,
    cache: requestInit.cache ?? "no-store",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Supabase request failed (${response.status}): ${text}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // DELETE without return body returns 204 with no JSON
    return undefined as T;
  }

  return (await response.json()) as T;
}

function slugify(input: string) {
  return (input || "page")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const params: Record<string, string> = {
    slug: `eq.${slug}`,
    select: "id",
    limit: "1",
  };
  if (excludeId) {
    params.id = `neq.${excludeId}`;
  }
  const rows = await supabaseFetch<SupabasePageRow[]>("pages", { searchParams: params });
  return rows.length > 0;
}

async function ensureUniqueSlug(desired: string, excludeId?: string) {
  const base = desired && desired.length ? desired : "page";
  let candidate = base;
  let counter = 2;
  while (await slugExists(candidate, excludeId)) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
}

async function getById(id: string): Promise<StoredPage | null> {
  const rows = await supabaseFetch<SupabasePageRow[]>("pages", {
    searchParams: {
      select: "*",
      id: `eq.${id}`,
      limit: "1",
    },
  });
  if (!rows.length) return null;
  return mapRow(rows[0]);
}

export const db = {
  async list(): Promise<StoredPage[]> {
    const rows = await supabaseFetch<SupabasePageRow[]>("pages", {
      searchParams: {
        select: "*",
        order: "updated_at.desc",
      },
    });
    return rows.map(mapRow);
  },

  async get(id: string): Promise<StoredPage | null> {
    return getById(id);
  },

  async create(input: { doc: LPDocument }): Promise<StoredPage> {
    const desiredSlug = slugify(input.doc.product?.name || "");
    const slug = await ensureUniqueSlug(desiredSlug);
    const now = new Date().toISOString();
    const id = randomId();
    const domain = buildDeploymentHost(slug);
    const [row] = await supabaseFetch<SupabasePageRow[]>("pages", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        id,
        slug,
        status: "draft",
        domain,
        doc: input.doc,
        created_at: now,
        updated_at: now,
      }),
    });
    return mapRow(row);
  },

  async update(id: string, doc: LPDocument): Promise<StoredPage | null> {
    const now = new Date().toISOString();
    const rows = await supabaseFetch<SupabasePageRow[]>("pages", {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      searchParams: {
        id: `eq.${id}`,
      },
      body: JSON.stringify({
        doc,
        updated_at: now,
      }),
    });
    if (!rows.length) return null;
    return mapRow(rows[0]);
  },

  async publish(id: string): Promise<StoredPage | null> {
    const existing = await getById(id);
    if (!existing) return null;
    const desiredSlug = slugify(
      existing.doc.product?.name || existing.slug || existing.id
    );
    const slug = await ensureUniqueSlug(desiredSlug, existing.id);
    const now = new Date().toISOString();
    const domain = buildDeploymentHost(slug);

    const body: Partial<SupabasePageRow> & Record<string, unknown> = {
      slug,
      domain,
      updated_at: now,
    };

    if (existing.status !== "published") {
      body.status = "published" as const;
      body.published_at = now;
    }

    const rows = await supabaseFetch<SupabasePageRow[]>("pages", {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      searchParams: {
        id: `eq.${id}`,
      },
      body: JSON.stringify(body),
    });
    if (!rows.length) return null;
    return mapRow(rows[0]);
  },

  async findBySlug(slug: string): Promise<StoredPage | null> {
    const rows = await supabaseFetch<SupabasePageRow[]>("pages", {
      searchParams: {
        select: "*",
        slug: `eq.${slug}`,
        limit: "1",
      },
    });
    if (!rows.length) return null;
    return mapRow(rows[0]);
  },

  async delete(id: string): Promise<boolean> {
    const rows = await supabaseFetch<SupabasePageRow[]>("pages", {
      method: "DELETE",
      headers: { Prefer: "return=representation" },
      searchParams: {
        id: `eq.${id}`,
      },
    });
    return Array.isArray(rows) && rows.length > 0;
  },
};
