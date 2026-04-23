/**
 * Pixel Perfect template — extracted from the original hardcoded Export.tsx.
 *
 * Parameterized by `site.brandName` (Logo + Copyright + a few page mentions).
 * Per-page enable/disable handled at the registry layer in buildPages().
 */
import type { ReactNode } from 'react';
import {
  HeaderSection,
  ContentSection,
  FooterSection,
  Logo,
  Menu,
  Text,
  Feature,
  Copyright,
} from '@/blocks';
import type { Site, PageKey } from '@/lib/siteStore';
import type { TemplateDef } from '@/lib/templates';

// ---------- shared style fragments ----------

const SERIF = `'Playfair Display', Georgia, 'Times New Roman', serif`;
const SANS = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const NAVY = '#0F1F3A';
const GOLD = '#E0A93B';

function ctaPair(opts: {
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
  onDark?: boolean;
}) {
  const secColor = opts.onDark ? '#FFFFFF' : NAVY;
  const secBorder = opts.onDark ? 'rgba(255,255,255,0.4)' : 'rgba(15,31,58,0.25)';
  return `
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:28px">
      <a href="${opts.primaryUrl}" style="display:inline-flex;align-items:center;gap:8px;background:${GOLD};color:${NAVY};padding:13px 22px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;font-family:${SANS}">
        ${opts.primaryLabel}
        <span style="font-size:13px">→</span>
      </a>
      <a href="${opts.secondaryUrl}" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:${secColor};padding:13px 22px;border:1px solid ${secBorder};border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;font-family:${SANS}">
        ${opts.secondaryLabel}
      </a>
    </div>`;
}

function checkRow(items: string[], onDark = true) {
  const color = onDark ? 'rgba(255,255,255,0.85)' : NAVY;
  const icon = `<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border:1.5px solid ${GOLD};border-radius:50%;color:${GOLD};font-size:11px;line-height:1">✓</span>`;
  return `
    <div style="display:flex;gap:28px;justify-content:center;flex-wrap:wrap;margin-top:32px;font-family:${SANS};font-size:13px;color:${color}">
      ${items.map((t) => `<span style="display:inline-flex;align-items:center;gap:8px">${icon}${t}</span>`).join('')}
    </div>`;
}

function goldIconTile(svg: string) {
  return `<div style="width:44px;height:44px;background:${GOLD};border-radius:8px;display:inline-flex;align-items:center;justify-content:center;color:${NAVY};margin-bottom:18px">${svg}</div>`;
}

const ICON_TARGET = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`;
const ICON_BOLT = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/></svg>`;
const ICON_USERS = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const STAR = `<span style="color:${GOLD};font-size:16px;letter-spacing:2px">★★★★★</span>`;

// ---------- shared chrome ----------

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Page', url: '/page' },
  { label: 'Contact', url: '/contact' },
  { label: 'Blog', url: '/blog' },
  { label: 'Blog Post', url: '/blog/sample-post' },
  { label: 'Thank You', url: '/thank-you' },
  { label: '404', url: '/404' },
];

function SharedHeader({ brand }: { brand: string }) {
  return (
    <HeaderSection
      background={NAVY}
      textColor="#FFFFFF"
      sticky
      stickyBackgroundColor={NAVY}
      stickyTextColor="#FFFFFF"
      paddingDesktop={{ top: '20', bottom: '20' }}
      horizontalAlignment="between"
    >
      <Logo type="text" text={brand} textColor="#FFFFFF" />
      <Menu handle="main-menu" alignment="right" previewItems={NAV_ITEMS} />
    </HeaderSection>
  );
}

function SharedFooter({ brand }: { brand: string }) {
  return (
    <FooterSection
      background="#0A1830"
      textColor="rgba(255,255,255,0.7)"
      paddingDesktop={{ top: '40', bottom: '40' }}
      verticalLayout
    >
      <Logo type="text" text={brand} textColor="#FFFFFF" />
      <Copyright text={`${brand}. All rights reserved.`} />
    </FooterSection>
  );
}

// ---------- pages ----------

