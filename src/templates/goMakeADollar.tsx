/**
 * Go Make a Dollar — Johnny Terra's founder-led business operating system brand.
 *
 * Aesthetic: black-dominant background usage with white type, gold/yellow
 * accent. Bold display typography, sharp masculine feel, strategic /
 * engineered vibe. Anti-hustle, systems-driven, founder-led authority.
 *
 * Fonts: Anton (display, condensed bold sans — tactical/engineered) +
 * IBM Plex Sans (body, technical/precise). Both unused elsewhere in the
 * template registry.
 *
 * All imagery is recovered from the live source site at
 * https://www.gomakeadollar.com via Firecrawl scrape and uploaded to the
 * site-images bucket. See /mnt/documents/gmad-inventory.md.
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

const CDN = 'https://iqxcgazfrydubrvxmnlv.supabase.co/storage/v1/object/public/site-images/templates/go-make-a-dollar';

// ---------- recovered + AI assets ----------
const imgLogoBlack          = `${CDN}/logo-black.jpg`;
const imgLogoTransparent    = `${CDN}/logo-transparent.png`;
const imgLogoWhite          = `${CDN}/logo-white.png`;
const imgLogoStacked        = `${CDN}/logo-stacked-white.png`;

const imgFounderHero        = `${CDN}/founder-portrait-hero.jpeg`;
const imgFounderAbout       = `${CDN}/founder-about-hero.jpeg`;
const imgFounderSystemPack  = `${CDN}/founder-systempack.png`;
const imgFounderTools       = `${CDN}/founder-tools.png`;
const imgFounderSPCta       = `${CDN}/founder-systempack-cta.png`;
const imgFounder1           = `${CDN}/founder-1.png`;
const imgFounder2           = `${CDN}/founder-2.png`;
const imgFounder3           = `${CDN}/founder-3.png`;
const imgFounder4           = `${CDN}/founder-4.png`;
const imgFounder5           = `${CDN}/founder-5.png`;
const imgFounder6           = `${CDN}/founder-6.png`;
const imgFounder7           = `${CDN}/founder-7.png`;

const imgTrustEngine        = `${CDN}/trust-engine-cover.jpg`;

const imgHomeBottleneck     = `${CDN}/home-bottleneck.png`;
const imgHomeFailure        = `${CDN}/home-failure-of-systems.png`;
const imgHomeEcosystem      = `${CDN}/home-ecosystem.png`;
const imgHomeTrapped        = `${CDN}/home-trapped.jpeg`;
const imgHomeCtaBg          = `${CDN}/home-cta-bg.png`;
const imgPantryEra          = `${CDN}/home-pantry-era.png`;
const imgAboutRealization   = `${CDN}/about-realization.png`;
const imgIconScales         = `${CDN}/icon-scales-machine.png`;
const imgIconSells          = `${CDN}/icon-sells-human.png`;

const imgContactVideo       = `${CDN}/contact-video-thumb.jpeg`;
const imgContactHeadshot    = `${CDN}/contact-headshot.jpeg`;

const imgEliminationHero    = `${CDN}/elimination-hero.png`;
const imgEliminationPortrait= `${CDN}/elimination-portrait.jpeg`;

const imgFuelLineHero       = `${CDN}/fuel-line-hero.png`;
const imgFuelLineBottom     = `${CDN}/fuel-line-bottom.png`;

const imgSP01               = `${CDN}/systempack-01-blueprint.jpeg`;
const imgSP02               = `${CDN}/systempack-02-cover.png`;
const imgSP03               = `${CDN}/systempack-03-onboarding.png`;
const imgSP04               = `${CDN}/systempack-04-elim-audit.png`;
const imgSP05               = `${CDN}/systempack-05-fortress.png`;
const imgSPMockup           = `${CDN}/systempack-mockup-stack.png`;

// ---------- image slots ----------

const IMAGE_SLOTS: ImageSlotDef[] = [
  { key: 'logo',                label: 'Brand logo',       description: 'Header + footer logo (black GMD lockup).', defaultPrompt: 'GMD black logo on white', aspect: '4:3' },
  { key: 'homeHero',            label: 'Home hero',        description: 'Founder portrait in homepage hero.', defaultPrompt: 'Johnny Terra portrait, high contrast black and gold', aspect: '4:5' },
  { key: 'homeBottleneck',      label: 'Home bottleneck',  description: 'Visual for "you are the bottleneck" section.', defaultPrompt: 'Tactical operations diagram, black and gold', aspect: '16:9' },
  { key: 'homeDuality',         label: 'Home duality',     description: 'Image for the machine-vs-human duality section.', defaultPrompt: 'Machine gears overlaid with handshake, monochrome', aspect: '16:9' },
  { key: 'homeFounderQuote',    label: 'Founder quote',    description: 'Wide founder photo in pantry-era story section.', defaultPrompt: 'Founder working late at desk in dim light', aspect: '16:9' },
  { key: 'aboutHero',           label: 'About hero',       description: 'Hero portrait on about page.', defaultPrompt: 'Founder portrait in dark studio, gold rim light', aspect: '3:4' },
  { key: 'aboutPantry',         label: 'About pantry era', description: 'Pantry-office storytelling image.', defaultPrompt: 'Cluttered home office at night, single lamp', aspect: '16:9' },
  { key: 'contactHero',         label: 'Contact video',    description: 'Video thumbnail on Work With Us page.', defaultPrompt: 'Founder talking to camera in studio', aspect: '16:9' },
  { key: 'contactPortrait',     label: 'Contact portrait', description: 'Portrait on contact page.', defaultPrompt: 'Founder seated in studio, confident', aspect: '4:5' },
  { key: 'podcastCover',        label: 'Podcast cover',    description: 'Trust Engine podcast artwork.', defaultPrompt: 'Black and gold podcast cover for The Trust Engine', aspect: '1:1' },
  { key: 'fuelLineHero',        label: 'Fuel Line hero',   description: 'Newsletter landing page hero image.', defaultPrompt: 'Daily email mockup on phone, black and gold', aspect: '4:5' },
  { key: 'eliminationHero',     label: 'Elim Audit hero',  description: 'Elimination Audit hero image.', defaultPrompt: 'Bottleneck diagram, black and gold', aspect: '16:9' },
  { key: 'eliminationPortrait', label: 'Elim Audit founder', description: 'Founder portrait on Elimination Audit page.', defaultPrompt: 'Founder thinking, dark studio', aspect: '3:4' },
  { key: 'systemPackHero',      label: 'System Pack hero', description: 'Founder + system pack mockup hero.', defaultPrompt: 'Founder holding system pack mockup', aspect: '4:5' },
  { key: 'startHereHero',       label: 'Start Here hero',  description: 'Image at top of Start Here page.', defaultPrompt: 'Roadmap blueprint, gold lines on black', aspect: '16:9' },
  { key: 'resourcesHero',       label: 'Resources hero',   description: 'Image at top of Resources page.', defaultPrompt: 'Tactical toolkit overhead shot, black and gold', aspect: '16:9' },
  { key: 'speakingHero',        label: 'Speaking hero',    description: 'Image at top of Speaking page.', defaultPrompt: 'Keynote stage with single spotlight', aspect: '16:9' },
];

// ---------- design tokens ----------

const DISPLAY = `'Anton', 'Bebas Neue', 'Oswald', sans-serif`;
const SANS    = `'IBM Plex Sans', 'Inter', system-ui, sans-serif`;

const INK         = '#0A0A0A';   // near-black background
const INK_DEEP    = '#000000';   // pure black for footer
const PAPER       = '#FAFAFA';   // off-white panels
const PAPER_WARM  = '#F4F1EC';   // warm cream alt
const PANEL       = '#FFFFFF';
const BODY_LIGHT  = 'rgba(255,255,255,0.78)';
const BODY_DARK   = '#3A3A3A';
const MUTED_DARK  = '#1A1A1A';
const GOLD        = '#E5B83A';   // primary accent
const GOLD_DEEP   = '#C99A1F';
const GOLD_SOFT   = 'rgba(229,184,58,0.14)';
const HAIRLINE    = 'rgba(255,255,255,0.12)';
const HAIRLINE_LIGHT = 'rgba(10,10,10,0.10)';

// ---------- inline HTML helpers ----------

function ctaButton(opts: {
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  align?: 'left' | 'center';
  onDark?: boolean;
}) {
  const justify = opts.align === 'left' ? 'flex-start' : 'center';
  const onDark = opts.onDark !== false; // default to dark since most sections are dark
  const secondaryColor = onDark ? '#FFFFFF' : INK;
  const secondaryBorder = onDark ? 'rgba(255,255,255,0.30)' : 'rgba(10,10,10,0.20)';
  return `
    <div style="display:flex;gap:14px;justify-content:${justify};flex-wrap:wrap;margin-top:36px">
      <a href="${opts.primaryUrl}" style="display:inline-flex;align-items:center;gap:10px;background:${GOLD};color:${INK};padding:18px 32px;border-radius:0;text-decoration:none;font-weight:700;font-size:13px;font-family:${SANS};letter-spacing:0.16em;text-transform:uppercase;border:2px solid ${GOLD};transition:all .2s">
        ${opts.primaryLabel}<span style="font-size:14px">→</span>
      </a>
      ${opts.secondaryLabel ? `
      <a href="${opts.secondaryUrl ?? '#'}" style="display:inline-flex;align-items:center;gap:10px;background:transparent;color:${secondaryColor};padding:18px 32px;border:2px solid ${secondaryBorder};border-radius:0;text-decoration:none;font-weight:700;font-size:13px;font-family:${SANS};letter-spacing:0.16em;text-transform:uppercase">
        ${opts.secondaryLabel}
      </a>` : ''}
    </div>`;
}

function eyebrow(label: string, onDark = true) {
  const c = onDark ? GOLD : GOLD_DEEP;
  return `<div style="display:inline-flex;align-items:center;gap:12px;font-family:${SANS};font-size:11px;font-weight:700;color:${c};letter-spacing:0.32em;text-transform:uppercase">
    <span style="display:inline-block;width:32px;height:1px;background:${c}"></span>${label}
  </div>`;
}

function arrowIcon(color = GOLD) {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
}

function checkBlock(color = GOLD) {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><polyline points="20 6 9 17 4 12"/></svg>`;
}

function pillTag(label: string) {
  return `<span style="display:inline-block;padding:6px 12px;background:${GOLD_SOFT};color:${GOLD};font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;border:1px solid rgba(229,184,58,0.35)">${label}</span>`;
}

// ---------- shared chrome ----------

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Podcast', url: '/podcast' },
  { label: 'Newsletter', url: '/fuel-line' },
  { label: 'Resources', url: '/resources' },
  { label: 'Work With Us', url: '/contact' },
];

function SharedHeader({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const logo = images.logo;
  return (
    <HeaderSection
      background={INK}
      textColor="#FFFFFF"
      sticky
      stickyBackgroundColor={INK}
      stickyTextColor="#FFFFFF"
      paddingDesktop={{ top: '18', bottom: '18' }}
      horizontalAlignment="between"
    >
      <Logo type="image" imageUrl={logo?.url ?? imgLogoStacked} text={brand} imageAlt={brand} width="120" />
      <Menu handle="main-menu" alignment="right" previewItems={NAV_ITEMS} />
      <Text width="3" align="right"
        text={`<div style="font-family:${SANS}"><a href="/system-pack" style="display:inline-block;background:${GOLD};color:${INK};padding:12px 22px;text-decoration:none;font-weight:700;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;border:2px solid ${GOLD}">Stop Being the Bottleneck</a></div>`}
      />
    </HeaderSection>
  );
}

function SharedFooter({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <FooterSection
      background={INK_DEEP}
      textColor={BODY_LIGHT}
      paddingDesktop={{ top: '90', bottom: '40' }}
    >
      <Text width="12" align="center"
        text={`<div style="font-family:${DISPLAY};text-align:center;padding-bottom:50px;border-bottom:1px solid ${HAIRLINE};margin-bottom:50px">
          <div style="font-family:${SANS};font-size:11px;font-weight:700;color:${GOLD};letter-spacing:0.32em;text-transform:uppercase;margin-bottom:18px">— GMAD —</div>
          <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:0;letter-spacing:0.01em;text-transform:uppercase">
            <em style="font-style:italic;color:${BODY_LIGHT};font-weight:400">Grit gets you started.</em><br/>
            <span style="color:${GOLD}">Systems get you free.</span>
          </h2>
        </div>`}
      />
      <Logo type="image" imageUrl={imgLogoStacked} text={brand} imageAlt={brand} width="120" />
      <LinkList heading="Explore" handle="footer-explore" layout="vertical" />
      <LinkList heading="Free Resources" handle="footer-resources" layout="vertical" />
      <LinkList heading="Legal" handle="footer-legal" layout="vertical" />
      <SocialIcons instagram="https://instagram.com" linkedin="https://linkedin.com" youtube="https://youtube.com" />
      <Copyright text="iQpreneur LLC. All rights reserved." />
    </FooterSection>
  );
}

// ---------- HOME ----------

function HomePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const hero = images.homeHero;
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      {/* Hero — magazine cover, black background */}
      <ContentSection name="Hero" background={INK} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:20px">
            ${eyebrow('Volume 01 · The Operator Brief')}
            <h1 style="font-family:${DISPLAY};font-size:96px;line-height:0.94;font-weight:400;color:#FFFFFF;margin:32px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              Success without<br/>systems is a<br/><span style="color:${GOLD}">prison.</span>
            </h1>
            <p style="max-width:520px;margin:36px 0 0;font-size:18px;line-height:1.7;color:${BODY_LIGHT};font-family:${SANS}">
              Grit gets you started. Systems get you free. ${brand} is the operating system for service entrepreneurs who are ready to escape the Hustle Trap and transform chaos into control.
            </p>
            ${ctaButton({ primaryLabel: 'Get the System Pack', primaryUrl: '/system-pack', secondaryLabel: "Read Johnny's Story", secondaryUrl: '/about', align: 'left' })}
          </div>`}
        />
        {hero && <Image src={hero.url} alt={hero.alt} colWidth="5" imageBorderRadius="0" align="center" />}
      </ContentSection>

      {/* Gold ticker */}
      <ContentSection name="Promise ticker" background={GOLD} textColor={INK} paddingDesktop={{ top: '22', bottom: '22' }}>
        <Text width="12" align="center"
          text={`<div style="font-family:${SANS};color:${INK};font-size:12px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:30px;flex-wrap:wrap">
            <span>Action Over Theory</span><span style="opacity:.4">/</span>
            <span>Build the Machine</span><span style="opacity:.4">/</span>
            <span>Reclaim Your Time</span><span style="opacity:.4">/</span>
            <span>Scale Without Burnout</span>
          </div>`}
        />
      </ContentSection>

      {/* Who this is for — three pillars */}
      <ContentSection name="Who this is for" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto 70px;text-align:center">
            ${eyebrow('Who this is for')}
            <h2 style="font-family:${DISPLAY};font-size:62px;line-height:1.04;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Are you a successful<br/>service entrepreneur<br/><span style="color:${GOLD}">trapped by the hustle?</span>
            </h2>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};border-top:2px solid ${GOLD};padding-top:28px">
            <div style="font-family:${DISPLAY};font-size:64px;color:${GOLD};line-height:1;font-weight:400">01</div>
            <h3 style="font-family:${DISPLAY};font-size:24px;line-height:1.2;font-weight:400;color:#FFFFFF;margin:14px 0 0;text-transform:uppercase;letter-spacing:0.02em">You ARE the Machine</h3>
            <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:${BODY_LIGHT}">You're the bottleneck for everything. You are simultaneously doing the $1000/hr strategy work and the $10/hr admin. The business cannot run without you.</p>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};border-top:2px solid ${GOLD};padding-top:28px">
            <div style="font-family:${DISPLAY};font-size:64px;color:${GOLD};line-height:1;font-weight:400">02</div>
            <h3 style="font-family:${DISPLAY};font-size:24px;line-height:1.2;font-weight:400;color:#FFFFFF;margin:14px 0 0;text-transform:uppercase;letter-spacing:0.02em">Drowning in Hustle</h3>
            <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:${BODY_LIGHT}">You are working 16-hour days, constantly firefighting, and overwhelmed by the complexity. Burnout is inevitable.</p>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};border-top:2px solid ${GOLD};padding-top:28px">
            <div style="font-family:${DISPLAY};font-size:64px;color:${GOLD};line-height:1;font-weight:400">03</div>
            <h3 style="font-family:${DISPLAY};font-size:24px;line-height:1.2;font-weight:400;color:#FFFFFF;margin:14px 0 0;text-transform:uppercase;letter-spacing:0.02em">Growth is Stagnant</h3>
            <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:${BODY_LIGHT}">You have hit a ceiling where effort alone is no longer enough to scale. You're trapped in the time-for-money trap or the Feast or Famine cycle.</p>
          </div>`}
        />
      </ContentSection>

      {/* The diagnosis — split */}
      <ContentSection name="Hustle is failure of systems" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Image src={imgHomeFailure} alt="The hustle is a failure of systems" colWidth="6" imageBorderRadius="0" align="center" />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:30px">
            ${eyebrow('The diagnosis', false)}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              The hustle is a<br/><span style="color:${GOLD_DEEP}">failure of systems.</span>
            </h2>
            <p style="margin:26px 0 0;font-size:18px;line-height:1.75;color:${BODY_DARK};max-width:520px">
              The anxiety you feel is not because you lack grit. It is because you lack the systems and the clarity to scale intentionally.
            </p>
            <p style="margin:18px 0 0;font-size:18px;line-height:1.75;color:${BODY_DARK};max-width:520px">
              At ${brand}, we provide the blueprint to transform you from a <strong style="color:${INK}">Reactive Hustler</strong> into an <strong style="color:${INK}">Intentional Operator.</strong>
            </p>
          </div>`}
        />
      </ContentSection>

      {/* The duality — machine vs human */}
      <ContentSection name="Duality" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 60px;text-align:center">
            ${eyebrow('The duality')}
            <h2 style="font-family:${DISPLAY};font-size:58px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              A successful business must<br/>achieve a <span style="color:${GOLD}">crucial duality.</span>
            </h2>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:48px 44px;border:1px solid ${HAIRLINE};border-top:4px solid ${GOLD}">
            <div style="font-family:${DISPLAY};font-size:14px;color:${GOLD};letter-spacing:0.3em;text-transform:uppercase;margin-bottom:18px">/ 01 /</div>
            <h3 style="font-family:${DISPLAY};font-size:42px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:0;text-transform:uppercase;letter-spacing:0.005em">Scales Like a Machine.</h3>
            <p style="margin:22px 0 0;font-size:16px;line-height:1.7;color:${BODY_LIGHT}">Efficiency, logic, and predictable processes. Repeatable systems that produce repeatable results — without your hand on every lever.</p>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:48px 44px;border:1px solid ${HAIRLINE};border-top:4px solid ${GOLD}">
            <div style="font-family:${DISPLAY};font-size:14px;color:${GOLD};letter-spacing:0.3em;text-transform:uppercase;margin-bottom:18px">/ 02 /</div>
            <h3 style="font-family:${DISPLAY};font-size:42px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:0;text-transform:uppercase;letter-spacing:0.005em">Sells Like a Human.</h3>
            <p style="margin:22px 0 0;font-size:16px;line-height:1.7;color:${BODY_LIGHT}">Authenticity, transparency, and human connection. Trust earned, not chased. The Trust Engine that turns clients into advocates.</p>
          </div>`}
        />
      </ContentSection>

      {/* Founder credibility */}
      <ContentSection name="Founder credibility" background={PAPER_WARM} textColor={INK} paddingDesktop={{ top: '120', bottom: '120' }}>
        <Image src={imgPantryEra} alt="Johnny Terra, the pantry era" colWidth="5" imageBorderRadius="0" align="center" />
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:36px">
            ${eyebrow('I lived this trap', false)}
            <h2 style="font-family:${DISPLAY};font-size:56px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              I know the trap because<br/><span style="color:${GOLD_DEEP}">I lived in it.</span>
            </h2>
            <p style="margin:28px 0 0;font-size:17px;line-height:1.78;color:${BODY_DARK};max-width:560px">
              I'm Johnny Terra, CPA. My journey started with $200 and sheer grit. It led me to build a successful CPA firm — working 16-hour days out of a pantry.
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_DARK};max-width:560px">
              <strong style="color:${INK}">I realized that working harder wasn't a badge of honor; it was a failure of systems.</strong> If you don't build the machine, you'll <em>be</em> the machine forever.
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_DARK};max-width:560px">
              I engineered the escape route using the frameworks I now teach. I'm not a guru. I'm the crash-test dummy.
            </p>
            ${ctaButton({ primaryLabel: 'Read the Full Story', primaryUrl: '/about', align: 'left', onDark: false })}
          </div>`}
        />
      </ContentSection>

      {/* Ecosystem */}
      <ContentSection name="GMAD Ecosystem" background={INK} paddingDesktop={{ top: '120', bottom: '120' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto 70px;text-align:center">
            ${eyebrow('The integrated blueprint')}
            <h2 style="font-family:${DISPLAY};font-size:62px;line-height:1.04;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              The GMAD <span style="color:${GOLD}">Ecosystem.</span>
            </h2>
            <p style="margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY_LIGHT};max-width:560px">Three free entry points. One operating system. Pick your channel and start building.</p>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:40px 36px;border:1px solid ${HAIRLINE};height:100%;display:flex;flex-direction:column">
            ${pillTag('The Show')}
            <h3 style="font-family:${DISPLAY};font-size:34px;line-height:1.1;font-weight:400;color:#FFFFFF;margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">The Trust Engine</h3>
            <p style="margin:14px 0 28px;font-size:15px;line-height:1.7;color:${BODY_LIGHT};flex:1">A tactical workshop podcast for service entrepreneurs ready to install a real operating system.</p>
            <a href="/podcast" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px">Listen now ${arrowIcon()}</a>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:40px 36px;border:1px solid ${HAIRLINE};height:100%;display:flex;flex-direction:column">
            ${pillTag('Daily Email')}
            <h3 style="font-family:${DISPLAY};font-size:34px;line-height:1.1;font-weight:400;color:#FFFFFF;margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">The Fuel Line</h3>
            <p style="margin:14px 0 28px;font-size:15px;line-height:1.7;color:${BODY_LIGHT};flex:1">One daily leadership insight. Read in 90 seconds. Actionable immediately. No fluff.</p>
            <a href="/fuel-line" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px">Subscribe free ${arrowIcon()}</a>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:40px 36px;border:1px solid ${HAIRLINE};height:100%;display:flex;flex-direction:column">
            ${pillTag('Free Templates')}
            <h3 style="font-family:${DISPLAY};font-size:34px;line-height:1.1;font-weight:400;color:#FFFFFF;margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">The System Pack</h3>
            <p style="margin:14px 0 28px;font-size:15px;line-height:1.7;color:${BODY_LIGHT};flex:1">5 battle-tested templates I used to scale my CPA firm past $5M and reclaim my time.</p>
            <a href="/system-pack" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px">Download free ${arrowIcon()}</a>
          </div>`}
        />
      </ContentSection>

      {/* Featured offer — system pack */}
      <ContentSection name="Featured offer" background={PAPER} textColor={INK} paddingDesktop={{ top: '120', bottom: '120' }}>
        <Image src={imgSPMockup} alt="The GMAD System Pack" colWidth="6" imageBorderRadius="0" align="center" />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};padding-left:30px">
            ${eyebrow('Free download', false)}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:${INK};margin:20px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Transform Chaos<br/>into <span style="color:${GOLD_DEEP}">Control.</span>
            </h2>
            <p style="margin:24px 0 0;font-size:17px;line-height:1.78;color:${BODY_DARK};max-width:520px">
              The 5 foundational system blueprints I used to scale my CPA firm past $5M/year and buy back my life. Action Over Theory.
            </p>
            <ul style="list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:14px;max-width:480px">
              ${[
                'The Intentional Operator\u2019s Weekly Blueprint',
                'The Perfect SOP Template',
                'The Client Onboarding System',
                'The Elimination Audit (Diagnostic)',
                'The Financial Fortress Scorecard',
              ].map(t => `<li style="display:flex;gap:14px;align-items:flex-start;font-size:15px;line-height:1.55;color:${INK};font-weight:500"><span style="margin-top:2px;flex-shrink:0">${checkBlock(GOLD_DEEP)}</span><span>${t}</span></li>`).join('')}
            </ul>
            ${ctaButton({ primaryLabel: 'Get the System Pack — Free', primaryUrl: '/system-pack', align: 'left', onDark: false })}
          </div>`}
        />
      </ContentSection>

      {/* Final CTA */}
      <ContentSection name="Final CTA" background={INK_DEEP} paddingDesktop={{ top: '130', bottom: '130' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:840px;margin:0 auto">
            ${eyebrow('Stop being the bottleneck')}
            <h2 style="font-family:${DISPLAY};font-size:78px;line-height:1.0;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Build the<br/><span style="color:${GOLD}">machine.</span>
            </h2>
            <p style="margin:28px auto 0;font-size:18px;line-height:1.7;color:${BODY_LIGHT};max-width:560px">
              You've been the engine long enough. It's time to engineer your escape.
            </p>
            ${ctaButton({ primaryLabel: 'Apply to Work With Us', primaryUrl: '/contact', secondaryLabel: 'Get the System Pack', secondaryUrl: '/system-pack' })}
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- ABOUT ----------

function AboutPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  const aboutHero = images.aboutHero;
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="About hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Founder · Johnny Terra, CPA')}
            <h1 style="font-family:${DISPLAY};font-size:88px;line-height:0.96;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              Grit gets you started.<br/><span style="color:${GOLD}">Systems get you free.</span>
            </h1>
            <p style="max-width:560px;margin:34px 0 0;font-size:18px;line-height:1.78;color:${BODY_LIGHT}">
              ${brand} is the operating system for service entrepreneurs to escape the Hustle Trap, transform chaos into control, and build a legacy.
            </p>
          </div>`}
        />
        {aboutHero && <Image src={aboutHero.url} alt={aboutHero.alt} colWidth="5" imageBorderRadius="0" align="center" />}
      </ContentSection>

      <ContentSection name="The lie" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="left" width="12"
          text={`<div style="font-family:${SANS};max-width:820px;margin:0 auto">
            ${eyebrow('You have been sold a lie', false)}
            <h2 style="font-family:${DISPLAY};font-size:62px;line-height:1.04;font-weight:400;color:${INK};margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              You have been sold <span style="color:${GOLD_DEEP}">a lie.</span>
            </h2>
            <p style="margin:30px 0 0;font-size:18px;line-height:1.8;color:${BODY_DARK}">
              The lie that success requires 16-hour days, endless sacrifice, and constant burnout. The lie that the hustle is the path to freedom. <strong style="color:${INK}">We call it the hustle. But it is really a trap.</strong>
            </p>
            <p style="margin:22px 0 0;font-size:18px;line-height:1.8;color:${BODY_DARK}">
              If you are the hardest-working person in your company, your business is broken. You are the bottleneck. You are simultaneously doing the $1,000/hour strategy work and the $10/hour administrative work.
            </p>
            <p style="margin:22px 0 0;font-size:18px;line-height:1.8;color:${BODY_DARK}">
              You are successful, but you are trapped. <strong style="color:${INK}">And if you do not build the machine, you will be the machine forever.</strong>
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="From Brazil" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Image src={imgFounderHero} alt="Johnny Terra" colWidth="5" imageBorderRadius="0" align="center" />
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:36px">
            ${eyebrow('I lived the trap')}
            <h2 style="font-family:${DISPLAY};font-size:48px;line-height:1.06;font-weight:400;color:#FFFFFF;margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              I know the trap because<br/><span style="color:${GOLD}">I lived it.</span>
            </h2>
            <p style="margin:28px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:560px">
              My journey didn't start in a boardroom. It started in 2008 when I arrived in the United States from Brazil. I had $200 in my pocket and didn't speak English.
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:560px">
              <strong style="color:#FFFFFF">For me, the hustle wasn't a choice; it was survival.</strong>
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:560px">
              I lived a life of duality from the start. I was the captain of the college basketball team — the highest level of leadership. But I was also the guy washing the team's laundry to pay for essentials. High-value work and low-value work, simultaneously.
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:560px">
              When I got my first accounting job, I didn't have a car. Every morning I'd put on my running shoes, put my dress shoes in a bag, and walk 12 blocks to the office. Rain or shine. <strong style="color:${GOLD}">Action Over Theory.</strong>
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="The pantry" background={PAPER_WARM} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:36px">
            ${eyebrow('The pantry-office era', false)}
            <h2 style="font-family:${DISPLAY};font-size:48px;line-height:1.06;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              I started my CPA firm<br/><span style="color:${GOLD_DEEP}">in a pantry.</span>
            </h2>
            <p style="margin:28px 0 0;font-size:17px;line-height:1.78;color:${BODY_DARK};max-width:560px">
              For five years, my "office" was the pantry in our home. I worked from 5 AM to 11 PM. The business was growing rapidly. By every outside metric, I was a success story.
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_DARK};max-width:560px">
              But I was trapped. I was back in the laundry room — except this time, the laundry was my own business.
            </p>
            <div style="margin:36px 0 0;padding:28px 32px;border-left:4px solid ${GOLD};background:${PANEL}">
              <p style="font-family:${DISPLAY};font-size:34px;line-height:1.1;font-weight:400;color:${INK};margin:0;text-transform:uppercase;letter-spacing:0.005em">
                "Success without systems<br/>is a <span style="color:${GOLD_DEEP}">prison.</span>"
              </p>
              <p style="margin:18px 0 0;font-family:${SANS};font-size:13px;font-weight:700;color:${BODY_DARK};letter-spacing:0.18em;text-transform:uppercase">— The realization in the pantry</p>
            </div>
          </div>`}
        />
        <Image src={imgAboutRealization} alt="The realization" colWidth="5" imageBorderRadius="0" align="center" />
      </ContentSection>

      <ContentSection name="Code of the Operator" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 60px;text-align:center">
            ${eyebrow('The operator code')}
            <h2 style="font-family:${DISPLAY};font-size:58px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              The Code of the<br/><span style="color:${GOLD}">Intentional Operator.</span>
            </h2>
          </div>`}
        />
        ${[
          { n: '01', t: 'Action Over Theory', d: 'We build, ship, iterate. Perfect plans collect dust. Imperfect execution earns CPAs and revenue.' },
          { n: '02', t: 'Systems Over Hustle', d: 'Effort is the catalyst. Systems are the blueprint. We refuse to confuse the two.' },
          { n: '03', t: 'Data Over Drama', d: 'Decisions get made on numbers, not feelings. The Financial Fortress is non-negotiable.' },
          { n: '04', t: 'Radical Transparency', d: 'We share the wins, the losses, and the stupid mistakes. The whole truth is the only fuel that scales.' },
          { n: '05', t: 'Build the Machine', d: 'You will either build the machine or be the machine. There is no third option.' },
          { n: '06', t: 'Reclaim Your Time', d: 'Money is a renewable resource. Time is not. Every system we install buys back hours.' },
        ].map(item => `\n          <Text width="4" align="left"\n            text={\`<div style=\"font-family:${SANS};padding:36px 32px;background:${MUTED_DARK};border:1px solid ${HAIRLINE};border-top:3px solid ${GOLD};height:100%\"><div style=\"font-family:${DISPLAY};font-size:48px;color:${GOLD};line-height:1;font-weight:400\">${item.n}</div><h3 style=\"font-family:${DISPLAY};font-size:24px;line-height:1.2;font-weight:400;color:#FFFFFF;margin:14px 0 0;text-transform:uppercase;letter-spacing:0.01em\">${item.t}</h3><p style=\"margin:14px 0 0;font-size:14px;line-height:1.7;color:${BODY_LIGHT}\">${item.d}</p></div>\`}\n          />`).join('')}
      </ContentSection>

      <ContentSection name="About CTA" background={GOLD} textColor={INK} paddingDesktop={{ top: '120', bottom: '120' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center">
            <h2 style="font-family:${DISPLAY};font-size:64px;line-height:1.02;font-weight:400;color:${INK};margin:0;letter-spacing:0.01em;text-transform:uppercase">
              Ready to escape<br/>the prison?
            </h2>
            <p style="margin:24px auto 0;font-size:17px;line-height:1.7;color:${INK};max-width:560px;font-weight:500">
              Start with the free System Pack — the same templates I used to scale my firm past $5M and reclaim my time.
            </p>
            <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:36px">
              <a href="/system-pack" style="display:inline-flex;align-items:center;gap:10px;background:${INK};color:${GOLD};padding:18px 32px;text-decoration:none;font-weight:700;font-size:13px;font-family:${SANS};letter-spacing:0.16em;text-transform:uppercase;border:2px solid ${INK}">Get the System Pack →</a>
              <a href="/contact" style="display:inline-flex;align-items:center;gap:10px;background:transparent;color:${INK};padding:18px 32px;text-decoration:none;font-weight:700;font-size:13px;font-family:${SANS};letter-spacing:0.16em;text-transform:uppercase;border:2px solid ${INK}">Work With Us</a>
            </div>
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- CONTACT / WORK WITH US ----------

function ContactPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Contact hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Work with us · selective')}
            <h1 style="font-family:${DISPLAY};font-size:84px;line-height:0.98;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              Systems get<br/>you <span style="color:${GOLD}">free.</span>
            </h1>
            <p style="max-width:560px;margin:32px 0 0;font-size:18px;line-height:1.78;color:${BODY_LIGHT}">
              We prioritize impact over volume. We work with a select number of established service entrepreneurs each year who are ready to escape the Hustle Trap and scale intentionally.
            </p>
            <p style="max-width:560px;margin:18px 0 0;font-size:17px;line-height:1.7;color:${BODY_LIGHT}">
              <strong style="color:${GOLD}">This process is rigorous.</strong> It requires commitment, radical transparency, and a dedication to Action Over Theory.
            </p>
          </div>`}
        />
        <Image src={imgContactVideo} alt="Work with us" colWidth="5" imageBorderRadius="0" align="center" />
      </ContentSection>

      <ContentSection name="Two engagements" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto 60px;text-align:center">
            ${eyebrow('Two engagements', false)}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Built for the<br/><span style="color:${GOLD_DEEP}">Intentional Operator.</span>
            </h2>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${PANEL};padding:48px 44px;border:1px solid ${HAIRLINE_LIGHT};border-top:4px solid ${GOLD};height:100%">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
              <span style="font-family:${DISPLAY};font-size:48px;color:${GOLD_DEEP};line-height:1">01</span>
              <span style="font-family:${SANS};font-size:11px;font-weight:700;color:${BODY_DARK};letter-spacing:0.22em;text-transform:uppercase">The Diagnostic</span>
            </div>
            <h3 style="font-family:${DISPLAY};font-size:36px;line-height:1.05;font-weight:400;color:${INK};margin:0;text-transform:uppercase;letter-spacing:0.005em">The System Audit</h3>
            <p style="margin:20px 0 0;font-size:15px;line-height:1.75;color:${BODY_DARK}">
              A comprehensive analysis of your business — Finance, Operations, Growth — to identify the root causes of the hustle and engineer the prioritized blueprint for your machine. We analyze the data, identify the bottlenecks, and define the strategy.
            </p>
            <div style="margin-top:28px;padding-top:24px;border-top:1px solid ${HAIRLINE_LIGHT}">
              <div style="font-family:${SANS};font-size:11px;font-weight:700;color:${BODY_DARK};letter-spacing:0.18em;text-transform:uppercase">Best for</div>
              <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:${INK}">Operators who need clarity before commitment. The starting line for any deeper engagement.</p>
            </div>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${INK};padding:48px 44px;border:1px solid ${HAIRLINE};border-top:4px solid ${GOLD};height:100%">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
              <span style="font-family:${DISPLAY};font-size:48px;color:${GOLD};line-height:1">02</span>
              <span style="font-family:${SANS};font-size:11px;font-weight:700;color:${BODY_LIGHT};letter-spacing:0.22em;text-transform:uppercase">The Implementation</span>
            </div>
            <h3 style="font-family:${DISPLAY};font-size:36px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:0;text-transform:uppercase;letter-spacing:0.005em">The Architect Program</h3>
            <p style="margin:20px 0 0;font-size:15px;line-height:1.75;color:${BODY_LIGHT}">
              A high-touch, 1:1 strategic partnership (6-18 months) to implement the GMAD Operating System, optimize financial performance, and achieve sustainable scale. Requires completion of The System Audit.
            </p>
            <div style="margin-top:28px;padding-top:24px;border-top:1px solid ${HAIRLINE}">
              <div style="font-family:${SANS};font-size:11px;font-weight:700;color:${GOLD};letter-spacing:0.18em;text-transform:uppercase">Best for</div>
              <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#FFFFFF">Established operators ready for full strategic implementation, not just diagnosis.</p>
            </div>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Right fit" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 60px;text-align:center">
            ${eyebrow('Before we discuss anything')}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              We must ensure<br/><span style="color:${GOLD}">alignment.</span>
            </h2>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:44px 40px;border:1px solid ${HAIRLINE};border-left:4px solid ${GOLD};height:100%">
            <h3 style="font-family:${DISPLAY};font-size:28px;line-height:1.1;font-weight:400;color:${GOLD};margin:0;text-transform:uppercase;letter-spacing:0.01em">We are the right fit if:</h3>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'You run an established service business (Agency, Consulting, Professional Services, Trades) doing $100k–$5M.',
                'You are committed to escaping the hustle and building a scalable machine.',
                'You value data over drama and seek systemic solutions, not quick hacks.',
                'You are prepared to invest significant resources — financial and time — into transformation.',
                'You are coachable and ready to execute. Action Over Theory.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:15px;line-height:1.6;color:#FFFFFF"><span style="margin-top:2px;flex-shrink:0">${checkBlock()}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:44px 40px;border:1px solid ${HAIRLINE};border-left:4px solid #555;height:100%">
            <h3 style="font-family:${DISPLAY};font-size:28px;line-height:1.1;font-weight:400;color:#999;margin:0;text-transform:uppercase;letter-spacing:0.01em">We are NOT a fit if:</h3>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:14px">
              ${[
                'You are in the startup phase or pre-revenue.',
                'You are looking for "get-rich-quick" schemes or marketing gimmicks.',
                'You want a coach to validate your current chaos.',
                'You want to outsource the thinking — this is a partnership, not a magic wand.',
                'You are unwilling to be radically transparent with your numbers.',
              ].map(t => `<li style="display:flex;gap:12px;align-items:flex-start;font-size:15px;line-height:1.6;color:${BODY_LIGHT}"><span style="color:#555;font-size:18px;font-weight:700;line-height:1;margin-top:2px;flex-shrink:0">×</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Lower commitment" background={PAPER_WARM} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto 50px;text-align:center">
            ${eyebrow('Not ready for the Architect Program?', false)}
            <h2 style="font-family:${DISPLAY};font-size:46px;line-height:1.08;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Three lower-commitment<br/><span style="color:${GOLD_DEEP}">paths in.</span>
            </h2>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};background:${PANEL};padding:36px 32px;border:1px solid ${HAIRLINE_LIGHT};height:100%">
            ${pillTag('Free')}
            <h3 style="font-family:${DISPLAY};font-size:26px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">The System Pack</h3>
            <p style="margin:14px 0 24px;font-size:14px;line-height:1.7;color:${BODY_DARK}">5 foundational templates to start building your machine today.</p>
            <a href="/system-pack" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD_DEEP};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase">Download free →</a>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};background:${PANEL};padding:36px 32px;border:1px solid ${HAIRLINE_LIGHT};height:100%">
            ${pillTag('Waitlist')}
            <h3 style="font-family:${DISPLAY};font-size:26px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">Elimination Audit</h3>
            <p style="margin:14px 0 24px;font-size:14px;line-height:1.7;color:${BODY_DARK}">Reclaim 10+ hours a week. The diagnostic that finds your bottleneck.</p>
            <a href="/elimination-audit" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD_DEEP};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase">Join waitlist →</a>
          </div>`}
        />
        <Text width="4" align="left"
          text={`<div style="font-family:${SANS};background:${PANEL};padding:36px 32px;border:1px solid ${HAIRLINE_LIGHT};height:100%">
            ${pillTag('Daily')}
            <h3 style="font-family:${DISPLAY};font-size:26px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">The Fuel Line</h3>
            <p style="margin:14px 0 24px;font-size:14px;line-height:1.7;color:${BODY_DARK}">One leadership insight, every morning. Read in 90 seconds.</p>
            <a href="/fuel-line" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD_DEEP};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase">Subscribe →</a>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Apply" background={INK_DEEP} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:680px;margin:0 auto">
            ${eyebrow('Apply for the engagement')}
            <h2 style="font-family:${DISPLAY};font-size:64px;line-height:1.02;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Submit your<br/><span style="color:${GOLD}">application.</span>
            </h2>
            <p style="margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY_LIGHT};max-width:520px">
              We review every application personally. If there's alignment, we'll schedule a 30-minute discovery call within 5 business days.
            </p>
          </div>`}
        />
        <Form
          width="8"
          heading=""
          text=""
          buttonBackgroundColor={GOLD}
          buttonTextColor={INK}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- PODCAST ----------

function PodcastPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Podcast hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Image src={imgTrustEngine} alt="The Trust Engine podcast" colWidth="5" imageBorderRadius="0" align="center" />
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:36px">
            ${eyebrow('The podcast · weekly')}
            <h1 style="font-family:${DISPLAY};font-size:84px;line-height:0.98;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              The <span style="color:${GOLD}">Trust Engine.</span>
            </h1>
            <p style="max-width:520px;margin:30px 0 0;font-size:18px;line-height:1.78;color:${BODY_LIGHT}">
              The entrepreneurship podcast for service business owners who are tired of the hustle and ready to build a business that works for them.
            </p>
            <p style="max-width:520px;margin:18px 0 0;font-size:16px;line-height:1.7;color:${BODY_LIGHT}">
              <strong style="color:${GOLD}">Hosted by Johnny Terra, CPA.</strong> A roll-up-your-sleeves workshop on how to install a real operating system in your service business.
            </p>
            <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:32px">
              <a href="https://podcasts.apple.com/us/podcast/the-trust-engine/id1841641191" style="display:inline-flex;align-items:center;gap:10px;background:${GOLD};color:${INK};padding:16px 26px;text-decoration:none;font-weight:700;font-size:12px;font-family:${SANS};letter-spacing:0.16em;text-transform:uppercase;border:2px solid ${GOLD}">Listen on Apple →</a>
              <a href="https://open.spotify.com/show/3rXdAMr3wtmrlMxUxEL9Ma" style="display:inline-flex;align-items:center;gap:10px;background:transparent;color:#FFFFFF;padding:16px 26px;text-decoration:none;font-weight:700;font-size:12px;font-family:${SANS};letter-spacing:0.16em;text-transform:uppercase;border:2px solid rgba(255,255,255,0.3)">Listen on Spotify</a>
            </div>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="What this is" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="left" width="6"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('What this show is', false)}
            <h2 style="font-family:${DISPLAY};font-size:46px;line-height:1.06;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              This is <span style="color:${GOLD_DEEP}">not</span> another<br/>interview show.
            </h2>
            <p style="margin:26px 0 0;font-size:17px;line-height:1.78;color:${BODY_DARK}">
              This is a tactical business podcast where 7-figure firm founder Johnny Terra gives you the actionable systems and financial frameworks to escape the "hustle trap."
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_DARK}">
              Each episode is a workshop on how to move from <strong style="color:${INK}">"doing the work"</strong> to <strong style="color:${INK}">"building the machine."</strong>
            </p>
          </div>`}
        />
        <Text align="left" width="6"
          text={`<div style="font-family:${SANS};padding-left:24px">
            ${eyebrow('What you\u2019ll learn', false)}
            <h3 style="font-family:${DISPLAY};font-size:32px;line-height:1.1;font-weight:400;color:${INK};margin:22px 0 0;text-transform:uppercase;letter-spacing:0.005em">Subscribe to learn:</h3>
            <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:16px">
              ${[
                'How to scale a service business without burnout.',
                'Service entrepreneur tools and tech stacks.',
                'Building client trust through operational excellence.',
                'Financial clarity and escaping the "Clarity Penalty."',
                'Hiring systems that scale beyond the founder.',
              ].map((t,i) => `<li style="display:flex;gap:14px;align-items:flex-start;font-size:15px;line-height:1.6;color:${INK}"><span style="font-family:${DISPLAY};font-size:18px;color:${GOLD_DEEP};font-weight:400;flex-shrink:0">0${i+1}</span><span>${t}</span></li>`).join('')}
            </ul>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Featured episodes" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto 60px;text-align:center">
            ${eyebrow('Featured episodes')}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Where to <span style="color:${GOLD}">start.</span>
            </h2>
          </div>`}
        />
        ${[
          { ep: 'Ep 06', title: 'The Escape Plan: 5 Pillars of the Trust Engine', d: 'JT consolidates the lessons from the journey — from the 12-block walk to the pantry office to the laundry room — into 5 actionable pillars.' },
          { ep: 'Ep 05', title: 'The 12-Block Walk (Action Precedes Perfection)', d: 'JT shares the story of his first commute in the U.S. and reveals why "imperfect" action beats every perfect plan that gathers dust.' },
          { ep: 'Ep 04', title: 'Stop Chasing Clients (Build a Trust Engine)', d: 'The "Ballroom of Desperation": why traditional networking feels gross and how to escape the hunter trap using the Law of Benevolence.' },
        ].map(e => `\n          <Text width="4" align="left"\n            text={\`<div style=\"font-family:${SANS};background:${MUTED_DARK};padding:36px 32px;border:1px solid ${HAIRLINE};height:100%;display:flex;flex-direction:column\"><div style=\"font-family:${DISPLAY};font-size:14px;color:${GOLD};letter-spacing:0.3em;text-transform:uppercase;margin-bottom:18px\">/ ${e.ep} /</div><h3 style=\"font-family:${DISPLAY};font-size:26px;line-height:1.15;font-weight:400;color:#FFFFFF;margin:0;text-transform:uppercase;letter-spacing:0.005em\">${e.title}</h3><p style=\"margin:18px 0 28px;font-size:14px;line-height:1.7;color:${BODY_LIGHT};flex:1\">${e.d}</p><a href=\"#\" style=\"font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px\">Listen ${arrowIcon()}</a></div>\`}\n          />`).join('')}
      </ContentSection>

      <ContentSection name="Podcast CTA" background={GOLD} textColor={INK} paddingDesktop={{ top: '100', bottom: '100' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center">
            <h2 style="font-family:${DISPLAY};font-size:58px;line-height:1.04;font-weight:400;color:${INK};margin:0;letter-spacing:0.005em;text-transform:uppercase">
              Want it in your inbox<br/>every morning too?
            </h2>
            <p style="margin:22px auto 0;font-size:17px;line-height:1.7;color:${INK};max-width:520px;font-weight:500">
              Get The Fuel Line — one daily leadership insight to extend the conversation between episodes.
            </p>
            <div style="margin-top:32px">
              <a href="/fuel-line" style="display:inline-flex;align-items:center;gap:10px;background:${INK};color:${GOLD};padding:18px 32px;text-decoration:none;font-weight:700;font-size:13px;font-family:${SANS};letter-spacing:0.16em;text-transform:uppercase;border:2px solid ${INK}">Subscribe to The Fuel Line →</a>
            </div>
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- FUEL LINE (newsletter) ----------

function FuelLinePage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Fuel Line hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Daily email · 90 seconds')}
            <h1 style="font-family:${DISPLAY};font-size:88px;line-height:0.96;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              The <span style="color:${GOLD}">Fuel Line.</span>
            </h1>
            <p style="max-width:540px;margin:32px 0 0;font-size:19px;line-height:1.7;color:${BODY_LIGHT}">
              One daily leadership insight to help you stop the grind and start building the machine. <strong style="color:#FFFFFF">Read in 90 seconds. Actionable immediately.</strong>
            </p>
            <p style="max-width:540px;margin:20px 0 0;font-size:16px;line-height:1.7;color:${BODY_LIGHT}">
              No fluff. No abstract theory. Just the fuel you need to build a business that scales like a machine and sells like a person.
            </p>
          </div>`}
        />
        <Image src={imgFuelLineHero} alt="The Fuel Line newsletter" colWidth="5" imageBorderRadius="0" align="center" />
      </ContentSection>

      <ContentSection name="What you get" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 50px;text-align:center">
            ${eyebrow('Every morning, a potent dose of:', false)}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              4 frameworks. <span style="color:${GOLD_DEEP}">Zero fluff.</span>
            </h2>
          </div>`}
        />
        ${[
          { t: 'Systems Thinking', d: 'How to replace the daily grind with predictable processes that compound.' },
          { t: 'Radical Transparency', d: 'The unvarnished truth about what it takes to scale — the wins and the losses.' },
          { t: 'Leadership in the Trenches', d: 'Decision-making frameworks for when things get chaotic and the easy answer is wrong.' },
          { t: 'Smart Work Over Hard', d: 'Identifying the leverage points that create true freedom — not just more hours.' },
        ].map((item,i) => `\n          <Text width="6" align="left"\n            text={\`<div style=\"font-family:${SANS};padding:32px 36px;border-left:3px solid ${GOLD_DEEP};background:${PANEL}\"><div style=\"font-family:${DISPLAY};font-size:14px;color:${GOLD_DEEP};letter-spacing:0.3em;text-transform:uppercase;margin-bottom:12px\">/ 0${i+1} /</div><h3 style=\"font-family:${DISPLAY};font-size:30px;line-height:1.1;font-weight:400;color:${INK};margin:0;text-transform:uppercase;letter-spacing:0.005em\">${item.t}</h3><p style=\"margin:14px 0 0;font-size:15px;line-height:1.7;color:${BODY_DARK}\">${item.d}</p></div>\`}\n          />`).join('')}
      </ContentSection>

      <ContentSection name="Fuel Line opt-in" background={INK_DEEP} paddingDesktop={{ top: '120', bottom: '120' }}>
        <Image src={imgFuelLineBottom} alt="Subscribe to The Fuel Line" colWidth="5" imageBorderRadius="0" align="center" />
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:36px">
            ${eyebrow('Send me the insights')}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.04;font-weight:400;color:#FFFFFF;margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Grit gets you started.<br/><span style="color:${GOLD}">Systems get you free.</span>
            </h2>
            <p style="margin:24px 0 0;font-size:17px;line-height:1.75;color:${BODY_LIGHT};max-width:520px">
              Join the community of Intentional Operators who get the daily fuel they need to transform chaos into control.
            </p>
          </div>`}
        />
        <Form
          width="8"
          heading=""
          text=""
          buttonBackgroundColor={GOLD}
          buttonTextColor={INK}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- ELIMINATION AUDIT ----------

function EliminationAuditPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Elim hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Waitlist · opening soon')}
            <h1 style="font-family:${DISPLAY};font-size:90px;line-height:0.94;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              Stop being the<br/><span style="color:${GOLD}">bottleneck.</span>
            </h1>
            <p style="max-width:540px;margin:32px 0 0;font-size:19px;line-height:1.7;color:${BODY_LIGHT}">
              You cannot scale your business until you reclaim your time.
            </p>
            <p style="max-width:540px;margin:20px 0 0;font-size:17px;line-height:1.7;color:${BODY_LIGHT}">
              The Elimination Audit is the proven system for service entrepreneurs to <strong style="color:${GOLD}">reclaim 10+ hours a week</strong> by systematically eliminating, automating, and delegating the low-value work that keeps you trapped.
            </p>
            ${ctaButton({ primaryLabel: 'Join the Waitlist', primaryUrl: '#waitlist', align: 'left' })}
          </div>`}
        />
        <Image src={imgEliminationHero} alt="The Elimination Audit" colWidth="5" imageBorderRadius="0" align="center" />
      </ContentSection>

      <ContentSection name="Elim diagnosis" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="left" width="12"
          text={`<div style="font-family:${SANS};max-width:820px;margin:0 auto">
            ${eyebrow('Are you the hardest-working person in your business?', false)}
            <h2 style="font-family:${DISPLAY};font-size:58px;line-height:1.04;font-weight:400;color:${INK};margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              If yes, your business<br/><span style="color:${GOLD_DEEP}">is broken.</span>
            </h2>
            <p style="margin:30px 0 0;font-size:18px;line-height:1.8;color:${BODY_DARK}">
              You started your business to gain freedom, but now you have less time than ever. You are trapped in the daily grind — answering endless emails, fighting fires, and handling tasks you know you shouldn't be doing.
            </p>
            <p style="margin:22px 0 0;font-size:18px;line-height:1.8;color:${BODY_DARK}"><strong style="color:${INK}">You are the bottleneck.</strong></p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Elim founder" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Image src={imgEliminationPortrait} alt="Johnny Terra" colWidth="5" imageBorderRadius="0" align="center" />
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:36px">
            ${eyebrow('I built this because I was you')}
            <h2 style="font-family:${DISPLAY};font-size:46px;line-height:1.06;font-weight:400;color:#FFFFFF;margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              I know this because<br/><span style="color:${GOLD}">I was the bottleneck.</span>
            </h2>
            <p style="margin:28px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:560px">
              When I was building my firm, I was simultaneously doing the $1,000/hour work — strategy, leadership, high-value client service — and the $10/hour work — admin, data entry, scheduling.
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:560px">
              <strong style="color:${GOLD}">I realized that working harder wasn't a badge of honor; it was a failure of systems.</strong>
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:560px">
              I developed The Elimination Audit out of necessity. It's the framework that allowed me to escape the grind, scale my firm, and reclaim my freedom. <strong style="color:#FFFFFF">And now, I'm packaging it for you.</strong>
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Elim modules" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto 60px;text-align:center">
            ${eyebrow('What you\u2019ll install', false)}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              The <span style="color:${GOLD_DEEP}">5 modules.</span>
            </h2>
            <p style="margin:22px auto 0;font-size:17px;line-height:1.7;color:${BODY_DARK};max-width:600px">A focused, high-impact System Blueprint. Not abstract theory — tactical, step-by-step implementation.</p>
          </div>`}
        />
        ${[
          { n: '01', t: 'The Reluctant Hustler Pivot', d: 'The mindset shift required to stop valuing busy work and start prioritizing machine-building. How to differentiate $1,000/hr work from $10/hr work — and why you\u2019re focused on the wrong things.' },
          { n: '02', t: 'The Time Audit', d: 'A radical, data-first audit of where your hours actually go. The painful truth that becomes the blueprint for your escape.' },
          { n: '03', t: 'The Elimination Engine', d: 'The decision tree for what to kill, what to automate, what to delegate, and what to protect. The triage that buys back your week.' },
          { n: '04', t: 'The Delegation Architecture', d: 'How to hand off without losing quality. The SOP frameworks, role definitions, and accountability rhythms that make delegation actually work.' },
          { n: '05', t: 'The Operator\u2019s Cadence', d: 'The weekly and monthly rhythms that prevent the bottleneck from ever returning. The maintenance system for the machine you\u2019ve built.' },
        ].map(m => `\n          <Text width="6" align="left"\n            text={\`<div style=\"font-family:${SANS};background:${PANEL};padding:40px 36px;border:1px solid ${HAIRLINE_LIGHT};border-top:4px solid ${GOLD_DEEP};height:100%\"><div style=\"font-family:${DISPLAY};font-size:48px;color:${GOLD_DEEP};line-height:1;font-weight:400\">${m.n}</div><h3 style=\"font-family:${DISPLAY};font-size:26px;line-height:1.15;font-weight:400;color:${INK};margin:14px 0 0;text-transform:uppercase;letter-spacing:0.005em\">${m.t}</h3><p style=\"margin:14px 0 0;font-size:15px;line-height:1.7;color:${BODY_DARK}\">${m.d}</p></div>\`}\n          />`).join('')}
      </ContentSection>

      <ContentSection name="Elim waitlist" background={INK_DEEP} paddingDesktop={{ top: '120', bottom: '120' }} id="waitlist">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:680px;margin:0 auto">
            ${eyebrow('Join the waitlist')}
            <h2 style="font-family:${DISPLAY};font-size:64px;line-height:1.02;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Get early access<br/>+ <span style="color:${GOLD}">launch pricing.</span>
            </h2>
            <p style="margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY_LIGHT};max-width:520px">
              Waitlist members get first access when enrollment opens, plus the launch discount and bonus implementation calls.
            </p>
          </div>`}
        />
        <Form
          width="8"
          heading=""
          text=""
          buttonBackgroundColor={GOLD}
          buttonTextColor={INK}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- SYSTEM PACK ----------

function SystemPackPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="SP hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Free download · 5 templates')}
            <h1 style="font-family:${DISPLAY};font-size:84px;line-height:0.98;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              The GMAD<br/><span style="color:${GOLD}">System Pack.</span>
            </h1>
            <p style="max-width:560px;margin:32px 0 0;font-size:18px;line-height:1.78;color:${BODY_LIGHT}">
              Get the 5-part GMAD System Pack — <strong style="color:#FFFFFF">free.</strong> These are the exact blueprints I used to scale my CPA firm past $5M/year and reclaim my time.
            </p>
            ${ctaButton({ primaryLabel: 'Send me the pack', primaryUrl: '#download', align: 'left' })}
          </div>`}
        />
        <Image src={imgSPMockup} alt="The GMAD System Pack" colWidth="5" imageBorderRadius="0" align="center" />
      </ContentSection>

      <ContentSection name="SP modules" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 60px;text-align:center">
            ${eyebrow('What\u2019s inside', false)}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              5 battle-tested<br/><span style="color:${GOLD_DEEP}">blueprints.</span>
            </h2>
          </div>`}
        />
        ${[
          { img: imgSP01, n: '01', t: 'The Intentional Operator\u2019s Weekly Blueprint', d: 'The exact weekly rhythm I use to stay out of the weeds and on the strategy.' },
          { img: imgSP02, n: '02', t: 'The Perfect SOP Template', d: 'The format that makes SOPs actually get used — by anyone on your team.' },
          { img: imgSP03, n: '03', t: 'The Client Onboarding System', d: 'The automated flow that turns new clients into long-term advocates from day one.' },
          { img: imgSP04, n: '04', t: 'The Elimination Audit', d: 'The diagnostic to identify and eliminate low-value work consuming your time and killing your profit.' },
          { img: imgSP05, n: '05', t: 'The Financial Fortress Scorecard', d: 'The one-page KPI dashboard that gives you x-ray vision into your business\u2019s financial health.' },
        ].map((m,i) => `\n          <Text width="${i < 3 ? '4' : '6'}" align="left"\n            text={\`<div style=\"font-family:${SANS};background:${PANEL};padding:0;border:1px solid ${HAIRLINE_LIGHT};height:100%;display:flex;flex-direction:column;overflow:hidden\"><img src=\"${m.img}\" alt=\"${m.t}\" style=\"width:100%;height:200px;object-fit:cover;display:block\"/><div style=\"padding:28px 30px;flex:1\"><div style=\"font-family:${DISPLAY};font-size:14px;color:${GOLD_DEEP};letter-spacing:0.3em;text-transform:uppercase;margin-bottom:12px\">/ ${m.n} /</div><h3 style=\"font-family:${DISPLAY};font-size:22px;line-height:1.2;font-weight:400;color:${INK};margin:0;text-transform:uppercase;letter-spacing:0.005em\">${m.t}</h3><p style=\"margin:14px 0 0;font-size:14px;line-height:1.7;color:${BODY_DARK}\">${m.d}</p></div></div>\`}\n          />`).join('')}
      </ContentSection>

      <ContentSection name="SP why" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Image src={imgFounderSPCta} alt="Johnny Terra" colWidth="5" imageBorderRadius="0" align="center" />
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-left:36px">
            ${eyebrow('I built this because I was you')}
            <h2 style="font-family:${DISPLAY};font-size:46px;line-height:1.06;font-weight:400;color:#FFFFFF;margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Your business can\u2019t<br/>outgrow its <span style="color:${GOLD}">systems.</span>
            </h2>
            <p style="margin:28px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:540px">
              I'm Johnny Terra. I'm a CPA, and I built my accounting firm from zero to a $5M/year operation with a full team that runs it for me. But it wasn't always that way.
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:540px">
              I remember the 80-hour weeks. I remember being the bottleneck on every single project. I remember the day my wife found me asleep on the floor of my son's room because I was too exhausted to make it to bed.
            </p>
            <p style="margin:18px 0 0;font-size:17px;line-height:1.78;color:${BODY_LIGHT};max-width:540px">
              <strong style="color:${GOLD}">That was the day I stopped hustling and started building systems.</strong> These 5 PDFs are the foundation of everything I learned.
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="SP optin" background={GOLD} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }} id="download">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:680px;margin:0 auto">
            <h2 style="font-family:${DISPLAY};font-size:60px;line-height:1.02;font-weight:400;color:${INK};margin:0;letter-spacing:0.005em;text-transform:uppercase">
              Install the 5<br/>foundational systems.
            </h2>
            <p style="margin:22px auto 0;font-size:17px;line-height:1.7;color:${INK};max-width:520px;font-weight:500">
              Start building a business that runs without you. Action Over Theory.
            </p>
          </div>`}
        />
        <Form
          width="8"
          heading=""
          text=""
          buttonBackgroundColor={INK}
          buttonTextColor={GOLD}
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

      <ContentSection name="Start hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:780px;margin:0 auto">
            ${eyebrow('Start here')}
            <h1 style="font-family:${DISPLAY};font-size:96px;line-height:0.94;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              The <span style="color:${GOLD}">roadmap.</span>
            </h1>
            <p style="max-width:560px;margin:30px auto 0;font-size:19px;line-height:1.7;color:${BODY_LIGHT}">
              Three steps to escape the Hustle Trap. Pick the entry point that matches where you are right now.
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Roadmap" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        ${[
          { n: '01', t: 'Subscribe to The Fuel Line', d: 'Start with one daily email. 90 seconds. Build the muscle of thinking like an Intentional Operator.', cta: 'Subscribe free', url: '/fuel-line' },
          { n: '02', t: 'Download the System Pack', d: '5 free templates. The exact blueprints I used to scale past $5M and buy back my time. Action Over Theory.', cta: 'Get the pack', url: '/system-pack' },
          { n: '03', t: 'Apply to Work With Us', d: 'Ready to install the full operating system? Start with The System Audit, then graduate into The Architect Program.', cta: 'Apply now', url: '/contact' },
        ].map(s => `\n          <Text width="4" align="left"\n            text={\`<div style=\"font-family:${SANS};background:${PANEL};padding:44px 36px;border:1px solid ${HAIRLINE_LIGHT};border-top:4px solid ${GOLD_DEEP};height:100%;display:flex;flex-direction:column\"><div style=\"font-family:${DISPLAY};font-size:64px;color:${GOLD_DEEP};line-height:1;font-weight:400\">${s.n}</div><h3 style=\"font-family:${DISPLAY};font-size:28px;line-height:1.15;font-weight:400;color:${INK};margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em\">${s.t}</h3><p style=\"margin:18px 0 28px;font-size:15px;line-height:1.7;color:${BODY_DARK};flex:1\">${s.d}</p><a href=\"${s.url}\" style=\"font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD_DEEP};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px\">${s.cta} ${arrowIcon(GOLD_DEEP)}</a></div>\`}\n          />`).join('')}
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- RESOURCES ----------

function ResourcesPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Resources hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:780px;margin:0 auto">
            ${eyebrow('The toolkit')}
            <h1 style="font-family:${DISPLAY};font-size:90px;line-height:0.96;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              The <span style="color:${GOLD}">stack.</span>
            </h1>
            <p style="max-width:560px;margin:30px auto 0;font-size:18px;line-height:1.7;color:${BODY_LIGHT}">
              Every tool that runs the GMAD operating system. No fluff list — only what we actually use, every day.
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Resources grid" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        ${[
          { cat: 'Operations', name: 'Manus AI', d: 'The AI agent we use to build systems, write content, and automate high-level strategic work.' },
          { cat: 'Platform', name: 'Kajabi', d: 'The all-in-one engine that runs the GMAD website, courses, emails, and podcast.' },
          { cat: 'Focus', name: 'Brain.fm', d: 'Functional music for deep work. When mission-critical work needs to ship — turn this on.' },
          { cat: 'Marketing', name: 'AgoraPulse', d: 'Social media command center. Schedule everything in advance, manage all inboxes from one place.' },
          { cat: 'Productivity', name: 'Workspace', d: 'The unified workspace where strategy, ops, and finance converge.' },
          { cat: 'Nutrition', name: 'Factor', d: 'High-quality prepared meals so I never trade strategy time for cooking time.' },
        ].map(r => `\n          <Text width="4" align="left"\n            text={\`<div style=\"font-family:${SANS};background:${PANEL};padding:32px 30px;border:1px solid ${HAIRLINE_LIGHT};height:100%\">${pillTag(r.cat)}<h3 style=\"font-family:${DISPLAY};font-size:30px;line-height:1.1;font-weight:400;color:${INK};margin:16px 0 0;text-transform:uppercase;letter-spacing:0.005em\">${r.name}</h3><p style=\"margin:14px 0 0;font-size:14px;line-height:1.7;color:${BODY_DARK}\">${r.d}</p></div>\`}\n          />`).join('')}
      </ContentSection>

      <ContentSection name="Resources note" background={INK_DEEP} paddingDesktop={{ top: '90', bottom: '90' }}>
        <Text align="center" width="10"
          text={`<div style="font-family:${SANS};text-align:center;max-width:680px;margin:0 auto;color:${BODY_LIGHT}">
            <p style="font-size:14px;line-height:1.7"><strong style="color:#FFFFFF">Affiliate disclosure:</strong> Some links may be affiliate links. We only recommend tools we actively use — every recommendation has been battle-tested in our own business first.</p>
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- LEAD MAGNETS ----------

function LeadMagnetsPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Lead hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:780px;margin:0 auto">
            ${eyebrow('Free downloads')}
            <h1 style="font-family:${DISPLAY};font-size:90px;line-height:0.96;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              Free <span style="color:${GOLD}">tools.</span>
            </h1>
            <p style="max-width:560px;margin:30px auto 0;font-size:18px;line-height:1.7;color:${BODY_LIGHT}">
              The same templates, scorecards, and frameworks I use inside The Architect Program — yours, free.
            </p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Lead grid" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${PANEL};padding:0;border:1px solid ${HAIRLINE_LIGHT};height:100%;display:flex;flex-direction:column;overflow:hidden">
            <img src="${imgSPMockup}" alt="The GMAD System Pack" style="width:100%;height:280px;object-fit:cover;display:block"/>
            <div style="padding:36px 36px 36px;flex:1;display:flex;flex-direction:column">
              ${pillTag('5 templates · free')}
              <h3 style="font-family:${DISPLAY};font-size:32px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">The GMAD System Pack</h3>
              <p style="margin:16px 0 28px;font-size:15px;line-height:1.7;color:${BODY_DARK};flex:1">5 battle-tested blueprints: Weekly Blueprint, SOP Template, Client Onboarding, Elimination Audit, Financial Fortress.</p>
              <a href="/system-pack" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD_DEEP};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px">Download free ${arrowIcon(GOLD_DEEP)}</a>
            </div>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${PANEL};padding:0;border:1px solid ${HAIRLINE_LIGHT};height:100%;display:flex;flex-direction:column;overflow:hidden">
            <img src="${imgEliminationHero}" alt="The Elimination Audit Waitlist" style="width:100%;height:280px;object-fit:cover;display:block"/>
            <div style="padding:36px 36px 36px;flex:1;display:flex;flex-direction:column">
              ${pillTag('Waitlist · launch pricing')}
              <h3 style="font-family:${DISPLAY};font-size:32px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">Elimination Audit Waitlist</h3>
              <p style="margin:16px 0 28px;font-size:15px;line-height:1.7;color:${BODY_DARK};flex:1">Reclaim 10+ hours a week. Be first in line for enrollment + the launch discount.</p>
              <a href="/elimination-audit" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD_DEEP};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px">Join waitlist ${arrowIcon(GOLD_DEEP)}</a>
            </div>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${PANEL};padding:0;border:1px solid ${HAIRLINE_LIGHT};height:100%;display:flex;flex-direction:column;overflow:hidden">
            <img src="${imgFuelLineHero}" alt="The Fuel Line Newsletter" style="width:100%;height:280px;object-fit:cover;display:block"/>
            <div style="padding:36px 36px 36px;flex:1;display:flex;flex-direction:column">
              ${pillTag('Daily email · free')}
              <h3 style="font-family:${DISPLAY};font-size:32px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">The Fuel Line Newsletter</h3>
              <p style="margin:16px 0 28px;font-size:15px;line-height:1.7;color:${BODY_DARK};flex:1">One daily leadership insight. Read in 90 seconds. Actionable immediately.</p>
              <a href="/fuel-line" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD_DEEP};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px">Subscribe ${arrowIcon(GOLD_DEEP)}</a>
            </div>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${PANEL};padding:0;border:1px solid ${HAIRLINE_LIGHT};height:100%;display:flex;flex-direction:column;overflow:hidden">
            <img src="${imgTrustEngine}" alt="The Trust Engine Podcast" style="width:100%;height:280px;object-fit:cover;display:block"/>
            <div style="padding:36px 36px 36px;flex:1;display:flex;flex-direction:column">
              ${pillTag('Podcast · weekly')}
              <h3 style="font-family:${DISPLAY};font-size:32px;line-height:1.1;font-weight:400;color:${INK};margin:18px 0 0;text-transform:uppercase;letter-spacing:0.005em">The Trust Engine Podcast</h3>
              <p style="margin:16px 0 28px;font-size:15px;line-height:1.7;color:${BODY_DARK};flex:1">Tactical workshop episodes. Move from doing the work to building the machine.</p>
              <a href="/podcast" style="font-family:${SANS};font-size:12px;font-weight:700;color:${GOLD_DEEP};text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;display:inline-flex;align-items:center;gap:10px">Listen now ${arrowIcon(GOLD_DEEP)}</a>
            </div>
          </div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- SPEAKING ----------

function SpeakingPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Speaking hero" background={INK} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text width="7" align="left"
          text={`<div style="font-family:${SANS};padding-right:24px">
            ${eyebrow('Keynotes · workshops · executive sessions')}
            <h1 style="font-family:${DISPLAY};font-size:84px;line-height:0.98;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              Hire Johnny<br/>to <span style="color:${GOLD}">speak.</span>
            </h1>
            <p style="max-width:540px;margin:32px 0 0;font-size:18px;line-height:1.78;color:${BODY_LIGHT}">
              Bring the "Systems Over Hustle" philosophy directly to your stage. A keynote designed to give your audience a new, actionable operating system for growth without the grind.
            </p>
            <p style="max-width:540px;margin:18px 0 0;font-size:16px;line-height:1.7;color:${BODY_LIGHT}">
              <strong style="color:${GOLD}">Starting at $5,000 + travel.</strong> Final quotes are tailored to your event — virtual keynotes, multi-session workshops, and executive deep-dives all available.
            </p>
            ${ctaButton({ primaryLabel: 'Inquire about speaking', primaryUrl: '#inquire', align: 'left' })}
          </div>`}
        />
        <Image src={imgFounder4} alt="Johnny Terra speaking" colWidth="5" imageBorderRadius="0" align="center" />
      </ContentSection>

      <ContentSection name="Speaking topics" background={PAPER} textColor={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:760px;margin:0 auto 60px;text-align:center">
            ${eyebrow('Signature talks', false)}
            <h2 style="font-family:${DISPLAY};font-size:54px;line-height:1.05;font-weight:400;color:${INK};margin:22px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Three signature <span style="color:${GOLD_DEEP}">keynotes.</span>
            </h2>
          </div>`}
        />
        ${[
          { t: 'Stop Being the Bottleneck', d: 'Why the hardest-working person in the company is the biggest constraint on growth — and the systems that fix it.' },
          { t: 'Scales Like a Machine. Sells Like a Human.', d: 'The duality every service business must achieve to scale past $1M without losing the soul that got it there.' },
          { t: 'The Trust Engine', d: 'How to build trust at scale without becoming a content-marketing slave to algorithms you don\u2019t control.' },
        ].map(t => `\n          <Text width="4" align="left"\n            text={\`<div style=\"font-family:${SANS};background:${PANEL};padding:40px 36px;border:1px solid ${HAIRLINE_LIGHT};border-top:4px solid ${GOLD_DEEP};height:100%\"><h3 style=\"font-family:${DISPLAY};font-size:26px;line-height:1.15;font-weight:400;color:${INK};margin:0;text-transform:uppercase;letter-spacing:0.005em\">${t.t}</h3><p style=\"margin:18px 0 0;font-size:15px;line-height:1.7;color:${BODY_DARK}\">${t.d}</p></div>\`}\n          />`).join('')}
      </ContentSection>

      <ContentSection name="Speaking fit" background={INK} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:44px 40px;border:1px solid ${HAIRLINE};border-left:4px solid ${GOLD};height:100%">
            <h3 style="font-family:${DISPLAY};font-size:28px;line-height:1.1;font-weight:400;color:${GOLD};margin:0;text-transform:uppercase;letter-spacing:0.01em">Right fit</h3>
            <p style="margin:18px 0 0;font-size:15px;line-height:1.7;color:#FFFFFF">Event organizers, corporate leaders, and conference planners who want a proven, battle-tested message on systems, productivity, and building a business that doesn't burn you out.</p>
            <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:#FFFFFF">Perfect for audiences of service-based entrepreneurs or high-performing teams.</p>
          </div>`}
        />
        <Text width="6" align="left"
          text={`<div style="font-family:${SANS};background:${MUTED_DARK};padding:44px 40px;border:1px solid ${HAIRLINE};border-left:4px solid #555;height:100%">
            <h3 style="font-family:${DISPLAY};font-size:28px;line-height:1.1;font-weight:400;color:#999;margin:0;text-transform:uppercase;letter-spacing:0.01em">Not a fit</h3>
            <p style="margin:18px 0 0;font-size:15px;line-height:1.7;color:${BODY_LIGHT}">Groups looking for motivational fluff or abstract theories.</p>
            <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:${BODY_LIGHT}">This is a tactical, systems-based presentation for operators who are ready to build and execute.</p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name="Speaking inquire" background={INK_DEEP} paddingDesktop={{ top: '110', bottom: '110' }} id="inquire">
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:680px;margin:0 auto">
            ${eyebrow('Book the engagement')}
            <h2 style="font-family:${DISPLAY};font-size:60px;line-height:1.02;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.005em;text-transform:uppercase">
              Inquire about <span style="color:${GOLD}">speaking.</span>
            </h2>
            <p style="margin:22px auto 0;font-size:17px;line-height:1.7;color:${BODY_LIGHT};max-width:520px">
              Tell us about your event. We respond within 3 business days with a custom proposal.
            </p>
          </div>`}
        />
        <Form
          width="8"
          heading=""
          text=""
          buttonBackgroundColor={GOLD}
          buttonTextColor={INK}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- LEGAL SHELL ----------

function LegalPage({ brand, images = {}, title, eyebrowLabel, html }: { brand: string; images?: Record<string, SiteImage>; title: string; eyebrowLabel: string; html: string }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name={`${title} hero`} background={INK} paddingDesktop={{ top: '90', bottom: '60' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:760px;margin:0 auto">
            ${eyebrow(eyebrowLabel)}
            <h1 style="font-family:${DISPLAY};font-size:72px;line-height:0.98;font-weight:400;color:#FFFFFF;margin:24px 0 0;letter-spacing:0.01em;text-transform:uppercase">${title}</h1>
            <p style="margin:18px auto 0;font-family:${SANS};font-size:13px;color:${BODY_LIGHT};letter-spacing:0.18em;text-transform:uppercase">Effective Date · Most recent revision</p>
          </div>`}
        />
      </ContentSection>

      <ContentSection name={`${title} body`} background={PAPER} textColor={INK} paddingDesktop={{ top: '80', bottom: '100' }}>
        <Text align="left" width="9"
          text={`<div style="font-family:${SANS};max-width:780px;margin:0 auto;font-size:16px;line-height:1.85;color:${BODY_DARK}">${html}</div>`}
        />
      </ContentSection>

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

