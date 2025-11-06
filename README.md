# Promptify – OpenAI default + Gemini fallback (Fixed Rich Output)

This version fixes the issue where only the **title** was generated.  
Changes:
- **OpenAI path** now uses **function calling** (tool schema) to force a **full LP** (hero + features + FAQ + checkout).
- **Gemini path** keeps structured output **and** we added a post-processor to ensure all sections exist.
- Added an `ensureComplete` step to fill any missing sections with reasonable Arabic defaults so preview never looks empty.

## Run
```bash
npm i
cp .env.example .env.local
# set OPENAI_API_KEY; (optional) GEMINI_API_KEY
npm run dev
```

### Persisting generated pages on Vercel

The development server stores landing pages on the local filesystem under `.data/`. When running on Vercel, file writes are
ephemeral, so configure [Vercel Blob storage](https://vercel.com/docs/storage/vercel-blob/quickstart) and expose a
`BLOB_READ_WRITE_TOKEN` (or the Vercel-provided alias `VERCEL_BLOB_READ_WRITE_TOKEN`) and optionally `BLOB_API_BASE_URL` /
`BLOB_PAGES_KEY` environment variable. The app automatically switches to Blob-backed persistence when the token is present,
ensuring `/api/pages/[id]` continues to resolve after
deployment.

## Tip
If a product URL is blocked by AliExpress shields, try the canonical URL again or different network. The `/api/resolve` endpoint helps debug what was extracted.
