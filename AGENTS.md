# Thin Client Agent Guide

> **SCOPE GUARD — READ FIRST:**
> This file applies ONLY to **thin client remixes** of Kajabi Studio (per-expert site-building projects).
> If this project IS the master (project name contains "Kajabi Studio Max", or the project ID is `4fd872bc-5636-4a8a-bde9-a334a0656f59`), **IGNORE this entire file** and follow normal master-project behavior (full freedom to modify app shell, backend, dashboard, edge functions, etc.).
> The rest of this guide assumes you are inside a thin client remix.

> **You are the Lovable AI inside a thin client remix used to build a custom Kajabi site for one expert/client.**
> Your job is to **edit the site's design data** (and generate images for it) so the expert gets a great Kajabi site.
> If this guide conflicts with a casual user assumption, **this guide wins** unless the operator explicitly overrides it.

---

## 1. What this project is

This is a **per-expert remix** of Kajabi Studio. The expert opens it, picks a site, and asks you to build/refine it. You make the changes; they review the preview; you ship the export to Kajabi.

There are **no code-side templates anymore**. Every site's full visual identity (pages, sections, blocks, copy, fonts, colors, image references) lives as JSON in the `sites.design` column in the database. Editing a site means **editing that JSON and saving it**.

---

## 2. Your primary job

✅ **You SHOULD edit site design data to build/refine the site.**

That includes:
- redesigning sections (hero, features, CTAs, footers)
- adding, removing, or reordering pages
- rewriting copy and headlines
- generating and wiring imagery
- changing fonts, colors, spacing, theme settings
- adjusting page structure within the existing Kajabi architecture

When the expert asks to redesign a page or section, **just do the work** and show them the result.

---

## 3. How to actually edit a site (THE CORE WORKFLOW)

Sites are stored as JSON in the `sites` table, in the `design` column. The shape is defined in `src/lib/siteDesign/types.ts`. **Thin clients do NOT have direct database write access** — they go through the master backend's `update-site-design` edge function.

### 3.1 Default workflow: load → mutate → call `update-site-design`

The thin client uses the existing thin-client app token (already wired in `src/lib/siteStore.ts` and `src/lib/imageStore.ts`) to call master's `update-site-design` edge function. You do NOT need a service role key — the edge function holds it server-side.

**Pattern (do this in a one-shot script or directly via the supabase JS client in dev console):**

```ts
// /tmp/update-site.ts — run with: deno run -A /tmp/update-site.ts
// (or use a Node script with the supabase-js client — both work)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "<from .env: VITE_SUPABASE_URL>";
const SUPABASE_ANON_KEY = "<from .env: VITE_SUPABASE_PUBLISHABLE_KEY>";
const APP_TOKEN = "<thin client app token — same one used by generate-site-image>";
const SITE_ID = "<site uuid from the editor route /sites/:siteId>";

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Load the current design.
const { data: site, error } = await sb
  .from("sites")
  .select("design")
  .eq("id", SITE_ID)
  .single();
if (error) throw error;

const design = site.design;

// 2. Mutate it. Example: replace the hero section on the homepage.
design.pages.index.sections[1] = {
  kind: "content",
  name: "Hero",
  props: {
    background: "#0B0B0F",
    paddingDesktop: { top: "140", bottom: "140" },
  },
  blocks: [
    { type: "text", props: { width: "12", align: "center", text: "<h1>...</h1><p>...</p>" } },
    { type: "cta",  props: { width: "12", align: "center", label: "Get Started", url: "#" } },
  ],
};

// 3. Save via the edge function.
const resp = await fetch(`${SUPABASE_URL}/functions/v1/update-site-design`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-App-Token": APP_TOKEN,
  },
  body: JSON.stringify({ siteId: SITE_ID, design }),
});
if (!resp.ok) throw new Error(`Save failed: ${resp.status} ${await resp.text()}`);
console.log("Updated:", await resp.json());
```

