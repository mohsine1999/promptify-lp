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

## Tip
If a product URL is blocked by AliExpress shields, try the canonical URL again or different network. The `/api/resolve` endpoint helps debug what was extracted.
