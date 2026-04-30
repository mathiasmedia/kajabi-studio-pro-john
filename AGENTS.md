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

Sites are stored as JSON in the `sites` table, in the `design` column. The shape is defined in `src/lib/siteDesign/types.ts`. **Thin clients do NOT have direct database access** (no service-role key, no `psql`, and `select`/`update` against `sites` is RLS-blocked without a user JWT).

Master exposes two edge functions for thin clients:

- **`get-site-design`** — read the current `{ id, name, brandName, design, updatedAt }` for a site.
- **`update-site-design`** — write a new `design` JSON for a site.

Both accept the thin-client app token via the `X-App-Token` header (same token already used by `generate-site-image`). You do NOT need a service role key — the edge functions hold it server-side.

### 3.1 Default workflow: GET → mutate → POST

**ALWAYS load the existing design first** with `get-site-design`. Never POST a new `design` object you built from scratch — that wipes every other page on the site. Always mutate what's already there and send the full updated object back.

**Pattern (one-shot Deno or Node script):**

```ts
// /tmp/edit-site.ts — run with: deno run -A /tmp/edit-site.ts
const SUPABASE_URL = "<from .env: VITE_SUPABASE_URL>";
const APP_TOKEN = "<thin client app token — same one used by generate-site-image>";
const SITE_ID = "<site uuid from the editor route /sites/:siteId>";

const headers = {
  "Content-Type": "application/json",
  "X-App-Token": APP_TOKEN,
};

// 1. LOAD the current design via get-site-design.
const getResp = await fetch(`${SUPABASE_URL}/functions/v1/get-site-design`, {
  method: "POST",
  headers,
  body: JSON.stringify({ siteId: SITE_ID }),
});
if (!getResp.ok) throw new Error(`Load failed: ${getResp.status} ${await getResp.text()}`);
const { design } = await getResp.json();
if (!design) throw new Error("Site has no design yet");

// 2. MUTATE it in place. Example: replace the hero section on the homepage.
//    Touch ONLY the parts you're changing — keep every other page/section intact.
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

// 3. SAVE the full design via update-site-design.
const putResp = await fetch(`${SUPABASE_URL}/functions/v1/update-site-design`, {
  method: "POST",
  headers,
  body: JSON.stringify({ siteId: SITE_ID, design }),
});
if (!putResp.ok) throw new Error(`Save failed: ${putResp.status} ${await putResp.text()}`);
console.log("Updated:", await putResp.json());
```

**Where to find each value:**

- `SUPABASE_URL` → `.env` file in the thin client (`VITE_SUPABASE_URL`)
- `APP_TOKEN` → search the thin client codebase for `THIN_CLIENT_APP_TOKEN` or `x-app-token` — the helper that calls `generate-site-image` already uses it
- `SITE_ID` → from the editor route `/sites/:siteId` the expert is currently on

### 3.2 NEVER write raw SQL or use the anon key to read sites

Do NOT use `psql`, the anon key, or any direct DB connection — `sites` is RLS-protected and reads require a user JWT the sandbox doesn't have. Always go through `get-site-design` / `update-site-design`.

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

### 4.4 NEVER use sticky / fixed / overlay headers unless explicitly asked

Default headers are **static** — they scroll off the page with the rest of the content. Do NOT set `sticky: true` or `position: 'overlay'` on `HeaderSection` props unless the expert **explicitly** asks for "sticky header", "fixed header", "header that stays at the top", or "header overlaid on the hero". This applies to new sites, redesigns, and any "make it more premium" pass. Sticky headers are a deliberate choice the expert must opt into — never assume.

### 4.5 NEVER add titles to footer `link_list` blocks unless explicitly asked

Footer link lists (e.g. "Explore", "Programs", "Resources", "Legal") should render as **untitled column groups** by default. Do NOT set `title` (and leave `show_title: false` / omit the title prop) on `link_list` blocks placed in the footer unless the expert **explicitly** asks for column headings like "Add a 'Resources' header above this list". Most modern footers look cleaner without column titles — the link labels themselves are enough. This applies to new sites, redesigns, and any footer pass.

### 4.6 NEVER overlay an opaque color on a section with a background image

When a section has `bgType: 'image'` (or any `backgroundImage` set), its `background` color prop MUST be either **empty** (`""`) or a **semi-transparent** `rgba(...)` value with alpha `< 1`. An opaque hex like `#FBF8F2` or `#000000` completely covers the image — Kajabi renders the color on top, the image is technically loaded but invisible, and the expert reports "my hero image isn't showing."

Defaults for image sections:

- **Want the raw image to show:** `background: ""` (empty string).
- **Want a tint/darken/lighten over the image:** `background: "rgba(0,0,0,0.45)"` (or any alpha `< 1`).
- **Never:** opaque hex (`#xxxxxx`), `rgb(...)`, or `rgba(...)` with alpha `1`.

This applies to every section type, including hero, CTA, and full-bleed image bands. When generating a hero image and wiring it onto a section, default to `background: ""` unless the expert explicitly asks for a tint.

### 4.7 CTA buttons across a site MUST look consistent and on-brand

Every CTA block on a single site should feel like it came from the same brand system. The bug to avoid is **two CTAs on the same site looking like they belong to different brands** — e.g. one navy pill outline, one cream square solid, picked at random by the AI.

**The rule is consistency, not abstinence.** You SHOULD set per-block button styling — `buttonBackgroundColor`, `buttonTextColor`, `buttonStyle`, `buttonBorderRadius`, `buttonSize` — but you must:

