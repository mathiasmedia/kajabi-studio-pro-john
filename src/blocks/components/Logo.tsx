/**
 * <Logo> block — Kajabi `logo` type.
 */
import type { BlockComponent } from '../types';
import { getBlockChromeStyle, type ChromeProps } from '../blockChrome';

export interface LogoProps extends ChromeProps {
  type?: 'image' | 'text';
  imageUrl?: string;
  imageAlt?: string;
  text?: string;
  textColor?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  logoType?: 'image' | 'text';
  logoText?: string;
  logoTextColor?: string;
  logo?: string;
  logo_text?: string;
  logo_type?: 'image' | 'text';
  logo_text_color?: string;
}

export const Logo: BlockComponent<LogoProps> = (props) => {
  const text = props.text ?? props.logoText ?? props.logo_text;
  const type = props.type ?? props.logoType ?? props.logo_type;
  const textColor = props.textColor ?? props.logoTextColor ?? props.logo_text_color;
  const imageUrl = props.imageUrl ?? props.logo;

  const align = props.align ?? 'left';
  const justifyContent =
    align === 'left' ? 'flex-start' :
    align === 'right' ? 'flex-end' : 'center';
  const chrome = getBlockChromeStyle(props);
  const isText = type === 'text' || !imageUrl;
  return (
    <div style={{ display: 'flex', justifyContent, padding: '8px 0', ...chrome }}>
      {isText ? (
        <span style={{ fontWeight: 700, fontSize: '1.4em', color: textColor || 'inherit' }}>
          {text || 'Brand'}
        </span>
      ) : (
        <img
          src={imageUrl}
          alt={props.imageAlt ?? text ?? ''}
          style={{ width: props.width ? `${props.width}px` : 'auto', maxWidth: 200 }}
        />
      )}
    </div>
  );
};

Logo.kajabiType = 'logo';
Logo.allowedIn = ['header', 'footer'];
Logo.serialize = (p) => {
  const text = p.text ?? p.logoText ?? p.logo_text;
  const type = p.type ?? p.logoType ?? p.logo_type;
  const textColor = p.textColor ?? p.logoTextColor ?? p.logo_text_color;
  const imageUrl = p.imageUrl ?? p.logo;
  return {
    logo: imageUrl ?? '',
    logo_text: text ?? '',
    logo_type: type ?? (imageUrl ? 'image' : 'text'),
    logo_width: p.width ?? '50',
    logo_text_color: textColor ?? '',
    image_alt: p.imageAlt ?? '',
  };
};
