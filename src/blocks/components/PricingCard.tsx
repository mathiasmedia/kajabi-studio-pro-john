/**
 * <PricingCard> block — Kajabi `pricing` type.
 */
import type { BlockComponent } from '../types';
import { withBlockDefaults } from '../blockDefaults';
import { getBlockChromeStyle, serializeChromeProps, type ChromeProps } from '../blockChrome';

export interface PricingCardProps extends ChromeProps {
  heading: string;
  name?: string;
  price: string;
  priceCaption?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  showImage?: boolean;
  priceColor?: string;
  priceNameColor?: string;
  width?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  badgeText?: string;
  highlight?: boolean;
  brandColor?: string;
}

function decorateFeatureList(html: string, brand: string, ink: string): string {
  if (!html || !/<li[\s>]/i.test(html)) return html;
  const check = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${brand}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const chip = `<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:999px;background:${brand}1A;flex-shrink:0;margin-top:2px">${check}</span>`;
  return html
    .replace(/<ul([^>]*)>/gi, `<ul style="list-style:none;padding:0;margin:0;text-align:left;display:flex;flex-direction:column;gap:14px">`)
    .replace(/<li([^>]*)>/gi, `<li style="display:flex;align-items:flex-start;gap:12px;color:${ink};font-size:15px;line-height:1.5;font-weight:450">${chip}<span style="flex:1">`)
    .replace(/<\/li>/gi, `</span></li>`);
}

export const PricingCard: BlockComponent<PricingCardProps> = (props) => {
  const brand = props.brandColor || '#3B82F6';
  const isHighlighted = !!props.highlight;
  const chrome = getBlockChromeStyle(props) ?? {};

  const surface = chrome.backgroundColor ?? '#FFFFFF';
  const ink = '#111111';
  const muted = '#6B6B6B';

  const baseShadow = isHighlighted
    ? `0 24px 60px -16px ${brand}40, 0 8px 20px -8px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.04)`
    : `0 12px 28px -12px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)`;

  const style = {
    position: 'relative' as const,
    border: isHighlighted ? `1.5px solid ${brand}` : '1px solid rgba(0,0,0,0.06)',
    borderRadius: 24,
    padding: '44px 36px 36px',
    margin: '12px 0',
    backgroundColor: surface,
    boxShadow: baseShadow,
    transform: isHighlighted ? 'translateY(-10px)' : undefined,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden' as const,
    ...chrome,
  };

  const decoratedText = props.text ? decorateFeatureList(props.text, brand, ink) : '';

  return (
    <div style={style}>
      {isHighlighted && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
            background: `linear-gradient(90deg, ${brand}, ${brand}CC)`,
          }}
        />
      )}

      {props.badgeText && (
        <div
          style={{
            position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
            backgroundColor: brand, color: '#fff',
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '7px 18px', borderRadius: '0 0 12px 12px',
            boxShadow: `0 4px 12px ${brand}40`, whiteSpace: 'nowrap',
          }}
        >
          {props.badgeText}
        </div>
      )}

      {props.showImage && props.image && (
        <img
          src={props.image}
          alt={props.imageAlt ?? ''}
          style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 16, marginBottom: 20 }}
        />
      )}

      <div style={{ textAlign: 'center', marginBottom: 28, marginTop: props.badgeText ? 16 : 0 }}>
        {props.name && (
          <div
            style={{
              color: props.priceNameColor || brand,
              fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', marginBottom: 14,
            }}
          >
            {props.name}
          </div>
        )}
        <h3 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 600, color: ink, lineHeight: 1.2, letterSpacing: '-0.005em' }}>
          {props.heading}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: props.priceColor || ink, letterSpacing: '-0.025em' }}>
            {props.price}
          </div>
        </div>
        {props.priceCaption && (
          <div style={{ marginTop: 10, fontSize: 13, color: muted, fontWeight: 500 }}>
            {props.priceCaption}
          </div>
        )}
      </div>

      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(0,0,0,0.10), transparent)`, margin: '0 0 28px' }} />

      {decoratedText && (
        <div style={{ marginBottom: 32, flex: 1 }} dangerouslySetInnerHTML={{ __html: decoratedText }} />
      )}

      {props.buttonText && (
        <a
          className="btn btn--solid btn--medium"
          href={props.buttonUrl || '#'}
          style={{
            display: 'block', textAlign: 'center', padding: '16px 24px',
            backgroundColor: props.buttonBackgroundColor || brand,
            color: props.buttonTextColor || '#fff',
            borderRadius: 999, textDecoration: 'none',
            fontWeight: 600, fontSize: 15, letterSpacing: '0.01em',
            boxShadow: isHighlighted
              ? `0 10px 24px ${(props.buttonBackgroundColor || brand)}55`
              : `0 6px 16px ${(props.buttonBackgroundColor || brand)}33`,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          {props.buttonText}
        </a>
      )}
      {props.secondaryButtonText && (
        <a
          href={props.secondaryButtonUrl || '#'}
          style={{
            display: 'block', textAlign: 'center', marginTop: 14,
            color: muted, textDecoration: 'underline', textUnderlineOffset: 4,
            fontSize: 14, fontWeight: 500,
          }}
        >
          {props.secondaryButtonText}
        </a>
      )}
    </div>
  );
};

PricingCard.kajabiType = 'pricing';
PricingCard.allowedIn = ['content'];
PricingCard.serialize = (p) => {
  const name = p.badgeText ? p.badgeText : (p.name ?? '');
  const brand = p.brandColor ?? '';
  const priceColor = p.priceColor ?? brand;
  const priceNameColor = p.priceNameColor ?? brand;
  const btnBg = p.buttonBackgroundColor ?? brand;
  const background = p.backgroundColor ?? '#FFFFFF';
  let text = p.text ?? '';
  if (p.priceCaption) {
    const caption = `<p style="text-align:center;margin:0 0 16px;font-size:13px;color:#6B6B6B">${p.priceCaption}</p>`;
    text = caption + text;
  }
  return withBlockDefaults({
    width: p.width ?? '4',
    text_align: 'center',
    ...serializeChromeProps(p),
    heading: p.heading ?? '',
    name,
    price: p.price ?? '',
    text,
    image: p.image ?? '',
    image_alt: p.imageAlt ?? '',
    show_image: p.showImage && p.image ? 'true' : 'false',
    price_color: priceColor,
    price_name_color: priceNameColor,
    show_cta: p.buttonText ? 'true' : 'false',
    btn_text: p.buttonText ?? '',
    btn_action: p.buttonUrl ?? '',
    btn_background_color: btnBg,
    btn_text_color: p.buttonTextColor ?? '',
    show_secondary_cta: p.secondaryButtonText ? 'true' : 'false',
    secondary_btn_text: p.secondaryButtonText ?? '',
    secondary_btn_action: p.secondaryButtonUrl ?? '',
    background_color: background,
    border_radius: p.borderRadius != null ? String(p.borderRadius) : '24',
    box_shadow: p.boxShadow === 'small' || p.boxShadow === 'medium' || p.boxShadow === 'large' ? p.boxShadow : 'medium',
  });
};