1. **Decide the brand button look ONCE per site**, then apply it identically to every primary CTA. Pull the colors from the site's palette (often visible in `design.themeSettings`: `color_button`, `color_button_text`, `color_primary`, `color_accent`). If the site has no `themeSettings`, infer from the section/page palette or ask the expert to pick.
2. **When editing a single CTA, audit every other CTA on the site first** (`get-site-design` → walk all pages → list every `cta` block's button props) and match them. If you change one, change them all to match.
3. **Reserve secondary/ghost variants** (outline, transparent bg) only for genuine secondary actions next to a primary CTA in the same section — never as a "let's mix it up" choice across pages.

Good defaults to copy when creating a new CTA on a branded site:

```ts
{
  type: "cta",
  props: {
    width: "12",
    align: "center",
    buttonText: "Get Started",
    buttonUrl: "#",
    buttonStyle: "solid",
    buttonBackgroundColor: "#1F2A44",   // brand primary, same on every CTA
    buttonTextColor: "#FBF8F2",          // brand on-primary, same on every CTA
    buttonBorderRadius: "999",           // same radius on every CTA (or "8" for soft, "0" for sharp)
  }
}
```

If you generated this CTA and the site already has 3 other CTAs with different colors/radii, **fix the inconsistency** — either update this one to match the existing style, or update all of them to a unified style. Don't ship a site with mismatched buttons.

### 4.8 Section + block background images go directly into the JSON

When you put an image URL on a section (`backgroundImage`) or block (`src`), the export pipeline writes it **straight into `bg_image` / `image`** in `settings_data.json` — Kajabi's `image_picker_url` Liquid filter passes external `https://` URLs through unchanged. There is **no longer** any CSS-injection workaround that pins backgrounds onto sections by id; if you see code or comments referencing `__externalBg`, `assets/inject.css`, or `buildExternalBgCssBlock` in a thin client, it's stale and a `sync from master` is overdue.

Symptom that you have a stale engine: hero/section background images appear in the **rendered preview** but Kajabi shows the section as a black box, or the exported zip's `settings_data.json` has empty `bg_image` fields with the image URL only present in injected CSS. Fix: ask the operator to run `sync from master`.

### 4.9 Image references must be public URLs

Any image URL embedded in `design` JSON must be one of:

- a `https://...supabase.co/storage/v1/object/public/site-images/...` URL from the project's bucket
- a slot reference `{ slot: 'hero' }` **— but ONLY if a `site_images` row with that exact slot exists for this site**
- another fully-qualified `https://` URL on a public CDN

Never use bundler paths (`/src/...`, `/assets/...`, `blob:`, `data:`). Kajabi can't fetch them.

**CRITICAL — slot refs without an image = black section.** A `{ slot: 'x' }` ref that doesn't match a `site_images` row resolves to nothing, the section's `bgType: 'image'` is then demoted, and the section renders as its fallback color (usually black). Symptoms: "my hero is just a black box." To avoid this:

1. **Default to direct URLs.** When you generate an image via `generate-site-image`, it returns `{ url, imageId }`. Put that `url` directly on the block/section prop (`backgroundImage: "https://..."`, `src: "https://..."`). Done — no slot bookkeeping needed.
2. **Only use `{ slot }` refs** if the site already has a `site_images` row with that slot (check by reading the site first, or by asking `generate-site-image` with an explicit `slot` parameter that it writes to the row). If you set `{ slot: 'hero' }` in `design`, you MUST have also assigned a row to slot `'hero'` in the same change.
3. **Never invent a slot name** and hope it resolves. If you're not sure the slot exists, use the direct URL.

To add a new image: call the `generate-site-image` edge function (it writes to `site_images` and returns `{ url, imageId }`), then reference that `url` directly in `design`. The render pipeline + exporter both have a safety net that demotes broken `bgType: 'image'` to the fallback color, but they also emit a console warning — if you see `[siteDesign] slot "..." has no matching site_images row`, you shipped a broken reference and must fix it.

### 4.10 NEVER hardcode dynamic Kajabi content (blog, blog post, library/products)

🚨 **This is the #1 cause of "the live site doesn't match the preview".** Some Kajabi pages render content from the expert's Kajabi data (their real blog posts, their real products) at runtime. If you hardcode mock posts/products into `design`, the export ships those mocks to Kajabi and the expert's real content is hidden.

**The pages that are dynamic — NEVER fill them with hardcoded content blocks:**

| Page key    | What Kajabi renders dynamically                | What you MUST use                         |
| ----------- | ---------------------------------------------- | ----------------------------------------- |
| `blog`      | The expert's real blog post list               | `{ kind: "raw", type: "blog_listings" }`  |
| `blog_post` | The body of whichever post the visitor clicked | `{ kind: "raw", type: "blog_post_body" }` |
| `library`   | The expert's real products / member library    | `{ kind: "raw", type: "products" }`       |

**Forbidden on these pages:** hardcoded `card` blocks for posts/products, hardcoded post bodies, hardcoded lesson content, hardcoded product grids, hardcoded "course progress" or "continue learning" lists, hardcoded "related posts" cards. None of it. The Kajabi raw section renders all of that from the expert's real data.

**Allowed on these pages:** header (shared), an optional branded intro `content` section above the raw section (eyebrow + headline + subhead — copy only, no fake post/product cards), an optional branded outro `content` section below it (e.g. CTA), and footer (shared). That's it.

**Correct shape — `blog`:**

```jsonc
{
  "sections": [
    { "kind": "header", ... },
    { "kind": "content", "name": "Journal hero", "blocks": [/* eyebrow + h1 + lede only */] },
    {
      "kind": "raw",
      "type": "blog_listings",
      "name": "Blog posts (dynamic)",
      "settings": {
        "background_color": "#FBF8F2",
        "text_color": "#1F2A44",
        "btn_background_color": "#1F2A44",   // brand
        "btn_text_color": "#FBF8F2",          // brand
        "btn_border_radius": "999",
        "btn_style": "solid"
      }
    },
    { "kind": "footer", ... }
  ]
}
```

**Correct shape — `blog_post`:**

```jsonc
{
  "sections": [
    { "kind": "header", ... },
    { "kind": "raw", "type": "blog_post_body", "name": "Blog post body (dynamic)", "settings": { ...brand colors... } },
    { "kind": "footer", ... }
  ]
}
```

**Correct shape — `library`:**

```jsonc
{
  "sections": [
    { "kind": "header", ... },
    { "kind": "content", "name": "Library hero", "blocks": [/* "Welcome back" header copy only */] },
    {
      "kind": "raw",
      "type": "products",
      "name": "Products (dynamic)",
      "settings": { "layout": "12", ...brand colors... }
    },
    { "kind": "footer", ... }
  ]
}
```

**Always pass branded `settings` on the raw section** so Kajabi's dynamic content matches the rest of the site — at minimum `background_color`, `text_color`, `btn_background_color`, `btn_text_color`, `btn_border_radius`, `btn_style`. Pull the values from the site's existing palette (audit other CTA blocks to match — see §4.7).

**Other Kajabi-dynamic pages — same rule, header/footer only (NO content sections at all):** `login`, `forgot_password`, `reset_password`, `register`, `thank_you`, `404`, `newsletter*`, `member_directory`, `announcements`, `blog_search`. Don't hardcode "recent posts", fake login screens, fake signup forms, "forgot password" forms, fake product grids, or any branded intro on these pages — Kajabi renders the form/content itself.

**🛑 AUTH PAGES — `login`, `register`, `forgot_password`, `reset_password` — ARE OFF-LIMITS.** These four pages are **non-composable** in Kajabi:

- `login.liquid` uses a built-in `{% section "login" %}` Kajabi section that's not editable through `settings_data.json`.
- `forgot_password.liquid` and `forgot_password_edit.liquid` (the "reset password" page) hardcode `{% include "block_password_reset" %}` / `{% include "block_password_edit" %}` — Kajabi renders the form itself.
- `register` doesn't exist as a template in the base theme at all — Kajabi handles signup on its own URL.

If you compose ANYTHING into `design.pages.login` / `register` / `forgot_password` / `reset_password` beyond header + footer, one of two things happens: (a) Kajabi ignores it and the expert sees the same default form, OR (b) your fake form/headline renders on top of Kajabi's real form, breaking the page. Either way the expert reports "the auth pages look broken."

**Correct shape — every auth page (`login`, `register`, `forgot_password`, `reset_password`):**

```jsonc
{
  "sections": [
    { "kind": "header", ... },
    { "kind": "footer", ... }
  ]
}
```

No "Welcome back" headline. No fake email input. No "Create your account" intro. No CTAs. Header + footer only. Brand the form indirectly via `themeSettings` (button colors, fonts) — that's how the form picks up the site's brand without you touching the page.

**Pre-flight check before saving any page named `blog`, `blog_post`, or `library`:** scan the page's `sections` array for any `card` block, any `feature` block carrying mock post/product data, or any `text` block whose HTML contains hardcoded post/lesson/product titles. If you find any, replace them with the correct `{ kind: "raw", type: "..." }` section before calling `update-site-design`. Never ship a site where the expert has to discover this themselves.

**Pre-flight check before saving any page named `login`, `register`, `forgot_password`, or `reset_password`:** the `sections` array MUST have length 2 (header + footer). If anything else is there, strip it before calling `update-site-design`.

### 4.11 NEVER put content on the `page` template — leave it empty (header + footer only)

The `page` template in Kajabi is a **per-product wrapper** — it's reused for every individual course/sales/landing page the expert publishes from inside Kajabi. Anything you compose into `design.pages.page` (a hero, a curriculum block, a testimonials section) gets injected into **every one of those product pages**, on top of whatever Kajabi is rendering for that specific product. The expert sees: "my course page has a different course's content showing above the real content."

**The rule:** `design.pages.page` MUST contain header + footer only. No content sections. No hero. No curriculum, testimonials, or CTAs. Kajabi handles the body of each product page entirely on its own.

**Correct shape — `page`:**

```jsonc
{
  "sections": [
    { "kind": "header", ... },
    { "kind": "footer", ... }
  ]
}
```

If the expert says "design the course page" or "build out the page template", they almost always mean a **specific page** (homepage, about, programs, a custom landing page) — confirm which one and edit that page key instead. Never interpret it as "fill in `design.pages.page`".

**Pre-flight check before saving:** if the page key being edited is `page`, the `sections` array must have length 2 (header + footer). If you've added anything else, remove it before calling `update-site-design`.

### 4.12 NEVER set `fullWidth: true` on a section unless explicitly asked

Kajabi's "Make section full width" toggle (`fullWidth: true` in our props → `full_width: 'true'` in `settings_data.json`) breaks the section's inner content out of the standard 1170px container so it spans the entire viewport edge-to-edge. This is **almost always wrong** for content sections (hero, features, CTAs, testimonials, copy blocks): on wide monitors the headline and paragraph stretch hundreds of characters wide and become unreadable; the layout looks unprofessional and amateur.

**The default is constrained.** Every `ContentSection` in a template MUST omit `fullWidth` (or set it to `false`) unless the expert **explicitly** asks for "full width", "edge to edge", "no margins", "full bleed", or describes a layout that obviously requires it (e.g. "an image gallery that touches both screen edges"). Phrases like "make it bigger", "make the hero feel premium", "more impactful", "more spacious" do **not** mean full width — they usually mean larger padding, bigger type, or a stronger background — never a content breakout.

This applies to:

- New templates being built from a prompt.
- Redesigns of existing sections.
- Any "make it more premium / more impactful / cleaner" pass.
- Sections with background images (the image already covers the viewport via `bg_image` + `background-size: cover`; `fullWidth` only affects the inner content column, not the image).

**Common confusion:** authors often think `fullWidth` controls whether the **background image** covers the full viewport. It does not. Background images already cover the full section width by default (per §4.8). `fullWidth` controls whether the **text/blocks inside** the section break out of the 1170px container — and stretching headlines + paragraphs to 2000px+ wide is what makes the page look broken.

**Pre-flight check before saving any template or page:** scan every `content` section's props. If `fullWidth: true` is set and the expert never asked for it, remove it. The Mastermind landing page hero is a real example of this bug — the hero text was set to full width and the headline spans the entire screen, making the layout feel unbalanced and unfinished.

### 4.13 NEVER include `©` or a year in footer copyright text

Kajabi's footer copyright snippet **automatically prepends `© <current year>`** to whatever string you put in the `copyright` block's text field. So if you write `"© 2026 Acme Coaching · All rights reserved"`, Kajabi renders `© 2026 © 2026 Acme Coaching · All rights reserved` — duplicate symbol, duplicate year, looks broken.

**The rule:** the `copyright` block's text MUST start directly with the brand/owner name or message, with no leading `©`, no leading year, no leading `Copyright`. Kajabi adds the prefix.

✅ **Correct:**

```ts
{ type: "copyright", props: { text: "Acme Coaching · All rights reserved" } }
{ type: "copyright", props: { text: "Jane Doe Studio" } }
{ type: "copyright", props: { text: "Built with care in Berlin" } }
```

❌ **Wrong:**

```ts
{ type: "copyright", props: { text: "© 2026 Acme Coaching" } }              // duplicate © and year
{ type: "copyright", props: { text: "© Acme Coaching" } }                    // duplicate ©
{ type: "copyright", props: { text: "Copyright 2026 Acme Coaching" } }       // "Copyright" + year duplicates the prefix
{ type: "copyright", props: { text: "2026 · Acme Coaching" } }               // duplicate year
```

**Pre-flight check before saving any page (especially footers):** for every `copyright` block, strip any leading `©`, `Copyright`, or 4-digit year from the text. The result should read naturally **after** Kajabi prepends `© 2026 ` to it.

### 4.14 When the expert attaches a real image in chat — upload it via `upload-site-image`

🚨 **This is a common silent failure.** When the expert drops a real photo into chat (their headshot, a logo, a product shot, a venue photo) and asks "use this in the hero" / "make this the about photo" / "replace the founder image with this", you receive it as a virtual `user-uploads://image-XX.png` path. **That path is NOT a public URL.** You cannot put it in `design` JSON, you cannot pass it to Kajabi, and the existing `generate-site-image` edge function only creates NEW images from a text prompt — it does not accept binaries.

If you skip the upload step and just write the hero JSON without a real `https://` URL, one of two things happens:

- You drop the image entirely → hero renders with no `backgroundImage` → expert sees a flat color where their photo should be.
- You write `{ slot: "x" }` pointing to a row that doesn't exist → renderer demotes to fallback color (§4.9) → expert sees a black/teal box.

Either way the expert reports: "the image I sent didn't show up."

**The correct flow — every time the expert attaches an image:**

1. **Read the bytes.** Copy the upload to a real path so you can read it from a script:
   ```bash
   code--copy user-uploads://image-89.png /tmp/upload.png
   ```
2. **Base64-encode and POST to `upload-site-image`** with the thin-client app token. Example one-shot Deno script:

   ```ts
   // /tmp/upload.ts — run with: deno run -A /tmp/upload.ts
   const SUPABASE_URL = "<from .env: VITE_SUPABASE_URL>";
   const APP_TOKEN = "<thin client app token — same one used for generate-site-image>";
   const SITE_ID = "<site uuid from /sites/:siteId>";

   const bytes = await Deno.readFile("/tmp/upload.png");
   // Chunked base64 encode (avoids stack overflow on large files)
   let bin = "";
   const CHUNK = 8192;
   for (let i = 0; i < bytes.length; i += CHUNK) {
     bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
   }
   const imageBase64 = btoa(bin);

   const resp = await fetch(`${SUPABASE_URL}/functions/v1/upload-site-image`, {
     method: "POST",
     headers: { "Content-Type": "application/json", "X-App-Token": APP_TOKEN },
     body: JSON.stringify({
       siteId: SITE_ID,
       imageBase64,
       mimeType: "image/png",   // or image/jpeg, image/webp, image/gif
       filename: "ashley-headshot.png",   // optional, for nicer object key
       alt: "Ashley Kumar, DPT",          // optional
     }),
   });
   if (!resp.ok) throw new Error(`Upload failed: ${resp.status} ${await resp.text()}`);
   const { url } = await resp.json();
   console.log("Public URL:", url);
   ```

3. **Wire the returned `url` directly into `design`** as a regular `https://` string on the relevant block/section prop (`backgroundImage`, `src`, `logoSrc`, etc.). Do NOT use `{ slot }` refs — there's no row to back them in thin-client mode (per §4.9 default to direct URLs).
4. **GET → mutate → POST the `design` via `update-site-design`** as usual (§3.1). Keep every other page intact.
5. **Tell the expert it's wired** and ask them to refresh the preview.

**Limits and constraints:**

- Max 10 MB decoded. If larger, ask the expert to compress/resize before re-uploading.
- Allowed mime types: `image/png`, `image/jpeg`, `image/webp`, `image/gif`. Reject anything else (HEIC, SVG, PDF) and ask the expert to convert.
- The base64 string can include or omit the `data:image/png;base64,` prefix — the function handles both. Always pass `mimeType` explicitly when the prefix is omitted.
- The returned URL is a permanent public URL on the `site-images` bucket. Safe to store in `design` forever.

**When the expert attaches multiple images in one message:** upload them in parallel, then wire each one to its target slot. Confirm with the expert which image goes where if it isn't obvious from the message.

**Never:**

- Put `user-uploads://...`, `blob:`, `data:`, or `/src/...` paths in `design` JSON.
- Skip the upload and ask the expert to "host the image somewhere and paste a URL" — you have the upload function, use it.
- Use `generate-site-image` to "regenerate something similar" when the expert sent a real photo. The expert wants THEIR exact photo, not an AI guess.

### 4.15 PREFER native block button props over inline `<a>` baked into HTML

When a card-style block (`feature`, `pricing_card`, etc.) needs an "Explore →", "Learn more", "Read story", or any other call-to-action link, **use the block's native button props — never bake an `<a>` tag into the HTML `text` field**. Same lift-recurring-styles-into-the-template rule from `PRO_CAPABILITIES.md` §9.8e (PRO STYLING), applied at the block level.

**Why it matters:**

- Inline `<a class="button">` (or any styled inline link) bypasses Kajabi's global button system. The expert can't restyle it from the Style Guide, can't toggle uppercase, can't swap the dark/light pair, can't adjust padding/letter-spacing globally.
- Inline buttons are invisible to §4.7's "audit every CTA before changing one" pass — they don't show up as `cta` blocks or as native `feature` buttons in the design tree, so they silently drift out of brand consistency.
- For card grids, inline `<a>` "explore" links break Pro's per-block button overrides — no `btn_*` fields exist for the link, it's just HTML.

**The rule — every block type that exposes button props uses them:**

| Block          | Native button fields                                                                                                                                                                       | Set when you need a CTA                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `feature`      | `showButton`, `buttonText`, `buttonUrl`, `buttonStyle` (`solid`/`outline`/`text`), `buttonTextColor`, `buttonBackgroundColor`, `buttonBorderRadius`, `buttonSize`, `buttonWidth`, `newTab` | YES — Kajabi delegates to `block_cta` internally; full Pro button system applies |
| `pricing_card` | same shape (per its own button props — check the block)                                                                                                                                    | YES                                                                              |
| `text`         | none — text blocks don't expose a button                                                                                                                                                   | Use a SIBLING `cta` block in the same section/column instead of inline `<a>`     |
| `image`        | `imageHref` covers click-the-image                                                                                                                                                         | Use a sibling `cta` block for any text CTA below the image                       |

**`buttonStyle: "text"` is the right choice for low-emphasis "Explore →" / "Read story" / "Learn more" links** that should look like a styled link, not a button. The `feature` block accepts it on Pro (`block_cta` renders the full text-link styling) and gracefully on Standard. Pair it with the site's accent color via `buttonTextColor` (e.g. gold `#A88251`) — and per §4.7, audit other "text" CTAs on the site to keep them all matching.

**Canonical pattern — service card with "Explore →" link:**

```jsonc
// ❌ Wrong — inline <a> baked into HTML, invisible to brand controls
{
  "type": "feature",
  "props": {
    "text": "<h3>Custom Kajabi Website Design</h3><p>...</p><p><a href=\"/services\" style=\"color:#A88251;text-decoration:none;border-bottom:1px solid #C9A96A;text-transform:uppercase;letter-spacing:0.16em;font-size:13px\">Explore →</a></p>"
  }
}

// ✅ Right — native button props, full Pro styling applies
{
  "type": "feature",
  "props": {
    "text": "<h3>Custom Kajabi Website Design</h3><p>A boutique, conversion-focused Kajabi site...</p>",
    "showButton": true,
    "buttonText": "Explore →",
    "buttonUrl": "/services",
    "buttonStyle": "text",
    "buttonTextColor": "#A88251",
    "buttonSize": "small"
  }
}
```

**When you MUST keep the link inline:** two genuine cases — (a) the link is a single word inside a sentence (e.g. "...read about our [process](/process)..."), or (b) multiple links in the same paragraph. Anything that visually reads as a standalone CTA at the bottom of a card belongs in the native button props.

**Pre-flight check on every site/section edit:** scan every `feature` / `pricing_card` block's `text` HTML for trailing `<p>...<a>...</a></p>` patterns or `<a class="button"...>` / `<a style="...border:1px..."...>` — these are inline buttons hiding in HTML. Lift each one into `showButton: true` + the relevant `button*` props, and strip the `<a>` from the HTML. Same for "stacked content" columns (`PRO_CAPABILITIES.md` §9.4a): if the bottom block of a stacked column is a `text` block whose HTML is just a styled `<a>`, replace it with a sibling `cta` block.

**Composing matters too** — once buttons are native, §4.7's "every CTA on the site looks consistent" rule kicks in automatically: all `feature` buttons on the site should share `buttonStyle`, `buttonTextColor`, `buttonSize`. Don't mix `buttonStyle: "text"` on some cards and `buttonStyle: "solid"` on others unless the visual hierarchy genuinely calls for it.

---

### 4.16 TEXT BUTTONS (`buttonStyle: "text"`) — color comes from the dark/light pair, NOT from `buttonTextColor`

🚨 **Verified gotcha — `block_cta.liquid` text-button branch is counterintuitive.** When `btn_style: "text"`, Pro takes the visible link color from the **dark/light button pair** (`btn_background_color` / `btn_text_color`) according to `btn_type`, NOT from a "text color" field. This is confusing because the field NAMED `btn_text_color` is the LIGHT half of the pair (per `PRO_CAPABILITIES.md` §9.8a), not "the text color of this button".

**The Liquid logic (verified in `snippets/block_cta.liquid` lines 181–211):**

```liquid
{% if btn_style == 'text' and btn_type == 'dark' %}
  /* color = btn_background_color  ← the DARK pair member */
{% endif %}
{% if btn_style == 'text' and btn_type == 'light' %}
  /* color = btn_text_color  ← the LIGHT pair member */
{% endif %}
```

**The rule (mnemonic):** for text buttons, **the color matches `btn_type`** —

- `btn_type: "dark"` (default) → text color = `buttonBackgroundColor` (the dark slot).
- `btn_type: "light"` → text color = `buttonTextColor` (the light slot).

`btn_type` defaults to `"dark"` per `PRO_CAPABILITIES.md` §9.8a, so **on a default text button the visible color comes from `buttonBackgroundColor`, NOT `buttonTextColor`**. Setting `buttonTextColor: "#A88251"` on a `buttonStyle: "text"` block is a silent no-op — the link renders in the body's default text color instead of your accent.

**Symptom:** the expert sees a text CTA in body color (often dark grey/black) instead of the brand accent you intended, even though `buttonTextColor` is clearly set in the design JSON.

**The fix — for text buttons, always set the accent on the slot that matches `btn_type`:**

```jsonc
// ❌ Wrong — silently no-ops for default (dark) text buttons
{
  "type": "feature",
  "props": {
    "showButton": true,
    "buttonText": "Explore →",
    "buttonStyle": "text",
    "buttonTextColor": "#A88251"   // not used by Kajabi for text+dark
  }
}

// ✅ Right — accent goes on buttonBackgroundColor (the dark slot)
{
  "type": "feature",
  "props": {
    "showButton": true,
    "buttonText": "Explore →",
    "buttonStyle": "text",
    "buttonBackgroundColor": "#A88251"  // text+dark uses this as the link color
  }
}

// ✅ Also right — explicitly light text button with accent on the light slot
{
  "type": "feature",
  "props": {
    "showButton": true,
    "buttonText": "Explore →",
    "buttonStyle": "text",
    "buttonType": "light",            // if/when block exposes this prop
    "buttonTextColor": "#FBF8F2"      // text+light uses this as the link color
  }
}
```

**Solid + outline buttons are unaffected — they keep the intuitive mapping** (`buttonBackgroundColor` = bg, `buttonTextColor` = text). This quirk is _only_ on `buttonStyle: "text"`.

**Pre-flight check whenever you set `buttonStyle: "text"`:**

1. Decide whether the button is dark or light (default: dark).
2. Put the accent color on the slot matching that type — `buttonBackgroundColor` for dark, `buttonTextColor` for light.
3. Leave the OTHER slot empty (`""`), or — if you also want a working solid/outline variant for the same brand — fill both pair members consistently sitewide.
4. If you're auditing existing text buttons (per §4.15 lift pass), check both fields: a text button with `buttonTextColor` set but `buttonBackgroundColor` empty is silently broken on Pro — swap them.

**Why this exists:** Pro's button system is designed around picking ONE brand pair sitewide (per `PRO_CAPABILITIES.md` §9.8a) and letting each button choose which pair member to show. For text buttons specifically, "which color shows" follows `btn_type` directly because there's no background/border to occupy the other slot — the entire button IS just the colored text. So the slot whose name matches the type is the one you see.

---

### 4.17 `feature` block `imageWidth` defaults too small for service-card layouts

🚨 **Recurring "the images are still small" complaint.** The `feature` block's `imageWidth` prop defaults to a value (~`100`) that's appropriate for tiny inline icons (like a checkmark next to a feature bullet), NOT for the **service-card / offering-tile** layout where each card has a hero photo above the title + body. Set to `100` on a 3-up service grid, the photos render as ~100px-wide thumbnails floating in a sea of card padding — the expert reports "the images are tiny" repeatedly until the value is large enough.

**The rule — pick `imageWidth` based on what the image is doing in the card:**

| Image role in the `feature` block                                    | `imageWidth` value                                                |
| -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Tiny icon next to a feature bullet (16–32px target)                  | `"32"` – `"64"`                                                   |
| Inline icon above a short label                                      | `"80"` – `"120"`                                                  |
| **Service / offering / program card hero photo** (3-up or 4-up grid) | **`"320"` – `"480"`** (or omit entirely → image fills card width) |
| Full-width photo on a 2-up split feature                             | `"560"` or omit                                                   |

**Best default for service cards: omit `imageWidth` entirely.** When the prop is empty/absent, the image fills the card's content width naturally — which is almost always what you want for hero-style card photos. Only set an explicit `imageWidth` when you need to clamp the image SMALLER than the card (icon mode).

**Symptom mapping — when the expert says any of these, check `imageWidth` FIRST before assuming a deeper bug:**

- "the service card images are tiny / small / too small"
- "the images aren't filling the card"
- "the photos look like postage stamps"
- "make the images bigger" (after you've already adjusted the section padding/columns)

**Pre-flight check whenever you build a card grid using `feature` blocks with photos** (vs icons): for every `feature` block with `image` set and `imageWidth` set to anything `< 200`, either bump it to `"320"` or remove `imageWidth` entirely. Don't ship service grids with thumbnail-sized hero photos.

**Why this exists:** the `feature` block was originally designed as a "feature bullet" pattern (icon + text), and the default `imageWidth` reflects that. It's now overloaded as the canonical "card with photo" block too, but the default never moved. Until/unless we ship a separate `service_card` block or change the default, **the AI must override `imageWidth` for any photo-bearing card layout.**

---

### 4.18 Preview ↔ Kajabi shadow parity (verified 2026-04)

The engine's `SHADOW_MAP` in `packages/engine/src/blocks/blockChrome.ts` MUST emit Kajabi's exact `box-shadow-{small|medium|large}` class values from `streamlined-home(-pro)/assets/styles.scss.liquid` lines 3052–3070:

- `small`: `0 2px 10px 0 rgba(0, 0, 0, 0.05)`
- `medium`: `0 4px 20px 0 rgba(0, 0, 0, 0.075)`
- `large`: `0 10px 40px 0 rgba(0, 0, 0, 0.1)`

These are SINGLE soft shadows, not double-layered Material-style shadows. If you change them to "look better" you'll silently desync the editor preview from the live Kajabi render. Symptom: accordion/card edges look heavier, sharper, or more dramatic in the preview than in the exported site. Whenever the expert reports "the shadow doesn't quite match what shipped", check this file first.

If Kajabi ever updates these class values in a future base-theme version, re-extract from the current zip and update `SHADOW_MAP` in lockstep.

### 4.19 PricingCard auto-themes for dark surfaces (verified 2026-04)

`packages/engine/src/blocks/components/PricingCard.tsx` ships an `isDarkColor(hex|rgba)` helper that calculates luminance from the card's background and toggles:

- `ink` → light (`#F4ECDC`) on dark surfaces, dark (`#111`) on light
- `muted` → matching translucent

Without this branching, dark-surface tier cards (e.g. a brand-color middle tier in a 3-up pricing grid) render black bullets/checkmarks/body copy on a near-black background — invisible. Same with the button: the outline branch MUST set `backgroundColor: 'transparent'` + `border: '1.5px solid {buttonBackground}'`, NOT default to a solid fill.

`PricingCardProps` includes `buttonStyle: 'solid' | 'outline' | 'text'` and `buttonBorderRadius`. Always persist these on every `pricing_card` block in `design`, especially when authoring multi-tier grids where the highlighted tier inverts the palette. If the bullets/CTAs disappear on the highlighted tier, the regression is in the `isDarkColor` branch or the outline button renderer.

### 4.20 Slider `transitionEffect: "fade"` stacks all blocks regardless of `blocksPerSlide`

Swiper's `fade` effect crossfades between full-width slides — `blocksPerSlide` is effectively forced to 1 even if you set 3. Symptom: a testimonial slider with `blocksPerSlide: 3` + `transitionEffect: "fade"` shows ONE testimonial at a time, looking broken next to a sibling slider with the same `blocksPerSlide: 3` + `slide` effect that correctly renders 3-up.

**Rules:**

- Want a multi-up grid carousel → `transitionEffect: "slide"` (default) + `blocksPerSlide: 3` (or whatever).
- Want fullscreen testimonial crossfade → `transitionEffect: "fade"` + `blocksPerSlide: 1`.
- Never mix `fade` with `blocksPerSlide > 1` — the value is silently ignored and the section looks broken.

Also: Pro's `section.liquid` forgets to set `fadeEffect.crossFade: true`, so even valid fade sliders need the CSS workaround that `export.ts` auto-injects when any section uses `transition_effect: "fade"`. Don't disable that workaround.

### 4.21 Slider prop shorthand aliases — write the canonical name

The engine accepts both shorthand (`blocksPerSlide`, `autoplay`, `loop`, `transitionEffect`, `transitionSpeed`) and canonical (`slidesPerViewDesktop`, `sliderAutoplay`, `sliderLoop`, `sliderTransition`, `sliderSpeed`) names — both `renderSlider` (in `sections.tsx`) and the serializer normalize via nullish coalescing. **Prefer the canonical name** in new code so future devs reading the JSON aren't confused; the shorthands exist only because legacy site data uses them.

If you're adding a NEW slider prop, register both the alias and the canonical name in `sections.tsx → renderSlider` AND `serialize.ts` simultaneously — a missed alias silently falls back to a 1-per-slide, autoplay-off slider. See `mem://reference/slider-prop-shorthand-aliases.md`.

### 4.22 Pro templates — set EVERY font weight + size explicitly (never rely on defaults)

🚨 **Common parity bug: preview h1 looks heavier than Kajabi's h1**, even though family + size match. Cause: the template set ONE override (e.g. `custom_h2_font_weight: "500"`) and left h1/h3/etc. to fall back. The preview's `valWithDefault` resolves the catalog default (`font_weight_heading: "700"`), but Kajabi's actual default for the loaded font (especially serif/display fonts like Playfair Display, Lora, Cormorant) is often 500 or 600, NOT 700. So preview renders 700 and Kajabi renders 500 — same family, same size, different weight.

**The rule — every Pro template's `themeSettings` MUST explicitly set:**

**Standard fields (sitewide fallback for Kajabi system pages too):**

- `font_weight_heading`, `line_height_heading`
- `font_weight_body`, `line_height_body`

**Pro per-element overrides — for EVERY heading level the template renders on any page** (`use_custom_fonts: "true"` flow):

- `override_h<N>_font_styles: "true"` (visibility toggle)
- `select_custom_h<N>_font: "primary" | "accent" | "inherit"`
- `custom_h<N>_font_weight: "500"` (explicit number, NOT `"inherit"`)
- `custom_h<N>_line-height: "1.1"` (hyphen, not underscore)
- `custom_h<N>_font_size_desktop: "52px"`
- `custom_h<N>_font_size_mobile: "34px"`

**Body:**

- `override_body_fonts: "true"`
- `custom_body_font_weight: "400"`
- `custom_body_font_line-height: "1.6"`
- `custom_body_font_size_desktop: "17px"`
- `custom_body_font_size_mobile: "16px"`

**Buttons (when CTAs matter):**

- `view_advanced_button_customizations: "true"`
- `btn_font_weight: "500"`
- `custom_button_font_size_desktop: "14px"` + `custom_button_font_size_mobile: "13px"`

**Don't use `"inherit"` for typography the template designed.** `"inherit"` means "use the cascade" — and the cascade differs between preview (catalog defaults) and Kajabi (loaded font's actual defaults). Reserve `"inherit"` only for fields the template genuinely doesn't care about.

**Pre-flight checklist — every Pro template build (and every existing Pro template audit):**

1. Walk every page in the template; collect the set of heading levels actually rendered (h1, h2, h3, …).
2. For EACH level, confirm `override_h<N>_font_styles: "true"` + weight + line-height + desktop size + mobile size are all set explicitly.
3. Confirm Standard `font_weight_heading` + `font_weight_body` + line-heights are set.
4. Confirm body overrides are set (weight + lh + sizes).
5. Confirm button advanced overrides are set if any CTAs exist.
6. Refresh preview, compare to a Kajabi export side-by-side — every heading should match weight exactly.

**🚨 Common silent gap (verified 2026-04 on the Pro Functionality site):** the per-heading overrides (`custom_h1_font_weight`, etc.) can all be set correctly while the **Standard sitewide fallback fields** (`font_weight_heading`, `line_height_heading`, `font_weight_body`, `line_height_body`) are still `undefined`. Per-element overrides only target `h1/h2/h3...` rendered through composed sections; the Standard fields are what Kajabi system pages (login, store, checkout, blog) and the preview's Standard fallback path use. If they're undefined, those pages render with Kajabi's base-theme defaults (heading 700, body 400/1.6) which usually diverges from the brand. **The audit MUST check both layers** — per-element overrides AND Standard sitewide fields. Set the Standard fields to match the per-element values (e.g. heading 500/1.1, body 400/1.7) so system pages inherit the brand consistently.

See `mem://reference/template-explicit-font-weights.md` for full anti-pattern + worked example.

### 4.23 NEVER place white blocks on white sections — they vanish into the page

🚨 **Verified 2026-04 on the Pro Functionality landing page.** A `pricing_card` or `accordion` (or any chrome-bearing block) with `backgroundColor: "#FFFFFF"` placed inside a section whose `background` is also white renders on Kajabi as a **borderless rectangle that bleeds into the page** — the card's only edge is the small `box-shadow` (per §4.18, single soft shadow at 5–10% alpha), which is too subtle to define a boundary on a pure-white surround. The expert sees: "the cards have no edges", "everything looks like one flat white blob", "the accordions don't look like cards anymore." Outer pricing tiers in a 3-up grid are the most common offender (the dark middle "highlight" tier is fine — it has its own contrast).

**The rule — never ship a white-bg block on a white-bg section. THINK LIKE A DESIGNER, not a bug-fixer.** The fix is to make the **card itself** a deliberate object on the page — not to recolor the room around it. Tinting whole sections to "make the cards visible" is a reactive, blotchy move: it creates an inconsistent page palette where some sections are cream and others are white for no compositional reason, just because of which blocks happen to live inside them.

**Default fix — tint the BLOCK, not the section.** Pick a warm ivory / off-white that comes from the SAME brand family as the site's accent colors (e.g. if the site has a navy + gold palette, use a warm ivory like `#FBF6EC` that pairs with the gold; if it's a cool grey palette, use `#F7F8FA` that pairs with the slate). The card becomes a deliberate light-register object on a clean white page, and every section keeps its rhythm. Same pattern as the dark "highlight" tier in a 3-up pricing grid — that tier is its own object too; the light tiers should be too, just in the light register.

