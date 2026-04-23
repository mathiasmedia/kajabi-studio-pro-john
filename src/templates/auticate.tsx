/**
 * Auticate template — faithful Kajabi remake of auticate.com.
 *
 * Brand: warm, approachable autism education by Chris & Debby.
 * Palette: blue #0072EF / #3E6EF7, cream #FCF5E4, ink #161e2a, peach #ff9966,
 * soft blue tints #C2D2FF / #D6EFFF.
 * Fonts: Sora (display) + Open Sans (body) — both pulled from the live site.
 *
 * All imagery recovered from the live source via authenticated CDN download
 * and rehosted in site-images/templates/auticate. See /mnt/documents/auticate-inventory.md.
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

const CDN = 'https://iqxcgazfrydubrvxmnlv.supabase.co/storage/v1/object/public/site-images/templates/auticate';

// ---------- recovered assets ----------
const imgLogo            = `${CDN}/logo.png`;
const imgHomeHero        = `${CDN}/home-hero.jpg`;
const imgAboutHero       = `${CDN}/about-hero.png`;
const imgChrisDebby      = `${CDN}/chris-debby.png`;
const imgChris           = `${CDN}/chris.png`;
const imgDebby           = `${CDN}/debby.png`;
const imgChrisStory      = `${CDN}/chris-story.png`;
const imgDebbyStory      = `${CDN}/debby-story.png`;
const imgWhyElephant     = `${CDN}/why-elephant.png`;
const imgNewsletterBg    = `${CDN}/newsletter-bg.png`;
const imgCommunityHero   = `${CDN}/community-hero.png`;
const imgSupportingHero  = `${CDN}/supporting-hero.jpg`;
const imgRoadmapMockup   = `${CDN}/roadmap-mockup.png`;
const imgBurnoutHero     = `${CDN}/burnout-hero.jpg`;
const imgEnergyHero      = `${CDN}/energy-hero.png`;
const imgBeigeBg         = `${CDN}/beige-bg.jpg`;
const imgMembershipSocial = `${CDN}/membership-social.png`;
const imgMembershipWebinars = `${CDN}/membership-webinars.png`;
const imgAutisticThumb   = `${CDN}/autistic-thumb.png`;
const imgSupportThumb    = `${CDN}/support-thumb.png`;

// ---------- design tokens ----------
const DISPLAY = `'Sora', system-ui, -apple-system, sans-serif`;
const BODY_F = `'Open Sans', 'Segoe UI', sans-serif`;

const BLUE = '#0072EF';
const BLUE_DEEP = '#3E6EF7';
const BLUE_DARK = '#2E91FC';
const INK = '#161e2a';
const BODY_INK = '#3a3f4a';
const CREAM = '#FCF5E4';
const CREAM_DEEP = '#fcf5e3';
const PEACH = '#ff9966';
const SOFT_BLUE = '#C2D2FF';
const PALE_BLUE = '#D6EFFF';
const WHITE = '#FFFFFF';
const MUTED = '#7b7b7b';

// ---------- image slots ----------
const IMAGE_SLOTS: ImageSlotDef[] = [
  { key: 'logo',           label: 'Logo',            description: 'Header + footer logo (Auticate elephant lockup).', defaultPrompt: 'Auticate wordmark with friendly elephant icon, blue and cream', aspect: '4:1' },
  { key: 'homeHero',       label: 'Home hero',       description: 'Right-side image in homepage hero.', defaultPrompt: 'Warm friendly photo of a neurodiverse person smiling, soft natural light', aspect: '4:5' },
  { key: 'autisticThumb',  label: 'Autistic path',   description: '"I am an autistic person" pathway card.', defaultPrompt: 'Soft warm portrait, autistic adult, calm focused expression', aspect: '1:1' },
  { key: 'supportThumb',   label: 'Supporter path',  description: '"I know an autistic person" pathway card.', defaultPrompt: 'Two people in warm conversation, supportive moment', aspect: '1:1' },
  { key: 'chrisDebby',     label: 'Chris & Debby',   description: 'Co-founder portrait pair on home + footer.', defaultPrompt: 'Warm portrait of a couple, educators, cream backdrop', aspect: '4:3' },
  { key: 'aboutHero',      label: 'About hero',      description: 'Hero image on About page.', defaultPrompt: 'Warm cream-toned portrait of Chris and Debby, inverse cream background', aspect: '3:2' },
  { key: 'chris',          label: 'Chris',           description: 'Chris portrait on About page.', defaultPrompt: 'Warm portrait of Chris with cream background', aspect: '4:5' },
  { key: 'debby',          label: 'Debby',           description: 'Debby portrait on About page.', defaultPrompt: 'Warm portrait of Debby with cream background', aspect: '4:5' },
  { key: 'whyElephant',    label: 'Why the elephant',description: 'Elephant illustration on About page.', defaultPrompt: 'Soft hand-drawn elephant illustration in blue and cream', aspect: '1:1' },
  { key: 'communityHero',  label: 'Community hero',  description: 'Hero image on Membership page.', defaultPrompt: 'Diverse online community hero illustration, friendly and warm', aspect: '4:3' },
  { key: 'supportingHero', label: 'Supporter hero',  description: 'Hero on Supporting an Autistic Person page.', defaultPrompt: 'Warm photo of two people supporting each other, cream tones', aspect: '4:3' },
  { key: 'roadmapMockup',  label: 'Roadmap mockup',  description: 'Free guide cover mockup on Roadmap page.', defaultPrompt: 'Tablet and phone mockup of a 5-step PDF guide cover', aspect: '4:3' },
  { key: 'burnoutHero',    label: 'Burnout hero',    description: 'Hero on Beyond Burnout course page.', defaultPrompt: 'Warm calming image suggesting rest and recovery from burnout', aspect: '3:2' },
  { key: 'energyHero',     label: 'Energy hero',     description: 'Hero on Autistic Energy System course page.', defaultPrompt: 'Soft illustration of an energy / battery metaphor for autism', aspect: '4:3' },
  { key: 'membershipSocial', label: 'Members talking', description: 'Membership feature illustration — community.', defaultPrompt: 'Illustration of a friendly online forum chat', aspect: '1:1' },
  { key: 'membershipWebinars', label: 'Members learning', description: 'Membership feature illustration — webinars.', defaultPrompt: 'Illustration of an online webinar with diverse attendees', aspect: '1:1' },
];

const DEFAULT_IMAGES: Record<string, string> = {
  logo: imgLogo,
  homeHero: imgHomeHero,
  autisticThumb: imgAutisticThumb,
  supportThumb: imgSupportThumb,
  chrisDebby: imgChrisDebby,
  aboutHero: imgAboutHero,
  chris: imgChris,
  debby: imgDebby,
  whyElephant: imgWhyElephant,
  communityHero: imgCommunityHero,
  supportingHero: imgSupportingHero,
  roadmapMockup: imgRoadmapMockup,
  burnoutHero: imgBurnoutHero,
  energyHero: imgEnergyHero,
  membershipSocial: imgMembershipSocial,
  membershipWebinars: imgMembershipWebinars,
};

function mergeImages(images: Record<string, SiteImage>): Record<string, string> {
  const out: Record<string, string> = { ...DEFAULT_IMAGES };
  for (const [k, v] of Object.entries(images)) {
    if (v?.url) out[k] = v.url;
  }
  return out;
}

// ---------- inline HTML helpers ----------

/**
 * Auticate-style buttons — match the reference site's soft gradient pills.
 *  - primary  → blue → soft-blue gradient, dark-ink text (the "Let's Go" /
 *               "Become a Member" buttons on the live site)
 *  - peach    → peach → cream gradient, dark-ink text
 *  - outline  → cream pill with subtle blue border, dark-ink text
 * No drop shadow — the live site uses flat soft fills.
 */