function HomePage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={NAVY} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS}">
              <span style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.85);padding:7px 16px;border-radius:999px;font-size:12px;font-weight:500;letter-spacing:0.02em">
                <span style="color:${GOLD}">✦</span> Premium Brand Design Agency
              </span>
              <h1 style="font-family:${SERIF};font-size:76px;line-height:1.05;font-weight:700;color:#FFFFFF;margin:28px 0 0;letter-spacing:-0.01em">
                Brands That Get<br/>
                <span style="color:${GOLD};font-style:italic">Noticed</span>
              </h1>
              <p style="max-width:560px;margin:24px auto 0;font-size:17px;line-height:1.6;color:rgba(255,255,255,0.72)">
                We create distinctive visual identities for ambitious founders who want to stand out in crowded markets.
              </p>
              ${ctaPair({ primaryLabel: 'Book a Discovery Call', primaryUrl: '#contact', secondaryLabel: 'View Our Work', secondaryUrl: '#work', onDark: true })}
              ${checkRow(['50+ Brands Launched', '5-Star Reviews'], true)}
            </div>
          `}
        />
      </ContentSection>

      <ContentSection background="#F4F2EE" paddingDesktop={{ top: '96', bottom: '96' }}>
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
              <h2 style="font-family:${SERIF};font-size:46px;line-height:1.15;font-weight:700;color:${NAVY};margin:0">Is Your Brand Holding You Back?</h2>
              <p style="font-size:16px;line-height:1.6;color:#5B6B82;margin:20px auto 0;max-width:560px">Many talented founders struggle to attract their ideal clients because their brand doesn't reflect their true value.</p>
            </div>
          `}
        />
        <Feature width="4" align="left" backgroundColor="#FFFFFF" borderRadius="10" padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`${goldIconTile(ICON_TARGET)}<h3 style="font-family:${SERIF};font-size:21px;font-weight:700;color:${NAVY};margin:0 0 10px">Blending Into the Crowd</h3><p style="font-family:${SANS};font-size:14px;line-height:1.6;color:#5B6B82;margin:0">Your brand looks like everyone else's. Potential customers scroll right past without a second glance.</p>`}
        />
        <Feature width="4" align="left" backgroundColor="#FFFFFF" borderRadius="10" padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`${goldIconTile(ICON_BOLT)}<h3 style="font-family:${SERIF};font-size:21px;font-weight:700;color:${NAVY};margin:0 0 10px">Inconsistent Presence</h3><p style="font-family:${SANS};font-size:14px;line-height:1.6;color:#5B6B82;margin:0">Different colors, fonts, and messaging across platforms create confusion and erode trust.</p>`}
        />
        <Feature width="4" align="left" backgroundColor="#FFFFFF" borderRadius="10" padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`${goldIconTile(ICON_USERS)}<h3 style="font-family:${SERIF};font-size:21px;font-weight:700;color:${NAVY};margin:0 0 10px">Attracting the Wrong Clients</h3><p style="font-family:${SANS};font-size:14px;line-height:1.6;color:#5B6B82;margin:0">Without clear brand positioning, you end up with price-focused clients instead of value-aligned ones.</p>`}
        />
      </ContentSection>

      <ContentSection background="#E9EEF5" paddingDesktop={{ top: '96', bottom: '96' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:640px;margin:0 auto 56px"><h2 style="font-family:${SERIF};font-size:46px;line-height:1.15;font-weight:700;color:${NAVY};margin:0">Loved by Founders</h2><p style="font-size:16px;line-height:1.6;color:#5B6B82;margin:20px auto 0">Don't just take our word for it—hear from the entrepreneurs who've transformed their brands with us.</p></div>`}
        />
        <Text width="4" align="left" backgroundColor="#FFFFFF" borderRadius="10" padding={{ top: '28', bottom: '28', left: '26', right: '26' }} boxShadow="small"
          text={`<div style="font-family:${SANS}">${STAR}<p style="font-size:14px;line-height:1.65;color:${NAVY};margin:18px 0 24px;font-style:italic">"${brand} transformed our brand from forgettable to unforgettable. The ROI has been incredible."</p><div style="font-weight:700;font-size:14px;color:${NAVY}">Sarah Chen</div><div style="font-size:13px;color:${GOLD};margin-top:2px">Founder, TechFlow</div></div>`}
        />
        <Text width="4" align="left" backgroundColor="#FFFFFF" borderRadius="10" padding={{ top: '28', bottom: '28', left: '26', right: '26' }} boxShadow="small"
          text={`<div style="font-family:${SANS}">${STAR}<p style="font-size:14px;line-height:1.65;color:${NAVY};margin:18px 0 24px;font-style:italic">"Working with them was a joy. They truly understood our vision and brought it to life beautifully."</p><div style="font-weight:700;font-size:14px;color:${NAVY}">Marcus Williams</div><div style="font-size:13px;color:${GOLD};margin-top:2px">CEO, Elevate Coaching</div></div>`}
        />
        <Text width="4" align="left" backgroundColor="#FFFFFF" borderRadius="10" padding={{ top: '28', bottom: '28', left: '26', right: '26' }} boxShadow="small"
          text={`<div style="font-family:${SANS}">${STAR}<p style="font-size:14px;line-height:1.65;color:${NAVY};margin:18px 0 24px;font-style:italic">"Our rebrand resulted in a 3x increase in qualified leads. Worth every penny."</p><div style="font-weight:700;font-size:14px;color:${NAVY}">Emma Rodriguez</div><div style="font-size:13px;color:${GOLD};margin-top:2px">Founder, Bloom Wellness</div></div>`}
        />
      </ContentSection>

      <ContentSection background={NAVY} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}"><h2 style="font-family:${SERIF};font-size:54px;line-height:1.1;font-weight:700;color:#FFFFFF;margin:0">Ready to Stand Out?</h2><p style="max-width:520px;margin:24px auto 0;font-size:16px;line-height:1.6;color:rgba(255,255,255,0.72)">Let's discuss how we can transform your brand into an unforgettable experience for your ideal clients.</p>${ctaPair({ primaryLabel: 'Book a Discovery Call', primaryUrl: '#contact', secondaryLabel: 'Get Free Branding Guide', secondaryUrl: '#guide', onDark: true })}</div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

function GenericPage(opts: {
  brand: string;
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  subhead: string;
  bodyHtml?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  ctaHeading?: string;
  ctaSubhead?: string;
}) {
  return (
    <>
      <SharedHeader brand={opts.brand} />
      <ContentSection background={NAVY} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}"><span style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.85);padding:7px 16px;border-radius:999px;font-size:12px;font-weight:500"><span style="color:${GOLD}">✦</span> ${opts.eyebrow}</span><h1 style="font-family:${SERIF};font-size:64px;line-height:1.1;font-weight:700;color:#FFFFFF;margin:24px 0 0;letter-spacing:-0.01em">${opts.headingLine1}<br/><span style="color:${GOLD};font-style:italic">${opts.headingLine2}</span></h1><p style="max-width:560px;margin:22px auto 0;font-size:17px;line-height:1.6;color:rgba(255,255,255,0.72)">${opts.subhead}</p></div>`}
        />
      </ContentSection>
      {opts.bodyHtml && (
        <ContentSection background="#FFFFFF" paddingDesktop={{ top: '80', bottom: '80' }}>
          <Text align="left" width="12"
            text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto;color:#5B6B82;font-size:16px;line-height:1.7">${opts.bodyHtml}</div>`}
          />
        </ContentSection>
      )}
      {(opts.ctaPrimaryLabel || opts.ctaHeading) && (
        <ContentSection background={NAVY} textColor="#FFFFFF" paddingDesktop={{ top: '90', bottom: '90' }}>
          <Text align="center" width="12"
            text={`<div style="font-family:${SANS}"><h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:700;color:#FFFFFF;margin:0">${opts.ctaHeading ?? 'Ready When You Are'}</h2>${opts.ctaSubhead ? `<p style="max-width:520px;margin:20px auto 0;font-size:16px;line-height:1.6;color:rgba(255,255,255,0.72)">${opts.ctaSubhead}</p>` : ''}${opts.ctaPrimaryLabel ? ctaPair({ primaryLabel: opts.ctaPrimaryLabel, primaryUrl: opts.ctaPrimaryUrl ?? '#', secondaryLabel: opts.ctaSecondaryLabel ?? 'Learn More', secondaryUrl: opts.ctaSecondaryUrl ?? '#', onDark: true }) : ''}</div>`}
          />
        </ContentSection>
      )}
      <SharedFooter brand={opts.brand} />
    </>
  );
}

