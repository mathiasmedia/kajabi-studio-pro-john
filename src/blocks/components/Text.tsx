/**
 * <Text> block — Kajabi `text` type.
 */
import type { BlockComponent } from '../types';
import { withBlockDefaults } from '../blockDefaults';
import { getBlockChromeStyle, serializeChromeProps, type ChromeProps } from '../blockChrome';

export interface TextProps extends ChromeProps {
  text: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  buttonTextColor?: string;
  buttonBackgroundColor?: string;
  buttonBorderRadius?: string;
  buttonStyle?: 'solid' | 'outline';
  buttonSize?: 'small' | 'medium' | 'large';
  buttonWidth?: 'auto' | 'full';
  newTab?: boolean;
}

export const Text: BlockComponent<TextProps> = (props) => {
  const align = props.align ?? 'center';
  const chrome = getBlockChromeStyle(props);
  return (
    <div style={{ textAlign: align, padding: '12px 0', ...chrome }}>
      <div dangerouslySetInnerHTML={{ __html: props.text }} />
      {props.showButton && props.buttonText && (
        <a
          href={props.buttonUrl || '#'}
          target={props.newTab ? '_blank' : undefined}
          rel={props.newTab ? 'noopener noreferrer' : undefined}
          style={{
            display: 'inline-block',
            marginTop: 16,
            padding: '12px 24px',
            color: props.buttonTextColor || '#fff',
            backgroundColor: props.buttonBackgroundColor || '#3B82F6',
            borderRadius: props.buttonBorderRadius ? `${props.buttonBorderRadius}px` : 4,
            textDecoration: 'none',
          }}
        >
          {props.buttonText}
        </a>
      )}
    </div>
  );
};

Text.kajabiType = 'text';
Text.allowedIn = ['content'];
Text.serialize = (p) => withBlockDefaults({
  text: p.text ?? '',
  width: p.width ?? '12',
  text_align: p.align ?? 'center',
  ...serializeChromeProps(p),
  background_color: p.backgroundColor ?? '',
  border_radius: p.borderRadius != null ? String(p.borderRadius) : '',
  box_shadow: p.boxShadow === 'small' || p.boxShadow === 'medium' || p.boxShadow === 'large' ? p.boxShadow : 'none',
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