const TERMS_HTML = `
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">1. Acceptance of Terms</h2>
  <p>This is a binding agreement. By using the website located at https://www.gomakeadollar.com (the "Site" or "Service") or any services offered through this Site, you agree to be bound by these Terms of Use. If you do not agree, do not use the Site.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">2. License to Use</h2>
  <p>We grant you a limited, non-exclusive, non-transferable license to access and use the Site for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works of any content without express written permission.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">3. Intellectual Property</h2>
  <p>All content on this Site — including text, graphics, logos, images, audio, video, and software — is the property of iQpreneur LLC or its licensors and is protected by U.S. and international copyright, trademark, and other intellectual property laws.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">4. Disclaimer of Warranties</h2>
  <p>The Site and all content are provided "as is" without warranty of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of harmful components.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">5. Limitation of Liability</h2>
  <p>In no event shall iQpreneur LLC, its affiliates, or its licensors be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">6. Governing Law</h2>
  <p>These Terms are governed by the laws of the State of Texas, without regard to its conflict of law provisions. Any disputes shall be resolved in the state or federal courts located in Texas.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">7. Changes to Terms</h2>
  <p>We reserve the right to modify these Terms at any time. Continued use of the Site after changes constitutes acceptance of the modified Terms.</p>
  <p style="margin-top:48px;padding-top:24px;border-top:1px solid ${HAIRLINE_LIGHT};font-size:14px;color:${BODY_DARK}"><strong>Contact:</strong> For questions about these Terms, contact us through the Contact page.</p>
`;

