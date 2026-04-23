/**
 * Site store — backed by the MASTER project's Supabase `sites` table.
 *
 * Schema (master):
 *   id uuid pk, user_id uuid, name text, template_id text, brand_name text,
 *   pages jsonb, created_at timestamptz, updated_at timestamptz
 *
 * RLS on the master enforces per-user isolation; we just need to include
 * `user_id` on insert.
 */
import { supabase } from '@/integrations/supabase/client';

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

export type PageKey = SystemPageKey | (string & {});

export type TemplateId =
  | 'pixel-perfect'
  | 'blank'
  | 'builder-pro'
  | 'coastal-calm'
  | 'calm-ledger'
  | 'sunday-table'
  | 'quiet-trail'
  | 'cooking-to-overcome'
  | 'go-make-a-dollar'
  | 'auticate';

export interface Site {
  id: string;
  name: string;
  templateId: TemplateId;
  createdAt: string;
  updatedAt: string;
  brandName: string;
  pages: Partial<Record<PageKey, { enabled: boolean }>>;
}

// ---- row <-> Site mapping ----

interface SiteRow {
  id: string;
  user_id: string;
  name: string;
  template_id: string;
  brand_name: string | null;
  pages: unknown;
  created_at: string;
  updated_at: string;
}

function rowToSite(row: SiteRow): Site {
  const pages =
    row.pages && typeof row.pages === 'object' && !Array.isArray(row.pages)
      ? (row.pages as Site['pages'])
      : {};
  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id as TemplateId,
    brandName: row.brand_name ?? row.name,
    pages,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('Not signed in');
  }
  return data.user.id;
}

// ---- public API ----

export async function listSites(): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('[siteStore] listSites failed:', error);
    return [];
  }
  return (data ?? []).map((r) => rowToSite(r as SiteRow));
}

export async function getSite(id: string): Promise<Site | null> {
  const { data, error } = await supabase.from('sites').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('[siteStore] getSite failed:', error);
    return null;
  }
  return data ? rowToSite(data as SiteRow) : null;
}

export async function createSite(opts: {
  name: string;
  templateId: TemplateId;
  brandName?: string;
}): Promise<Site | null> {
  const name = opts.name.trim() || 'Untitled site';
  const brand = opts.brandName?.trim() || name;
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (e) {
    console.error('[siteStore] createSite needs auth:', e);
    return null;
  }
  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: userId,
      name,
      template_id: opts.templateId,
      brand_name: brand,
      pages: {},
    })
    .select('*')
    .single();
  if (error) {
    console.error('[siteStore] createSite failed:', error);
    return null;
  }
  return rowToSite(data as SiteRow);
}

export async function updateSite(
  id: string,
  patch: Partial<Omit<Site, 'id' | 'createdAt'>>,
): Promise<Site | null> {
  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.brandName !== undefined) row.brand_name = patch.brandName;
  if (patch.templateId !== undefined) row.template_id = patch.templateId;
  if (patch.pages !== undefined) row.pages = patch.pages;

  const { data, error } = await supabase
    .from('sites')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    console.error('[siteStore] updateSite failed:', error);
    return null;
  }
  return rowToSite(data as SiteRow);
}

export async function duplicateSite(id: string): Promise<Site | null> {
  const original = await getSite(id);
  if (!original) return null;
  return createSite({
    name: `${original.name} (copy)`,
    templateId: original.templateId,
    brandName: original.brandName,
  });
}

export async function deleteSite(id: string): Promise<void> {
  const { error } = await supabase.from('sites').delete().eq('id', id);
  if (error) console.error('[siteStore] deleteSite failed:', error);
}

export function enabledPageCount(site: Site): number {
  return SYSTEM_PAGE_KEYS.filter((k) => site.pages[k]?.enabled !== false).length;
}
