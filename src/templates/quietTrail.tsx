/**
 * Quiet Trail Wellness — premium calm-wellness brand.
 *
 * Aesthetic: soft sage, warm sand, muted stone, dusty blue, creamy white.
 * Cormorant Garamond display + Inter body. Spacious, refined, grounding.
 *
 * Pages (per `mem://reference/kajabi-page-creation.md`):
 *   System: index, about, contact, blog, blog_post, thank_you, 404
 *   Custom: freebie, signature_method, membership, podcast, library, community
 *
 * Imagery is shipped with the template via /src/assets — DB image slots
 * (when present) override the defaults so the user can swap any photo.
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
  Form,
  Accordion,
  PricingCard,
  LinkList,
  SocialIcons,
  Copyright,
} from '@/blocks';
import type { Site, PageKey } from '@/lib/siteStore';
import type { SiteImage } from '@/lib/imageStore';
import type { TemplateDef, ImageSlotDef } from '@/lib/templates';

// Template images live in the public `site-images` Supabase bucket so the
// URLs survive both the live preview AND the exported Kajabi theme — Kajabi
// imports the URLs as-is and serves them directly from our CDN.
const QT_CDN = 'https://iqxcgazfrydubrvxmnlv.supabase.co/storage/v1/object/public/site-images/templates/quiet-trail';
const imgHomeHero       = `${QT_CDN}/qt-home-hero.jpg`;
const imgHomeBedroom    = `${QT_CDN}/qt-home-bedroom.jpg`;
const imgHomeFlatlay    = `${QT_CDN}/qt-home-flatlay.jpg`;
const imgHomeMovement   = `${QT_CDN}/qt-home-movement.jpg`;
const imgAboutPortrait  = `${QT_CDN}/qt-about-portrait.jpg`;
const imgAboutLifestyle = `${QT_CDN}/qt-about-lifestyle.jpg`;
const imgFreebie        = `${QT_CDN}/qt-freebie.jpg`;
const imgSignature      = `${QT_CDN}/qt-signature.jpg`;
const imgMembership     = `${QT_CDN}/qt-membership.jpg`;
const imgPodcast        = `${QT_CDN}/qt-podcast.jpg`;
const imgContact        = `${QT_CDN}/qt-contact.jpg`;
const imgCommunity      = `${QT_CDN}/qt-community.jpg`;

// ---------- image slots ----------

const IMAGE_SLOTS: ImageSlotDef[] = [
  { key: 'homeHero',       label: 'Home hero',         description: 'Side image in the homepage hero.',     defaultPrompt: 'Peaceful morning wellness scene with herbal tea, linen blanket, journal and soft natural light, sage and sand palette', aspect: '4:3' },
  { key: 'homeBedroom',    label: 'Calm bedroom',      description: 'Sleep / evening section image.',       defaultPrompt: 'Calm modern bedroom with neutral linen bedding, sheer window light, dusty blue accents, serene wellness mood', aspect: '4:3' },
  { key: 'homeFlatlay',    label: 'Self-care flat lay', description: 'Featured free resource section.',     defaultPrompt: 'Top-down minimal self-care flat lay: notebook, candle, herbal tea, dried stems on linen, sage and sand tones', aspect: '1:1' },
  { key: 'homeMovement',   label: 'Gentle movement',   description: 'Transformation section image.',        defaultPrompt: 'Calm woman gently stretching by a tall window, soft sheer curtains, neutral linen activewear, plant nearby', aspect: '4:3' },
  { key: 'aboutPortrait',  label: 'About portrait',    description: 'Founder portrait on About page.',      defaultPrompt: 'Warm portrait of female wellness founder in cream knit, neutral room, soft daylight, modern brand photography', aspect: '3:4' },
  { key: 'aboutLifestyle', label: 'About lifestyle',   description: 'Secondary About lifestyle photo.',     defaultPrompt: 'Founder by window with tea and journal, linen dress, plants, soft editorial light, refined wellness aesthetic', aspect: '4:3' },
  { key: 'freebie',        label: 'Freebie hero',      description: 'Hero on opt-in page.',                 defaultPrompt: 'Elegant evening self-care: book, ceramic mug, candlelight, neutral bedroom styling, sage and sand', aspect: '4:3' },
  { key: 'signature',      label: 'Signature program', description: 'Hero on signature sales page.',        defaultPrompt: 'Premium online wellness course mockup with workbook and laptop dashboard, sage and cream tones', aspect: '16:9' },
  { key: 'membership',     label: 'Membership',        description: 'Hero on membership page.',             defaultPrompt: 'Cozy wellness corner with sage throw, ceramic mug, laptop showing calm member dashboard, soft afternoon light', aspect: '4:3' },
  { key: 'podcast',        label: 'Podcast',           description: 'Hero on podcast page.',                defaultPrompt: 'Stylish podcast microphone on neutral desk with notebook and ceramic mug, sage and sand palette', aspect: '4:3' },
  { key: 'contact',        label: 'Contact',           description: 'Image on the contact page.',           defaultPrompt: 'Welcoming wellness workspace with laptop, journal, ceramic mug, candle and small plant, calm sage and beige palette', aspect: '4:3' },
  { key: 'community',      label: 'Community',         description: 'Hero on community page.',              defaultPrompt: 'Gentle online wellness community on a laptop screen, ceramic mug and notebook beside it, sage and cream', aspect: '4:3' },
];

// ---------- design tokens ----------

const SERIF = `'Tenor Sans', 'Cormorant Garamond', Georgia, serif`;
const SANS  = `'Lora', Georgia, 'Times New Roman', serif`;

const INK         = '#2A2E2B';   // soft deep ink
const BODY        = '#5C625C';   // muted stone body
const CREAM       = '#FBF8F2';   // page bg
const CREAM_2     = '#F2EDE3';   // alt section bg
const PANEL       = '#FFFFFF';
const SAGE        = '#A6B8A2';   // soft sage signature
const SAGE_DEEP   = '#7C9479';   // deep sage CTA
const SAGE_SOFT   = '#E5EBDF';   // pale sage panel
const SAND        = '#E6D9C2';   // warm sand accent
const STONE       = '#C8C2B5';   // muted stone
const DUSTY_BLUE  = '#A9BDC4';   // dusty blue accent
const GOLD_TEXT   = '#B58E5E';   // warm accent for italic emphasis

const PILL_PRIMARY = `linear-gradient(135deg, ${SAGE_DEEP} 0%, #6A8268 100%)`;

// ---------- inline HTML helpers ----------

function pillCta(opts: {
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  align?: 'left' | 'center';
  onDark?: boolean;
}) {
  const justify = opts.align === 'left' ? 'flex-start' : 'center';
  const secondaryColor = opts.onDark ? '#FFFFFF' : INK;
  const secondaryBorder = opts.onDark ? 'rgba(255,255,255,0.45)' : 'rgba(42,46,43,0.18)';
  return `
    <div style="display:flex;gap:12px;justify-content:${justify};flex-wrap:wrap;margin-top:32px">
      <a href="${opts.primaryUrl}" style="display:inline-flex;align-items:center;gap:8px;background:${PILL_PRIMARY};color:#FFFFFF;padding:15px 30px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS};box-shadow:0 6px 20px rgba(124,148,121,0.35);letter-spacing:0.01em">
        ${opts.primaryLabel}<span style="font-size:14px">→</span>
      </a>
      ${opts.secondaryLabel ? `
      <a href="${opts.secondaryUrl ?? '#'}" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:${secondaryColor};padding:15px 30px;border:1.5px solid ${secondaryBorder};border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;font-family:${SANS}">
        ${opts.secondaryLabel}
      </a>` : ''}
    </div>`;
}

function eyebrow(label: string, dotColor = SAGE_DEEP, onDark = false) {
  const color = onDark ? 'rgba(255,255,255,0.78)' : BODY;
  const lineBg = onDark ? 'rgba(255,255,255,0.55)' : dotColor;
  return `<span style="display:inline-flex;align-items:center;gap:10px;font-family:${SANS};font-size:12px;font-weight:600;color:${color};letter-spacing:0.18em;text-transform:uppercase">
    <span style="display:inline-block;width:24px;height:1px;background:${lineBg}"></span>
    ${label}
  </span>`;
}

function quietTile(svg: string, bg = SAGE_SOFT, fg = SAGE_DEEP) {
  return `<div style="width:48px;height:48px;background:${bg};border-radius:14px;display:inline-flex;align-items:center;justify-content:center;color:${fg};margin-bottom:22px">${svg}</div>`;
}

const ICON_LEAF      = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.5 2c.5 2.5.02 4.5-1.1 6.9C15.7 14.4 11 13 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>`;
const ICON_MOON      = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICON_HEART     = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const ICON_SUN       = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const ICON_BOOK      = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M4 19.5V22h16"/></svg>`;
const ICON_USERS     = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const ICON_HEADPHONE = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-7h3v5zM3 19a2 2 0 0 0 2 2h1v-7H3v5z"/></svg>`;
const ICON_MIC       = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></svg>`;
const ICON_FEATHER   = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8L2 22M17.5 15H9"/></svg>`;
const ICON_CHECK     = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICON_MAIL      = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;

// ---------- shared chrome ----------

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'The Method', url: '/signature-method' },
  { label: 'Membership', url: '/membership' },
  { label: 'Podcast', url: '/podcast' },
  { label: 'Journal', url: '/blog' },
  { label: 'Free Guide', url: '/freebie' },
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
      paddingDesktop={{ top: '80', bottom: '40' }}
      verticalLayout
    >
      <Logo type="text" text={brand} textColor="#FFFFFF" />
      <LinkList heading="Explore" handle="footer-explore" layout="vertical" />
      <LinkList heading="Programs" handle="footer-programs" layout="vertical" />
      <LinkList heading="Company" handle="footer-company" layout="vertical" />
      <SocialIcons instagram="https://instagram.com" pinterest="https://pinterest.com" />
      <Copyright text={`${brand}. Gentle wellness, steady living.`} />
    </FooterSection>
  );
}

// ---------- HOME ----------

function HomePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.homeHero;
  const bedroom = images.homeBedroom;
  const flatlay = images.homeFlatlay;
  const movement = images.homeMovement;

  return (
    <>
      <SharedHeader brand={brand} />

      {/* Hero */}
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Calm wellness for everyday life')}
            <h1 style="font-family:${SERIF};font-size:68px;line-height:1.04;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              Gentle wellness support for <em style="color:${SAGE_DEEP};font-weight:500">busy people</em> who want to feel calmer and sleep better.
            </h1>
            <p style="max-width:520px;margin:28px 0 0;font-size:18px;line-height:1.7;color:${BODY}">
              ${brand} helps you build simple routines for stress relief, better rest, and a steadier daily rhythm — without pressure, perfection, or overwhelm.
            </p>
            ${pillCta({ primaryLabel: 'Get the Free Reset Guide', primaryUrl: '/freebie', secondaryLabel: 'Explore Programs', secondaryUrl: '/signature-method', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      {/* Reassurance band */}
      <ContentSection name="Reassurance band" background={SAGE_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto">
            ${eyebrow('A gentle reminder')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.12;font-weight:500;color:${INK};margin:20px 0 0;letter-spacing:-0.01em">
              Wellness <em style="color:${SAGE_DEEP}">does not have to be</em> complicated.
            </h2>
            <p style="max-width:600px;margin:24px auto 0;font-size:17px;line-height:1.75;color:${BODY}">
              You don't need a perfect morning routine, an elaborate supplement stack, or another app. You need a few simple practices that fit your real life — and the breathing room to actually do them.
            </p>
          </div>`}
        />
      </ContentSection>

      {/* Offers overview */}
      <ContentSection name="Offers overview" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 64px">
            ${eyebrow('Ways to begin')}
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:${INK};margin:20px 0 0;letter-spacing:-0.01em">
              Gentle paths into a calmer life.
            </h2>
            <p style="margin:18px auto 0;font-size:17px;line-height:1.7;color:${BODY};max-width:520px">Start anywhere — every offer is built around the same idea: small, sustainable practices, made for real days.</p>
          </div>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '34', bottom: '34', left: '32', right: '32' }} boxShadow="small"
          text={`${quietTile(ICON_LEAF)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.16em;text-transform:uppercase;margin-bottom:8px">Free guide</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Calm Evening Reset</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">A simple evening routine to help you unwind and end the day feeling more settled.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '34', bottom: '34', left: '32', right: '32' }} boxShadow="small"
          text={`${quietTile(ICON_SUN)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.16em;text-transform:uppercase;margin-bottom:8px">Mini course · $39</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">5-Day Stress Reset</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">Five short days. One small practice each day. A noticeably calmer week.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '34', bottom: '34', left: '32', right: '32' }} boxShadow="small"
          text={`${quietTile(ICON_BOOK)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.16em;text-transform:uppercase;margin-bottom:8px">Signature program</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Steady Self Method</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">Six modules to build a calm, repeatable wellness rhythm — for real life.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '34', bottom: '34', left: '32', right: '32' }} boxShadow="small"
          text={`${quietTile(ICON_USERS)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.16em;text-transform:uppercase;margin-bottom:8px">Membership · monthly</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Quiet Trail Collective</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">A monthly wellness home — themes, guided audio, live check-ins, and a quiet member space.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '34', bottom: '34', left: '32', right: '32' }} boxShadow="small"
          text={`${quietTile(ICON_HEADPHONE)}<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.16em;text-transform:uppercase;margin-bottom:8px">Digital bundle · $79</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">The Guided Audio Library</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">Twenty short audio sessions for stress relief, sleep, breath, and steady focus.</p>`}
        />
      </ContentSection>

      {/* Transformation */}
      <ContentSection name="Transformation" background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        {movement && <Image src={movement.url} alt={movement.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('What changes')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              From <em style="color:${SAGE_DEEP}">overstimulated</em> to steady.
            </h2>
            <ul style="list-style:none;padding:0;margin:32px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'Your evenings feel softer — and you fall asleep with less effort.',
                'You have a few simple ways to settle when stress shows up.',
                'You stop chasing the perfect routine and find one that fits your real life.',
                'You feel more present in the small everyday moments.',
                'You build a steady rhythm that supports — not pressures — you.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${SAGE_DEEP};margin-top:3px;flex-shrink:0">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      {/* Founder intro */}
      <ContentSection name="Founder intro" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto">
            ${eyebrow('Meet your guide')}
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:${INK};margin:20px 0 0;letter-spacing:-0.01em">
              Hi, I'm <em style="color:${SAGE_DEEP}">Nora Hale</em>.
            </h2>
            <p style="max-width:560px;margin:26px auto 0;font-size:17px;line-height:1.8;color:${BODY}">
              A few years ago I was a corporate project manager running on caffeine, deadlines, and the quiet certainty that I was going to burn out. Eventually I did. ${brand} is what I built on the other side — a calmer, more sustainable way to take care of yourself, made from the small daily practices that actually helped me come back to myself.
            </p>
            <div style="margin-top:30px"><a href="/about" style="font-family:${SANS};font-size:14px;font-weight:600;color:${SAGE_DEEP};text-decoration:underline;text-underline-offset:6px">Read the full story →</a></div>
          </div>`}
        />
      </ContentSection>

      {/* Testimonials */}
      <ContentSection name="Testimonials" background={SAGE_SOFT} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Notes from the trail')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Calmer days, in their own words.
            </h2>
          </div>`}
        />
        <Text width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"I expected another wellness program. What I got was permission to slow down — and a few practices I actually still use months later."</p><div style="font-weight:700;font-size:14px;color:${INK}">Eliza M. · Marketing director</div></div>`}
        />
        <Text width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"The evening reset alone changed my sleep. I didn't need to overhaul my life — I just needed to lower the volume."</p><div style="font-weight:700;font-size:14px;color:${INK}">Jordan P. · Nurse practitioner</div></div>`}
        />
        <Text width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '32', bottom: '32', left: '30', right: '30' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:20px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"Nora teaches the kind of wellness that survives a busy week. Steady. Doable. Quietly powerful."</p><div style="font-weight:700;font-size:14px;color:${INK}">Maya R. · Designer</div></div>`}
        />
      </ContentSection>

      {/* Featured free resource */}
      <ContentSection name="Featured free resource" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        {flatlay && <Image src={flatlay.url} alt={flatlay.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('A quiet starting place')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              The Calm Evening<br/><em style="color:${SAGE_DEEP}">Reset Guide.</em>
            </h2>
            <p style="margin:24px 0 0;font-size:17px;line-height:1.75;color:${BODY};max-width:480px">
              A simple evening routine to help you unwind, sleep better, and end the day feeling more settled. Free and gentle — no overwhelm.
            </p>
            ${pillCta({ primaryLabel: 'Send me the guide', primaryUrl: '/freebie', align: 'left' })}
          </div>`}
        />
      </ContentSection>

      {/* Final CTA */}
      <ContentSection name="Final CTA" background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '120', bottom: '120' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            ${eyebrow('Ready when you are', SAGE, true)}
            <h2 style="font-family:${SERIF};font-size:64px;line-height:1.05;font-weight:500;color:#FFFFFF;margin:18px auto 0;max-width:780px;letter-spacing:-0.015em">
              A calmer life starts with <em style="color:${SAND}">one small step.</em>
            </h2>
            <p style="max-width:520px;margin:24px auto 0;font-size:17px;line-height:1.75;color:rgba(255,255,255,0.86)">Start with the free guide, or take a longer path through one of our programs. We'll be here either way.</p>
            ${pillCta({ primaryLabel: 'Get the Free Reset Guide', primaryUrl: '/freebie', secondaryLabel: 'Explore Programs', secondaryUrl: '/signature-method', onDark: true })}
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

      <ContentSection name="About hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('About the founder')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.06;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              I built ${brand}<br/><em style="color:${SAGE_DEEP}">on the other side of burnout.</em>
            </h1>
            <p style="max-width:540px;margin:26px 0 0;font-size:18px;line-height:1.78;color:${BODY}">
              I'm Nora Hale. For ten years I ran projects in corporate tech — long days, full inbox, the quiet kind of stress that lives in your shoulders. Eventually my body decided enough. The slow climb back was where ${brand} began.
            </p>
          </div>`}
        />
        {portrait && <Image src={portrait.url} alt={portrait.alt} colWidth="5" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection name="Founder story" background={CREAM_2} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="left" width="12"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto;color:${BODY};font-size:18px;line-height:1.85">
            <p>What I noticed during recovery: the wellness world was either intense, expensive, or impossible to keep up with. I didn't need a 5am ice bath protocol. I needed a few simple practices I could actually do on a Wednesday.</p>
            <p style="margin-top:22px">${brand} is built around that idea. Steady, sustainable, gentle. Wellness that fits inside a real life — not a curated one. We talk about stress, rest, daily rhythm, and gentle movement, in plain language and without pressure.</p>
            <p style="margin-top:22px">This isn't a medical brand. I'm not your doctor or therapist. I'm an educator and a guide — the calm voice in your ear when you've forgotten that small things, done steadily, really do change how a life feels.</p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Beliefs grid" background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 56px">
            ${eyebrow('What I believe')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A few quiet beliefs about wellness.</h2>
          </div>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Small things, done steadily, change a life.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">A two-minute breathing practice you actually do beats a forty-minute one you don't.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Rest is not a reward — it's a requirement.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">Your nervous system needs regular breathing room. We build that into the rhythm on purpose.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Wellness should fit your real life.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">If a routine only works on a perfect day, it's not actually a routine. We design for normal weeks.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Calm is built, not bought.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">No supplement, app, or planner replaces a few small practices, repeated kindly, over time.</p>`}
        />
      </ContentSection>

      <ContentSection name="Personal notes" background={CREAM_2} paddingDesktop={{ top: '90', bottom: '90' }}>
        {lifestyle && <Image src={lifestyle.url} alt={lifestyle.alt} colWidth="6" imageBorderRadius="24" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.12;font-weight:500;color:${INK};margin:0;letter-spacing:-0.01em">A few small things about me.</h2>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:14px;font-size:16px;line-height:1.6;color:${INK}">
              <li>· I read paper books in the evening — phones live in another room.</li>
              <li>· I walk every morning, slowly, with no podcast on.</li>
              <li>· I trained as a yoga instructor after burnout, then realized I mostly love stretching by a window.</li>
              <li>· I believe gentle progress is still progress.</li>
            </ul>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="About CTA" background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:52px;line-height:1.08;font-weight:500;color:#FFFFFF;margin:0;letter-spacing:-0.015em">Want a gentle place to start?</h2>
            <p style="max-width:520px;margin:22px auto 0;font-size:17px;line-height:1.75;color:rgba(255,255,255,0.86)">The Calm Evening Reset is the smallest, kindest first step we offer.</p>
            ${pillCta({ primaryLabel: 'Get the free guide', primaryUrl: '/freebie', secondaryLabel: 'Explore the Method', secondaryUrl: '/signature-method', onDark: true })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- FREEBIE OPT-IN (custom page: freebie) ----------

function FreebiePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.freebie;
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection name="Freebie opt-in" background={CREAM} paddingDesktop={{ top: '90', bottom: '100' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Free guide · instant download')}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              A simple evening routine to help you unwind, sleep better, and end the day <em style="color:${SAGE_DEEP}">more settled.</em>
            </h1>
            <p style="max-width:520px;margin:26px 0 0;font-size:17px;line-height:1.75;color:${BODY}">
              The Calm Evening Reset Guide is a short, beautifully designed PDF you can use tonight. No app, no overwhelm — just a few small practices that quiet the day.
            </p>
            <ul style="list-style:none;padding:0;margin:30px 0 0;display:flex;flex-direction:column;gap:12px">
              ${[
                'Easy steps to help your body and mind slow down',
                'A more peaceful transition into the evening',
                'Less stress at the end of the day',
                'Gentle wellness support that feels doable',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${SAGE_DEEP};margin-top:3px;flex-shrink:0">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
            <p style="margin-top:26px;font-size:14px;color:${BODY};font-style:italic">Truly simple. No 27-step protocol. We promise.</p>
          </div>`}
        />
        <Text width="5" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '36', bottom: '36', left: '34', right: '34' }} boxShadow="medium"
          text={`<div style="font-family:${SANS}">
            <div style="font-family:${SERIF};font-size:28px;font-weight:600;color:${INK};line-height:1.2;margin:0 0 8px">Send me the guide</div>
            <p style="margin:0 0 20px;font-size:14px;color:${BODY};line-height:1.6">Add your email and we'll send the PDF straight to your inbox. Unsubscribe anytime.</p>
          </div>`}
        />
        <Form
          formId=""
          buttonBackgroundColor={SAGE_DEEP}
          buttonTextColor="#FFFFFF"
          width="5"
        />
      </ContentSection>

      {hero && (
        <ContentSection name="Freebie preview" background={CREAM_2} paddingDesktop={{ top: '90', bottom: '90' }}>
          <Image src={hero.url} alt={hero.alt} colWidth="12" imageBorderRadius="28" align="center" />
        </ContentSection>
      )}

      <ContentSection name="Freebie testimonial" background={SAGE_SOFT} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('What people say')}
            <h2 style="font-family:${SERIF};font-size:40px;line-height:1.15;font-weight:500;color:${INK};margin:18px 0 24px">
              "I read it on Sunday. I'd already used it three times by Wednesday."
            </h2>
            <div style="font-family:${SANS};font-size:14px;font-weight:700;color:${INK}">— Hannah K.</div>
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

      <ContentSection name="Thank you" background={CREAM} paddingDesktop={{ top: '120', bottom: '60' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('Your guide is on its way')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.06;font-weight:500;color:${INK};margin:20px 0 0;letter-spacing:-0.015em">
              Lovely. <em style="color:${SAGE_DEEP}">Thank you.</em>
            </h1>
            <p style="max-width:520px;margin:24px auto 0;font-size:17px;line-height:1.75;color:${BODY}">
              The Calm Evening Reset Guide is heading to your inbox now. It usually arrives within a few minutes — if you don't see it, check your promotions or spam folder.
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Thank you upsell" background={CREAM_2} paddingDesktop={{ top: '60', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 48px">
            ${eyebrow('A small next step')}
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Want to feel a little calmer by Friday?
            </h2>
            <p style="max-width:560px;margin:22px auto 0;font-size:17px;line-height:1.75;color:${BODY}">The 5-Day Stress Reset is our gentlest paid offer. One short practice each day for five days — built to lower the volume on a busy week.</p>
          </div>`}
        />
        <Text width="8" align="left" backgroundColor={PANEL} borderRadius="22" padding={{ top: '36', bottom: '36', left: '38', right: '38' }} boxShadow="small"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
              <span style="font-family:${SANS};font-size:11px;font-weight:700;color:${SAGE_DEEP};letter-spacing:0.16em;text-transform:uppercase">5-Day Stress Reset · $39</span>
            </div>
            <h3 style="font-family:${SERIF};font-size:30px;font-weight:600;color:${INK};margin:0 0 14px;line-height:1.2">Five small practices. One steadier week.</h3>
            <p style="font-size:16px;line-height:1.7;color:${BODY};margin:0 0 24px">A short daily email + a guided audio prompt for five days. Made for busy people who want a real shift without a big commitment.</p>
            ${pillCta({ primaryLabel: 'Start the 5-Day Reset', primaryUrl: '/library', secondaryLabel: 'Maybe later', secondaryUrl: '/', align: 'left' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- SIGNATURE METHOD (custom: signature_method) ----------

function SignatureMethodPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.signature;
  const modules = [
    { n: '01', t: 'Getting Out of Survival Mode', d: 'Recognize the patterns of overstimulation and start lowering the volume — kindly, without forcing it.' },
    { n: '02', t: 'Building a Calmer Morning Rhythm', d: 'A simple, repeatable morning that supports your nervous system instead of front-loading stress.' },
    { n: '03', t: 'Stress Support Throughout the Day', d: 'Small practices you can use at your desk, in the car, or between meetings to settle quickly.' },
    { n: '04', t: 'The Evening Reset', d: 'A gentle wind-down routine for better sleep and a softer end to the day.' },
    { n: '05', t: 'Gentle Movement and Body Awareness', d: 'Short, kind movement practices that don\'t require a gym, a mat, or thirty spare minutes.' },
    { n: '06', t: 'Creating a Sustainable Personal Wellness Plan', d: 'Pull the threads together into a calm rhythm that fits your real life — not a curated one.' },
  ];
  const faqs = [
    { q: 'Is this a fitness program?', a: 'No. The Steady Self Method is a wellness education program focused on stress, sleep, daily rhythm, and gentle movement. There are no workouts to push through.' },
    { q: 'Do I need any equipment or special tools?', a: 'Nothing more than a notebook and a quiet corner. Some practices use a guided audio session, which you can listen to on any device.' },
    { q: 'How long does the program take?', a: 'Most people move through it over 6–10 weeks at a calm pace. Lifetime access is included so you can return to any module whenever life shifts.' },
    { q: 'Is this medical or therapeutic advice?', a: 'No. ${brand} is wellness education — not a substitute for medical care or mental health treatment. If you\'re working with a doctor or therapist, the Method is a complement to that work, not a replacement.' },
    { q: 'Is there a payment plan?', a: 'Yes. Three monthly installments at no extra cost. Pick the option that feels easiest at checkout.' },
    { q: 'What is your refund policy?', a: 'A 14-day no-questions-back guarantee. Try Module 1, see how it feels, and if it isn\'t for you, we\'ll refund you fully.' },
  ];

  return (
    <>
      <SharedHeader brand={brand} />

      {/* Hero */}
      <ContentSection name="Method hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:820px;margin:0 auto">
            ${eyebrow('Signature program')}
            <h1 style="font-family:${SERIF};font-size:72px;line-height:1.05;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              The Steady Self <em style="color:${SAGE_DEEP}">Method.</em>
            </h1>
            <p style="margin:26px auto 0;font-size:19px;line-height:1.7;color:${BODY};max-width:600px">A six-module wellness program to help you create a simple, steady rhythm that reduces stress, supports rest, and makes daily self-care feel sustainable.</p>
            ${pillCta({ primaryLabel: 'Enroll for $297', primaryUrl: '#pricing', secondaryLabel: 'See what\'s inside', secondaryUrl: '#modules' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="12" imageBorderRadius="28" align="center" />}
      </ContentSection>

      {/* Problem / pain */}
      <ContentSection name="Method problem" background={CREAM_2} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow('If this sounds familiar')}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">You don't need another wellness app. <em style="color:${SAGE_DEEP}">You need breathing room.</em></h2>
            <p style="max-width:600px;margin:24px auto 0;font-size:17px;line-height:1.78;color:${BODY}">You've tried the journals, the meditations, the routines. Maybe they helped for a week. Then real life came back — and so did the tightness in your chest. The problem isn't your discipline. It's the size of the practice.</p>
          </div>`}
        />
      </ContentSection>

      {/* Transformation */}
      <ContentSection name="A steadier you" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('What changes')}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A steadier you, by the end.</h2>
          </div>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Calmer mornings.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">A small ritual that sets the tone for the day — without an alarm at 5am.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Better rest.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">An evening reset that helps your body and mind actually wind down.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">Real stress tools.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">Small practices that work in the middle of a busy day, not just on a quiet weekend.</p>`}
        />
        <Feature width="6" align="left" backgroundColor={SAGE_SOFT} borderRadius="22" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 12px">A rhythm you'll keep.</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">A personal wellness plan built for normal weeks — not the perfect one you've been waiting for.</p>`}
        />
      </ContentSection>

      {/* What's included */}
      <ContentSection name="What's included" background={CREAM_2} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('What\'s included')}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Everything you need, nothing extra.</h2>
          </div>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '30', bottom: '30', left: '28', right: '28' }} boxShadow="small"
          text={`${quietTile(ICON_BOOK)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">6 video modules</h3><p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${BODY};margin:0">Short, calm lessons (15–25 minutes each) you can watch on any device.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '30', bottom: '30', left: '28', right: '28' }} boxShadow="small"
          text={`${quietTile(ICON_HEADPHONE)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">12 guided audio sessions</h3><p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${BODY};margin:0">Breath, reset, and unwind practices you can do anywhere — eyes open or closed.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '30', bottom: '30', left: '28', right: '28' }} boxShadow="small"
          text={`${quietTile(ICON_FEATHER)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Printable workbook</h3><p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${BODY};margin:0">Beautifully designed worksheets to track tiny shifts and build your personal plan.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '30', bottom: '30', left: '28', right: '28' }} boxShadow="small"
          text={`${quietTile(ICON_USERS)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Community space</h3><p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${BODY};margin:0">A quiet member room to share, ask questions, and feel less alone in the work.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '30', bottom: '30', left: '28', right: '28' }} boxShadow="small"
          text={`${quietTile(ICON_HEART)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Lifetime access</h3><p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${BODY};margin:0">Come back to any module whenever your life shifts. The work is always here.</p>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '30', bottom: '30', left: '28', right: '28' }} boxShadow="small"
          text={`${quietTile(ICON_LEAF)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">Bonus: seasonal resets</h3><p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${BODY};margin:0">Four short seasonal mini-courses to keep your rhythm fresh through the year.</p>`}
        />
      </ContentSection>

      {/* Module breakdown */}
      <ContentSection name="Modules" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }} id="modules">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Inside the program')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.08;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Six gentle modules.</h2>
          </div>`}
        />
        ${''}
        <Text width="10" align="left" backgroundColor={CREAM_2} borderRadius="24" padding={{ top: '20', bottom: '20', left: '20', right: '20' }}
          text={`<div style="font-family:${SANS};display:flex;flex-direction:column;gap:16px">
            ${modules.map(m => `
              <div style="background:${PANEL};border-radius:18px;padding:28px 32px;display:flex;gap:24px;align-items:flex-start">
                <div style="font-family:${SERIF};font-size:34px;font-weight:500;color:${SAGE_DEEP};line-height:1;flex-shrink:0;min-width:54px">${m.n}</div>
                <div>
                  <h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 8px;line-height:1.25">${m.t}</h3>
                  <p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">${m.d}</p>
                </div>
              </div>
            `).join('')}
          </div>`}
        />
      </ContentSection>

      {/* Who it's for */}
      <ContentSection name="Who it's for" background={SAGE_SOFT} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('This is for you if')}
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">You're ready for a kinder approach.</h2>
            <ul style="list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'You feel stretched thin and want a steadier daily rhythm.',
                'You\'ve tried wellness apps and they didn\'t stick.',
                'You want better sleep without an elaborate protocol.',
                'You like calm, beautifully designed materials.',
                'You\'re ready to do small things steadily, instead of big things sporadically.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${SAGE_DEEP};margin-top:3px;flex-shrink:0">${ICON_CHECK}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:20px">
            ${eyebrow('It\'s not for you if')}
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">You're looking for something else.</h2>
            <ul style="list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'You want intense fitness or athletic training.',
                'You\'re looking for medical or therapeutic care.',
                'You prefer hype, hustle, or hardline rules.',
                'You want a 5am ice bath protocol with full optimization.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="color:${STONE};margin-top:3px;flex-shrink:0">·</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      {/* Testimonials */}
      <ContentSection name="Method testimonials" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('From students')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A steadier life, in their words.</h2>
          </div>`}
        />
        <Text width="6" align="left" backgroundColor={CREAM_2} borderRadius="20" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:22px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"By module three I'd stopped scrolling at midnight. By module five I'd built an actual rhythm. The Method genuinely changed how my weeks feel."</p><div style="font-weight:700;font-size:14px;color:${INK}">Saoirse L. · UX researcher</div></div>`}
        />
        <Text width="6" align="left" backgroundColor={CREAM_2} borderRadius="20" padding={{ top: '32', bottom: '32', left: '32', right: '32' }}
          text={`<div style="font-family:${SANS}"><p style="font-family:${SERIF};font-size:22px;line-height:1.5;color:${INK};margin:0 0 24px;font-style:italic;font-weight:500">"It's the most beautiful and the least bossy wellness program I've ever taken. Nora teaches like a friend who's been there."</p><div style="font-weight:700;font-size:14px;color:${INK}">Devon R. · Operations lead</div></div>`}
        />
      </ContentSection>

      {/* FAQ */}
      <ContentSection name="Method FAQ" background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 48px">
            ${eyebrow('Questions, gently answered')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Things people ask.</h2>
          </div>`}
        />
        {faqs.map((f, i) => (
          <Accordion
            key={i}
            heading={f.q}
            body={`<div style="font-family:${SANS};font-size:16px;line-height:1.7;color:${BODY}">${f.a}</div>`}
            width="8"
            backgroundColor="#FFFFFF"
            borderRadius="16"
            boxShadow="small"
            padding={{ top: '24', right: '28', bottom: '24', left: '28' }}
            iconColor={SAGE_DEEP}
          />
        ))}
      </ContentSection>

      {/* Pricing */}
      <ContentSection name="Method pricing" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }} id="pricing">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Pricing')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.08;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">One calm price. Lifetime access.</h2>
          </div>`}
        />
        <PricingCard
          width="6"
          heading="Pay in full"
          price="$297"
          priceCaption="One payment · save $30"
          text="<ul><li>All 6 modules + bonuses</li><li>12 guided audio sessions</li><li>Printable workbook</li><li>Lifetime access</li><li>Member community</li></ul>"
          buttonText="Enroll for $297"
          buttonUrl="#"
          brandColor={SAGE_DEEP}
        />
        <PricingCard
          width="6"
          heading="3-payment plan"
          price="$109"
          priceCaption="3 monthly payments · 0% interest"
          text="<ul><li>All 6 modules + bonuses</li><li>12 guided audio sessions</li><li>Printable workbook</li><li>Lifetime access</li><li>Member community</li></ul>"
          buttonText="Start payment plan"
          buttonUrl="#"
          brandColor={DUSTY_BLUE}
        />
      </ContentSection>

      <ContentSection name="Method final CTA" background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '120', bottom: '120' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            ${eyebrow('A gentle next step', SAGE, true)}
            <h2 style="font-family:${SERIF};font-size:60px;line-height:1.06;font-weight:500;color:#FFFFFF;margin:18px auto 0;max-width:760px;letter-spacing:-0.015em">
              A calmer self isn't far. <em style="color:${SAND}">Begin where you are.</em>
            </h2>
            ${pillCta({ primaryLabel: 'Enroll in The Steady Self Method', primaryUrl: '#pricing', onDark: true })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- MEMBERSHIP (custom: membership) ----------

function MembershipPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.membership;
  const includes = [
    { i: ICON_LEAF, t: 'Monthly wellness themes', d: 'A new gentle theme each month — sleep, stress, nervous system, gentle movement, focus, and more.' },
    { i: ICON_HEADPHONE, t: 'Guided audio sessions', d: 'Two new short audio practices each month, plus a growing library you can access anytime.' },
    { i: ICON_USERS, t: 'Live monthly check-ins', d: 'A calm group call to ask questions, set quiet intentions, and feel a little less alone in the work.' },
    { i: ICON_FEATHER, t: 'Printable tools and trackers', d: 'Beautifully designed worksheets and trackers — practical, gentle, easy to use.' },
    { i: ICON_HEART, t: 'A private member space', d: 'A quiet, off-the-feed community to share, ask, and steady together.' },
    { i: ICON_BOOK, t: 'Mini workshops', d: 'Quarterly workshops on gentle wellness topics — recorded so you can watch on your time.' },
  ];
  const faqs = [
    { q: 'How do I cancel?', a: 'In one click from your member dashboard. No phone calls, no friction. Cancel any time.' },
    { q: 'Is this a fitness membership?', a: 'No. The Quiet Trail Collective is a wellness education membership focused on stress, rest, daily rhythm, and gentle movement.' },
    { q: 'What if I miss a live call?', a: 'All live calls are recorded and posted in the member library within a day or two — and the audio sessions are always on demand.' },
    { q: 'Can I switch from monthly to annual later?', a: 'Yes — anytime. Annual members save two months and get a printed welcome card in the mail.' },
  ];

  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection name="Membership hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Monthly membership')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.06;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              The Quiet Trail <em style="color:${SAGE_DEEP}">Collective.</em>
            </h1>
            <p style="max-width:520px;margin:26px 0 0;font-size:18px;line-height:1.78;color:${BODY}">
              A monthly wellness home for people who want gentle, ongoing support — without an algorithm, a feed, or a fitness leaderboard. Just steady rhythms, real conversation, and breathing room.
            </p>
            ${pillCta({ primaryLabel: 'Join for $24/month', primaryUrl: '#join', secondaryLabel: 'Save with annual', secondaryUrl: '#join', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      {/* What's inside */}
      <ContentSection name="Inside the membership" background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto 56px">
            ${eyebrow('Inside the membership')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A small, generous monthly home.</h2>
          </div>`}
        />
        {includes.map((inc, i) => (
          <Feature key={i} width="4" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '30', bottom: '30', left: '28', right: '28' }} boxShadow="small"
            text={`${quietTile(inc.i)}<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 10px">${inc.t}</h3><p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${BODY};margin:0">${inc.d}</p>`}
          />
        ))}
      </ContentSection>

      {/* Pricing */}
      <ContentSection name="Membership pricing" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }} id="join">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Two ways to join')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.08;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Pick the rhythm that fits.</h2>
          </div>`}
        />
        <PricingCard
          width="6"
          heading="Monthly"
          price="$24"
          priceCaption="per month · cancel anytime"
          text="<ul><li>All monthly themes & content</li><li>Guided audio library</li><li>Live monthly check-ins</li><li>Member community space</li><li>Quarterly mini workshops</li></ul>"
          buttonText="Join monthly"
          buttonUrl="#"
          brandColor={SAGE_DEEP}
        />
        <PricingCard
          width="6"
          heading="Annual"
          price="$240"
          priceCaption="$20/mo · save 2 months"
          text="<ul><li>Everything in monthly</li><li>Two months free</li><li>Printed welcome card</li><li>Early access to new workshops</li><li>Priority support</li></ul>"
          buttonText="Join annual"
          buttonUrl="#"
          brandColor={DUSTY_BLUE}
        />
      </ContentSection>

      {/* FAQ */}
      <ContentSection name="Membership FAQ" background={CREAM_2} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 48px">
            ${eyebrow('Membership questions')}
            <h2 style="font-family:${SERIF};font-size:44px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Things to know before you join.</h2>
          </div>`}
        />
        {faqs.map((f, i) => (
          <Accordion
            key={i}
            heading={f.q}
            body={`<div style="font-family:${SANS};font-size:16px;line-height:1.7;color:${BODY}">${f.a}</div>`}
            width="8"
            backgroundColor="#FFFFFF"
            borderRadius="16"
            boxShadow="small"
            padding={{ top: '24', right: '28', bottom: '24', left: '28' }}
            iconColor={SAGE_DEEP}
          />
        ))}
      </ContentSection>

      <ContentSection name="Membership CTA" background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:#FFFFFF;margin:0;max-width:740px;margin-left:auto;margin-right:auto;letter-spacing:-0.015em">A quieter month, every month.</h2>
            ${pillCta({ primaryLabel: 'Join the Collective', primaryUrl: '#join', onDark: true })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- LIBRARY / MEMBER DASHBOARD ----------

function LibraryPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection name="Library welcome" background={CREAM} paddingDesktop={{ top: '90', bottom: '40' }}>
        <Text align="left" width="12"
          text={`<div style="font-family:${SANS};max-width:1100px;margin:0 auto">
            ${eyebrow('Member library')}
            <h1 style="font-family:${SERIF};font-size:54px;line-height:1.06;font-weight:500;color:${INK};margin:20px 0 0;letter-spacing:-0.015em">
              Welcome back. <em style="color:${SAGE_DEEP}">Take what you need.</em>
            </h1>
            <p style="max-width:560px;margin:18px 0 0;font-size:17px;line-height:1.7;color:${BODY}">Your programs, audio sessions, workshops, trackers, and resources — all in one calm place.</p>
          </div>`}
        />
      </ContentSection>

      {/* Kajabi-native products section — renders the member's real purchased products */}
      <RawSection
        type="products"
        name="Member library"
        settings={{
          background_color: CREAM_2,
          text_align: 'left',
          padding_top_desktop: '60',
          padding_bottom_desktop: '110',
          btn_background_color: SAGE_DEEP,
          btn_text_color: '#FFFFFF',
          btn_border_radius: '999',
        }}
      />

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- BLOG ----------

function BlogPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection name="Journal intro" background={CREAM} paddingDesktop={{ top: '100', bottom: '50' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow('The journal')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.06;font-weight:500;color:${INK};margin:20px 0 0;letter-spacing:-0.015em">
              Quiet writing on <em style="color:${SAGE_DEEP}">calmer living.</em>
            </h1>
            <p style="margin:22px auto 0;font-size:17px;line-height:1.75;color:${BODY};max-width:580px">Short, gentle essays on stress, sleep, daily rhythm, and gentle wellness — read at your own pace.</p>
          </div>`}
        />
      </ContentSection>

      {/* Kajabi-native blog listings — renders the user's real posts */}
      <RawSection
        type="blog_listings"
        name="Posts"
        settings={{
          background_color: CREAM,
          layout_style: 'grid',
          sidebar_on_right: 'true',
          padding_top_desktop: '40',
          padding_bottom_desktop: '110',
          btn_background_color: SAGE_DEEP,
          btn_text_color: '#FFFFFF',
          btn_border_radius: '999',
        }}
        blocks={{
          sb_search: { type: 'sidebar_search', settings: {} },
          sb_categories: { type: 'sidebar_categories', settings: {} },
        }}
        blockOrder={['sb_search', 'sb_categories']}
      />

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- BLOG POST ----------

function BlogPostPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />

      {/* Kajabi-native blog post body — renders the real post title, author, date, content */}
      <RawSection
        type="blog_post_body"
        name="Post"
        settings={{
          background_color: CREAM,
          padding_top_desktop: '80',
          padding_bottom_desktop: '90',
          sidebar_on_right: 'true',
        }}
      />

      {/* Branded outro — newsletter nudge */}
      <ContentSection name="Newsletter nudge" background={CREAM_2} paddingDesktop={{ top: '90', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto">
            ${eyebrow('Keep reading', SAGE_DEEP)}
            <h2 style="font-family:${SERIF};font-size:38px;font-weight:500;color:${INK};margin:18px 0 12px;letter-spacing:-0.01em">A short, calm note in your inbox.</h2>
            <p style="font-size:16px;line-height:1.7;color:${BODY};margin:0 0 28px">One gentle essay every other Sunday. No noise.</p>
            ${pillCta({ primaryLabel: 'Get the free reset guide', primaryUrl: '/freebie', align: 'center' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}


// ---------- PODCAST (custom: podcast) ----------

function PodcastPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.podcast;
  const episodes = [
    { n: '028', t: 'When rest feels uncomfortable', d: 'A short episode on why slowing down can feel worse before it feels better — and what to do about it.', dur: '24 min' },
    { n: '027', t: 'A gentler morning rhythm', d: 'Five tiny shifts I\'ve made to my mornings that have made the biggest difference.', dur: '31 min' },
    { n: '026', t: 'Sleep as a wellness practice', d: 'How I think about evenings now — and the three small things I do every night.', dur: '28 min' },
    { n: '025', t: 'On burnout, in retrospect', d: 'A more honest conversation about what burnout taught me — and what I wish I\'d known sooner.', dur: '38 min' },
  ];
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection name="Podcast hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Podcast')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.06;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              The Steady Living <em style="color:${SAGE_DEEP}">Podcast.</em>
            </h1>
            <p style="max-width:520px;margin:26px 0 0;font-size:18px;line-height:1.78;color:${BODY}">
              Honest, gentle conversations on stress relief, nervous system support, better sleep, burnout recovery, and the small daily practices that actually help.
            </p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:32px">
              <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:${INK};color:#FFFFFF;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;font-family:${SANS}">Apple Podcasts</a>
              <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:${SAGE_DEEP};color:#FFFFFF;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;font-family:${SANS}">Spotify</a>
              <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:${INK};padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;font-family:${SANS};border:1.5px solid rgba(42,46,43,0.18)">Overcast</a>
            </div>
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      {/* Topics */}
      <ContentSection name="Podcast topics" background={SAGE_SOFT} paddingDesktop={{ top: '80', bottom: '80' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow('We talk about')}
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.15;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              Stress relief · nervous system support · better sleep · burnout recovery · realistic routines · gentle self-care
            </h2>
          </div>`}
        />
      </ContentSection>

      {/* Episodes */}
      <ContentSection name="Recent episodes" background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Recent episodes')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">Listen in.</h2>
          </div>`}
        />
        <Text width="10" align="left"
          text={`<div style="font-family:${SANS};display:flex;flex-direction:column;gap:16px;max-width:900px;margin:0 auto">
            ${episodes.map(e => `
              <a href="#" style="display:flex;gap:24px;align-items:center;background:${PANEL};border-radius:18px;padding:24px 28px;text-decoration:none;color:inherit;border:1px solid rgba(42,46,43,0.06);box-shadow:0 4px 14px rgba(42,46,43,0.04)">
                <div style="font-family:${SERIF};font-size:30px;font-weight:500;color:${SAGE_DEEP};line-height:1;flex-shrink:0;min-width:60px">${e.n}</div>
                <div style="flex:1">
                  <h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 8px;line-height:1.25">${e.t}</h3>
                  <p style="font-family:${SANS};font-size:14px;line-height:1.6;color:${BODY};margin:0">${e.d}</p>
                </div>
                <div style="font-family:${SANS};font-size:13px;color:${BODY};flex-shrink:0">${e.dur}</div>
              </a>
            `).join('')}
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Podcast CTA" background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('A small first step', SAGE, true)}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:500;color:#FFFFFF;margin:18px auto 0;letter-spacing:-0.015em">Get the free guide that pairs with the show.</h2>
            ${pillCta({ primaryLabel: 'Get the Calm Evening Reset', primaryUrl: '/freebie', onDark: true })}
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

      <ContentSection name="Community hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('The community')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.06;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              A quiet place <em style="color:${SAGE_DEEP}">to steady together.</em>
            </h1>
            <p style="max-width:520px;margin:26px 0 0;font-size:18px;line-height:1.78;color:${BODY}">
              The Quiet Trail Collective community is a private, off-the-feed space where members share routine wins, real struggles, gentle questions, and steady encouragement. It's not loud. That's the point.
            </p>
            ${pillCta({ primaryLabel: 'Join through the membership', primaryUrl: '/membership', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="28" align="center" />}
      </ContentSection>

      <ContentSection name="Why community matters" background={CREAM_2} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto 56px">
            ${eyebrow('Why community matters')}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              You don't have to do this alone.
            </h2>
            <p style="margin:22px auto 0;font-size:17px;line-height:1.75;color:${BODY};max-width:580px">Steady, sustainable wellness is a lot easier alongside other people who are doing the same quiet work — without the noise of a public feed.</p>
          </div>`}
        />
        {[
          { i: ICON_HEART, t: 'Routine wins', d: 'Small, real shifts members are noticing — the kind that don\'t make it to social media.' },
          { i: ICON_FEATHER, t: 'Honest struggles', d: 'A space to share the weeks that don\'t go as planned — without judgment or fixing.' },
          { i: ICON_BOOK, t: 'Gentle questions', d: 'Ask anything, however small. Other members and Nora respond with care.' },
          { i: ICON_USERS, t: 'Steady encouragement', d: 'The kind of quiet support that helps you keep going — even on the heavy days.' },
        ].map((b, i) => (
          <Feature key={i} width="6" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '30', bottom: '30', left: '30', right: '30' }} boxShadow="small"
            text={`${quietTile(b.i)}<h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${INK};margin:0 0 10px">${b.t}</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">${b.d}</p>`}
          />
        ))}
      </ContentSection>

      <ContentSection name="Community CTA" background={SAGE_DEEP} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.08;font-weight:500;color:#FFFFFF;margin:0;max-width:740px;margin-left:auto;margin-right:auto;letter-spacing:-0.015em">
              Steadier together.
            </h2>
            <p style="max-width:520px;margin:22px auto 0;font-size:17px;color:rgba(255,255,255,0.86);line-height:1.75">Community access is included with The Quiet Trail Collective membership.</p>
            ${pillCta({ primaryLabel: 'Visit the membership', primaryUrl: '/membership', onDark: true })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- CONTACT ----------

function ContactPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.contact;
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection name="Contact hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Get in touch')}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.06;font-weight:500;color:${INK};margin:24px 0 0;letter-spacing:-0.015em">
              We'd love to <em style="color:${SAGE_DEEP}">hear from you.</em>
            </h1>
            <p style="max-width:480px;margin:24px 0 0;font-size:17px;line-height:1.75;color:${BODY}">
              Questions, ideas, or just a hello — write to us anytime. We read every note and reply within two business days.
            </p>
            <div style="margin-top:32px;display:flex;flex-direction:column;gap:14px">
              <div style="display:flex;align-items:center;gap:14px;font-family:${SANS};color:${INK};font-size:15px">
                <span style="color:${SAGE_DEEP}">${ICON_MAIL}</span>
                hello@quiettrail.example
              </div>
              <div style="display:flex;align-items:center;gap:14px;font-family:${SANS};color:${BODY};font-size:14px">
                <span>·</span> Replies within 2 business days
              </div>
            </div>
          </div>`}
        />
        <Form
          formId=""
          buttonBackgroundColor={SAGE_DEEP}
          buttonTextColor="#FFFFFF"
          width="6"
        />
      </ContentSection>

      <ContentSection name="Reasons to write" background={CREAM_2} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:720px;margin:0 auto 48px">
            ${eyebrow('What\'s your note about?')}
            <h2 style="font-family:${SERIF};font-size:40px;line-height:1.12;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">A few common reasons people write.</h2>
          </div>`}
        />
        {[
          { t: 'General question', d: 'Anything you\'re curious about — we welcome all kinds of notes.' },
          { t: 'Program support', d: 'Need help with the Method, the membership, or your account?' },
          { t: 'Speaking request', d: 'For podcasts, summits, retreats, and gentle wellness gatherings.' },
          { t: 'Partnership inquiry', d: 'Brand collaborations and meaningful partnerships within the wellness space.' },
        ].map((c, i) => (
          <Feature key={i} width="6" align="left" backgroundColor={PANEL} borderRadius="20" padding={{ top: '28', bottom: '28', left: '30', right: '30' }} boxShadow="small"
            text={`<h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${INK};margin:0 0 8px">${c.t}</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0">${c.d}</p>`}
          />
        ))}
      </ContentSection>

      {hero && (
        <ContentSection name="Contact image" background={CREAM} paddingDesktop={{ top: '60', bottom: '60' }}>
          <Image src={hero.url} alt={hero.alt} colWidth="12" imageBorderRadius="28" align="center" />
        </ContentSection>
      )}

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- 404 ----------

function NotFoundPage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />

      <ContentSection name="404" background={CREAM} paddingDesktop={{ top: '140', bottom: '140' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:600px;margin:0 auto">
            ${eyebrow('We took a wrong turn')}
            <h1 style="font-family:${SERIF};font-size:96px;line-height:1;font-weight:500;color:${SAGE_DEEP};margin:20px 0 0;letter-spacing:-0.02em">404</h1>
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.15;font-weight:500;color:${INK};margin:18px 0 0;letter-spacing:-0.01em">
              This page seems to have wandered off the trail.
            </h2>
            <p style="margin:22px auto 0;font-size:17px;line-height:1.75;color:${BODY}">
              Let's get you back to a quieter place.
            </p>
            ${pillCta({ primaryLabel: 'Back to home', primaryUrl: '/', secondaryLabel: 'Free guide', secondaryUrl: '/freebie' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- DEFAULT IMAGES (codebase assets shipped with template) ----------

function defaultImage(slot: string, url: string, alt: string): SiteImage {
  return {
    id: `default-${slot}`,
    siteId: '',
    source: 'upload',
    url,
    alt,
    prompt: null,
    slot,
    width: null,
    height: null,
    storagePath: null,
    createdAt: new Date(0).toISOString(),
  };
}

const DEFAULT_IMAGES: Record<string, SiteImage> = {
  homeHero:       defaultImage('homeHero',       imgHomeHero,      'Peaceful morning wellness scene with herbal tea and journal'),
  homeBedroom:    defaultImage('homeBedroom',    imgHomeBedroom,   'Calm modern bedroom with neutral linen bedding'),
  homeFlatlay:    defaultImage('homeFlatlay',    imgHomeFlatlay,   'Minimal self-care flat lay with notebook, candle and tea'),
  homeMovement:   defaultImage('homeMovement',   imgHomeMovement,  'Person stretching gently in a bright peaceful room'),
  aboutPortrait:  defaultImage('aboutPortrait',  imgAboutPortrait, 'Warm portrait of female wellness founder in cream knit'),
  aboutLifestyle: defaultImage('aboutLifestyle', imgAboutLifestyle, 'Founder by window with tea and journal'),
  freebie:        defaultImage('freebie',        imgFreebie,       'Evening self-care scene with book, tea and candlelight'),
  signature:      defaultImage('signature',      imgSignature,     'Premium online wellness course mockup with workbook and laptop'),
  membership:     defaultImage('membership',     imgMembership,    'Cozy wellness corner with sage throw, tea and laptop'),
  podcast:        defaultImage('podcast',        imgPodcast,       'Stylish podcast microphone on calm neutral desk'),
  contact:        defaultImage('contact',        imgContact,       'Welcoming wellness workspace with laptop and journal'),
  community:      defaultImage('community',      imgCommunity,     'Online wellness community on a laptop screen'),
};

/** Merge user-provided DB images over the codebase defaults. DB wins per slot. */
function mergeImages(userImages: Record<string, SiteImage> = {}): Record<string, SiteImage> {
  return { ...DEFAULT_IMAGES, ...userImages };
}

// ---------- page registry ----------

type PageBuilder = (brand: string, images: Record<string, SiteImage>) => ReactNode;

const PAGE_BUILDERS: Record<string, PageBuilder> = {
  // System pages
  index:             (brand, images) => <HomePage brand={brand} images={images} />,
  about:             (brand, images) => <AboutPage brand={brand} images={images} />,
  contact:           (brand, images) => <ContactPage brand={brand} images={images} />,
  blog:              (brand)         => <BlogPage brand={brand} />,
  blog_post:         (brand)         => <BlogPostPage brand={brand} />,
  thank_you:         (brand)         => <ThankYouPage brand={brand} />,
  '404':             (brand)         => <NotFoundPage brand={brand} />,
  // Custom pages
  freebie:           (brand, images) => <FreebiePage brand={brand} images={images} />,
  signature_method:  (brand, images) => <SignatureMethodPage brand={brand} images={images} />,
  membership:        (brand, images) => <MembershipPage brand={brand} images={images} />,
  library:           (brand)         => <LibraryPage brand={brand} />,
  podcast:           (brand, images) => <PodcastPage brand={brand} images={images} />,
  community:         (brand, images) => <CommunityPage brand={brand} images={images} />,
};

const ALL_PAGES: PageKey[] = [
  // System
  'index', 'about', 'contact', 'blog', 'blog_post', 'thank_you', '404',
  // Custom
  'freebie', 'signature_method', 'membership', 'library', 'podcast', 'community',
];

// ---------- THEME SETTINGS ----------

const QUIET_TRAIL_THEME_SETTINGS: Record<string, string> = {
  background_color: CREAM,
  color_primary: SAGE_DEEP,
  font_family_heading: 'Tenor Sans',
  font_weight_heading: '400',
  line_height_heading: '1.15',
  font_family_body: 'Lora',
  font_weight_body: '400',
  line_height_body: '1.75',
  color_heading: INK,
  color_body: BODY,
  color_body_secondary: '#7A8278',
  color_placeholder: '#B8B8B8',
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
  btn_background_color: SAGE_DEEP,
};

const QUIET_TRAIL_CUSTOM_CSS = `
/* Quiet Trail — system page polish */
body { background: ${CREAM}; color: ${BODY}; }
a { color: ${SAGE_DEEP}; }
a:hover { color: ${INK}; }

input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
textarea,
select {
  border: 1px solid rgba(42,46,43,0.14) !important;
  border-radius: 12px !important;
  background: #FFFFFF !important;
  color: ${INK} !important;
  font-family: 'Lora', Georgia, serif !important;
  padding: 14px 16px !important;
}
input:focus, textarea:focus, select:focus {
  border-color: ${SAGE_DEEP} !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(124,148,121,0.18) !important;
}

button,
.button,
input[type="submit"],
.btn-primary {
  border-radius: 999px !important;
  font-family: 'Tenor Sans', sans-serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Tenor Sans', Georgia, serif !important;
  font-weight: 400 !important;
  letter-spacing: 0.01em !important;
  color: ${INK} !important;
}

.product-card, .library-card, .course-card {
  border-radius: 22px !important;
  background: #FFFFFF !important;
  box-shadow: 0 4px 16px rgba(42,46,43,0.06) !important;
  border: 1px solid rgba(42,46,43,0.05) !important;
}
`;

export const quietTrailTemplate: TemplateDef = {
  id: 'quiet-trail',
  label: 'Quiet Trail Wellness',
  description: 'Premium calm-wellness brand — soft sage, warm sand, dusty blue, refined serif. 13 real pages including signature program, membership, podcast, and community.',
  pageKeys: ALL_PAGES,
  imageSlots: IMAGE_SLOTS,
  themeSettings: QUIET_TRAIL_THEME_SETTINGS,
  customCss: QUIET_TRAIL_CUSTOM_CSS,
  fonts: { heading: 'Tenor Sans', body: 'Lora' },
  buildPages: (site: Site, images = {}) => {
    const merged = mergeImages(images);
    const out: Record<string, ReactNode> = {};
    for (const key of ALL_PAGES) {
      if (site.pages[key]?.enabled === false) continue;
      const build = PAGE_BUILDERS[key];
      if (!build) continue;
      out[key] = build(site.brandName, merged);
    }
    return out;
  },
  renderPage: (site: Site, page: PageKey, images = {}) => {
    const merged = mergeImages(images);
    const build = PAGE_BUILDERS[page];
    return build ? build(site.brandName, merged) : null;
  },
};
