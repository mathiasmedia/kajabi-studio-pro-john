/**
 * Calm Ledger template — "The Calm Ledger" financial education brand.
 *
 * Aesthetic: clean, calm, premium, trustworthy. Soft neutrals, muted sage,
 * warm beige, cream, refined typography, rounded edges, generous white space.
 *
 * Page architecture (per `mem://reference/kajabi-page-creation.md`):
 *
 *   System pages:
 *     index      → Home (overview hub)
 *     about      → About + founder story
 *     contact    → Contact page
 *     blog       → Journal hub
 *     blog_post  → Sample journal post
 *     thank_you  → Post-opt-in thank you
 *     404        → Lost-page screen
 *
 *   Custom pages (emitted as `templates/<name>.liquid` + `content_for_<name>`):
 *     signature_method      → The Calm Business Money Method (signature program)
 *     monthly_money_office  → Monthly membership
 *     library               → Resource library
 *     podcast               → The Clear Money Studio podcast
 *
 * The `(page)` and `(sales_page)` system templates are intentionally NOT used.
 */
import type { ReactNode } from 'react';
import {
  HeaderSection,
  ContentSection,
  FooterSection,
  RawSection,
  Image,
  Logo,
  Menu,
  Text,
  Feature,
  Copyright,
  Accordion,
  PricingCard,
  Form,
  LinkList,
  SocialIcons,
} from '@/blocks';
import type { Site, PageKey } from '@/lib/siteStore';
import type { SiteImage } from '@/lib/imageStore';
import type { TemplateDef, ImageSlotDef } from '@/lib/templates';

// ---------- image slots ----------

const IMAGE_SLOTS: ImageSlotDef[] = [
  { key: 'homeHero',       label: 'Home hero',           description: 'Side image in the homepage hero.', defaultPrompt: 'Bright minimal home office, laptop and notebook, soft daylight, neutral palette',           aspect: '4:3' },
  { key: 'homeMentor',     label: 'Home mentor',         description: 'Section showing mentor with client.', defaultPrompt: 'Calm female mentor reviewing notes with a client, sage and cream wardrobe, daylight',     aspect: '4:3' },
  { key: 'homeFlatlay',    label: 'Home flat lay',       description: 'Featured free resource section.',     defaultPrompt: 'Top-down flat lay of office tools on linen, sage and beige palette',                      aspect: '1:1' },
  { key: 'aboutPortrait',  label: 'About portrait',      description: 'Founder portrait on About page.',     defaultPrompt: 'Warm professional portrait of female founder in a cream sweater, neutral studio',         aspect: '3:4' },
  { key: 'aboutLifestyle', label: 'About lifestyle',     description: 'Secondary About lifestyle photo.',    defaultPrompt: 'Founder at a simple desk with notebook, plants behind, natural light',                    aspect: '4:3' },
  { key: 'freebie',        label: 'Freebie hero',        description: 'Used on opt-in section.',             defaultPrompt: 'Minimal weekly checklist clipboard with coffee and laptop, neutral premium styling',     aspect: '4:3' },
  { key: 'signature',      label: 'Signature program',   description: 'Hero on signature sales page.',       defaultPrompt: 'Premium online course mockup with workbook and laptop dashboard, sage and cream',         aspect: '16:9' },
  { key: 'membership',     label: 'Membership',          description: 'Membership section image.',           defaultPrompt: 'Cozy virtual coworking, laptop and tea, leather planner, warm afternoon light',           aspect: '4:3' },
  { key: 'podcast',        label: 'Podcast',             description: 'Podcast section image.',              defaultPrompt: 'Stylish podcast microphone on a clean desk, warm neutral styling, daylight',              aspect: '4:3' },
];

// ---------- design tokens ----------

const SERIF = `'Cormorant Garamond', 'Playfair Display', Georgia, serif`;
const SANS  = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const INK       = '#1F2A24';   // deep ink text
const BODY      = '#5F665F';   // warm gray body
const CREAM     = '#FBF8F2';   // page bg
const CREAM_2   = '#F4EFE5';   // alt section bg
const WHITE_PANEL = '#FFFFFF';
const SAGE      = '#9DB29A';   // signature muted green
const SAGE_DEEP = '#6F8A74';
const SAGE_SOFT = '#E3EBDF';   // pale sage panel
const BEIGE     = '#E8DCC4';   // warm beige accent
const GOLD      = '#C7A87C';   // premium gold accent (used sparingly)

const PILL_PRIMARY  = `linear-gradient(135deg, ${SAGE_DEEP} 0%, #5C7763 100%)`;

// ---------- inline HTML helpers ----------

function pillCta(opts: {
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  align?: 'left' | 'center';
}) {
  const justify = opts.align === 'left' ? 'flex-start' : 'center';
  return `
    <div style="display:flex;gap:12px;justify-content:${justify};flex-wrap:wrap;margin-top:32px">
      <a href="${opts.primaryUrl}" style="display:inline-flex;align-items:center;gap:8px;background:${PILL_PRIMARY};color:#FFFFFF;padding:15px 30px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS};box-shadow:0 6px 18px rgba(111,138,116,0.32);letter-spacing:0.01em">
        ${opts.primaryLabel}<span style="font-size:14px">→</span>
      </a>
      ${opts.secondaryLabel ? `
      <a href="${opts.secondaryUrl ?? '#'}" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:${INK};padding:15px 30px;border:1.5px solid rgba(31,42,36,0.18);border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">
        ${opts.secondaryLabel}
      </a>` : ''}
    </div>`;
}

function eyebrow(label: string, dotColor = SAGE) {
  return `<span style="display:inline-flex;align-items:center;gap:10px;font-family:${SANS};font-size:12px;font-weight:600;color:${BODY};letter-spacing:0.16em;text-transform:uppercase">
    <span style="display:inline-block;width:24px;height:1px;background:${dotColor}"></span>
    ${label}
  </span>`;
}

function quietTile(svg: string) {
  return `<div style="width:48px;height:48px;background:${SAGE_SOFT};border-radius:14px;display:inline-flex;align-items:center;justify-content:center;color:${SAGE_DEEP};margin-bottom:22px">${svg}</div>`;
}

