/**
 * Image store — thin-client version.
 *
 * Storage:
 *   - Image metadata (id, url, alt, slot, ...) lives in localStorage under
 *     `thin-client.images.v1.<siteId>`. The actual pixels live on the
 *     master app's Supabase Storage and are referenced by public URL.
 *
 * Three intake paths:
 *   1. uploadSiteImage(siteId, file, opts) — converts to data URL, stores
 *      in localStorage. (No remote upload — thin client has no storage.)
 *   2. generateSiteImage(siteId, opts)     — calls the master's
 *      `generate-site-image` edge function via X-App-Token, then persists
 *      the returned public URL locally.
 *   3. unsplash — TODO.
 */
import { callMaster } from './masterApi';

export type ImageSource = 'upload' | 'ai' | 'unsplash';

export interface SiteImage {
  id: string;
  siteId: string;
  source: ImageSource;
  url: string;
  alt: string;
  prompt: string | null;
  slot: string | null;
  width: number | null;
  height: number | null;
  /** Master-side storage path returned by generate-site-image (for reference only). */
  storagePath: string | null;
  createdAt: string;
}

function lsKey(siteId: string): string {
  return `thin-client.images.v1.${siteId}`;
}

function readAll(siteId: string): SiteImage[] {
  try {
    const raw = localStorage.getItem(lsKey(siteId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SiteImage[]) : [];
  } catch (e) {
    console.error('[imageStore] read failed', e);
    return [];
  }
}

function writeAll(siteId: string, images: SiteImage[]): void {
  try {
    localStorage.setItem(lsKey(siteId), JSON.stringify(images));
  } catch (e) {
    console.error('[imageStore] write failed (quota?)', e);
  }
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---- list ----

export async function listSiteImages(siteId: string): Promise<SiteImage[]> {
  return [...readAll(siteId)].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---- upload (local-only, base64 in localStorage) ----

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result ?? ''));
    fr.onerror = () => reject(fr.error ?? new Error('FileReader failed'));
    fr.readAsDataURL(file);
  });
}

export async function uploadSiteImage(
  siteId: string,
  file: File,
  opts: { alt?: string; slot?: string } = {},
): Promise<SiteImage | null> {
  try {
    const url = await fileToDataUrl(file);
    const image: SiteImage = {
      id: uid(),
      siteId,
      source: 'upload',
      url,
      alt: opts.alt ?? file.name.replace(/\.[^.]+$/, ''),
      prompt: null,
      slot: opts.slot ?? null,
      width: null,
      height: null,
      storagePath: null,
      createdAt: new Date().toISOString(),
    };
    const all = readAll(siteId);
    all.push(image);
    writeAll(siteId, all);
    return image;
  } catch (e) {
    console.error('[imageStore] uploadSiteImage failed', e);
    return null;
  }
}

// ---- AI generate (calls master edge fn) ----

interface MasterImageResponse {
  url: string;
  alt?: string;
  slot?: string | null;
  storagePath?: string;
}

export async function generateSiteImage(
  siteId: string,
  opts: { prompt: string; alt?: string; slot?: string },
): Promise<{ image: SiteImage | null; error: string | null }> {
  try {
    const data = await callMaster<MasterImageResponse>('generate-site-image', {
      siteId,
      prompt: opts.prompt,
      alt: opts.alt,
      slot: opts.slot,
    });
    if (!data?.url) return { image: null, error: 'No image returned' };

    const image: SiteImage = {
      id: uid(),
      siteId,
      source: 'ai',
      url: data.url,
      alt: data.alt ?? opts.alt ?? opts.prompt.slice(0, 120),
      prompt: opts.prompt,
      slot: data.slot ?? opts.slot ?? null,
      width: null,
      height: null,
      storagePath: data.storagePath ?? null,
      createdAt: new Date().toISOString(),
    };
    const all = readAll(siteId);
    all.push(image);
    writeAll(siteId, all);
    return { image, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'AI generation failed';
    console.error('[imageStore] generateSiteImage failed', e);
    return { image: null, error: msg };
  }
}

// ---- update / delete ----

export async function updateSiteImage(
  id: string,
  patch: { alt?: string; slot?: string | null },
): Promise<SiteImage | null> {
  // We don't know the siteId from id alone — search every site bucket.
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('thin-client.images.v1.')) continue;
    const siteId = key.slice('thin-client.images.v1.'.length);
    const all = readAll(siteId);
    const idx = all.findIndex((img) => img.id === id);
    if (idx !== -1) {
      const next: SiteImage = {
        ...all[idx],
        alt: patch.alt ?? all[idx].alt,
        slot: patch.slot !== undefined ? patch.slot : all[idx].slot,
      };
      all[idx] = next;
      writeAll(siteId, all);
      return next;
    }
  }
  return null;
}

export async function deleteSiteImage(image: SiteImage): Promise<void> {
  const all = readAll(image.siteId).filter((img) => img.id !== image.id);
  writeAll(image.siteId, all);
}

/** Resolve image slots for a site → { [slot]: SiteImage }. Last image wins per slot. */
export function imagesBySlot(images: SiteImage[]): Record<string, SiteImage> {
  const out: Record<string, SiteImage> = {};
  const sorted = [...images].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  for (const img of sorted) {
    if (img.slot) out[img.slot] = img;
  }
  return out;
}
