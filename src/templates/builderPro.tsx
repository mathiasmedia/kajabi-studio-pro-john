/**
 * Builder Pro template — Hearth & Honey Bakery.
 *
 * A cozy neighborhood bakery site: warm earthy palette, handcrafted feel,
 * rich emoji/illustration accents (no external images required), and
 * friendly small-business copy.
 *
 * Palette:
 *   cream:    #FAF4EA  (page bg)
 *   honey:    #D4A24C  (accent)
 *   crust:    #8B5A2B  (deep brown)
 *   cocoa:    #3E2A1A  (text on cream)
 *   sage:     #7A8B6F  (secondary accent)
 *   blush:    #F2D7C2  (panel)
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

// ---------- tokens ----------

const SERIF = `'Fraunces', Georgia, 'Times New Roman', serif`;
const SCRIPT = `'Caveat', 'Brush Script MT', cursive`;
const SANS = `'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const CREAM = '#FAF4EA';
const HONEY = '#D4A24C';
const CRUST = '#8B5A2B';
const COCOA = '#3E2A1A';
const SAGE = '#7A8B6F';
const BLUSH = '#F2D7C2';

const NAV_ITEMS = [
  { label: 'Home', url: '/' },
  { label: 'Menu', url: '/page' },
  { label: 'About', url: '/about' },
  { label: 'Custom Cakes', url: '/page' },
  { label: 'Journal', url: '/blog' },
  { label: 'Visit', url: '/contact' },
];

// ---------- inline helpers ----------

function eyebrow(label: string, onDark = false) {
  const color = onDark ? HONEY : CRUST;
  return `<div style="font-family:${SCRIPT};font-size:26px;color:${color};line-height:1;margin:0 0 8px">${label}</div>`;
}

function divider(onDark = false) {
  const color = onDark ? 'rgba(212,162,76,0.6)' : HONEY;
  return `<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:18px auto 0">
    <span style="display:inline-block;width:36px;height:1px;background:${color}"></span>
    <span style="font-size:13px;color:${color}">✦</span>
    <span style="display:inline-block;width:36px;height:1px;background:${color}"></span>
  </div>`;
}

function ctaButton(label: string, url: string, variant: 'primary' | 'ghost' = 'primary') {
  if (variant === 'primary') {
    return `<a href="${url}" style="display:inline-flex;align-items:center;gap:8px;background:${CRUST};color:${CREAM};padding:14px 26px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;font-family:${SANS};letter-spacing:0.02em">${label}</a>`;
  }
  return `<a href="${url}" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:${COCOA};padding:14px 26px;border:1.5px solid ${COCOA};border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;font-family:${SANS};letter-spacing:0.02em">${label}</a>`;
}

function ctaPair(p: { primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string }) {
  return `<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:32px">
    ${ctaButton(p.primaryLabel, p.primaryUrl, 'primary')}
    ${ctaButton(p.secondaryLabel, p.secondaryUrl, 'ghost')}
  </div>`;
}

// "Photo" tile rendered with CSS gradient + a big emoji so we don't need
// real assets. Mimics warm food photography styling.
function photoTile(emoji: string, h = 260, gradient = `linear-gradient(135deg, ${BLUSH} 0%, ${HONEY} 100%)`) {
  return `<div style="height:${h}px;border-radius:14px;background:${gradient};display:flex;align-items:center;justify-content:center;font-size:96px;line-height:1;box-shadow:0 6px 20px -8px rgba(62,42,26,0.25);overflow:hidden">${emoji}</div>`;
}

// ---------- shared chrome ----------

function SharedHeader({ brand }: { brand: string }) {
  return (
    <HeaderSection
      background={CREAM}
      textColor={COCOA}
      sticky
      stickyBackgroundColor={CREAM}
      stickyTextColor={COCOA}
      paddingDesktop={{ top: '20', bottom: '20' }}
      horizontalAlignment="between"
    >
      <Logo type="text" text={brand} textColor={COCOA} />
      <Menu handle="main-menu" alignment="right" previewItems={NAV_ITEMS} />
    </HeaderSection>
  );
}

function SharedFooter({ brand }: { brand: string }) {
  return (
    <FooterSection
      background={COCOA}
      textColor="rgba(250,244,234,0.75)"
      paddingDesktop={{ top: '50', bottom: '50' }}
      verticalLayout
    >
      <Logo type="text" text={brand} textColor={CREAM} />
      <Copyright text={`${brand} — Baked fresh, served warm.`} />
    </FooterSection>
  );
}

// ---------- HOME ----------

function HomePage({ brand }: { brand: string }) {
  return (
    <>
      <SharedHeader brand={brand} />

      {/* ===== Hero ===== */}
      <ContentSection
        background={CREAM}
        paddingDesktop={{ top: '90', bottom: '90' }}
      >
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS};max-width:760px;margin:0 auto">
              ${eyebrow('— Welcome to the neighborhood —')}
              <h1 style="font-family:${SERIF};font-size:84px;line-height:1.02;font-weight:600;color:${COCOA};margin:8px 0 0;letter-spacing:-0.015em">
                Bread, butter,<br/>
                <span style="font-style:italic;color:${CRUST}">and a little</span> honey.
              </h1>
              <p style="max-width:540px;margin:24px auto 0;font-size:18px;line-height:1.65;color:${COCOA};opacity:0.78">
                ${brand} is a tiny corner bakery turning out warm sourdough, flaky pastries, and slow-pulled coffee — six mornings a week, one neighborhood at a time.
              </p>
              ${ctaPair({
                primaryLabel: 'See Today\u2019s Menu',
                primaryUrl: '#menu',
                secondaryLabel: 'Order a Custom Cake',
                secondaryUrl: '#cakes',
              })}
              <div style="margin-top:36px;font-family:${SCRIPT};font-size:22px;color:${SAGE}">Open Tues–Sun · 7am–3pm</div>
            </div>
          `}
        />
      </ContentSection>

      {/* ===== Hero photo strip ===== */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '0', bottom: '20' }}>
        <Text width="4" align="center" text={photoTile('🥐', 280, `linear-gradient(135deg, ${BLUSH} 0%, #E8B97A 100%)`)} />
        <Text width="4" align="center" text={photoTile('🍞', 280, `linear-gradient(135deg, #E8B97A 0%, ${CRUST} 100%)`)} />
        <Text width="4" align="center" text={photoTile('☕', 280, `linear-gradient(135deg, ${SAGE} 0%, ${CRUST} 100%)`)} />
      </ContentSection>

      {/* ===== Featured Menu ===== */}
      <ContentSection background="#FFFFFF" paddingDesktop={{ top: '96', bottom: '96' }}>
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS};max-width:640px;margin:0 auto 56px">
              ${eyebrow('— On the counter today —')}
              <h2 style="font-family:${SERIF};font-size:50px;line-height:1.1;font-weight:600;color:${COCOA};margin:8px 0 0;letter-spacing:-0.01em">
                A few of our <span style="font-style:italic;color:${CRUST}">favorites</span>
              </h2>
              ${divider()}
              <p style="margin:24px auto 0;font-size:16px;line-height:1.65;color:${COCOA};opacity:0.72">
                Everything's mixed by hand and out of the oven by sunrise. Here's a small taste of what's usually in the case.
              </p>
            </div>
          `}
        />

        <Feature
          width="4" align="center" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS};text-align:center">
              <div style="font-size:64px;line-height:1;margin-bottom:16px">🥖</div>
              <h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${COCOA};margin:0 0 8px">Honey Oat Sourdough</h3>
              <p style="font-size:14.5px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0 0 14px">Three-day fermented loaf with toasted oats and a swirl of local wildflower honey.</p>
              <div style="font-family:${SCRIPT};font-size:24px;color:${CRUST}">$8 a loaf</div>
            </div>
          `}
        />
        <Feature
          width="4" align="center" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS};text-align:center">
              <div style="font-size:64px;line-height:1;margin-bottom:16px">🥐</div>
              <h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${COCOA};margin:0 0 8px">Brown Butter Croissant</h3>
              <p style="font-size:14.5px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0 0 14px">72-hour laminated dough, French butter, finished with a brush of brown butter glaze.</p>
              <div style="font-family:${SCRIPT};font-size:24px;color:${CRUST}">$5.50</div>
            </div>
          `}
        />
        <Feature
          width="4" align="center" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS};text-align:center">
              <div style="font-size:64px;line-height:1;margin-bottom:16px">🍰</div>
              <h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${COCOA};margin:0 0 8px">Olive Oil Cake</h3>
              <p style="font-size:14.5px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0 0 14px">Citrus-zested, almond-flecked, and just sweet enough — the one you keep coming back for.</p>
              <div style="font-family:${SCRIPT};font-size:24px;color:${CRUST}">$6 a slice</div>
            </div>
          `}
        />

        <Feature
          width="4" align="center" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS};text-align:center">
              <div style="font-size:64px;line-height:1;margin-bottom:16px">🍪</div>
              <h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${COCOA};margin:0 0 8px">Chocolate Rye Cookie</h3>
              <p style="font-size:14.5px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0 0 14px">Dark chocolate, malted rye flour, flaky sea salt. Crisp on the edges, fudgy in the middle.</p>
              <div style="font-family:${SCRIPT};font-size:24px;color:${CRUST}">$4 each</div>
            </div>
          `}
        />
        <Feature
          width="4" align="center" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS};text-align:center">
              <div style="font-size:64px;line-height:1;margin-bottom:16px">🥧</div>
              <h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${COCOA};margin:0 0 8px">Galette of the Week</h3>
              <p style="font-size:14.5px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0 0 14px">Whatever fruit's good at the farmers market, folded into all-butter pastry.</p>
              <div style="font-family:${SCRIPT};font-size:24px;color:${CRUST}">$7 a slice</div>
            </div>
          `}
        />
        <Feature
          width="4" align="center" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '32', bottom: '32', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS};text-align:center">
              <div style="font-size:64px;line-height:1;margin-bottom:16px">☕</div>
              <h3 style="font-family:${SERIF};font-size:24px;font-weight:600;color:${COCOA};margin:0 0 8px">Slow Drip Coffee</h3>
              <p style="font-size:14.5px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0 0 14px">Small-batch beans from our friends down the street. Pulled patient, served strong.</p>
              <div style="font-family:${SCRIPT};font-size:24px;color:${CRUST}">$4 a cup</div>
            </div>
          `}
        />
      </ContentSection>

      {/* ===== About the Bakery ===== */}
      <ContentSection background={BLUSH} paddingDesktop={{ top: '96', bottom: '96' }}>
        <Text
          align="left"
          width="6"
          text={`
            <div style="font-family:${SANS};padding-right:24px">
              ${eyebrow('— Our story —')}
              <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:600;color:${COCOA};margin:8px 0 0;letter-spacing:-0.01em">
                A small bakery with <span style="font-style:italic;color:${CRUST}">big intentions</span>.
              </h2>
              <p style="font-size:16px;line-height:1.7;color:${COCOA};opacity:0.78;margin:24px 0 0">
                ${brand} started in 2018 as a Saturday-morning bread project on a single home oven. Five years and a lot of flour later, we're still doing the same thing — just with a bigger oven, a brighter front window, and a couple of regulars we now know by name.
              </p>
              <p style="font-size:16px;line-height:1.7;color:${COCOA};opacity:0.78;margin:18px 0 0">
                We mill some of our own flour, source butter from a co-op two counties over, and bake in small enough batches that nothing sits on the shelf for long. If we sell out by noon, that's how it's supposed to go.
              </p>
              <div style="margin-top:30px">${ctaButton('Read the Long Version', '/about', 'ghost')}</div>
            </div>
          `}
        />
        <Text
          align="center"
          width="6"
          text={`
            <div style="position:relative">
              ${photoTile('👩‍🍳', 460, `linear-gradient(135deg, ${HONEY} 0%, ${CRUST} 100%)`)}
              <div style="position:absolute;bottom:-18px;right:-18px;background:${CREAM};padding:18px 22px;border-radius:12px;box-shadow:0 10px 30px -10px rgba(62,42,26,0.3);font-family:${SANS};max-width:220px">
                <div style="font-family:${SCRIPT};font-size:22px;color:${CRUST};line-height:1">— Mae &amp; Theo</div>
                <div style="font-size:13px;color:${COCOA};opacity:0.7;margin-top:4px">Owners, head bakers, dish-washers, occasional baristas.</div>
              </div>
            </div>
          `}
        />
      </ContentSection>

      {/* ===== Custom Cakes ===== */}
      <ContentSection background={COCOA} textColor={CREAM} paddingDesktop={{ top: '110', bottom: '110' }}>
        <Text
          align="center"
          width="6"
          text={`
            <div>${photoTile('🎂', 380, `linear-gradient(135deg, ${BLUSH} 0%, ${HONEY} 100%)`)}</div>
          `}
        />
        <Text
          align="left"
          width="6"
          text={`
            <div style="font-family:${SANS};padding-left:24px;color:${CREAM}">
              ${eyebrow('— Custom cakes —', true)}
              <h2 style="font-family:${SERIF};font-size:50px;line-height:1.1;font-weight:600;color:${CREAM};margin:8px 0 0;letter-spacing:-0.01em">
                Cakes for the <span style="font-style:italic;color:${HONEY}">good days</span>.
              </h2>
              <p style="font-size:16px;line-height:1.7;color:rgba(250,244,234,0.78);margin:22px 0 0">
                Birthdays. First days. Last days. Tuesdays for no reason at all. We make custom cakes for any occasion that deserves a candle on top — or doesn't.
              </p>
              <ul style="list-style:none;padding:0;margin:24px 0 0;display:flex;flex-direction:column;gap:12px">
                <li style="display:flex;align-items:center;gap:12px;font-size:15px;color:${CREAM}"><span style="color:${HONEY}">✦</span> Layer cakes from 6" to 12" rounds</li>
                <li style="display:flex;align-items:center;gap:12px;font-size:15px;color:${CREAM}"><span style="color:${HONEY}">✦</span> Wedding tiers and dessert tables</li>
                <li style="display:flex;align-items:center;gap:12px;font-size:15px;color:${CREAM}"><span style="color:${HONEY}">✦</span> Gluten-free &amp; vegan options, always</li>
                <li style="display:flex;align-items:center;gap:12px;font-size:15px;color:${CREAM}"><span style="color:${HONEY}">✦</span> Two weeks' notice gets you a real conversation</li>
              </ul>
              <div style="margin-top:32px"><a href="#cakes" style="display:inline-flex;align-items:center;gap:8px;background:${HONEY};color:${COCOA};padding:14px 26px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;font-family:${SANS}">Start a Cake Order</a></div>
            </div>
          `}
        />
      </ContentSection>

      {/* ===== Testimonials ===== */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '96', bottom: '96' }}>
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS};max-width:640px;margin:0 auto 56px">
              ${eyebrow('— Kind words —')}
              <h2 style="font-family:${SERIF};font-size:48px;line-height:1.1;font-weight:600;color:${COCOA};margin:8px 0 0;letter-spacing:-0.01em">
                From our <span style="font-style:italic;color:${CRUST}">regulars</span>
              </h2>
              ${divider()}
            </div>
          `}
        />

        <Text width="4" align="left" backgroundColor="#FFFFFF" borderRadius="14"
          padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:24px;color:${HONEY};line-height:1">★★★★★</div>
              <p style="font-family:${SERIF};font-size:19px;line-height:1.55;color:${COCOA};margin:18px 0 24px;font-style:italic">"The honey oat loaf changed how I feel about toast. I'm not exaggerating. My toaster has a new best friend."</p>
              <div style="font-weight:700;font-size:14px;color:${COCOA}">Jess M.</div>
              <div style="font-size:13px;color:${SAGE};margin-top:2px">Saturday morning regular</div>
            </div>
          `}
        />
        <Text width="4" align="left" backgroundColor="#FFFFFF" borderRadius="14"
          padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:24px;color:${HONEY};line-height:1">★★★★★</div>
              <p style="font-family:${SERIF};font-size:19px;line-height:1.55;color:${COCOA};margin:18px 0 24px;font-style:italic">"Mae made our wedding cake — three tiers of olive oil cake with rosemary cream. People still text me about it a year later."</p>
              <div style="font-weight:700;font-size:14px;color:${COCOA}">Tomás &amp; Reagan</div>
              <div style="font-size:13px;color:${SAGE};margin-top:2px">Custom cake clients, June 2024</div>
            </div>
          `}
        />
        <Text width="4" align="left" backgroundColor="#FFFFFF" borderRadius="14"
          padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:24px;color:${HONEY};line-height:1">★★★★★</div>
              <p style="font-family:${SERIF};font-size:19px;line-height:1.55;color:${COCOA};margin:18px 0 24px;font-style:italic">"I work two blocks away and somehow end up here three times a week. The croissant is a problem in the best possible way."</p>
              <div style="font-weight:700;font-size:14px;color:${COCOA}">David K.</div>
              <div style="font-size:13px;color:${SAGE};margin-top:2px">Neighborhood resident</div>
            </div>
          `}
        />
      </ContentSection>

      {/* ===== Seasonal Specials ===== */}
      <ContentSection background={SAGE} textColor={CREAM} paddingDesktop={{ top: '96', bottom: '96' }}>
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS};max-width:680px;margin:0 auto 48px">
              ${eyebrow('— This season —', true)}
              <h2 style="font-family:${SERIF};font-size:50px;line-height:1.1;font-weight:600;color:${CREAM};margin:8px 0 0;letter-spacing:-0.01em">
                What's in the oven <span style="font-style:italic;color:${HONEY}">right now</span>
              </h2>
              <p style="font-size:16px;line-height:1.65;color:rgba(250,244,234,0.85);margin:22px auto 0">
                We change the case with the seasons. These are running through the end of the month — or until they sell out, whichever comes first.
              </p>
            </div>
          `}
        />

        <Feature
          width="4" align="left" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:48px;line-height:1;margin-bottom:14px">🍑</div>
              <div style="font-family:${SCRIPT};font-size:22px;color:${CRUST};line-height:1">Late summer</div>
              <h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${COCOA};margin:6px 0 8px">Stone Fruit Galette</h3>
              <p style="font-size:14px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0">Yellow peaches, plums, and a little lavender sugar on a buckwheat crust.</p>
            </div>
          `}
        />
        <Feature
          width="4" align="left" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:48px;line-height:1;margin-bottom:14px">🌽</div>
              <div style="font-family:${SCRIPT};font-size:22px;color:${CRUST};line-height:1">All August</div>
              <h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${COCOA};margin:6px 0 8px">Sweet Corn Cornbread</h3>
              <p style="font-size:14px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0">Stone-ground cornmeal, fresh-cut kernels, brown butter on top. Goes fast.</p>
            </div>
          `}
        />
        <Feature
          width="4" align="left" backgroundColor={CREAM} borderRadius="12"
          padding={{ top: '28', bottom: '28', left: '28', right: '28' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:48px;line-height:1;margin-bottom:14px">🍯</div>
              <div style="font-family:${SCRIPT};font-size:22px;color:${CRUST};line-height:1">Weekends only</div>
              <h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${COCOA};margin:6px 0 8px">Honey Lavender Latte</h3>
              <p style="font-size:14px;line-height:1.6;color:${COCOA};opacity:0.72;margin:0">Local honey, house-made lavender syrup, a double shot. Quietly perfect.</p>
            </div>
          `}
        />
      </ContentSection>

      {/* ===== Contact / Visit ===== */}
      <ContentSection background={CREAM} paddingDesktop={{ top: '96', bottom: '96' }}>
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS};max-width:680px;margin:0 auto 56px">
              ${eyebrow('— Come say hi —')}
              <h2 style="font-family:${SERIF};font-size:50px;line-height:1.1;font-weight:600;color:${COCOA};margin:8px 0 0;letter-spacing:-0.01em">
                Find us on <span style="font-style:italic;color:${CRUST}">the corner</span>
              </h2>
              ${divider()}
            </div>
          `}
        />

        <Feature
          width="4" align="left" backgroundColor="#FFFFFF" borderRadius="14"
          padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:36px;line-height:1;margin-bottom:14px">📍</div>
              <h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${COCOA};margin:0 0 10px">Where</h3>
              <p style="font-size:15px;line-height:1.6;color:${COCOA};opacity:0.78;margin:0">
                412 Linden Avenue<br/>
                Corner of Linden &amp; 4th<br/>
                Portland, OR 97214
              </p>
              <a href="#map" style="display:inline-block;margin-top:14px;color:${CRUST};font-weight:700;font-size:14px;text-decoration:none;border-bottom:1.5px solid ${HONEY};padding-bottom:2px">Get directions →</a>
            </div>
          `}
        />
        <Feature
          width="4" align="left" backgroundColor="#FFFFFF" borderRadius="14"
          padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:36px;line-height:1;margin-bottom:14px">🕰️</div>
              <h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${COCOA};margin:0 0 10px">When</h3>
              <ul style="list-style:none;padding:0;margin:0;font-size:15px;line-height:1.85;color:${COCOA};opacity:0.85">
                <li><strong>Tue–Fri</strong> · 7am – 3pm</li>
                <li><strong>Sat–Sun</strong> · 8am – 3pm</li>
                <li style="opacity:0.6"><strong>Mon</strong> · Closed (we're sleeping)</li>
              </ul>
            </div>
          `}
        />
        <Feature
          width="4" align="left" backgroundColor="#FFFFFF" borderRadius="14"
          padding={{ top: '32', bottom: '32', left: '30', right: '30' }} boxShadow="small"
          text={`
            <div style="font-family:${SANS}">
              <div style="font-size:36px;line-height:1;margin-bottom:14px">✉️</div>
              <h3 style="font-family:${SERIF};font-size:22px;font-weight:600;color:${COCOA};margin:0 0 10px">Get in touch</h3>
              <p style="font-size:15px;line-height:1.7;color:${COCOA};opacity:0.78;margin:0">
                <strong>Cake orders:</strong><br/>
                <a href="mailto:cakes@hearthandhoney.co" style="color:${CRUST};text-decoration:none;border-bottom:1px solid ${HONEY}">cakes@hearthandhoney.co</a><br/><br/>
                <strong>Just to chat:</strong><br/>
                <a href="mailto:hello@hearthandhoney.co" style="color:${CRUST};text-decoration:none;border-bottom:1px solid ${HONEY}">hello@hearthandhoney.co</a>
              </p>
            </div>
          `}
        />
      </ContentSection>

      <SharedFooter brand={brand} />
    </>
  );
}