function pillButton(label: string, url: string, opts: { variant?: 'primary' | 'outline' | 'peach'; newTab?: boolean } = {}) {
  const variant = opts.variant ?? 'primary';
  const styles = variant === 'primary'
    ? `background:linear-gradient(120deg, ${SOFT_BLUE} 0%, ${PALE_BLUE} 55%, ${PEACH}33 100%);color:${INK};border:1px solid ${SOFT_BLUE}`
    : variant === 'peach'
    ? `background:linear-gradient(120deg, ${PEACH}66 0%, ${CREAM} 55%, ${SOFT_BLUE}88 100%);color:${INK};border:1px solid ${PEACH}99`
    : `background:${CREAM};color:${INK};border:1px solid ${SOFT_BLUE}`;
  const target = opts.newTab ? `target="_blank" rel="noopener noreferrer"` : '';
  return `<a href="${url}" ${target} style="display:inline-flex;align-items:center;gap:10px;padding:14px 28px;border-radius:14px;text-decoration:none;font-family:${DISPLAY};font-weight:600;font-size:15px;letter-spacing:0.01em;${styles};transition:transform 0.2s ease">
    ${label}
  </a>`;
}

function eyebrow(label: string, color = BLUE) {
  return `<span style="display:inline-block;font-family:${DISPLAY};font-size:13px;font-weight:700;color:${color};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:14px">${label}</span>`;
}

/**
 * Inline light-weight accent for headings — wraps text in a span with
 * font-weight:300 and explicit font-style:normal. Used inline so it works in
 * BOTH the in-app preview AND the exported Kajabi theme (customCss only
 * applies at export, so an external `h1 em {...}` rule would italicize in
 * preview where the rule isn't present).
 */
function light(text: string) {
  return `<span style="display:inline-block;font-weight:400;font-style:normal;font-size:0.7em;letter-spacing:-0.01em;line-height:1.1">${text}</span>`;
}

function heroH1(text: string, color = INK) {
  return `<h1 style="font-family:${DISPLAY};font-weight:700;font-size:60px;line-height:1.05;color:${color};margin:0 0 22px;letter-spacing:-0.02em">${text}</h1>`;
}

function bodyP(text: string, color = BODY_INK, max = '560px') {
  return `<p style="font-family:${BODY_F};font-size:17px;line-height:1.65;color:${color};margin:0 0 20px;max-width:${max}">${text}</p>`;
}

// ---------- shared chrome ----------

const NAV_ITEMS = [
  { label: 'Navigating Autism', url: '/navigating-autism' },
  { label: 'Supporting Someone', url: '/supporting-an-autistic-person' },
  { label: 'Membership', url: '/membership' },
  { label: 'About', url: '/about' },
  { label: 'Contact', url: '/contact' },
];

function SharedHeader({ images }: { images: Record<string, string> }) {
  return (
    <HeaderSection
      background={CREAM}
      textColor={INK}
      sticky
      stickyBackgroundColor={CREAM}
      paddingDesktop={{ top: '18', bottom: '18', left: '40', right: '40' }}
      horizontalAlignment="between"
    >
      <Logo type="image" imageUrl={images.logo} imageAlt="Auticate" width="170" />
      <Menu handle="main-menu" alignment="right" previewItems={NAV_ITEMS} />
      <Text width="3" align="right" text={pillButton('Become a Member', '/membership', { variant: 'primary' })} />
    </HeaderSection>
  );
}

function NewsletterCta() {
  return (
    <ContentSection
      name="Newsletter"
      background={SOFT_BLUE}
      backgroundImage={imgNewsletterBg}
      bgPosition="center"
      paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }}
      horizontal="center"
    >
      <Text
        width="10"
        align="center"
        text={`
          ${eyebrow('Stay in the loop', INK)}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 14px;letter-spacing:-0.01em">Be informed about latest videos and content.</h2>
          <p style="font-family:${BODY_F};font-size:16px;color:${BODY_INK};margin:0 0 28px">Your information is confidential and we never sell your information.</p>
        `}
      />
      <Form
        width="8"
        heading=""
        text=""
        buttonBackgroundColor={BLUE}
        buttonTextColor="#FFFFFF"
      />
    </ContentSection>
  );
}

function SharedFooter({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <FooterSection
      background={INK}
      textColor="rgba(255,255,255,0.78)"
      paddingDesktop={{ top: '70', bottom: '40', left: '40', right: '40' }}
    >
      <Logo type="image" imageUrl={images.logo} imageAlt={brand} width="170" />
      <LinkList
        heading="Explore"
        handle="footer-explore"
        previewItems={[
          { label: 'Home', url: '/' },
          { label: 'Navigating Autism', url: '/navigating-autism' },
          { label: 'Supporting Someone', url: '/supporting-an-autistic-person' },
          { label: 'Membership', url: '/membership' },
          { label: 'About', url: '/about' },
          { label: 'Contact', url: '/contact' },
        ]}
      />
      <LinkList
        heading="Free Resources"
        handle="footer-resources"
        previewItems={[
          { label: 'The Autistic Roadmap', url: '/autistic-roadmap' },
          { label: 'Beyond Burnout Course', url: '/beyond-burnout-course' },
          { label: 'Autistic Energy System', url: '/autistic-energy-system' },
        ]}
      />
      <LinkList
        heading="Legal"
        handle="footer-legal"
        previewItems={[
          { label: 'Terms of Use', url: '/terms-of-use' },
          { label: 'Privacy Policy', url: '/privacy-policy' },
        ]}
      />
      <SocialIcons
        youtube="https://youtube.com/@auticate"
        instagram="https://instagram.com/auticate"
        facebook="https://facebook.com/auticate"
        iconColor="#FFFFFF"
      />
      <Copyright text={`${brand}. All rights reserved.`} />
    </FooterSection>
  );
}

// ---------- shared sections ----------

const TESTIMONIALS = [
  {
    title: 'My #1 Resource for All Things Neurodivergent',
    body: "I've been a fan of Chris and Debby's work for a long time. Their videos are hilarious, informative, important and above all authentic. I recommend their resources to all my clients.",
    name: 'Steph Jones',
  },
  {
    title: 'The One-And-Only',
    body: 'During my ADHD diagnosis, my psychiatrist mentioned me also being on the spectrum. After that the research began and Chris is the only one I can almost 100% identify with. So much sense, so much pressure off.',
    name: 'Esther Reinholt',
  },
  {
    title: 'Everything Makes Sense Now',
    body: 'After two decades of occasionally suspecting I might be autistic, Chris and Debby helped me understand and start loving myself. Forever grateful.',
    name: 'Lee Ch.',
  },
  {
    title: 'Video Magic',
    body: 'I introduced this series to my fiance and it has altered our lives for the better. Honest and helpful.',
    name: 'Joshua B. Zedaker',
  },
];

function TestimonialsSection() {
  return (
    <ContentSection
      name="Testimonials"
      background={CREAM}
      paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }}
      horizontal="center"
    >
      <Text
        width="12"
        align="center"
        text={`
          ${eyebrow('Community voices')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 50px;letter-spacing:-0.01em">Hear it from people like you</h2>
        `}
      />
      {TESTIMONIALS.map((t, i) => (
        <Feature
          key={i}
          width="6"
          text={`
            <div style="background:${WHITE};border-radius:24px;padding:32px;box-shadow:0 8px 30px rgba(22,30,42,0.06);height:100%">
              <div style="font-family:${DISPLAY};font-weight:700;font-size:20px;color:${BLUE};margin-bottom:14px">${t.title}</div>
              <p style="font-family:${BODY_F};font-size:15.5px;line-height:1.65;color:${BODY_INK};margin:0 0 22px">${t.body}</p>
              <div style="font-family:${DISPLAY};font-weight:600;font-size:14px;color:${INK};letter-spacing:0.04em">— ${t.name}</div>
            </div>
          `}
        />
      ))}
    </ContentSection>
  );
}

function FinalCtaSection() {
  return (
    <ContentSection
      name="Final CTA"
      background={BLUE}
      textColor={WHITE}
      paddingDesktop={{ top: '110', bottom: '110', left: '40', right: '40' }}
      horizontal="center"
    >
      <Text
        width="10"
        align="center"
        text={`
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:54px;line-height:1.1;color:${WHITE};margin:0 0 22px;letter-spacing:-0.02em">${light('Are you ready')}<br/>to get Auticated?</h2>
          <p style="font-family:${BODY_F};font-size:18px;line-height:1.6;color:rgba(255,255,255,0.92);margin:0 auto 36px;max-width:580px">Unlock a world where your autistic identity is understood and celebrated.</p>
          ${pillButton("Let's Go →", '/membership', { variant: 'peach' })}
        `}
      />
    </ContentSection>
  );
}

