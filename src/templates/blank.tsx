/**
 * Blank template — minimal starter that ships all 8 Kajabi pages.
 *
 * Each page is the same minimal shell (header + hero + footer) so the user
 * has every template stub ready to customize. Parameterized by `site.brandName`.
 */
import type { ReactNode } from 'react';
import {
  HeaderSection,
  ContentSection,
  FooterSection,
  Logo,
  Menu,
  Text,
  Copyright,
} from '@/blocks';
import type { Site, PageKey } from '@/lib/siteStore';
import type { TemplateDef } from '@/lib/templates';
import heroMountains from '@/assets/hero-mountains.jpg';

const SANS = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const DISPLAY = `'Fraunces', Georgia, 'Times New Roman', serif`;

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

function Header({ brand, transparent = false }: { brand: string; transparent?: boolean }) {
  const ink = transparent ? '#FFFFFF' : '#111111';
  return (
    <HeaderSection
      background={transparent ? 'transparent' : '#FFFFFF'}
      textColor={ink}
      paddingDesktop={{ top: '24', bottom: '24' }}
      horizontalAlignment="between"
    >
      <Logo type="text" text={brand} textColor={ink} />
      <Menu handle="main-menu" alignment="right" previewItems={NAV_ITEMS} />
    </HeaderSection>
  );
}

function Footer({ brand }: { brand: string }) {
  return (
    <FooterSection
      background="#0E1524"
      textColor="rgba(255,255,255,0.7)"
      paddingDesktop={{ top: '48', bottom: '48' }}
      verticalLayout
    >
      <Logo type="text" text={brand} textColor="#FFFFFF" />
      <Copyright text={`${brand}. All rights reserved.`} />
    </FooterSection>
  );
}

/** Index hero — full-bleed mountain scene with overlay copy. */
function IndexHero({ brand }: { brand: string }) {
  return (
    <ContentSection
      name="Hero"
      background="#0E1524"
      backgroundImage={heroMountains}
      bgPosition="center"
      paddingDesktop={{ top: '180', bottom: '200' }}
      paddingMobile={{ top: '120', bottom: '140' }}
      fullWidth
    >
      <Text
        align="center"
        width="10"
        text={`
          <div style="font-family:${SANS};position:relative;z-index:2">
            <div style="display:inline-block;padding:6px 14px;border:1px solid rgba(255,255,255,0.35);border-radius:999px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.85);margin-bottom:28px">
              Welcome to ${brand}
            </div>
            <h1 style="font-family:${DISPLAY};font-size:84px;line-height:1.02;font-weight:500;color:#FFFFFF;margin:0;letter-spacing:-0.02em;text-shadow:0 2px 30px rgba(0,0,0,0.35)">
              Where the trail<br/><em style="font-style:italic;font-weight:400;color:#FFD9A8">begins.</em>
            </h1>
            <p style="max-width:560px;margin:28px auto 0;font-size:18px;line-height:1.6;color:rgba(255,255,255,0.88);text-shadow:0 1px 12px rgba(0,0,0,0.4)">
              A quiet space for the work that matters. Build, share, and grow with intention &mdash; surrounded by the things that move you.
            </p>
            <div style="margin-top:40px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
              <a href="#" style="display:inline-flex;align-items:center;padding:15px 28px;background:#FFFFFF;color:#111;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;letter-spacing:0.02em">
                Get Started
              </a>
              <a href="#" style="display:inline-flex;align-items:center;padding:15px 28px;background:rgba(255,255,255,0.08);color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;letter-spacing:0.02em;border:1px solid rgba(255,255,255,0.4)">
                Learn More
              </a>
            </div>
          </div>
        `}
      />
    </ContentSection>
  );
}