// ---------- secondary pages (lightweight stubs in the same style) ----------

function GenericPage(opts: {
  brand: string;
  eyebrow: string;
  headingLine1: string;
  headingItalic: string;
  subhead: string;
  bodyHtml?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  return (
    <>
      <SharedHeader brand={opts.brand} />
      <ContentSection background={CREAM} paddingDesktop={{ top: '110', bottom: '90' }}>
        <Text
          align="center"
          width="12"
          text={`
            <div style="font-family:${SANS};max-width:720px;margin:0 auto">
              ${eyebrow(`— ${opts.eyebrow} —`)}
              <h1 style="font-family:${SERIF};font-size:68px;line-height:1.05;font-weight:600;color:${COCOA};margin:8px 0 0;letter-spacing:-0.015em">
                ${opts.headingLine1} <span style="font-style:italic;color:${CRUST}">${opts.headingItalic}</span>
              </h1>
              <p style="max-width:560px;margin:24px auto 0;font-size:18px;line-height:1.65;color:${COCOA};opacity:0.78">
                ${opts.subhead}
              </p>
            </div>
          `}
        />
      </ContentSection>
      {opts.bodyHtml && (
        <ContentSection background="#FFFFFF" paddingDesktop={{ top: '80', bottom: '80' }}>
          <Text
            align="left"
            width="12"
            text={`
              <div style="font-family:${SANS};max-width:720px;margin:0 auto;color:${COCOA};font-size:16px;line-height:1.75">
                ${opts.bodyHtml}
              </div>
            `}
          />
        </ContentSection>
      )}
      {opts.ctaLabel && (
        <ContentSection background={BLUSH} paddingDesktop={{ top: '80', bottom: '80' }}>
          <Text
            align="center"
            width="12"
            text={`
              <div style="font-family:${SANS}">
                <h2 style="font-family:${SERIF};font-size:36px;font-weight:600;color:${COCOA};margin:0">Stop by soon.</h2>
                <div style="margin-top:24px">${ctaButton(opts.ctaLabel, opts.ctaUrl ?? '#', 'primary')}</div>
              </div>
            `}
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
    <GenericPage brand={brand} eyebrow="Our story" headingLine1="A little bakery" headingItalic="with a long memory."
      subhead={`${brand} started in a home oven, moved to a corner storefront, and never quite outgrew its origin.`}
      bodyHtml={`<p>We bake the things we want to eat — slow-fermented breads, honest pastries, small-batch cakes. Mae handles the dough. Theo handles the espresso. The dog handles quality control.</p><p style="margin-top:18px">Most of our flour comes from a mill in Hood River. Our butter comes from a co-op in Tillamook. The honey is from a guy named Pete who lives ten minutes north of the shop. Anything we can't source nearby, we try to source kindly.</p>`}
      ctaLabel="See This Week's Menu" ctaUrl="/page" />
  ),
  page: (brand) => (
    <GenericPage brand={brand} eyebrow="Custom cakes" headingLine1="Made for" headingItalic="your good days."
      subhead="Every cake is built to order — flavor, size, and look. Two weeks' notice is plenty for most things."
      bodyHtml={`<p><strong>How it works:</strong> tell us what you're celebrating, when you need it, and any flavors you love (or can't have). We'll send back a quick proposal with a sketch and a price within two business days.</p><p style="margin-top:18px"><strong>Starting prices</strong> — 6" round (serves 8): $65 · 8" round (serves 16): $95 · 10" round (serves 30): $145 · Tiered cakes start at $250.</p>`}
      ctaLabel="Email Us About a Cake" ctaUrl="mailto:cakes@hearthandhoney.co" />
  ),
  contact: (brand) => (
    <GenericPage brand={brand} eyebrow="Visit" headingLine1="Come find" headingItalic="the corner shop."
      subhead="412 Linden Avenue, Portland · Tues–Sun, 7am–3pm. Pull a chair up to the window."
      bodyHtml={`<p><strong>Cake orders &amp; private events:</strong> cakes@hearthandhoney.co</p><p style="margin-top:14px"><strong>Press, partnerships, just to chat:</strong> hello@hearthandhoney.co</p><p style="margin-top:14px"><strong>Phone:</strong> (503) 555-0142 — we're terrible at answering during the morning rush, so email is faster.</p>`}
      ctaLabel="Get Directions" ctaUrl="#map" />
  ),
  blog: (brand) => (
    <GenericPage brand={brand} eyebrow="The journal" headingLine1="Notes from" headingItalic="behind the counter."
      subhead="Recipes, seasonal updates, and the occasional small-business essay."
      bodyHtml={`<p style="background:${BLUSH};border-left:3px solid ${HONEY};padding:16px 20px;color:${COCOA};font-size:15px;line-height:1.6;border-radius:6px"><strong>Kajabi note:</strong> the real post list renders here automatically. The header above and footer below act as page chrome.</p>`}
      ctaLabel="Subscribe to the Letter" ctaUrl="#subscribe" />
  ),
  blog_post: (brand) => (
    <GenericPage brand={brand} eyebrow="Essay" headingLine1="On the slow" headingItalic="art of sourdough."
      subhead="Why three days of waiting makes a better loaf — and what we learned the hard way."
      bodyHtml={`<p style="background:${BLUSH};border-left:3px solid ${HONEY};padding:16px 20px;color:${COCOA};font-size:15px;line-height:1.6;border-radius:6px"><strong>Kajabi note:</strong> Kajabi renders the actual post body here. Use this template for chrome (related posts, author byline, subscribe CTA).</p>`}
      ctaLabel="Read More Essays" ctaUrl="/blog" />
  ),
  thank_you: (brand) => (
    <GenericPage brand={brand} eyebrow="Thank you" headingLine1="We've got" headingItalic="your message."
      subhead="We'll write back within a day or two. In the meantime, the croissants are warm."
      ctaLabel="Back to the Bakery" ctaUrl="/" />
  ),
  '404': (brand) => (
    <GenericPage brand={brand} eyebrow="Hmm" headingLine1="That page" headingItalic="went out the window."
      subhead="Maybe it sold out. Maybe it never existed. Either way — let's get you back to something good."
      ctaLabel="Back to the Bakery" ctaUrl="/" />
  ),
};

const ALL_PAGES: PageKey[] = ['index', 'about', 'page', 'contact', 'blog', 'blog_post', 'thank_you', '404'];

export const builderProTemplate: TemplateDef = {
  id: 'builder-pro',
  label: 'Builder Pro — Hearth & Honey',
  description: 'Cozy neighborhood bakery — warm earthy palette, handcrafted feel, full 8-page site.',
  pageKeys: ALL_PAGES,
  fonts: { heading: 'Fraunces', body: 'Nunito Sans', extras: ['Caveat'] },
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