// ---------- pages ----------

function HomePage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />

      {/* Hero */}
      <ContentSection
        name="Hero"
        background={CREAM}
        paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }}
        vertical="center"
      >
        <Text
          width="6"
          align="left"
          text={`
            ${eyebrow('Welcome to Auticate')}
            ${heroH1(`${light('Understand autism')}<br/>and change your world.`)}
            ${bodyP("Auticate is the first online education platform tailored for autistic people, offering courses and community to enrich your life. We blend expert insights with real-world experience, shifting discussions on autism from academic to approachable, led by those who live with it every day. Whether you're diagnosed, self-identified, or still exploring — you're welcome here.")}
            <div style="margin-top:8px">${pillButton("Let's Go", '/membership', { variant: 'primary' })}</div>
          `}
        />
        <Image colWidth="6" src={images.chrisDebby} alt="Chris and Debby — Auticate co-founders" imageBorderRadius="32" />
      </ContentSection>

      {/* Mission statement */}
      <ContentSection
        name="Mission"
        background={WHITE}
        paddingDesktop={{ top: '110', bottom: '110', left: '40', right: '40' }}
        horizontal="center"
      >
        <Text
          width="10"
          align="center"
          text={`
            ${eyebrow('Although autism can be hard')}
            <h2 style="font-family:${DISPLAY};font-weight:700;font-size:48px;line-height:1.15;color:${INK};margin:0 0 24px;letter-spacing:-0.02em">…it can also get better.</h2>
            <p style="font-family:${BODY_F};font-size:18px;line-height:1.7;color:${BODY_INK};max-width:780px;margin:0 auto">Noise, people, decisions, pressure — it can be a lot to navigate the world with autism. Without the right knowledge or steady support, the autistic life can feel frustrating and isolating. Auticate exists to make that journey easier — through content rooted in lived-experience and a community that gets it.</p>
          `}
        />
      </ContentSection>

      {/* Two pathways */}
      <ContentSection
        name="Pathways"
        background={CREAM}
        paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }}
        horizontal="center"
      >
        <Text
          width="12"
          align="center"
          text={`
            ${eyebrow('Here\u2019s how we help')}
            <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 50px;letter-spacing:-0.01em">Education tailored for autistic people.</h2>
          `}
        />
        <Feature
          width="6"
          text={`
            <div style="background:${WHITE};border-radius:32px;overflow:hidden;box-shadow:0 14px 40px rgba(22,30,42,0.08);text-align:left">
              <img src="${images.autisticThumb}" alt="I am an autistic person" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block"/>
              <div style="padding:32px">
                <h3 style="font-family:${DISPLAY};font-weight:700;font-size:26px;color:${INK};margin:0 0 14px">I am an autistic person.</h3>
                <p style="font-family:${BODY_F};font-size:16px;line-height:1.65;color:${BODY_INK};margin:0 0 24px">Explore and embrace your autism through education and understanding, gaining clarity and control over your life.</p>
                ${pillButton('Show Me How', '/navigating-autism', { variant: 'primary' })}
              </div>
            </div>
          `}
        />
        <Feature
          width="6"
          text={`
            <div style="background:${WHITE};border-radius:32px;overflow:hidden;box-shadow:0 14px 40px rgba(22,30,42,0.08);text-align:left">
              <img src="${images.supportThumb}" alt="I know an autistic person" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block"/>
              <div style="padding:32px">
                <h3 style="font-family:${DISPLAY};font-weight:700;font-size:26px;color:${INK};margin:0 0 14px">I know an autistic person.</h3>
                <p style="font-family:${BODY_F};font-size:16px;line-height:1.65;color:${BODY_INK};margin:0 0 24px">Gain the insights and tools needed to understand and genuinely connect with the autistic person in your life.</p>
                ${pillButton('Show Me How', '/supporting-an-autistic-person', { variant: 'peach' })}
              </div>
            </div>
          `}
        />
      </ContentSection>

      {/* Founders intro */}
      <ContentSection
        name="Founders"
        background={WHITE}
        paddingDesktop={{ top: '110', bottom: '110', left: '40', right: '40' }}
        vertical="center"
      >
        <Image colWidth="5" src={images.chrisDebby} alt="Chris and Debby" imageBorderRadius="32" />
        <Text
          width="6"
          align="left"
          text={`
            ${eyebrow('We\u2019re Chris & Debby')}
            <h2 style="font-family:${DISPLAY};font-weight:700;font-size:46px;line-height:1.1;color:${INK};margin:0 0 22px;letter-spacing:-0.02em">And we Rethink Typical&trade;</h2>
            ${bodyP('At Auticate, we challenge conventional views on autism and embrace the diversity in how people experience and interact with the world. Our goal is clear: to see every autistic person become their most accepting and able self. As a neurodiverse couple, we live by the belief that understanding and acceptance can make life better — and we invite you to believe it too.')}
            <div style="margin-top:8px">${pillButton('Meet Us', '/about', { variant: 'outline' })}</div>
          `}
        />
      </ContentSection>

      {/* Resources strip */}
      <ContentSection
        name="More resources"
        background={PALE_BLUE}
        paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }}
        horizontal="center"
      >
        <Text
          width="12"
          align="center"
          text={`
            ${eyebrow('More resources')}
            <h2 style="font-family:${DISPLAY};font-weight:700;font-size:38px;line-height:1.2;color:${INK};margin:0 0 14px">If you\u2019d like to be part of our community, we welcome you.</h2>
            <p style="font-family:${BODY_F};font-size:16px;color:${BODY_INK};margin:0 auto 40px;max-width:640px">Videos are free on YouTube. Free guides, paid courses, and live community events are available right here.</p>
          `}
        />
        {[
          { tag: 'Free Guide',     title: 'The Autistic Roadmap',           href: '/autistic-roadmap',        bg: '#FFE9D2' },
          { tag: 'Free Mini-Course', title: 'Is This Autistic Burnout?',     href: '/beyond-burnout-course',   bg: '#D6EFFF' },
          { tag: 'Paid Course',     title: 'Beyond Burnout',                  href: '/beyond-burnout-course',   bg: '#E6E1FF' },
          { tag: 'Videos',          title: 'Lived experience on YouTube',     href: 'https://youtube.com/@auticate', bg: '#FCD9D9' },
          { tag: 'Paid Course',     title: 'The Autistic Energy System',      href: '/autistic-energy-system',  bg: '#D7F5DD' },
          { tag: 'Membership',      title: 'Join the Community',              href: '/membership',              bg: '#FCF5E4' },
        ].map((r, i) => (
          <Feature
            key={i}
            width="4"
            text={`
              <a href="${r.href}" style="display:block;background:${r.bg};border-radius:24px;padding:32px;text-decoration:none;height:100%;border:2px solid rgba(22,30,42,0.04)">
                <div style="font-family:${DISPLAY};font-weight:700;font-size:12px;color:${BLUE};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:14px">${r.tag}</div>
                <div style="font-family:${DISPLAY};font-weight:700;font-size:22px;color:${INK};line-height:1.25">${r.title}</div>
                <div style="margin-top:24px;font-family:${DISPLAY};font-weight:600;font-size:14px;color:${BLUE}">Learn more →</div>
              </a>
            `}
          />
        ))}
      </ContentSection>

      <TestimonialsSection />

      <FinalCtaSection />
      <NewsletterCta />
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- inner pages ----------

