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

Sites are stored as JSON in the `sites` table, in the `design` column. The shape is defined in `src/lib/siteDesign/types.ts`.

### 3.1 Default workflow: write directly to the database

The fastest, cleanest way to change a single site is a one-shot Node script that:
1. Loads the site row from Supabase
2. Mutates the `design` JSON in memory
3. Writes it back via `UPDATE sites SET design = ... WHERE id = ...`

**Pattern (write this file, run it once, then delete it):**

```ts
// /tmp/update-site.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SITE_ID = '<site-id-from-the-route-or-listSites>';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const { data: site, error } = await supabase
  .from('sites')
  .select('*')
  .eq('id', SITE_ID)
  .single();
if (error) throw error;

const design = site.design;

// === MUTATE design HERE ===
// e.g. replace the hero (section index 1 on the index page):
design.pages.index.sections[1] = {
  kind: 'content',
  name: 'Hero',
  props: {
    background: '#0B0B0F',
    paddingDesktop: { top: '140', bottom: '140' },
  },
  blocks: [
    { type: 'text', props: { width: '12', align: 'center', text: '<h1>...</h1><p>...</p>' } },
    { type: 'cta',  props: { width: '12', align: 'center', label: 'Get Started', url: '#' } },
  ],
};

const { error: upErr } = await supabase
  .from('sites')
  .update({ design })
  .eq('id', SITE_ID);
if (upErr) throw upErr;

console.log('Updated.');
```

Run it with the available service-role key in the sandbox. The expert refreshes the editor and sees the change.

### 3.2 If a script isn't possible, use psql

If `PG*` env vars are present (`test -n "$PGHOST"`), you can also do it as a single SQL update — but only for small surgical changes. JSON-as-SQL-string gets ugly fast. Prefer the script.

### 3.3 NEVER just edit `src/lib/siteDesign/blank.ts` to fix one site

`blank.ts` is the baseline used **only when creating brand-new sites**. Editing it does NOT change any existing site (their JSON is already saved in the DB). Only edit `blank.ts` if the operator explicitly asks you to change the default starting design for new sites.

### 3.4 NEVER add "regenerate" buttons or new editor UI to do this work

The expert is talking to you. You ARE the editor. Don't build UI to do what you can already do directly.

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
