/**
 * Site Editor — single-site preview + multi-page tab switcher + export.
 * Thin-client version: no auth.
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
import { getTemplate } from '@/lib/templates';
import { listSiteImages, imagesBySlot, type SiteImage } from '@/lib/imageStore';
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

function pageLabel(key: PageKey): string {
  if (SYSTEM_PAGE_LABELS[key]) return SYSTEM_PAGE_LABELS[key];
  return key
    .split('_')
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
      const tpl = getTemplate(s.templateId);
      if (!tpl.pageKeys.includes('index') && tpl.pageKeys.length > 0) {
        setActivePage(tpl.pageKeys[0]);
      }
      const imgs = await listSiteImages(siteId);
      if (cancelled) return;
      setImages(imgs);
    })();
    return () => {
      cancelled = true;
    };
  }, [siteId, navigate]);

  const tpl = useMemo(() => (site ? getTemplate(site.templateId) : null), [site]);
  const slotMap = useMemo(() => imagesBySlot(images), [images]);

  useEffect(() => {
    if (!tpl?.fonts) return;
    const families: string[] = [];
    const seen = new Set<string>();
    const add = (name?: string) => {
      if (!name) return;
      const key = name.trim();
      if (!key || seen.has(key.toLowerCase())) return;
      seen.add(key.toLowerCase());
      families.push(`${key.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800`);
    };
    add(tpl.fonts.heading);
    add(tpl.fonts.body);
    tpl.fonts.extras?.forEach(add);
    if (families.length === 0) return;
    const href = `https://fonts.googleapis.com/css2?${families.map(f => `family=${f}`).join('&')}&display=swap`;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.previewFonts = tpl.id;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [tpl]);

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
    if (!site || !tpl) return;
    setBusy(true);
    try {
      const trees = tpl.buildPages(site, slotMap);
      const fonts = tpl.fonts;
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
        themeSettings: tpl.themeSettings,
        customCss: tpl.customCss,
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

  if (!site || !tpl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading site…
      </div>
    );
  }

  const PreviewPage = tpl.renderPage(site, activePage, slotMap);

  return (
    <div className="min-h-screen bg-muted/20">
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
            · {tpl.label} · {tpl.pageKeys.length} {tpl.pageKeys.length === 1 ? 'page' : 'pages'}
          </span>
        </div>

        <Select value={activePage} onValueChange={(v) => setActivePage(v as PageKey)}>
          <SelectTrigger className="h-9 w-56">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            {tpl.pageKeys.map((key) => (
              <SelectItem key={key} value={key}>
                {pageLabel(key)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleExport} disabled={busy} size="sm">
          <Download className="h-4 w-4" />
          {busy ? 'Building zip…' : 'Export theme'}
        </Button>
      </div>

      <div>{PreviewPage}</div>
    </div>
  );
}
