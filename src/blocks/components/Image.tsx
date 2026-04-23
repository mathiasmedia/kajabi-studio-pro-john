/**
 * <Image> block — Kajabi `image` type.
 *
 * Real Kajabi schema (from block_image.liquid):
 *   image, image_alt, image_width, image_border_radius,
 *   image_align_desktop, image_align_mobile, image_caption,
 *   img_action, new_tab, overlay_text, enable_overlay,
 *   overlay_background_color, overlay_text_color,
 *   image_first, gallery, always_show_on_mobile
 *
 * Universal chrome flows in via ChromeProps. Note the `image_border_radius`
 * Kajabi field maps to `imageBorderRadius` on the IMAGE itself, while the
 * universal `border_radius` (chrome) maps to the wrapper's borderRadius —
 * Kajabi treats them as two distinct fields.
 */
import type { BlockComponent } from '../types';
import { withBlockDefaults } from '../blockDefaults';
import { getBlockChromeStyle, serializeChromeProps, type ChromeProps } from '../blockChrome';

export interface ImageProps extends ChromeProps {
  src: string;
  alt?: string;
  /** Optional click-through URL → maps to img_action */
  href?: string;
  /** Width in pixels */
  width?: string;
  /** Bootstrap col 1-12 (block container width) */
  colWidth?: string;
  /** Corner radius applied to the IMAGE itself (Kajabi `image_border_radius`). */
  imageBorderRadius?: string;
  caption?: string;
  align?: 'left' | 'center' | 'right';
  overlayText?: string;
  enableOverlay?: boolean;
  overlayBackgroundColor?: string;
  overlayTextColor?: string;
  newTab?: boolean;
}

export const Image: BlockComponent<ImageProps> = (props) => {
  const align = props.align ?? 'center';
  const justifyContent =
    align === 'left' ? 'flex-start' :
    align === 'right' ? 'flex-end' : 'center';
  const chrome = getBlockChromeStyle(props);
  const img = (
    <img
      src={props.src}
      alt={props.alt ?? ''}
      style={{
        maxWidth: props.width ? `${props.width}px` : '100%',
        borderRadius: props.imageBorderRadius ? `${props.imageBorderRadius}px` : undefined,
        display: 'block',
      }}
    />
  );
  return (
    <div style={{ display: 'flex', justifyContent, padding: '12px 0', flexDirection: 'column', alignItems: justifyContent === 'center' ? 'center' : 'stretch', ...chrome }}>
      <div style={{ position: 'relative' }}>
        {props.href ? (
          <a
            href={props.href}
            target={props.newTab ? '_blank' : undefined}
            rel={props.newTab ? 'noopener noreferrer' : undefined}
          >
            {img}
          </a>
        ) : img}
        {props.enableOverlay && props.overlayText && (
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: props.overlayBackgroundColor || 'rgba(0,0,0,0.4)',
              color: props.overlayTextColor || '#fff',
            }}
          >
            {props.overlayText}
          </div>
        )}
      </div>
      {props.caption && (
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6, textAlign: align }}>
          {props.caption}
        </div>
      )}
    </div>
  );
};

Image.kajabiType = 'image';
Image.allowedIn = ['content'];
Image.serialize = (p) => {
  // Map our 'left'/'center'/'right' align to Kajabi's flex-start/center/flex-end.
  const flexAlign =
    p.align === 'left' ? 'flex-start' :
    p.align === 'right' ? 'flex-end' : 'center';
  const base = withBlockDefaults({
    width: p.colWidth ?? '10',
    text_align: p.align ?? 'center',
    ...serializeChromeProps(p),
    image: p.src ?? '',
    image_alt: p.alt ?? '',
    image_width: p.width ?? '',
    image_border_radius: p.imageBorderRadius ?? '',
    image_align_desktop: flexAlign,
    image_align_mobile: flexAlign,
    image_caption: p.caption ?? '',
    img_action: p.href ?? '',
    new_tab: p.newTab ? 'true' : 'false',
    gallery: 'false',
    image_first: 'false',
    always_show_on_mobile: 'false',
    enable_overlay: p.enableOverlay ? 'true' : 'false',
    overlay_text: p.overlayText ?? '',
    overlay_background_color: p.overlayBackgroundColor ?? '',
    overlay_text_color: p.overlayTextColor ?? '',
  });
  // image schema has no `text_align`; strip the default injected by withBlockDefaults.
  delete (base as Record<string, unknown>).text_align;
  return base;
};