const PRIVACY_HTML = `
  <p>This Website collects some Personal Data from its Users. Users may be subject to different protection standards and broader standards may apply to some.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Information We Collect</h2>
  <p>We collect information you provide directly (name, email, billing details), information collected automatically (IP address, browser type, usage patterns), and information from third-party services you connect.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">How We Use Your Information</h2>
  <p>To deliver the products and services you request, communicate with you about your account, send marketing communications (which you can opt out of at any time), comply with legal obligations, and improve our services.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">How We Share Your Information</h2>
  <p>We do not sell your personal information. We share data only with service providers who help us operate the business (payment processors, email providers, analytics), and only as necessary for them to perform their function.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Your Rights</h2>
  <p>Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal information. To exercise these rights, contact us through the Contact page.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Cookies and Tracking</h2>
  <p>We use cookies and similar technologies to operate the Site, remember your preferences, analyze usage, and personalize content. You can control cookies through your browser settings.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Data Retention</h2>
  <p>We retain personal information for as long as needed to provide the services and comply with legal obligations. When no longer needed, data is securely deleted or anonymized.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Security</h2>
  <p>We implement reasonable technical and organizational measures to protect your personal information. However, no method of transmission or storage is 100% secure.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Changes to This Policy</h2>
  <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a revised effective date.</p>
`;