Order of preference (use the first one that fits the page composition):

1. **Tint the block background** to a warm/cool off-white from the brand family (e.g. `backgroundColor: "#FBF6EC"` on warm palettes, `#F7F8FA` on cool palettes). **DEFAULT CHOICE** — keeps section rhythm intact, treats the card as a designed object, harmonizes with dark highlight tiers in the same grid.
2. **Add a hairline border to the block** that harmonizes with the brand (e.g. `border: "1px solid #E8E2D4"` on warm, `1px solid rgba(0,0,0,0.08)` on cool). Use when the brand is so minimal/monochrome that even a subtle block tint would feel heavy. ⚠️ Engine caveat: the chrome serializer does NOT currently emit `border` to Kajabi (only `border_radius`/`background`/`shadow`/`padding`) — so a `border` value renders in the editor preview but is dropped on export. Until that's fixed in `blockChrome.ts`, treat the border option as preview-only and prefer option 1.
3. **Tint the section background** to a soft off-white. **LAST RESORT** — only when (a) the section is the ONLY content section on the page, OR (b) tinting it actually improves the page rhythm (e.g. an "alternating bands" layout where every other section is already tinted by design). NEVER tint a single isolated section just because it happens to contain a white card — that creates the blotchy palette this rule exists to prevent.

