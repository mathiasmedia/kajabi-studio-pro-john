/**
 * Site Editor — single-site preview + multi-page tab switcher + export.
 *
 * Reads the site by `:siteId` from the database, renders pages from
 * `site.design` JSON via the SiteDesign renderer, and exports the whole
 * multi-page tree as a Kajabi zip.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { exportFromTree, triggerDownload } from '@/blocks';
import {
  getSite,
  updateSite,
  type PageKey,
  type Site,
} from '@/lib/siteStore';
import { listSiteImages, imagesBySlot, type SiteImage } from '@/lib/imageStore';
import { renderDesign, designToPageTrees } from '@/lib/siteDesign/render';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Download, Pencil } from 'lucide-react';

const SYSTEM_PAGE_LABELS: Record<string, string> = {
  index: 'Home',
  about: 'About',
  page: 'Page',
  contact: 'Contact',
  blog: 'Blog',
  blog_post: 'Blog Post',
  thank_you: 'Thank You',
  '404': '404',
};

/** Friendly tab label for any system or custom page key. */
function pageLabel(key: PageKey): string {
  if (SYSTEM_PAGE_LABELS[key]) return SYSTEM_PAGE_LABELS[key];
  return key
    .split(/[-_]/)
    .map((w) => (w.length === 0 ? '' : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

export default function SiteEditor() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [activePage, setActivePage] = useState<PageKey>('index');
  const [busy, setBusy] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [images, setImages] = useState<SiteImage[]>([]);

  useEffect(() => {
    if (!siteId) return;
    let cancelled = false;
    (async () => {
      const s = await getSite(siteId);
      if (cancelled) return;
      if (!s) {
        navigate('/');
        return;
      }
      setSite(s);
      setNameDraft(s.name);
      const keys = s.design?.pageKeys ?? [];
      if (keys.length > 0 && !keys.includes('index')) {
        setActivePage(keys[0]);
      }
      const imgs = await listSiteImages(siteId);
      if (cancelled) return;
      setImages(imgs);
    })();
    return () => {
      cancelled = true;
    };
  }, [siteId, navigate]);

  const slotMap = useMemo(() => imagesBySlot(images), [images]);
  const pageKeys = site?.design?.pageKeys ?? [];

  // Preview-time font loading: inject a single Google Fonts <link> for the
  // design's declared fonts so the in-app iframe renders the same families
  // the export will. Cleaned up on design change/unmount.
  useEffect(() => {
    const fonts = site?.design?.fonts;
    if (!fonts) return;
    const families: string[] = [];
    const seen = new Set<string>();
    const add = (name?: string) => {
      if (!name) return;
      const key = name.trim();
      if (!key || seen.has(key.toLowerCase())) return;
      seen.add(key.toLowerCase());
      families.push(`${key.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800`);
    };
    add(fonts.heading);
    add(fonts.body);
    fonts.extras?.forEach(add);
    if (families.length === 0) return;
    const href = `https://fonts.googleapis.com/css2?${families.map(f => `family=${f}`).join('&')}&display=swap`;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    if (site?.id) link.dataset.previewFonts = site.id;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [site?.design?.fonts, site?.id]);

  async function commitName() {
    if (!site) return;
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === site.name) {
      setEditingName(false);
      setNameDraft(site.name);
      return;
    }
    const updated = await updateSite(site.id, { name: trimmed, brandName: trimmed });
    if (updated) setSite(updated);
    setEditingName(false);
  }

  async function handleExport() {
    if (!site || !site.design) return;
    setBusy(true);
    try {
      const trees = designToPageTrees(site.design, slotMap);
      const fonts = site.design.fonts;
      const themeSettings = site.design.themeSettings;
      const customCss = site.design.customCss;
      const global = fonts
        ? {
            headingFont: fonts.heading,
            bodyFont: fonts.body,
            fontImports: (fonts.extras ?? []).map((name) => {
              const slug = name.trim().replace(/\s+/g, '+');
              return `https://fonts.googleapis.com/css2?family=${slug}:wght@400;500;600;700;800&display=swap`;
            }),
          }
        : undefined;
      const blob = await exportFromTree(trees, {
        global,
        themeSettings,
        customCss,
      });
      const safe = site.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'site';
      triggerDownload(blob, `${safe}.zip`);
    } catch (err) {
      console.error(err);
      alert(`Export failed: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  if (!site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading site…
      </div>
    );
  }

  const PreviewPage = site.design
    ? renderDesign(site.design, activePage, slotMap)
    : null;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sticky editor bar */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" /> All sites
          </Button>
          <div className="h-6 w-px bg-border" />
          {editingName ? (
            <Input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitName();
                if (e.key === 'Escape') {
                  setNameDraft(site.name);
                  setEditingName(false);
                }
              }}
              className="h-8 w-48"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-sm font-semibold hover:bg-muted"
            >
              {site.name}
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          <span className="hidden text-xs text-muted-foreground sm:inline">
            · {pageKeys.length} {pageKeys.length === 1 ? 'page' : 'pages'}
          </span>
        </div>

        {/* Page selector */}
        <Select value={activePage} onValueChange={(v) => setActivePage(v as PageKey)}>
          <SelectTrigger className="h-9 w-56">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            {pageKeys.map((key) => (
              <SelectItem key={key} value={key}>
                {pageLabel(key)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleExport} disabled={busy || !site.design} size="sm">
          <Download className="h-4 w-4" />
          {busy ? 'Building zip…' : 'Export theme'}
        </Button>
      </div>

      {/* Preview */}
      <div>
        {PreviewPage ?? (
          <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
            This site has no design yet.
          </div>
        )}
      </div>
    </div>
  );
}
