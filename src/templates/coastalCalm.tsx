/**
 * Coastal Calm template — "Steady & Salt" design DNA.
 *
 * Inspired by auticate.com: warm sandy gradients, heavy black serif headlines,
 * soft pastel accents (sage, terracotta, ocean blue), gradient pill CTAs.
 */
import type { ReactNode } from 'react';
import {
  HeaderSection,
  ContentSection,
  FooterSection,
  Image,
  Logo,
  Menu,
  Text,
  Feature,
  Copyright,
} from '@/blocks';
import type { Site, PageKey } from '@/lib/siteStore';
import type { SiteImage } from '@/lib/imageStore';
import type { TemplateDef, ImageSlotDef } from '@/lib/templates';

// ---------- image slots ----------

const IMAGE_SLOTS: ImageSlotDef[] = [
  {
    key: 'heroImage',
    label: 'Hero image',
    description: 'Sits beneath the homepage hero headline.',
    defaultPrompt:
      'Soft warm photograph of a quiet seaside scene at golden hour — sand, gentle waves, muted sage and terracotta tones, film grain, cinematic, no text',
    aspect: '16:9',
  },
  {
    key: 'voicesBackdrop',
    label: 'Voices backdrop',
    description: 'Background photo for the testimonials section.',
    defaultPrompt:
      'Out-of-focus warm beach landscape with sand dunes and pampas grass, dusty pastel palette, dreamy bokeh, no people, no text',
    aspect: '16:9',
  },
  {
    key: 'aboutPortrait',
    label: 'About portrait',
    description: 'Image on the About page beneath the hero.',
    defaultPrompt:
      'Editorial photo of a hand-written letter, ceramic mug, dried wildflowers and a small notebook on a linen tablecloth, warm soft natural light, top-down view, calm and slow living mood',
    aspect: '4:3',
  },
];

// ---------- design tokens ----------

const SERIF = `'Fraunces', 'Playfair Display', Georgia, serif`;
const SANS = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const INK = '#1A1714';            // near-black headlines
const BODY = '#5A5248';           // warm gray body
const SAND = '#F4ECDF';           // page background base
const SAND_DEEP = '#E8DCC4';      // deeper sand for gradient end
const CREAM = '#FBF6EC';          // card background
const SAGE = '#9CAE9A';           // dusty sage accent
const TERRA = '#D08A6E';          // soft terracotta accent
const OCEAN = '#A6BFC9';          // pale ocean blue accent
const GRADIENT_BG = `linear-gradient(180deg, ${SAND} 0%, ${SAND_DEEP} 100%)`;
const GRADIENT_PILL = `linear-gradient(135deg, ${TERRA} 0%, #C97558 100%)`;

// ---------- inline HTML helpers ----------

function pillCta(opts: {
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
}) {
  return `
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px">
      <a href="${opts.primaryUrl}" style="display:inline-flex;align-items:center;gap:8px;background:${GRADIENT_PILL};color:#FFFFFF;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS};box-shadow:0 4px 14px rgba(208,138,110,0.35)">
        ${opts.primaryLabel}
        <span style="font-size:13px">→</span>
      </a>
      ${opts.secondaryLabel ? `
      <a href="${opts.secondaryUrl ?? '#'}" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:${INK};padding:14px 28px;border:1.5px solid rgba(26,23,20,0.18);border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">
        ${opts.secondaryLabel}
      </a>` : ''}
    </div>`;
}

function eyebrow(label: string, dotColor = SAGE) {
  return `<span style="display:inline-flex;align-items:center;gap:8px;font-family:${SANS};font-size:13px;font-weight:600;color:${BODY};letter-spacing:0.08em;text-transform:uppercase">
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dotColor}"></span>
    ${label}
  </span>`;
}

function pastelTile(color: string, svg: string) {
  return `<div style="width:56px;height:56px;background:${color};border-radius:18px;display:inline-flex;align-items:center;justify-content:center;color:${INK};margin-bottom:20px;box-shadow:0 6px 16px rgba(0,0,0,0.06)">${svg}</div>`;
}

