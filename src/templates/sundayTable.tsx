/**
 * Sunday Table School template — warm, family-cooking education brand.
 *
 * Aesthetic: cozy, premium, family-centered. Cream, warm terracotta, olive
 * green, muted clay, soft wood-tone neutrals. Editorial serif headlines paired
 * with clean humanist sans body. Generous spacing, rounded corners, soft shadows.
 *
 * Page architecture (per `mem://reference/kajabi-page-creation.md`):
 *
 *   System pages:
 *     index      → Home
 *     about      → Founder story (Elena Hart)
 *     page       → Free 5 Easy Weeknight Dinner Plans opt-in (system `page` template)
 *     thank_you  → Post opt-in thank you + soft upsell
 *     contact    → Contact form
 *     blog       → Editorial hub (Kajabi blog_listings)
 *     blog_post  → Sample post (Kajabi blog_post_body)
 *     404        → Not-found page
 *
 *   Custom pages (each emits its own templates/<name>.liquid + content_for_<name>):
 *     family_table_method   → Signature program sales page
 *     weekly_dinner_club    → Membership sales page
 *     library               → Member library (Kajabi products)
 *     podcast               → The Sunday Supper Shift
 *     community             → Private community page
 *
 * Per memory rules: NEVER use (sales_page); custom pages get dedicated templates.
 * RawSection injects Kajabi-native dynamic content for blog/blog_post/library.
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
  { key: 'homeHero',         label: 'Home hero',         description: 'Cozy modern kitchen scene in homepage hero.', defaultPrompt: 'Cozy modern kitchen with warm natural light, wooden cutting board, fresh ingredients, family lifestyle brand aesthetic, premium editorial photography', aspect: '4:3' },
  { key: 'homeMom',          label: 'Mom prepping veg',  description: 'Below-fold lifestyle moment.',                defaultPrompt: 'A mom preparing vegetables in a beautiful but realistic home kitchen, soft earth tones, warm inviting mood',                                          aspect: '4:3' },
  { key: 'homeFlatlay',      label: 'Meal planner flat lay', description: 'Featured free resource section.',         defaultPrompt: 'Flat lay of weekly meal planner, recipe cards, grocery list, olive oil, herbs, and neutral kitchen styling',                                            aspect: '1:1' },
  { key: 'homeTable',        label: 'Family dinner table', description: 'Final CTA section.',                       defaultPrompt: 'Family dinner table with simple healthy meal, candles, warm evening light, calm lifestyle brand photography',                                          aspect: '16:9' },
  { key: 'aboutPortrait',    label: 'About portrait',    description: 'Founder Elena Hart on About page.',          defaultPrompt: 'Warm portrait of a female founder in a bright kitchen, relaxed and approachable, modern lifestyle brand style',                                       aspect: '3:4' },
  { key: 'aboutLifestyle',   label: 'About lifestyle',   description: 'Secondary About story image.',               defaultPrompt: 'Founder holding a mixing bowl in a natural light kitchen, soft smile, cozy elevated visual style',                                                    aspect: '4:3' },
  { key: 'freebie',          label: 'Freebie hero',      description: 'Lead-magnet opt-in page hero.',              defaultPrompt: 'Recipe guide mockup on tablet and laptop, warm neutral kitchen brand aesthetic',                                                                       aspect: '4:3' },
  { key: 'method',           label: 'Signature program', description: 'Hero on Family Table Method sales page.',    defaultPrompt: 'Premium online course mockup with recipe workbook, video lessons, and member dashboard, warm earthy palette',                                          aspect: '16:9' },
  { key: 'methodLifestyle',  label: 'Method lifestyle',  description: 'Mid-page on signature program page.',        defaultPrompt: 'Parent cooking at home with laptop open to course content, practical lifestyle education aesthetic',                                                  aspect: '4:3' },
  { key: 'membership',       label: 'Membership',        description: 'Weekly Dinner Club hero image.',             defaultPrompt: 'Cozy kitchen table with laptop, tea, recipe notebook, and weekly meal plan open',                                                                     aspect: '4:3' },
  { key: 'podcast',          label: 'Podcast',           description: 'Podcast page hero.',                          defaultPrompt: 'Stylish podcast microphone in a cozy kitchen corner, warm light, natural textures, modern lifestyle aesthetic',                                       aspect: '4:3' },
  { key: 'library',          label: 'Library hero',      description: 'Member library hero image.',                  defaultPrompt: 'Modern digital recipe dashboard displayed on laptop, clean UI, warm beige and olive accents',                                                          aspect: '16:9' },
  { key: 'community',        label: 'Community',         description: 'Community page hero.',                        defaultPrompt: 'Supportive online community concept with women in a virtual cooking or planning session, warm modern styling',                                        aspect: '4:3' },
];

// ---------- design tokens ----------

const SERIF = `'DM Serif Display', 'Bitter', Georgia, serif`;
const SANS  = `'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const INK         = '#2A211B';   // warm near-black
const BODY        = '#6B5E54';   // warm taupe body
const CREAM       = '#FAF3E8';   // page bg — soft cream
const CREAM_2     = '#F2E8D6';   // alt section bg — warm sand
const PANEL       = '#FFFFFF';
const TERRA       = '#C4744D';   // warm terracotta accent
const TERRA_DEEP  = '#A35D3A';
const TERRA_SOFT  = '#F5DCC9';   // pale terracotta panel
const OLIVE       = '#7C8C5C';   // olive green secondary
const OLIVE_DEEP  = '#5F6E45';
const OLIVE_SOFT  = '#E2E6D2';
const CLAY        = '#B8896A';   // muted clay accent
const WOOD        = '#D9C4A7';   // wood-tone divider/border

const PILL_PRIMARY = `linear-gradient(135deg, ${TERRA} 0%, ${TERRA_DEEP} 100%)`;

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
      <a href="${opts.primaryUrl}" style="display:inline-flex;align-items:center;gap:8px;background:${PILL_PRIMARY};color:#FFFFFF;padding:15px 30px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS};box-shadow:0 6px 18px rgba(196,116,77,0.32);letter-spacing:0.01em">
        ${opts.primaryLabel}<span style="font-size:14px">→</span>
      </a>
      ${opts.secondaryLabel ? `
      <a href="${opts.secondaryUrl ?? '#'}" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:${INK};padding:15px 30px;border:1.5px solid rgba(42,33,27,0.18);border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">
        ${opts.secondaryLabel}
      </a>` : ''}
    </div>`;
}

function eyebrow(label: string, dotColor = OLIVE) {
  return `<span style="display:inline-flex;align-items:center;gap:10px;font-family:${SANS};font-size:12px;font-weight:600;color:${BODY};letter-spacing:0.16em;text-transform:uppercase">
    <span style="display:inline-block;width:24px;height:1px;background:${dotColor}"></span>
    ${label}
  </span>`;
}

function tile(svg: string, bg = OLIVE_SOFT, fg = OLIVE_DEEP) {
  return `<div style="width:48px;height:48px;background:${bg};border-radius:14px;display:inline-flex;align-items:center;justify-content:center;color:${fg};margin-bottom:22px">${svg}</div>`;
}

const ICON_BOWL = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20a10 10 0 0 1-20 0z"/><path d="M12 2v4M9 4l3 2 3-2"/></svg>`;
const ICON_CALENDAR = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
const ICON_CART = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
const ICON_HEART = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const ICON_BOOK = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M4 19.5V22h16"/></svg>`;
const ICON_USERS = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const ICON_MIC = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></svg>`;
const ICON_LEAF = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.5 2c.5 2.5.02 4.5-1.1 6.9C15.7 14.4 11 13 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>`;
const ICON_CHECK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// ---------- shared chrome ----------

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'The Method', url: '/family-table-method' },
  { label: 'Dinner Club', url: '/weekly-dinner-club' },
  { label: 'Podcast', url: '/podcast' },
  { label: 'Journal', url: '/blog' },
  { label: 'Free Plans', url: '/page' },
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
      paddingDesktop={{ top: '88', bottom: '40' }}
    >
      <Logo type="text" text={brand} textColor="#FFFFFF" />
      <LinkList heading="Learn" handle="footer-learn" layout="vertical" alignment="left"
        previewItems={[
          { label: 'The Method', url: '/family-table-method' },
          { label: 'Dinner Club', url: '/weekly-dinner-club' },
          { label: 'Free Plans', url: '/page' },
          { label: 'Library', url: '/library' },
        ]}
      />
      <LinkList heading="Explore" handle="footer-explore" layout="vertical" alignment="left"
        previewItems={[
          { label: 'About Elena', url: '/about' },
          { label: 'Journal', url: '/blog' },
          { label: 'Podcast', url: '/podcast' },
          { label: 'Community', url: '/community' },
        ]}
      />
      <LinkList heading="Company" handle="footer-company" layout="vertical" alignment="left"
        previewItems={[
          { label: 'Contact', url: '/contact' },
          { label: 'Privacy', url: '/privacy' },
          { label: 'Terms', url: '/terms' },
        ]}
      />
      <SocialIcons instagram="https://instagram.com" pinterest="https://pinterest.com" />
      <Copyright text={`${brand}. Real food, real rhythms, real homes.`} />
    </FooterSection>
  );
}

// ---------- HOME PAGE ----------

function HomePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.homeHero;
  const mom = images.homeMom;
  const flat = images.homeFlatlay;
  const table = images.homeTable;
  return (
    <>
      <SharedHeader brand={brand} />

      {/* Hero — split */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Simple meal planning for busy families')}
            <h1 style="font-family:${SERIF};font-size:72px;line-height:1.04;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              Calmer evenings.<br/><em style="color:${TERRA_DEEP};font-weight:500">Better dinners.</em><br/>Real home cooking.
            </h1>
            <p style="max-width:520px;margin:28px 0 0;font-size:18px;line-height:1.7;color:${BODY}">
              ${brand} helps you plan meals, prep with confidence, and make home cooking feel easier, more realistic, and more enjoyable — without fancy recipes or perfectionism.
            </p>
            ${pillCta({ primaryLabel: 'Get the Free Dinner Plans', primaryUrl: '/page', secondaryLabel: 'Explore the Program', secondaryUrl: '/family-table-method', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      {/* Reassurance band */}
      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow('A gentle truth', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.15;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Dinner doesn't have to <em style="color:${TERRA_DEEP}">feel this hard.</em>
            </h2>
            <p style="max-width:580px;margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY}">
              The 5pm scramble. The "what's for dinner" guilt. The grocery overwhelm. None of it means you're failing — it means you're doing this without a system. We're here to fix that, gently.
            </p>
          </div>`}
        />
      </ContentSection>

      {/* Offers overview */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 64px">
            ${eyebrow('Ways we can help')}
            <h2 style="font-family:${SERIF};font-size:52px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Five doors into a calmer kitchen.
            </h2>
            <p style="margin:18px auto 0;font-size:17px;line-height:1.65;color:${BODY};max-width:520px">Pick the level of support that fits your season — every door leads to easier weeknights.</p>
          </div>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${tile(ICON_LEAF, OLIVE_SOFT, OLIVE_DEEP)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${OLIVE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Free</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">5 Easy Weeknight Dinner Plans</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">A done-for-you week of simple, family-friendly dinners. Free download.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${tile(ICON_CART, TERRA_SOFT, TERRA_DEEP)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${TERRA_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Starter kit · $29</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Sunday Prep Starter Kit</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Templates, a grocery framework, and a 90-minute Sunday prep video. Done in one afternoon.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${tile(ICON_BOOK, OLIVE_SOFT, OLIVE_DEEP)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${OLIVE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Signature program</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Family Table Method</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Six modules to build a simple, repeatable cooking and planning rhythm.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${tile(ICON_USERS, TERRA_SOFT, TERRA_DEEP)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${TERRA_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Membership · monthly</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Weekly Dinner Club</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Fresh meal plans every week, seasonal recipes, and a quiet community of cooking parents.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`${tile(ICON_HEART, OLIVE_SOFT, OLIVE_DEEP)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${OLIVE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px">Bonus · seasonal</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Seasonal Recipe Collections</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Small, beautifully curated recipe drops for fall, winter, spring, and summer.</p>`}
        />
      </ContentSection>

      {/* Transformation */}
      <ContentSection background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        {mom && <Image src={mom.url} alt={mom.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('What changes', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              From <em style="color:${TERRA_DEEP}">5pm panic</em><br/>to easy, gathered evenings.
            </h2>
            <ul style="list-style:none;padding:0;margin:32px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'You know what you\'re cooking before the day begins — not at 4:47pm.',
                'Your grocery shop takes 20 minutes and one trip, not three.',
                'Your kids start eating real meals without a nightly negotiation.',
                'Sunday prep takes one calm hour and feeds you all week.',
                'Cooking feels like care for your family again — not another to-do.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${TERRA_DEEP};margin-top:3px;flex-shrink:0">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      {/* Founder intro */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto">
            ${eyebrow('Meet the founder')}
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Hi, I'm <em style="color:${TERRA_DEEP}">Elena Hart</em>.
            </h2>
            <p style="max-width:560px;margin:26px auto 0;font-size:17px;line-height:1.75;color:${BODY}">
              I'm a former food blogger and mom of three who learned the hard way that most families don't need gourmet recipes — they need realistic rhythms. ${brand} is what I built so families like mine could stop white-knuckling weeknights and start gathering around the table again.
            </p>
            <div style="margin-top:32px"><a href="/about" style="font-family:${SANS};font-size:14px;font-weight:600;color:${TERRA_DEEP};text-decoration:underline;text-underline-offset:6px">Read the full story →</a></div>
          </div>`}
        />
      </ContentSection>

      {/* Testimonials */}
      <ContentSection background={OLIVE_SOFT} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Notes from families', OLIVE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Calmer kitchens, in their own words.
            </h2>
          </div>`}
        />
        <Text width="4" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"I haven't asked 'what's for dinner' in three months. My husband actually noticed and said our evenings feel different. They are."</p><div style="font-weight:700;font-size:14px;color:${INK}">Hannah M. · Mom of two</div></div>`}
        />
        <Text width="4" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"Sunday prep used to feel like a chore. Now it's the calmest hour of my week. The kids even help."</p><div style="font-weight:700;font-size:14px;color:${INK}">Sara K. · Mom of three</div></div>`}
        />
        <Text width="4" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"This isn't a recipe blog. It's an actual system. I'd been looking for it for years and didn't know how to ask."</p><div style="font-weight:700;font-size:14px;color:${INK}">Maya P. · Working parent</div></div>`}
        />
      </ContentSection>

      {/* Featured free resource */}
      <ContentSection background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        {flat && <Image src={flat.url} alt={flat.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('Free resource', OLIVE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              5 Easy Weeknight Dinner Plans
            </h2>
            <p style="max-width:480px;margin:24px 0 0;font-size:17px;line-height:1.7;color:${BODY}">
              A done-for-you week of simple, real-family dinners. Includes a printable grocery list, prep notes, and substitutions for picky eaters. Yours, free.
            </p>
            ${pillCta({ primaryLabel: 'Send me the plans', primaryUrl: '/page', align: 'left' })}
          </div>`}
        />
      </ContentSection>

      {/* Final CTA */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '120', bottom: '120' }}>
        {table && <Image src={table.url} alt={table.alt} colWidth="10" imageBorderRadius="32" align="center" />}
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};margin-top:40px">
            ${eyebrow('Come to the table', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:500;color:${INK};margin:18px auto 0;max-width:720px;letter-spacing:-0.015em">
              Let's make dinner feel <em style="color:${TERRA_DEEP}">easy again.</em>
            </h2>
            ${pillCta({ primaryLabel: 'Get the Free Dinner Plans', primaryUrl: '/page', secondaryLabel: 'Explore the Method', secondaryUrl: '/family-table-method' })}
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
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Our story')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">
              Hi, I'm <em style="color:${TERRA_DEEP}">Elena.</em><br/>And dinner used to wreck me too.
            </h1>
            <p style="max-width:520px;margin:24px 0 0;font-size:17px;line-height:1.7;color:${BODY}">
              For years, I ran a successful food blog full of beautiful recipes. Then I had three kids in five years — and realized that beautiful recipes were not what families like mine needed. We needed rhythms. Systems. Permission to keep it simple.
            </p>
          </div>`}
        />
        {portrait && <Image src={portrait.url} alt={portrait.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="10"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto;color:${BODY};font-size:17px;line-height:1.8">
            <p>${brand} began the night I sobbed in front of an open fridge at 5:47pm — third night in a row of takeout, while my kids fought in the living room and my husband texted that he'd be late.</p>
            <p style="margin-top:18px">I'm a recipe developer. I write cookbooks. I had hundreds of meals saved on my phone. And I still couldn't get a real dinner on the table on a Tuesday.</p>
            <p style="margin-top:18px">That's when it hit me: the problem was never the recipes. It was the rhythm. The plan. The permission to make the same five things on rotation. The Sunday hour that sets up the whole week.</p>
            <p style="margin-top:18px">${brand} is the rhythm I built for my own family — and now I teach it to thousands of others.</p>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={CREAM} paddingDesktop={{ top: '90', bottom: '90' }}>
        {lifestyle && <Image src={lifestyle.url} alt={lifestyle.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('Our philosophy', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Real food. Real rhythms. Real homes.
            </h2>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:12px">
              ${[
                'Simple meals beat impressive meals — every Tuesday.',
                'Repetition is a feature, not a flaw.',
                'A plan you\'ll follow > a plan that looks pretty.',
                'Cooking is an act of care, not a performance.',
                'Your kitchen should serve your life — not the other way around.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${TERRA_DEEP};margin-top:3px;flex-shrink:0">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.05;font-weight:500;color:${INK};margin:0;letter-spacing:-0.015em">
              Want to start with the <em style="color:${TERRA_DEEP}">free plans?</em>
            </h2>
            <p style="max-width:480px;margin:20px auto 0;font-size:16px;line-height:1.65;color:${BODY}">A done-for-you week of dinners — the easiest first step.</p>
            ${pillCta({ primaryLabel: 'Get the Free Dinner Plans', primaryUrl: '/page', secondaryLabel: 'Explore the Program', secondaryUrl: '/family-table-method' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- FREEBIE OPT-IN (system `page`) ----------

function FreebiePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.freebie;
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Free download', OLIVE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">
              A done-for-you week of <em style="color:${TERRA_DEEP}">simple dinners</em> for busy families.
            </h1>
            <p style="max-width:520px;margin:24px 0 0;font-size:17px;line-height:1.7;color:${BODY}">
              Five real dinners. One grocery list. Zero gourmet ingredients. Made for the week you're in — not the one you wish you had time for.
            </p>
            <ul style="list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:12px">
              ${[
                'Easy meal ideas with simple ingredients you already love',
                'Less last-minute stress at dinnertime',
                'Family-friendly recipes that real kids actually eat',
                'A practical way to make meal planning easier this week',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${OLIVE_DEEP};margin-top:3px;flex-shrink:0">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '80', bottom: '80' }}>
        <Form
          width="6"
          heading="Send me the dinner plans"
          text={`<p style="font-family:${SANS};font-size:15px;color:${BODY};margin:0 0 20px">Drop your email — we'll send the plans straight to your inbox. No spam, just the occasional Sunday note.</p>`}
          buttonBackgroundColor={TERRA_DEEP}
          buttonTextColor="#FFFFFF"
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
      <ContentSection background={CREAM} paddingDesktop={{ top: '120', bottom: '100' }}>
        <Text align="center" width="10"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('You\'re in', OLIVE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">
              Welcome to a <em style="color:${TERRA_DEEP}">calmer kitchen.</em>
            </h1>
            <p style="max-width:520px;margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY}">
              The dinner plans are heading to your inbox right now. (Check your spam folder if they don't arrive in a few minutes — and add hello@${brand.toLowerCase().replace(/\s+/g, '')}.com to your contacts so we don't get lost.)
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '80', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('A small next step', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Ready to make Sunday prep <em style="color:${TERRA_DEEP}">a thing?</em>
            </h2>
            <p style="margin:20px auto 0;font-size:16px;line-height:1.65;color:${BODY};max-width:520px">
              The Sunday Prep Starter Kit is a 90-minute video plus templates that show you exactly how to set your week up in one calm afternoon. $29 — and most families say it pays for itself in one week of skipped takeout.
            </p>
            ${pillCta({ primaryLabel: 'See the Starter Kit', primaryUrl: '#starter-kit', secondaryLabel: 'Back to home', secondaryUrl: '/' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- SIGNATURE PROGRAM (custom: family_table_method) ----------

function FamilyTableMethodPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.method;
  const lifestyle = images.methodLifestyle;
  return (
    <>
      <SharedHeader brand={brand} />

      {/* Hero */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Signature program', TERRA_DEEP)}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.04;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">
              The Family Table <em style="color:${TERRA_DEEP}">Method.</em>
            </h1>
            <p style="max-width:520px;margin:24px 0 0;font-size:18px;line-height:1.7;color:${BODY}">
              A six-module program to help your family build a simple, repeatable cooking and planning rhythm — one that reduces stress, saves money, and makes dinner feel manageable again.
            </p>
            ${pillCta({ primaryLabel: 'Enroll in the Method', primaryUrl: '#enroll', secondaryLabel: 'See what\'s inside', secondaryUrl: '#modules', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      {/* Problem */}
      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="10"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto">
            ${eyebrow('If you\'re here', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              You're tired of the same five questions every night.
            </h2>
            <p style="margin:20px auto 0;font-size:17px;line-height:1.7;color:${BODY};max-width:560px">
              "What are we eating?" "Did anyone defrost anything?" "Do we have rice?" "Can we just order pizza?" "Why is this so hard?"<br/><br/>The Method is the answer to all five.
            </p>
          </div>`}
        />
      </ContentSection>

      {/* Transformation */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        {lifestyle && <Image src={lifestyle.url} alt={lifestyle.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('What changes', OLIVE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              By week four, dinner just <em style="color:${OLIVE_DEEP}">happens.</em>
            </h2>
            <ul style="list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'You have a 15-minute Sunday planning ritual that sets up your week.',
                'You shop once, cook with intention, and stop wasting food.',
                'Your kids know the rhythm — and stop asking what\'s for dinner.',
                'You stop spending $80 on a Wednesday DoorDash because you "have nothing".',
                'Your family eats around the table more nights than not.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${OLIVE_DEEP};margin-top:3px;flex-shrink:0">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      {/* What's included + Modules */}
      <ContentSection background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('What\'s inside', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Six calm modules.<br/>One whole new rhythm.
            </h2>
          </div>`}
        />
        {[
          ['Module 1', 'Resetting the Dinner Routine', 'Honest assessment of where you are now and what\'s draining you most. Small first wins.'],
          ['Module 2', 'Meal Planning That Actually Works', 'A planning framework built around real life — not a Pinterest fantasy. Your family\'s rotation, on paper.'],
          ['Module 3', 'Smart Grocery Shopping', 'One trip. One list. Less waste. The store routine that saves time and money.'],
          ['Module 4', 'Prep Once, Use It All Week', 'Sunday prep that takes 60–90 minutes and feeds you Tuesday, Wednesday, and Thursday.'],
          ['Module 5', 'Family-Friendly Dinner Formulas', 'Six dinner formulas you can riff on forever. No more recipe rabbit holes.'],
          ['Module 6', 'Creating a Sustainable Kitchen Rhythm', 'Making it stick — through busy seasons, illness, holidays, and life.'],
        ].map(([label, title, body]) => `${label}|${title}|${body}`).map((row, i) => {
          const [label, title, body] = row.split('|');
          return (
            <Feature
              key={i}
              width="6"
              align="left"
              backgroundColor={PANEL}
              borderRadius="20"
              padding={{ top: '28', bottom: '28', left: '28', right: '28' }}
              boxShadow="small"
              text={`<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${TERRA_DEEP};letter-spacing:0.16em;text-transform:uppercase;margin-bottom:8px">${label}</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 10px">${title}</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">${body}</p>`}
            />
          );
        })}
      </ContentSection>

      {/* Who it's for */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('This is for you if', OLIVE_DEEP)}
            <h3 style="font-family:${SERIF};font-size:32px;line-height:1.15;font-weight:500;color:${INK};margin:14px 0 18px">It might be your season for this.</h3>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px">
              ${[
                'You\'re a busy parent who wants calmer evenings',
                'You can cook — you just can\'t plan',
                'You want to spend less on takeout and groceries',
                'You\'re tired of the dinner mental load',
                'You want a system, not another recipe site',
              ].map(t => `<li style="display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.55;color:${INK}"><span style="color:${OLIVE_DEEP};margin-top:3px">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('It\'s probably not for you if', TERRA_DEEP)}
            <h3 style="font-family:${SERIF};font-size:32px;line-height:1.15;font-weight:500;color:${INK};margin:14px 0 18px">Maybe another time.</h3>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;color:${BODY}">
              <li style="font-size:15px;line-height:1.55">You're a chef looking for technique-level recipes</li>
              <li style="font-size:15px;line-height:1.55">You want elaborate, restaurant-style dinners</li>
              <li style="font-size:15px;line-height:1.55">You\'re happy with takeout most nights — and that\'s working for you</li>
              <li style="font-size:15px;line-height:1.55">You want a strict diet program, not a flexible rhythm</li>
            </ul>
          </div>`}
        />
      </ContentSection>

      {/* Testimonials */}
      <ContentSection background={OLIVE_SOFT} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto 48px">${eyebrow('What graduates say', OLIVE_DEEP)}<h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Real families. Real Tuesdays.</h2></div>`}
        />
        <Text width="6" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:21px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"By module 3 my grocery bill dropped by $180 a month. I couldn't believe it. The same family, the same kids, just a system."</p><div style="font-weight:700;font-size:14px;color:${INK}">Rachel D. · Mom of three</div></div>`}
        />
        <Text width="6" align="left" backgroundColor={CREAM} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:21px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"My husband says he doesn't recognize our weekday evenings. They feel like Sundays. That's the best review I can give."</p><div style="font-weight:700;font-size:14px;color:${INK}">Emily R. · Working mom</div></div>`}
        />
      </ContentSection>

      {/* FAQ */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto 40px">${eyebrow('Common questions', TERRA_DEEP)}<h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">You're not the first to ask.</h2></div>`}
        />
        {[
          { q: 'How much time will this actually take?', a: 'About 30 minutes of lessons per module, plus your weekly planning ritual (15 min) and Sunday prep (60–90 min). The first week takes the most setup; everything after that is rhythm.' },
          { q: 'I have picky eaters. Will this still work?', a: 'Yes — Module 5\'s family-friendly formulas are built around picky-eater realities. We\'re practical, not preachy.' },
          { q: 'Do I need fancy equipment or ingredients?', a: 'No. The Method assumes a normal kitchen, a normal grocery store, and a normal budget. If you have a cutting board and a sheet pan, you\'re set.' },
          { q: 'Is this self-paced or live?', a: 'Self-paced. You get lifetime access to all six modules and any future updates. There\'s also an active student community for questions.' },
          { q: 'What if it doesn\'t work for my family?', a: '14-day full refund — no questions, no awkward emails. We want this to genuinely help.' },
          { q: 'Can I do this with the membership?', a: 'Absolutely. Many students graduate the Method and stay on through the Weekly Dinner Club for ongoing meal plans and community.' },
        ].map((f, i) => (
          <Accordion key={i} width="10" heading={f.q} body={`<p style="font-family:${SANS};color:${BODY};font-size:15px;line-height:1.7;margin:0">${f.a}</p>`} />
        ))}
      </ContentSection>

      {/* Pricing */}
      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto 40px">${eyebrow('Enroll', TERRA_DEEP)}<h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Two ways to join.</h2></div>`}
        />
        <PricingCard width="6" heading="Pay in full" name="Best value" badgeText="Save $30" price="$297" priceCaption="One-time payment · Lifetime access" text="<ul><li>All 6 modules + lifetime access</li><li>Printable planners + grocery templates</li><li>Student community</li><li>14-day refund</li></ul>" buttonText="Enroll for $297" buttonUrl="#enroll" buttonBackgroundColor={TERRA_DEEP} buttonTextColor="#FFFFFF" highlight brandColor={TERRA} />
        <PricingCard width="6" heading="3 monthly payments" name="Flexible" price="$109" priceCaption="per month for 3 months" text="<ul><li>All 6 modules + lifetime access</li><li>Printable planners + grocery templates</li><li>Student community</li><li>14-day refund</li></ul>" buttonText="Start payment plan" buttonUrl="#enroll-plan" buttonBackgroundColor={TERRA_DEEP} buttonTextColor="#FFFFFF" brandColor={TERRA} />
      </ContentSection>

      {/* Final CTA */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '120' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.05;font-weight:500;color:${INK};margin:0 auto;max-width:680px;letter-spacing:-0.015em">
              The Tuesday you've been wanting <em style="color:${TERRA_DEEP}">starts here.</em>
            </h2>
            ${pillCta({ primaryLabel: 'Enroll in the Method', primaryUrl: '#enroll', secondaryLabel: 'Back to home', secondaryUrl: '/' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- MEMBERSHIP (custom: weekly_dinner_club) ----------

function MembershipPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.membership;
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Membership', TERRA_DEEP)}
            <h1 style="font-family:${SERIF};font-size:62px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">
              The Weekly <em style="color:${TERRA_DEEP}">Dinner Club.</em>
            </h1>
            <p style="max-width:520px;margin:24px 0 0;font-size:18px;line-height:1.7;color:${BODY}">
              A monthly membership for families who want a calm, planned week of dinners — without doing the planning themselves. Fresh meal plans every Sunday, seasonal recipes, and a quiet community of cooking parents.
            </p>
            ${pillCta({ primaryLabel: 'Join the Dinner Club', primaryUrl: '#join', secondaryLabel: 'See what\'s inside', secondaryUrl: '#inside', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '100', bottom: '100' }} id="inside">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('What you get every month', OLIVE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              A whole month of <em style="color:${OLIVE_DEEP}">easier dinners.</em>
            </h2>
          </div>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
          text={`${tile(ICON_CALENDAR, OLIVE_SOFT, OLIVE_DEEP)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">4 weekly meal plans</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">A new family-friendly meal plan every Sunday morning. 5 dinners, mix-and-match.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
          text={`${tile(ICON_CART, TERRA_SOFT, TERRA_DEEP)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Grocery guides</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Printable shopping lists for every plan, organized by store section.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
          text={`${tile(ICON_LEAF, OLIVE_SOFT, OLIVE_DEEP)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Seasonal drops</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Curated seasonal recipe collections four times a year — fall, winter, spring, summer.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
          text={`${tile(ICON_USERS, TERRA_SOFT, TERRA_DEEP)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Live monthly Q&amp;A</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">Once a month, Elena hosts a live planning + Q&amp;A session. Recordings always saved.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
          text={`${tile(ICON_HEART, OLIVE_SOFT, OLIVE_DEEP)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">A quiet member space</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">A private community for swapping wins, asking questions, and seeing what other families are cooking this week.</p>`}
        />
      </ContentSection>

      {/* FAQ */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto 40px"><h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:0;letter-spacing:-0.01em">Quick questions.</h2></div>`}
        />
        {[
          { q: 'Can I cancel anytime?', a: 'Yes — any month, no questions. Email us or hit the cancel button in your account. We\'ll wave you off kindly.' },
          { q: 'What if I have dietary restrictions?', a: 'Every meal plan includes vegetarian, gluten-free, and dairy-free swaps. We can\'t cover every possible restriction, but we make it easy to adapt.' },
          { q: 'Is this just recipes?', a: 'No — it\'s plans. Every Sunday you get a complete week, organized so leftovers and prep flow into each other. It\'s a system.' },
          { q: 'Do I need The Family Table Method first?', a: 'Not at all. The Method teaches you to build your own system. The Dinner Club hands you a system, every week. Both work — pick what fits your season.' },
        ].map((f, i) => (
          <Accordion key={i} width="10" heading={f.q} body={`<p style="font-family:${SANS};color:${BODY};font-size:15px;line-height:1.7;margin:0">${f.a}</p>`} />
        ))}
      </ContentSection>

      {/* Pricing */}
      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '100', bottom: '100' }} id="join">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto 40px">${eyebrow('Join', TERRA_DEEP)}<h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Pick your rhythm.</h2></div>`}
        />
        <PricingCard width="6" heading="Monthly" name="Flexible" price="$19" priceCaption="per month · cancel anytime" text="<ul><li>Weekly meal plans + grocery guides</li><li>Seasonal recipe drops</li><li>Live monthly Q&amp;A</li><li>Member community</li><li>Cancel anytime</li></ul>" buttonText="Start monthly" buttonUrl="#start-monthly" buttonBackgroundColor={TERRA_DEEP} buttonTextColor="#FFFFFF" brandColor={TERRA} />
        <PricingCard width="6" heading="Annual" name="Best value" badgeText="Save $49" price="$179" priceCaption="per year · just $14.92/month" text="<ul><li>Everything in monthly</li><li>Save $49 vs monthly</li><li>Bonus: full Seasonal Recipe archive</li><li>Priority Q&amp;A questions</li><li>Cancel anytime</li></ul>" buttonText="Start annual" buttonUrl="#start-annual" buttonBackgroundColor={TERRA_DEEP} buttonTextColor="#FFFFFF" highlight brandColor={TERRA} />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- LIBRARY (custom: library — uses RawSection products) ----------

function LibraryPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.library;
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '90', bottom: '60' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('Welcome back', OLIVE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:54px;line-height:1.05;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.02em">
              Your <em style="color:${OLIVE_DEEP}">Sunday Table</em> library.
            </h1>
            <p style="max-width:520px;margin:20px auto 0;font-size:17px;line-height:1.7;color:${BODY}">
              Everything you've enrolled in, all in one calm place. Pick up where you left off, or browse what's new.
            </p>
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="10" imageBorderRadius="24" align="center" />}
      </ContentSection>

      {/*
        Kajabi-native products grid — RawSection passes through verbatim so
        Kajabi's dynamic library content renders inside our chrome.
        Per `mem://reference/raw-kajabi-sections.md`.
      */}
      <RawSection
        type="products"
        name="My Products"
        settings={{
          text_heading: 'Featured products',
          text_subheading: 'Meal plans, mini courses, and seasonal collections — all in one place.',
          layout: '12',
          background_color: CREAM_2,
          color_text: INK,
        }}
      />

      <ContentSection background={CREAM} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 40px">
            ${eyebrow('Quick links', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Browse by category.
            </h2>
          </div>`}
        />
        {[
          ['Meal Plans', 'Weekly dinner plans + grocery lists'],
          ['Quick Lessons', 'Bite-sized planning videos'],
          ['Seasonal Recipes', 'Curated drops for each season'],
          ['Replays', 'Past Q&A and live sessions'],
          ['Resources', 'Printable templates + tools'],
          ['Community', 'Drop into the member space'],
        ].map(([title, body], i) => (
          <Feature
            key={i}
            width="4"
            align="left"
            backgroundColor={PANEL}
            borderRadius="18"
            padding={{ top: '24', bottom: '24', left: '26', right: '26' }}
            boxShadow="small"
            text={`<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 8px">${title}</h3><p style="font-family:${SANS};font-size:14px;line-height:1.6;color:${BODY};margin:0">${body}</p>`}
          />
        ))}
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- PODCAST (custom: podcast) ----------

function PodcastPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.podcast;
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Podcast', OLIVE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">
              The Sunday<br/><em style="color:${OLIVE_DEEP}">Supper Shift.</em>
            </h1>
            <p style="max-width:520px;margin:24px 0 0;font-size:18px;line-height:1.7;color:${BODY}">
              Honest, encouraging conversations about meal planning, family rhythms, and the small shifts that make weeknights feel calmer. New episodes every Sunday.
            </p>
            ${pillCta({ primaryLabel: 'Listen on Apple', primaryUrl: '#apple', secondaryLabel: 'Listen on Spotify', secondaryUrl: '#spotify', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 48px">
            ${eyebrow('Featured episodes', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Start with these.
            </h2>
          </div>`}
        />
        {[
          ['Episode 47', 'The Sunday hour that changes your week', '32 min'],
          ['Episode 46', 'When your kids only eat five things', '28 min'],
          ['Episode 45', 'How to grocery shop in 20 minutes', '24 min'],
          ['Episode 44', 'The case against meal-prepping for the week', '36 min'],
        ].map(([label, title, dur], i) => (
          <Feature
            key={i}
            width="6"
            align="left"
            backgroundColor={PANEL}
            borderRadius="18"
            padding={{ top: '24', bottom: '24', left: '26', right: '26' }}
            boxShadow="small"
            text={`<div style="font-family:${SANS};display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:700;color:${OLIVE_DEEP};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px"><span>${label}</span><span style="color:${BODY}">${dur}</span></div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 14px">${title}</h3><a href="#listen" style="font-family:${SANS};font-size:14px;font-weight:600;color:${TERRA_DEEP};text-decoration:underline;text-underline-offset:5px">Listen now →</a>`}
          />
        ))}
      </ContentSection>

      <ContentSection background={CREAM} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="10"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('What we talk about', OLIVE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Topics covered.
            </h2>
            <p style="margin:24px auto 0;font-size:16px;line-height:1.8;color:${BODY};max-width:580px">
              Meal planning · home rhythms · family dinners · grocery habits · reducing stress around food · realistic cooking routines · seasonal eating · feeding picky kids · partner dynamics in the kitchen · the mental load of dinner.
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '90', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.05;font-weight:500;color:${INK};margin:0 auto;max-width:600px;letter-spacing:-0.015em">
              Loved an episode? <em style="color:${TERRA_DEEP}">Try the free plans.</em>
            </h2>
            ${pillCta({ primaryLabel: 'Get the Free Dinner Plans', primaryUrl: '/page' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- COMMUNITY (custom: community) ----------

function CommunityPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.community;
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('The community', OLIVE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:500;color:${INK};margin:22px 0 0;letter-spacing:-0.02em">
              Cooking is easier <em style="color:${OLIVE_DEEP}">with company.</em>
            </h1>
            <p style="max-width:520px;margin:24px 0 0;font-size:18px;line-height:1.7;color:${BODY}">
              Inside the Weekly Dinner Club, members share what they're cooking, swap meal ideas, and cheer each other through the small wins. It's the calmest corner of the internet.
            </p>
            ${pillCta({ primaryLabel: 'Join the Dinner Club', primaryUrl: '/weekly-dinner-club', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('What members share', TERRA_DEEP)}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              A quieter kind of online space.
            </h2>
          </div>`}
        />
        {[
          ['Meal wins', 'The dinner that finally landed with the toddler. The Sunday prep that took 40 minutes instead of 90.'],
          ['Recipe swaps', '"Has anyone made this work with chicken thighs?" gets answered by 12 people in an hour.'],
          ['Encouragement', 'The night you fed everyone cereal and felt guilty — and 30 people remind you it\'s fine.'],
          ['Weekly planning', 'Members share their plan for the week. You can borrow ideas, swap formulas, or just feel less alone.'],
          ['Real questions', 'No judgment. No gatekeeping. No one trying to sell you anything.'],
          ['A quiet rhythm', 'Slow-paced, kind, and human. Not another notification feed.'],
        ].map(([title, body], i) => (
          <Feature
            key={i}
            width="4"
            align="left"
            backgroundColor={PANEL}
            borderRadius="20"
            padding={{ top: '28', bottom: '28', left: '28', right: '28' }}
            boxShadow="small"
            text={`<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">${title}</h3><p style="font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};margin:0">${body}</p>`}
          />
        ))}
      </ContentSection>

      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '90', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.05;font-weight:500;color:${INK};margin:0 auto;max-width:600px;letter-spacing:-0.015em">
              Pull up a <em style="color:${TERRA_DEEP}">chair.</em>
            </h2>
            <p style="max-width:480px;margin:20px auto 0;font-size:16px;line-height:1.65;color:${BODY}">Community access is included with any Weekly Dinner Club plan.</p>
            ${pillCta({ primaryLabel: 'Join the Dinner Club', primaryUrl: '/weekly-dinner-club', secondaryLabel: 'Back to home', secondaryUrl: '/' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- BLOG ----------

function BlogPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '90', bottom: '60' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('The journal', OLIVE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:54px;line-height:1.05;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.02em">
              Notes from a <em style="color:${OLIVE_DEEP}">calmer kitchen.</em>
            </h1>
            <p style="max-width:520px;margin:20px auto 0;font-size:17px;line-height:1.7;color:${BODY}">
              Meal planning, family dinners, grocery routines, kitchen habits, and seasonal recipes — short reads from our Sunday morning table.
            </p>
          </div>`}
        />
      </ContentSection>

      {/*
        Kajabi-native blog listings — keeps post cards dynamic so new posts
        appear automatically without rebuilding the theme.
      */}
      <RawSection
        type="blog_listings"
        name="Blog Listings"
        settings={{
          background_color: CREAM_2,
          color_text: INK,
        }}
      />

      <ContentSection background={CREAM} paddingDesktop={{ top: '70', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto">
            <h2 style="font-family:${SERIF};font-size:36px;line-height:1.1;font-weight:500;color:${INK};margin:0;letter-spacing:-0.01em">
              Want it in your inbox?
            </h2>
            <p style="margin:18px auto 0;font-size:16px;line-height:1.65;color:${BODY}">Get the free dinner plans + occasional Sunday letters from Elena.</p>
            ${pillCta({ primaryLabel: 'Get the Free Dinner Plans', primaryUrl: '/page' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- BLOG POST ----------

function BlogPostPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '70', bottom: '40' }}>
        <Text align="center" width="10"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('From the journal', OLIVE_DEEP)}
          </div>`}
        />
      </ContentSection>

      {/* Kajabi renders the actual post content here. */}
      <RawSection
        type="blog_post_body"
        name="Blog Post Body"
        settings={{
          background_color: CREAM,
          color_text: INK,
        }}
      />

      <ContentSection background={TERRA_SOFT} paddingDesktop={{ top: '80', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.1;font-weight:500;color:${INK};margin:0 auto;max-width:560px;letter-spacing:-0.01em">
              Liked this? <em style="color:${TERRA_DEEP}">Get the free plans.</em>
            </h2>
            ${pillCta({ primaryLabel: 'Send me the dinner plans', primaryUrl: '/page', secondaryLabel: 'Read more', secondaryUrl: '/blog' })}
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
        <Text align="center" width="10"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('Say hello', OLIVE_DEEP)}
            <h1 style="font-family:${SERIF};font-size:56px;line-height:1.05;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.02em">
              We'd love to <em style="color:${TERRA_DEEP}">hear from you.</em>
            </h1>
            <p style="max-width:520px;margin:22px auto 0;font-size:17px;line-height:1.7;color:${BODY}">
              Question about a program? Press inquiry? Just want to say hi? A real human reads every message.
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection background={CREAM_2} paddingDesktop={{ top: '70', bottom: '90' }}>
        <Form
          width="6"
          heading="Send a message"
          text={`<p style="font-family:${SANS};font-size:14px;color:${BODY};margin:0 0 20px">Choose what fits — general question, program support, media inquiry, or partnership opportunity. We answer within two business days.</p>`}
          buttonBackgroundColor={TERRA_DEEP}
          buttonTextColor="#FFFFFF"
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('Other ways', TERRA_DEEP)}
            <h3 style="font-family:${SERIF};font-size:28px;line-height:1.15;font-weight:500;color:${INK};margin:14px 0 18px">Or just write us.</h3>
            <p style="font-size:15px;line-height:1.7;color:${BODY};margin:0 0 12px"><strong style="color:${INK}">Email:</strong> hello@${brand.toLowerCase().replace(/\s+/g, '')}.com</p>
            <p style="font-size:15px;line-height:1.7;color:${BODY};margin:0 0 12px"><strong style="color:${INK}">Press:</strong> press@${brand.toLowerCase().replace(/\s+/g, '')}.com</p>
            <p style="font-size:15px;line-height:1.7;color:${BODY};margin:0 0 12px"><strong style="color:${INK}">Response time:</strong> within 2 business days</p>
            <p style="font-size:15px;line-height:1.7;color:${BODY};margin:24px 0 0">We're a small team. We don't outsource the inbox. We'll write back, kindly, every time.</p>
          </div>`}
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
        <Text align="center" width="10"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto">
            ${eyebrow('Lost in the pantry', TERRA_DEEP)}
            <h1 style="font-family:${SERIF};font-size:80px;line-height:1.0;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.02em">
              404 —<br/><em style="color:${TERRA_DEEP}">page not found.</em>
            </h1>
            <p style="margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY};max-width:480px">
              The page you're looking for must've slipped behind the toaster. Let's get you back to the kitchen.
            </p>
            ${pillCta({ primaryLabel: 'Back to home', primaryUrl: '/', secondaryLabel: 'Free dinner plans', secondaryUrl: '/page' })}
          </div>`}
        />
      </ContentSection>
      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- registry ----------

type PageBuilder = (brand: string, images: Record<string, SiteImage>) => ReactNode;

const PAGE_BUILDERS: Record<string, PageBuilder> = {
  // System pages
  index:                 (brand, images) => <HomePage brand={brand} images={images} />,
  about:                 (brand, images) => <AboutPage brand={brand} images={images} />,
  page:                  (brand, images) => <FreebiePage brand={brand} images={images} />,
  thank_you:             (brand)         => <ThankYouPage brand={brand} />,
  contact:               (brand)         => <ContactPage brand={brand} />,
  blog:                  (brand)         => <BlogPage brand={brand} />,
  blog_post:             (brand)         => <BlogPostPage brand={brand} />,
  '404':                 (brand)         => <NotFoundPage brand={brand} />,
  // Custom pages — each gets its own templates/<name>.liquid + content_for_<name>
  family_table_method:   (brand, images) => <FamilyTableMethodPage brand={brand} images={images} />,
  weekly_dinner_club:    (brand, images) => <MembershipPage brand={brand} images={images} />,
  library:               (brand, images) => <LibraryPage brand={brand} images={images} />,
  podcast:               (brand, images) => <PodcastPage brand={brand} images={images} />,
  community:             (brand, images) => <CommunityPage brand={brand} images={images} />,
};

const ALL_PAGES: PageKey[] = [
  // System
  'index', 'about', 'page', 'thank_you', 'contact', 'blog', 'blog_post', '404',
  // Custom
  'family_table_method', 'weekly_dinner_club', 'library', 'podcast', 'community',
];

// ---------- THEME SETTINGS (Kajabi-wide branding) ----------

const SUNDAY_TABLE_THEME_SETTINGS: Record<string, string> = {
  background_color: CREAM,
  color_primary: TERRA,
  font_family_heading: 'DM Serif Display',
  font_weight_heading: '400',
  line_height_heading: '1.05',
  font_family_body: 'Work Sans',
  font_weight_body: '400',
  line_height_body: '1.65',
  color_heading: INK,
  color_body: BODY,
  color_body_secondary: '#8B7E72',
  color_placeholder: '#BCB0A4',
  font_size_h1_desktop: '64px',
  font_size_h2_desktop: '46px',
  font_size_h3_desktop: '28px',
  font_size_h4_desktop: '22px',
  font_size_body_desktop: '17px',
  font_size_h1_mobile: '40px',
  font_size_h2_mobile: '32px',
  font_size_h3_mobile: '24px',
  font_size_h4_mobile: '20px',
  font_size_body_mobile: '16px',
  btn_style: 'solid',
  btn_size: 'medium',
  btn_width: 'auto',
  btn_border_radius: '50',
  btn_text_color: '#FFFFFF',
  btn_background_color: TERRA,
};

const SUNDAY_TABLE_CUSTOM_CSS = `
/* Sunday Table School — system page polish */
body { background: ${CREAM}; color: ${BODY}; }
a { color: ${TERRA_DEEP}; }
a:hover { color: ${INK}; }

/* Branded form inputs */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
textarea,
select {
  border: 1px solid rgba(42,33,27,0.15) !important;
  border-radius: 12px !important;
  background: #FFFFFF !important;
  color: ${INK} !important;
  font-family: 'Work Sans', sans-serif !important;
  padding: 14px 16px !important;
}
input:focus, textarea:focus, select:focus {
  border-color: ${TERRA_DEEP} !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(196,116,77,0.15) !important;
}

/* Buttons across system pages — pill, terracotta, warm */
button,
.button,
input[type="submit"],
.btn-primary {
  border-radius: 999px !important;
  font-family: 'Work Sans', sans-serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
}

/* Headings on system pages */
h1, h2, h3, h4, h5, h6 {
  font-family: 'DM Serif Display', Georgia, serif !important;
  font-weight: 400 !important;
  letter-spacing: -0.015em !important;
  color: ${INK} !important;
}

/* Library / store product cards */
.product-card, .library-card, .course-card {
  border-radius: 22px !important;
  background: #FFFFFF !important;
  box-shadow: 0 4px 16px rgba(42,33,27,0.06) !important;
  border: 1px solid rgba(42,33,27,0.05) !important;
}
`;

export const sundayTableTemplate: TemplateDef = {
  id: 'sunday-table',
  label: 'Sunday Table School',
  description: 'Warm family-cooking education brand — cream, terracotta, olive. 13 real pages with a freebie funnel, signature program, membership, podcast, and community.',
  pageKeys: ALL_PAGES,
  imageSlots: IMAGE_SLOTS,
  themeSettings: SUNDAY_TABLE_THEME_SETTINGS,
  customCss: SUNDAY_TABLE_CUSTOM_CSS,
  fonts: { heading: 'DM Serif Display', body: 'Work Sans' },
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