Never rely on shadow alone — the verified Kajabi shadows (§4.18) are too gentle to substitute for an edge on white-on-white.

**Anti-pattern (do NOT do this):** "I see three sections with white cards on white backgrounds — I'll tint those three sections cream and leave the others white." This produces a page with no compositional reason for which sections are cream vs white. The expert will (correctly) call it out as an afterthought. Tint the blocks instead — every section stays white, every card pops on its own merit.

**Same rule applies to:** `pricing_card`, `accordion`, `feature` cards, `card`, any block whose visual identity is "a contained tile". Does NOT apply to `text`, `cta`, `image`, `logo` etc. (no chrome to define).

**Pre-flight check before saving any page:** for every `content` section whose `background` is white (`#FFF`/`#FFFFFF`/`white`/`rgb(255,255,255)`), walk the section's blocks. If any chrome-bearing block (`pricing_card`, `accordion`, `feature`, `card`) has `backgroundColor` also white AND `border` is empty, **tint the BLOCK** to a brand-family off-white (option 1 above). Reach for section tinting (option 3) ONLY if you can articulate a compositional reason — "this is the only content section on the page" or "the page already alternates tinted/white bands by design". If the only reason is "the card was invisible", you're doing option 3 wrong; use option 1.

The PricingCard component itself defaults `border` to `1px solid rgba(0,0,0,0.06)` when no chrome border is set — but `serializeChromeProps` only emits the `border` field when explicitly authored. So the **preview** masks the bug, and **export to Kajabi** ships borderless cards. The fix lives in the design JSON, not the component default.

