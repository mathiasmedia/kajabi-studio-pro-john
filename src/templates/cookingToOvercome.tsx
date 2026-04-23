/**
 * Cooking to Overcome — Aubrey Balmer's wellness/functional-nutrition brand.
 *
 * Aesthetic: warm cream + sand, deep slate ink, terracotta + warm gold accents,
 * sage olive botanical. Marcellus serif + Manrope sans (both unused elsewhere).
 *
 * All imagery is recovered from the live source site at
 * https://cookingtoovercome.mykajabi.com/ via Firecrawl scrape and uploaded
 * to the site-images bucket. See /mnt/documents/cto-inventory.md.
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

const CDN = 'https://iqxcgazfrydubrvxmnlv.supabase.co/storage/v1/object/public/site-images/templates/cooking-to-overcome';
const imgLogo            = `${CDN}/logo.png`;
const imgLogoWhite       = `${CDN}/logo-white.png`;
const imgFounderPortrait = `${CDN}/founder-portrait.jpg`;
const imgFounderKitchen  = `${CDN}/founder-kitchen-veg.jpg`;
const imgFounderPancakes = `${CDN}/founder-pancakes.jpg`;
const imgFounderCookbook = `${CDN}/founder-cookbook-wide.jpg`;
const imgSalmonPour      = `${CDN}/home-hero-v2.jpg`;
const imgBasketVeg       = `${CDN}/basket-veg.jpg`;
const imgSmoothieJar     = `${CDN}/smoothie-jar.jpg`;
const imgAboutBio        = `${CDN}/about-bio-card-1.jpg`;
const imgPactWorkbook    = `${CDN}/mockup-pact-workbook.jpg`;
const img14DayReset      = `${CDN}/mockup-14-day-reset.jpg`;
const imgMetabolicReset  = `${CDN}/mockup-metabolic-reset.jpg`;

// ---------- image slots ----------

const IMAGE_SLOTS: ImageSlotDef[] = [
  { key: 'logo',             label: 'Brand logo',       description: 'Header + footer logo (PNG with transparency).', defaultPrompt: 'Cooking to Overcome navy basket logo on white', aspect: '1:1' },
  { key: 'homeHero',         label: 'Home hero',        description: 'Side image in homepage hero — founder cooking.', defaultPrompt: 'Wellness founder pouring olive oil over salmon, warm natural light', aspect: '4:5' },
  { key: 'homeTransform',    label: 'Transformation',   description: 'Wide image in transformation section.', defaultPrompt: 'Wellness founder smiling with cookbook in rustic kitchen', aspect: '4:5' },
  { key: 'homeFounder',      label: 'Founder home',     description: 'Founder portrait section on home page.', defaultPrompt: 'Founder leaning on kitchen counter with vegetables', aspect: '4:5' },
  { key: 'aboutPortrait',    label: 'About portrait',   description: 'Hero portrait on about page.', defaultPrompt: 'Friendly portrait of female nutritionist in linen kitchen', aspect: '3:4' },
  { key: 'aboutLifestyle',   label: 'About lifestyle',  description: 'Lifestyle photo on about page.', defaultPrompt: 'Founder with pancakes by bright window', aspect: '3:4' },
  { key: 'aboutPhilosophy',  label: 'Philosophy band',  description: 'About page philosophy band image.', defaultPrompt: 'Basket of fresh vegetables in farmhouse kitchen', aspect: '4:5' },
  { key: 'programsHero',     label: 'Programs hero',    description: 'Hero on programs/courses page.', defaultPrompt: 'Founder holding cookbook with abundant produce on counter', aspect: '4:5' },
  { key: 'program14Day',     label: '14-Day Reset card', description: 'Featured signature program mockup.', defaultPrompt: 'Tablet mockup of 14-day reset program', aspect: '4:5' },
  { key: 'programMetabolic', label: 'Metabolic Reset',  description: 'Metabolic reset program mockup.', defaultPrompt: 'Tablet mockup of metabolic reset program', aspect: '4:5' },
  { key: 'programShred',     label: 'Shred program',    description: 'Smoothie / cleanse imagery.', defaultPrompt: 'Hand holding pink smoothie jar with fresh vegetables', aspect: '4:5' },
  { key: 'freebieMockup',    label: 'Freebie mockup',   description: 'PACT Workbook mockup on freebie page.', defaultPrompt: 'PACT Goal Getter workbook print mockup', aspect: '4:3' },
  { key: 'contactPortrait',  label: 'Contact portrait', description: 'Welcoming founder image on contact page.', defaultPrompt: 'Founder portrait by window in kitchen', aspect: '3:4' },
];

// ---------- design tokens ----------

const SERIF = `'Marcellus', 'Cormorant Garamond', Georgia, serif`;
const SANS  = `'Manrope', 'Inter', system-ui, sans-serif`;

const INK         = '#2A2F44';   // deep slate ink
const BODY        = '#5A5A56';   // warm stone
const CREAM       = '#FAF6EE';   // warm cream bg
const SAND        = '#F2EAD9';   // alt section bg
const SAND_DEEP   = '#E6D9BC';   // subtle band
const PANEL       = '#FFFFFF';
const NAVY        = '#3F4A6E';   // deep slate / footer
const NAVY_SOFT   = '#E5E8F0';   // muted navy panel
const GOLD        = '#B07E2A';   // primary CTA gold
const GOLD_SOFT   = '#F4E9D2';
const TERRACOTTA  = '#B97548';   // italic accent
const SAGE        = '#7E8C5F';   // botanical accent

const PILL_PRIMARY = `linear-gradient(135deg, ${GOLD} 0%, #9A6E1F 100%)`;

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
  const secondaryBorder = opts.onDark ? 'rgba(255,255,255,0.45)' : 'rgba(42,47,68,0.18)';
  return `
    <div style="display:flex;gap:12px;justify-content:${justify};flex-wrap:wrap;margin-top:32px">
      <a href="${opts.primaryUrl}" style="display:inline-flex;align-items:center;gap:8px;background:${PILL_PRIMARY};color:#FFFFFF;padding:15px 30px;border-radius:4px;text-decoration:none;font-weight:600;font-size:14px;font-family:${SANS};box-shadow:0 6px 18px rgba(176,126,42,0.32);letter-spacing:0.08em;text-transform:uppercase">
        ${opts.primaryLabel}<span style="font-size:14px">→</span>
      </a>
      ${opts.secondaryLabel ? `
      <a href="${opts.secondaryUrl ?? '#'}" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:${secondaryColor};padding:15px 30px;border:1.5px solid ${secondaryBorder};border-radius:4px;text-decoration:none;font-weight:600;font-size:14px;font-family:${SANS};letter-spacing:0.08em;text-transform:uppercase">
        ${opts.secondaryLabel}
      </a>` : ''}
    </div>`;
}

function eyebrow(label: string, color = TERRACOTTA, onDark = false) {
  const c = onDark ? 'rgba(255,255,255,0.85)' : color;
  return `<span style="display:inline-block;font-family:${SANS};font-size:12px;font-weight:700;color:${c};letter-spacing:0.22em;text-transform:uppercase">
    ${label}
  </span>`;
}

function checkIcon(color = GOLD) {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
}

function star() {
  return `<span style="color:${GOLD};font-size:14px;letter-spacing:6px">✴</span>`;
}

// ---------- shared chrome ----------

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Start Here', url: '/start-here' },
  { label: 'Programs', url: '/programs' },
  { label: 'Free Workbook', url: '/freebie' },
  { label: 'Blog', url: '/blog' },
  { label: 'Contact', url: '/contact' },
];

function SharedHeader({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const logo = images.logo;
  return (
    <HeaderSection
      background={CREAM}
      textColor={INK}
      sticky
      stickyBackgroundColor={CREAM}
      stickyTextColor={INK}
      paddingDesktop={{ top: '20', bottom: '20' }}
      horizontalAlignment="between"
    >
      <Logo type="image" imageUrl={logo?.url ?? imgLogo} text={brand} imageAlt={brand} width="58" />
      <Menu handle="main-menu" alignment="right" previewItems={NAV_ITEMS} />
    </HeaderSection>
  );
}

function SharedFooter({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const logo = images.logo;
  return (
    <FooterSection
      background={NAVY}
      textColor="rgba(255,255,255,0.78)"
      paddingDesktop={{ top: '80', bottom: '40' }}
    >
      <Logo type="image" imageUrl={imgLogoWhite} text={brand} imageAlt={brand} width="80" />
      <LinkList heading="Explore" handle="footer-explore" layout="vertical" />
      <LinkList heading="Programs" handle="footer-programs" layout="vertical" />
      <LinkList heading="Connect" handle="footer-connect" layout="vertical" />
      <SocialIcons instagram="https://instagram.com" pinterest="https://pinterest.com" />
      <Copyright text={`${brand}. Whole-body wellness from the inside out.`} />
    </FooterSection>
  );
}

// ---------- HOME ----------

function HomePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.homeHero;
  const transform = images.homeTransform;
  const founder = images.homeFounder;

  return (
    <>
      <SharedHeader brand={brand} images={images} />

      {/* Hero — editorial magazine cover */}
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '70', bottom: '0' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding:30px 40px 60px 0;position:relative">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:32px">
              <span style="display:block;width:56px;height:1px;background:${TERRACOTTA}"></span>
              <span style="font-family:${SANS};font-size:11px;font-weight:700;color:${TERRACOTTA};letter-spacing:0.28em;text-transform:uppercase">Volume 01 · Whole-body wellness</span>
            </div>
            <h1 style="font-family:${SERIF};font-size:78px;line-height:0.96;font-weight:400;color:${INK};margin:0;letter-spacing:-0.02em">
              Cooking<br/>to <em style="color:${TERRACOTTA};font-style:italic;font-weight:400">Overcome.</em>
            </h1>
            <p style="max-width:480px;margin:36px 0 0;font-size:19px;line-height:1.7;color:${BODY};font-family:${SANS}">
              A wellness movement helping you rebuild your health from the inside out — with functional nutrition, real food, and clear, doable programs led by Aubrey Balmer, NP.
            </p>
            ${pillCta({ primaryLabel: 'Start the 14-Day Reset', primaryUrl: '/programs', secondaryLabel: "Aubrey's Story", secondaryUrl: '/about', align: 'left' })}
            <div style="display:flex;gap:32px;margin-top:54px;padding-top:30px;border-top:1px solid rgba(42,47,68,0.12);max-width:480px">
              <div>
                <div style="font-family:${SERIF};font-size:32px;color:${INK};line-height:1">15<span style="color:${GOLD}">+</span></div>
                <div style="font-family:${SANS};font-size:10px;font-weight:700;color:${BODY};letter-spacing:0.18em;text-transform:uppercase;margin-top:6px">Years in medicine</div>
              </div>
              <div style="width:1px;background:rgba(42,47,68,0.12)"></div>
              <div>
                <div style="font-family:${SERIF};font-size:32px;color:${INK};line-height:1">3</div>
                <div style="font-family:${SANS};font-size:10px;font-weight:700;color:${BODY};letter-spacing:0.18em;text-transform:uppercase;margin-top:6px">Signature programs</div>
              </div>
              <div style="width:1px;background:rgba(42,47,68,0.12)"></div>
              <div>
                <div style="font-family:${SERIF};font-size:32px;color:${INK};line-height:1;font-style:italic">100s</div>
                <div style="font-family:${SANS};font-size:10px;font-weight:700;color:${BODY};letter-spacing:0.18em;text-transform:uppercase;margin-top:6px">Lives changed</div>
              </div>
            </div>
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="4" align="center" />}
      </ContentSection>

      {/* Navy ribbon — sits flush under hero */}
      <ContentSection name="Trust ribbon" background={NAVY} textColor="#FFFFFF" paddingDesktop={{ top: '34', bottom: '34' }}>
        <Text width="4" align="center"
          text={`<div style="font-family:${SANS};color:#FFFFFF;font-size:12px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:14px"><span style="color:${GOLD};font-size:12px">✴</span><span>Simple Nutrition Plans</span></div>`}
        />
        <Text width="4" align="center"
          text={`<div style="font-family:${SANS};color:#FFFFFF;font-size:12px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:14px"><span style="color:${GOLD};font-size:12px">✴</span><span>On-Demand Tutorials</span></div>`}
        />
        <Text width="4" align="center"
          text={`<div style="font-family:${SANS};color:#FFFFFF;font-size:12px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:14px"><span style="color:${GOLD};font-size:12px">✴</span><span>Whole-Body Wellness</span></div>`}
        />
      </ContentSection>

      {/* What this is / who it's for */}
      <ContentSection name="Who this is for" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow("Optimizing your wellness should be simple")}
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.1;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:-0.005em">
              Your wellness is <em style="color:${TERRACOTTA};font-style:italic">how you show up</em> to life.
            </h2>
            <p style="margin:28px auto 0;max-width:600px;font-size:18px;line-height:1.78;color:${BODY}">
              We believe everyone should have access to clear, affordable, step-by-step guidance for lasting vitality. ${brand} pairs functional nutrition with practical lifestyle support — so you can heal, energize, and thrive.
            </p>
          </div>`}
        />
      </ContentSection>

      {/* Transformation — image left, copy right */}
      <ContentSection name="Transformation" background={SAND} paddingDesktop={{ top: '110', bottom: '110' }}>
        {transform && <Image src={transform.url} alt={transform.alt} colWidth="6" imageBorderRadius="8" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:24px">
            ${eyebrow('What changes')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.12;font-weight:400;color:${INK};margin:20px 0 0;letter-spacing:-0.005em">
              Where everyday food becomes <em style="color:${TERRACOTTA};font-style:italic">everyday healing.</em>
            </h2>
            <ul style="list-style:none;padding:0;margin:32px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'Reverse insulin resistance and clear stubborn brain fog.',
                'Rebuild energy that lasts the whole afternoon.',
                'Calm chronic inflammation through everyday meals.',
                'Build a kitchen rhythm you can actually sustain.',
                'Improve genetic risk factors with foundational nourishment.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="margin-top:4px;flex-shrink:0">${checkIcon()}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      {/* Pathways */}
      <ContentSection name="Pathways" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 60px">
            ${eyebrow('Three paths in')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.08;font-weight:400;color:${INK};margin:18px 0 0">Find the right starting point.</h2>
          </div>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${TERRACOTTA};letter-spacing:0.18em;text-transform:uppercase;margin-bottom:14px">Free workbook</div><h3 style="font-family:${SERIF};font-size:26px;font-weight:400;color:${INK};margin:0 0 14px">The Goal Getter's PACT Workbook</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0 0 22px">A printable workbook to help you set consistent, meaningful health goals — at your own pace.</p><a href="/freebie" style="font-family:${SANS};font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.12em;text-transform:uppercase">Grab it free →</a>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${TERRACOTTA};letter-spacing:0.18em;text-transform:uppercase;margin-bottom:14px">Signature program · $149</div><h3 style="font-family:${SERIF};font-size:26px;font-weight:400;color:${INK};margin:0 0 14px">14-Day Metabolic Reset</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0 0 22px">A gentle, food-based program that calms inflammation and resets your metabolism — guided step by step.</p><a href="/programs" style="font-family:${SANS};font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.12em;text-transform:uppercase">See details →</a>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`<div style="font-family:${SANS};font-size:11px;font-weight:700;color:${TERRACOTTA};letter-spacing:0.18em;text-transform:uppercase;margin-bottom:14px">Premium · $249</div><h3 style="font-family:${SERIF};font-size:26px;font-weight:400;color:${INK};margin:0 0 14px">Redefine: A 4-Week Shred</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0 0 22px">A focused 4-week protocol for deeper detoxification, weight rebalance, and longevity foundations.</p><a href="/programs" style="font-family:${SANS};font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.12em;text-transform:uppercase">See details →</a>`}
        />
      </ContentSection>

      {/* Founder intro */}
      <ContentSection name="Meet Aubrey" background={SAND} paddingDesktop={{ top: '120', bottom: '120' }}>
        {founder && <Image src={founder.url} alt={founder.alt} colWidth="5" imageBorderRadius="8" align="center" />}
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:30px">
            ${eyebrow('Meet your guide')}
            <h2 style="font-family:${SERIF};font-size:54px;line-height:1.06;font-weight:400;color:${INK};margin:20px 0 0;letter-spacing:-0.005em">
              Hello, I'm <em style="color:${TERRACOTTA};font-style:italic">Aubrey Balmer.</em>
            </h2>
            <div style="font-family:${SANS};font-size:12px;font-weight:700;color:${SAGE};letter-spacing:0.18em;text-transform:uppercase;margin-top:14px">Nurse Practitioner · Integrative Nutritionist · Health Coach</div>
            <p style="margin:24px 0 0;font-size:17px;line-height:1.78;color:${BODY};max-width:560px">
              With 15 years of medical experience and a deep love for real food, I bring practical, science-backed healing into your kitchen and daily life. My greatest fulfillment comes from helping people reach their highest level of health by integrating the best of nutrition, health coaching, and regenerative medicine.
            </p>
            ${pillCta({ primaryLabel: "Read Aubrey's Story", primaryUrl: '/about', align: 'left' })}
          </div>`}
        />
      </ContentSection>

      {/* Featured signature program */}
      <ContentSection name="Featured signature program" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Image src={img14DayReset} alt="14-Day Metabolic Reset program" colWidth="5" imageBorderRadius="8" align="center" />
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:30px">
            ${eyebrow('Signature program')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.08;font-weight:400;color:${INK};margin:20px 0 0;letter-spacing:-0.005em">
              The <em style="color:${TERRACOTTA};font-style:italic">14-Day Metabolic Reset.</em>
            </h2>
            <p style="margin:24px 0 0;font-size:17px;line-height:1.78;color:${BODY};max-width:560px">
              A gentle, food-based program that supports your body's natural detox, calms inflammation, and helps your cells function as designed. Step-by-step coaching, printable materials, and simple, nourishing recipes — so you always know what to do next.
            </p>
            <div style="display:flex;gap:32px;margin-top:30px;flex-wrap:wrap">
              <div style="font-family:${SANS}"><div style="font-family:${SERIF};font-size:36px;color:${GOLD};line-height:1">14</div><div style="font-size:11px;font-weight:700;color:${BODY};letter-spacing:0.16em;text-transform:uppercase;margin-top:4px">Days</div></div>
              <div style="font-family:${SANS}"><div style="font-family:${SERIF};font-size:36px;color:${GOLD};line-height:1">25+</div><div style="font-size:11px;font-weight:700;color:${BODY};letter-spacing:0.16em;text-transform:uppercase;margin-top:4px">Recipes</div></div>
              <div style="font-family:${SANS}"><div style="font-family:${SERIF};font-size:36px;color:${GOLD};line-height:1">∞</div><div style="font-size:11px;font-weight:700;color:${BODY};letter-spacing:0.16em;text-transform:uppercase;margin-top:4px">Lifetime access</div></div>
            </div>
            ${pillCta({ primaryLabel: 'Start the Reset', primaryUrl: '/programs', align: 'left' })}
          </div>`}
        />
      </ContentSection>

      {/* Testimonial pull-quote */}
      <ContentSection name="Testimonial" background={NAVY} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:820px;margin:0 auto;text-align:center;color:#FFFFFF">
            <div style="color:${GOLD};font-size:14px;letter-spacing:8px">✴ ✴ ✴</div>
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.35;font-weight:400;color:#FFFFFF !important;margin:30px 0 0;font-style:italic">
              <span style="color:#FFFFFF">"These programs changed the trajectory of my health and the health of my family."</span>
            </h2>
            <div style="font-family:${SANS};font-size:13px;font-weight:700;color:rgba(255,255,255,0.85);letter-spacing:0.2em;text-transform:uppercase;margin-top:30px">— Liana, 2025</div>
          </div>`}
        />
      </ContentSection>

      {/* From the blog (chrome only — links to dynamic blog) */}
      <ContentSection name="From the blog" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 50px">
            ${eyebrow('Read the latest')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.08;font-weight:400;color:${INK};margin:18px 0 0">From the Blog</h2>
            <p style="margin:18px auto 0;font-size:17px;line-height:1.7;color:${BODY};max-width:520px">Practical, science-backed wellness writing — published monthly.</p>
            ${pillCta({ primaryLabel: 'Visit the blog', primaryUrl: '/blog', align: 'center' })}
          </div>`}
        />
      </ContentSection>

      {/* Final CTA */}
      <ContentSection name="Final CTA" background={GOLD} textColor="#FFFFFF" paddingDesktop={{ top: '120', bottom: '120' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            ${eyebrow('Your free first step', '#FFFFFF', true)}
            <h2 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:20px auto 0;max-width:780px;letter-spacing:-0.01em">
              Wash your hands of yesterday. <em style="color:${SAND};font-style:italic">Start fresh today.</em>
            </h2>
            <p style="max-width:540px;margin:24px auto 0;font-size:17px;line-height:1.75;color:rgba(255,255,255,0.92)">
              Download the free Goal Getter's PACT Workbook and start building consistent, doable health habits at your own pace.
            </p>
            ${pillCta({ primaryLabel: 'Grab the free workbook', primaryUrl: '/freebie', secondaryLabel: 'Browse Programs', secondaryUrl: '/programs', onDark: true })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- ABOUT ----------

function AboutPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const portrait = images.aboutPortrait;
  const lifestyle = images.aboutLifestyle;
  const philosophy = images.aboutPhilosophy;
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="About hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('About the founder')}
            <h1 style="font-family:${SERIF};font-size:68px;line-height:1.04;font-weight:400;color:${INK};margin:24px 0 0;letter-spacing:-0.01em">
              Hi, I'm <em style="color:${TERRACOTTA};font-style:italic">Aubrey Balmer.</em>
            </h1>
            <div style="font-family:${SANS};font-size:12px;font-weight:700;color:${SAGE};letter-spacing:0.2em;text-transform:uppercase;margin-top:18px">Nurse Practitioner · Integrative Nutritionist · Health Coach</div>
            <p style="max-width:560px;margin:28px 0 0;font-size:18px;line-height:1.78;color:${BODY}">
              With over 15 years of medical experience and a deep love for real food, I bring practical, science-backed healing straight to your kitchen and daily life.
            </p>
          </div>`}
        />
        {portrait && <Image src={portrait.url} alt={portrait.alt} colWidth="5" imageBorderRadius="8" align="center" />}
      </ContentSection>

      <ContentSection name="Founder story" background={SAND} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="left" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto;color:${BODY};font-size:18px;line-height:1.85">
            <p>Over the years, I've guided hundreds of clients through simple, straightforward programs that transform their energy, mental clarity, and long-term health. My own journey began in my twenties, when I struggled with severe fatigue, brain fog, and chronic inflammation despite seeing countless specialists and holistic providers. I was nearly out of hope.</p>
            <p style="margin-top:24px">Then I met a functional medicine doctor who showed me how the body can heal itself when we nourish it at the foundational level. That revelation changed everything. Since then, I've lived in vibrant, abundant health — and now I help others do the same.</p>
            <p style="margin-top:24px">At ${brand}, we focus on building the healthiest possible foundation through food and lifestyle, so you can reverse insulin resistance, heal long-term conditions, clear brain fog, overcome fatigue, and improve your genetic risk factors for disease.</p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Philosophy band" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        {philosophy && <Image src={philosophy.url} alt={philosophy.alt} colWidth="6" imageBorderRadius="8" align="center" />}
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:30px">
            ${eyebrow('Our philosophy')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0;letter-spacing:-0.005em">
              Real food. <em style="color:${TERRACOTTA};font-style:italic">Real healing.</em>
            </h2>
            <ul style="list-style:none;padding:0;margin:30px 0 0;display:flex;flex-direction:column;gap:18px">
              <li><strong style="font-family:${SERIF};font-size:18px;color:${INK};display:block;margin-bottom:4px">Foundation first.</strong><span style="font-size:15px;color:${BODY};line-height:1.65">Nourish the cell and the system follows.</span></li>
              <li><strong style="font-family:${SERIF};font-size:18px;color:${INK};display:block;margin-bottom:4px">Simple, science-backed.</strong><span style="font-size:15px;color:${BODY};line-height:1.65">No fads, no fluff — only what holds up under research.</span></li>
              <li><strong style="font-family:${SERIF};font-size:18px;color:${INK};display:block;margin-bottom:4px">Sustainable beats perfect.</strong><span style="font-size:15px;color:${BODY};line-height:1.65">Doable habits that fit a real life.</span></li>
              <li><strong style="font-family:${SERIF};font-size:18px;color:${INK};display:block;margin-bottom:4px">Whole-person care.</strong><span style="font-size:15px;color:${BODY};line-height:1.65">Mind, body, and the kitchen all together.</span></li>
            </ul>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Credentials" background={SAND} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 40px">
            ${eyebrow('Credentials')}
            <h2 style="font-family:${SERIF};font-size:40px;line-height:1.15;font-weight:400;color:${INK};margin:18px 0 0">A foundation in clinical practice.</h2>
          </div>`}
        />
        <Text width="4" align="center" backgroundColor={PANEL} borderRadius="8" padding={{ top: '32', bottom: '32', left: '24', right: '24' }}
          text={`<div style="font-family:${SANS}"><div style="font-family:${SERIF};font-size:38px;color:${GOLD};line-height:1">15+</div><div style="font-family:${SANS};font-size:13px;font-weight:600;color:${INK};letter-spacing:0.08em;text-transform:uppercase;margin-top:10px">Years in medicine</div></div>`}
        />
        <Text width="4" align="center" backgroundColor={PANEL} borderRadius="8" padding={{ top: '32', bottom: '32', left: '24', right: '24' }}
          text={`<div style="font-family:${SANS}"><div style="font-family:${SERIF};font-size:38px;color:${GOLD};line-height:1">100s</div><div style="font-family:${SANS};font-size:13px;font-weight:600;color:${INK};letter-spacing:0.08em;text-transform:uppercase;margin-top:10px">Clients guided</div></div>`}
        />
        <Text width="4" align="center" backgroundColor={PANEL} borderRadius="8" padding={{ top: '32', bottom: '32', left: '24', right: '24' }}
          text={`<div style="font-family:${SANS}"><div style="font-family:${SERIF};font-size:38px;color:${GOLD};line-height:1">3</div><div style="font-family:${SANS};font-size:13px;font-weight:600;color:${INK};letter-spacing:0.08em;text-transform:uppercase;margin-top:10px">Active programs</div></div>`}
        />
      </ContentSection>

      <ContentSection name="Personal" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.15;font-weight:400;color:${INK};margin:0">A few small things about me.</h2>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:14px;font-size:16px;line-height:1.65;color:${INK}">
              <li>· I cook more salmon than is probably reasonable.</li>
              <li>· My favorite ingredient is whatever is in season at the local farm.</li>
              <li>· I believe sustainability beats perfection — every single time.</li>
              <li>· I read research papers in the morning and recipe books at night.</li>
            </ul>
          </div>`}
        />
        {lifestyle && <Image src={lifestyle.url} alt={lifestyle.alt} colWidth="6" imageBorderRadius="8" align="center" />}
      </ContentSection>

      <ContentSection name="About CTA" background={GOLD} textColor="#FFFFFF" paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS}">
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.08;font-weight:400;color:#FFFFFF;margin:0;letter-spacing:-0.005em">Want a kind place to begin?</h2>
            <p style="max-width:520px;margin:20px auto 0;font-size:17px;line-height:1.75;color:rgba(255,255,255,0.92)">Download the free PACT workbook — your first practical step toward consistent health goals.</p>
            ${pillCta({ primaryLabel: 'Get the free workbook', primaryUrl: '/freebie', secondaryLabel: 'Browse Programs', secondaryUrl: '/programs', onDark: true })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- PROGRAMS ----------

function ProgramsPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.programsHero;
  const faqs = [
    { q: 'Do I need any special equipment or supplements?', a: 'No. Every program is designed around real, accessible food. A blender helps but isn\'t required, and supplements are recommendations only — never required.' },
    { q: 'Can I do this if I have dietary restrictions?', a: 'Yes. The programs are flexible and include modifications for gluten-free, dairy-free, and most common allergies. Reach out before purchase if you have a specific condition.' },
    { q: 'How long do I have access?', a: 'Lifetime access. Once you enroll, the program is yours to revisit anytime — including future updates.' },
    { q: 'Is this medical advice?', a: 'No. ' + brand + ' is education, not a substitute for individualized medical care. Always consult your provider for diagnosis and treatment.' },
  ];

  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Programs hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Programs · self-paced')}
            <h1 style="font-family:${SERIF};font-size:62px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:-0.01em">
              Where every day food becomes <em style="color:${TERRACOTTA};font-style:italic">everyday healing.</em>
            </h1>
            <p style="max-width:520px;margin:26px 0 0;font-size:18px;line-height:1.78;color:${BODY}">
              Clear, concise, doable programs paired with the nourishment your mind and body need — so real growth can take root from the inside out.
            </p>
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="6" imageBorderRadius="8" align="center" />}
      </ContentSection>

      {/* Featured signature offer */}
      <ContentSection name="Featured signature offer" background={SAND} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Image src={img14DayReset} alt="14-Day Metabolic Reset" colWidth="5" imageBorderRadius="8" align="center" />
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:30px">
            ${eyebrow('Signature program · $149')}
            <h2 style="font-family:${SERIF};font-size:48px;line-height:1.06;font-weight:400;color:${INK};margin:18px 0 0;letter-spacing:-0.005em">
              The <em style="color:${TERRACOTTA};font-style:italic">14-Day Metabolic Reset.</em>
            </h2>
            <p style="margin:22px 0 0;font-size:17px;line-height:1.78;color:${BODY};max-width:560px">
              A gentle, food-based program that supports your body's natural detox, calms inflammation, and helps your cells function as designed. Whether your goal is detox, healing, weight loss, or simply getting back on track — there's no better two weeks to invest your energy in.
            </p>
            <ul style="list-style:none;padding:0;margin:26px 0 0;display:flex;flex-direction:column;gap:12px">
              ${[
                'Recorded video coaching for every day',
                'Printable shopping lists & meal maps',
                '25+ simple, nourishing recipes',
                'Lifetime access + future updates',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:15px;color:${INK}"><span style="margin-top:3px;flex-shrink:0">${checkIcon()}</span><span>${t}</span></li>`).join('')}
            </ul>
            ${pillCta({ primaryLabel: 'Start the 14-Day Reset', primaryUrl: '#pricing', align: 'left' })}
          </div>`}
        />
      </ContentSection>

      {/* Supporting offers */}
      <ContentSection name="Supporting offers" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Other offers')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:400;color:${INK};margin:16px 0 0">Pick the path that fits.</h2>
          </div>`}
        />
        <Text width="6" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '0', bottom: '32', left: '0', right: '0' }} boxShadow="small"
          text={`<div style="font-family:${SANS};overflow:hidden;border-radius:8px">
            <img src="${imgMetabolicReset}" alt="Two Week Metabolic Reset" style="width:100%;height:280px;object-fit:cover;display:block"/>
            <div style="padding:28px 32px 0">
              <div style="font-size:11px;font-weight:700;color:${TERRACOTTA};letter-spacing:0.18em;text-transform:uppercase;margin-bottom:10px">Free download</div>
              <h3 style="font-family:${SERIF};font-size:26px;font-weight:400;color:${INK};margin:0 0 12px">Two Week Metabolic Reset Preview</h3>
              <p style="font-size:15px;line-height:1.7;color:${BODY};margin:0 0 16px">Learn how food can reset, heal, and help your body feel amazing — a free taste of the full signature program.</p>
              <a href="/freebie" style="font-family:${SANS};font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.12em;text-transform:uppercase">Download preview →</a>
            </div>
          </div>`}
        />
        <Text width="6" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '0', bottom: '32', left: '0', right: '0' }} boxShadow="small"
          text={`<div style="font-family:${SANS};overflow:hidden;border-radius:8px">
            <img src="${imgSmoothieJar}" alt="Redefine: A 4-Week Shred" style="width:100%;height:280px;object-fit:cover;display:block"/>
            <div style="padding:28px 32px 0">
              <div style="font-size:11px;font-weight:700;color:${TERRACOTTA};letter-spacing:0.18em;text-transform:uppercase;margin-bottom:10px">Premium · $249</div>
              <h3 style="font-family:${SERIF};font-size:26px;font-weight:400;color:${INK};margin:0 0 12px">Redefine: A 4-Week Shred</h3>
              <p style="font-size:15px;line-height:1.7;color:${BODY};margin:0 0 16px">A focused 4-week protocol designed to reduce inflammation, support detox pathways, and restore optimal cell function — ideal for jumpstarting any longevity journey.</p>
              <a href="#pricing" style="font-family:${SANS};font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.12em;text-transform:uppercase">See details →</a>
            </div>
          </div>`}
        />
      </ContentSection>

      {/* Pricing */}
      <ContentSection name="Pricing" background={SAND} paddingDesktop={{ top: '110', bottom: '110' }} id="pricing">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
            ${eyebrow('Choose your path')}
            <h2 style="font-family:${SERIF};font-size:50px;line-height:1.08;font-weight:400;color:${INK};margin:16px 0 0">Lifetime access. Real outcomes.</h2>
          </div>`}
        />
        <PricingCard
          width="6"
          heading="14-Day Metabolic Reset"
          price="$149"
          priceCaption="One payment · lifetime access"
          text="<ul><li>14 days of guided video coaching</li><li>25+ recipes & meal maps</li><li>Printable shopping lists</li><li>Lifetime access + updates</li><li>Email support during the program</li></ul>"
          buttonText="Enroll for $149"
          buttonUrl="#"
          brandColor={GOLD}
        />
        <PricingCard
          width="6"
          heading="Redefine: 4-Week Shred"
          price="$249"
          priceCaption="One payment · lifetime access"
          text="<ul><li>4 weeks of structured coaching</li><li>Inflammation + detox protocols</li><li>Recipe library & shopping lists</li><li>Lifetime access + updates</li><li>Includes the 14-Day Reset bonus</li></ul>"
          buttonText="Transform for $249"
          buttonUrl="#"
          brandColor={NAVY}
        />
      </ContentSection>

      {/* FAQ */}
      <ContentSection name="Programs FAQ" background={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto 50px">
            ${eyebrow('Common questions')}
            <h2 style="font-family:${SERIF};font-size:46px;line-height:1.1;font-weight:400;color:${INK};margin:16px 0 0">What people ask.</h2>
          </div>`}
        />
        {faqs.map((f, i) => (
          <Accordion
            key={i}
            heading={f.q}
            body={`<div style="font-family:${SANS};font-size:16px;line-height:1.7;color:${BODY}">${f.a}</div>`}
            width="8"
            backgroundColor="#FFFFFF"
            borderRadius="8"
            boxShadow="small"
            padding={{ top: '24', right: '28', bottom: '24', left: '28' }}
            iconColor={GOLD}
          />
        ))}
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- FREEBIE ----------

function FreebiePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Freebie hero" background={CREAM} paddingDesktop={{ top: '90', bottom: '100' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Free workbook · instant download')}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.04;font-weight:400;color:${INK};margin:24px 0 0;letter-spacing:-0.01em">
              The Goal Getter's <em style="color:${TERRACOTTA};font-style:italic">PACT Workbook.</em>
            </h1>
            <p style="max-width:520px;margin:26px 0 0;font-size:17px;line-height:1.78;color:${BODY}">
              Approaching your health goals should feel doable and pressure-free. The PACT system helps you set consistent, meaningful goals at your own pace — making real space for true self-improvement.
            </p>
            <ul style="list-style:none;padding:0;margin:30px 0 0;display:flex;flex-direction:column;gap:12px">
              ${[
                'A printable Goal Action Plan you can use today',
                'A daily Goal Tracker with hydration, to-dos and notes',
                'The PACT framework for sustainable habit-building',
                'Wash your hands of yesterday — start fresh today',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.55;color:${INK}"><span style="margin-top:4px;flex-shrink:0">${checkIcon()}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
        <Text width="5" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '36', bottom: '36', left: '34', right: '34' }} boxShadow="medium"
          text={`<div style="font-family:${SANS}">
            <div style="font-family:${SERIF};font-size:30px;font-weight:400;color:${INK};line-height:1.2;margin:0 0 8px">Send me the workbook</div>
            <p style="margin:0 0 4px;font-size:14px;color:${BODY};line-height:1.6">Add your email — the PDF lands in your inbox in seconds.</p>
          </div>`}
        />
        <Form
          formId=""
          buttonBackgroundColor={GOLD}
          buttonTextColor="#FFFFFF"
          width="5"
        />
      </ContentSection>

      {/* Freebie preview */}
      <ContentSection name="Freebie preview" background={SAND} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Image src={imgPactWorkbook} alt="PACT Workbook preview" colWidth="6" imageBorderRadius="8" align="center" />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:30px">
            ${eyebrow('What\'s inside')}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.12;font-weight:400;color:${INK};margin:16px 0 0;letter-spacing:-0.005em">
              A simple system <em style="color:${TERRACOTTA};font-style:italic">that actually sticks.</em>
            </h2>
            <p style="margin:20px 0 0;font-size:17px;line-height:1.78;color:${BODY};max-width:480px">
              Two beautifully designed printable pages — a Goal Action Plan and a Daily Goal Tracker — built around the PACT framework so your wellness goals stay specific, doable, and honest.
            </p>
          </div>`}
        />
      </ContentSection>

      {/* Soft pitch into 14-day */}
      <ContentSection name="Next step" background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('Ready for more?')}
            <h2 style="font-family:${SERIF};font-size:42px;line-height:1.12;font-weight:400;color:${INK};margin:16px 0 0">When the workbook leaves you wanting structure.</h2>
            <p style="margin:20px auto 0;max-width:520px;font-size:17px;line-height:1.7;color:${BODY}">
              The 14-Day Metabolic Reset is the natural next step — a guided, food-based program that turns intention into consistent action.
            </p>
            ${pillCta({ primaryLabel: 'Explore the 14-Day Reset', primaryUrl: '/programs', align: 'center' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- START HERE ----------

function StartHerePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Start hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto">
            ${eyebrow('Welcome — start here')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.04;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:-0.01em">
              New to ${brand}? <em style="color:${TERRACOTTA};font-style:italic">Begin here.</em>
            </h1>
            <p style="max-width:560px;margin:26px auto 0;font-size:18px;line-height:1.78;color:${BODY}">
              A short, honest guide to figuring out which step is right for you — no pressure, no overwhelm.
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Three steps" background={SAND} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`<div style="font-family:${SERIF};font-size:46px;color:${GOLD};line-height:1;margin-bottom:16px">01</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:400;color:${INK};margin:0 0 12px">Read Aubrey's story</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0 0 18px">Learn the philosophy and the science behind whole-body, food-first healing.</p><a href="/about" style="font-family:${SANS};font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.12em;text-transform:uppercase">Read About →</a>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`<div style="font-family:${SERIF};font-size:46px;color:${GOLD};line-height:1;margin-bottom:16px">02</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:400;color:${INK};margin:0 0 12px">Grab the free workbook</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0 0 18px">Build your first sustainable health goal with the PACT framework — free.</p><a href="/freebie" style="font-family:${SANS};font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.12em;text-transform:uppercase">Download free →</a>`}
        />
        <Feature width="4" align="left" backgroundColor={PANEL} borderRadius="8" padding={{ top: '36', bottom: '36', left: '32', right: '32' }} boxShadow="small"
          text={`<div style="font-family:${SERIF};font-size:46px;color:${GOLD};line-height:1;margin-bottom:16px">03</div><h3 style="font-family:${SERIF};font-size:24px;font-weight:400;color:${INK};margin:0 0 12px">Start the 14-Day Reset</h3><p style="font-family:${SANS};font-size:15px;line-height:1.7;color:${BODY};margin:0 0 18px">Ready for structure? Begin the signature food-based reset program.</p><a href="/programs" style="font-family:${SANS};font-size:13px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.12em;text-transform:uppercase">Explore programs →</a>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- CONTACT ----------

function ContactPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const portrait = images.contactPortrait;
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Contact hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Say hello')}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:-0.01em">
              Let's <em style="color:${TERRACOTTA};font-style:italic">talk.</em>
            </h1>
            <p style="max-width:480px;margin:24px 0 0;font-size:17px;line-height:1.78;color:${BODY}">
              Questions about a program? Press inquiries? Speaking requests? Send a note — we read every message and reply within 2 business days.
            </p>
            <div style="margin-top:30px;font-family:${SANS};font-size:14px;color:${INK}">
              <div style="font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${SAGE};font-size:11px;margin-bottom:6px">Inquiries</div>
              <div>hello@cookingtoovercome.com</div>
              <div style="margin-top:18px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${SAGE};font-size:11px;margin-bottom:6px">Response time</div>
              <div>Within 2 business days</div>
            </div>
          </div>`}
        />
        {portrait && <Image src={portrait.url} alt={portrait.alt} colWidth="5" imageBorderRadius="8" align="center" />}
      </ContentSection>

      <ContentSection name="Contact form" background={SAND} paddingDesktop={{ top: '90', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:560px;margin:0 auto 30px">
            ${eyebrow('Send a note')}
            <h2 style="font-family:${SERIF};font-size:38px;line-height:1.15;font-weight:400;color:${INK};margin:16px 0 0">Tell us what's on your mind.</h2>
          </div>`}
        />
        <Form
          formId=""
          buttonBackgroundColor={GOLD}
          buttonTextColor="#FFFFFF"
          width="8"
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- BLOG (dynamic) ----------

function BlogPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Blog header" background={CREAM} paddingDesktop={{ top: '100', bottom: '60' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow('The Journal')}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:-0.01em">From the Blog.</h1>
            <p style="max-width:560px;margin:22px auto 0;font-size:17px;line-height:1.7;color:${BODY}">
              Practical, science-backed essays on functional nutrition, real food, and building wellness from the inside out.
            </p>
          </div>`}
        />
      </ContentSection>

      <RawSection
        type="blog_listings"
        name="Blog Listings"
        settings={{
          background_color: CREAM,
          text_color: INK,
          button_background_color: GOLD,
          button_text_color: '#FFFFFF',
          button_border_radius: '4',
        }}
      />

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function BlogPostPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <RawSection
        type="blog_post_body"
        name="Blog Post Body"
        settings={{
          background_color: CREAM,
          text_color: INK,
          link_color: GOLD,
        }}
      />

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- LIBRARY (dynamic) ----------

function LibraryPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Library header" background={CREAM} paddingDesktop={{ top: '100', bottom: '50' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto">
            ${eyebrow('The Library')}
            <h1 style="font-family:${SERIF};font-size:60px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:-0.01em">All your programs in one place.</h1>
          </div>`}
        />
      </ContentSection>

      <RawSection
        type="products"
        name="Products"
        settings={{
          background_color: CREAM,
          text_color: INK,
          button_background_color: GOLD,
          button_text_color: '#FFFFFF',
          button_border_radius: '4',
        }}
      />

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- THANK YOU + 404 ----------

function ThankYouPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />
      <ContentSection name="Thank you" background={CREAM} paddingDesktop={{ top: '140', bottom: '140' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto">
            ${eyebrow('Thank you')}
            <h1 style="font-family:${SERIF};font-size:64px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:-0.01em">
              Welcome to <em style="color:${TERRACOTTA};font-style:italic">${brand}.</em>
            </h1>
            <p style="margin:24px auto 0;max-width:520px;font-size:17px;line-height:1.75;color:${BODY}">Check your inbox — your download or confirmation email is on the way. While you wait, ${brand} is here whenever you need a steady next step.</p>
            ${pillCta({ primaryLabel: 'Browse Programs', primaryUrl: '/programs', secondaryLabel: 'Read the Blog', secondaryUrl: '/blog', align: 'center' })}
          </div>`}
        />
      </ContentSection>
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function NotFoundPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />
      <ContentSection name="404" background={CREAM} paddingDesktop={{ top: '140', bottom: '140' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:620px;margin:0 auto">
            <div style="font-family:${SERIF};font-size:120px;color:${GOLD};line-height:1;font-weight:400">404</div>
            <h1 style="font-family:${SERIF};font-size:42px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0">This page wandered off.</h1>
            <p style="margin:20px auto 0;max-width:480px;font-size:17px;line-height:1.7;color:${BODY}">Let's get you back to something useful.</p>
            ${pillCta({ primaryLabel: 'Back to Home', primaryUrl: '/', secondaryLabel: 'See Programs', secondaryUrl: '/programs', align: 'center' })}
          </div>`}
        />
      </ContentSection>
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- DEFAULT IMAGES ----------

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
  logo:             defaultImage('logo',             imgLogo,            'Cooking to Overcome'),
  homeHero:         defaultImage('homeHero',         imgSalmonPour,      'Pouring olive oil over fresh salmon'),
  homeTransform:    defaultImage('homeTransform',    imgFounderCookbook, 'Aubrey with cookbook in rustic kitchen'),
  homeFounder:      defaultImage('homeFounder',      imgFounderKitchen,  'Aubrey leaning on counter with vegetables'),
  aboutPortrait:    defaultImage('aboutPortrait',    imgFounderPortrait, 'Portrait of Aubrey Balmer'),
  aboutLifestyle:   defaultImage('aboutLifestyle',   imgFounderPancakes, 'Aubrey with pancakes by bright window'),
  aboutPhilosophy:  defaultImage('aboutPhilosophy',  imgBasketVeg,       'Basket of fresh vegetables'),
  programsHero:     defaultImage('programsHero',     imgFounderCookbook, 'Aubrey with cookbook and produce'),
  program14Day:     defaultImage('program14Day',     img14DayReset,      '14-Day Metabolic Reset'),
  programMetabolic: defaultImage('programMetabolic', imgMetabolicReset,  'Two Week Metabolic Reset'),
  programShred:     defaultImage('programShred',     imgSmoothieJar,     'Pink smoothie with vegetables'),
  freebieMockup:    defaultImage('freebieMockup',    imgPactWorkbook,    'PACT Workbook print mockup'),
  contactPortrait:  defaultImage('contactPortrait',  imgFounderPortrait, 'Aubrey portrait'),
  aboutBio:         defaultImage('aboutBio',         imgAboutBio,        'Long-form bio image'),
};

function mergeImages(userImages: Record<string, SiteImage> = {}): Record<string, SiteImage> {
  return { ...DEFAULT_IMAGES, ...userImages };
}

// ---------- page registry ----------

type PageBuilder = (brand: string, images: Record<string, SiteImage>) => ReactNode;

const PAGE_BUILDERS: Record<string, PageBuilder> = {
  index:        (brand, images) => <HomePage brand={brand} images={images} />,
  about:        (brand, images) => <AboutPage brand={brand} images={images} />,
  contact:      (brand, images) => <ContactPage brand={brand} images={images} />,
  blog:         (brand, images) => <BlogPage brand={brand} images={images} />,
  blog_post:    (brand, images) => <BlogPostPage brand={brand} images={images} />,
  thank_you:    (brand, images) => <ThankYouPage brand={brand} images={images} />,
  '404':        (brand, images) => <NotFoundPage brand={brand} images={images} />,
  programs:     (brand, images) => <ProgramsPage brand={brand} images={images} />,
  freebie:      (brand, images) => <FreebiePage brand={brand} images={images} />,
  'start-here': (brand, images) => <StartHerePage brand={brand} images={images} />,
  library:      (brand, images) => <LibraryPage brand={brand} images={images} />,
};

const ALL_PAGES: PageKey[] = [
  'index', 'about', 'contact', 'blog', 'blog_post', 'thank_you', '404',
  'programs', 'freebie', 'start-here', 'library',
];

// ---------- THEME SETTINGS ----------

const CTO_THEME_SETTINGS: Record<string, string> = {
  background_color: CREAM,
  color_primary: GOLD,
  font_family_heading: 'Marcellus',
  font_weight_heading: '400',
  line_height_heading: '1.1',
  font_family_body: 'Manrope',
  font_weight_body: '400',
  line_height_body: '1.7',
  color_heading: INK,
  color_body: BODY,
  color_body_secondary: '#7A7A75',
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
  btn_border_radius: '4',
  btn_text_color: '#FFFFFF',
  btn_background_color: GOLD,
};

const CTO_CUSTOM_CSS = `
/* Cooking to Overcome — system page polish */
body { background: ${CREAM}; color: ${BODY}; }
a { color: ${GOLD}; }
a:hover { color: ${TERRACOTTA}; }

input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
textarea,
select {
  border: 1px solid rgba(42,47,68,0.16) !important;
  border-radius: 4px !important;
  background: #FFFFFF !important;
  color: ${INK} !important;
  font-family: 'Manrope', sans-serif !important;
  padding: 14px 16px !important;
}
input:focus, textarea:focus, select:focus {
  border-color: ${GOLD} !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(176,126,42,0.18) !important;
}

button, .button, input[type="submit"], .btn-primary {
  border-radius: 4px !important;
  font-family: 'Manrope', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  font-size: 14px !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Marcellus', Georgia, serif !important;
  font-weight: 400 !important;
  letter-spacing: -0.005em !important;
  color: ${INK} !important;
}

.product-card, .library-card, .course-card {
  border-radius: 8px !important;
  background: #FFFFFF !important;
  box-shadow: 0 4px 16px rgba(42,47,68,0.06) !important;
  border: 1px solid rgba(42,47,68,0.05) !important;
}
`;

export const cookingToOvercomeTemplate: TemplateDef = {
  id: 'cooking-to-overcome',
  label: 'Cooking to Overcome',
  description: "Aubrey Balmer's functional-nutrition wellness brand — warm cream + gold + navy, Marcellus serif + Manrope sans, real recovered photography from the live source site.",
  pageKeys: ALL_PAGES,
  imageSlots: IMAGE_SLOTS,
  themeSettings: CTO_THEME_SETTINGS,
  customCss: CTO_CUSTOM_CSS,
  fonts: { heading: 'Marcellus', body: 'Manrope' },
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
