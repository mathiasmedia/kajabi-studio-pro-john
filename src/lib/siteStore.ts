/**
 * Site store — Supabase-backed CRUD for the multi-site dashboard.
 *
 * Sites are pure data: every site row carries a self-contained `design`
 * (SiteDesign JSON) that the renderer + exporter consume. There are no
 * code-side templates anymore — new sites start from `buildBlankDesign`.
 *
 * RLS ensures users only see their own sites.
 */

import { supabase } from '@/integrations/supabase/client';
import type { SiteDesign } from './siteDesign/types';
import { isSiteDesign } from './siteDesign/types';
import { buildBlankDesign } from './siteDesign/blank';
import { buildLandingPageBlankDesign } from './siteDesign/landingPageBlank';

/**
 * Top-level kind a row can be:
 *   - 'site'          → a multi-page Kajabi website (the original product).
 *   - 'landing_page'  → a single-page, conversion-focused page with minimal chrome.
 *
 * Default everywhere is 'site' so existing callers never accidentally
 * create or filter to a different kind.
 */
export type SiteKind = 'site' | 'landing_page';

/**
 * Kajabi system page slots — these MUST exist in every theme. Custom page
 * keys (any string) live alongside them in `design.pageKeys` and the export
 * pipeline materializes each as `templates/<key>.liquid`.
 */
export type SystemPageKey =
  | 'index'
  | 'about'
  | 'page'
  | 'contact'
  | 'blog'
  | 'blog_post'
  | 'thank_you'
  | '404';

export const SYSTEM_PAGE_KEYS: ReadonlyArray<SystemPageKey> = [
  'index', 'about', 'page', 'contact', 'blog', 'blog_post', 'thank_you', '404',
];

/** A page key is either a Kajabi system slot or a custom string id. */
export type PageKey = SystemPageKey | (string & {});

export interface Site {
  id: string;
  name: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  brandName: string;
  pages: Partial<Record<PageKey, { enabled: boolean }>>;
  userId: string;
  design: SiteDesign | null;
  /** Top-level kind. Defaults to 'site' for legacy rows. */
  kind: SiteKind;
  /** URL-friendly slug. Used by landing pages for shareable URLs. */
  slug: string | null;
}

// ---- row <-> domain mapping ----

function rowToSite(row: {
  id: string;
  name: string;
  template_id: string;
  brand_name: string;
  pages: unknown;
  design?: unknown;
  created_at: string;
  updated_at: string;
  user_id: string;
  kind?: string | null;
  slug?: string | null;
}): Site {
  const kind: SiteKind = row.kind === 'landing_page' ? 'landing_page' : 'site';
  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id,
    brandName: row.brand_name,
    pages: (row.pages ?? {}) as Site['pages'],
    design: isSiteDesign(row.design) ? row.design : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
    kind,
    slug: row.slug ?? null,
  };
}

// ---- public API (async) ----

/**
 * List sites for the current user.
 * Filters by `kind` — defaults to 'site' so the existing dashboard never
 * sees landing pages mixed in. Pass 'landing_page' or 'all'.
 */
export async function listSites(kind: SiteKind | 'all' = 'site'): Promise<Site[]> {
  let query = supabase.from('sites').select('*').order('updated_at', { ascending: false });
  if (kind !== 'all') {
    query = query.eq('kind', kind);
  }
  const { data, error } = await query;
  if (error) {
    console.error('[siteStore] listSites failed:', error);
    return [];
  }
  return (data ?? []).map((r) => rowToSite(r as never));
}

export async function getSite(id: string): Promise<Site | null> {
  const { data, error } = await supabase.from('sites').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('[siteStore] getSite failed:', error);
    return null;
  }
  if (!data) return null;
  return rowToSite(data as never);
}

/** Slugify a string into a URL-friendly token (lowercase, hyphens). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export async function createSite(opts: {
  name: string;
  brandName?: string;
}): Promise<Site | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) {
    console.error('[siteStore] createSite: not authenticated');
    return null;
  }
  const name = opts.name.trim() || 'Untitled site';
  const brand = opts.brandName?.trim() || name;
  const design = buildBlankDesign(brand);
  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: userId,
      name,
      template_id: 'blank',
      brand_name: brand,
      pages: {},
      design: design as never,
      kind: 'site',
    })
    .select()
    .single();
  if (error) {
    console.error('[siteStore] createSite failed:', error);
    return null;
  }
  return rowToSite(data as never);
}

/**
 * Create a landing page (kind = 'landing_page'). Single-page Kajabi
 * export with logo-only header + copyright footer. Slug is auto-generated
 * from the name if not supplied.
 */
export async function createLandingPage(opts: {
  name: string;
  brandName?: string;
  slug?: string;
}): Promise<Site | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) {
    console.error('[siteStore] createLandingPage: not authenticated');
    return null;
  }
  const name = opts.name.trim() || 'Untitled landing page';
  const brand = opts.brandName?.trim() || name;
  const slug = (opts.slug?.trim() ? slugify(opts.slug) : slugify(name)) || 'landing';
  const design = buildLandingPageBlankDesign(brand);
  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: userId,
      name,
      template_id: 'landing-page-blank',
      brand_name: brand,
      pages: {},
      design: design as never,
      kind: 'landing_page',
      slug,
    })
    .select()
    .single();
  if (error) {
    console.error('[siteStore] createLandingPage failed:', error);
    return null;
  }
  return rowToSite(data as never);
}

export async function updateSite(
  id: string,
  patch: Partial<Omit<Site, 'id' | 'createdAt' | 'templateId' | 'userId' | 'kind'>>
): Promise<Site | null> {
  const row: {
    name?: string;
    brand_name?: string;
    pages?: Site['pages'];
    design?: SiteDesign;
    slug?: string | null;
    updated_at?: string;
  } = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.brandName !== undefined) row.brand_name = patch.brandName;
  if (patch.pages !== undefined) row.pages = patch.pages;
  if (patch.design !== undefined && patch.design !== null) row.design = patch.design;
  if (patch.slug !== undefined) row.slug = patch.slug ? slugify(patch.slug) : null;
  const { data, error } = await supabase
    .from('sites')
    .update(row as never)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('[siteStore] updateSite failed:', error);
    return null;
  }
  return rowToSite(data as never);
}

export async function duplicateSite(id: string): Promise<Site | null> {
  const original = await getSite(id);
  if (!original) return null;
  const copy = original.kind === 'landing_page'
    ? await createLandingPage({
        name: `${original.name} (copy)`,
        brandName: original.brandName,
      })
    : await createSite({
        name: `${original.name} (copy)`,
        brandName: original.brandName,
      });
  if (!copy || !original.design) return copy;
  return updateSite(copy.id, { design: original.design });
}

export async function deleteSite(id: string): Promise<void> {
  const { error } = await supabase.from('sites').delete().eq('id', id);
  if (error) console.error('[siteStore] deleteSite failed:', error);
}

/**
 * Number of system pages enabled for a site (defaults to all 8 if `pages` is empty).
 */
export function enabledPageCount(site: Site): number {
  return SYSTEM_PAGE_KEYS.filter((k) => site.pages[k]?.enabled !== false).length;
}