function Stub({
  brand,
  heading,
  subhead,
  ctaLabel = 'Get Started',
}: {
  brand: string;
  heading: string;
  subhead: string;
  ctaLabel?: string;
}) {
  return (
    <>
      <Header brand={brand} />
      <ContentSection background="#FAFAFA" paddingDesktop={{ top: '120', bottom: '120' }}>
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS}">
              <h1 style="font-family:${DISPLAY};font-size:60px;line-height:1.1;font-weight:500;color:#111;margin:0;letter-spacing:-0.02em">
                ${heading}
              </h1>
              <p style="max-width:520px;margin:20px auto 0;font-size:17px;line-height:1.6;color:#555">
                ${subhead}
              </p>
              <a href="#" style="display:inline-flex;margin-top:28px;padding:13px 22px;background:#111;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px">
                ${ctaLabel}
              </a>
            </div>
          `}
        />
      </ContentSection>
      <Footer brand={brand} />
    </>
  );
}

const PAGE_BUILDERS: Record<PageKey, (brand: string) => ReactNode> = {
  index: (brand) => (
    <>
      <Header brand={brand} transparent />
      <IndexHero brand={brand} />
      <ContentSection background="#FAFAFA" paddingDesktop={{ top: '100', bottom: '120' }}>
        <Text
          align="center"
          width="10"
          text={`
            <div style="font-family:${SANS}">
              <p style="font-size:13px;letter-spacing:0.22em;text-transform:uppercase;color:#7a7f8a;margin:0 0 18px">
                What we do
              </p>
              <h2 style="font-family:${DISPLAY};font-size:44px;line-height:1.15;font-weight:500;color:#111;margin:0;letter-spacing:-0.01em">
                Built to feel like the view from the summit.
              </h2>
              <p style="max-width:600px;margin:22px auto 0;font-size:17px;line-height:1.7;color:#555">
                Replace this section with the story of ${brand}. Tell visitors why you started, who you serve, and what they can expect when they work with you.
              </p>
            </div>
          `}
        />
      </ContentSection>
      <Footer brand={brand} />
    </>
  ),
  about: (brand) => (
    <Stub brand={brand} heading="About Us" subhead={`Tell visitors what ${brand} is about. Replace this with your real story.`} ctaLabel="Learn More" />
  ),
  page: (brand) => (
    <Stub brand={brand} heading="A Custom Page" subhead="Use this template for any standalone marketing page in Kajabi." ctaLabel="Continue" />
  ),
  contact: (brand) => (
    <Stub brand={brand} heading="Get in Touch" subhead="Drop us a line — we'll get back to you within one business day." ctaLabel="Send Message" />
  ),
  blog: (brand) => (
    <Stub brand={brand} heading="The Blog" subhead="Notes, updates, and field reports. Kajabi will inject your real post list between the header and footer." ctaLabel="Subscribe" />
  ),
  blog_post: (brand) => (
    <Stub brand={brand} heading="A Sample Post" subhead="Kajabi renders the actual post content here. Use this template for the post-page chrome." ctaLabel="Read More" />
  ),
  thank_you: (brand) => (
    <Stub brand={brand} heading="Thank You" subhead="We've received your submission. We'll be in touch shortly." ctaLabel="Back to Home" />
  ),
  '404': (brand) => (
    <Stub brand={brand} heading="404 — Page Not Found" subhead="The page you're looking for doesn't exist or has moved." ctaLabel="Back to Home" />
  ),
};

const ALL_PAGES: PageKey[] = ['index', 'about', 'page', 'contact', 'blog', 'blog_post', 'thank_you', '404'];

export const blankTemplate: TemplateDef = {
  id: 'blank',
  label: 'Blank',
  description: 'Minimal starter — all 8 pages, ready to customize.',
  pageKeys: ALL_PAGES,
  fonts: { body: 'Inter' },
  buildPages: (site: Site) => {
    const out: Record<string, ReactNode> = {};
    for (const key of ALL_PAGES) {
      if (site.pages[key]?.enabled === false) continue;
      out[key] = PAGE_BUILDERS[key](site.brandName);
    }
    return out;
  },
  renderPage: (site: Site, page: PageKey) => PAGE_BUILDERS[page](site.brandName),
  imageSlots: [],
};