function PathwayPage({
  brand, images, eyebrowText, heading, intro, heroImg, videoTitle, videoBody, founderImg, founderName, founderStory, courseTitle, courseBody,
}: {
  brand: string; images: Record<string, string>;
  eyebrowText: string; heading: string; intro: string;
  heroImg: string;
  videoTitle: string; videoBody: string;
  founderImg: string; founderName: string; founderStory: string;
  courseTitle: string; courseBody: string;
}) {
  return (
    <>
      <SharedHeader images={images} />
      {/* Hero */}
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }} vertical="center">
        <Text width="6" align="left" text={`
          ${eyebrow(eyebrowText)}
          ${heroH1(heading)}
          ${bodyP(intro)}
          <div style="margin-top:8px">${pillButton('Become a Member', '/membership', { variant: 'primary' })}</div>
        `} />
        <Image colWidth="6" src={heroImg} alt={heading} imageBorderRadius="32" />
      </ContentSection>

      {/* Video CTA */}
      <ContentSection name="Video CTA" background={SOFT_BLUE} paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }} vertical="center">
        <Text width="7" align="left" text={`
          ${eyebrow(videoTitle, INK)}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 18px">${videoTitle}</h2>
          ${bodyP(videoBody)}
          <div>${pillButton('See Video', 'https://youtube.com/@auticate', { variant: 'primary', newTab: true })}</div>
        `} />
        <Text width="5" align="center" text={`
          <div style="background:${WHITE};border-radius:24px;padding:18px;box-shadow:0 14px 40px rgba(22,30,42,0.10)">
            <div style="position:relative;border-radius:14px;overflow:hidden;background:${INK};aspect-ratio:16/9;display:flex;align-items:center;justify-content:center">
              <div style="width:74px;height:74px;background:${WHITE};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(0,0,0,0.3)">
                <span style="border-style:solid;border-width:14px 0 14px 22px;border-color:transparent transparent transparent ${BLUE};margin-left:6px"></span>
              </div>
            </div>
          </div>
        `} />
      </ContentSection>

      {/* Founder story */}
      <ContentSection name="Founder story" background={WHITE} paddingDesktop={{ top: '110', bottom: '110', left: '40', right: '40' }} vertical="center">
        <Image colWidth="5" src={founderImg} alt={founderName} imageBorderRadius="32" />
        <Text width="6" align="left" text={`
          ${eyebrow(`Hear ${founderName}\u2019s story`)}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 22px;letter-spacing:-0.01em">Hi! I\u2019m ${founderName}.</h2>
          ${bodyP(founderStory)}
          ${pillButton('Watch Now', 'https://youtube.com/@auticate', { variant: 'outline', newTab: true })}
        `} />
      </ContentSection>

      {/* How we help */}
      <ContentSection name="How we help" background={CREAM} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="12" align="center" text={`
          ${eyebrow('Here is how we help')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 50px">${light('A different way')} to learn about autism.</h2>
        `} />
        {[
          { t: 'We educate to empower.', b: 'Our courses give you the tools and knowledge to make a real difference in your everyday experiences.' },
          { t: 'We see neurodiversity as new possibility.', b: 'Neurodiversity is not just about being different — it opens doors to new ways of thinking and doing.' },
          { t: 'We help you find meaning in learning.', b: 'We dive deep, connecting the dots in ways that make sense to you and stay personal.' },
        ].map((c, i) => (
          <Feature key={i} width="4" text={`
            <div style="background:${WHITE};border-radius:24px;padding:34px;box-shadow:0 10px 30px rgba(22,30,42,0.06);height:100%;text-align:left">
              <div style="width:48px;height:48px;background:${PEACH};border-radius:14px;display:inline-flex;align-items:center;justify-content:center;color:${WHITE};font-family:${DISPLAY};font-weight:700;font-size:22px;margin-bottom:18px">${i + 1}</div>
              <h3 style="font-family:${DISPLAY};font-weight:700;font-size:22px;color:${INK};margin:0 0 12px;line-height:1.25">${c.t}</h3>
              <p style="font-family:${BODY_F};font-size:15.5px;line-height:1.6;color:${BODY_INK};margin:0">${c.b}</p>
            </div>
          `} />
        ))}
      </ContentSection>

      {/* Featured course */}
      <ContentSection name="Resource" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} vertical="center">
        <Image colWidth="6" src={images.burnoutHero} alt={courseTitle} imageBorderRadius="28" />
        <Text width="6" align="left" text={`
          ${eyebrow('Featured resource')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:38px;line-height:1.15;color:${INK};margin:0 0 22px">${courseTitle}</h2>
          ${bodyP(courseBody)}
          ${pillButton('Learn More', '/beyond-burnout-course', { variant: 'primary' })}
        `} />
      </ContentSection>

      <TestimonialsSection />
      <FinalCtaSection />
      <NewsletterCta />
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function NavigatingAutismPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return PathwayPage({
    brand, images,
    eyebrowText: 'Navigating Autism',
    heading: `${light('We can help you')}<br/>be who you are.`,
    intro: 'Discovering your place on the autism spectrum is a journey toward self-acceptance and empowerment. Join us at Auticate, where tailored strategies and a supportive community help you embrace and celebrate your authentic self.',
    heroImg: images.homeHero,
    videoTitle: 'How do I know if I have autism?',
    videoBody: 'Curious if you might be on the spectrum? Our 5-minute video helps you start answering that question. Watch on YouTube and take the first step toward understanding yourself better.',
    founderImg: images.chris,
    founderName: 'Chris',
    founderStory: "As a late-diagnosed autistic person, my own experiences have shaped my understanding and fueled my passion for creating Auticate. I share my story not as a series of obstacles to overcome, but as a testament to finding strength, embracing your identity, and inspiring hope.",
    courseTitle: 'The Autistic Energy System: 10-Day Program',
    courseBody: "Struggling with autistic fatigue but can't figure out what to do instead? This self-paced course explains why this is so common and how to break the cycle — with 10 days of learning and 30+ lessons.",
  });
}

function SupportingPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return PathwayPage({
    brand, images,
    eyebrowText: 'Supporting an autistic person',
    heading: `${light('We can help you')}<br/>be there for them.`,
    intro: "Supporting someone on the autism spectrum can feel challenging, but you don't have to do it alone. Auticate offers practical advice and heartfelt support to help you connect, understand, and be the ally they need.",
    heroImg: images.supportingHero,
    videoTitle: 'Support starts with understanding.',
    videoBody: 'Wondering if someone you care about is on the spectrum? Our short video offers clear insights and practical tips to help you understand and support them better.',
    founderImg: images.debby,
    founderName: 'Debby',
    founderStory: "As Chris's wife and an allistic ally, my journey with Auticate has been one of deep learning and empathy. Witnessing Chris's growth has shown me the profound strength in embracing one's true self. I'm here to help you see your own potential and find hope in your journey.",
    courseTitle: 'Beyond Burnout: The Autistic Recovery Course',
    courseBody: 'Struggling with exhaustion, shutdown, or emotional overwhelm? This self-paced course helps autistic people recognize the signs of burnout and take steps toward recovery — with 70+ thoughtful modules.',
  });
}

function MembershipPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }} vertical="center">
        <Text width="6" align="left" text={`
          ${eyebrow('Auticate Membership')}
          ${heroH1(`${light('Be a member of the community')}<br/>that\u2019s built for you.`)}
          ${bodyP("The Auticate community was created for you. Whether you\u2019re an autistic person or care about one, our memberships deepen your understanding of autism and strengthen the substance of your relationships. Diagnosed, self-identified, or still exploring — you\u2019re welcome here.")}
          <div style="margin-top:8px">${pillButton('Sign Me Up', '#pricing', { variant: 'primary' })}</div>
        `} />
        <Image colWidth="6" src={images.communityHero} alt="The Auticate community" imageBorderRadius="32" />
      </ContentSection>

      {/* Two-tier overview */}
      <ContentSection name="Tiers" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="12" align="center" text={`
          ${eyebrow('What\u2019s inside')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 50px">Auticate Commons & Auticate Classroom.</h2>
        `} />
        <Feature width="6" text={`
          <div style="background:${PALE_BLUE};border-radius:32px;padding:40px;height:100%;text-align:left">
            <div style="font-family:${DISPLAY};font-weight:700;font-size:13px;color:${BLUE};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:14px">Auticate Commons</div>
            <h3 style="font-family:${DISPLAY};font-weight:700;font-size:30px;color:${INK};margin:0 0 16px">Connect & learn daily</h3>
            <p style="font-family:${BODY_F};font-size:16px;line-height:1.65;color:${BODY_INK};margin:0 0 22px">A supportive online community plus daily learning resources.</p>
            <ul style="margin:0;padding:0;list-style:none;font-family:${BODY_F};font-size:15px;line-height:1.7;color:${BODY_INK}">
              <li style="margin-bottom:10px">🫶 Social Connection — supportive community of autistic & AuDHD adults, partners, parents and educators.</li>
              <li style="margin-bottom:10px">🏅 Daily Dose Program — bite-sized daily content that improves understanding and communication.</li>
              <li style="margin-bottom:10px">📒 Shared Resources — community-driven tools to support your daily life.</li>
            </ul>
          </div>
        `} />
        <Feature width="6" text={`
          <div style="background:${CREAM};border-radius:32px;padding:40px;height:100%;text-align:left">
            <div style="font-family:${DISPLAY};font-weight:700;font-size:13px;color:${PEACH};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:14px">Auticate Classroom</div>
            <h3 style="font-family:${DISPLAY};font-weight:700;font-size:30px;color:${INK};margin:0 0 16px">Everything in Commons + courses</h3>
            <p style="font-family:${BODY_F};font-size:16px;line-height:1.65;color:${BODY_INK};margin:0 0 22px">Our complete catalog of self-paced learning programs by and for autistic people.</p>
            <ul style="margin:0;padding:0;list-style:none;font-family:${BODY_F};font-size:15px;line-height:1.7;color:${BODY_INK}">
              <li style="margin-bottom:10px">🌟 Complete Course Library — full catalog of self-paced programs.</li>
              <li style="margin-bottom:10px">💡 Expert insights — video tutorials, in-depth guides, growing monthly.</li>
              <li style="margin-bottom:10px">🙌 Flexible formats — content that adapts to your processing style.</li>
            </ul>
          </div>
        `} />
      </ContentSection>

      {/* Mobile + difference */}
      <ContentSection name="Difference" background={CREAM} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} vertical="center">
        <Image colWidth="5" src={images.membershipSocial} alt="Mobile and community access" imageBorderRadius="28" />
        <Text width="6" align="left" text={`
          ${eyebrow('More than just membership')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:38px;line-height:1.15;color:${INK};margin:0 0 22px">A safe space where authentic connection happens.</h2>
          ${bodyP("Auticate isn\u2019t just another online forum — it\u2019s a space created from lived experience by autistic people who understand the journey firsthand. Be yourself here without masking or explaining your neurotype.")}
          ${bodyP("Take Auticate with you wherever you go. Our mobile-friendly platform and dedicated app let you connect, access content, and join discussions from anywhere.")}
        `} />
      </ContentSection>

      {/* Pricing */}
      <ContentSection name="Pricing" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="12" align="center" text={`
          ${eyebrow('Pricing')}
          <h2 id="pricing" style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 50px">Choose what fits you best.</h2>
        `} />
        <PricingCard
          width="4"
          heading="Commons Monthly"
          name="Monthly"
          price="$19.99"
          priceCaption="/month"
          text={`<ul><li>Auticate Commons — community access</li><li>Daily Dose: Learning Together</li><li>Cancel anytime</li><li>Community-driven insights</li></ul>`}
          buttonText="Become a Member"
          buttonUrl="/checkout/commons-monthly"
          brandColor={BLUE}
        />
        <PricingCard
          width="4"
          heading="Commons Yearly"
          name="Yearly"
          price="$190"
          priceCaption="/year"
          text={`<ul><li>Everything in Commons Monthly</li><li>Save over 20% (save $49.88)</li><li>Yearly membership benefits</li><li>Most popular option</li></ul>`}
          buttonText="Become a Member"
          buttonUrl="/checkout/commons-yearly"
          highlight
          badgeText="Most Popular"
          brandColor={PEACH}
        />
        <PricingCard
          width="4"
          heading="Community"
          name="Community"
          price="$327"
          priceCaption="/year"
          text={`<ul><li>Commons + Classroom</li><li>Complete course library</li><li>12-month full access</li><li>Auto-renews after one year</li></ul>`}
          buttonText="Join the Waitlist"
          buttonUrl="/checkout/community-yearly"
          brandColor={BLUE_DEEP}
        />
      </ContentSection>

      {/* FAQ */}
      <ContentSection name="FAQ" background={CREAM} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="12" align="center" text={`
          ${eyebrow('FAQs')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 40px">Quick answers</h2>
        `} />
        {[
          { title: "What's the difference between the Commons and Community memberships?", body: "Commons gives you our supportive community space, the Daily Dose program, and shared resources. Community includes everything in Commons plus the complete course library and Auticate Classroom." },
          { title: 'How much does membership cost?', body: 'Commons is $19.99/month or $190/year — both include the full Daily Dose program and Circles. The yearly plan saves you 20%.' },
          { title: 'How often are new resources added?', body: 'New resources and materials are added monthly so members always have access to the latest insights and support.' },
          { title: 'Can I cancel my membership at any time?', body: 'Yes. Monthly payments are non-refundable but you can cancel anytime to avoid future charges. For yearly, contact us within 14 days for a refund if it isn\u2019t a fit.' },
          { title: 'Can I access Auticate on my phone?', body: 'Yes! Memberships can be accessed via the Kajabi Communities app on iOS and Android.' },
        ].map((it, i) => (
          <Accordion
            key={i}
            width="8"
            backgroundColor={WHITE}
            padding={{ top: '24', right: '28', bottom: '24', left: '28' }}
            borderRadius="16"
            boxShadow="small"
            iconColor={PEACH}
            heading={it.title}
            body={`<p style="font-family:${BODY_F};font-size:15px;line-height:1.65;color:${BODY_INK};margin:0">${it.body}</p>`}
          />
        ))}
      </ContentSection>

      <FinalCtaSection />
      <NewsletterCta />
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function AboutPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }} vertical="center">
        <Text width="6" align="left" text={`
          ${eyebrow('About Auticate')}
          ${heroH1('Hi! We\u2019re Chris and Debby,<br/>and we\u2019re educators.')}
          ${bodyP("After transforming traditional teaching in Taiwan by making learning engaging and fun, we saw firsthand how the right approach could spark understanding and joy. After navigating Chris\u2019 diagnosis, we wanted to do the same with autism education. That\u2019s how Auticate was born — to transform how people see autism, and how autistic adults see themselves.")}
          <div style="margin-top:8px">${pillButton('Find Us on YouTube', 'https://youtube.com/@auticate', { variant: 'primary', newTab: true })}</div>
        `} />
        <Image colWidth="6" src={images.aboutHero} alt="Chris and Debby" imageBorderRadius="32" />
      </ContentSection>

      {/* Vision / Mission / Purpose */}
      <ContentSection name="Vision" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="12" align="center" text={`
          ${eyebrow('Here\u2019s what we\u2019re trying to do')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 50px">Vision · Mission · Purpose</h2>
        `} />
        {[
          { t: 'Our Vision', b: 'A world where neurodiversity is not only accepted but celebrated as a vital aspect of human diversity — with healthy relationships between autistic people and their allistic allies, mutual understanding, and full participation in every aspect of life.' },
          { t: 'Our Mission', b: 'To empower autistic people to live fuller lives through content rooted in lived experience and a supportive community.' },
          { t: 'Our Purpose', b: 'We exist to affirm and elevate the inherent value of every autistic person.' },
        ].map((c, i) => (
          <Feature key={i} width="4" text={`
            <div style="background:${CREAM};border-radius:24px;padding:34px;height:100%;text-align:left">
              <h3 style="font-family:${DISPLAY};font-weight:700;font-size:24px;color:${BLUE};margin:0 0 14px">${c.t}</h3>
              <p style="font-family:${BODY_F};font-size:16px;line-height:1.65;color:${BODY_INK};margin:0">${c.b}</p>
            </div>
          `} />
        ))}
      </ContentSection>

      {/* What does our name mean */}
      <ContentSection name="Name" background={SOFT_BLUE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          ${eyebrow('What does our name mean?', INK)}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:38px;line-height:1.2;color:${INK};margin:0 0 22px">Autism + educate = Auticate.</h2>
          ${bodyP('A suggestive composite name created by merging two words. By combining "autism" with "educate," our name captures the educational mission driving our work — and the cadence (AUT-i-cate) is easy to pronounce and pleasant to hear.', BODY_INK, '760px')}
        `} />
      </ContentSection>

      {/* Why elephant */}
      <ContentSection name="Elephant" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} vertical="center">
        <Image colWidth="5" src={images.whyElephant} alt="Why the elephant" imageBorderRadius="32" />
        <Text width="6" align="left" text={`
          ${eyebrow('Why the elephant?')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:38px;line-height:1.2;color:${INK};margin:0 0 22px">A symbol of wisdom, patience, and steady community.</h2>
          ${bodyP("With its grand stature and gentle demeanor, the elephant embodies the strength and endurance required to navigate life\u2019s challenges. These majestic creatures represent deep familial bonds and loyalty — mirroring the steady community we\u2019re building.")}
          ${bodyP("For us, the elephant reflects the journey of understanding and growth we\u2019ve been on. A beacon of hope and resilience: with patience and empathy, progress is not only possible but inevitable.")}
        `} />
      </ContentSection>

      {/* Chris + Debby intros */}
      <ContentSection name="Chris" background={CREAM} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} vertical="center">
        <Image colWidth="5" src={imgChrisStory} alt="Chris" imageBorderRadius="32" />
        <Text width="6" align="left" text={`
          ${eyebrow('Hi! I\u2019m Chris.')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:36px;line-height:1.2;color:${INK};margin:0 0 20px">A late-diagnosed autistic educator.</h2>
          ${bodyP("My own experiences have shaped my understanding and fueled my passion for creating Auticate. I\u2019m excited to share my story with you — not just as a series of obstacles to overcome, but as a testament to finding strength and embracing my identity.")}
          ${pillButton('Watch Now', 'https://youtube.com/@auticate', { variant: 'outline', newTab: true })}
        `} />
      </ContentSection>

      <ContentSection name="Debby" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} vertical="center">
        <Text width="6" align="left" text={`
          ${eyebrow('Hi! I\u2019m Debby.')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:36px;line-height:1.2;color:${INK};margin:0 0 20px">An allistic ally and educator.</h2>
          ${bodyP("As Chris\u2019s wife and an allistic ally, my journey with Auticate has been one of deep learning and empathy. Witnessing Chris\u2019s growth has shown me the profound strength in embracing one\u2019s true self.")}
          ${pillButton('Watch Now', 'https://youtube.com/@auticate', { variant: 'outline', newTab: true })}
        `} />
        <Image colWidth="5" src={imgDebbyStory} alt="Debby" imageBorderRadius="32" />
      </ContentSection>

      <FinalCtaSection />
      <NewsletterCta />
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function ContactPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }} vertical="center">
        <Text width="6" align="left" text={`
          ${eyebrow('Contact us')}
          ${heroH1('We\u2019re ready,<br/>whenever you are.')}
          ${bodyP("We\u2019re here to help with whatever you need. Reach out anytime and a member of the Auticate team will get back to you right away.")}
          <div style="margin-top:24px">
            <div style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-bottom:6px">Reach out</div>
            <a href="mailto:[email protected]" style="font-family:${BODY_F};font-size:18px;color:${BLUE};text-decoration:none">[email protected]</a>
          </div>
          <div style="margin-top:28px">
            <div style="font-family:${DISPLAY};font-weight:700;color:${INK};letter-spacing:0.12em;text-transform:uppercase;font-size:13px;margin-bottom:14px">Find us online</div>
          </div>
        `} />
        <Form
          width="6"
          heading="Send us a message"
          text=""
          buttonBackgroundColor={BLUE}
          buttonTextColor="#FFFFFF"
        />
      </ContentSection>

      <ContentSection name="FAQ" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="12" align="center" text={`
          ${eyebrow('FAQs')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 40px">Common questions</h2>
        `} />
        {[
          { title: 'What services does Auticate offer?', body: "Auticate provides resources, support, and guidance for autistic individuals and their families — including educational courses, community-building activities, and the Auticate Commons. Diagnosed, self-identified, or still exploring — Auticate was built for you." },
          { title: 'How can I get in touch with Auticate?', body: 'Use the contact form above or email [email protected] and we\u2019ll get back to you as soon as possible.' },
          { title: 'Can I schedule a consultation with Chris or Debby?', body: 'Yes — please use the contact form or email us to request a meeting and we\u2019ll arrange a time that works.' },
        ].map((it, i) => (
          <Accordion
            key={i}
            width="8"
            backgroundColor={CREAM}
            padding={{ top: '24', right: '28', bottom: '24', left: '28' }}
            borderRadius="16"
            boxShadow="small"
            iconColor={BLUE}
            heading={it.title}
            body={`<p style="font-family:${BODY_F};font-size:15px;line-height:1.65;color:${BODY_INK};margin:0">${it.body}</p>`}
          />
        ))}
      </ContentSection>

      <NewsletterCta />
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function RoadmapPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} vertical="center">
        <Text width="6" align="left" text={`
          ${eyebrow('Free guide')}
          ${heroH1('Just learning you\u2019re autistic?<br/>We\u2019ve got you covered.')}
          ${bodyP("This FREE roadmap is the start to understanding your unique brain. It\u2019s your 5-step guide to readjusting your life as you begin your journey of relearning your brain — and it\u2019s simple and easy to start.")}
          <ul style="font-family:${BODY_F};font-size:16px;line-height:1.7;color:${BODY_INK};padding-left:22px;margin:0 0 28px">
            <li>Clear explanations and guided steps</li>
            <li>Examples from Chris\u2019s lived experience</li>
            <li>Reflection prompts to apply to your own life</li>
          </ul>
          <Form/>
        `} />
        <Text width="6" align="center" text={`
          <div style="background:${WHITE};border-radius:32px;padding:28px;box-shadow:0 20px 60px rgba(22,30,42,0.10)">
            <img src="${images.roadmapMockup}" alt="The Autistic Roadmap" style="width:100%;border-radius:18px;display:block"/>
            <div style="margin-top:24px;text-align:left">
              <h3 style="font-family:${DISPLAY};font-weight:700;font-size:22px;color:${INK};margin:0 0 8px">Get your free roadmap</h3>
              <p style="font-family:${BODY_F};font-size:14px;color:${MUTED};margin:0">By subscribing, you agree to receive emails and acknowledge our <a href="/privacy-policy" style="color:${BLUE};text-decoration:underline">privacy policy</a>.</p>
            </div>
          </div>
        `} />
      </ContentSection>

      {/* Real signup form below */}
      <ContentSection name="Form" background={WHITE} paddingDesktop={{ top: '60', bottom: '90', left: '40', right: '40' }} horizontal="center">
        <Form
          width="8"
          heading="Get your free roadmap"
          text=""
          buttonBackgroundColor={BLUE}
          buttonTextColor="#FFFFFF"
        />
      </ContentSection>

      <NewsletterCta />
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function CoursePage({
  brand, images, hero, eyebrowText, heading, intro, problemTitle, problemBody, whatsInside, price, ctaUrl,
}: {
  brand: string; images: Record<string, string>;
  hero: string; eyebrowText: string; heading: string; intro: string;
  problemTitle: string; problemBody: string;
  whatsInside: string[]; price: string; ctaUrl: string;
}) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '90', bottom: '90', left: '40', right: '40' }} vertical="center">
        <Text width="6" align="left" text={`
          ${eyebrow(eyebrowText)}
          ${heroH1(heading)}
          ${bodyP(intro)}
          <div style="margin-top:8px">${pillButton('Start Today', ctaUrl, { variant: 'primary' })}</div>
        `} />
        <Image colWidth="6" src={hero} alt={heading} imageBorderRadius="32" />
      </ContentSection>

      <ContentSection name="Problem" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          ${eyebrow('Why this matters')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:46px;line-height:1.15;color:${INK};margin:0 0 22px">${problemTitle}</h2>
          <p style="font-family:${BODY_F};font-size:18px;line-height:1.7;color:${BODY_INK};max-width:780px;margin:0 auto">${problemBody}</p>
        `} />
      </ContentSection>

      <ContentSection name="Founders" background={CREAM} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} vertical="center">
        <Image colWidth="5" src={images.chrisDebby} alt="Chris and Debby" imageBorderRadius="32" />
        <Text width="6" align="left" text={`
          ${eyebrow('Created by people who live it')}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:36px;line-height:1.2;color:${INK};margin:0 0 20px">Not just people who talk about it.</h2>
          ${bodyP("We\u2019re Chris and Debby — longtime educators, partners in life and work, and co-founders of Auticate. Chris is autistic (and has ADHD) and has lived through severe burnout. Debby has been his advocate, support, and fellow problem-solver every step.")}
          ${bodyP("This course is built on lived experience and everything we\u2019ve learned helping thousands of autistic people navigate their own journeys.")}
        `} />
      </ContentSection>

      <ContentSection name="What's inside" background={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="12" align="center" text={`
          ${eyebrow("What\u2019s inside the course")}
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:42px;line-height:1.15;color:${INK};margin:0 0 50px">Practical, gentle, deeply validating.</h2>
        `} />
        {whatsInside.map((line, i) => (
          <Feature key={i} width="6" text={`
            <div style="display:flex;gap:16px;align-items:flex-start;background:${CREAM};border-radius:18px;padding:22px 26px">
              <div style="flex:0 0 auto;width:38px;height:38px;background:${BLUE};color:${WHITE};border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:${DISPLAY};font-weight:700">${i + 1}</div>
              <div style="font-family:${BODY_F};font-size:16px;line-height:1.55;color:${BODY_INK}">${line}</div>
            </div>
          `} />
        ))}
      </ContentSection>

      <ContentSection name="Price" background={BLUE} textColor={WHITE} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          <h2 style="font-family:${DISPLAY};font-weight:700;font-size:48px;line-height:1.15;color:${WHITE};margin:0 0 18px">Get the course for ${price}</h2>
          <p style="font-family:${BODY_F};font-size:18px;color:rgba(255,255,255,0.92);margin:0 0 32px">Self-paced, lifetime access, start anytime.</p>
          <a href="${ctaUrl}" style="display:inline-flex;align-items:center;gap:10px;padding:16px 40px;border-radius:999px;background:${WHITE};color:${BLUE};text-decoration:none;font-family:${DISPLAY};font-weight:700;font-size:17px;box-shadow:0 12px 36px rgba(0,0,0,0.22)">Start Today →</a>
        `} />
      </ContentSection>

      <TestimonialsSection />
      <NewsletterCta />
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function BurnoutPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return CoursePage({
    brand, images,
    hero: images.burnoutHero,
    eyebrowText: 'Beyond Burnout',
    heading: "Burnout isn\u2019t who you are.<br/>It\u2019s where you are.",
    intro: "If you or the autistic person in your life are exhausted, overwhelmed, or barely holding it together, it\u2019s not a failure. It\u2019s autistic burnout — and you\u2019re not alone. Our self-paced course offers practical, no-pressure support to help you understand what\u2019s happening, respond with care, and find your way back to steadier ground.",
    problemTitle: "You\u2019re not lazy. You\u2019re in burnout. And it\u2019s not your fault.",
    problemBody: "Autistic burnout is the mental, emotional, and physical shutdown that comes from pushing beyond your limits in a world not built for your brain. This course is here to name it, explain it, and support you through it — with compassion, clarity, and care.",
    whatsInside: [
      '70+ on-demand video lessons across 5 modules',
      'Lifetime access — self-paced, no deadlines',
      'Tools to manage masking, shutdowns, energy crashes',
      'Support for work, relationships, responsibilities',
      'An online community to ask questions and connect',
      'Gentle guidance to make life feel manageable again',
    ],
    price: '$397',
    ctaUrl: '/checkout/beyond-burnout',
  });
}

function EnergyPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return CoursePage({
    brand, images,
    hero: images.energyHero,
    eyebrowText: 'Autistic Energy System',
    heading: "Are you always exhausted?<br/>It doesn\u2019t have to stay that way.",
    intro: "Ever wondered why you\u2019re always tired, no matter how much you rest? If you\u2019re autistic, it\u2019s linked to your unique brain. Ten days of practical guidance, relatable insights, and easy-to-use tools that help you understand what\u2019s happening and build a sustainable lifestyle for you.",
    problemTitle: "You\u2019re not lazy. You don\u2019t need to push harder. You need a plan that works for you.",
    problemBody: "Autistic fatigue is much more than being tired. It\u2019s the mismatch that comes with trying to live based on expectations that weren\u2019t designed with your brain in mind. There is another way — it starts with understanding your Autistic Energy System.",
    whatsInside: [
      '30+ on-demand video lessons across 10 days',
      'Practical tools to rebalance your expectations',
      'Restructure your life to get your energy back',
      'Stability, safety, and structure — for your brain',
      'Lifetime access to the full library',
      'Companion worksheets and reflection prompts',
    ],
    price: '$147',
    ctaUrl: '/checkout/autistic-energy-system',
  });
}

function LegalPage({ brand, images, title, html }: { brand: string; images: Record<string, string>; title: string; html: string }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Hero" background={CREAM} paddingDesktop={{ top: '80', bottom: '40', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          ${eyebrow('Legal')}
          <h1 style="font-family:${DISPLAY};font-weight:700;font-size:54px;line-height:1.1;color:${INK};margin:0 0 12px">${title}</h1>
          <p style="font-family:${BODY_F};font-size:15px;color:${MUTED};margin:0">Last updated: April 2025</p>
        `} />
      </ContentSection>
      <ContentSection name="Body" background={WHITE} paddingDesktop={{ top: '60', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="9" align="left" text={`
          <div style="font-family:${BODY_F};font-size:16px;line-height:1.75;color:${BODY_INK}">${html}</div>
        `} />
      </ContentSection>
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

const TERMS_HTML = `
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">1. Acceptance of Terms</h2>
<p>By accessing and using Auticate, you accept and agree to be bound by the terms and provisions of this agreement.</p>
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">2. Use License</h2>
<p>Permission is granted to temporarily access materials on Auticate for personal, non-commercial use only.</p>
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">3. Refund Policy</h2>
<p>Monthly memberships ($19.99) are non-refundable but you can cancel anytime to avoid future charges. First-time members may request a refund within 7 days if Commons isn\u2019t a fit.</p>
<p>Yearly memberships ($190) — contact us within 14 days of your first purchase if it isn\u2019t for you and we\u2019ll likely issue a full refund. After that, access continues through the paid year and future payments aren\u2019t billed.</p>
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">4. Disclaimer</h2>
<p>The materials on Auticate are provided on an \u2018as is\u2019 basis. Auticate makes no warranties, expressed or implied, and hereby disclaims all other warranties.</p>
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">5. Contact</h2>
<p>Questions about the Terms of Use should be sent to <a href="mailto:[email protected]" style="color:${BLUE}">[email protected]</a>.</p>
`;

const PRIVACY_HTML = `
<p>Your privacy is important to us. This Privacy Policy explains how Auticate collects, uses, and protects your information when you use our services.</p>
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">Information We Collect</h2>
<p>We collect information you provide directly when you sign up, contact us, or participate in the community — such as your name, email, and any messages you choose to share.</p>
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">How We Use Your Information</h2>
<p>We use your information to deliver our courses and community, communicate with you, send updates, and improve our services. Your information is confidential and we never sell it.</p>
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">Data Security</h2>
<p>We implement reasonable safeguards to protect your data and follow industry-standard practices for storing and processing it.</p>
<h2 style="font-family:${DISPLAY};font-weight:700;color:${INK};margin-top:32px">Contact</h2>
<p>For privacy questions, email <a href="mailto:[email protected]" style="color:${BLUE}">[email protected]</a>.</p>
`;

function ThankYouPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Thank you" background={CREAM} paddingDesktop={{ top: '120', bottom: '120', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          ${eyebrow('Thank you')}
          <h1 style="font-family:${DISPLAY};font-weight:700;font-size:60px;line-height:1.1;color:${INK};margin:0 0 22px">You\u2019re in. 🎉</h1>
          ${bodyP("Check your inbox in a few minutes. If you don\u2019t see anything, peek in your spam folder — we\u2019re a small team and one occasionally gets lost.", BODY_INK, '620px')}
          <div style="margin-top:8px">${pillButton('Back to Home', '/', { variant: 'primary' })}</div>
        `} />
      </ContentSection>
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function NotFoundPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="404" background={CREAM} paddingDesktop={{ top: '120', bottom: '120', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          ${eyebrow('404')}
          <h1 style="font-family:${DISPLAY};font-weight:700;font-size:80px;line-height:1.05;color:${INK};margin:0 0 18px">Page not found</h1>
          ${bodyP("The page you\u2019re looking for doesn\u2019t exist or has moved.", BODY_INK, '500px')}
          <div style="margin-top:8px">${pillButton('Back to Home', '/', { variant: 'primary' })}</div>
        `} />
      </ContentSection>
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function GenericPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Page" background={CREAM} paddingDesktop={{ top: '100', bottom: '100', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          ${heroH1('A custom page')}
          ${bodyP('Use this template for any standalone marketing page in Kajabi.')}
        `} />
      </ContentSection>
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function BlogPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Blog header" background={CREAM} paddingDesktop={{ top: '90', bottom: '60', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          ${eyebrow('From the journal')}
          <h1 style="font-family:${DISPLAY};font-weight:700;font-size:54px;line-height:1.1;color:${INK};margin:0 0 14px">Stories, lessons, lived experience</h1>
          ${bodyP('Kajabi will render your real post list below.', BODY_INK, '560px')}
        `} />
      </ContentSection>
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

function BlogPostPage({ brand, images }: { brand: string; images: Record<string, string> }) {
  return (
    <>
      <SharedHeader images={images} />
      <ContentSection name="Post chrome" background={CREAM} paddingDesktop={{ top: '60', bottom: '40', left: '40', right: '40' }} horizontal="center">
        <Text width="10" align="center" text={`
          ${eyebrow('Auticate journal')}
          <h1 style="font-family:${DISPLAY};font-weight:700;font-size:46px;line-height:1.1;color:${INK};margin:0">Post title</h1>
        `} />
      </ContentSection>
      <NewsletterCta />
      <SharedFooter brand={brand} images={images} />
    </>
  );
}

// ---------- registry ----------

type PageBuilder = (brand: string, images: Record<string, string>) => ReactNode;

const PAGE_BUILDERS: Record<string, PageBuilder> = {
  index:                            (b, i) => <HomePage brand={b} images={i} />,
  about:                            (b, i) => <AboutPage brand={b} images={i} />,
  contact:                          (b, i) => <ContactPage brand={b} images={i} />,
  'navigating-autism':              (b, i) => <NavigatingAutismPage brand={b} images={i} />,
  'supporting-an-autistic-person':  (b, i) => <SupportingPage brand={b} images={i} />,
  membership:                       (b, i) => <MembershipPage brand={b} images={i} />,
  'autistic-roadmap':               (b, i) => <RoadmapPage brand={b} images={i} />,
  'beyond-burnout-course':          (b, i) => <BurnoutPage brand={b} images={i} />,
  'autistic-energy-system':         (b, i) => <EnergyPage brand={b} images={i} />,
  'terms-of-use':                   (b, i) => <LegalPage brand={b} images={i} title="Terms of Use" html={TERMS_HTML} />,
  'privacy-policy':                 (b, i) => <LegalPage brand={b} images={i} title="Privacy Policy" html={PRIVACY_HTML} />,
  page:                             (b, i) => <GenericPage brand={b} images={i} />,
  blog:                             (b, i) => <BlogPage brand={b} images={i} />,
  blog_post:                        (b, i) => <BlogPostPage brand={b} images={i} />,
  thank_you:                        (b, i) => <ThankYouPage brand={b} images={i} />,
  '404':                            (b, i) => <NotFoundPage brand={b} images={i} />,
};

const ALL_PAGES: PageKey[] = [
  'index',
  'navigating-autism',
  'supporting-an-autistic-person',
  'membership',
  'about',
  'contact',
  'autistic-roadmap',
  'beyond-burnout-course',
  'autistic-energy-system',
  'terms-of-use',
  'privacy-policy',
  'page',
  'blog',
  'blog_post',
  'thank_you',
  '404',
];

const AUTICATE_THEME_SETTINGS: Record<string, string> = {
  background_color: WHITE,
  color_primary: BLUE,
  font_family_heading: 'Sora',
  font_weight_heading: '700',
  line_height_heading: '1.15',
  font_family_body: 'Open Sans',
  font_weight_body: '400',
  line_height_body: '1.65',
  color_heading: INK,
  color_body: BODY_INK,
  color_body_secondary: MUTED,
  color_placeholder: '#9CA3AF',
  font_size_h1_desktop: '60px',
  font_size_h2_desktop: '42px',
  font_size_h3_desktop: '26px',
  font_size_h4_desktop: '20px',
  font_size_body_desktop: '17px',
  font_size_h1_mobile: '40px',
  font_size_h2_mobile: '32px',
  font_size_h3_mobile: '24px',
  font_size_h4_mobile: '18px',
  font_size_body_mobile: '16px',
  btn_style: 'solid',
  btn_size: 'large',
  btn_width: 'auto',
  btn_border_radius: '999',
  btn_text_color: WHITE,
  btn_background_color: BLUE,
};

const AUTICATE_CUSTOM_CSS = `
/* Auticate — system-page polish */
body { background: ${WHITE}; color: ${BODY_INK}; font-family: 'Open Sans', system-ui, sans-serif; }
a { color: ${BLUE}; }
a:hover { color: ${BLUE_DEEP}; }
h1, h2, h3, h4, h5, h6 { font-family: 'Sora', system-ui, sans-serif; letter-spacing: -0.01em; }

button, .button, input[type="submit"], .btn-primary {
  border-radius: 999px !important;
  font-family: 'Sora', sans-serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
}

input[type="text"], input[type="email"], input[type="password"], input[type="tel"], textarea, select {
  border-radius: 14px !important;
  border: 1.5px solid ${SOFT_BLUE} !important;
  padding: 14px 18px !important;
  font-family: 'Open Sans', sans-serif !important;
}
input:focus, textarea:focus, select:focus {
  border-color: ${BLUE} !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(0,114,239,0.18) !important;
}

/* FAQ accordions — visual breathing room between items + inner padding */
.block-accordion { margin-bottom: 14px !important; border-radius: 16px !important; padding: 22px 28px !important; background: ${WHITE} !important; box-shadow: 0 6px 20px rgba(22,30,42,0.06) !important; }
.block-accordion + .block-accordion { margin-top: 0 !important; }
.block-accordion .accordion-heading, .block-accordion .accordion-title, .block-accordion summary, .block-accordion button { padding: 4px 0 !important; font-family: '${'Sora'}', sans-serif !important; font-weight: 700 !important; color: ${INK} !important; }
.block-accordion .accordion-body, .block-accordion .accordion-content { padding-top: 14px !important; font-family: 'Open Sans', sans-serif !important; color: ${BODY_INK} !important; line-height: 1.65 !important; }

@media (max-width: 768px) {
  h1 { font-size: 40px !important; line-height: 1.08 !important; }
  h2 { font-size: 30px !important; }
  .row > [class*="col-"] { flex: 0 0 100% !important; max-width: 100% !important; }
  section { padding-left: 22px !important; padding-right: 22px !important; }
}
`;

export const auticateTemplate: TemplateDef = {
  id: 'auticate',
  label: 'Auticate',
  description: 'Faithful Kajabi remake of auticate.com — Chris & Debby\u2019s warm, approachable autism education brand. Blue + cream + peach, Sora display + Open Sans body, real recovered photography.',
  pageKeys: ALL_PAGES,
  imageSlots: IMAGE_SLOTS,
  themeSettings: AUTICATE_THEME_SETTINGS,
  customCss: AUTICATE_CUSTOM_CSS,
  fonts: { heading: 'Sora', body: 'Open Sans' },
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