---

### 4.24 CLONING A REFERENCE SITE — map first, build second (mandatory workflow)

🚨 **The single biggest source of "this has been brutal" sessions.** When the expert points at a URL and says "clone this", "match this site", "build me a site like X", "make it look like [URL]", or pastes a URL of their old site and asks you to rebuild it on Kajabi — **DO NOT design from screenshots and vibes**. That path leads to 10+ correction passes (verified across multiple painful sessions: missing sections, invented colors, AI-generated images where the source had real photos, mismatched buttons, "the colors below the fold are still wrong"). The fix is a hard procedure.

**Trigger phrases (any of these = use this workflow):** "clone https://...", "match this site", "build me a site like X", "make it look like [URL]", "use this as inspiration" + URL, "this is my old site, rebuild it on Kajabi", "I want my Kajabi site to look like my Squarespace at [URL]", "clone this landing page".

#### Phase 0 — Decide kind: WEBSITE (multi-page) vs LANDING PAGE (single page)

Before you map anything, know which mode you're in. The site you're editing already has a `kind` (`'site'` or `'landing_page'`) — read it from `get-site-design`. **Match the existing site's kind:**

- **`kind: 'site'`** (multi-page Kajabi website) → clone EVERY page from the source. Use `index`, `about`, `contact`, `programs` etc. as page keys. Phase 1 maps the whole domain.
- **`kind: 'landing_page'`** (single-page export) → clone ONLY the source's homepage (or whichever single page the URL points at). Everything goes under the `index` page key. Even if the source has 8 pages, you collapse to one — pick the most relevant page (the URL the expert pasted) and ignore the rest unless they explicitly ask for an inner page.

If the expert asks "clone https://..." in chat without an existing site selected, ask exactly one question: **"Should this be a full multi-page website or a single landing page?"** Then have them create the site via the New menu (Website or Landing page) and resume from Phase 1 inside that site.

#### Phase 1 — MAP the source FIRST (no design work yet)

Use Firecrawl (already wired in every thin client). For the page(s) you're cloning:

1. **`map`** the domain → discover all inner pages (about, services, contact, programs, etc.). **For `kind: 'site'`:** confirm with the expert which pages to include in the clone. **For `kind: 'landing_page'`:** skip `map` entirely — go straight to `scrape` on the single source URL.
2. **`scrape`** each page with `formats: ['markdown', 'screenshot', 'links', 'branding']`:
   - `markdown` → verbatim copy (every headline, body paragraph, list item, CTA label, form label, footer copyright).
   - `screenshot` → visual reference, you'll consult it section-by-section while building.
   - `links` → all image URLs + outbound links.
   - `branding` → exact colors (primary/secondary/accent/bg/text), fonts (heading + body family), logo URL.
