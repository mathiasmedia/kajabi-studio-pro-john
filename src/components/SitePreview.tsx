/**
 * SitePreview — renders the actual home page React tree from the site's
 * template, scaled down to fit a thumbnail. Live + accurate (uses the same
 * code path as the editor/export), no screenshots needed.
 */
import { useEffect, useRef, useState } from 'react';
import { getTemplate } from '@/lib/templates';
import type { Site } from '@/lib/siteStore';

const RENDER_WIDTH = 1280; // viewport width we render the page at
const RENDER_HEIGHT = 800; // viewport height we capture for the thumbnail

export function SitePreview({ site }: { site: Site }) {
  const tpl = getTemplate(site.templateId);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / RENDER_WIDTH);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let content: React.ReactNode = null;
  try {
    content = tpl.renderPage(site, 'index');
  } catch (err) {
    console.error('[SitePreview] renderPage failed:', err);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white"
      style={{ aspectRatio: `${RENDER_WIDTH} / ${RENDER_HEIGHT}` }}
    >
      {content ? (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: RENDER_WIDTH,
            height: RENDER_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {content}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
          <div className="text-center">
            <div className="font-serif text-2xl font-semibold text-foreground">
              {site.brandName}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {tpl.label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