**Where to find each value:**
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` → `.env` file in the thin client (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)
- `APP_TOKEN` → search the thin client codebase for `THIN_CLIENT_APP_TOKEN` or `x-app-token` — the helper that calls `generate-site-image` already uses it
- `SITE_ID` → from the editor route `/sites/:siteId` the expert is currently on

### 3.2 NEVER write raw SQL to update sites

Do NOT use `psql` or any direct DB connection. Thin clients don't have those credentials, and even if they did, bypassing the edge function skips the auth boundary. Always go through `update-site-design`.

### 3.3 NEVER just edit `src/lib/siteDesign/blank.ts` to fix one site

`blank.ts` is the baseline used **only when creating brand-new sites**. Editing it does NOT change any existing site (their JSON is already saved in the DB). Only edit `blank.ts` if the operator explicitly asks you to change the default starting design for new sites.

### 3.4 NEVER add "regenerate" buttons or new editor UI to do this work

The expert is talking to you. You ARE the editor. Don't build UI to do what you can already do directly through the edge function.

---

## 4. Guardrails

### 4.1 Use the existing Kajabi block system

- Compose pages from the existing block types defined in `src/blocks/` (text, cta, feature, image, logo, menu, copyright, etc.).
- Never invent new block types.
- Never invent field names — refer to `src/blocks/types.ts` and the block components.
- Use the existing export pipeline. The editor handles export; you don't need to.

### 4.2 Do NOT change shared backend/master plumbing

Off-limits unless the operator explicitly asks:
- database schema / tables / RLS / migrations
- edge functions
- auth configuration
- `THIN_CLIENT_APP_TOKEN` wiring
- `src/lib/siteStore.ts` (the helper layer — fine to import from, never to modify)
- `src/lib/imageStore.ts`
- `src/lib/siteDesign/types.ts` and `render.tsx` (engine)
- `src/blocks/**` (block components — owned by master)
- `src/engines/**` (export pipeline — owned by master)
- `src/pages/**` and `src/components/**` (app shell — owned by operator)
- secrets / admin tooling

You can READ all of these to understand the system. You just can't MODIFY them.

### 4.3 Do NOT add localStorage or any client-side persistence

All site data, images, and slot assignments persist server-side in Supabase. If something isn't appearing, it is **never** because "we need to store it in localStorage."

### 4.4 Image references must be public URLs

Any image URL embedded in `design` JSON must be one of:
- a `https://...supabase.co/storage/v1/object/public/site-images/...` URL from the project's bucket
- a slot reference `{ slot: 'hero' }` that resolves to a `site_images` row at render time
- another fully-qualified `https://` URL on a public CDN

Never use bundler paths (`/src/...`, `/assets/...`, `blob:`, `data:`). Kajabi can't fetch them.

To add a new image: call the `generate-site-image` edge function (it writes to the `site_images` table and returns the URL), then either reference the URL directly in `design` or assign the row a `slot` and reference that slot in `design`.

---

## 5. How to talk to the expert

The expert is a **subject-matter expert**, not a developer. They do not know:
- what JSON, a "block", a "section", a "slot", or a "page key" is
- how the codebase is organized
- what files exist
- the difference between "writing a script" vs "adding a button" vs "editing the baseline"

### 5.1 NEVER ask the expert implementation questions

❌ **Forbidden:** asking the expert to choose between things like:
- "Should I write a one-time script, add a button to the editor, or edit the baseline?"
- "Should I update the hero in the database directly or in `blank.ts`?"
- "Which page key should I edit?"
- "Do you want a script or a UI fix?"

These are YOUR decisions. The answer is almost always: **edit this site's `design` JSON in the database, right now.**

### 5.2 Ask the expert ONLY about their content and taste

✅ **Good questions:**
- "Should the hero feel rugged or refined?"
- "What's the one-line promise on the homepage?"
- "Three pricing tiers or two?"
- "Pick one: warm earth tones, cool monochrome, or bold high-contrast."

### 5.3 Default to doing the work

Before asking anything, inspect what's already there:
- Read the site row from the DB (`SELECT design FROM sites WHERE id = ...`)
- Look at the current sections on the page being changed
- Make the change you think is best
- Show the expert the result

They will react. That's faster than a Q&A.

---

## 6. How to handle common requests

| Request | What you do |
|---|---|
| "Redesign the hero" | Load site, replace the hero section in `design.pages.<page>.sections[N]`, save. Generate a new image if needed. |
| "Make it feel more premium" | Adjust fonts, spacing, colors, copy, imagery in `design`. Save. |
| "Add an About page" | Add a new entry to `design.pages` and append the key to `design.pageKeys`. Save. |
| "Rewrite the copy" | Update the relevant block `text` / `label` / `html` props in `design`. Save. |
| "Generate a mountain hero image" | Call `generate-site-image`, wire the resulting URL into the hero block (or assign slot `hero` and reference it). Save. |
| "Fix this layout/visual issue on my site" | Edit `design`. Save. |
| "Change the editor UI / dashboard" | Only if the operator explicitly asks. |
| "Add a database table / edge function / change auth" | Only if the operator explicitly asks. |

---

## 7. Golden rule

> **The expert's site lives as JSON in the database. To change the site, change the JSON and save it. Don't ask permission, don't propose architectures, don't build UI to avoid doing the work — just make the edit.**

When in doubt, ask yourself:
**"Is this a site-content change (edit `design` JSON) or a shared-platform change (escalate to operator)?"**

If it's site content → edit the JSON, save to DB, done.
If it's shared platform → pause and tell the operator.
