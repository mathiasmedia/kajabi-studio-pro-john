/**
 * <Feature> block — Kajabi `feature` type.
 */
import type { BlockComponent } from '../types';
import { withBlockDefaults } from '../blockDefaults';
import { getBlockChromeStyle, serializeChromeProps, type ChromeProps } from '../blockChrome';

export interface FeatureProps extends ChromeProps {
  text: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: string;
  imageBorderRadius?: string;
  hideImage?: boolean;
  imageHref?: string;
  newTabImage?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  buttonTextColor?: string;
  buttonBackgroundColor?: string;
  buttonBorderRadius?: string;
  buttonStyle?: 'solid' | 'outline' | 'text';
  buttonSize?: 'small' | 'medium' | 'large';
  buttonWidth?: 'auto' | 'full';
  newTab?: boolean;
}

export const Feature: BlockComponent<FeatureProps> = (props) => {
  const align = props.align ?? 'center';
  const chrome = getBlockChromeStyle(props);
  const hasExplicitImageWidth = !!props.imageWidth;
  const imageStyle = hasExplicitImageWidth
    ? { width: '100%', maxWidth: `${props.imageWidth}px` }
    : { width: '80px', maxWidth: '100%' };
  return (
    <div style={{ textAlign: align, padding: '16px 0', ...chrome }}>
      {!props.hideImage && props.image && (
        <img
          src={props.image}
          alt={props.imageAlt ?? ''}
          style={{
            ...imageStyle,
            height: 'auto',
            display: 'block',
            borderRadius: props.imageBorderRadius ? `${props.imageBorderRadius}px` : undefined,
            marginBottom: 12,
          }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: props.text }} />
      {props.showButton && props.buttonText && (() => {
        const style = props.buttonStyle ?? 'solid';
        const isOutline = style === 'outline';
        const isText = style === 'text';
        const sizePad =
          props.buttonSize === 'small' ? '8px 16px' :
          props.buttonSize === 'large' ? '14px 28px' :
          '10px 20px';
        const textBtnColor =
          props.buttonBackgroundColor || props.buttonTextColor || 'currentColor';
        return (
          <a
            className={`btn btn--${style} btn--${props.buttonSize ?? 'medium'}`}
            href={props.buttonUrl || '#'}
            target={props.newTab ? '_blank' : undefined}
            rel={props.newTab ? 'noopener noreferrer' : undefined}
            style={{
              display: 'inline-block',
              marginTop: 12,
              padding: isText ? '0' : sizePad,
              color: isText
                ? textBtnColor
                : props.buttonTextColor || (isOutline ? 'currentColor' : '#fff'),
              backgroundColor: isText || isOutline ? 'transparent' : (props.buttonBackgroundColor || '#3B82F6'),
              border: isText
                ? 'none'
                : isOutline
                  ? `2px solid ${props.buttonBackgroundColor || props.buttonTextColor || 'currentColor'}`
                  : 'none',
              borderRadius: isText ? 0 : (props.buttonBorderRadius ? `${props.buttonBorderRadius}px` : 4),
              textDecoration: 'none',
              width: props.buttonWidth === 'full' ? '100%' : 'auto',
            }}
          >
            {props.buttonText}
          </a>
        );
      })()}
    </div>
  );
};

Feature.kajabiType = 'feature';
Feature.allowedIn = ['content'];
Feature.serialize = (p) => withBlockDefaults({
  text: p.text ?? '',
  width: p.width ?? '4',
  text_align: p.align ?? 'center',
  ...serializeChromeProps(p),
  background_color: p.backgroundColor ?? '',
  border_radius: p.borderRadius != null ? String(p.borderRadius) : '',
  box_shadow: p.boxShadow === 'small' || p.boxShadow === 'medium' || p.boxShadow === 'large' ? p.boxShadow : 'none',
  image: p.image ?? '',
  image_alt: p.imageAlt ?? '',
  image_width: p.imageWidth ?? '',
  image_border_radius: p.imageBorderRadius ?? '',
  hide_image: p.hideImage === false ? 'false' : (p.image ? 'false' : 'true'),
  img_action: p.imageHref ?? '',
  new_tab_image: p.newTabImage ? 'true' : 'false',
  use_btn: p.showButton ? 'true' : 'false',
  btn_text: p.buttonText ?? '',
  btn_action: p.buttonUrl ?? '',
  btn_text_color: p.buttonTextColor ?? '',
  btn_background_color: p.buttonBackgroundColor ?? '',
  btn_border_radius: p.buttonBorderRadius ?? '',
  btn_style: p.buttonStyle ?? 'solid',
  btn_size: p.buttonSize ?? 'medium',
  btn_width: p.buttonWidth ?? 'auto',
  new_tab: p.newTab ? 'true' : 'false',
});