const ICON_WAVE = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/></svg>`;
const ICON_SUN = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
const ICON_LEAF = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.5 2c.5 2.5.02 4.5-1.1 6.9C15.7 14.4 11 13 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>`;

// ---------- shared chrome ----------

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Membership', url: '/page' },
  { label: 'Journal', url: '/blog' },
  { label: 'Contact', url: '/contact' },
];

function SharedHeader({ brand }: { brand: string }) {
  return (
    <HeaderSection
      background={SAND}
      textColor={INK}
      sticky
      stickyBackgroundColor={SAND}
      stickyTextColor={INK}
      paddingDesktop={{ top: '22', bottom: '22' }}
      horizontalAlignment="between"
    >
      <Logo type="text" text={brand} textColor={INK} />
      <Menu handle="main-menu" alignment="right" previewItems={NAV_ITEMS} />
    </HeaderSection>
  );
}

function SharedFooter({ brand }: { brand: string }) {
  return (
    <FooterSection
      background={INK}
      textColor="rgba(255,255,255,0.72)"
      paddingDesktop={{ top: '56', bottom: '40' }}
      verticalLayout
    >
      <Logo type="text" text={brand} textColor="#FFFFFF" />
      <Copyright text={`${brand}. Made slowly, by the sea.`} />
    </FooterSection>
  );
}

// ---------- pages ----------

function HomePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.heroImage;
  const voices = images.voicesBackdrop;
  return (
    <>
      <SharedHeader brand={brand} />

      {/* Hero */}
      <ContentSection paddingDesktop={{ top: '96', bottom: '120' }}
        background={SAND}>
        <Text align="center" width="12"
          text={`
            <div style="font-family:${SANS};background:${GRADIENT_BG};margin:-96px -24px 0;padding:140px 24px 60px;border-radius:0 0 48px 48px">
              ${eyebrow('A coastal slow-living club', TERRA)}
              <h1 style="font-family:${SERIF};font-size:88px;line-height:1.02;font-weight:900;color:${INK};margin:24px auto 0;max-width:860px;letter-spacing:-0.02em">
                Live a little<br/>
                <span style="font-style:italic;font-weight:500">slower.</span>
              </h1>
              <p style="max-width:520px;margin:28px auto 0;font-size:18px;line-height:1.65;color:${BODY}">
                ${brand} is a small, quiet membership for people who want their days to feel more like a long walk on the beach — and less like a notification feed.
              </p>
              ${pillCta({ primaryLabel: 'Join the membership', primaryUrl: '#join', secondaryLabel: 'How it works', secondaryUrl: '#how' })}
              <div style="display:flex;gap:32px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:48px;font-family:${SANS};font-size:13px;color:${BODY}">
                <span style="display:inline-flex;align-items:center;gap:8px">
                  <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:${SAGE}"></span>
                  Weekly slow-living rituals
                </span>
                <span style="display:inline-flex;align-items:center;gap:8px">
                  <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:${OCEAN}"></span>
                  Quiet community of 240 members
                </span>
              </div>
            </div>
          `}
        />
        {hero && (
          <Image
            src={hero.url}
            alt={hero.alt}
            colWidth="10"
            imageBorderRadius="32"
            align="center"
          />
        )}
      </ContentSection>

      {/* What's inside */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`
            <div style="font-family:${SANS};max-width:680px;margin:0 auto 64px">
              ${eyebrow("What's inside", SAGE)}
              <h2 style="font-family:${SERIF};font-size:54px;line-height:1.1;font-weight:900;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
                Three little anchors<br/>for an unhurried week.
              </h2>
            </div>
          `}
        />
        <Feature width="4" align="left" backgroundColor={SAND} borderRadius="24" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`${pastelTile(SAGE, ICON_LEAF)}<h3 style="font-family:${SERIF};font-size:24px;font-weight:800;color:${INK};margin:0 0 12px;letter-spacing:-0.005em">Sunday Letter</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">A short, hand-written essay every Sunday morning. Read it with coffee. No links, no ads, no urgency.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={SAND} borderRadius="24" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`${pastelTile(TERRA, ICON_SUN)}<h3 style="font-family:${SERIF};font-size:24px;font-weight:800;color:${INK};margin:0 0 12px;letter-spacing:-0.005em">Monthly Ritual</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">One small, beautiful practice per month — a recipe, a walk, a quiet ceremony — to mark the changing season.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={SAND} borderRadius="24" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`${pastelTile(OCEAN, ICON_WAVE)}<h3 style="font-family:${SERIF};font-size:24px;font-weight:800;color:${INK};margin:0 0 12px;letter-spacing:-0.005em">The Quiet Room</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">A members-only space — slow-paced, no metrics, no DMs at midnight. Just kind people, sharing what's working.</p>`}
        />
      </ContentSection>

      {/* Voices */}
      <ContentSection
        background={SAND_DEEP}
        backgroundImage={voices?.url}
        paddingDesktop={{ top: '110', bottom: '110' }}
      >
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:640px;margin:0 auto 56px">${eyebrow('Voices from the shore', OCEAN)}<h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:900;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Members write us back.</h2></div>`}
        />
        <Text width="6" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '32', right: '32' }} boxShadow="small"
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:22px;line-height:1.45;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"I cancelled three other subscriptions the week I joined ${brand}. This is the only one that actually slowed me down."</p><div style="display:flex;align-items:center;gap:14px"><span style="display:inline-block;width:42px;height:42px;border-radius:50%;background:${SAGE}"></span><div><div style="font-weight:700;font-size:14px;color:${INK}">Naomi P.</div><div style="font-size:13px;color:${BODY};margin-top:2px">Member since spring</div></div></div></div>`}
        />
        <Text width="6" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '32', right: '32' }} boxShadow="small"
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:22px;line-height:1.45;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"The Sunday Letter is the only thing in my inbox I actually look forward to. It feels like a postcard from a friend."</p><div style="display:flex;align-items:center;gap:14px"><span style="display:inline-block;width:42px;height:42px;border-radius:50%;background:${TERRA}"></span><div><div style="font-weight:700;font-size:14px;color:${INK}">Mateo R.</div><div style="font-size:13px;color:${BODY};margin-top:2px">Member since winter</div></div></div></div>`}
        />
      </ContentSection>

      {/* Final CTA */}
      <ContentSection background={SAND} paddingDesktop={{ top: '120', bottom: '120' }}>
        <Text align="center" width="12"
          text={`
            <div style="font-family:${SANS}">
              ${eyebrow('A standing invitation', TERRA)}
              <h2 style="font-family:${SERIF};font-size:64px;line-height:1.05;font-weight:900;color:${INK};margin:18px auto 0;max-width:720px;letter-spacing:-0.015em">
                Come sit down<br/><span style="font-style:italic;font-weight:500">for a while.</span>
              </h2>
              <p style="max-width:480px;margin:24px auto 0;font-size:17px;line-height:1.65;color:${BODY}">$12 a month. Cancel any Tuesday. The first Sunday Letter lands free.</p>
              ${pillCta({ primaryLabel: 'Become a member', primaryUrl: '#join', secondaryLabel: 'Read a sample letter', secondaryUrl: '#sample' })}
            </div>
          `}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

