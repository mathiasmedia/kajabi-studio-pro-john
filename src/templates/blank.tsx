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

function Header({ brand }: { brand: string }) {
  return (
    <HeaderSection
      background="#FFFFFF"
      textColor="#111111"
      paddingDesktop={{ top: '20', bottom: '20' }}
      horizontalAlignment="between"
    >
      <Logo type="text" text={brand} textColor="#111111" />
      <Menu handle="main-menu" alignment="right" previewItems={NAV_ITEMS} />
    </HeaderSection>
  );
}

function Footer({ brand }: { brand: string }) {
  return (
    <FooterSection
      background="#111111"
      textColor="rgba(255,255,255,0.7)"
      paddingDesktop={{ top: '40', bottom: '40' }}
      verticalLayout
    >
      <Logo type="text" text={brand} textColor="#FFFFFF" />
      <Copyright text={`${brand}. All rights reserved.`} />
    </FooterSection>
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
              <h1 style="font-size:60px;line-height:1.1;font-weight:700;color:#111;margin:0">
                ${heading}
              </h1>
              <p style="max-width:520px;margin:20px auto 0;font-size:17px;line-height:1.6;color:#555">
                ${subhead}
              </p>
              <a href="#" style="display:inline-flex;margin-top:28px;padding:13px 22px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px">
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
    <Stub brand={brand} heading={`Welcome to ${brand}`} subhead="A blank starter site. Edit this template or pick another from the dashboard." />
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
