/**
 * Sites Dashboard — unified workspace with two tabs (Websites / Landing pages).
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  listSites,
  createSite,
  createLandingPage,
  duplicateSite,
  deleteSite,
  updateSite,
  enabledPageCount,
  slugify,
  type Site,
} from '@/lib/siteStore';
import { SitePreview } from '@/components/SitePreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical, Plus, FileText, Layers, Copy, Check, LogOut,
  Globe, Rocket, ChevronDown, Pin, PinOff,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

type CreateMode = null | 'site' | 'landing_page';
type TabKind = 'site' | 'landing_page';

const DEFAULT_TAB_PREF_PREFIX = 'workspace.defaultTab.';

function isTabKind(v: unknown): v is TabKind {
  return v === 'site' || v === 'landing_page';
}

export default function SitesDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<Site[]>([]);
  const [landingPages, setLandingPages] = useState<Site[]>([]);
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [renameTarget, setRenameTarget] = useState<Site | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState<TabKind>('site');
  const [defaultTab, setDefaultTabState] = useState<TabKind>('site');

  useEffect(() => {
    if (!user?.id) return;
    try {
      const saved = localStorage.getItem(DEFAULT_TAB_PREF_PREFIX + user.id);
      if (isTabKind(saved)) {
        setDefaultTabState(saved);
        setActiveTab(saved);
      }
    } catch { /* ignore */ }
  }, [user?.id]);

  function saveDefaultTab(next: TabKind) {
    setDefaultTabState(next);
    if (!user?.id) return;
    try { localStorage.setItem(DEFAULT_TAB_PREF_PREFIX + user.id, next); } catch { /* ignore */ }
    toast({
      title: 'Default updated',
      description: next === 'site'
        ? 'Websites will open by default next time.'
        : 'Landing pages will open by default next time.',
    });
  }

  async function handleSignOut() {
    await signOut();
    toast({ title: 'Signed out' });
    navigate('/auth', { replace: true });
  }

  async function refresh() {
    const [s, lp] = await Promise.all([listSites('site'), listSites('landing_page')]);
    setWebsites(s);
    setLandingPages(lp);
  }

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('workspace-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sites' }, () => { refresh(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_images' }, () => { refresh(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleCreateSite(name: string) {
    const site = await createSite({ name, brandName: name });
    if (!site) return;
    await refresh();
    setCreateMode(null);
    navigate(`/sites/${site.id}`);
  }

  async function handleCreateLandingPage(name: string, slug: string) {
    const page = await createLandingPage({ name, brandName: name, slug });
    if (!page) return;
    await refresh();
    setCreateMode(null);
    navigate(`/sites/${page.id}`);
  }

  async function handleDuplicate(id: string) { await duplicateSite(id); await refresh(); }
  async function handleDelete(id: string) { await deleteSite(id); setDeleteTarget(null); await refresh(); }
  async function handleRename(id: string, newName: string) {
    await updateSite(id, { name: newName, brandName: newName });
    setRenameTarget(null);
    await refresh();
  }

  const isEmpty = websites.length === 0 && landingPages.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Kajabi Studio Pro</h1>
              <p className="text-xs text-muted-foreground">Build, save, and export Kajabi themes.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden text-sm text-muted-foreground sm:inline" title={user.email}>
                {user.email}
              </span>
            )}
            <NewMenu
              onNewSite={() => setCreateMode('site')}
              onNewLandingPage={() => setCreateMode('landing_page')}
            />
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {isEmpty ? (
          <FirstRunEmptyState
            onNewSite={() => setCreateMode('site')}
            onNewLandingPage={() => setCreateMode('landing_page')}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <WorkspaceTabs
              value={activeTab}
              onChange={setActiveTab}
              defaultTab={defaultTab}
              onSetDefault={saveDefaultTab}
              websiteCount={websites.length}
              landingPageCount={landingPages.length}
            />
            {activeTab === 'site' ? (
              <DashboardSection
                icon={<Globe className="h-4 w-4" />}
                title="Websites"
                subtitle="Multi-page Kajabi sites — homepage, about, programs, blog."
                count={websites.length}
                emptyLabel="No websites yet"
                emptyCta="New website"
                onEmptyCta={() => setCreateMode('site')}
              >
                {websites.map((site) => (
                  <ItemCard
                    key={site.id}
                    site={site}
                    kindLabel={`${enabledPageCount(site)} ${enabledPageCount(site) === 1 ? 'page' : 'pages'}`}
                    onOpen={() => navigate(`/sites/${site.id}`)}
                    onRename={() => setRenameTarget(site)}
                    onDuplicate={() => handleDuplicate(site.id)}
                    onDelete={() => setDeleteTarget(site)}
                  />
                ))}
              </DashboardSection>
            ) : (
              <DashboardSection
                icon={<Rocket className="h-4 w-4" />}
                title="Landing pages"
                subtitle="Single-page conversion-focused exports — one promise, one CTA."
                count={landingPages.length}
                emptyLabel="No landing pages yet"
                emptyCta="New landing page"
                onEmptyCta={() => setCreateMode('landing_page')}
              >
                {landingPages.map((page) => (
                  <ItemCard
                    key={page.id}
                    site={page}
                    kindLabel={page.slug ? `/${page.slug}` : 'no slug'}
                    kindLabelMono
                    onOpen={() => navigate(`/sites/${page.id}`)}
                    onRename={() => setRenameTarget(page)}
                    onDuplicate={() => handleDuplicate(page.id)}
                    onDelete={() => setDeleteTarget(page)}
                  />
                ))}
              </DashboardSection>
            )}
          </div>
        )}
      </main>

      <CreateSiteDialog
        open={createMode === 'site'}
        onOpenChange={(o) => !o && setCreateMode(null)}
        onCreate={handleCreateSite}
      />
      <CreateLandingPageDialog
        open={createMode === 'landing_page'}
        onOpenChange={(o) => !o && setCreateMode(null)}
        onCreate={handleCreateLandingPage}
      />
      <RenameDialog
        site={renameTarget}
        onOpenChange={(o) => !o && setRenameTarget(null)}
        onRename={handleRename}
      />
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this {deleteTarget?.kind === 'landing_page' ? 'landing page' : 'website'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.name}" will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function NewMenu({ onNewSite, onNewLandingPage }: { onNewSite: () => void; onNewLandingPage: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> New <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          What do you want to create?
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNewSite} className="flex-col items-start gap-1 py-3">
          <div className="flex w-full items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="font-medium">New website</span>
          </div>
          <span className="pl-6 text-xs text-muted-foreground">
            Multi-page Kajabi site — homepage, about, programs, blog.
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNewLandingPage} className="flex-col items-start gap-1 py-3">
          <div className="flex w-full items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="font-medium">New landing page</span>
          </div>
          <span className="pl-6 text-xs text-muted-foreground">
            Single page with one promise + one CTA. Custom URL slug.
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WorkspaceTabs({
  value, onChange, defaultTab, onSetDefault, websiteCount, landingPageCount,
}: {
  value: TabKind;
  onChange: (v: TabKind) => void;
  defaultTab: TabKind;
  onSetDefault: (v: TabKind) => void;
  websiteCount: number;
  landingPageCount: number;
}) {
  const tabs: { value: TabKind; label: string; icon: React.ReactNode; count: number }[] = [
    { value: 'site', label: 'Websites', icon: <Globe className="h-4 w-4" />, count: websiteCount },
    { value: 'landing_page', label: 'Landing pages', icon: <Rocket className="h-4 w-4" />, count: landingPageCount },
  ];
  const isDefault = value === defaultTab;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border">
      <div className="flex items-end gap-1">
        {tabs.map((tab) => {
          const active = value === tab.value;
          const isDefaultTab = defaultTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={
                'group inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors -mb-px ' +
                (active
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border')
              }
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={'rounded-full px-2 py-0.5 text-xs ' + (active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                {tab.count}
              </span>
              {isDefaultTab && <Pin className="h-3 w-3 fill-current text-primary/70" aria-label="Default tab" />}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => onSetDefault(value)}
        disabled={isDefault}
        className={
          'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ' +
          (isDefault
            ? 'cursor-default text-muted-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground')
        }
        title={isDefault ? 'This is your default tab' : 'Open this tab by default next time'}
      >
        {isDefault ? (<><Pin className="h-3.5 w-3.5 fill-current" />Default</>)
          : (<><PinOff className="h-3.5 w-3.5" />Set as default</>)}
      </button>
    </div>
  );
}

function DashboardSection({
  icon, title, subtitle, count, emptyLabel, emptyCta, onEmptyCta, children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: number;
  emptyLabel: string;
  emptyCta: string;
  onEmptyCta: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground">{icon}</span>
            {title}
            <span className="text-sm font-normal text-muted-foreground">({count})</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {count === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-dashed py-10 text-center">
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
          <Button size="sm" variant="outline" onClick={onEmptyCta}>
            <Plus className="h-3.5 w-3.5" /> {emptyCta}
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      )}
    </section>
  );
}

function FirstRunEmptyState({ onNewSite, onNewLandingPage }: { onNewSite: () => void; onNewLandingPage: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-6 border-dashed py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <FileText className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="max-w-md">
        <h2 className="text-xl font-semibold">Build a website or a landing page</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Both export to Kajabi. Pick the right shape for what you're shipping.
        </p>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        <button onClick={onNewSite} className="group rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Website</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Multi-page site — homepage, about, programs, blog. Full Kajabi theme export.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            <Plus className="h-3.5 w-3.5" /> New website
          </span>
        </button>
        <button onClick={onNewLandingPage} className="group rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Landing page</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Single page, one promise, one CTA. Custom URL slug. Encore-page theme.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            <Plus className="h-3.5 w-3.5" /> New landing page
          </span>
        </button>
      </div>
    </Card>
  );
}

function ItemCard({
  site, kindLabel, kindLabelMono, onOpen, onRename, onDuplicate, onDelete,
}: {
  site: Site;
  kindLabel: string;
  kindLabelMono?: boolean;
  onOpen: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <button onClick={onOpen} className="block w-full cursor-pointer text-left">
        <SitePreview site={site} />
      </button>
      <div className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0 flex-1">
          <button onClick={onOpen} className="block w-full truncate text-left font-semibold hover:underline">
            {site.name}
          </button>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {kindLabelMono ? <span className="font-mono">{kindLabel}</span> : kindLabel}
            {' · Updated '}{timeAgo(site.updatedAt)}
          </p>
          <CopyIdButton id={site.id} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpen}>Open</DropdownMenuItem>
            <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const short = `${id.slice(0, 8)}…`;

  async function copy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast({ title: 'ID copied', description: id });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  }

  return (
    <button
      onClick={copy}
      title={`Copy ID: ${id}`}
      className="mt-1.5 inline-flex items-center gap-1.5 rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <span>ID: {short}</span>
      {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function CreateSiteDialog({
  open, onOpenChange, onCreate,
}: { open: boolean; onOpenChange: (open: boolean) => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState('');
  useEffect(() => { if (open) setName(''); }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Create a new website
          </DialogTitle>
          <DialogDescription>Multi-page Kajabi site. You can add or remove pages later.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="site-name">Website name</Label>
            <Input
              id="site-name"
              autoFocus
              placeholder="e.g. Acme Co"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onCreate(name.trim()); }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onCreate(name.trim() || 'Untitled site')}>Create website</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateLandingPageDialog({
  open, onOpenChange, onCreate,
}: { open: boolean; onOpenChange: (open: boolean) => void; onCreate: (name: string, slug: string) => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugDirty, setSlugDirty] = useState(false);
  useEffect(() => {
    if (open) { setName(''); setSlug(''); setSlugDirty(false); }
  }, [open]);
  useEffect(() => { if (!slugDirty) setSlug(slugify(name)); }, [name, slugDirty]);
  const canSubmit = name.trim().length > 0;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" /> Create a new landing page
          </DialogTitle>
          <DialogDescription>
            Single page with logo-only chrome. The slug becomes the public URL on Kajabi.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lp-name">Page name</Label>
            <Input
              id="lp-name"
              autoFocus
              placeholder="e.g. Spring Launch"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lp-slug">URL slug</Label>
            <div className="flex items-center gap-1 rounded-md border border-input bg-background px-2 focus-within:ring-2 focus-within:ring-ring">
              <span className="text-sm text-muted-foreground">/</span>
              <Input
                id="lp-slug"
                placeholder="spring-launch"
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugDirty(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) onCreate(name.trim(), slug); }}
                className="border-0 px-1 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!canSubmit} onClick={() => canSubmit && onCreate(name.trim(), slug)}>
            Create landing page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RenameDialog({
  site, onOpenChange, onRename,
}: { site: Site | null; onOpenChange: (open: boolean) => void; onRename: (id: string, name: string) => void }) {
  const [name, setName] = useState('');
  useEffect(() => { if (site) setName(site.name); }, [site]);
  const label = site?.kind === 'landing_page' ? 'landing page' : 'website';
  return (
    <Dialog open={!!site} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {label}</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && site && name.trim()) onRename(site.id, name.trim()); }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => site && name.trim() && onRename(site.id, name.trim())}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
