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
  /**
   * Historical marker — what template (if any) the site was originally
   * created from. Kept on the row for audit/debug only; the renderer +
   * exporter no longer use it. New sites get the value `'blank'`.
   */
  templateId: string;
  createdAt: string;
  updatedAt: string;
  /** Brand label used in Logo + Copyright + page text */
  brandName: string;
  /** Per-page enable/disable. Missing key = enabled. */
  pages: Partial<Record<PageKey, { enabled: boolean }>>;
  /** Owner of the site (auth user id). */
  userId: string;
  /**
   * Full site design (page tree + blocks + props). Always populated for
   * sites created in the data-driven era. Older sites without one will
   * render as empty until their JSON is regenerated.
   */
  design: SiteDesign | null;
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
}): Site {
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
  };
}

// ---- public API (async) ----

export async function listSites(): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('updated_at', { ascending: false });
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
    })
    .select()
    .single();
  if (error) {
    console.error('[siteStore] createSite failed:', error);
    return null;
  }
  return rowToSite(data as never);
}

export async function updateSite(
  id: string,
  patch: Partial<Omit<Site, 'id' | 'createdAt' | 'templateId' | 'userId'>>
): Promise<Site | null> {
  const row: {
    name?: string;
    brand_name?: string;
    pages?: Site['pages'];
    design?: SiteDesign;
    updated_at?: string;
  } = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.brandName !== undefined) row.brand_name = patch.brandName;
  if (patch.pages !== undefined) row.pages = patch.pages;
  if (patch.design !== undefined && patch.design !== null) row.design = patch.design;
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
  const copy = await createSite({
    name: `${original.name} (copy)`,
    brandName: original.brandName,
  });
  if (!copy || !original.design) return copy;
  // Carry the original design over so the duplicate is a true clone.
  return updateSite(copy.id, { design: original.design });
}

export async function deleteSite(id: string): Promise<void> {
  const { error } = await supabase.from('sites').delete().eq('id', id);
  if (error) console.error('[siteStore] deleteSite failed:', error);
}

/**
 * Number of system pages enabled for a site (defaults to all 8 if `pages` is empty).
 * Custom page keys aren't counted here — this is just a quick stat for the dashboard.
 */
export function enabledPageCount(site: Site): number {
  return SYSTEM_PAGE_KEYS.filter((k) => site.pages[k]?.enabled !== false).length;
}