const DMCA_HTML = `
  <p>Title 17 USC §512(f) provides civil damage penalties, including costs and attorney fees, against any person who knowingly and materially misrepresents certain information in a notification of infringement under 17 USC §512(c).</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Filing a DMCA Notice</h2>
  <p>If you believe content on this Site infringes your copyright, you may submit a DMCA notice to our designated agent. Your notice must include:</p>
  <ul style="padding-left:24px;margin:18px 0">
    <li style="margin-bottom:10px">A physical or electronic signature of the copyright owner or authorized agent;</li>
    <li style="margin-bottom:10px">Identification of the copyrighted work claimed to be infringed;</li>
    <li style="margin-bottom:10px">Identification of the material claimed to be infringing and its location on the Site;</li>
    <li style="margin-bottom:10px">Your contact information (address, phone, email);</li>
    <li style="margin-bottom:10px">A statement of good faith belief that the use is not authorized;</li>
    <li style="margin-bottom:10px">A statement, under penalty of perjury, that the information is accurate and you are authorized to act.</li>
  </ul>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Counter-Notification</h2>
  <p>If you believe your content was removed in error, you may submit a counter-notification including the same elements above plus a statement consenting to jurisdiction.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Repeat Infringers</h2>
  <p>It is our policy to terminate the accounts of repeat infringers in appropriate circumstances.</p>
  <p style="margin-top:48px;padding-top:24px;border-top:1px solid ${HAIRLINE_LIGHT};font-size:14px;color:${BODY_DARK}">Submit DMCA notices through the Contact page.</p>
`;