function GenericPage(opts: {
  brand: string;
  eyebrowLabel: string;
  eyebrowDot?: string;
  headingLine1: string;
  headingLine2: string;
  subhead: string;
  bodyHtml?: string;
  bodyImage?: SiteImage;
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
      <ContentSection background={SAND} paddingDesktop={{ top: '96', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};background:${GRADIENT_BG};margin:-96px -24px 0;padding:140px 24px 100px;border-radius:0 0 48px 48px">
            ${eyebrow(opts.eyebrowLabel, opts.eyebrowDot ?? SAGE)}
            <h1 style="font-family:${SERIF};font-size:72px;line-height:1.05;font-weight:900;color:${INK};margin:22px auto 0;max-width:760px;letter-spacing:-0.02em">${opts.headingLine1}<br/><span style="font-style:italic;font-weight:500">${opts.headingLine2}</span></h1>
            <p style="max-width:520px;margin:24px auto 0;font-size:17px;line-height:1.65;color:${BODY}">${opts.subhead}</p>
          </div>`}
        />
      </ContentSection>
      {(opts.bodyHtml || opts.bodyImage) && (
        <ContentSection background={CREAM} paddingDesktop={{ top: '88', bottom: '88' }}>
          {opts.bodyImage && (
            <Image
              src={opts.bodyImage.url}
              alt={opts.bodyImage.alt}
              colWidth="10"
              imageBorderRadius="28"
              align="center"
            />
          )}
          {opts.bodyHtml && (
            <Text align="left" width="12"
              text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto;color:${BODY};font-size:17px;line-height:1.75">${opts.bodyHtml}</div>`}
            />
          )}
        </ContentSection>
      )}
      {(opts.ctaPrimaryLabel || opts.ctaHeading) && (
        <ContentSection background={SAND_DEEP} paddingDesktop={{ top: '100', bottom: '100' }}>
          <Text align="center" width="12"
            text={`<div style="font-family:${SANS}">
              <h2 style="font-family:${SERIF};font-size:48px;line-height:1.05;font-weight:900;color:${INK};margin:0;letter-spacing:-0.015em">${opts.ctaHeading ?? 'Want to join us?'}</h2>
              ${opts.ctaSubhead ? `<p style="max-width:480px;margin:20px auto 0;font-size:16px;line-height:1.65;color:${BODY}">${opts.ctaSubhead}</p>` : ''}
              ${opts.ctaPrimaryLabel ? pillCta({ primaryLabel: opts.ctaPrimaryLabel, primaryUrl: opts.ctaPrimaryUrl ?? '#', secondaryLabel: opts.ctaSecondaryLabel, secondaryUrl: opts.ctaSecondaryUrl }) : ''}
            </div>`}
          />
        </ContentSection>
      )}
      <SharedFooter brand={opts.brand} />
    </>
  );
}

type PageBuilder = (brand: string, images: Record<string, SiteImage>) => ReactNode;