3. **Write a Match Brief** to `/tmp/clone-brief.md` with:
   - **Brand tokens at the top:** primary, secondary, accent, bg, text colors (hex from `branding`); heading font + body font (from `branding.fonts` or screenshot inspection); logo URL.
   - **Per page**, an ordered list of sections — for each section: layout (split? full-width? grid count? slider?), copy verbatim, image URL(s), background color (sampled from screenshot or `branding`), text color, CTA labels + URLs.
   - Example: "1. Sticky header (logo left, nav center, CTA right). 2. Hero: full-bleed image bg `https://.../hero.jpg` + h1 `Build Your Practice` + subhead + 2 CTAs. 3. Stats band — 3 numbers on cream `#F8F4EC`. 4. Services 3-up grid with photos. 5. Testimonial slider. 6. Footer."
4. **Show the Match Brief to the expert** and ask exactly one question: "Here's what I see — N pages, this section breakdown, these colors, these fonts. Anything to change before I build?" Do NOT ask implementation questions. Wait for approval.

#### Phase 2 — DOWNLOAD the real assets

For every image referenced in the Match Brief:

1. Download via `curl` (URLs are already in the Brief from Firecrawl's `links` array).
2. Upload to the site via the `upload-site-image` edge function (per §4.14) → get back a permanent `https://...supabase.co/.../site-images/...` URL.
3. Wire that URL directly into the relevant section/block prop (`backgroundImage`, `src`, `logoSrc`).

**🛑 NEVER call `generate-site-image` to invent a "similar" image when the source has a real one.** The expert's reference site has THEIR photos (or the photos they specifically chose) — use them. AI-generated stand-ins are immediately recognizable as wrong and the expert will (correctly) ask why their real headshot/team photo/venue isn't there. Only use `generate-site-image` for sections the source genuinely doesn't have an image for AND the expert explicitly asks for one.

#### Phase 3 — BUILD page-by-page, hero first, STOP for approval

1. Build the homepage: header + hero ONLY. Save via `update-site-design`.
2. **STOP.** Tell the expert: "Hero is built — refresh and confirm before I continue." Do NOT speculatively build the entire site before any approval gate.
3. After approval, build the rest of the homepage section-by-section, in source order, with verbatim copy and the real image URLs from Phase 2.
4. After homepage is approved, repeat for each inner page in the same order: section-by-section, verbatim copy, real images.

#### Phase 4 — Hard constraints during build

- **No invented sections.** If the source has 6 sections, the clone has 6 sections matching the source's layout. Do not add a "while we're here" CTA section, a "what about a stats band?" section, or any section the source doesn't have. The expert can ask for additions later.
- **No invented colors.** Every color comes from the Match Brief's brand tokens. If a section needs a tint, derive it from the brand palette (lighten/darken via opacity), don't introduce a new hue.
- **No invented fonts.** Use the heading + body font identified in `branding`. If unavailable on Google Fonts, pick the closest match and tell the expert.
- **Verbatim copy.** Use the source's exact copy unless the expert tells you to rewrite. It's their content (or their reference's content) — paraphrasing is rewriting their voice.
- **All other AGENTS rules still apply.** Especially §4.6 (no opaque bg over images), §4.7 (CTA consistency), §4.10 (don't hardcode dynamic content on blog/library/auth pages), §4.13 (footer copyright no leading ©/year), §4.12 (no `fullWidth: true` unless source is genuinely edge-to-edge).

#### Phase 5 — Pre-flight before declaring "done"

Walk every page and verify before telling the expert it's complete:

- [ ] Section count + order matches source for each page.
- [ ] Every CTA across the whole site shares button styling (§4.7).
- [ ] Every image-bearing section uses a real `https://` URL from `upload-site-image` (no `{slot}` refs without backing rows; no `user-uploads://`; no `blob:`/`data:`).
- [ ] No section has opaque hex/rgb over an image (§4.6).
- [ ] Footer copyright has no leading `©`/year (§4.13).
- [ ] No `fullWidth: true` on content sections unless the source is genuinely edge-to-edge (§4.12).
- [ ] `design.pages.page`, `login`, `register`, `forgot_password`, `reset_password` are header+footer only (§4.10, §4.11).
- [ ] `blog`, `blog_post`, `library` use raw sections, no hardcoded mock content from the source's blog/library page (§4.10).

#### Why this exists

Every brutal clone session in the project history followed the same anti-pattern: read the source → form a vibe → ship 8 sections → expert points out section X is missing / colors below the fold are wrong / images are AI-generated instead of real / button #3 doesn't match button #1 → 10+ correction passes. **Mapping first turns a 10-pass slog into a 2-pass build.** The Match Brief takes ~10 minutes; the corrections it prevents take hours.

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

| Request                                              | What you do                                                                                                            |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| "Redesign the hero"                                  | Load site, replace the hero section in `design.pages.<page>.sections[N]`, save. Generate a new image if needed.        |
| "Make it feel more premium"                          | Adjust fonts, spacing, colors, copy, imagery in `design`. Save.                                                        |
| "Add an About page"                                  | Add a new entry to `design.pages` and append the key to `design.pageKeys`. Save.                                       |
| "Rewrite the copy"                                   | Update the relevant block `text` / `label` / `html` props in `design`. Save.                                           |
| "Generate a mountain hero image"                     | Call `generate-site-image`, wire the resulting URL into the hero block (or assign slot `hero` and reference it). Save. |
| "Fix this layout/visual issue on my site"            | Edit `design`. Save.                                                                                                   |
| "Change the editor UI / dashboard"                   | Only if the operator explicitly asks.                                                                                  |
| "Add a database table / edge function / change auth" | Only if the operator explicitly asks.                                                                                  |

---

## 7. Golden rule

> **The expert's site lives as JSON in the database. To change the site, change the JSON and save it. Don't ask permission, don't propose architectures, don't build UI to avoid doing the work — just make the edit.**

When in doubt, ask yourself:
**"Is this a site-content change (edit `design` JSON) or a shared-platform change (escalate to operator)?"**

If it's site content → edit the JSON, save to DB, done.
If it's shared platform → pause and tell the operator.

---

## 8. Syncing engine fixes from master (operator-triggered)

> **🚨 ARCHITECTURE — READ THIS FIRST.** As of engine `0.1.16+`, almost all rendering, preview, export, and block code lives in the **`@k-studio-pro/engine` npm package** (source on master at `packages/engine/`, published to npm via GitHub Actions on every `packages/engine/package.json` version bump). Thin clients are supposed to be **truly thin shells** that import from the package and pick up fixes via `bun update @k-studio-pro/engine`. The file-by-file sync workflows in §8.1–§8.9 are **legacy**, kept only for thin clients that haven't been migrated yet. **Always check §8.0 first** — if the thin client still has local `src/blocks/`, `src/engines/`, or `src/lib/siteDesign/` directories, run the §8.0 migration ONCE; from that point on, every fix flows automatically through `bun update`.

### 8.0 One-time migration: `migrate to engine package` (the proper fix)

When the operator pastes the literal phrase **"migrate to engine package"** (or **"sync to engine package"**, **"thin out this client"**), perform the following one-time migration. After this runs successfully, the thin client never needs §8.1's full file sync again — every engine fix lands via `bun update @k-studio-pro/engine`.

**The problem this solves.** Older thin clients (forked before the engine package existed) carry full local copies of:

- `src/blocks/` (every block component, exporter, serializer)
- `src/engines/` (export pipeline, base theme validator)
- `src/lib/siteDesign/` (renderer, types, blanks, preview helpers)

Their `tsconfig.json` and `vite.config.ts` aliases point `@/blocks`, `@/engines`, `@/lib/siteDesign` at these LOCAL stale files. So when master ships a Tabs fix in engine 0.1.15 and the thin client runs `bun update @k-studio-pro/engine`, the engine code DOES update inside `node_modules` — but every `import { Tabs } from '@/blocks'` in the thin client still resolves to the broken local copy. **`bun update` is a no-op until aliases are repointed.**

**The migration steps (run in order):**

1. **Confirm the engine package is installed and on the latest version:**

   ```bash
   bun add @k-studio-pro/engine@latest
   cat node_modules/@k-studio-pro/engine/package.json | grep '"version"'
   ```

   Should report `0.1.16` or higher. Also ensure `swiper` is installed: `bun add swiper`.

2. **Delete the local engine source directories** — these are what's shadowing the npm package:

   ```bash
   rm -rf src/blocks src/engines src/lib/siteDesign src/types/assets.ts src/types/schemas.ts
   ```

   Also delete duplicated preview chrome that the engine now exports:

   ```bash
   rm -f src/components/SitePreview.tsx
   ```

   (The thin client will re-create `src/components/SitePreview.tsx` as a one-line re-export in step 4 — see template below.)

3. **Repoint aliases in `tsconfig.json` and `vite.config.ts`** to the engine package instead of local paths. Open `tsconfig.json` (or `tsconfig.app.json`) and replace any `paths` entries for `@/blocks`, `@/engines`, `@/lib/siteDesign`, `@/types/assets`, `@/types/schemas` with:

   ```json
   "paths": {
     "@kajabi-studio/engine": ["./node_modules/@k-studio-pro/engine/src/index.ts"],
     "@/blocks": ["./node_modules/@k-studio-pro/engine/src/blocks"],
     "@/blocks/*": ["./node_modules/@k-studio-pro/engine/src/blocks/*"],
     "@/engines": ["./node_modules/@k-studio-pro/engine/src/engines"],
     "@/engines/*": ["./node_modules/@k-studio-pro/engine/src/engines/*"],
     "@/lib/siteDesign": ["./node_modules/@k-studio-pro/engine/src/siteDesign"],
     "@/lib/siteDesign/*": ["./node_modules/@k-studio-pro/engine/src/siteDesign/*"],
     "@/types/*": ["./node_modules/@k-studio-pro/engine/src/types/*"],
     "@/*": ["./src/*"]
   }
   ```

   And in `vite.config.ts`, replace any local-path aliases for these prefixes with the same node_modules paths (use `path.resolve(__dirname, "./node_modules/@k-studio-pro/engine/src/...")`). **Order matters in vite.config.ts** — more-specific aliases (`@/blocks`, `@/engines`, etc.) must come BEFORE the catch-all `@`. Mirror master's vite.config.ts exactly: read it via `cross_project--read_project_file` from project `kajabi-studio-max` (ID `4fd872bc-5636-4a8a-bde9-a334a0656f59`) and copy the `resolve.alias` array verbatim, then overwrite the thin client's `vite.config.ts`.

4. **Re-create the thin re-export shims** (so existing thin-client code that imports `@/components/SitePreview` keeps working):

   ```ts
   // src/components/SitePreview.tsx
   export { SitePreview } from '@k-studio-pro/engine';
   ```

5. **Verify imports still resolve.** Run `bunx tsc --noEmit` and watch for "cannot find module" errors. Expected: zero errors. If errors appear, they're almost always one of:
   - A thin client made a local tweak to an engine file (e.g. customized `Tabs.tsx`). The change is now lost — re-apply it as a wrapper component in `src/components/` instead, never by editing engine source.
   - A path alias was missed in step 3.
   - An import uses the deep path `@/blocks/components/Foo` where master uses `@/blocks` — replace it with the barrel import.

6. **Verify Vite picks up the change** by hard-refreshing the preview. Sliders should render multi-up; tabs should switch on click.

7. **Tell the operator:** "Migrated to the engine package. Local `src/blocks/`, `src/engines/`, and `src/lib/siteDesign/` deleted; aliases repointed to `@k-studio-pro/engine` (v0.1.X). From now on, run `bun update @k-studio-pro/engine` to pick up every master fix — no more file-by-file syncs."

**What thin clients should still own locally** (do NOT delete these in step 2):

- `src/pages/` — `SitesDashboard.tsx`, `SiteEditor.tsx`, etc. (per-thin-client UI customization is allowed)
- `src/components/` — minus `SitePreview.tsx` and any other file that's now a re-export from the engine
- `src/lib/siteStore.ts`, `src/lib/imageStore.ts` — data layer (uses thin client's own Supabase)
- `src/integrations/supabase/**` — auto-generated per project
- `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/hooks/**` — app shell
- `public/base-theme/*.zip` — base theme assets are bundled (engine reads them at runtime via fetch)

**When the migration is NOT safe to run:**

- The thin client has uncommitted local edits to `src/blocks/**`, `src/engines/**`, or `src/lib/siteDesign/**` that the operator hasn't reviewed. Pause, surface the diffs to the operator, get approval to discard.
- The engine package version installed is older than `0.1.16`. Run step 1 first.

After this migration, **§8.1's full file sync is obsolete for this thin client.** Engine fixes flow via `bun update`. Only §8.7 (landing pages — schema/store layer) and §8.9 (shell — pages/components) remain relevant for non-engine sync needs. §8.8 (base themes) still applies for the `public/base-theme/*.zip` assets.

### 8.0a Legacy file-by-file sync (§8.1 onwards)

The remaining subsections (§8.1–§8.9) describe the OLD file-by-file workflow used before the engine package existed. **Use them only when the thin client refuses §8.0's migration** (e.g. it has heavy local customization in engine source that the operator wants to preserve in-tree). For any thin client running engine 0.1.16+ with aliases pointing to `node_modules/@k-studio-pro/engine`, prefer `bun update` over §8.1.

---

Master (`@kajabi-studio-max`) ships ongoing fixes to the export pipeline, preview renderer, block components, and editor shell. **Thin clients on the engine package** (post-§8.0 migration) auto-receive these via `bun update @k-studio-pro/engine`. **Thin clients still on local engine source** (pre-§8.0) are frozen at the fork version and need a file sync. When the operator pastes the literal phrase **"sync from master"** (or "pull from master", "update engine from master"), this is a deliberate operator override of §4.2's "do not modify shell code" rule, and you SHOULD perform the sync — but FIRST check whether §8.0 migration would be a better fix.

### 8.1 What to sync

Pull these files verbatim from `@kajabi-studio-max` into the thin client. They are the entire app shell + engine layer; site content lives in the database and is unaffected.

**Engine + blocks (export pipeline):**

- `src/blocks/index.ts`
- `src/blocks/export.ts`
- `src/blocks/serialize.ts`
- `src/blocks/sections.tsx`
- `src/blocks/RawSection.tsx`
- `src/blocks/BlockWrapper.tsx`
- `src/blocks/blockChrome.ts`
- `src/blocks/blockDefaults.ts`
- `src/blocks/types.ts`
- `src/blocks/components/**` (every file)
- `src/engines/**` (every file)

**Site rendering:**

- `src/lib/siteDesign/types.ts`
- `src/lib/siteDesign/render.tsx`
- `src/lib/siteDesign/blank.ts`
- `src/lib/siteDesign/landingPageBlank.ts`
- `src/lib/siteStore.ts`
- `src/lib/imageStore.ts`

**Editor shell + preview:**

- `src/pages/SiteEditor.tsx`
- `src/pages/SitesDashboard.tsx`
- `src/pages/LandingPagesDashboard.tsx`
- `src/components/SitePreview.tsx`
- `src/components/AppHeader.tsx`
- `src/App.tsx` (routes — `/sites`, `/landing-pages`, `/sites/:id`)

**Type contracts (read-only at the type level but ship the file):**

- `src/types/assets.ts`
- `src/types/schemas.ts`

**Base theme assets (Pro variants — added 2026-04):**

- `public/base-theme/streamlined-home.zip`
- `public/base-theme/streamlined-home-pro.zip`
- `public/base-theme/encore-page.zip`
- `public/base-theme/encore-page-pro.zip`

### 8.2 What NOT to sync

- `src/integrations/supabase/types.ts` — auto-generated per project, leave alone.
- `src/integrations/supabase/client.ts` — auto-generated per project, leave alone.
- `.env`, `supabase/config.toml`, `supabase/migrations/**` — managed by the platform.
- `supabase/functions/**` — edge functions are deployed from master and shared; thin clients should never touch them.
- `AGENTS.md` itself — re-sync this file separately and ONLY if the operator explicitly says **"also sync AGENTS.md"** (as part of a full master sync) OR **"sync AGENTS.md from master"** / **"sync agents from master"** (standalone, no engine sync). The standalone phrasing is the fast path when only the guide changed (e.g. a new section like §4.14 was added) and the engine + edge functions are already current. When you see a standalone trigger: read `AGENTS.md` from project `kajabi-studio-max` (ID `4fd872bc-5636-4a8a-bde9-a334a0656f59`) via `cross_project--read_project_file`, overwrite the local file, and report back with a one-line summary of what changed (diff the new sections against the old). Do NOT touch any other files. Do NOT run a full §8.1 sync.
- `PRO_CAPABILITIES.md` — re-sync this file separately and ONLY if the operator explicitly says **"also sync PRO_CAPABILITIES.md"** (as part of a larger sync) OR **"sync PRO_CAPABILITIES.md from master"** / **"sync pro capabilities from master"** (standalone, Pro reference only). When you see that trigger: read only `PRO_CAPABILITIES.md` from project `kajabi-studio-max` (ID `4fd872bc-5636-4a8a-bde9-a334a0656f59`), overwrite the local file, and report back with a one-line summary of what changed. Do NOT touch `AGENTS.md` for this prompt.
- Anything outside the lists in §8.1.

### 8.3 How to do it

For each file in §8.1:

1. `cross_project--read_project_file` from project `kajabi-studio-max` (project ID `4fd872bc-5636-4a8a-bde9-a334a0656f59`).
2. Overwrite the local file with `code--write` (or skip if the file doesn't exist locally — that means master deleted it, delete it locally too with `code--delete`).
3. Batch reads in parallel where possible.

After syncing, run `tsc --noEmit` (or just rely on Vite's HMR) to catch any drift between the synced engine code and a thin-client-specific tweak that may have been made. If something doesn't compile, **stop and tell the operator** — do NOT silently patch master code to fit a local hack.

### 8.4 Reporting back

When done, tell the operator exactly which files changed and which were already up-to-date. Example: "Synced 14 files from master (8 in `src/blocks/`, 4 in `src/engines/`, 2 in `src/lib/siteDesign/`); 6 files were already current."

### 8.5 What this fixes

This sync is what propagates master-side fixes for: export pipeline bugs (e.g. external background-image URL mangling), preview rendering bugs (font loading, column gutters, heading-descendant fonts), block component bugs, and editor UI improvements. If the expert reports "this looked fine in the preview but broke after export" or "the preview doesn't match Kajabi", the first thing to try after reading the relevant code is asking the operator if a master sync is overdue.

### 8.6 Landing pages (added 2026-04)

The `sites` table has `kind` (`'site'` | `'landing_page'`) and `slug` columns. After a master sync, the thin client gains a **Landing pages** tab (`/landing-pages`) alongside **Sites**. `listSites(kind)` filters by kind so the two dashboards stay separate. Landing pages are single-page sites (`index` only) with a logo-only header and copyright-only footer; the slug becomes the public URL path on Kajabi.

**Base theme:** sites with `kind === 'landing_page'` export against Kajabi's **`encore-page`** base theme — a dedicated single-template landing-page theme that ships only `templates/index.liquid` (no `layouts/`, no `about`/`blog`/`library` etc.). Sites with `kind === 'site'` continue to export against `streamlined-home`. The branch happens in `SiteEditor.tsx` (`baseTheme: site.kind === 'landing_page' ? 'encore-page' : 'streamlined-home'`) and is plumbed through `exportFromTree` → `exportThemeZip` → `loadBaseThemeZip(baseTheme)`. Both base zips live in `public/base-theme/`. The block/section schema is identical between the two themes (same `block_text`, `block_cta`, `block_image`, `block_feature` snippets), so no per-block code changes are needed — only the underlying zip differs.

If a thin client hasn't been synced yet, RLS still scopes `sites` by user, so other users' landing pages won't leak in — but if the operator creates a landing page on behalf of an unsynced expert, that landing page will appear mixed into the expert's sites list until the sync lands. Sync sooner rather than later for any expert who will use landing pages.

The `get-site-design` and `update-site-design` edge functions return/accept `kind` and `slug`. Thin clients can read them after sync; they cannot mutate `kind` (set at creation), but they can update `slug` by passing it in the `update-site-design` body.

### 8.7 Targeted "sync only landing pages" (faster than full §8.1)

A full §8.1 sync takes a while. When the operator only needs to pick up the landing-pages feature on a thin client, they can paste this exact phrase instead:

> **"sync landing pages from master"**

When you (the thin-client AI) see that phrase, sync ONLY these files from `kajabi-studio-max` (project ID `4fd872bc-5636-4a8a-bde9-a334a0656f59`), in parallel:

- `src/lib/siteStore.ts` — adds `kind`, `slug`, `listSites(kind)`, `createLandingPage`, `slugify`
- `src/lib/siteDesign/landingPageBlank.ts` — **NEW** file (single-page baseline)
- `src/pages/SitesDashboard.tsx` — **unified workspace dashboard** with two tabs (Websites / Landing pages), per-user "Set as default" pin (localStorage-scoped by user id, UI-pref only — no site data), and a single "New ▾" button with two options
- `src/pages/LandingPagesDashboard.tsx` — **NEW** file (kept for back-compat — no longer routed; the unified dashboard at `/` replaces it)
- `src/pages/SiteEditor.tsx` — slug field, hides page selector for landing pages, branches `baseTheme` on `site.kind`
- `src/components/AppHeader.tsx` — nav tabs removed (everything's on one page now); brand mark routes to `/`
- `src/App.tsx` — `/landing-pages` is now a redirect to `/`
- `src/blocks/export.ts` — adds `baseTheme` to `ExportFromTreeOptions`
- `src/engines/exportEngine.ts` — adds `ExportThemeZipOptions.baseTheme`, branches `loadBaseThemeZip` on theme
- `src/engines/baseThemeValidator.ts` — multi-theme cache + `BaseThemeName` type
- `public/base-theme/encore-page.zip` — **NEW** asset (Kajabi encore-page base theme)

Skip everything else in §8.1. Skip type-checking unrelated areas. After writing the files, tell the operator: "Landing pages synced — 11 files updated. After a hard refresh, the workspace at `/` shows two tabs (Websites / Landing pages), a single 'New ▾' button to create either, and a 'Set as default' pin so each user can choose which tab opens first."

If `tsc --noEmit` flags an error in a file you didn't sync, that means the engine is also out of date and the operator should run a full **"sync from master"** afterwards. Don't try to patch the error locally.

### 8.8 Targeted "sync base themes from master" (Pro template plumbing)

When the operator pastes the literal phrase **"sync base themes from master"** (or **"sync pro themes from master"**), this is a fast path for picking up just the Pro template plumbing without re-syncing the entire engine. Sync ONLY these files from `kajabi-studio-max` (project ID `4fd872bc-5636-4a8a-bde9-a334a0656f59`), in parallel:

- `public/base-theme/streamlined-home.zip` — Standard website base theme
- `public/base-theme/streamlined-home-pro.zip` — **Pro** website base theme (sliders, animations, extra blocks)
- `public/base-theme/encore-page.zip` — Standard landing page base theme
- `public/base-theme/encore-page-pro.zip` — **Pro** landing page base theme (full Kajabi feature set)
- `src/engines/baseThemeValidator.ts` — `BaseThemeName` union + URL map (now 4 themes)
- `src/lib/siteStore.ts` — `base_theme` field on `Site`, `resolveBaseTheme(site)` helper
- `src/pages/SitesDashboard.tsx` — Standard / Pro toggle in create modals
- `src/pages/SiteEditor.tsx` — passes `resolveBaseTheme(site)` to `exportFromTree`

**About the `base_theme` column:** the `sites` table has a nullable `base_theme TEXT` column with a check constraint allowing `streamlined-home`, `streamlined-home-pro`, `encore-page`, `encore-page-pro`. Legacy sites (NULL) fall back to the Standard theme matching their `kind` via `resolveBaseTheme(site)`. The choice is locked at site creation — there is **no editor-side dropdown** to change it later (would silently break sites that depend on Pro-only blocks/fields).

**About Pro-only blocks/fields:** the Pro themes ship additional snippets (`block_feature_icon`, `block_code_tabs`, `block_search_filter`, `column_*_slider`) and ~50 extra section-level fields (sliders, scroll animations, advanced borders). These are **additive only** — every existing Standard block/field renders identically in Pro. Sites built for Standard can be safely re-exported against Pro without changes. **See `PRO_CAPABILITIES.md` for the full Pro-only catalog** (verified field IDs, override sentinels, font/CSS-class behavior) — required reading before composing Pro-specific blocks. Master keeps the same content mirrored in `mem://reference/pro-template-capabilities.md`.

After syncing, tell the operator: "Base themes synced — 8 files updated. Standard and Pro variants now available for both Websites and Landing pages, selected at site creation."

### 8.9 Targeted "sync shell from master" (visual app shell only)

Master ships ongoing visual/UX polish to the thin-client app shell — header, dashboard, editor chrome, preview chrome, fonts, design tokens, routing. When the operator wants every thin client to **look and feel identical** to the latest master without disturbing the engine, edge functions, or block library, they paste the literal phrase:

> **"sync shell from master"**

When you (the thin-client AI) see that phrase, sync ONLY these files from `kajabi-studio-max` (project ID `4fd872bc-5636-4a8a-bde9-a334a0656f59`), in parallel:

**App shell + chrome:**

- `src/components/AppHeader.tsx` — top bar, brand mark, user menu, admin link
- `src/components/SitePreview.tsx` — preview iframe + scoped CSS isolation
- `src/pages/SitesDashboard.tsx` — unified workspace dashboard (tabs, cards, "New ▾")
- `src/pages/SiteEditor.tsx` — editor shell (page selector, slug field, export button)
- `src/pages/LandingPagesDashboard.tsx` — back-compat redirect target
- `src/App.tsx` — routes
- `src/main.tsx` — providers, mount

**Design tokens + global styles:**

- `src/index.css` — CSS variables, base styles, font-face declarations
- `tailwind.config.ts` — design system tokens (colors, fonts, spacing)
- `index.html` — `<title>`, font `<link>` tags, viewport meta

**Shared UI primitives the shell depends on (only if they exist on master):**

- `src/components/ui/**` — shadcn primitives if master has updated variants

**What this sync does NOT touch (use other targeted syncs or full §8.1 for these):**

- `src/blocks/**` — block components and serializer (use full sync)
- `src/engines/**` — export pipeline (use full sync)
- `src/lib/siteDesign/**` — render engine + types (use full sync)
- `src/lib/siteStore.ts`, `src/lib/imageStore.ts` — data layer (use full sync)
- `supabase/functions/**` — edge functions (never sync; deployed from master)
- `public/base-theme/*.zip` — base themes (use §8.8 instead)
- `src/integrations/supabase/**`, `.env`, `supabase/config.toml` — auto-generated, never sync

**How to do it:**

1. For each file in the lists above, `cross_project--read_project_file` from project `kajabi-studio-max` (ID `4fd872bc-5636-4a8a-bde9-a334a0656f59`).
2. Overwrite the local file with `code--write` (or skip if master no longer has it — delete locally too).
3. Batch reads in parallel.
4. **Preserve thin-client-specific values where present:** if `AppHeader.tsx` on master references "Kajabi Studio Max" branding, leave the thin client's brand label intact (most thin clients have already been rebranded — e.g. "Studio Pro"). Diff the file before overwriting; if the only difference is the brand string, keep the thin-client string. The point of this sync is **visual parity**, not branding override.

**Reporting back:** "Shell synced — N files updated. Header, dashboard, editor, preview chrome, design tokens, and global styles now match master. Brand label preserved as `<thin client brand>`. Hard refresh to pick up the new styles."

If `tsc --noEmit` flags an error after the sync, the engine is also out of date — tell the operator to follow up with a full `"sync from master"`.

---

---

## 9. Pro template capabilities (moved out for sync speed)

The full Pro-only reference now lives in `PRO_CAPABILITIES.md` so standalone `sync AGENTS.md from master` stays fast.

**Before composing any Pro-only block, field, or theme setting:** read `PRO_CAPABILITIES.md`. It keeps the detailed 9.x numbering intact (slider, columns, tabs, search/filter, font overrides, button/form systems, custom CSS class, Pro-only block catalog).

**Standalone trigger:** if the operator pastes **"sync PRO_CAPABILITIES.md from master"** or **"sync pro capabilities from master"**, sync only that file from master and leave `AGENTS.md` untouched.