const AFFILIATE_HTML = `
  <p>I've always believed in transparency on the web and so I am disclosing that I've included certain products and links to those products on this Site that I will earn an affiliate commission for any purchases you make.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Our Commitment</h2>
  <p>I only recommend products and services I have personally used and genuinely believe in. The affiliate relationship does not affect the price you pay — and in many cases, you receive an additional discount through our links.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">FTC Compliance</h2>
  <p>This disclosure is in accordance with the Federal Trade Commission's 16 CFR §255: Guides Concerning the Use of Endorsements and Testimonials in Advertising.</p>
  <h2 style="font-family:${DISPLAY};font-size:28px;color:${INK};text-transform:uppercase;letter-spacing:0.01em;margin:40px 0 16px">Your Trust Matters</h2>
  <p>If we ever recommend a product or service we no longer believe in, we remove the recommendation — regardless of the commission. Your trust is worth more than any single sale.</p>
`;

// ---------- BLOG / BLOG_POST / LIBRARY (dynamic) ----------

function BlogPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Blog header" background={INK} paddingDesktop={{ top: '110', bottom: '70' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:780px;margin:0 auto">
            ${eyebrow('The journal')}
            <h1 style="font-family:${DISPLAY};font-size:84px;line-height:0.98;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              The <span style="color:${GOLD}">field notes.</span>
            </h1>
            <p style="max-width:560px;margin:24px auto 0;font-size:17px;line-height:1.7;color:${BODY_LIGHT}">Long-form essays for operators ready to escape the Hustle Trap. No fluff, no clichés.</p>
          </div>`}
        />
      </ContentSection>

      <RawSection
        type="blog_listings"
        name="Blog Listings"
        settings={{
          background_color: PAPER,
          text_color: INK,
          button_background_color: GOLD,
          button_text_color: INK,
          button_border_radius: '0',
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
          background_color: PAPER,
          text_color: INK,
          link_color: GOLD_DEEP,
        }}
      />

      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function LibraryPage({ brand, images = {} }: { brand: string; images?: Record<string, SiteImage> }) {
  return (
    <>
      <SharedHeader brand={brand} images={images} />

      <ContentSection name="Library header" background={INK} paddingDesktop={{ top: '110', bottom: '70' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};text-align:center;max-width:760px;margin:0 auto">
            ${eyebrow('The library')}
            <h1 style="font-family:${DISPLAY};font-size:78px;line-height:0.98;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">Your <span style="color:${GOLD}">programs.</span></h1>
          </div>`}
        />
      </ContentSection>

      <RawSection
        type="products"
        name="Products"
        settings={{
          background_color: PAPER,
          text_color: INK,
          button_background_color: GOLD,
          button_text_color: INK,
          button_border_radius: '0',
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
      <ContentSection name="Thank you" background={INK} paddingDesktop={{ top: '140', bottom: '140' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:680px;margin:0 auto;text-align:center">
            ${eyebrow('You\u2019re in')}
            <h1 style="font-family:${DISPLAY};font-size:84px;line-height:0.98;font-weight:400;color:#FFFFFF;margin:28px 0 0;letter-spacing:0.01em;text-transform:uppercase">
              Welcome to the <span style="color:${GOLD}">machine.</span>
            </h1>
            <p style="margin:24px auto 0;max-width:520px;font-size:17px;line-height:1.75;color:${BODY_LIGHT}">
              Check your inbox — your download or confirmation is on its way. While you wait, here's what's next.
            </p>
            ${ctaButton({ primaryLabel: 'Listen to the podcast', primaryUrl: '/podcast', secondaryLabel: 'Read the field notes', secondaryUrl: '/blog' })}
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
      <ContentSection name="404" background={INK} paddingDesktop={{ top: '140', bottom: '140' }}>
        <Text align="center" width="12"
          text={`<div style="font-family:${SANS};max-width:620px;margin:0 auto;text-align:center">
            <div style="font-family:${DISPLAY};font-size:160px;color:${GOLD};line-height:1;font-weight:400;letter-spacing:0.01em">404</div>
            <h1 style="font-family:${DISPLAY};font-size:48px;line-height:1.05;font-weight:400;color:#FFFFFF;margin:18px 0 0;text-transform:uppercase;letter-spacing:0.01em">This page is off the blueprint.</h1>
            <p style="margin:20px auto 0;max-width:480px;font-size:17px;line-height:1.7;color:${BODY_LIGHT}">Let's get you back to something useful.</p>
            ${ctaButton({ primaryLabel: 'Back to home', primaryUrl: '/', secondaryLabel: 'Get the System Pack', secondaryUrl: '/system-pack' })}
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
  logo:                defaultImage('logo',                imgLogoStacked,        'Go Make a Dollar'),
  homeHero:            defaultImage('homeHero',            imgFounderHero,        'Johnny Terra, founder of GMAD'),
  homeBottleneck:      defaultImage('homeBottleneck',      imgHomeBottleneck,     'You are the bottleneck'),
  homeDuality:         defaultImage('homeDuality',         imgHomeFailure,        'The hustle is a failure of systems'),
  homeFounderQuote:    defaultImage('homeFounderQuote',    imgPantryEra,          'The pantry-era story'),
  aboutHero:           defaultImage('aboutHero',           imgFounderAbout,       'Johnny Terra, about'),
  aboutPantry:         defaultImage('aboutPantry',         imgAboutRealization,   'The realization'),
  contactHero:         defaultImage('contactHero',         imgContactVideo,       'Work with us'),
  contactPortrait:     defaultImage('contactPortrait',     imgContactHeadshot,    'Johnny Terra'),
  podcastCover:        defaultImage('podcastCover',        imgTrustEngine,        'The Trust Engine podcast'),
  fuelLineHero:        defaultImage('fuelLineHero',        imgFuelLineHero,       'The Fuel Line newsletter'),
  eliminationHero:     defaultImage('eliminationHero',     imgEliminationHero,    'The Elimination Audit'),
  eliminationPortrait: defaultImage('eliminationPortrait', imgEliminationPortrait,'Johnny Terra portrait'),
  systemPackHero:      defaultImage('systemPackHero',      imgFounderSPCta,       'The System Pack'),
  startHereHero:       defaultImage('startHereHero',       imgHomeEcosystem,      'The roadmap'),
  resourcesHero:       defaultImage('resourcesHero',       imgFounderTools,       'The stack'),
  speakingHero:        defaultImage('speakingHero',        imgFounder4,           'Johnny Terra speaking'),
};

function mergeImages(userImages: Record<string, SiteImage> = {}): Record<string, SiteImage> {
  return { ...DEFAULT_IMAGES, ...userImages };
}

// ---------- page registry ----------

type PageBuilder = (brand: string, images: Record<string, SiteImage>) => ReactNode;

const PAGE_BUILDERS: Record<string, PageBuilder> = {
  index:               (brand, images) => <HomePage brand={brand} images={images} />,
  about:               (brand, images) => <AboutPage brand={brand} images={images} />,
  contact:             (brand, images) => <ContactPage brand={brand} images={images} />,
  podcast:             (brand, images) => <PodcastPage brand={brand} images={images} />,
  'fuel-line':         (brand, images) => <FuelLinePage brand={brand} images={images} />,
  'elimination-audit': (brand, images) => <EliminationAuditPage brand={brand} images={images} />,
  'system-pack':       (brand, images) => <SystemPackPage brand={brand} images={images} />,
  'start-here':        (brand, images) => <StartHerePage brand={brand} images={images} />,
  resources:           (brand, images) => <ResourcesPage brand={brand} images={images} />,
  'lead-magnets':      (brand, images) => <LeadMagnetsPage brand={brand} images={images} />,
  speaking:            (brand, images) => <SpeakingPage brand={brand} images={images} />,
  terms:               (brand, images) => <LegalPage brand={brand} images={images} title="Terms of Use" eyebrowLabel="Legal · Terms" html={TERMS_HTML} />,
  privacy:             (brand, images) => <LegalPage brand={brand} images={images} title="Privacy Policy" eyebrowLabel="Legal · Privacy" html={PRIVACY_HTML} />,
  dmca:                (brand, images) => <LegalPage brand={brand} images={images} title="DMCA Policy" eyebrowLabel="Legal · DMCA" html={DMCA_HTML} />,
  affiliate:           (brand, images) => <LegalPage brand={brand} images={images} title="Affiliate Disclaimer" eyebrowLabel="Legal · Affiliate" html={AFFILIATE_HTML} />,
  blog:                (brand, images) => <BlogPage brand={brand} images={images} />,
  blog_post:           (brand, images) => <BlogPostPage brand={brand} images={images} />,
  library:             (brand, images) => <LibraryPage brand={brand} images={images} />,
  thank_you:           (brand, images) => <ThankYouPage brand={brand} images={images} />,
  '404':               (brand, images) => <NotFoundPage brand={brand} images={images} />,
};

const ALL_PAGES: PageKey[] = [
  'index', 'about', 'contact', 'podcast', 'fuel-line', 'elimination-audit', 'system-pack',
  'start-here', 'resources', 'lead-magnets', 'speaking',
  'terms', 'privacy', 'dmca', 'affiliate',
  'blog', 'blog_post', 'library', 'thank_you', '404',
];

// ---------- THEME SETTINGS ----------

const GMAD_THEME_SETTINGS: Record<string, string> = {
  background_color: INK,
  color_primary: GOLD,
  font_family_heading: 'Anton',
  font_weight_heading: '400',
  line_height_heading: '1.0',
  font_family_body: 'IBM Plex Sans',
  font_weight_body: '400',
  line_height_body: '1.7',
  color_heading: '#FFFFFF',
  color_body: BODY_LIGHT,
  color_body_secondary: 'rgba(255,255,255,0.6)',
  color_placeholder: 'rgba(255,255,255,0.4)',
  font_size_h1_desktop: '88px',
  font_size_h2_desktop: '54px',
  font_size_h3_desktop: '30px',
  font_size_h4_desktop: '22px',
  font_size_body_desktop: '17px',
  font_size_h1_mobile: '52px',
  font_size_h2_mobile: '38px',
  font_size_h3_mobile: '26px',
  font_size_h4_mobile: '20px',
  font_size_body_mobile: '16px',
  btn_style: 'solid',
  btn_size: 'large',
  btn_width: 'auto',
  btn_border_radius: '0',
  btn_text_color: INK,
  btn_background_color: GOLD,
};

const GMAD_CUSTOM_CSS = `
/* Go Make a Dollar — system page polish */
body { background: ${INK}; color: ${BODY_LIGHT}; }
a { color: ${GOLD}; }
a:hover { color: ${GOLD_DEEP}; }

input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
textarea,
select {
  border: 1px solid rgba(255,255,255,0.18) !important;
  border-radius: 0 !important;
  background: ${MUTED_DARK} !important;
  color: #FFFFFF !important;
  font-family: 'IBM Plex Sans', sans-serif !important;
  padding: 16px 18px !important;
}
input:focus, textarea:focus, select:focus {
  border-color: ${GOLD} !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(229,184,58,0.20) !important;
}

button, .button, input[type="submit"], .btn-primary {
  border-radius: 0 !important;
  font-family: 'IBM Plex Sans', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.16em !important;
  text-transform: uppercase !important;
  font-size: 13px !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Anton', 'Bebas Neue', sans-serif !important;
  font-weight: 400 !important;
  letter-spacing: 0.005em !important;
  text-transform: uppercase !important;
}
/* Headings inherit color from their section/container — no global white override.
   System pages (login, store, library) sit on dark body bg so they get white via body color. */

.product-card, .library-card, .course-card {
  border-radius: 0 !important;
  background: ${MUTED_DARK} !important;
  border: 1px solid rgba(255,255,255,0.10) !important;
  border-top: 3px solid ${GOLD} !important;
}
.product-card *, .library-card *, .course-card * { color: #FFFFFF !important; }
.product-card a, .library-card a, .course-card a { color: ${GOLD} !important; }
`;

export const goMakeADollarTemplate: TemplateDef = {
  id: 'go-make-a-dollar',
  label: 'Go Make a Dollar',
  description: "Johnny Terra's founder-led business operating system brand — black + gold + white, Anton display + IBM Plex Sans body, real recovered photography from the live source site.",
  pageKeys: ALL_PAGES,
  imageSlots: IMAGE_SLOTS,
  themeSettings: GMAD_THEME_SETTINGS,
  customCss: GMAD_CUSTOM_CSS,
  fonts: { heading: 'Anton', body: 'IBM Plex Sans' },
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