const PAGE_BUILDERS: Record<PageKey, PageBuilder> = {
  index: (brand, images) => <HomePage brand={brand} images={images} />,
  about: (brand, images) => (
    <GenericPage brand={brand} eyebrowLabel="Our story" eyebrowDot={SAGE}
      headingLine1="Built by two people"
      headingLine2="who needed it most."
      subhead="We started this club from a small kitchen on the coast, after one too many burnouts and not enough quiet Sundays."
      bodyImage={images.aboutPortrait}
      bodyHtml={`<p>${brand} began with a single hand-written letter mailed to twelve friends. They wrote back. Then their friends asked to join. We never planned to build a business — but here we are, four years later, mailing slow Sunday notes to readers in 31 countries.</p><p style="margin-top:18px">We keep the membership small on purpose. Big things rarely feel quiet.</p>`}
      ctaHeading="Pull up a chair." ctaSubhead="The first letter is on us."
      ctaPrimaryLabel="Join the membership" ctaPrimaryUrl="#join" ctaSecondaryLabel="Read a sample" ctaSecondaryUrl="#sample" />
  ),
  page: (brand) => (
    <GenericPage brand={brand} eyebrowLabel="The membership" eyebrowDot={TERRA}
      headingLine1="$12 a month."
      headingLine2="No fine print."
      subhead="Everything inside, billed the way you'd want — clearly, kindly, and easy to leave."
      bodyHtml={`<p><strong>What you get:</strong> a Sunday Letter every week, a Monthly Ritual on the first of the month, and a quiet members' room you can drop into when it suits you.</p><p style="margin-top:18px"><strong>What you don't get:</strong> notifications, gamification, streaks, badges, leaderboards, or anyone trying to sell you a course.</p><p style="margin-top:18px"><strong>Cancel any Tuesday.</strong> No exit interview. We'll wave you off kindly.</p>`}
      ctaHeading="Ready when you are." ctaPrimaryLabel="Join for $12/mo" ctaPrimaryUrl="#join" ctaSecondaryLabel="Read a sample letter" ctaSecondaryUrl="#sample" />
  ),
  contact: (brand) => (
    <GenericPage brand={brand} eyebrowLabel="Say hello" eyebrowDot={OCEAN}
      headingLine1="We answer every"
      headingLine2="single email."
      subhead="It might take a day. It might take a week. But a real human will write back, every time."
      ctaHeading="Prefer a postcard?" ctaSubhead="We still answer those, too. Send to PO Box 14, Newport, OR."
      ctaPrimaryLabel="Email us" ctaPrimaryUrl={`mailto:hello@${brand.toLowerCase().replace(/\s+/g, '')}.co`} ctaSecondaryLabel="Browse the journal" ctaSecondaryUrl="#blog" />
  ),
  blog: (brand) => (
    <GenericPage brand={brand} eyebrowLabel="The journal" eyebrowDot={SAGE}
      headingLine1="Letters, recipes,"
      headingLine2="and small noticings."
      subhead="A growing archive of every Sunday Letter and Monthly Ritual we've ever sent."
      ctaHeading="Get the next one in your inbox." ctaPrimaryLabel="Subscribe free" ctaPrimaryUrl="#subscribe" ctaSecondaryLabel="Browse the archive" ctaSecondaryUrl="#archive" />
  ),
  blog_post: (brand) => (
    <GenericPage brand={brand} eyebrowLabel="Sunday letter · No. 47" eyebrowDot={TERRA}
      headingLine1="On the long walk"
      headingLine2="back to slowness."
      subhead="There's a particular tiredness that only comes from running too fast through a season that wanted to be savored."
      ctaHeading="Liked this letter?" ctaPrimaryLabel="Get the next one" ctaPrimaryUrl="#subscribe" ctaSecondaryLabel="Read more letters" ctaSecondaryUrl="#archive" />
  ),
  thank_you: (brand) => (
    <GenericPage brand={brand} eyebrowLabel="A small thank you" eyebrowDot={SAGE}
      headingLine1="You're in."
      headingLine2="Welcome aboard."
      subhead="Your first Sunday Letter will land this weekend. Until then — go take a slow walk."
      ctaHeading="While you wait..." ctaPrimaryLabel="Read a past letter" ctaPrimaryUrl="#archive" ctaSecondaryLabel="Meet the makers" ctaSecondaryUrl="#about" />
  ),
  '404': (brand) => (
    <GenericPage brand={brand} eyebrowLabel="Lost at sea" eyebrowDot={OCEAN}
      headingLine1="404 —"
      headingLine2="this page drifted off."
      subhead="The page you were looking for has wandered off somewhere quieter. Happens to the best of us."
      ctaHeading="Let's get you back." ctaPrimaryLabel="Back to the shore" ctaPrimaryUrl="/" ctaSecondaryLabel="Say hello instead" ctaSecondaryUrl="/contact" />
  ),
};

const ALL_PAGES: PageKey[] = ['index', 'about', 'page', 'contact', 'blog', 'blog_post', 'thank_you', '404'];

export const coastalCalmTemplate: TemplateDef = {
  id: 'coastal-calm',
  label: 'Coastal Calm',
  description: 'Warm sandy gradients, heavy serif headlines, soft pastel accents — slow-living vibe.',
  pageKeys: ALL_PAGES,
  imageSlots: IMAGE_SLOTS,
  fonts: { heading: 'Fraunces', body: 'Inter' },
  buildPages: (site: Site, images = {}) => {
    const out: Record<string, ReactNode> = {};
    for (const key of ALL_PAGES) {
      if (site.pages[key]?.enabled === false) continue;
      out[key] = PAGE_BUILDERS[key](site.brandName, images);
    }
    return out;
  },
  renderPage: (site: Site, page: PageKey, images = {}) =>
    PAGE_BUILDERS[page](site.brandName, images),
};