const ICON_LEAF = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.5 2c.5 2.5.02 4.5-1.1 6.9C15.7 14.4 11 13 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>`;
const ICON_CHART = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-7"/></svg>`;
const ICON_CALENDAR = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
const ICON_HEART = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const ICON_BOOK = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M4 19.5V22h16"/></svg>`;
const ICON_USERS = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const ICON_MIC = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></svg>`;
const ICON_CHECK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// ---------- shared chrome ----------

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'The Method', url: '/signature-method' },
  { label: 'Membership', url: '/monthly-money-office' },
  { label: 'Library', url: '/library' },
  { label: 'Podcast', url: '/podcast' },
  { label: 'Journal', url: '/blog' },
  { label: 'Contact', url: '/contact' },
];

function SharedHeader({ brand }: { brand: string }) {
  return (
    <HeaderSection
      background={CREAM}
      textColor={INK}
      sticky
      stickyBackgroundColor={CREAM}
      stickyTextColor={INK}
      paddingDesktop={{ top: '24', bottom: '24' }}
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
      paddingDesktop={{ top: '72', bottom: '40' }}
      verticalLayout
    >
      <Logo type="text" text={brand} textColor="#FFFFFF" />
      <LinkList heading="Learn" handle="footer-learn" layout="vertical" />
      <LinkList heading="Company" handle="footer-company" layout="vertical" />
      <SocialIcons instagram="https://instagram.com" linkedin="https://linkedin.com" />
      <Copyright text={`${brand}. Calm money, clear business.`} />
    </FooterSection>
  );
}

// ---------- HOME PAGE ----------

function HomePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.homeHero;
  const mentor = images.homeMentor;

  return (
    <>
      <SharedHeader brand={brand} />

      {/* Hero — split layout */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Money support for creative business owners')}
            <h1 style="font-family:${SERIF};font-size:72px;line-height:1.04;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              More clarity.<br/><em style="color:${SAGE_DEEP};font-weight:500">Less chaos.</em><br/>A calmer way to grow.
            </h1>
            <p style="max-width:520px;margin:28px 0 0;font-size:18px;line-height:1.7;color:${BODY}">
              ${brand} helps you organize your business finances, understand your numbers, and build simple systems that make money feel manageable.
            </p>
            ${pillCta({ primaryLabel: 'Visit the free library', primaryUrl: '/library', secondaryLabel: 'Explore the Method', secondaryUrl: '/signature-method', align: 'left' })}
          </div>`}
        />
        {hero && (
          <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />
        )}
      </ContentSection>

      {/* Reassurance band */}
      <ContentSection background={SAGE_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow('A gentle reminder', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.15;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              You're not <em style="color:${SAGE_DEEP}">bad at money.</em><br/>You just need a better system.
            </h2>
            <p style="max-width:580px;margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY}">
              Most creative business owners weren't taught how to handle money. The avoidance, the late-night spreadsheet panic, the guilt — none of it means anything is wrong with you. It just means it's time for a calmer approach.
            </p>
          </div>`}
        />
      </ContentSection>

      {/* Offers overview */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 64px">
            ${eyebrow('Ways we work together')}
            <h2 style="font-family:${SERIF};font-size:52px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Five steady doors in.
            </h2>
            <p style="margin:18px auto 0;font-size:17px;line-height:1.65;color:${BODY};max-width:520px">Pick the level of support that fits your season — they all lead to the same calm, organized place.</p>
          </div>`}
        />
        <Feature width="4" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${quietTile(ICON_LEAF)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Free</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">7-Minute Weekly Money Reset</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">A simple weekly routine to feel in control. Free download.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${quietTile(ICON_CHART)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Mini course · $47</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Cash Flow Clarity</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Map your cash in and out in under two hours. A self-paced primer.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${quietTile(ICON_BOOK)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Signature program</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Calm Business Money Method</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Six modules to build a calm, repeatable money system for your business.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${quietTile(ICON_USERS)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Membership · monthly</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Monthly Money Office</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Ongoing support: monthly Q&amp;A calls, planning templates, and a quiet member space.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${quietTile(ICON_HEART)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">1:1 consulting · by application</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Private Money Clarity Intensives</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Two private sessions to untangle the specifics of your business — pricing, pay, profit.</p>`}
        />
      </ContentSection>

      {/* Transformation */}
      <ContentSection background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        {mentor && <Image src={mentor.url} alt={mentor.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('What changes', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              From <em style="color:${SAGE_DEEP}">money avoidance</em><br/>to quiet confidence.
            </h2>
            <ul style="list-style:none;padding:0;margin:32px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'You know what to look at every week — and what you can let go of.',
                'You stop guessing whether you can afford something.',
                'You pay yourself on a real, predictable schedule.',
                'Tax season stops being a panic and starts being a calendar event.',
                'You make business decisions with your numbers in front of you, not your fears.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${SAGE_DEEP};margin-top:3px;flex-shrink:0">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      {/* Founder intro */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto">
            ${eyebrow('Meet your guide')}
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Hi, I'm <em style="color:${SAGE_DEEP}">Maya Rowan</em>.
            </h2>
            <p style="max-width:560px;margin:26px auto 0;font-size:17px;line-height:1.75;color:${BODY}">
              I'm a former operations manager who became a financial educator because I kept watching brilliant business owners feel ashamed of money — when really, no one had ever taught them a calm, clear way to handle it. ${brand} is what I built so my clients could stop white-knuckling the numbers and start running steady, healthy businesses.
            </p>
            <div style="margin-top:32px"><a href="/about" style="font-family:${SANS};font-size:14px;font-weight:600;color:${SAGE_DEEP};text-decoration:underline;text-underline-offset:6px">Read the full story →</a></div>
          </div>`}
        />
      </ContentSection>

      {/* Testimonials */}
      <ContentSection background={SAGE_SOFT} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Notes from clients', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Calmer money, in their own words.
            </h2>
          </div>`}
        />
        <Text width="4" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"For the first time in five years of business, I know what's in my account and why. It's almost embarrassing how much calmer I feel."</p><div style="font-weight:700;font-size:14px;color:${INK}">Lena O. · Brand designer</div></div>`}
        />
        <Text width="4" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"Maya gave me language for the avoidance I'd been carrying for years. The weekly reset alone changed my whole relationship with money."</p><div style="font-weight:700;font-size:14px;color:${INK}">Jordan T. · Photographer</div></div>`}
        />
        <Text width="4" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"I finally pay myself on a real schedule. I save for taxes without dread. The Method is the calmest financial education I've ever experienced."</p><div style="font-weight:700;font-size:14px;color:${INK}">Priya S. · Business coach</div></div>`}
        />
      </ContentSection>

      {/* Explore the corners — overview hub linking to dedicated pages */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Explore the corners', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              A few quiet doors in.
            </h2>
            <p style="margin:18px auto 0;font-size:17px;line-height:1.65;color:${BODY};max-width:520px">Pick the room that fits your season — every door leads back to the same calm place.</p>
          </div>`}
        />
        <Feature width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '36', bottom: '36', left: '34', right: '34' }} boxShadow="small"
          text={`${quietTile(ICON_BOOK)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Signature program</div><h3 style="font-family:${SERIF};font-size:28px;font-weight:600;color:${INK};margin:0 0 12px">The Calm Business Money Method</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0 0 18px">Six modules to build a calm, repeatable money system for your business.</p><a href="/signature-method" style="font-family:${SANS};font-size:14px;font-weight:600;color:${SAGE_DEEP};text-decoration:none">See what's inside →</a>`}
        />
        <Feature width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '36', bottom: '36', left: '34', right: '34' }} boxShadow="small"
          text={`${quietTile(ICON_USERS)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Membership</div><h3 style="font-family:${SERIF};font-size:28px;font-weight:600;color:${INK};margin:0 0 12px">The Monthly Money Office</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0 0 18px">A calm monthly room — Q&amp;A calls, planning templates, and steady peer support.</p><a href="/monthly-money-office" style="font-family:${SANS};font-size:14px;font-weight:600;color:${SAGE_DEEP};text-decoration:none">Visit the office →</a>`}
        />
        <Feature width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '36', bottom: '36', left: '34', right: '34' }} boxShadow="small"
          text={`${quietTile(ICON_LEAF)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Library</div><h3 style="font-family:${SERIF};font-size:28px;font-weight:600;color:${INK};margin:0 0 12px">The Calm Ledger Library</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0 0 18px">Free worksheets, templates, mini-courses, and the weekly money reset — all in one place.</p><a href="/library" style="font-family:${SANS};font-size:14px;font-weight:600;color:${SAGE_DEEP};text-decoration:none">Browse the library →</a>`}
        />
        <Feature width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '36', bottom: '36', left: '34', right: '34' }} boxShadow="small"
          text={`${quietTile(ICON_MIC)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Podcast</div><h3 style="font-family:${SERIF};font-size:28px;font-weight:600;color:${INK};margin:0 0 12px">The Clear Money Studio</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0 0 18px">Honest weekly conversations on money mindset, business systems, and calm growth.</p><a href="/podcast" style="font-family:${SANS};font-size:14px;font-weight:600;color:${SAGE_DEEP};text-decoration:none">Browse episodes →</a>`}
        />
      </ContentSection>

      {/* Final CTA */}
      <ContentSection background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '120', bottom: '120' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <span style="display:inline-flex;align-items:center;gap:10px;font-family:${SANS};font-size:12px;font-weight:600;color:rgba(255,255,255,0.78);letter-spacing:0.16em;text-transform:uppercase"><span style="display:inline-block;width:24px;height:1px;background:rgba(255,255,255,0.6)"></span>Ready when you are</span>
            <h2 style="font-family:${SERIF};font-size:64px;line-height:1.05;font-weight:500;color:#FFFFFF;margin:18px auto 0;max-width:780px;letter-spacing:-0.015em">
              A calmer relationship with money<br/><em style="color:${BEIGE}">starts with one small step.</em>
            </h2>
            <p style="max-width:520px;margin:24px auto 0;font-size:17px;line-height:1.7;color:rgba(255,255,255,0.85)">Grab a free worksheet from the library, take seven quiet minutes, and see what shifts. We'll be here when you're ready for more.</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px">
              <a href="/library" style="display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;color:${INK};padding:15px 30px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Visit the free library <span>→</span></a>
              <a href="/signature-method" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:#FFFFFF;padding:15px 30px;border:1.5px solid rgba(255,255,255,0.4);border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Explore the Method</a>
            </div>
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- ABOUT ----------

function AboutPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const portrait = images.aboutPortrait;
  const lifestyle = images.aboutLifestyle;
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('About the founder')}
            <h1 style="font-family:${SERIF};font-size:68px;line-height:1.05;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              I built ${brand}<br/><em style="color:${SAGE_DEEP}">because so many of us</em> were never taught.
            </h1>
            <p style="max-width:520px;margin:26px 0 0;font-size:18px;line-height:1.75;color:${BODY}">
              I'm Maya Rowan. For ten years I ran operations for creative agencies — building the spreadsheets and systems that kept smart, talented people from drowning in their own success. The pattern was always the same: brilliant work, anxious money. Nobody had taught them otherwise.
            </p>
          </div>`}
        />
        {portrait && <Image src={portrait.url} alt={portrait.alt} colWidth="5" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="left" width="12"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto;color:${BODY};font-size:18px;line-height:1.85">
            <p>${brand} is not a CPA firm and I'm not your accountant. I'm a financial educator and business systems guide — the person you talk to before you call the bookkeeper. My job is to help you build a calm money rhythm, understand your numbers without dread, and make decisions from a steady place.</p>
            <p style="margin-top:22px">I work mostly with creatives, freelancers, coaches, designers, photographers, and online business owners. The kind of people who do beautiful work and feel a little nauseous every time they open their banking app. That's exactly who this brand is for.</p>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 56px">
            ${eyebrow('What I believe', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A few quiet beliefs about money.</h2>
          </div>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Money work is mostly nervous-system work.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">If looking at your numbers makes you flinch, no spreadsheet template will fix it. We start by lowering the volume.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Your business should pay you.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">Predictably. On a schedule. In a way that feels like a job, not a tip jar. We build that on purpose.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Simple systems beat fancy ones.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">A boring routine you'll actually do is worth more than the most beautiful dashboard you'll abandon.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Calm is a competitive advantage.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">Anxious decisions cost money. Steady ones compound. We're playing the long game on purpose.</p>`}
        />
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '90', bottom: '90' }}>
        {lifestyle && <Image src={lifestyle.url} alt={lifestyle.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:0;letter-spacing:-0.01em">A few small things about me.</h2>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:14px;font-size:16px;line-height:1.6;color:${INK}">
              <li>· I keep a paper money journal. It's not aesthetic. It's just what works.</li>
              <li>· I drink the same oat-milk latte every morning at 7:14am.</li>
              <li>· I've been a CFO for a five-figure side hustle and an eight-figure agency. Same anxieties, different decimals.</li>
              <li>· I believe boring routines are an act of self-respect.</li>
            </ul>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:52px;line-height:1.08;font-weight:500;color:#FFFFFF;margin:0;letter-spacing:-0.015em">Want to start somewhere small?</h2>
            <p style="max-width:520px;margin:22px auto 0;font-size:17px;line-height:1.7;color:rgba(255,255,255,0.85)">Take seven quiet minutes with the free reset. It's the gentlest way in.</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px">
              <a href="/library" style="display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;color:${INK};padding:15px 30px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Get the free reset →</a>
              <a href="/signature-method" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:#FFFFFF;padding:15px 30px;border:1.5px solid rgba(255,255,255,0.4);border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Explore the Method</a>
            </div>
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- SIGNATURE METHOD (custom page: signature_method) ----------

function SignatureMethodPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.signature;
  const modules = [
    { n: '01', t: 'Money Mindset Without Shame', d: 'Disarm the avoidance. Build a steady, kind relationship with your numbers — without forcing it.' },
    { n: '02', t: 'Your Weekly Money Rhythm', d: 'Install the seven-minute weekly check-in that ends late-night spreadsheet panic for good.' },
    { n: '03', t: 'Cash Flow Made Simple', d: 'Map money in and money out so you can see what\'s coming, what\'s leaving, and what\'s safe to spend.' },
    { n: '04', t: 'Paying Yourself Clearly', d: 'Set a real owner\'s pay schedule that matches your business — and actually stick to it.' },
    { n: '05', t: 'Planning for Taxes and Profit', d: 'A calm system for tax savings and profit-first allocation. No more April surprises.' },
    { n: '06', t: 'CEO Money Decisions', d: 'How to weigh hires, pricing, investments, and big calls from a steady, informed place.' },
  ];
  const faqs = [
    { q: 'Do I need to be good at math or spreadsheets?', a: 'Nope. The Method is built for creative business owners who actively dislike spreadsheets. We use simple worksheets and clear rituals — no advanced math required.' },
    { q: 'Is this bookkeeping or accounting?', a: 'Neither. The Method teaches you to understand and use your numbers; your bookkeeper or accountant still handles the technical filings. Most clients say the Method actually makes their bookkeeper\'s job easier.' },
    { q: 'How long does the program take?', a: 'Most students move through it in 8–10 weeks at a calm pace. Lifetime access is included, so you can revisit any module whenever a new business question pops up.' },
    { q: 'What if I\'m brand new to business?', a: 'Welcome — this is a beautiful place to start. The earlier you build a calm money rhythm, the easier everything that follows becomes.' },
    { q: 'Is there a payment plan?', a: 'Yes. Three monthly installments, no interest. Pick the option that feels easiest at checkout.' },
    { q: 'What\'s your refund policy?', a: 'A 14-day no-questions-back guarantee. Try Module 1, see how it feels, and if it isn\'t for you, we\'ll refund you fully.' },
  ];
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:820px;margin:0 auto">
            ${eyebrow('Signature program')}
            <h1 style="font-family:${SERIF};font-size:78px;line-height:1.04;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">
              The Calm Business<br/><em style="color:${SAGE_DEEP}">Money Method.</em>
            </h1>
            <p style="max-width:580px;margin:26px auto 0;font-size:18px;line-height:1.7;color:${BODY}">
              A six-module program to help you build a calm, repeatable money system — so you can stop guessing, stop avoiding, and start making confident decisions in your business.
            </p>
            ${pillCta({ primaryLabel: 'Enroll in the Method', primaryUrl: '#enroll', secondaryLabel: 'See what\'s inside', secondaryUrl: '#modules' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="10" imageBorderRadius="28" align="center" />}
      </ContentSection>

      {/* Problem agitation */}
      <ContentSection background={CREAM_2} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow('If any of this sounds familiar', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">You don't need to try harder.<br/><em style="color:${SAGE_DEEP}">You need a calmer system.</em></h2>
          </div>`}
        />
        <Feature width="4" align="left" backgroundColor={WHITE_PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }}
          text={`<p style="font-family:${SERIF};font-size:18px;line-height:1.5;color:${INK};margin:0;font-style:italic">"I never know how much I can actually pay myself this month."</p>`}
        />
        <Feature width="4" align="left" backgroundColor={WHITE_PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }}
          text={`<p style="font-family:${SERIF};font-size:18px;line-height:1.5;color:${INK};margin:0;font-style:italic">"I dread looking at my business bank account."</p>`}
        />
        <Feature width="4" align="left" backgroundColor={WHITE_PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }}
          text={`<p style="font-family:${SERIF};font-size:18px;line-height:1.5;color:${INK};margin:0;font-style:italic">"Every tax season feels like a small emergency."</p>`}
        />
      </ContentSection>

      {/* Promise */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:740px;margin:0 auto">
            ${eyebrow('The promise')}
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">In eight weeks,<br/>your business <em style="color:${SAGE_DEEP}">runs on a rhythm.</em></h2>
            <p style="max-width:560px;margin:24px auto 0;font-size:17px;line-height:1.75;color:${BODY}">You'll have a weekly check-in you actually do, an owner's pay schedule that holds, a tax savings system on autopilot, and the quiet confidence to make business decisions from data instead of dread.</p>
          </div>`}
        />
      </ContentSection>

      {/* Modules */}
      <ContentSection id="modules" background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Inside the Method', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Six calm modules.</h2>
          </div>`}
        />
        {modules.map((m) => (
          <Feature key={m.n} width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="20" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
            text={`<div style="font-family:${SANS}"><div style="font-family:${SERIF};font-size:36px;font-weight:500;color:${SAGE_DEEP};line-height:1;margin-bottom:14px">${m.n}</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 10px">${m.t}</h3><p style="font-size:15px;line-height:1.65;color:${BODY};margin:0">${m.d}</p></div>`}
          />
        ))}
      </ContentSection>

      {/* Who it's for */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Who this is for', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A calm fit for…</h2>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:12px;font-size:16px;line-height:1.55;color:${INK}">
              ${['Creative business owners earning $30k–$500k a year','Freelancers, designers, photographers, coaches, consultants','Founders who feel behind on the money side and want a kinder way in','Anyone tired of \"hustle harder\" advice'].map(t => `<li style="display:flex;gap:10px;align-items:flex-start"><span style="color:${SAGE_DEEP};margin-top:3px">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:24px">
            ${eyebrow('And probably not for…', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A gentler no.</h2>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:12px;font-size:16px;line-height:1.55;color:${BODY}">
              <li>· VC-backed startups — your money story is different.</li>
              <li>· Anyone looking for tax filing, audit, or formal CPA work.</li>
              <li>· Folks who want a quick-fix or get-rich approach. We're playing long.</li>
            </ul>
          </div>`}
        />
      </ContentSection>

      {/* Pricing */}
      <ContentSection background={SAGE_SOFT} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Investment', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Two calm ways in.</h2>
          </div>`}
        />
        <PricingCard width="6" heading="Pay in full" name="Best value" price="$1,200"
          text={`<div style="font-family:${SANS};text-align:left;color:${BODY};font-size:15px;line-height:1.7"><p style="margin:0 0 12px;font-weight:600;color:${INK}">Everything included:</p><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px"><li>· All six modules · lifetime access</li><li>· Workbooks, templates, and worksheets</li><li>· Quarterly group office hours for a year</li><li>· Member community access</li></ul></div>`}
          buttonText="Enroll · pay in full" buttonUrl="#enroll" buttonBackgroundColor={SAGE_DEEP} buttonTextColor="#FFFFFF"
          highlight brandColor={SAGE_DEEP} backgroundColor={WHITE_PANEL} borderRadius="22"
        />
        <PricingCard width="6" heading="3 monthly payments" price="$420 / mo"
          text={`<div style="font-family:${SANS};text-align:left;color:${BODY};font-size:15px;line-height:1.7"><p style="margin:0 0 12px;font-weight:600;color:${INK}">Same calm program:</p><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px"><li>· All six modules · lifetime access</li><li>· Workbooks, templates, and worksheets</li><li>· Quarterly group office hours for a year</li><li>· Member community access</li></ul></div>`}
          buttonText="Enroll · 3 payments" buttonUrl="#enroll" buttonBackgroundColor="#FFFFFF" buttonTextColor={INK}
          backgroundColor={WHITE_PANEL} borderRadius="22"
        />
      </ContentSection>

      {/* FAQ */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:640px;margin:0 auto 48px">
            ${eyebrow('Questions answered', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A few honest answers.</h2>
          </div>`}
        />
        {faqs.map((f, i) => (
          <Accordion key={i} width="12" heading={f.q} body={`<p style="font-family:${SANS};color:${BODY};font-size:15px;line-height:1.7;margin:0">${f.a}</p>`} />
        ))}
      </ContentSection>

      {/* Final CTA */}
      <ContentSection background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:#FFFFFF;margin:0;letter-spacing:-0.015em">Ready for a calmer business?</h2>
            <p style="max-width:520px;margin:22px auto 0;font-size:17px;line-height:1.7;color:rgba(255,255,255,0.85)">Enroll today and start Module 1 this Sunday with your first weekly reset.</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px">
              <a href="#enroll" style="display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;color:${INK};padding:15px 30px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Enroll in the Method →</a>
              <a href="/contact" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:#FFFFFF;padding:15px 30px;border:1.5px solid rgba(255,255,255,0.4);border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Ask a question first</a>
            </div>
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- CONTACT ----------

function ContactPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('Get in touch')}
            <h1 style="font-family:${SERIF};font-size:68px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">A real person<br/><em style="color:${SAGE_DEEP}">reads every note.</em></h1>
            <p style="max-width:520px;margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY}">Whether you have a question about a program, a private consulting inquiry, or just want to say hello — drop a note below. We answer within two business days.</p>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '70', bottom: '90' }}>
        <Form width="8" formId="" buttonBackgroundColor={SAGE_DEEP} buttonTextColor="#FFFFFF" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '40', bottom: '40', left: '40', right: '40' }}
          heading="Send us a note"
          text={`<div style="font-family:${SANS};color:${BODY};font-size:14px;line-height:1.6;text-align:left;margin-bottom:8px"><p style="margin:0 0 4px;font-weight:600;color:${INK}">What's it about?</p><p style="margin:0">General question · Program support · Speaking request · Private consulting</p></div>`}
        />
      </ContentSection>

      <ContentSection background={CREAM} paddingDesktop={{ top: '70', bottom: '110' }}>
        <Feature width="4" align="left" backgroundColor={SAGE_SOFT} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }}
          text={`<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Program support</h3><p style="font-family:${SANS};font-size:14px;line-height:1.65;color:${BODY};margin:0">Already inside The Method or a member of The Office? Email <strong style="color:${INK}">support@</strong> and we'll route you fast.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={SAGE_SOFT} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }}
          text={`<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Speaking &amp; press</h3><p style="font-family:${SANS};font-size:14px;line-height:1.65;color:${BODY};margin:0">Looking to feature Maya on a podcast, panel, or stage? We'd love to hear about your audience.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={SAGE_SOFT} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }}
          text={`<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Private consulting</h3><p style="font-family:${SANS};font-size:14px;line-height:1.65;color:${BODY};margin:0">Money Clarity Intensives are by application. Tell us a little about your business and the question you're sitting with.</p>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- BLOG / JOURNAL ----------
//
// Per `mem://reference/dynamic-kajabi-content.md`: the blog index and blog_post
// pages are rendered DYNAMICALLY by Kajabi. We never hardcode post titles,
// snippets, or bodies — Kajabi injects `{{ post.title }}`, `{{ post.content }}`,
// and the post listing automatically. Our job is only to wrap that dynamic
// content in branded chrome (header + footer + a thin intro/outro band).

function BlogPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />
      {/* Branded intro band — Kajabi appends the dynamic post listing below */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '70' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('The journal')}
            <h1 style="font-family:${SERIF};font-size:68px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">Calm essays on<br/><em style="color:${SAGE_DEEP}">money &amp; business.</em></h1>
            <p style="max-width:520px;margin:22px auto 0;font-size:17px;line-height:1.7;color:${BODY}">Short, honest pieces on money mindset, cash flow, business systems, pricing, and CEO habits. New letters posted weekly.</p>
          </div>`}
        />
      </ContentSection>

      {/*
        Kajabi's dynamic blog post listing renders here. The `blog_listings`
        section is a Kajabi-native section type — its layout, post cards,
        sidebar, and pagination come from the base theme. We pass branded
        settings (background, padding, accent colors) so it matches our chrome.
      */}
      <RawSection
        type="blog_listings"
        name="Blog Listings"
        previewLabel="Kajabi blog post listing (with sidebar)"
        settings={{
          bg_type: 'color',
          background_color: CREAM,
          bg_position: 'center',
          truncate: '',
          read_more: 'Continue reading →',
          show_date: 'true',
          show_tags: 'true',
          show_video: 'true',
          layout_style: 'list',
          show_content: 'false',
          color_read_more: SAGE_DEEP,
          background_fixed: 'false',
          sidebar_on_right: 'true',
          pagination_amount: '12',
          sidebar_on_bottom: 'true',
          show_sidebar_mobile: 'false',
          show_sidebar_desktop: 'true',
          color_pagination_default: SAGE_DEEP,
          color_pagination_disabled: '#cbd5e1',
          color_pagination_selected: INK,
          padding_desktop: { top: '60', right: '', bottom: '60', left: '' },
          padding_mobile: { top: '40', right: '', bottom: '40', left: '' },
        }}
        blocks={{
          sb_search: {
            type: 'sidebar_search',
            settings: {
              search_text: 'Search the journal…',
              search_icon_color: SAGE_DEEP,
              search_text_color: INK,
            },
          },
          sb_categories: {
            type: 'sidebar_categories',
            settings: {
              heading: 'Topics',
              all_tags: 'All topics',
              categories_layout: 'list',
              categories_text_align: 'left',
              color_categories_link: SAGE_DEEP,
              color_categories_heading: INK,
            },
          },
        }}
        blockOrder={['sb_search', 'sb_categories']}
      />

      {/* Branded outro — newsletter CTA */}
      <ContentSection background={SAGE_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:580px;margin:0 auto">
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:0;letter-spacing:-0.01em">Want the letters in your inbox?</h2>
            <p style="margin:18px auto 0;font-size:16px;line-height:1.7;color:${BODY}">Subscribe to The Calm Ledger letter — one short essay each Sunday. No noise.</p>
            ${pillCta({ primaryLabel: 'Subscribe free', primaryUrl: '#subscribe' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- BLOG POST ----------
//
// Kajabi renders the actual post (title, author, date, body) via Liquid on
// the blog_post template — `{{ post.title }}`, `{{ post.content }}`, etc.
// We provide ONLY the chrome: header, footer, and a closing newsletter band.
// No hardcoded post body.

function BlogPostPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />
      {/*
        The Kajabi `blog_post_body` section renders the dynamic post title,
        author, date, body, and sidebar. Branded settings keep the surrounding
        chrome consistent with the rest of the site.
      */}
      <RawSection
        type="blog_post_body"
        name="Blog Post Body"
        previewLabel="Kajabi blog post body (with sidebar)"
        settings={{
          bg_type: 'color',
          background_color: CREAM,
          bg_position: 'center',
          show_date: 'true',
          show_tags: 'true',
          header_on_top: 'true',
          background_fixed: 'false',
          sidebar_on_right: 'true',
          sidebar_on_bottom: 'true',
          show_sidebar_mobile: 'false',
          show_sidebar_desktop: 'true',
          padding_desktop: { top: '60', right: '', bottom: '60', left: '' },
          padding_mobile: { top: '40', right: '', bottom: '40', left: '' },
        }}
        blocks={{
          sb_search: {
            type: 'sidebar_search',
            settings: {
              search_text: 'Search the journal…',
              search_icon_color: SAGE_DEEP,
              search_text_color: INK,
            },
          },
          sb_categories: {
            type: 'sidebar_categories',
            settings: {
              heading: 'Topics',
              all_tags: 'All topics',
              categories_layout: 'list',
              categories_text_align: 'left',
              color_categories_link: SAGE_DEEP,
              color_categories_heading: INK,
            },
          },
        }}
        blockOrder={['sb_search', 'sb_categories']}
      />

      {/* Branded outro — appears below the dynamic post body */}
      <ContentSection background={SAGE_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto">
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:0;letter-spacing:-0.01em">Liked this letter?</h2>
            <p style="margin:18px auto 0;font-size:16px;line-height:1.7;color:${BODY}">Get the next one in your inbox — short, honest, weekly.</p>
            ${pillCta({ primaryLabel: 'Subscribe free', primaryUrl: '#subscribe', secondaryLabel: 'Browse the journal', secondaryUrl: '/blog' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- THANK YOU ----------

function ThankYouPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '120', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('You\'re all set', SAGE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:72px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">Thank you.<br/><em style="color:${SAGE_DEEP}">Take a slow breath.</em></h1>
            <p style="max-width:520px;margin:26px auto 0;font-size:18px;line-height:1.7;color:${BODY}">The 7-Minute Weekly Money Reset is on its way to your inbox right now. If you don't see it in five minutes, peek in your promotions or spam folder — and please mark it as not-spam so future letters land safely.</p>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '90', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 48px">
            ${eyebrow('While you wait', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A small next step, if you'd like one.</h2>
          </div>`}
        />
        <Feature width="12" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '40', bottom: '40', left: '40', right: '40' }} boxShadow="small"
          text={`<div style="display:flex;gap:32px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:280px">${quietTile(ICON_CHART)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:6px">Mini course · $47</div><h3 style="font-family:${SERIF};font-size:30px;font-weight:600;color:${INK};margin:0 0 12px">Cash Flow Clarity</h3><p style="font-family:${SANS};font-size:16px;line-height:1.7;color:${BODY};margin:0">If the weekly reset feels good, this is the natural next step. A two-hour self-paced course that maps your business cash in and out — so you always know what's safe to spend. Lifetime access.</p></div><div style="flex-shrink:0"><a href="#mini-course" style="display:inline-flex;align-items:center;gap:8px;background:${PILL_PRIMARY};color:#FFFFFF;padding:15px 30px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Try the mini course →</a></div></div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- 404 ----------

function NotFoundPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '140', bottom: '140' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto">
            ${eyebrow('Page not found', SAGE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:120px;line-height:1;font-weight:500;color:${SAGE_DEEP};margin:24px 0 0;letter-spacing:-0.03em">404</h1>
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:16px 0 0">A quiet detour.</h2>
            <p style="max-width:440px;margin:22px auto 0;font-size:17px;line-height:1.7;color:${BODY}">The page you were looking for has wandered off. No drama — let's get you somewhere useful.</p>
            ${pillCta({ primaryLabel: 'Back to home', primaryUrl: '/', secondaryLabel: 'Read the journal', secondaryUrl: '/blog' })}
          </div>`}
        />
      </ContentSection>
      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- MEMBERSHIP (custom page: monthly_money_office) ----------

function MembershipPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.membership;
  const perks = [
    { icon: ICON_CALENDAR, title: 'Monthly Q&A call',     body: 'A live, recorded session with Maya — bring your messy money question, leave with a calm next step.' },
    { icon: ICON_USERS,    title: 'A quiet member space', body: 'A small, ad-free private community of fellow business owners. Friendly accountability, no noise.' },
    { icon: ICON_BOOK,     title: 'Planning templates',   body: 'New worksheets and rhythms each quarter — owner pay calculators, tax savings trackers, simple dashboards.' },
    { icon: ICON_HEART,    title: 'Member-only workshops', body: 'Three deep-dive workshops a year on pricing, owner pay, and end-of-year planning.' },
  ];
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Ongoing membership')}
            <h1 style="font-family:${SERIF};font-size:68px;line-height:1.05;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              The Monthly<br/><em style="color:${SAGE_DEEP}">Money Office.</em>
            </h1>
            <p style="max-width:520px;margin:24px 0 0;font-size:18px;line-height:1.7;color:${BODY}">A calm members' space for business owners who want a steady money rhythm and a quiet group of peers to grow with. One small monthly investment, year-round support.</p>
            ${pillCta({ primaryLabel: 'Join the office · $39/mo', primaryUrl: '#join-mmo', secondaryLabel: 'See what\'s included', secondaryUrl: '#mmo-perks', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="5" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection id="mmo-perks" background={CREAM_2} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Inside the office', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">What you get every month.</h2>
          </div>`}
        />
        {perks.map((p, i) => (
          <Feature key={i} width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }} boxShadow="small"
            text={`${quietTile(p.icon)}<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">${p.title}</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">${p.body}</p>`}
          />
        ))}
      </ContentSection>

      <ContentSection background={SAGE_SOFT} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('From inside the office', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A calmer rhythm, together.</h2>
            <p style="font-family:${SERIF};font-size:22px;line-height:1.55;color:${INK};margin:32px auto 0;font-style:italic;font-weight:500;max-width:560px">"The monthly call alone is worth it. I never feel alone with my money questions anymore — and the templates have saved me hours every quarter."</p>
            <div style="margin-top:18px;font-family:${SANS};font-weight:700;font-size:14px;color:${INK}">Sasha M. · Studio owner, member since 2024</div>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:#FFFFFF;margin:0;letter-spacing:-0.015em">A steady room for the long haul.</h2>
            <p style="max-width:520px;margin:22px auto 0;font-size:17px;line-height:1.7;color:rgba(255,255,255,0.85)">$39 a month · cancel anytime · no contracts, no pressure.</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px">
              <a href="#join-mmo" style="display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;color:${INK};padding:15px 30px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Join the office →</a>
              <a href="/contact" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:#FFFFFF;padding:15px 30px;border:1.5px solid rgba(255,255,255,0.4);border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">Ask first</a>
            </div>
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- LIBRARY (Kajabi system page) ----------
//
// `library` is a Kajabi SYSTEM page that renders the member's purchased
// products dynamically. We keep that products grid intact by providing
// only branded chrome (header + intro + outro + footer). Do NOT add
// product cards or resource Feature blocks here — Kajabi injects the
// real product grid via its own `templates/library.liquid`.

function LibraryPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const flat = images.homeFlatlay;
  return (
    <>
      <SharedHeader brand={brand} />
      {/* Branded intro — Kajabi renders the dynamic product/resource grid below */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '70' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Your library')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.015em">
              The ${brand}<br/><em style="color:${SAGE_DEEP}">Library.</em>
            </h1>
            <p style="max-width:520px;margin:22px 0 0;font-size:18px;line-height:1.7;color:${BODY}">Everything you've joined, in one calm place. Your courses, worksheets, and resources are below.</p>
          </div>`}
        />
        {flat && <Image src={flat.url} alt={flat.alt} colWidth="5" imageBorderRadius="24" align="center" />}
      </ContentSection>

      {/*
        Kajabi's dynamic products/library grid (each member's purchased
        courses, downloads, and resources) renders here. We pass branded
        settings so card colors and CTAs match the rest of the site.
      */}
      <RawSection
        type="products"
        name="My Products"
        previewLabel="Kajabi member library — purchased products grid"
        settings={{
          again: 'Start course over',
          start: 'Start course',
          layout: '12',
          resume: 'Resume course',
          bg_type: 'color',
          bg_image: '',
          bg_video: '',
          btn_size: 'small',
          btn_text: 'Open',
          progress: 'true',
          box_shadow: 'small',
          text_align: 'left',
          bg_position: 'center',
          border_type: 'none',
          border_color: '',
          border_width: '1',
          equal_height: 'true',
          text_heading: 'Your library',
          border_radius: '20',
          btn_text_color: '#FFFFFF',
          progress_color: SAGE_DEEP,
          color_body_text: BODY,
          background_color: CREAM,
          background_fixed: 'false',
          color_title_text: INK,
          btn_border_radius: '999',
          pagination_amount: '12',
          show_product_body: 'true',
          color_heading_text: INK,
          btn_background_color: PILL_PRIMARY,
          truncate_product_body: '160',
          show_resume_course_cta: 'true',
          color_pagination_default: SAGE_DEEP,
          product_background_color: WHITE_PANEL,
          resume_course_box_shadow: 'small',
          color_pagination_disabled: '#cbd5e1',
          color_pagination_selected: INK,
          resume_course_border_type: 'none',
          resume_course_title_color: INK,
          resume_course_border_color: '',
          resume_course_border_width: '1',
          resume_course_status_color: SAGE_DEEP,
          resume_course_border_radius: '20',
          resume_course_background_color: WHITE_PANEL,
          padding_desktop: { top: '70', right: '', bottom: '90', left: '' },
          padding_mobile: { top: '40', right: '', bottom: '60', left: '' },
        }}
      />

      {/* Branded outro */}
      <ContentSection background={SAGE_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:580px;margin:0 auto">
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:0;letter-spacing:-0.01em">Want new resources as we publish them?</h2>
            <p style="margin:18px auto 0;font-size:16px;line-height:1.7;color:${BODY}">Join the weekly letter — every Sunday, one short essay and (when relevant) a fresh worksheet.</p>
            ${pillCta({ primaryLabel: 'Subscribe free', primaryUrl: '#subscribe' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- PODCAST (custom page: podcast) ----------

function PodcastPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.podcast;
  const episodes = [
    { num: 'Ep 048', title: 'On the quiet shame most business owners carry about money',     guest: 'Solo · Maya',           length: '32 min' },
    { num: 'Ep 047', title: 'Pricing from a steady place — a conversation with Eli Park',     guest: 'with Eli Park',         length: '46 min' },
    { num: 'Ep 046', title: 'A real owner-pay schedule (and how to actually keep it)',         guest: 'Solo · Maya',           length: '28 min' },
    { num: 'Ep 045', title: 'When to hire, when to wait — calm CEO decision-making',           guest: 'with Priya Shah',       length: '54 min' },
    { num: 'Ep 044', title: 'The quarterly review that ends April-tax dread',                  guest: 'Solo · Maya',           length: '24 min' },
    { num: 'Ep 043', title: 'Money mindset is mostly nervous-system work',                      guest: 'with Dr. Lia Reyes',    length: '49 min' },
  ];
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('The podcast')}
            <h1 style="font-family:${SERIF};font-size:68px;line-height:1.05;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              The Clear<br/><em style="color:${SAGE_DEEP}">Money Studio.</em>
            </h1>
            <p style="max-width:520px;margin:24px 0 0;font-size:18px;line-height:1.7;color:${BODY}">Honest weekly conversations on money mindset, business systems, sustainable growth, pricing, owner pay, and calm routines for creative entrepreneurs. New episodes every Wednesday.</p>
            ${pillCta({ primaryLabel: 'Listen on Apple', primaryUrl: '#apple', secondaryLabel: 'Listen on Spotify', secondaryUrl: '#spotify', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="5" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '90', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 48px">
            ${eyebrow('Latest episodes', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Recent conversations.</h2>
          </div>`}
        />
        {episodes.map((e, i) => (
          <Feature key={i} width="6" align="left" backgroundColor={WHITE_PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
            text={`<div style="font-family:${SANS}"><div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><span style="font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.14em;text-transform:uppercase">${e.num}</span><span style="font-size:12px;color:${BODY}">· ${e.length}</span></div><h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px;line-height:1.3">${e.title}</h3><p style="font-size:14px;color:${BODY};margin:0 0 16px">${e.guest}</p><a href="#listen-${i}" style="font-family:${SANS};font-size:14px;font-weight:600;color:${SAGE_DEEP};text-decoration:none">Listen now →</a></div>`}
          />
        ))}
      </ContentSection>

      <ContentSection background={SAGE_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:580px;margin:0 auto">
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:0;letter-spacing:-0.01em">Subscribe wherever you listen.</h2>
            <p style="margin:18px auto 0;font-size:16px;line-height:1.7;color:${BODY}">A quiet episode every Wednesday — about 30 minutes, no fluff.</p>
            ${pillCta({ primaryLabel: 'Apple Podcasts', primaryUrl: '#apple', secondaryLabel: 'Spotify', secondaryUrl: '#spotify' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- registry ----------

type PageBuilder = (brand: string, images: Record<string, SiteImage>) => ReactNode;

/**
 * Page builders for every page this template ships.
 *
 * System pages use Kajabi's reserved slot names. Custom pages use unique
 * snake_case names that get materialized as `templates/<name>.liquid` and
 * `content_for_<name>` arrays at export time.
 *
 * NEVER routes through `(page)` or `(sales_page)` per
 * `mem://reference/kajabi-page-creation.md`.
 */
const PAGE_BUILDERS: Record<string, PageBuilder> = {
  // System pages (kept by Kajabi as required template slots)
  index:                (brand, images) => <HomePage brand={brand} images={images} />,
  about:                (brand, images) => <AboutPage brand={brand} images={images} />,
  contact:              (brand)         => <ContactPage brand={brand} />,
  blog:                 (brand)         => <BlogPage brand={brand} />,
  blog_post:            (brand)         => <BlogPostPage brand={brand} />,
  thank_you:            (brand)         => <ThankYouPage brand={brand} />,
  '404':                (brand)         => <NotFoundPage brand={brand} />,
  // Custom pages (each emits its own templates/<name>.liquid + content_for_<name>)
  signature_method:     (brand, images) => <SignatureMethodPage brand={brand} images={images} />,
  monthly_money_office: (brand, images) => <MembershipPage brand={brand} images={images} />,
  library:              (brand, images) => <LibraryPage brand={brand} images={images} />,
  podcast:              (brand, images) => <PodcastPage brand={brand} images={images} />,
};

const ALL_PAGES: PageKey[] = [
  // System
  'index', 'about', 'contact', 'blog', 'blog_post', 'thank_you', '404',
  // Custom
  'signature_method', 'monthly_money_office', 'library', 'podcast',
];

// ---------- THEME SETTINGS (Kajabi-wide branding) ----------
//
// Per `mem://feature/template-theme-settings.md`: these top-level fields
// land in settings_data.json's `current` object and brand every Kajabi
// system page (login, store, checkout, library, member directory) — not
// just the pages we compose. Keys MUST exist in templateSettingsCatalog.ts.

const CALM_LEDGER_THEME_SETTINGS: Record<string, string> = {
  // Page background
  background_color: CREAM,
  // Brand color
  color_primary: SAGE_DEEP,
  // Typography — Cormorant Garamond + Inter (loaded by base theme's Google Fonts preset)
  font_family_heading: 'Cormorant Garamond',
  font_weight_heading: '500',
  line_height_heading: '1.1',
  font_family_body: 'Inter',
  font_weight_body: '400',
  line_height_body: '1.7',
  // Heading + body colors
  color_heading: INK,
  color_body: BODY,
  color_body_secondary: '#7A8278',
  color_placeholder: '#B8B8B8',
  // Type scale (desktop)
  font_size_h1_desktop: '64px',
  font_size_h2_desktop: '46px',
  font_size_h3_desktop: '28px',
  font_size_h4_desktop: '22px',
  font_size_body_desktop: '17px',
  // Type scale (mobile)
  font_size_h1_mobile: '40px',
  font_size_h2_mobile: '32px',
  font_size_h3_mobile: '24px',
  font_size_h4_mobile: '20px',
  font_size_body_mobile: '16px',
  // Buttons — pill shape, sage primary
  btn_style: 'solid',
  btn_size: 'medium',
  btn_width: 'auto',
  btn_border_radius: '50',
  btn_text_color: '#FFFFFF',
  btn_background_color: SAGE_DEEP,
};

// Custom CSS — for Kajabi system pages (login, store, checkout) and small
// polish that schema fields can't express. Wrapped at export time in a
// `/* === template customCss === */` block so re-runs are idempotent.
const CALM_LEDGER_CUSTOM_CSS = `
/* Calm Ledger — system page polish */
body { background: ${CREAM}; color: ${BODY}; }
a { color: ${SAGE_DEEP}; }
a:hover { color: ${INK}; }

/* Branded form inputs (login, password recovery, store checkout) */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
textarea,
select {
  border: 1px solid rgba(31,42,36,0.15) !important;
  border-radius: 12px !important;
  background: #FFFFFF !important;
  color: ${INK} !important;
  font-family: 'Inter', sans-serif !important;
  padding: 14px 16px !important;
}
input:focus, textarea:focus, select:focus {
  border-color: ${SAGE_DEEP} !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(111,138,116,0.15) !important;
}

/* Buttons across system pages — pill, sage, calm */
button,
.button,
input[type="submit"],
.btn-primary {
  border-radius: 999px !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
}

/* Headings on system pages */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Cormorant Garamond', Georgia, serif !important;
  font-weight: 500 !important;
  letter-spacing: -0.01em !important;
  color: ${INK} !important;
}

/* Library / store product cards — soften corners + subtle shadow */
.product-card, .library-card, .course-card {
  border-radius: 22px !important;
  background: #FFFFFF !important;
  box-shadow: 0 4px 16px rgba(31,42,36,0.06) !important;
  border: 1px solid rgba(31,42,36,0.05) !important;
}
`;

export const calmLedgerTemplate: TemplateDef = {
  id: 'calm-ledger',
  label: 'Calm Ledger',
  description: 'Premium financial-education brand — sage, cream, refined serif, image-rich. 11 real pages, no shortcuts through Kajabi (page).',
  pageKeys: ALL_PAGES,
  imageSlots: IMAGE_SLOTS,
  themeSettings: CALM_LEDGER_THEME_SETTINGS,
  customCss: CALM_LEDGER_CUSTOM_CSS,
  fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
  buildPages: (site: Site, images = {}) => {
    const out: Record<string, ReactNode> = {};
    for (const key of ALL_PAGES) {
      if (site.pages[key]?.enabled === false) continue;
      const build = PAGE_BUILDERS[key];
      if (!build) continue;
      out[key] = build(site.brandName, images);
    }
    return out;
  },
  renderPage: (site: Site, page: PageKey, images = {}) => {
    const build = PAGE_BUILDERS[page];
    return build ? build(site.brandName, images) : null;
  },
};
