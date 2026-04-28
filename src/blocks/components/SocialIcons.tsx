/**
 * <SocialIcons> block — Kajabi `social_icons` type.
 */
import type { BlockComponent } from '../types';

export interface SocialIconsProps {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
  pinterest?: string;
  vimeo?: string;
  github?: string;
  medium?: string;
  spotify?: string;
  soundcloud?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  backgroundStyle?: 'none' | 'square' | 'circle';
  newTab?: boolean;
  align?: 'left' | 'center' | 'right';
  iconColor?: string;
}

const ICON_LABELS: Record<string, string> = {
  facebook: 'fb', twitter: 'tw', instagram: 'ig',
  youtube: 'yt', linkedin: 'in', tiktok: 'tt', pinterest: 'pn',
  vimeo: 'vm', github: 'gh', medium: 'md', spotify: 'sp', soundcloud: 'sc',
};

const SIZE_PX: Record<string, number> = { small: 22, medium: 28, large: 36 };

const DEFAULT_URLS: Record<string, string> = {
  twitter: 'https://twitter.com/',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/',
  youtube: 'https://youtube.com/',
};

const ALL_PLATFORMS = [
  'facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'tiktok',
  'pinterest', 'vimeo', 'github', 'medium', 'spotify', 'soundcloud',
] as const;

function resolveUrl(props: SocialIconsProps, platform: string): string {
  const explicit = (props as Record<string, unknown>)[platform];
  if (typeof explicit === 'string') return explicit;
  return DEFAULT_URLS[platform] ?? '';
}

export const SocialIcons: BlockComponent<SocialIconsProps> = (props) => {
  const align = props.align ?? 'center';
  const sizePx = SIZE_PX[props.size ?? 'medium'];
  const bgStyle = props.backgroundStyle ?? 'circle';
  return (
    <div style={{ textAlign: align, padding: '8px 0' }}>
      {ALL_PLATFORMS.map((p) => {
        const url = resolveUrl(props, p);
        if (!url) return null;
        return (
          <a
            key={p}
            href={url}
            target={props.newTab !== false ? '_blank' : undefined}
            rel={props.newTab !== false ? 'noopener' : undefined}
            style={{
              display: 'inline-block',
              margin: '0 6px',
              padding: 6,
              color: props.iconColor || '#666',
              backgroundColor: bgStyle === 'none' ? 'transparent' : (props.backgroundColor || 'rgba(255,255,255,0.1)'),
              border: bgStyle === 'none' ? '1px solid currentColor' : 'none',
              borderRadius: bgStyle === 'circle' ? '50%' : bgStyle === 'square' ? 4 : 0,
              width: sizePx, height: sizePx,
              fontSize: 11,
              textAlign: 'center',
              lineHeight: `${sizePx - 12}px`,
              textDecoration: 'none',
            }}
          >
            {ICON_LABELS[p] ?? p.slice(0, 2)}
          </a>
        );
      })}
    </div>
  );
};

SocialIcons.kajabiType = 'social_icons';
SocialIcons.allowedIn = ['header', 'content', 'footer'];
SocialIcons.serialize = (p) => {
  const out: Record<string, unknown> = {
    social_icon_size: p.size ?? 'medium',
    social_icons_background_color: p.backgroundColor ?? '',
    social_icon_background_style: p.backgroundStyle ?? 'circle',
    new_tab: p.newTab !== false ? 'true' : 'false',
  };
  for (const platform of ALL_PLATFORMS) {
    const url = resolveUrl(p, platform);
    if (url) out[`social_icon_link_${platform}`] = url;
  }
  return out;
};