const PAGE_BUILDERS: Record<PageKey, (brand: string) => ReactNode> = {
  index: (brand) => <HomePage brand={brand} />,
  about: (brand) => (
    <GenericPage brand={brand} eyebrow="About the Studio" headingLine1="We Build Brands" headingLine2="That Last"
      subhead="A small, senior team of strategists and designers obsessed with the craft of brand identity."
      bodyHtml={`<p>${brand} started with a simple belief: founders deserve brand identities that punch above their weight. After 50+ launches, we've refined a process that consistently turns ambitious ideas into category-defining brands.</p><p style="margin-top:16px">We work with a small handful of clients each quarter so every project gets the attention it deserves.</p>`}
      ctaHeading="Want to Work Together?" ctaSubhead="We take on a limited number of projects each quarter."
      ctaPrimaryLabel="Book a Discovery Call" ctaPrimaryUrl="#contact" ctaSecondaryLabel="See Our Work" ctaSecondaryUrl="#work" />
  ),
  page: (brand) => (
    <GenericPage brand={brand} eyebrow="Generic Page" headingLine1="A Page," headingLine2="Beautifully Built"
      subhead="The Kajabi `page` template — used for any custom marketing page admins create."
      bodyHtml={`<p>This is the generic page template. You can compose any combination of content sections here using the same blocks that power the homepage.</p>`}
      ctaHeading="Need a Custom Page?" ctaPrimaryLabel="Start a Project" ctaPrimaryUrl="#contact" ctaSecondaryLabel="See Examples" ctaSecondaryUrl="#work" />
  ),
  contact: (brand) => (
    <GenericPage brand={brand} eyebrow="Get in Touch" headingLine1="Let's Start a" headingLine2="Conversation"
      subhead="Tell us about your project. We'll get back to you within one business day."
      ctaHeading="Prefer to Book Direct?" ctaSubhead="Skip the back-and-forth and grab a 30-minute discovery call."
      ctaPrimaryLabel="Schedule a Call" ctaPrimaryUrl="#book" ctaSecondaryLabel="Email Instead" ctaSecondaryUrl={`mailto:hello@${brand.toLowerCase().replace(/\s+/g, '')}.co`} />
  ),
  blog: (brand) => (
    <GenericPage brand={brand} eyebrow="The Journal" headingLine1="Notes on" headingLine2="Brand & Craft"
      subhead="Essays, case studies, and field notes."
      ctaHeading="Get New Essays in Your Inbox" ctaPrimaryLabel="Subscribe" ctaPrimaryUrl="#subscribe" ctaSecondaryLabel="Browse Archive" ctaSecondaryUrl="#archive" />
  ),
  blog_post: (brand) => (
    <GenericPage brand={brand} eyebrow="Essay" headingLine1="The Brand You" headingLine2="Already Have"
      subhead="Most founders think they need a rebrand. Usually, they need a sharper articulation of what's already working."
      ctaHeading="Liked This Piece?" ctaPrimaryLabel="Subscribe" ctaPrimaryUrl="#subscribe" ctaSecondaryLabel="Read More" ctaSecondaryUrl="#archive" />
  ),
  thank_you: (brand) => (
    <GenericPage brand={brand} eyebrow="Thank You" headingLine1="You're All" headingLine2="Set"
      subhead="We've received your inquiry and will be in touch within one business day."
      ctaHeading="More to Explore" ctaPrimaryLabel="Read the Journal" ctaPrimaryUrl="#blog" ctaSecondaryLabel="See Our Work" ctaSecondaryUrl="#work" />
  ),
  '404': (brand) => (
    <GenericPage brand={brand} eyebrow="Lost in Space" headingLine1="404 —" headingLine2="Page Not Found"
      subhead="The page you're looking for has either moved or never existed."
      ctaHeading="Where to Next?" ctaPrimaryLabel="Back to Home" ctaPrimaryUrl="/" ctaSecondaryLabel="Get in Touch" ctaSecondaryUrl="#contact" />
  ),
};

const ALL_PAGES: PageKey[] = ['index', 'about', 'page', 'contact', 'blog', 'blog_post', 'thank_you', '404'];

export const pixelPerfectTemplate: TemplateDef = {
  id: 'pixel-perfect',
  label: 'Pixel Perfect',
  description: 'Premium brand-design agency — navy + gold, 8 pages.',
  pageKeys: ALL_PAGES,
  fonts: { heading: 'Playfair Display', body: 'Inter' },
  buildPages: (site: Site) => {
    const out: Record<string, ReactNode> = {};
    for (const key of ALL_PAGES) {
      if (site.pages[key]?.enabled === false) continue;
      out[key] = PAGE_BUILDERS[key](site.brandName);
    }
    return out;
  },
  renderPage: (site: Site, page: PageKey) => PAGE_BUILDERS[page](site.brandName),
};
